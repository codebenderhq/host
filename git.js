

self.onmessage = async (e) => {
    
    console.log('new git process starting')

    const { host, isDev } = e.data;
    const cmd = [`${isDev ? './space/' : '/apps/home/'}serve.bash`, `${isDev ? './': '/apps/home/' }${host}`];
    // create subprocess
    
    const p = Deno.run({ cmd });
    
    // await its completion
    await p.status();
 
    self.close();
  };

 