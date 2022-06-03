const core = require("@actions/core");
const exec = require("@actions/exec");
const yaml = require("js-yaml");
const fs = require("fs");
const stackDeploy = require("./stackDeploy.js");

async function rebuildService(repo) {
   const folder = core.getInput("folder") || "AppBuilder";
   const stack = core.getInput("stack") || "ab";

   core.startGroup(`Docker Build ${repo}:test`);
   await exec.exec(`docker build -t ${repo}:test .`, [], {
      cwd: `./${repo}`,
   });

   const shortName = repo.replace("ab_service_", "");

   // build the overrideFile
   const override = {
      version: "3.2",
      services: {},
   };
   override.services[shortName] = {
      image: `${repo}:test`,
   };
   fs.writeFileSync(`./${folder}/compose.override.yml`, yaml.dump(override));

   await stackDeploy(folder, stack);
}
module.exports = rebuildService;
