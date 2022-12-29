import "https://deno.land/std@0.170.0/dotenv/load.ts";

console.log(Deno.env.get('PORT'))
Deno.serve({ port: Deno.env.get('PORT') }, (_req) => new Response("Hello, world"));
