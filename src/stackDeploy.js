// docker stack deploy -c $File -c docker-compose.override.yml $TestOveride ab
const core = require("@actions/core");
const exec = require("@actions/exec");
const { waitServiceUp } = require("./util/waitService.js");

async function stackDeploy(folder, stack, images = []) {
   core.startGroup("Deploy the Stack");
   const opts = [
      "-c",
      "docker-compose.yml",
      "-c",
      "docker-compose.override.yml",
      "-c",
      "./test/setup/ci-test.overide.yml",
      stack,
   ];
   await exec.exec("docker stack deploy", opts, { cwd: `./${folder}` });

   await waitServiceUp("sails");

   for (let i = 0; i < images.length; i++) {
      const shortName = images[i].replace("ab_service_", "");

      await exec.exec(
         `docker service update --image ${images[i]}:test ${stack}_${shortName}`
      );
   }

   await exec.exec("docker stack services", [stack]);

   core.endGroup();
}
module.exports = stackDeploy;
