"use strict";
const {chromium}=require("playwright");
(async()=>{
 const b=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const site=(process.env.ATLAS_SITE||"http://127.0.0.1:4173/").replace(/\\/?$/,"/");
 try{
  const page=await b.newPage({viewport:{width:1440,height:900}});
  await page.goto(site+"map-v4.html?p=norton",{waitUntil:"domcontentloaded",timeout:45000});
  await page.locator("#detail.qimap-profile-pane").waitFor({timeout:50000});
  if(!(await page.locator("#detail").innerText()).includes("8 ha"))throw Error("Missing Norton area fact");
  if(!(await page.locator("#detail").innerText()).includes("CĐT"))throw Error("Missing developer verification label");
  if(await page.locator("#detail .qmp-tab").count()!==7)throw Error("Expected seven project tabs");
  await page.getByRole("button",{name:"Vị trí & kết nối"}).click();
  if(!(await page.locator("#detail .qmp-body").innerText()).includes("Metro"))throw Error("Location tab missing metro caveat");
  await page.getByRole("button",{name:"Giá & lịch sử"}).click();
  if(!(await page.locator("#detail .qmp-body").innerText()).includes("55"))throw Error("Market reference value missing");
  await page.getByRole("button",{name:"Pháp lý & SPA"}).click();
  if(!(await page.locator("#detail .qmp-body").innerText()).includes("SPA"))throw Error("SPA caution missing");
  if(await page.locator("#detail .qmp-actions button").count()!==2)throw Error("Export and PDF actions missing");
  await page.goto(site+"map-v4.html?p=empire",{waitUntil:"domcontentloaded",timeout:45000});
  await page.locator("#detail.qimap-profile-pane").waitFor({timeout:50000});
  if(!(await page.locator("#detail").innerText()).includes("CĐT"))throw Error("Generic project lacks pending verification");
  const mobile=await b.newPage({viewport:{width:390,height:844},isMobile:true});
  await mobile.goto(site+"map-v4.html?p=norton",{waitUntil:"domcontentloaded",timeout:45000});
  await mobile.locator("#detail.qimap-profile-pane").waitFor({timeout:50000});
  const rect=await mobile.locator("#detail").boundingBox();
  if(rect.width>400||rect.x<0)throw Error("Mobile detail overflows viewport");
  await mobile.locator("#detail .qmp-close").click();
  if(await mobile.locator("#detail").isVisible())throw Error("Mobile panel failed to close");
  console.log("QIMAP PROFILE BROWSER PASS: Norton, generic project, 7 tabs, mobile panel");
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
