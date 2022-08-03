const core = require("@actions/core");

function checkRepo() {
   const [org, repo] = core.getInput("repository").split("/");
   core.info("input", core.getInput("repository"));
   // console.log("repo", repo);
   if (org == "digi-serve") {
      if (repo.includes("ab_service_")) {
         return { type: "service", name: repo };
      }
      if (repo == "appbuilder_platform_service") {
         return { type: "appbuilder", name: repo };
      }
      if (repo == "appbuilder_class_core") {
         return { type: "core", name: repo };
      }
      if (repo == "ab_platform_web") {
         return { type: "platorm_web", name: repo };
      }
   }
   return { type: "n/a" };
}
module.exports = checkRepo;
