const core = require("@actions/core");
const exec = require("@actions/exec");
const yaml = require("js-yaml");
const fs = require("fs");

async function rebuildService(repo) {
   const folder = core.getInput("folder") || "AppBuilder";
   const sha = core.getInput("sha");
   if (sha == "undefined") return;
   core.startGroup("Git Clone / Checkout");
   await exec.exec(
      `git clone --recursive https://github.com/digi-serve/${repo}.git`,
      [],
      {
         cwd: `./${folder}`,
      }
   );
   // Fetch pr branches
   await exec.exec("git fetch origin '+refs/pull/*:refs/remotes/pr/*'", [], {
      cwd: `./${folder}/${repo}`,
   });

   await exec.exec(`git checkout ${sha}`, [], {
      cwd: `./${folder}/${repo}`,
   });

   await exec.exec("git submodule update --recursive", [], {
      cwd: `./${folder}/${repo}`,
   });
   core.endGroup();

   core.startGroup(`Docker Build ${repo}:test`);
   await exec.exec(`docker build -t ${repo}:test .`, [], {
      cwd: `./${folder}/${repo}`,
   });

   const shortName = repo.replace("ab_service_", "");

   // build the overrideFile
   try {
      const override = {
         services: {},
      };
      override.services[shortName] = {
         image: "${repo}:test",
      };
      fs.writeFileSync(`./${folder}/compose.override.yml`, yaml.dump(override));

      core.startGroup("Check File Structure");
      await exec.exec(`ls`);

      await exec.exec(`ls`, [], {
         cwd: `./${folder}`,
      });

      await exec.exec(`cat compose.override.yml`, [], {
         cwd: `./${folder}`,
      });

      await exec.exec(`ls`, [], {
         cwd: `./${folder}/${repo}`,
      });
      core.endGroup();
   } catch (e) {
      core.info(e);
   }
}
module.exports = rebuildService;
