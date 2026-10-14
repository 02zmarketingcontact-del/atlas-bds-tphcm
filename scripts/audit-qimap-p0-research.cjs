"use strict";
// P0 staged research auditor. Do not promote any candidate into production.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),"utf8"));
const goodUrl=u=>{try{const x=new URL(String(u));return /^https?:$/.test(x.protocol)?x.href:null}catch{return null}};
const catalog=read("data/project_search_index.json"),valid=new Set(catalog.records.map(x=>x.id));
assert.equal(valid.size,catalog.records.length,"Duplicate canonical IDs");
const files=fs.readdirSync(path.join(root,"data")).filter(f=>/^qimap_p0_.*_batch\d{2}(?:_review_only)?\.json$/.test(f)).sort();
if(!files.length)throw Error("No P0 staged batches. Run on PR #77 research checkout, not main.");
const byId=new Map(),declaredURLs=new Set(),observedURLs=new Set(),batches=[],prices=[],blockers=[],fatal=[];
const issue=(list,type,details)=>list.push(Object.assign({type},details));
const kinds=new Set(["PRICE_ASKING","RENT_ASKING","REPORT_ESTIMATE","PRIMARY_ASKING","SECONDARY_ASKING","RESEARCH_ESTIMATE"]);
for(const file of files){
 const batch=read("data/"+file),dossiers=batch.dossiers||[],observations=batch.price_observations||[];
 if(!Array.isArray(dossiers)||!dossiers.length){issue(fatal,"missing_dossiers",{file});continue}
 if(!/REVIEW|DRAFT|NOT_PUBLIC|NOT_PUBLISHED/i.test(String(batch.publication_status||"")))
   issue(fatal,"batch_not_research_only",{file,publication_status:batch.publication_status});
 const sources=[...(batch.sources||[]),...(batch.supplementary_sources||[])],urlById=new Map();
 for(const s of sources){const u=goodUrl(typeof s==="string"?s:s.url||s.source_url);if(!u)continue;
   declaredURLs.add(u);observedURLs.add(u);if(s.id)urlById.set(s.id,u)}
 const facts=Array.isArray(batch.fact_candidates)?batch.fact_candidates:dossiers.flatMap(d=>d.facts||[]);
 for(const f of facts){const u=goodUrl(f?.source_url||f?.url);if(u)observedURLs.add(u)}
 for(const d of dossiers){const id=d.project_id||d.id||d.canonical_id;
   if(!id){issue(fatal,"missing_project_id",{file});continue}
   const prior=byId.get(id)||[];prior.push(file);byId.set(id,prior);
   if(!valid.has(id)&&!id.startsWith("candidate-"))issue(fatal,"unknown_project_id",{file,id})
 }
 if(!Array.isArray(observations)){issue(fatal,"bad_observations",{file});continue}
 for(let i=0;i<observations.length;i++){
   const p=observations[i],kind=p.type||p.price_type||p.classification||p.observation_type||null;
   const project_id=p.project_id||p.canonical_project_id||null,reference_ids=[...(p.source_ids||[]),p.source_id].filter(Boolean);
   let source_url=goodUrl(p.source_url||p.url||p.evidence_url);
   if(!source_url)for(const id of reference_ids){if(urlById.has(id)){source_url=urlById.get(id);break}}
   if(source_url)observedURLs.add(source_url);
   const staging_id=p.observation_id||file+":row-"+(i+1);
   const date=p.observed_at||p.pricing_date||p.effective_event_date||p.source_published_at||
     p.source_publication_date||p.published_at||p.listing_publication_date||p.date||null;
   prices.push({
     staging_id,project_id,kind,evidence_date_as_reported:date,source_url,source_ids:reference_ids,
     batch_file:file,status:"REVIEW_ONLY",rights_status:"AUTOMATED_FEED_NOT_AUTHORIZED",
     area_basis_as_reported:p.area_basis||p.price_basis||p.offer_basis||null,
     amount_fields:Object.fromEntries(Object.entries(p).filter(([k,v])=>
       /^(amount.*|value.*|price_per_sqm|price_unit|currency|vat|VAT|maintenance_fee|maintenance_fund)$/i.test(k)
       &&["number","string","boolean"].includes(typeof v))),
     no_transaction_inference:true,no_per_m2_inference:true
   });
   if(!kinds.has(kind))issue(fatal,"invalid_price_kind",{file,staging_id,kind});
   if(!project_id||(!valid.has(project_id)&&!project_id.startsWith("candidate-")))
     issue(fatal,"price_project_not_recognized",{file,staging_id,project_id});
   if(!source_url)issue(blockers,"unresolved_price_source",{file,staging_id,reference_ids});
   if(kind==="TRANSACTION_VERIFIED"||p.verified_transaction===true||p.transaction_verified===true||
     p.approved_for_publication===true||p.publish_allowed===true)
     issue(fatal,"unsafe_verified_or_published_price",{file,staging_id});
 }
 batches.push({file,publication_status:batch.publication_status,dossier_rows:dossiers.length,facts:facts.length,
   price_rows:observations.length,source_rows:sources.length,conflicts:(batch.review_conflicts||batch.conflicts||[]).length||0});
}
const missing=[...valid].filter(id=>!byId.has(id)).sort(),extras=[...byId.keys()].filter(id=>!valid.has(id)).sort();
const duplicate=[...byId].filter(([id,ls])=>ls.length>1).map(([id,source_batches])=>({id,source_batches}));
for(const id of missing)issue(blockers,"canonical_uncovered",{id});
for(const id of extras)issue(blockers,"extra_noncanonical_candidate",{id,source_batches:byId.get(id)});
for(const x of duplicate)issue(blockers,"duplicated_across_batches",x);
const feed=read("data/feeds/source_registry.json"),sync=read("data/update_status.json");
assert.equal(feed.feeds.length,0,"Authorized feeds changed; refresh policy");
assert.equal(sync.status,"not_configured","Live sync state changed; refresh policy");
assert.equal(sync.sources_configured,0,"Price sync connected; refresh policy");
assert.equal(Object.keys(read("data/price_history.json")).length,0,"Public price history changed; review separately");
assert.equal(read("data/rent_listings.json").length,0,"Public rent inventory changed; review separately");
const priceKinds={};for(const p of prices)priceKinds[p.kind]=(priceKinds[p.kind]||0)+1;
const report={
  schema_version:"1.0",generated_at:new Date().toISOString(),
  scope:"Research-only P0 staged PR data; NEVER publish without rights/identity/source review",
  canonical_count:valid.size,batch_count:batches.length,dossier_rows:batches.reduce((a,x)=>a+x.dossier_rows,0),
  unique_candidate_ids:byId.size,canonical_covered:valid.size-missing.length,
  missing,extras,duplicate,price_rows:prices.length,price_kinds:priceKinds,
  fact_rows:batches.reduce((a,x)=>a+x.facts,0),
  unique_declared_urls:declaredURLs.size,unique_all_urls:observedURLs.size,
  conflicts:batches.reduce((a,x)=>a+x.conflicts,0),
  approved_transactions:0,new_verified_coordinates:0,authorized_feeds:0,publications:0,
  blockers,fatal,batches,
  coverage:[...byId].sort(([a],[b])=>a.localeCompare(b)).map(([id,sources])=>({id,canonical:valid.has(id),sources})),
  review_only_observations:prices
};
const out=path.join(root,"artifacts");fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"qimap-p0-research-audit.json"),JSON.stringify(report,null,2)+"\n");
const fields=["staging_id","project_id","kind","evidence_date_as_reported","source_url","batch_file","status"];
const quote=v=>'"'+String(v==null?"":v).replaceAll('"','""')+'"';
fs.writeFileSync(path.join(out,"qimap-p0-observations-review.csv"),
  [fields.join(","),...prices.map(x=>fields.map(k=>quote(x[k])).join(","))].join("\n")+"\n");
console.log("QIMAP_P0_AUDIT "+JSON.stringify({
 batches:report.batch_count,rows:report.dossier_rows,covered:report.canonical_covered+"/"+valid.size,
 extras,duplicate:duplicate.map(x=>x.id),price_rows:report.price_rows,
 price_kinds:priceKinds,urls:report.unique_declared_urls,blockers:blockers.length,fatal:fatal.length
}));
if(fatal.length){console.error("FATAL",JSON.stringify(fatal));process.exitCode=1}
if(process.argv.includes("--strict")&&blockers.length){
 console.error("PROMOTION_BLOCKED",JSON.stringify(blockers));process.exitCode=1
}
