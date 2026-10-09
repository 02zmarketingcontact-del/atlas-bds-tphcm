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
  let tileResponses=0;
  desktop.on("response",r=>{try{const h=new URL(r.url()).hostname;if(/openfreemap|openstreetmap|arcgisonline/i.test(h)&&r.status()===200)tileResponses++}catch{}});
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
   await desktop.frameLocator("#mapPreview").locator(".projectMarker,.projectCluster").first().waitFor({timeout:30000});
   await desktop.waitForTimeout(2700);
   await desktop.screenshot({path:dir+"/v1-desktop.png",fullPage:true});
   log("V1 overview","PASS","Projects "+kpi+" · market bars "+bars+" · cards "+cards);
  }catch(e){failures.push("V1 overview: "+e.message);log("V1 overview","FAIL",e.message)}
  // QiMap branding: all public pages must use QILUVI logo and QiMap naming.
  try{
   for(const path of ["review.html","map-v4.html","history.html","index.html"]){
    await goto(desktop,path);
    const identity=desktop.locator(".qimap-brand-logo").first();
    await identity.waitFor({timeout:12000});
    const valid=await identity.evaluate(im=>im.complete&&im.naturalWidth>0);
    assert(valid,"QILUVI logo did not render: "+path);
    assert((await desktop.title()).startsWith("QiMap"),"Page title still displays former brand: "+path);
   }
   await goto(desktop,"review.html");
   await desktop.screenshot({path:dir+"/qimap-brand-desktop.png",fullPage:false});
   log("QiMap / QILUVI identity","PASS","4 pages use brand logo, title and shared palette");
  }catch(e){failures.push("QiMap brand: "+e.message);log("QiMap / QILUVI identity","FAIL",e.message)}
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
   await desktop.waitForSelector(".projectMarker,.projectCluster",{timeout:30000});
   const markerCount=await desktop.locator(".projectMarker,.projectCluster").count();
   const canvasCount=await desktop.locator("#map canvas").count();
   assert(canvasCount>=1,"MapLibre canvas not present");
   assert(markerCount>=1,"Project markers absent (map style may not load)");
   await desktop.waitForTimeout(3200);
   assert(tileResponses>=1,"No successful map-tile HTTP response was observed");
   await desktop.screenshot({path:dir+"/v1-map.png",fullPage:false});
   log("Interactive map","PASS",markerCount+" project markers on visible map; canvas "+canvasCount);
  }catch(e){failures.push("Interactive map: "+e.message);log("Interactive map","FAIL",e.message)}
  // 3B) Transit network, official planning sources, OSM station/bus layers and developer evidence.
  try{
   await goto(desktop,"map-v4.html");
   await desktop.waitForFunction(()=>document.querySelectorAll("#transitList .transitItem").length>=9,{timeout:25000});
   const routes=await desktop.locator("#transitList .transitItem").count();
   const portals=await desktop.locator("#planningSources a").count();
   const stationData=await desktop.evaluate(async()=>{const [m,b]=await Promise.all([fetch("data/metro_stations_osm.geojson").then(r=>r.json()),fetch("data/bus_stops_osm.geojson").then(r=>r.json())]);return{metro:m.features.length,bus:b.features.length,licensed:m.metadata.license==="ODbL"&&b.metadata.license==="ODbL"}});
   assert(routes>=9,"Transit route catalog incomplete "+routes);
   assert(portals>=6,"Official planning lookup catalog incomplete "+portals);
   assert(stationData.metro>=10,"Metro station OSM candidates missing "+stationData.metro);
   assert(stationData.bus>=50,"Bus stop OSM candidates missing "+stationData.bus);
   assert(stationData.licensed,"Transit OSM attribution/licence missing");
   await desktop.locator("#busStopsToggle").check();
   assert(await desktop.locator("#busStopsToggle").isChecked(),"Bus stop toggle not functional");
   await desktop.locator("#search").fill("The Felix");
   await desktop.locator("#projectList .projectCard").first().click();
   const detail=await desktop.locator("#detail").innerText();
   assert(detail.includes("1.147")||detail.includes("1147"),"Developer corporate-source fact not shown on Felix card");
   assert(detail.includes("Nguồn doanh nghiệp phát triển"),"Daily developer source status not shown in project details");
   const officialLink=await desktop.locator("#detail a.officialSourceLink").first().getAttribute("href");
   assert(officialLink?.includes("c-holdings.vn"),"Official C-Holdings link not shown for The Felix");
   const sourceRegistry=await desktop.evaluate(async()=>{const [registry,state,candidates]=await Promise.all([
    fetch("./data/developer_official_registry.json").then(r=>r.json()),
    fetch("./data/developer_source_monitor_state.json").then(r=>r.json()),
    fetch("./data/developer_fact_candidates.json").then(r=>r.json())
   ]);return{projects:registry.projects.length,monitored:registry.projects.filter(x=>x.source).length,pending:registry.projects.filter(x=>!x.source).length,candidatesApproved:candidates.auto_published_project_facts||0,state:!!state.projects}});
   assert(sourceRegistry.projects===32,"Official developer registry must include all 32 projects");
   assert(sourceRegistry.monitored>=28,"Official source coverage regression");
   assert(sourceRegistry.candidatesApproved===0,"Unverified numerical claims must not be published");
   assert(sourceRegistry.state,"Developer monitor state must be available");
   await desktop.screenshot({path:dir+"/v1-map-transit.png"});
   log("Transit & developer research","PASS",routes+" metro corridors · "+stationData.metro+" OSM stations · "+stationData.bus+" bus stops · "+portals+" planning portals");
  }catch(e){failures.push("Transit & developer research: "+e.message);log("Transit & developer research","FAIL",e.message)}
  // 4) Historic sources and years.
  try{
   await goto(desktop,"history.html");
   await desktop.waitForFunction(()=>document.querySelectorAll("#marketChart .bar").length===5,{timeout:25000});
   await desktop.locator("#years button").filter({hasText:"2014"}).click();
   const year=await desktop.locator("#heading").textContent();
   const idx=await desktop.locator("#indexObservations .indexCard").count();
   assert(idx>=3,"SPPI historical observations missing");
   assert(year?.includes("2014"),"history year filter not applied");
   await desktop.screenshot({path:dir+"/v1-history.png",fullPage:false});
   log("History research","PASS","Source-backed bars 5 and year selection 2014");
  }catch(e){failures.push("History research: "+e.message);log("History research","FAIL",e.message)}
  // 5) Mobile viewport, responsive controls and project list.
  try{
   const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,locale:"vi-VN",isMobile:true,hasTouch:true});
   await goto(mobile,"review.html");
   await mobile.waitForFunction(()=>document.querySelector("#kpiProjects")?.textContent?.trim()==="32",{timeout:25000});
   // Verify the mobile masthead survives two-part QILUVI / QiMap branding.
   const brandViewport=await mobile.evaluate(()=>{
      const logo=document.querySelector(".qimap-brand-lockup")?.getBoundingClientRect();
      return {width:innerWidth,logoRight:logo?.right||0,logoLeft:logo?.left||0,logoHeight:logo?.height||0};
   });
   assert(brandViewport.logoRight<=brandViewport.width+8&&brandViewport.logoHeight>20,
      "QiMap mobile masthead clipped: "+JSON.stringify(brandViewport));
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
