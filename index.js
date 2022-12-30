import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const isDev = Deno.env.get("env") === 'dev'
const port = isDev ? 9000 : 443;
const certFile = isDev ? "./space/host.cert" : "/etc/letsencrypt/live/space.sauveur.xyz/fullchain.pem";
const keyFile = isDev ? "./space/host.key" : "/etc/letsencrypt/live/space.sauveur.xyz/privkey.pem";

const options = {
  port,
  certFile,
  keyFile
};

const service = async (req, ifo) => {
  const { pathname } = new URL(req.url);
  const host = req.headers.get('host');


  const appPath = host === 'space.sauveur.xyz' || host === 'localhost:9000' ? `${pathname}.dev` : `/${host}`;


  if (pathname.includes(".well-known")) {
      return serveFile(req, `/apps${pathname}`);
  }


  try{
      const app = await import(`${isDev ? Deno.cwd() : '/apps/home'}${appPath}/index.js`);

      //import app middeware to serve      
      console.log(app);
      return new Response("A new dawn is upon us");
  }catch{
      return new Response("You look lost, Happy New Year");
  }



};

//serve(service, {port})
await serveTls(service, options);

//we will test this again when we have certs
//Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
