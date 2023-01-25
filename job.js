
console.log('job worker created', Deno.env.get('env'))

setInterval(()=> {
    console.log('running the jobs for today', new Date().toTimeString())
},86400000)


if(Deno.env.get('env')){
    setInterval(()=> {
        console.log('running the jobs for today', new Date().toTimeString())
    },86400)
}
