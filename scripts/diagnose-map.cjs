const fs=require("node:fs");const {chromium}=require("playwright");fs.mkdirSync("artifacts",{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage","--enable-unsafe-swiftshader","--use-angle=swiftshader-webgl"]});try{
const p=await browser.newPage({viewport:{width:1440,height:900}});
const states=[];const bad=[];
p.on("response",r=>{try{const host=new URL(r.url()).hostname;if(/openfree|openstreet|esri|arcgis/i.test(host))states.push({host,status:r.status(),path:new URL(r.url()).pathname.slice(0,90)})}catch{}});
p.on("requestfailed",r=>{if(/openfree|openstreet|esri|arcgis/i.test(r.url()))bad.push({url:r.url().slice(0,170),error:r.failure()?.errorText})});
p.on("console",m=>{if(m.type()==="error")console.log("CONSOLE ERROR",m.text().slice(0,200))});
await p.goto("https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/map-v4.html",{waitUntil:"domcontentloaded",timeout:45000});
for(const [mode,file]of [["vector","atlas-vector.png"],["osm","atlas-osm.png"],["sat","atlas-sat.png"]]){
if(mode!=="vector")await p.selectOption("#baseMap",mode);await p.waitForTimeout(4500);
await p.screenshot({path:"artifacts/"+file,fullPage:false});
const analysis=await p.evaluate(()=>{let canvas=document.querySelector("#map canvas");return{canvas:!!canvas,markers:document.querySelectorAll(".projectMarker").length,style:document.querySelector("#baseMap")?.value,warning:document.querySelector("#mapNotice")?.hidden===false,mapReady:!!canvas}});
console.log("MAP-DIAG",mode,JSON.stringify(analysis));
}
const grouped={};for(const row of states){const key=row.host+" status "+row.status;grouped[key]=(grouped[key]||0)+1}
console.log("TILE-RESPONSES",JSON.stringify(grouped));console.log("REQUEST-FAILURES",JSON.stringify(bad.slice(0,12)));
fs.writeFileSync("artifacts/tiles-report.json",JSON.stringify({grouped,bad:bad.slice(0,30),sample:states.slice(0,35)},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
