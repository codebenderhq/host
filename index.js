import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.170.0/http/file_server.ts";
 
const port = Deno.env.get('ENV') ?  9000 : 80

const service = (req) => {
    console.log(req)
    return new Response("Hello, Dev")
}

serve(service, {port})
  
//we will test this again when we have certs
//Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
