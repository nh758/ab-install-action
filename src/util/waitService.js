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

module.exports = { waitServiceUp, isServiceUp, waitmS };
