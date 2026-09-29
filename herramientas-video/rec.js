const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/pincel.html');
const dur=await p.evaluate(()=>window.DURATION);
const ts=process.argv[2]==='test'?[0.4,1.5,3.0,4.5,5.5,7.0,8.3,9.6,10.9,12.5]:null;
const N=ts?ts.length:Math.round(dur*30);
fs.mkdirSync(__dirname+'/f',{recursive:true});
for(let i=0;i<N;i++){const t=ts?ts[i]:i/30;await p.evaluate(t=>window.render(t),t);
 await p.screenshot({path:__dirname+(ts?`/test-${i}.png`:`/f/${String(i).padStart(4,'0')}.png`)});}
await b.close();})();
