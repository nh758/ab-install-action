const assert = require("assert");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const fakeExec = sinon.fake.resolves("");
const fakeFs = sinon.fake();
const fakeStackDeploy = sinon.fake();
const fakeYaml = sinon.fake();
const rebuildService = proxyquire("../src/rebuildService", {
   "@actions/exec": { exec: fakeExec },
   fs: { writeFileSync: fakeFs },
   "./stackDeploy.js": fakeStackDeploy,
   "js-yaml": { dump: fakeYaml },
});

beforeEach(() => {
   fakeExec.resetHistory();
   fakeFs.resetHistory();
   fakeStackDeploy.resetHistory();
   fakeYaml.resetHistory();
});

describe("rebuild services", () => {
   it("calls exec", async () => {
      await rebuildService(["ab_service_user_manager"]);
      assert(fakeExec.callCount >= 1);
      const [[command, , options]] = fakeExec.args;
      assert.equal(command, "docker build -t ab_service_user_manager:test .");
      assert.equal(options.cwd, "./ab_service_user_manager");
   });
   it("calls stackDeploy", async () => {
      await rebuildService(["ab_service_user_manager"]);
      assert.equal(fakeStackDeploy.callCount, 1);
      const [[folder, stack]] = fakeStackDeploy.args;
      assert.equal(folder, "AppBuilder");
      assert.equal(stack, "ab");
   });
});
