const core = require("@actions/core");
const installAb = require("./src/installAb");
const checkRepo = require("./src/checkRepo");
const rebuildService = require("./src/rebuildService");

// most @actions toolkit packages have async methods
async function run() {
   try {
      await installAb();
      const repo = checkRepo();
      if (repo.type == "service") {
         rebuildService(repo.name);
      }
   } catch (error) {
      core.setFailed(error.message);
   }
}

run();
