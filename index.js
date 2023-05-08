import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import middleware from "https://deno.land/x/sauveur@0.0.7-pre/index.js"

// Deno.env.get("env") === "dev" ? localStorage.setItem('dev',true) : ''

// localStorage.clear()

// const isDev = localStorage.getItem('dev')
const port = Deno.env.get("env") === "dev" ? 9090 : 443;
const certFile = Deno.env.get("CERT");
const keyFile =  Deno.env.get("KEY");

const options = {
  port,
  certFile,
  keyFile,
  alpnProtocols: ["h2", "http/1.1"],
};


new Worker(new URL("./job.js", import.meta.url).href, { type: "module" });

// const dev_domains = ["space.sauveur.xyz", "localhost:9001"];
const service = async (req, info) => {
  const { pathname, hostname, username, hash, search, searchParams } = new URL(
    req.url,
  );
 
  // window._host = req.headers.get("host");
  // rough hack for dev developing
  // window.dev_domain = hostname.split('.')[0].replace('-','.').replace('_','.')

  // const appPath = dev_domains.includes(window._host.split('.').pop())
  //   ? `${hostname.split('.')[0].replace('-','.').replace('_','.')}.dev`
  //   : `${window._host}`;
  // const appFolder = `${Deno.env.get('MAIN_PATH') ? Deno.env.get('MAIN_PATH')  : "/apps/home/"}${appPath}`;

  // console.log(appPath);


  // if (pathname.includes(".init")) {
  //   // define command used to create the subprocess
  //   const cmd = ["git", "init", "--bare", `${appFolder}`];

  //   // create subprocess
  //   const p = Deno.run({ cmd });

  //   // await its completion
  //   await p.status();

  //   return new Response(`repo init at ${appFolder}`);
  // }

  if(pathname === '/_log' && searchParams.get("secret")){
    return Response.json(get_log())
  }
  

  try {   
 
    // const {default: app} = await import(`${appFolder}/index.js`);
    
    const pathnameArray = pathname.replace('/','').split('/')
  
    // window._cwd = `/apps/${pathnameArray.shift()}`
    console.log(window._cwd)
    //import app middeware to serve
    console.log(pathnameArray.join('/'))
    return middleware(req,info)
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


  localStorage.setItem(window._host,JSON.stringify(logs))
  console.log('logged to ->',window._host)
 }

const get_log = () => {


  try{ 
    const data = JSON.parse(localStorage.getItem(window._host));
 
    return data ? data : {}
  
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
