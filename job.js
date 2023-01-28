
console.log('job worker created', Deno.env.get('env'))

setInterval(()=> {
    console.log('running the jobs for today', new Date().toTimeString())
},86400000)


if(Deno.env.get('env')){
    setInterval(async ()=> {
        const {default:api} = await import('app.sauveur.dev/src/_app/db/api/get.js')
        const {default:date} = await import('app.sauveur.dev/src/_app/job/api/services/index.js')
        const res = await api(new Request(`http://hello.com?col=job&indexName=date&index=${date.getToday()}`,{
            headers:{
                referer: 'app.sauveur.xyz'
            }
        }))

        if(res.status === 200){
            const activeJobs = res.document_data.filter(data => data.active && data.duration > 0)
            console.log(activeJobs, 'jobs for today')
            activeJobs.forEach(element => {
                  // payload request
                  console.log(element)
                  // if payload succeful 
                  // update next date of job
            
            });
        }
    },8640)
}
