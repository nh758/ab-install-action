// docker stack deploy -c $File -c docker-compose.override.yml $TestOveride ab
const core = require("@actions/core");
const exec = require("@actions/exec");

function waitmS(mS) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, mS);
   });
}

async function isServiceUp(keywordService) {
   let output = "";

   await exec.exec(
      `bash -c "docker service ls | grep ${keywordService} | awk '{print $4}'"`,
      [],
      {
         listeners: {
            stdout: (data) => {
               output += data.toString();
            },
         },
      }
   );

   return output.includes("1/1");
}

async function waitServiceUp(keywordService) {
   while (!(await isServiceUp(keywordService))) await waitmS(1000);

   await waitmS(5000);
}

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
