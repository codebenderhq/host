import "https://deno.land/std@0.170.0/dotenv/load.ts";
import middleware from "https://deno.land/x/sauveur@0.1.5/index.js";
import { Octokit } from "npm:octokit";
import { readerFromStreamReader } from "https://deno.land/std/streams/mod.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const deploy = async (reader,name) => {
  let time = 0;
  const appPath =  `/deploy/${name}.tar.gz`
//  to be able to test locally will move this to env variables when stable
//  const appPath = `./deploy/${name}.tar.gz`
  const intervalID = setInterval(() => time += 1);
  const f = await Deno.open(appPath, {
    create: true,
    write: true,
  });
  await Deno.copy(readerFromStreamReader(reader), f);
  await f.close();

  const deployWorker = new Worker(
    new URL("./worker.js", import.meta.url).href,
    { type: "module" },
    );
  deployWorker.postMessage({ path: appPath });

  clearInterval(intervalID);
  return time;
};

const decoder = new TextDecoder("utf-8");

const port = Deno.env.get("env") === "dev" ? 9091 : 443;
const cert = decoder.decode(await Deno.readFile(Deno.env.get("CERT")));
const key =  decoder.decode(await Deno.readFile(Deno.env.get("KEY")));

const options = {
  port,
  key,
  cert,

};
// new Worker(new URL("./job.js", import.meta.url).href, { type: "module" });

const special_domains = ["sauveur.cloud", "sauveur.shop"];
const service = async (req, info) => {
  const { pathname, hostname, username, hash, search, searchParams } = new URL(
    req.url,
  );

  if (pathname === "/octo" && req.method === "POST") {
    let data = await req.json();
    const deployMeta = {
      id: data.workflow_run.id,
      action: data.action,
      repo: data.repository.name,
    };
    const appName = deployMeta.repo;
    const run_id = deployMeta.id;
    const octokit = new Octokit({
      auth: Deno.env.get("OCTO"),
    });

    if (deployMeta.action === "completed") {
      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        {
          owner: "codebenderhq",
          run_id,
          repo: appName,
        },
      );

      // console.log(res.data)
      const latest_download = res.data.artifacts.shift();

      const download = await octokit.request(
        "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
        {
          owner: "codebenderhq",
          repo: appName,
          artifact_id: latest_download.id,
          archive_format: "zip",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            "accept": " application/vnd.github+json",
          },
        },
      );

      const rsp = await fetch(download.url);
      const rdr = rsp.body?.getReader();

      if (rdr) {
        const r = readerFromStreamReader(rdr);
        const f = await Deno.open(`./deploy/${appName}.zip`, {
          create: true,
          write: true,
        });
        await Deno.copy(r, f);
        await Deno.mkdir(`/apps/${appName}`, { recursive: true });

        f.close();
        // define command used to create the subprocess
        const cmd = [
          "unzip",
          "-o",
          `./deploy/${appName}.zip`,
          "-d",
          `/apps/${appName}/src`,
        ];

        // create subprocess
        const p = Deno.run({ cmd });

        // await its completion
        await p.status();
      }
    }

    return new Response("A new dawn is upon us");
  }

  if (pathname === "/deploy" && req.method === "POST") {
    console.time("saving file");
    const reader = req?.body?.getReader();
    const deployResp = await deploy(reader, searchParams.get('name'));
    console.timeEnd("saving file");
    console.log(deployResp, "ms");
    return new Response("deployed");
  }

  try {
    window._cwd = `/apps/${req.headers.get("host")}`;
    console.log(window._cwd);
    return middleware(req, info);
  } catch (err) {


    return new Response(
      "Happy new year, Wishing you success in achievement of your resolutions",
    );
  }
};

Deno.env.get("env") === "dev" ? Deno.serve(service) : Deno.serve(options, service);

//ACME service
Deno.serve({port:Deno.env.get("env") === "dev" ? 9003 : 80},(req) => {
  const { pathname } = new URL(req.url);

  console.log(req);
  const host = req.headers.get("host");

  if (pathname.includes(".well-known")) {
    return serveFile(req, `/apps${pathname}`);
  } else {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `https://${host.replace("www.", "")}${pathname}`,
      },
    });
  }
})
