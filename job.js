
console.log('job worker created', Deno.env.get('env'))

const runJob = async (path) => {

    console.log('running job')
    const {default:api} = await import(`${path}_app/db/api/get.js`)

    const {date, setDate} = await import(`${path}_app/job/api/services/index.js`)

    const res = await api(new Request(`http://hello.com?col=job&indexName=date&index=${date.getToday()}`,{
        headers:{
            referer: 'oneohone.xyz'
        }
    }))


    if(res.status === 200){
        const activeJobs = res.document_data.filter(data => data.retry <=3 && data.duration > 0)
        console.log(activeJobs, 'jobs for today')
        activeJobs.forEach(async element => {

            element.headers.body = JSON.stringify(element.payload)
            const updateJobSpec = {
                duration: --element.duration,
                date: setDate(element.date.split('/')).addDays(element.interval - element.retry)
            }
            
            await fetch(element.uri,element.headers).catch(err => {
                updateJobSpec.duration = element.duration
                updateJobSpec.retry = ++element.retry
                updateJobSpec.date = setDate(element.date.split('/')).addDays(1)
                console.log('job failed')
            })

            const {default:api} = await import(`${path}_app/db/api/patch.js`)
            await api(new Request(`http://hello.com?col=job&id=${element.id}`,{
                headers:{
                    referer: 'oneohone.xyz'
                }
            }),{...updateJobSpec})          
        });
    }
}

setInterval(()=> {
    runJob('oneohone.xyz/src/')
    console.log('running the jobs for today', new Date().toTimeString())
},86400000)


if(Deno.env.get('env')){
    setInterval(async ()=> {
        runJob('oneohone.dev/src/')
    },864000)
}
