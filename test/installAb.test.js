const assert = require("assert");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const fakeExec = sinon.fake.resolves("");

const installAb = proxyquire("../src/installAb", {
   "@actions/exec": { exec: fakeExec },
   // "@actions/core": { info: sinon.stub() },
});

beforeEach(() => {
   delete process.env["INPUT_STACK"];
   delete process.env["INPUT_FOLDER"];
   delete process.env["INPUT_PORT"];
   delete process.env["INPUT_RUNTIME"];
   fakeExec.resetHistory();
});

describe("installer calls exec", () => {
   it("with default opts", async () => {
      const expected = [
         "appbuilder install AppBuilder",
         [
            `--stack=ab`,
            `--port=80`,
            "--dbExpose=false",
            "--dbPassword=root",
            "--tag=latest",
            "--authType=login",
            "--relayEnabled=false",
            "--pwaURL=http://pwa.site.com",
            "--siteURL=http://auth.site.com",
            "--tenant.username=admin",
            "--tenant.password=admin",
            "--tenant.email=neo@thematrix.com",
            `--tenant.url=http://localhost:80`,
         ],
      ];
      await installAb();

      assert.equal(fakeExec.callCount, 4);
      assert.equal(fakeExec.args[0], "docker swarm init");
      assert.deepEqual(fakeExec.args[2], expected);
   });

   it("with inputs", async () => {
      process.env["INPUT_STACK"] = "my_ab";
      process.env["INPUT_FOLDER"] = "my_folder";
      process.env["INPUT_PORT"] = "8080";
      const expected = [
         "appbuilder install my_folder",
         [
            `--stack=my_ab`,
            `--port=8080`,
            "--dbExpose=false",
            "--dbPassword=root",
            "--tag=latest",
            "--authType=login",
            "--relayEnabled=false",
            "--pwaURL=http://pwa.site.com",
            "--siteURL=http://auth.site.com",
            "--tenant.username=admin",
            "--tenant.password=admin",
            "--tenant.email=neo@thematrix.com",
            `--tenant.url=http://localhost:8080`,
         ],
      ];
      await installAb();

      assert.equal(fakeExec.callCount, 4);
      assert.equal(fakeExec.args[0], "docker swarm init");
      assert.deepEqual(fakeExec.args[2], expected);
   });

   it("with the input runtime", async () => {
      process.env["INPUT_RUNTIME"] = "c3499c2729730a7f807efb8676a92dcb6f8a3f8f";
      const expected = [
         "appbuilder install AppBuilder",
         [
            "--stack=ab",
            "--port=80",
            "--dbExpose=false",
            "--dbPassword=root",
            "--tag=latest",
            "--authType=login",
            "--relayEnabled=false",
            "--pwaURL=http://pwa.site.com",
            "--siteURL=http://auth.site.com",
            "--tenant.username=admin",
            "--tenant.password=admin",
            "--tenant.email=neo@thematrix.com",
            "--tenant.url=http://localhost:80",
            "--runtime=c3499c2729730a7f807efb8676a92dcb6f8a3f8f",
         ],
      ];
      await installAb();

      assert.equal(fakeExec.callCount, 4);
      assert.equal(fakeExec.args[0], "docker swarm init");
      assert.deepEqual(fakeExec.args[2], expected);
   });
});
