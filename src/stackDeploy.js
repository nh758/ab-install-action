// docker stack deploy -c $File -c docker-compose.override.yml $TestOveride ab
const core = require("@actions/core");
const exec = require("@actions/exec");

async function stackDeploy(folder, stack) {
   core.startGroup("Deploy the Stack");
   const opts = [
      "-c",
      "docker-compose.yml",
      "-c",
      "docker-compose.override.yml",
      "-c",
      "compose.override.yml",
      "-c",
      "./test/setup/ci-test.overide.yml",
      stack,
   ];
   await exec.exec("docker stack deploy", opts, { cwd: `./${folder}` });

   await exec.exec("docker stack services", [stack]);
   core.endGroup();
}
module.exports = stackDeploy;
