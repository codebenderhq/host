import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.167.0/http/server.ts";
 
const service = () => {
    return new Response("Hello, worlds")
}

serve(service, {port:Deno.env.get('PORT')})

//we will test this again when we have certs
//Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
