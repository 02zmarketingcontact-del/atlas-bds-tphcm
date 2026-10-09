"use strict";
// ATLAS public developer source monitor: no login, no scraping of listing sites or personal data.
const fs=require("node:fs"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const reg=JSON.parse(fs.readFileSync("data/developer_official_registry.json","utf8"));
const old=JSON.parse(fs.readFileSync("data/developer_source_monitor_state.json","utf8"));
const HOSTS=["sonkimland.vn","keppel.com","gamudaland.com.vn","novaland.com.vn","masterisehomes.com","vinhomes.vn","phumyhung.vn","mizuki.vn","akari.vn","bcons.com.vn","c-holdings.vn","phatdat.com.vn","angia.com.vn","capitaland.com","hungthinhcorp.com.vn","dic.vn","refico.com.vn","lephong.vn"];
const UA="ATLASOfficialSourceMonitor/1.0 (+https://github.com/02zmarketingcontact-del/atlas-bds-tphcm)";
const now=()=>new Date().toISOString(),hash=s=>crypto.createHash("sha256").update(s).digest("hex").slice(0,28);
const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/\s+/g," ").trim();
function allowedURL(raw){try{const u=new URL(raw);return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&HOSTS.some(h=>u.hostname===h||u.hostname.endsWith("."+h))?u:null}catch{return null}}
function validate(){const projects=JSON.parse(fs.readFileSync("data/projects.json","utf8"));assert.equal(projects.length,reg.projects.length);const expected=new Set(projects.map(p=>p.id)),seen=new Set();for(const p of reg.projects){assert(expected.has(p.project_id)&&!seen.has(p.project_id),"Unknown or duplicate "+p.project_id);seen.add(p.project_id);if(p.source){assert(allowedURL(p.source.url),"Untrusted URL "+p.source.url);assert.equal(p.source_status,"developer_brand_domain_verified")}else assert.equal(p.source_status,"official_site_discovery_pending")}}
function decode(s){return String(s).replace(/&#(x[0-9a-f]+|\d+);/gi,(_,v)=>{const n=v[0].toLowerCase()==="x"?parseInt(v.slice(1),16):parseInt(v,10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):" "}).replace(/&(nbsp|amp|lt|gt|quot);/gi,(_,v)=>({nbsp:" ",amp:"&",lt:"<",gt:">",quot:'"'}[v.toLowerCase()]))}
function toText(s){return normalize(decode(s.replace(/<!--[\s\S]*?-->/g," ").replace(/<(script|style|svg|noscript|footer|nav|form)\b[^>]*>[\s\S]*?<\/\1>/gi," ").replace(/<[^>]*>/g," ")))}
const topics={project_scale:/quy mo|dien tich|hecta|mat do xay dung/,units_towers:/so can|can ho|toa thap|tang cao|block|tower/,timeline:/khoi cong|cat noc|ban giao|tien do|hoan thanh/,sales_policy:/gia ban|chinh sach ban|uu dai|mo ban|bang gia/,legal:/phap ly|giay phep|so huu|nguoi nuoc ngoai/,location:/vi tri|tiep giap|metro|tram tau|ket noi/};
function inspect(html,entries){
 const title=decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/<[^>]*>/g," ").trim().slice(0,140);
 const body=toText(html),parts=[],matched=[];
 for(const p of entries)for(const term of p.match_terms){const s=normalize(term),i=s.length>=5?body.indexOf(s):-1;if(i>=0){matched.push(p.project_id);parts.push(body.slice(Math.max(0,i-100),Math.min(body.length,i+950)));break}}
 const direct=entries.some(p=>p.source.role!=="developer_portfolio");
 const focus=normalize(parts.join(" | ")+(direct?" "+body.slice(0,7500):""));
 return{title,matched,signal_topics:Object.entries(topics).filter(([_,rx])=>rx.test(focus)).map(([k])=>k),digest:matched.length&&focus.length>40?hash(focus):null};
}

function stageFactCandidates(html,entries,url){
 // These are source-reported candidates, not verified project facts.
 // Only project-specific publisher pages qualify; generic corporate homepages do not.
 const body=toText(html),out=[];
 const specs=[
  ["land_area_hectare",/(?:tong dien tich|dien tich khu dat|dien tich dat|quy mo)[^0-9]{0,44}(\d{1,4}(?:[.,]\d{1,4})?)\s*(ha|hecta)\b/g],
  ["land_area_m2",/(?:tong dien tich|dien tich khu dat|quy mo)[^0-9]{0,44}(\d{1,3}(?:[.,]\d{3})*|\d{4,7})\s*(m2|m²)\b/g],
  ["tower_count",/(\d{1,2})\s*(toa thap|toa nha|block)\b/g],
  ["apartment_count",/(\d{1,3}(?:[.,]\d{3})+|\d{4,6})\s*can ho\b/g],
  ["handover_year",/(?:du kien ban giao|ban giao)[^0-9]{0,50}(20\d{2})\b/g]
 ];
 for(const project of entries){
  if(project.source.role==="developer_portfolio")continue;
  const term=project.match_terms.map(normalize).filter(x=>x.length>4).find(x=>body.includes(x));
  if(!term)continue;
  const at=body.indexOf(term),focus=body.slice(Math.max(0,at-80),Math.min(body.length,at+9000));
  for(const [field,pattern] of specs){
   pattern.lastIndex=0;let match,count=0;
   while((match=pattern.exec(focus))!==null&&count<2){
    out.push({project_id:project.project_id,field,raw_candidate:String(match[1]).slice(0,24),reported_unit:String(match[2]||"year").slice(0,12),source_url:url,status:"UNVERIFIED_REVIEW_REQUIRED",evidence_method:"limited_public_official_page_regex",observed_at:now()});count++;
   }
  }
 }
 return out.slice(0,25);
}

function robotsAllowed(content,path){
 const groups=[];let agents=[],rules=[];
 const flush=()=>{if(agents.length)groups.push({agents,rules});agents=[];rules=[]};
 for(const line of String(content).split(/\r?\n/)){const m=line.replace(/#.*/,"").trim().match(/^([\w-]+)\s*:\s*(.*)$/);if(!m)continue;const key=m[1].toLowerCase(),val=m[2].trim();if(key==="user-agent"){if(rules.length)flush();agents.push(val.toLowerCase())}else if((key==="allow"||key==="disallow")&&agents.length)rules.push({key,path:val})}flush();
 let groupsToUse=groups.filter(g=>g.agents.some(a=>a!=="*"&&"atlasofficialsourcemonitor".includes(a)));
 if(!groupsToUse.length)groupsToUse=groups.filter(g=>g.agents.includes("*"));
 let best=-1,allow=true;
 for(const r of groupsToUse.flatMap(g=>g.rules)){if(!r.path)continue;const expr="^"+r.path.split("*").map(x=>x.replace(/[^\w]/g,"\\$&")).join(".*");try{if(new RegExp(expr).test(path)&&(r.path.length>best||(r.path.length===best&&r.key==="allow"))){best=r.path.length;allow=r.key==="allow"}}catch{}}
 return allow;
}
async function download(raw,kind="page",depth=0){
 const u=allowedURL(raw);if(!u||depth>2)throw Error("untrusted_url_or_redirect");
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),13000);
 try{
  const res=await fetch(u.href,{redirect:"manual",signal:ctrl.signal,headers:{"User-Agent":UA,Accept:kind==="robots"?"text/plain":"text/html,application/xhtml+xml"}});
  if([301,302,303,307,308].includes(res.status)){const target=new URL(res.headers.get("location")||"",u.href);if(!allowedURL(target.href)||target.hostname.replace(/^www\./,"")!==u.hostname.replace(/^www\./,""))throw Error("offsite_redirect_blocked");return download(target.href,kind,depth+1)}
  if(kind==="robots"&&res.status===404)return{status:404,body:""};
  if(!res.ok)return{status:res.status,body:""};
  if(kind==="page"&&!/(html|xhtml)/i.test(res.headers.get("content-type")||""))throw Error("non_html_page");
  const reader=res.body?.getReader();if(!reader)throw Error("empty_response");
  const parts=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;const n=Math.min(value.byteLength,750000-size);if(n>0)parts.push(Buffer.from(value.slice(0,n)));size+=n;if(size>=750000){await reader.cancel();break}}
  return{status:res.status,body:Buffer.concat(parts).toString("utf8")};
 }finally{clearTimeout(timer)}
}
const robotCache=new Map();
async function checkPolicy(url){const u=new URL(url);if(!robotCache.has(u.origin))robotCache.set(u.origin,(async()=>{try{const r=await download(u.origin+"/robots.txt","robots");return r.status===404?{ok:true,text:""}:r.status===200?{ok:true,text:r.body}:{ok:false,reason:"robots_http_"+r.status}}catch(e){return{ok:false,reason:"robots_unavailable_"+e.message}}})());const res=await robotCache.get(u.origin);return res.ok?{allowed:robotsAllowed(res.text,u.pathname+u.search),reason:"robots_disallow"}:{allowed:false,reason:res.reason}}
async function auditOne(page){
 const prior=old.sources?.[page.url]||{},out={url:page.url,projects:page.projects.map(p=>p.project_id),checked_at:now(),changed:false};
 try{
  const policy=await checkPolicy(page.url);if(!policy.allowed)return{...out,status:"skipped_robots",reason:policy.reason};
  const fetched=await download(page.url);out.http_status=fetched.status;
  if(fetched.status===403||fetched.status===429)return{...out,status:"blocked_by_publisher",reason:"HTTP "+fetched.status};
  if(fetched.status!==200)return{...out,status:"http_error",reason:"HTTP "+fetched.status};
  const evidence=inspect(fetched.body,page.projects);out.title=evidence.title;out.project_mentions=evidence.matched;out.signal_topics=evidence.signal_topics;out.digest=evidence.digest;out.candidate_claims=stageFactCandidates(fetched.body,page.projects,page.url);
  if(!evidence.digest)return{...out,status:"no_project_text_on_official_page"};
  out.changed=!!prior.digest&&prior.digest!==out.digest;
  out.status=out.changed?"source_changed":prior.digest?"unchanged":"baseline_created";
  return out;
 }catch(e){return{...out,status:"fetch_error",reason:String(e.message).slice(0,160)}}
}
function selfTest(){
 validate();assert.equal(normalize("LUMIÈRE Boulevard"),"lumiere boulevard");
 assert.equal(robotsAllowed("User-agent: *\nDisallow: /private\nAllow: /private/public\n","/private/data"),false);
 assert.equal(robotsAllowed("User-agent: *\nDisallow: /private\nAllow: /private/public\n","/private/public/doc"),true);
 const p=[{project_id:"eaton",match_terms:["Eaton Park"],source:{role:"developer_project"}}];
 const a=inspect("<h1>Eaton Park</h1><div>Diện tích 3.7 hecta, 1968 căn hộ</div>",p),b=inspect("<h1>Eaton Park</h1><div>Diện tích 4.2 hecta, 1968 căn hộ</div>",p);
 assert(a.digest&&a.digest!==b.digest);const staged=stageFactCandidates("<h1>Eaton Park</h1><p>Tong dien tich 3.7 ha. 6 toa thap. 1980 can ho.</p>",p,"https://www.gamudaland.com.vn/vn/developments/township/eaton-park");assert(staged.length>=2,"Expected factual candidate stage");assert.equal(allowedURL("https://evil.example.org"),null);assert.equal(allowedURL("http://vinhomes.vn"),null);
 console.log("ATLAS WATCH SELF-TEST PASS: 32 projects; verified-source filtering, robots rules and change hashing");
}
async function run(){
 validate();const byURL=new Map(),byHost=new Map();
 for(const p of reg.projects){if(!p.source)continue;const url=p.source.url;if(!byURL.has(url))byURL.set(url,{url,projects:[]});byURL.get(url).projects.push(p)}
 for(const page of byURL.values()){const h=new URL(page.url).hostname;if(!byHost.has(h))byHost.set(h,[]);byHost.get(h).push(page)}
 let i=0;const result=[];const groups=[...byHost.values()];
 const worker=async()=>{while(i<groups.length){const idx=i++;if(idx>=groups.length)break;for(const page of groups[idx]){result.push(await auditOne(page));await new Promise(r=>setTimeout(r,400))}}};
 await Promise.all(Array.from({length:Math.min(3,groups.length)},worker));result.sort((a,b)=>a.url.localeCompare(b.url));
 const state=JSON.parse(JSON.stringify(old));state.last_run_at=now();state.status="checked";state.sources=state.sources||{};state.projects={};const alerts=[];
 for(const r of result){
  const before=state.sources[r.url]||{};
  if(r.changed)alerts.push({url:r.url,projects:r.projects,kind:"source_content_changed",candidate_topics:r.signal_topics||[]});
  if(before.last_success_at&&["skipped_robots","blocked_by_publisher","http_error","fetch_error"].includes(r.status)&&before.last_status!==r.status)alerts.push({url:r.url,projects:r.projects,kind:"previous_source_now_unavailable"});
  state.sources[r.url]={checked_at:r.checked_at,last_status:r.status,last_http_status:r.http_status||null,title:r.title||before.title||null,project_mentions:r.project_mentions||[],signal_topics:r.signal_topics||[],digest:r.digest||before.digest||null,last_success_at:["unchanged","baseline_created","source_changed"].includes(r.status)?r.checked_at:before.last_success_at||null,reason:r.reason||null};
 }
 for(const p of reg.projects){const r=p.source?result.find(x=>x.url===p.source.url):null;state.projects[p.project_id]={name:p.name,official_brand_site:p.source?.url||null,last_checked_at:r?.checked_at||null,monitor_status:r?.status||"official_source_discovery_pending",explicit_project_mention:!!r?.project_mentions?.includes(p.project_id),auto_published_facts:0}}
 const count={all_projects:reg.projects.length,assigned_official_brands:reg.projects.filter(p=>p.source).length,pending_official_source:reg.projects.filter(p=>!p.source).length,unique_source_pages:byURL.size,pages_with_project_text:result.filter(r=>["unchanged","baseline_created","source_changed"].includes(r.status)).length,changed_pages:result.filter(r=>r.changed).length,errors_or_robots:result.filter(r=>["skipped_robots","blocked_by_publisher","http_error","fetch_error"].includes(r.status)).length,publisher_portfolio_without_project:result.filter(r=>r.status==="no_project_text_on_official_page").length,fact_candidates_staged:result.flatMap(r=>r.candidate_claims||[]).length};state.summary=count;
 const report={schema_version:"1.0",run_at:state.last_run_at,summary:count,alerts,checks:result,discovery_queue:reg.projects.filter(p=>!p.source).map(p=>({project_id:p.project_id,name:p.name})),auto_published_property_facts:0,publication_gate:"Evidence must be reviewed before updating legal, launch, handover, foreign quota and price records."};
 fs.mkdirSync("artifacts",{recursive:true});fs.writeFileSync("data/developer_source_monitor_state.json",JSON.stringify(state,null,2)+"\n");fs.writeFileSync("artifacts/developer-daily-audit.json",JSON.stringify(report,null,2)+"\n");const candidateBatch={schema_version:"1.0",last_run_at:state.last_run_at,review_state:"unverified_research_candidates_only",source_preference:"issuer project-specific official pages first",auto_published_project_facts:0,format:"number and unit extraction from public pages; no page excerpts republished",candidates:result.flatMap(r=>r.candidate_claims||[]),caveats:["Do not treat number snippets as audited project facts","Project-specific facts need legal publisher cross-check and human verification","No numbers from generic portfolio pages are used"],workflow:"ATLAS daily official developer source review"};
 fs.writeFileSync("data/developer_fact_candidates.json",JSON.stringify(candidateBatch,null,2)+"\n");
 fs.writeFileSync("artifacts/developer-field-candidates.json",JSON.stringify(candidateBatch,null,2)+"\n");
 const lines=["# ATLAS Official Developer Source Daily Watch","","Checked UTC: "+state.last_run_at,"Developer-brand URLs attached: "+count.assigned_official_brands+"/32","Publisher pages with project-specific text: "+count.pages_with_project_text+"/"+count.unique_source_pages,"Changed source fingerprints: "+count.changed_pages,"Errors/robots blocks: "+count.errors_or_robots,"","| Official URL | Project IDs | Status |","|---|---|---|"];
 for(const r of result)lines.push("| "+r.url+" | "+r.projects.join(", ")+" | "+r.status+" |");
 lines.push("","**Auto-published prices, legal or project details: 0.**");fs.writeFileSync("artifacts/developer-daily-audit.md",lines.join("\n")+"\n");
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,lines.slice(0,9).join("\n")+"\n");
 console.log("ATLAS DAILY MONITOR",JSON.stringify(count));console.log("ALERTS",alerts.length);
 if(!count.pages_with_project_text){console.error("No project-specific public sources readable; check publisher websites.");process.exitCode=1}
}
if(process.argv.includes("--self-test"))selfTest();else run().catch(e=>{console.error("FATAL",e);process.exitCode=1});
