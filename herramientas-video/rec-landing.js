const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/landing.html');await p.evaluate(()=>window.ready);
const ts=process.argv[2]==='test'?[0.5,2,5.5,6.2,9.1,11.5,14.6]:null;
const N=ts?ts.length:Math.round(15.5*30);
fs.mkdirSync(__dirname+'/f',{recursive:true});
for(let i=0;i<N;i++){const t=ts?ts[i]:i/30;await p.evaluate(t=>window.render(t),t);
 await p.screenshot({path:__dirname+(ts?`/test-${i}.jpg`:`/f/${String(i).padStart(4,'0')}.jpg`),type:'jpeg',quality:92});}
await b.close();})();
