// Probe OSM nodes/ways for Metro station locations and bus stops near existing Atlas projects.
// One bounded query; no personal data, no private provider keys. Artifacts require manual review before publication.
const fs=require("node:fs"),path=require("node:path");
const httpTimeout=38000;
const bbox=[10.69,106.62,10.93,106.88];
const endpoints=["https://overpass.kumi.systems/api/interpreter","https://overpass-api.de/api/interpreter","https://overpass.nchc.org.tw/api/interpreter"];
const query='[out:json][timeout:35];(nwr["railway"="station"]["station"="subway"]('+bbox.join(",")+');nwr["railway"="station"]["subway"="yes"]('+bbox.join(",")+');node["highway"="bus_stop"]('+bbox.join(",")+'););out center;';
const projects=JSON.parse(fs.readFileSync("data/projects.json","utf8"));
const outDir=path.join(process.cwd(),"artifacts");fs.mkdirSync(outDir,{recursive:true});
function distanceKm(a,b,c,d){const rad=Math.PI/180,r=6371,dlat=(c-a)*rad,dlon=(d-b)*rad,x=Math.sin(dlat/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(dlon/2)**2;return 2*r*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
async function getData(){let errors=[];for(const endpoint of endpoints){try{let ctrl=new AbortController();let t=setTimeout(()=>ctrl.abort(),httpTimeout);let res;try{res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8","User-Agent":"ATLAS-HCMC-transit-research/1.0 (github.com/02zmarketingcontact-del/atlas-bds-tphcm)","Accept":"application/json"},body:"data="+encodeURIComponent(query),signal:ctrl.signal});}finally{clearTimeout(t)}if(!res.ok)throw Error("HTTP "+res.status);const raw=await res.text();if(raw.length>16e6)throw Error("Oversized response "+raw.length);const data=JSON.parse(raw);if(!Array.isArray(data.elements))throw Error("Invalid Overpass JSON");return{data,endpoint}}catch(err){errors.push(endpoint+" "+err.message);console.warn("ATLAS OVERPASS RETRY",endpoint,err.message)}}throw Error("OSM endpoints unavailable: "+errors.join("; "))}
function collection(type,features,source){return{type:"FeatureCollection",metadata:{title:type,source:"OpenStreetMap contributors via Overpass",source_url:"https://www.openstreetmap.org/copyright",endpoint:source,attribution:"© OpenStreetMap contributors",license:"ODbL",bbox,reviewed:false,observed_at:new Date().toISOString(),commercial_use_note:"Respect attribution and ODbL requirements. Check actual timetable with official operator.",record_count:features.length},features}}
(async()=>{const {data,endpoint}=await getData();const nodes=new Map();for(const e of data.elements){const lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;const tags=e.tags||{};const isStation=tags.station==="subway"||tags.subway==="yes";const isBus=tags.highway==="bus_stop";if(!isBus&&!isStation)continue;const osmId=e.type+"/"+e.id;
if(nodes.has(osmId))continue;
const dist=Math.min(...projects.map(p=>distanceKm(lat,lon,Number(p.lat),Number(p.lng))));
if(isBus && dist>2.5)continue;
const category=isStation?"metro_station":"bus_stop";
const feature={type:"Feature",id:osmId,properties:{name:String(tags["name:vi"]||tags.name||((isStation?"Ga metro":"Điểm dừng xe buýt")+" "+e.id)).slice(0,110),category,osm_id:osmId,operator:tags.operator||null,osm_url:"https://www.openstreetmap.org/"+e.type+"/"+e.id,data_source:"openstreetmap",verified_official:false,position_type:"osm_recorded",last_checked:new Date().toISOString().slice(0,10)},geometry:{type:"Point",coordinates:[lon,lat]}};
nodes.set(osmId,feature);
}
const all=[...nodes.values()],stations=all.filter(x=>x.properties.category==="metro_station"),bus=all.filter(x=>x.properties.category==="bus_stop").slice(0,1600);
const stationGeo=collection("Metro/subway stations in sampled OSM area",stations,endpoint),busGeo=collection("Bus stops near current Atlas sample projects",bus,endpoint);
fs.writeFileSync(outDir+"/metro_stations_osm.geojson",JSON.stringify(stationGeo,null,2));
fs.writeFileSync(outDir+"/bus_stops_osm.geojson",JSON.stringify(busGeo,null,2));
const report={sources:data.osm3s,endpoint,queried:bbox,raw_elements:data.elements.length,metro_stations:stations.length,bus_stops:bus.length,source:"OpenStreetMap ODbL",ready_for_publication:false};
fs.writeFileSync(outDir+"/transit-report.json",JSON.stringify(report,null,2));
console.log("ATLAS TRANSIT PROBE",JSON.stringify(report));
if(stations.length<3||bus.length<15){console.warn("Insufficient candidate coverage; data remains review-needed, do not auto-publish.")} 
})().catch(err=>{console.error("ATLAS TRANSIT PROBE FAILED",err.message);process.exitCode=1});
