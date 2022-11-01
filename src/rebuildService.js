const core = require("@actions/core");
const exec = require("@actions/exec");
const stackDeploy = require("./stackDeploy.js");

async function rebuildService(repos) {
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
   });
   await Promise.all(builds);

   await stackDeploy(folder, stack, repos);
}
module.exports = rebuildService;
