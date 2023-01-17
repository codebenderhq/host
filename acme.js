import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";

const isDev = Deno.env.get("env") === "dev";
const port = isDev ? 9000 : 80;

const service = async (req, info) => {
    const { pathname } = new URL(req.url);

    console.log(req)
    const host = req.headers.get('host')
  
    if (pathname.includes(".well-known")) {
        return serveFile(req, `/apps${pathname}`);
    }else{
        return new Response(null, {
            status: 301,
            headers:{
                Location: `https://${host.replace('www.','')}${pathname}`
            }
        })
    }

};

serve(service, {port})
