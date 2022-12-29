import "https://deno.land/std@0.170.0/dotenv/load.ts";
//import { serve, serveTls } from "https://deno.land/std@0.167.0/http/server.ts";
//
//
//console.log(Deno.env.get('PORT'))
//
//const service = () => {
//    return new Response("Hello, world")
//}
//
//serve(service, {port:Deno.env.get('PORT')})
Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
