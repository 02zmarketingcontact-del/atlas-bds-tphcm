"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const load=p=>JSON.parse(fs.readFileSync(p,"utf8")),read=p=>fs.readFileSync(p,"utf8");
const legacy=load("data/projects.json"),universe=load("data/apartment_project_expansion_2006_2026.json"),areas=load("data/geographic_audit_grid_2026.json");
const norm=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g,"");
assert.equal(legacy.length,32,"Existing map references should stay at 32 until accurate project pins are reviewed");
assert.equal(universe.projects.length,126,"Expected 126 sourced names/phases");
assert.equal(areas.audit_cells.length,47,"Expected 47 uncompleted geographic review cells");
assert.equal(universe.sources.length,22,"Expected 22 source URLs");
const seenId=new Set(),names=new Set(),states=new Set(["issuer_says_completed","issuer_says_handed_over","historical_portfolio_presence","operating_referenced_by_historic_rental_market","platform_directory_candidate_only","platform_reports_handed_over_unverified"]);
for(const p of universe.projects){
 assert(!seenId.has(p.research_id),"Duplicate research ID "+p.research_id);seenId.add(p.research_id);
 assert(!names.has(norm(p.name)),"Duplicate name "+p.name);names.add(norm(p.name));
 assert(states.has(p.lifecycle_status),"Invalid project status "+p.name);
 assert(/^https:\/\//.test(p.evidence_source?.url||""),"Missing publisher link: "+p.name);
 assert(p.latitude===null&&p.longitude===null,"Geocoding cannot be invented: "+p.name);
 assert(p.observed_resale_price_vnd_m2===null&&p.observed_rent_vnd_month===null,"Price cannot be invented: "+p.name);
 assert(p.has_verified_secondary_offer===false&&p.has_verified_rental_offer===false,"No verified unit feed: "+p.name);
 assert(p.foreign_buyer_quota_verified===false,"Foreign quota unsupported: "+p.name);
 if(p.handover_year!==null)assert(p.handover_year>=2000&&p.handover_year<=2026,"Invalid handover date "+p.name);
}
const completed=universe.projects.filter(p=>["issuer_says_completed","issuer_says_handed_over"].includes(p.lifecycle_status)).length;
assert.equal(completed,55,"Issuer completed/handover claims must remain 55");
const current=new Set(legacy.map(x=>norm(x.name)));
const matches=universe.projects.filter(p=>[p.name,...(p.aliases||[])].some(name=>current.has(norm(name))));
assert(matches.length>=8,"Missing exact/alias reconciliation with mapped projects");
const dossiers=load("data/project_dossiers_v1.json");
assert.equal(dossiers.record_count,150,"Project dossier data must cover 150 names or phases");
assert.equal(dossiers.records.length,150,"Each indexed record requires a dossier");
const searchIndex=load("data/project_search_index.json");
assert.deepEqual(new Set(dossiers.records.map(x=>x.id)),new Set(searchIndex.records.map(x=>x.id)),"Dossier IDs and search universe must align");
for(const d of dossiers.records){
 assert(d.name&&d.source_references.length>0,"Missing source provenance "+d.id);
 assert(Object.keys(d.coverage).length===12,"Coverage fields missing "+d.id);
 assert(d.foreign_buyer_eligibility==="not_verified","Cannot infer foreign buyer quota "+d.id);
 for(const fact of d.specifications)assert(fact.source_url?.startsWith("https://")&&fact.review_status==="publisher_claim_requires_document_review","Published data claim lacks evidence state "+d.id);
}
const html=read("secondary-catalog.html"),script=read("assets/qimap-secondary.js");
new vm.Script(script,{filename:"assets/qimap-secondary.js"});
for(const match of script.matchAll(/\$\("([A-Za-z0-9_-]+)"\)/g))assert(html.includes('id="'+match[1]+'"'),"Missing #"+match[1]);
assert(html.includes("qiluvi-logo-primary.svg"),"QILUVI logo missing from catalogue");
assert(html.includes("assets/qimap-brand.css"),"QiMap theme missing");
for(const page of ["review.html","map-v4.html","history.html"])assert(read(page).includes('href="./secondary-catalog.html"'),"No archive navigation from "+page);
console.log("QIMAP SECONDARY QA PASS",JSON.stringify({mapped:legacy.length,research:universe.projects.length,completedIssuer:completed,matchedToOld:matches.length,combinedDirectEntries:legacy.length+universe.projects.length-matches.length,geographies:areas.audit_cells.length}));
