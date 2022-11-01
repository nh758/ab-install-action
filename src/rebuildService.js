const core = require("@actions/core");
const exec = require("@actions/exec");
const yaml = require("js-yaml");
const fs = require("fs");
const stackDeploy = require("./stackDeploy.js");

async function rebuildService(repos) {
   // build the overrideFile
   const override = {
      version: "3.9",
      services: {},
   };
   core.startGroup(`Rebuilding Docker Images`);
   core.info(`\u001b[35m  ${repos.join(":test\n  ")}:test`);
   const folder = core.getInput("folder") || "AppBuilder";
   const stack = core.getInput("stack") || "ab";
   const builds = [];
   repos.forEach(async (repo) => {
      const build = exec.exec(`docker build -t ${repo}:test .`, [], {
         cwd: `./${repo}`,
      });
      builds.push(build);
      const shortName = repo.replace("ab_service_", "");

      override.services[shortName] = {
         image: `${repo}:test`,
      };
   });
   await Promise.all(builds);

   fs.writeFileSync(`./${folder}/compose.override.yml`, yaml.dump(override));

   await stackDeploy(folder, stack);
}
module.exports = rebuildService;
