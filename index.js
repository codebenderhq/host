import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const isDev = Deno.env.get("env") === "dev";
const port = isDev ? 9000 : 443;
const certFile = isDev
  ? "./space/host.cert"
  : "/etc/letsencrypt/live/space.sauveur.xyz/fullchain.pem";
const keyFile = isDev
  ? "./space/host.key"
  : "/etc/letsencrypt/live/space.sauveur.xyz/privkey.pem";

const options = {
  port,
  certFile,
  keyFile,alpnProtocols: ["h2", "http/1.1"],
};

const service = async (req, info) => {
  const { pathname, password, username, hash, search,searchParams } = new URL(req.url);
//  console.log(req)
  const uri = new URL(req.url);
  console.log(password, username, hash, search)
  const host = req.headers.get("host");

  const appPath = host === "space.sauveur.xyz" || host === "localhost:9000"
    ? `/${searchParams.get('domain')}.dev`
    : `/${host}`;
  const appFolder = `${isDev ? Deno.cwd() : "/apps/home"}${appPath}`;

  console.log(appFolder);

  if (pathname.includes(".well-known")) {
    return serveFile(req, `/apps${pathname}`);
  }

  if (pathname.includes(".init")) {
    // define command used to create the subprocess
    const cmd = ["git", "init", "--bare", `${appFolder}`];

    // create subprocess
    const p = Deno.run({ cmd });

    // await its completion
    await p.status();

    return new Response(`repo init at ${appFolder}`);
  }

  try {
    const app = await import(`${appFolder}/index.js`);

    //import app middeware to serve
    console.log(app);
    return new Response("A new dawn is upon us");
  } catch {
    return new Response("You look lost, Happy New Year");
  }
};

//serve(service, {port})
await serveTls(service, options);

// Deno.serve({cert: await Deno.readTextFile(certFile), key: await Deno.readTextFile(keyFile), port}, service)

//we will test this again when we have certs
//Deno.serve({ port }, (_req, _info) => service(_req,_info));
