const assert = require("assert");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const fakeExec = sinon.fake.resolves("");

const rebuildService = proxyquire("../src/rebuildService", {
   "@actions/exec": { exec: fakeExec },
   // "@actions/core": { info: sinon.stub() },
});

beforeEach(() => {
   delete process.env["INPUT_SHA"];
   // delete process.env["INPUT_FOLDER"];
   // delete process.env["INPUT_PORT"];
   // delete process.env["INPUT_RUNTIME"];
   fakeExec.resetHistory();
});

describe("rebuild calls exec", () => {
   it("passes the correct args", async () => {
      await rebuildService("ab_service_user_manager");
      assert.equal(fakeExec.callCount, 3);
      const [firstCall, secondCall, thirdCall] = fakeExec.args;
      assert.equal(
         firstCall[0],
         "git clone https://github.com/digi-serve/ab_service_user_manager.git"
      );
      assert.equal(firstCall[2].cwd, "./AppBuilder");
      assert.equal(secondCall[2].cwd, "./AppBuilder/ab_service_user_manager");
      assert.equal(thirdCall[0], "git checkout ");
      assert.equal(thirdCall[2].cwd, "./AppBuilder/ab_service_user_manager");
   });
   it("reads sha", async () => {
      process.env["INPUT_SHA"] = "1234567890";
      await rebuildService("ab_service_user_manager");
      assert.equal(fakeExec.callCount, 3);
      const [, , thirdCall] = fakeExec.args;
      assert.equal(thirdCall[0], "git checkout 1234567890");
   });
   // assert.equal(fakeExec.callCount, 3);
   // assert.equal(fakeExec.args[0], [
   //    `git clone https://github.com/digi-serve/ab_service_user_manager.git`,
   //    [],
   //    {
   //       cwd: ".ab",
   //    },
   // ]);
});
