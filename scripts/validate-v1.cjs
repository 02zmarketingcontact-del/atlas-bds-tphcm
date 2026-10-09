// ATLAS V1 release gate: source-aware static smoke checks, no network and no writes.
const fs=require("node:fs");
const vm=require("node:vm");
const errors=[];
const test=(ok,msg)=>{if(!ok)errors.push(msg)};
const read=p=>fs.readFileSync(p,"utf8");
const json=p=>JSON.parse(read(p));
const review=read("review.html");
const map=read("map-v4.html");
const history=read("history.html");
const script=read("assets/atlas-review.js");
const mapScript=read("assets/atlas-v4.js");
const css=read("assets/atlas-review.css");
const mapCss=read("assets/atlas-v4.css");
const projects=json("data/projects.json");
const market=json("data/market_history_2006_2026.json");
const source=json("data/source_catalog.json");
for(const [p,src] of [["assets/atlas-review.js",script],["assets/atlas-v4.js",mapScript]]){
  try{new vm.Script(src,{filename:p})}catch(err){errors.push("JS syntax error "+p+": "+err.message)}
}
for(const p of ["review.html","map-v4.html","history.html"]){
  test(read(p).includes('<meta name="viewport"'),"Missing mobile viewport: "+p);
}
const ids=new Set([...review.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]));
for(const ref of [...script.matchAll(/\bel\("([\w-]+)"\)/g)].map(x=>x[1]))test(ids.has(ref),"Missing DOM element in review.html: "+ref);
test(review.includes('src="./map-v4.html?embed=1"'),"Review map iframe missing embedding support");
test(map.includes('classList.add("embedded")'),"Map embedding mode script missing");
test(mapCss.includes("html.embedded .sidebar"),"Map embedding styles missing");
test(map.includes('maplibre-gl@6.13.0'),"MapLibre CDN version unpinned/missing");
test(map.includes("import("),"MapLibre module import missing");
test(map.includes("cdn.jsdelivr.net/npm/maplibre-gl@6.13.0"),"Missing independent CDN fallback");
test(map.includes("researchPromise = import(\"./assets/atlas-v4.js\")"),"Project search must bootstrap independently of CDN map");
test(mapScript.includes("window.QiMapMapBootstrap"),"Delayed map start and no-map lookup fallback missing");
test(mapScript.includes("function initializeMapSafely()"),"Map initialization exception must not break project search");
test(script.includes("data/market_history_2006_2026.json"),"Review uses wrong historical file");
test(history.includes("assets/atlas-history.js") || history.includes("data/market_history_2006_2026.json"),"Historical page must load the 20-year client");
if(history.includes("assets/atlas-history.js")){
 const historyScript=read("assets/atlas-history.js");
 test(historyScript.includes("data/market_history_2006_2026.json"),"History JavaScript missing 20-year dataset");
 try{new vm.Script(historyScript,{filename:"atlas-history.js"})}catch(e){errors.push("History data client syntax: "+e.message)}
}
test(css.length>1000,"review CSS unexpectedly empty");
test(market.temporal_coverage.baseline_year===2006&&market.temporal_coverage.end_year===2026,"wrong history study interval");
test(projects.length>=20,"project sample set unexpectedly small");
const issuerRegistry=json("data/developer_official_registry.json");
const issuerCandidates=json("data/developer_fact_candidates.json");
test(issuerRegistry.projects.length===projects.length,"Official source registry must cover exactly the project catalog");
test(issuerCandidates.auto_published_project_facts===0,"Unverified issuer candidates must not auto-publish");
test(Array.isArray(issuerCandidates.candidates),"Daily issuer candidate file must exist with array field");
const projectIds=new Set(projects.map(p=>p.id));
test(issuerRegistry.projects.every(p=>projectIds.has(p.project_id)),"Unknown ID in official source registry");
test(issuerCandidates.candidates.every(p=>p.status==="UNVERIFIED_REVIEW_REQUIRED"&&projectIds.has(p.project_id)&&typeof p.source_url==="string"),"Issuer candidate provenance/status invalid");
test(source.records?.length>=5,"source rights registry incomplete");
test(market.observations.every(o=>o.source_url&&o.approved_for_public_display===true),"historical display has unsourced/unapproved item");
const historical=market.observations.filter(x=>x.series_id==="savills_hcmc_apartment_sales_2014_2018");
test(historical.length===5,"expected five-source historical chart bars");
const years=historical.map(x=>x.year).sort((a,b)=>a-b).join(",");
test(years==="2014,2015,2016,2017,2018","historical bar chart years changed unexpectedly");
for(const p of projects){
  test(Boolean(p.id&&p.name),"Missing project identity");
  test(p.priceVerified!==true||Boolean(p.priceDateVerified),"verified price missing date: "+p.id);
}
const inline=history.match(/<script>([\s\S]*?)<\/script>/);
try{new vm.Script(inline?.[1]||"",{filename:"history-inline"})}catch(err){errors.push("History inline syntax: "+err.message)}
if(errors.length){
  console.error("ATLAS V1 static review FAILED ("+errors.length+")");
  errors.forEach(x=>console.error("- "+x));
  process.exit(1);
}
console.log("ATLAS V1 static review PASSED");
console.log("Projects: "+projects.length+" | approved history observations: "+market.observations.length+" | historical graph bars: "+historical.length);
console.log("PASS: map embed, CDN import, 20-year scope, project filters, source and DOM integrity.");
