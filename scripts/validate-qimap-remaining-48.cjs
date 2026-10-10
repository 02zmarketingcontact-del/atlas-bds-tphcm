"use strict";
const fs=require("node:fs"),get=x=>JSON.parse(fs.readFileSync(x,"utf8"));
const idx=get("data/project_search_index.json"),geo=get("data/qimap_gis_reference_overlay_20261010.json");
const review=get("data/qimap_public_geo_review_20261010.json"),old=get("data/projects.json");
const data=get("data/qimap_remaining_48_osm_cluster_candidates_20261010.json");
const core=new Set([...idx.records.map(x=>x.id),...review.discovery_candidates.map(x=>x.id)]);
const pinned=new Set([...old.map(x=>"map-"+x.id),...review.pins.map(x=>x.id),...geo.candidates.map(x=>x.id)]);
const seen=new Set();
function ck(b,m){if(!b)throw Error(m)}
ck(core.size===153&&pinned.size===105&&data.baseline.missing===48,"cohort baseline mismatch");
ck(data.records.length===7,"expected seven candidates");
for(const p of data.records){
ck(core.has(p.dossier_id)&&!pinned.has(p.dossier_id),"already mapped or outside core "+p.dossier_id);
ck(!seen.has(p.dossier_id),"duplicate "+p.dossier_id);seen.add(p.dossier_id);
ck(p.level==="REFERENCE_UNVERIFIED"&&!p.publication_approved&&!p.developer_specific_address_verified,"false confirmation "+p.dossier_id);
ck(p.wgs84.crs==="EPSG:4326"&&p.wgs84.x===p.wgs84.lng&&p.wgs84.y===p.wgs84.lat,"CRS mismatch "+p.dossier_id);
ck(p.wgs84.lat>9&&p.wgs84.lat<12&&p.wgs84.lng>105&&p.wgs84.lng<109,"out of region "+p.dossier_id);
ck(p.osm_element_urls.length>0&&p.osm_element_urls.every(x=>x.startsWith("https://www.openstreetmap.org/")),"missing OSM citation "+p.dossier_id);
}
console.log("QIMAP GIS REVIEW PASS: 105 public GPS, 7 additional OSM-only cluster candidates under draft review, 41 other core dossiers without candidate, 0 new VERIFIED.");
