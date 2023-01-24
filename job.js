
console.log('job worker created')
setInterval(()=> {
    console.log('running the jobs for today', new Date().toTimeString())
},86400000)