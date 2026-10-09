"use strict";
// QiMap P0 research-only gate. Prevent candidate metadata from silently becoming verified prices or GIS.
const fs=require("node:fs"),assert=require("node:assert/strict");
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const base=read("data/projects.json");
const dossiers=read("data/project_dossiers_v1.json");
const idx=read("data/project_search_index.json");
const registry=read("data/market_source_registry_v1.json");
const price=read("data/p0_market_price_candidates_20261009.json");
const discover=read("data/p0_discovery_candidates_20261009.json");
const gis=read("data/p0_gis_review_20261009.json");
const developerRegistry=read("data/developer_official_registry.json");
const validId=id=>typeof id==="string" && id.length>2;
const https=url=>typeof url==="string" && /^https:\/\/[^/]+/i.test(url);
const P0=["prive","eaton","felix","norton","sycamore","win","elysian"];
assert.equal(base.length,32,"P0 file must not silently enlarge mapped catalog");
assert.equal(dossiers.records.length,150,"Dossier universe count changed without proper index rebuild");
assert.equal(idx.records.length,150,"Search index must remain separately generated");
assert.equal(new Set(idx.records.map(x=>x.id)).size,150,"Duplicate indexed ID");
assert.equal(gis.records.length,P0.length,"Seven P0 GIS reviews required");
const baseById=new Map(base.map(x=>[x.id,x]));
const dossierById=new Map(dossiers.records.map(x=>[x.id,x]));
for(const id of P0){
  const b=baseById.get(id),d=dossierById.get("map-"+id);
  const l=gis.records.find(x=>x.entity_id==="map-"+id);
  assert(b&&d&&l,"Missing P0 project or GIS: "+id);
  assert(d.review_priority==="P0","P0 research must be prioritized: "+id);
  assert(d.coverage.verified_price!=="evidence_or_claim_recorded","No independently verified project price: "+id);
  assert(d.coverage.rental_offer!=="evidence_or_claim_recorded","No independently verified rental: "+id);
  assert(b.priceVerified===false,"Unapproved price leaked to public project JSON: "+id);
  assert(b.coordVerified===false,"Unverified P0 pin promoted as verified: "+id);
  assert(l.new_coordinates_verified===false && l.existing_map_marker_visible===true,"GIS review misrepresented existing pins: "+id);
  assert(l.legacy_map_coordinates_WGS84.latitude===b.lat&&l.legacy_map_coordinates_WGS84.longitude===b.lng,"GIS candidate differs from legacy source: "+id);
  for(const s of d.specifications||[])assert(https(s.source_url)&&s.review_status==="publisher_claim_requires_document_review","Unsafe attributed P0 fact: "+id+"/"+s.field);
}
assert.equal(registry.sources.length,6);
assert.equal(registry.automated_price_feeds_active,0,"No licensed automated ingestion feed exists");
const rights=new Map();
for(const s of registry.sources){
  assert(validId(s.source_id)&&!rights.has(s.source_id),"Duplicate market source ID");
  rights.set(s.source_id,s);
  assert(https(s.website_url));
  assert(s.automated_access_status==="LICENSE_REQUIRED" && s.content_storage_permission==="NOT_CLEARED" && s.price_data_approval==="NOT_APPROVED","Illegal automated source publication risk");
  assert(s.max_automated_checks_per_day===0);
}
assert.equal(price.observations.length,5,"Expect five source-visible portal aggregate asking bands");
assert.equal(price.historical_price_candidates.length,1,"Expect one Elysian historical publisher quote");
for(const o of [...price.observations,...price.historical_price_candidates]){
  assert(dossierById.has(o.entity_id)&&https(o.source_url),"Research observation missing project/source");
  assert(o.approved_for_public_display===false,"Unlicensed candidate must not publish");
  assert(o.verification_status==="SOURCE-REPORTED" && o.task_status==="WAITING_REVIEW");
  assert(o.license_status!=="CLEARED");
}
for(const o of price.observations){
  assert(rights.has(o.source_id));
  assert(o.price_type==="MARKET_RESEARCH_REPORTED" && o.sale_or_rent==="SALE");
  assert(o.primary_secondary_split==="NOT_VERIFIABLE_FROM_AGGREGATE");
  assert(o.minimum_price_vnd_per_m2>0&&o.minimum_price_vnd_per_m2<o.maximum_price_vnd_per_m2);
  assert(o.reported_listing_count>0&&o.confirmed_distinct_apartment_count===0);
  assert(new Date(o.provider_latest_listing_at)<new Date("2026-10-10T00:00:00+07:00"));
}
assert.equal(discover.records.length,3);
for(const x of discover.records){
  assert(!dossierById.has(x.candidate_id)&&!idx.records.some(z=>z.name.toLowerCase()===x.official_name.toLowerCase()),"Discovery candidate already in index");
  assert(x.geo_verified===false&&x.price_verified===false&&x.approved_for_project_master===false);
  assert(https(x.official_publisher_url));
}
assert.equal(gis.location_new_verified_count,0,"No newly verified pins from this round");
assert.equal(gis.changes_to_live_pins,0);
assert(developerRegistry.projects.some(x=>x.project_id==="norton"&&x.source_status==="developer_brand_domain_verified"&&x.source?.url.includes("gamudaland.com.vn")),"Norton publisher monitor was not linked");
console.log("QIMAP P0 RESEARCH VALIDATION PASS:",JSON.stringify({
  sourceReportedP0:P0.length,marketSources:registry.sources.length,
  pendingPortalBands:price.observations.length,historicalPriceQuotes:price.historical_price_candidates.length,
  newlyDiscoveredCandidates:discover.records.length,newlyVerifiedPrices:0,newlyVerifiedCoordinates:0
}));
