const fs=require("node:fs");
const { chromium }=require("playwright");
const site=(process.env.ATLAS_SITE||"https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/").replace(/\/?$/,"/");
const dir="artifacts";fs.mkdirSync(dir,{recursive:true});
const failures=[],results=[];
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const log=(name,status,notes)=>{console.log("ATLAS-LIVE | "+status+" | "+name+(notes?" | "+notes:""));results.push({name,status,notes})};
async function run(){
 const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage","--use-angle=swiftshader-webgl","--enable-unsafe-swiftshader"]});
 try{
  const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,locale:"vi-VN"});
  desktop.on("pageerror",err=>{console.warn("BROWSER PAGE ERROR:",err.message)});
  async function goto(page,path){
   const res=await page.goto(site+path,{waitUntil:"domcontentloaded",timeout:45000});
   assert(res&&res.status()===200,path+" returned "+(res&&res.status()));
   return res;
  }
  // 1) V1 dashboard, data-binding, chart.
  try{
   await goto(desktop,"review.html");
   await desktop.waitForFunction(()=>document.querySelector("#kpiProjects")?.textContent.trim()==="32",{timeout:25000});
   const kpi=await desktop.locator("#kpiProjects").textContent();
   const bars=await desktop.locator("#salesChart .barWrap").count();
   const cards=await desktop.locator("#projectCards .projectCard").count();
   assert(bars===5,"Market chart expected 5 bars, saw "+bars);
   assert(cards===8,"Initial project cards expected 8, saw "+cards);
   assert((await desktop.locator("#kpiVerified").textContent()).trim()==="3","coord verification flag KPI");
   assert((await desktop.locator("#kpiPrice").textContent()).trim()==="0","price verification flag KPI");
   await desktop.screenshot({path:dir+"/v1-desktop.png",fullPage:true});
   log("V1 overview","PASS","Projects "+kpi+" · market bars "+bars+" · cards "+cards);
  }catch(e){failures.push("V1 overview: "+e.message);log("V1 overview","FAIL",e.message)}
  // 2) Search UX; don't break if preceding section failed.
  try{
   await goto(desktop,"review.html");await desktop.waitForFunction(()=>document.querySelectorAll("#projectCards .projectCard").length>0,{timeout:25000});
   await desktop.locator("#search").fill("The Prive");
   await desktop.waitForFunction(()=>document.querySelectorAll("#projectCards .projectCard").length===1,{timeout:5000});
   const name=await desktop.locator("#projectCards .projectCard h3").textContent();
   assert(name?.toLowerCase().includes("prive"),"search returned wrong item: "+name);
   log("Project search","PASS",name);
  }catch(e){failures.push("Project search: "+e.message);log("Project search","FAIL",e.message)}
  // 3) Full map - page loaded, map engine and project model initialized.
  try{
   await goto(desktop,"map-v4.html");
   await desktop.waitForFunction(()=>document.querySelector("#projectCount")?.textContent?.trim()==="32",{timeout:30000});
   const markerCount=await desktop.locator(".projectMarker").count();
   const canvasCount=await desktop.locator("#map canvas").count();
   assert(canvasCount>=1,"MapLibre canvas not present");
   assert(markerCount>=1,"Project markers absent (map style may not load)");
   await desktop.screenshot({path:dir+"/v1-map.png",fullPage:false});
   log("Interactive map","PASS",markerCount+" project markers on visible map; canvas "+canvasCount);
  }catch(e){failures.push("Interactive map: "+e.message);log("Interactive map","FAIL",e.message)}
  // 4) Historic sources and years.
  try{
   await goto(desktop,"history.html");
   await desktop.waitForFunction(()=>document.querySelectorAll("#marketChart .bar").length===5,{timeout:25000});
   await desktop.locator("#years button").filter({hasText:"2014"}).click();
   const year=await desktop.locator("#heading").textContent();
   assert(year?.includes("2014"),"history year filter not applied");
   await desktop.screenshot({path:dir+"/v1-history.png",fullPage:false});
   log("History research","PASS","Source-backed bars 5 and year selection 2014");
  }catch(e){failures.push("History research: "+e.message);log("History research","FAIL",e.message)}
  // 5) Mobile viewport, responsive controls and project list.
  try{
   const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,locale:"vi-VN",isMobile:true,hasTouch:true});
   await goto(mobile,"review.html");
   await mobile.waitForFunction(()=>document.querySelector("#kpiProjects")?.textContent?.trim()==="32",{timeout:25000});
   const widths=await mobile.evaluate(()=>({inner:window.innerWidth,body:document.body.scrollWidth}));
   await mobile.screenshot({path:dir+"/v1-mobile.png",fullPage:true});
   assert(widths.body<=widths.inner+16,"Mobile horizontally overflows "+JSON.stringify(widths));
   log("Mobile review","PASS",JSON.stringify(widths));
   await mobile.close();
  }catch(e){failures.push("Mobile review: "+e.message);log("Mobile review","FAIL",e.message)}
 }finally{await browser.close()}
 const report={tested_at:new Date().toISOString(),site,tests:results,failures};
 fs.writeFileSync(dir+"/report.json",JSON.stringify(report,null,2));
 if(failures.length){console.error("ATLAS LIVE SMOKE FAILURES:\n"+failures.join("\n"));process.exitCode=1}else console.log("ATLAS LIVE SMOKE PASS: all critical review journeys work.");
}
run().catch(err=>{console.error(err);process.exit(1)});
