import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const port = Deno.env.get("ENV") ? 9000 : 443;
const certFile = Deno.env.get("ENV") ? "./host.cert" : "/etc/letsencrypt/live/space.sauveur.xyz/fullchain.pem";
const keyFile = Deno.env.get("ENV") ? "./host.key" : "/etc/letsencrypt/live/space.sauveur.xyz/privkey.pem";

const options = {
  port,
  certFile,
  keyFile
};

const service = (req, ifo) => {
  const { pathname } = new URL(req.url);
  console.log(pathname);
  if (pathname.includes(".well-known")) {
    return serveFile(req, `/apps${pathname}`);
  }

  return new Response("Hello, Dev");
};

//serve(service, {port})
await serveTls(service, options);

//we will test this again when we have certs
//Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
