const core = require("@actions/core");
const installAb = require("./src/installAb");
const checkRepo = require("./src/checkRepo");
const rebuildService = require("./src/rebuildService");

// most @actions toolkit packages have async methods
async function run() {
   try {
      await installAb();
      core.info("repo.name");
      const repo = checkRepo();
      core.info(repo.name);
      if (repo.type == "service") {
         rebuildService(repo.name);
      }
      // const ms = core.getInput('milliseconds');
      // core.info(`Waiting ${ms} milliseconds ...`);
      //
      // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
      // await wait(parseInt(ms));
      // core.info((new Date()).toTimeString());
      //
      // core.setOutput('time', new Date().toTimeString());
   } catch (error) {
      core.setFailed(error.message);
   }
}

run();
