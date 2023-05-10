import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import middleware from " https://deno.land/x/sauveur@0.1.3-pre/index.js"
import {Octokit} from 'npm:octokit'
import {readerFromStreamReader} from "https://deno.land/std/streams/mod.ts";

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

  const uri = `${req.headers.get('referer') ? req.headers.get('referer') :  `https://${req.headers.get("host")}`}${pathname}`
  const {pathname:newPathname} = new URL(uri)

  const pathnameArray = newPathname.replace('/','').split('/')
  window._cwd = `/apps/${pathnameArray.shift()}`
  // console.log(window._cwd)

  // if(pathname === '/_log' && searchParams.get("secret")){
  //   return Response.json(get_log())
  // }
  
  if(pathname === '/octo' && req.method === 'POST'){
    let data = await req.json()
    const deployMeta = {id:data.workflow_run.id, action:data.action, repo:data.repository.name}
    const appName = deployMeta.repo
    const run_id = deployMeta.id
    const octokit = new Octokit({
      auth: Deno.env.get('OCTO')
  })
  
  if(deployMeta.action === "completed"){

    const res = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts', {
      owner: 'codebenderhq',
      run_id,
      repo: appName
  })
   
  // console.log(res.data)
  const latest_download = res.data.artifacts.shift()
  
  const download = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}', {
      owner: 'codebenderhq',
      repo: appName,
      artifact_id: latest_download.id,
      archive_format: 'zip',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'accept': ' application/vnd.github+json'
      }
    })
    
  const rsp=await fetch(download.url)
  const rdr=rsp.body?.getReader();
    
  if(rdr) {
      const r=readerFromStreamReader(rdr);
      const f=await Deno.open(`./${appName}.zip`, {create: true, write: true});
      await Deno.copy(r, f);
      await Deno.mkdir(`/apps/${appName}`, { recursive: true });
    
      f.close()
      // define command used to create the subprocess
      const cmd = ["unzip","-o", `${appName}.zip`, "-d",`/apps/${appName}/src`];
      
      // create subprocess
      const p = Deno.run({ cmd });
      
      // await its completion
      await p.status();
  
  }
  }

    return new Response("A new dawn is upon us");
  }

  try {   
 
    // const {default: app} = await import(`${appFolder}/index.js`);
    //import app middeware to serve
    const sanatizedUri = `https://${req.headers.get("host")}/${pathnameArray.join('/')}`

    const _req = new Request(sanatizedUri,{
      method: req.method,
      headers: Object.fromEntries(req.headers),
      body: req.body
    });
   
    
    if(pathname !== '/'){
      return middleware(_req, info)
    }
    
    window._cwd = `/apps/home`
    return middleware(req, info)

  } catch(err) {
    
    console.log(err)
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
