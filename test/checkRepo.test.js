const assert = require("assert");
// const sinon = require("sinon");
const checkRepo = require("../src/checkRepo");

beforeEach(() => {
   delete process.env["INPUT_REPOSITORY"];
});

describe("Check Repo", () => {
   it("finds ab_service", () => {
      process.env["INPUT_REPOSITORY"] = "digi-serve/ab_service_user_manager";
      const repo = checkRepo();
      assert.equal(repo.type, "service");
      assert.equal(repo.name, "ab_service_user_manager");
   });
   it("not from ds", () => {
      process.env["INPUT_REPOSITORY"] = "random_org/ab_service_user_manager";
      const repo = checkRepo();
      assert.equal(repo.type, "n/a");
   });
   it("not ab_service", () => {
      process.env["INPUT_REPOSITORY"] = "digi-serve/ab-cli";
      const repo = checkRepo();
      assert.equal(repo.type, "n/a");
   });
});
