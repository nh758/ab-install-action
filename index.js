const core = require("@actions/core");
const installAb = require("./src/installAb");
const checkRepo = require("./src/checkRepo");
const rebuildService = require("./src/rebuildService");
const abServices = [
   // {const} services that include AppBuider Platform Service Repo
   "ab_service_appbuilder",
   "ab_service_custom_reports",
   "ab_service_definition_manager",
   "ab_service_file_processor",
   "ab_service_process_manager",
   "ab_service_user_manager",
];

// most @actions toolkit packages have async methods
async function run() {
   try {
      await installAb();
      const repo = checkRepo();
      switch (repo.type) {
         case "service":
            await rebuildService([repo.name]);
            break;
         case "appbuilder":
            await rebuildService(abServices);
            break;
         case "core":
            await rebuildService(["ab_service_web", ...abServices]);
            break;
         default:
      }
   } catch (error) {
      core.setFailed(error.message);
   }
}

run();
