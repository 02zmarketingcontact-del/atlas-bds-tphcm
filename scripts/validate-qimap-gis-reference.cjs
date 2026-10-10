// QiMap reference overlay integrity gate. Does not label preview pins cadastral VERIFIED.
"use strict";
const fs=require("node:fs");
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
function ensure(x,msg){if(!x)throw Error("QiMap overlay integrity: "+msg)}
const all=read("data/project_search_index.json").records;
const old=read("data/projects.json");
const review=read("data/qimap_public_geo_review_20261010.json");
const data=read("data/qimap_gis_reference_overlay_20261010.json");
const ids=new Set([...all.map(x=>x.id),...review.discovery_candidates.map(x=>x.id)]);
const legacyIds=old.map(x=>"map-"+x.id);
const existing=[...legacyIds,...review.pins.map(x=>x.id)];
const additional=data.candidates;
const combined=[...existing,...additional.map(x=>x.id)];
ensure(ids.size===153,"core cohort must be 153");
ensure(old.length===32&&review.pins.length===9,"legacy and preview reference baseline drift");
ensure(data.counting.new_additional_osm_dossiers===64&&additional.length===64,"new 64 research records expected");
ensure(combined.length===105&&new Set(combined).size===105,"105 distinct IDs required");
ensure(combined.every(x=>ids.has(x)),"GPS pin outside 153 core cohort");
ensure(data.counting.remaining_core_no_geocoordinate===153-combined.length,"remaining denominator");
ensure(data.has_any_new_verified_coordinates===false&&data.counting.independently_gis_verified_new===0,"no new verified claims");
const supported=new Set(["CORROBORATED","REFERENCE_UNVERIFIED"]);
for(const p of additional){
  ensure(supported.has(p.verification_level)&&p.coord_verified===false&&!p.gis_verified,"unverified classification "+p.id);
  ensure(p.crs==="EPSG:4326"&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&p.lat>9&&p.lat<12&&p.lng>105&&p.lng<109,"bad WGS84 "+p.id);
  ensure(p.geo_source_url?.startsWith("https://www.openstreetmap.org/"),"missing licensed OSM source "+p.id);
  ensure(p.osm_license.includes("ODbL")&&p.source_checked_at,"missing attribution/as_of "+p.id);
  if(p.verification_level==="CORROBORATED")ensure(p.official_address_url?.startsWith("https://"),"missing independent location source "+p.id);
}
ensure(additional.filter(x=>x.verification_level==="CORROBORATED").length===24,"24 corroborated source pairs");
ensure(additional.filter(x=>x.verification_level==="REFERENCE_UNVERIFIED").length===40,"40 OSM-only candidate references");
ensure(additional.filter(x=>x.address_conflict).length===1,"address conflict gate");
console.log("QIMAP 105 GIS REFERENCE QA PASS: 153 indexed, 105 research GPS positions, 48 without GPS, 0 new verified.");
