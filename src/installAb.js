const core = require("@actions/core");
const exec = require("@actions/exec");

async function installAb() {
   const folder = core.getInput("folder") || "AppBuilder";
   const stack = core.getInput("stack") || "ab";
   const runtime = core.getInput("runtime") || null;
   const installOpts = [
      `--stack=${stack}`,
      `--port=${core.getInput("port") || 80}`,
      "--db.expose=false",
      "--db.encryption=false",
      "--db.password=root",
      "--tag=develop",
      "--nginx.enable=true",
      "--ssl.none",
      "--bot.enable=false",
      "--smtp.enable=false",
      "--tenant.username=admin",
      "--tenant.password=admin",
      "--tenant.email=neo@thematrix.com",
      `--tenant.url=http://localhost:${core.getInput("port") || 80}`,
   ];

   if (runtime) installOpts.push(`--runtime=${runtime}`);

   core.startGroup("Initiliazing Docker Swarm");
   await exec.exec("docker swarm init");
   core.endGroup();

   core.startGroup("Installing AppBuilder");
   await exec.exec(`npx digi-serve/ab-cli install ${folder}`, installOpts);
   core.endGroup();

   core.startGroup("Waiting for the Stack to come down");
   await waitClosed(stack, 1);
   core.endGroup();

   core.info("Done");
}

module.exports = installAb;

async function waitClosed(stack, attempt) {
   return new Promise((resolve) => {
      let output = "";

      const options = { silent: true };
      options.listeners = {
         stdout: (data) => {
            output += data.toString();
         },
      };

      core.info(`Checking the network (${attempt})`);
      exec.exec(`docker network ls`, [], options).then(() => {
         if (output.includes(`${stack}_default`)) {
            // stack is found so:
            setTimeout(() => {
               attempt++;
               waitClosed(stack, attempt);
            }, 1000);
         } else {
            return resolve();
         }
      });
   });
}
