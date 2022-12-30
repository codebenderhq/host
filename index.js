import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { serve, serveTls } from "https://deno.land/std@0.170.0/http/server.ts";
 
const port = Deno.env.get('ENV') ?  9000 : 80
const service = () => {
    return new Response("Hello, worlds")
}

serve(service, {port})

//were going to have to create a file
//we will test this again when we have certs
//Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
