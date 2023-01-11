import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const isDev = Deno.env.get("env") === "dev";
const log_path = `${isDev ? Deno.cwd() : "/apps"}/log.json`
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
  keyFile,
  alpnProtocols: ["h2", "http/1.1"],
};



const dev_domains = ["space.sauveur.xyz", "localhost:9000"];
const service = async (req, info) => {
  const { pathname, password, username, hash, search, searchParams } = new URL(
    req.url,
  );
  //  console.log(req)
  const uri = new URL(req.url);
  console.log(password, username, hash, search);
  window._host = req.headers.get("host");
  // rough hack for dev developing
  const dev_domain = searchParams.get("domain")
  window.dev_domain = dev_domain ? dev_domain :   window.dev_domain

  const appPath = dev_domains.includes(window._host)
    ? `/${window.dev_domain}.dev`
    : `/${window._host}`;
  const appFolder = `${isDev ? Deno.cwd() : "/apps/home"}${appPath}`;

  // console.log(appFolder);


  if (pathname.includes(".init")) {
    // define command used to create the subprocess
    const cmd = ["git", "init", "--bare", `${appFolder}`];

    // create subprocess
    const p = Deno.run({ cmd });

    // await its completion
    await p.status();

    return new Response(`repo init at ${appFolder}`);
  }

  if(pathname === '/_log'){
    return Response.json(get_log())
  }
  
  try {

    
    const {default: app} = await import(`${appFolder}/index.js`);
 
    window._cwd = appFolder
    //import app middeware to serve
  
    return await app(req,info)
    // return new Response("A new dawn is upon us");
  } catch(err) {
    
    // dispatchEvent(new CustomEvent('log',{detail:{host,msg:err.message, err}}))
    window.dispatchLog({msg:err.message, err})
    return new Response("Happy new year, Wishing you success in achievement of your resolutions");
  }
};



const logger = (e) => {

  let logs = get_log()

  if(logs[window._host]){
    logs[window._host].push(e.detail)
  }else{
    logs[window._host] = [e.detail]
  }


 
  console.log('logged to ->',log_path)
  Deno.writeTextFileSync(log_path, JSON.stringify(logs));
}

const get_log = () => {

  try{
    const data = JSON.parse(Deno.readTextFileSync(log_path));
    return data
  
  }catch{
    return {}
  } 
}

addEventListener('log', (e) => logger(e));

// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
window.dispatchLog = (data) => dispatchEvent(new CustomEvent('log',{detail:data}))




await serveTls(service, options);

 
//we will test this again when we have certs
//Deno.serve({ port }, (_req, _info) => service(_req,_info));
