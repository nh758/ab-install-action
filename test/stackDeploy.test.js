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

describe("stackDeploy", () => {
   it("calls exec", async () => {
      await stackDeploy("AppBuilder", "ab");
      assert.equal(fakeExec.callCount, 3);
      const [, secondExec, thirdExec] = fakeExec.args;
      assert.equal(secondExec[0], "env-cmd docker stack deploy");
      assert.deepEqual(secondExec[1], [
         "-c",
         "docker-compose.yml",
         "-c",
         "docker-compose.override.yml",
         "-c",
         "./test/setup/ci-test.overide.yml",
         "ab",
      ]);
      assert.equal(secondExec[2].cwd, "./AppBuilder");
      assert.equal(thirdExec[0], "docker stack services");
      assert.deepEqual(thirdExec[1], ["ab"]);
   });
});
