const core = require("@actions/core");
const exec = require("@actions/exec");
const yaml = require("js-yaml");
const fs = require("fs");
const stackDeploy = require("./stackDeploy.js");

async function rebuildService(repos) {
   // build the overrideFile
   const override = {
      version: "3.2",
      services: {},
   };

   const folder = core.getInput("folder") || "AppBuilder";
   const stack = core.getInput("stack") || "ab";
   await repos.forEach(async (repo) => {
      core.startGroup(`Docker Build ${repo}:test`);
      await exec.exec(`docker build -t ${repo}:test .`, [], {
         cwd: `./${repo}`,
      });

      const shortName = repo.replace("ab_service_", "");

      override.services[shortName] = {
         image: `${repo}:test`,
      };

      core.endGroup();
   });
   fs.writeFileSync(`./${folder}/compose.override.yml`, yaml.dump(override));

   await stackDeploy(folder, stack);
}
module.exports = rebuildService;
