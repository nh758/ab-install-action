const core = require("@actions/core");

function checkRepo() {
   const [org, repo] = core.getInput("repository").split("/");
   console.log("input", core.getInput("repository"));
   // console.log("repo", repo);
   if (org == "digi-serve") {
      if (repo.includes("ab_service_")) {
         return { type: "service", name: repo };
      }
   }
   return { type: "n/a" };
}
module.exports = checkRepo;
