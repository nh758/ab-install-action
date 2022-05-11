const core = require("@actions/core");
const exec = require("@actions/exec");

async function installAb() {
   const folder = core.getInput("folder") || "AppBuilder";
   const stack = core.getInput("stack") || "ab";
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

   core.startGroup("Initiliaze Docker Swarm");
   await exec.exec("docker swarm init");
   core.endGroup();

   core.startGroup("Install AppBuilder");
   await exec.exec(`npx digi-serve/ab-cli install ${folder}`, installOpts);
   core.endGroup();

   core.info("Waiting for the Stack to come down");

   await waitClosed();

   core.info("Done");
}

module.exports = installAb;

async function waitClosed(stack) {
   let output = "";

   const options = {};
   options.listeners = {
      stdout: (data) => {
         output += data.toString();
      },
   };

   exec.exec(`docker network ls`, [], options);

   if (output.includes(stack)) {
      // stack is found so:
      setTimeout(() => {
         waitClosed(stack);
      }, 1000);
   } else {
      return;
   }
}
