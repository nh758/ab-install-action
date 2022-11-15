const assert = require("assert");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const fakeExec = sinon.fake.resolves("");
const fakeWait = sinon.fake.resolves("");

const stackDeploy = proxyquire("../src/stackDeploy", {
   "@actions/exec": { exec: fakeExec },
   "./util/waitService.js": { waitServiceUp: fakeWait },
});

beforeEach(() => {
   fakeExec.resetHistory();
});

describe("rebuild services", () => {
   it("calls exec", async () => {
      await stackDeploy("AppBuilder", "ab");
      assert.equal(fakeExec.callCount, 2);
      const [firstExec, secondExec] = fakeExec.args;
      assert.equal(firstExec[0], "docker stack deploy");
      assert.deepEqual(firstExec[1], [
         "-c",
         "docker-compose.yml",
         "-c",
         "docker-compose.override.yml",
         "-c",
         "./test/setup/ci-test.overide.yml",
         "ab",
      ]);
      assert.equal(firstExec[2].cwd, "./AppBuilder");
      assert.equal(secondExec[0], "docker stack services");
      assert.deepEqual(secondExec[1], ["ab"]);
   });
});
