"use strict";
const fs=require("node:fs"),read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const master=read("data/project_search_index.json").records,legacy=read("data/projects.json");
const layer=read("data/qimap_public_geo_review_20261010.json");
const extra=read("data/qimap_additional_discovery_20261010.json").records;
const pinned=new Set([...legacy.map(p=>"map-"+p.id),...layer.pins.map(p=>p.id)]);
const targets=[...master.filter(p=>!pinned.has(p.id)),...layer.discovery_candidates,...extra];
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const strip=s=>norm(s).replace(/^(chung cu|can ho|khu can ho|khu chung cu|apartment|apartments|toa nha)\s+/,"");
const escape=s=>s.replace(/[.*+?^$(){}|[\]\\]/g,"\\$&");
const bbox={HCMC_old_boundary:"10.56,106.38,11.06,107.05",Binh_Duong_pre_2025:"10.73,106.50,11.38,107.12",Ba_Ria_Vung_Tau_pre_2025:"10.25,106.95,10.88,107.53",Long_An_pre_2025:"10.35,106.25,10.99,106.72"};
const servers=["https://overpass.kumi.systems/api/interpreter","https://overpass.private.coffee/api/interpreter","https://overpass-api.de/api/interpreter"];
const grouped={};for(const p of targets)(grouped[p.region_scope||"HCMC_old_boundary"]??=[]).push(p);
const build=(rows,box)=>{
 const variants=new Set(rows.flatMap(x=>[x.name,...(x.aliases||[])]).map(x=>String(x||"").trim()).filter(x=>x.length>4&&x.length<90));
 const pattern=[...variants].sort((a,b)=>b.length-a.length).map(escape).join("|");
 return '[out:json][timeout:90][maxsize:134217728];nwr["name"~"('+pattern+')",i]('+box+');out center tags qt;';
};
async function query(ql,region){
 let last;
 for(const server of servers){try{
   const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),120000);
   let res;try{res=await fetch(server,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","accept":"application/json"},body:new URLSearchParams({data:ql}),signal:ctl.signal})}finally{clearTimeout(timeout)}
   if(!res.ok)throw Error("HTTP "+res.status);
   const data=await res.json();if(!Array.isArray(data.elements))throw Error("no elements");
   console.log("Overpass",region,server,data.elements.length);return{elements:data.elements,server};
 }catch(e){last=e;console.warn("Overpass fallback",region,server,e.message)}}
 throw new Error("No Overpass server: "+last?.message);
}
function match(objects,rows){
 const found=[];
 for(const obj of objects){
   const lat=obj.lat??obj.center?.lat,lng=obj.lon??obj.center?.lon;
   if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat<9||lat>12||lng<105||lng>109||!obj.tags?.name)continue;
   const label=strip(obj.tags.name);
   for(const row of rows){
     let score=0;
     for(const n of [row.name,...(row.aliases||[])]){
       const t=strip(n);if(t.length<5)continue;
       if(label===t)score=100;
       else if(t.length>=10&&(label.startsWith(t+" ")||label.endsWith(" "+t)))score=Math.max(score,85);
     }
     if(score<85)continue;
     found.push({dossier_id:row.id,name:row.name,osm_name:obj.tags.name,
       lat:+lat.toFixed(7),lng:+lng.toFixed(7),x:+lng.toFixed(7),y:+lat.toFixed(7),crs:"EPSG:4326",
       source_url:"https://www.openstreetmap.org/"+obj.type+"/"+obj.id,
       source_name:"OpenStreetMap contributors, ODbL",osm_building:obj.tags.building||null,osm_landuse:obj.tags.landuse||null,
       osm_addr:[obj.tags["addr:housenumber"],obj.tags["addr:street"],obj.tags["addr:city"]].filter(Boolean).join(" ")||null,
       name_match_score:score,coordVerified:false,publication_gate:"REVIEW_ONLY"});
   }
 }
 return found;
}
async function run(){
 const raw=[],status=[];
 for(const [region,rows] of Object.entries(grouped)){try{
   const {elements,server}=await query(build(rows,bbox[region]||bbox.HCMC_old_boundary),region);
   const hits=match(elements,rows);raw.push(...hits);status.push({region,requested:rows.length,elements:elements.length,hits:hits.length,server,success:true});
 }catch(e){status.push({region,requested:rows.length,success:false,error:String(e.message)});console.error(region,e.message)}}
 const byId={};for(const v of raw)(byId[v.dossier_id]??=[]).push(v);
 const unique=[],ambiguous=[];
 for(const [id,rows] of Object.entries(byId)){
   const exact=rows.filter(x=>x.name_match_score===100);
   if(exact.length===1)unique.push({...exact[0],review:"OSM_NAME_UNIQUE_PENDING_OFFICIAL_ADDRESS"});
   else if(rows.length===1)unique.push({...rows[0],review:"OSM_BOUNDARY_NAME_PENDING_OFFICIAL_ADDRESS"});
   else ambiguous.push({dossier_id:id,reason:"multiple OSM places for same project/phase",candidates:rows.slice(0,20)});
 }
 const report={schema_version:"1.0",created_at:new Date().toISOString(),source:"OpenStreetMap Overpass API",license:"ODbL © OpenStreetMap contributors",status:"RESEARCH_ONLY",
   rule:"One OSM named feature is NOT proof of legally exact GIS. Google Maps data not extracted or reused.",baseline:{indexed:master.length,legacy_markers:legacy.length,preview_markers:layer.pins.length,missing:targets.length},
   region_status:status,candidates:unique,conflicts:ambiguous,counts:{unique:unique.length,conflicts:ambiguous.length,total_matches:raw.length,unmatched:targets.length-Object.keys(byId).length}};
 fs.writeFileSync("data/qimap_osm_name_candidates_20261010.json",JSON.stringify(report,null,2)+"\n");
 console.log("QIMAP_GIS_BATCH",JSON.stringify(report.counts));
 if(!status.some(x=>x.success))process.exitCode=2;
}
run().catch(e=>{console.error("QIMAP_GIS_FATAL",e);process.exitCode=1});
