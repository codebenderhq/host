

self.onmessage = async (e) => {
    
    console.log('new git process starting')

    try{
        const { host, isDev } = e.data;
        console.log(host,Deno.cwd())
        const cmd = [`${isDev ? './space/' : '/apps/space/'}serve.bash`, `${isDev ? './': '/apps/home/' }${host}`];
        // create subprocess
        
        const p = Deno.run({ cmd });
        
        // await its completion
        await p.status();
     
        self.close();
    }catch (err){
        console.log(err)
    }
   
  };

 