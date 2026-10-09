// Weekly developer-first source availability and project research gap audit.
// Only records metadata/hash/HTTP response, never republishes page content or changes approved price data.
const fs=require("node:fs"),crypto=require("node:crypto");
const path="artifacts";fs.mkdirSync(path,{recursive:true});
const projects=JSON.parse(fs.readFileSync("data/projects.json","utf8"));
const registry=JSON.parse(fs.readFileSync("data/project_developer_sources.json","utf8"));
const urls=[...new Set(registry.projects.flatMap(p=>(p.sources||[]).map(s=>s.url)))];
const audit=[],limit=800000;
async function inspect(url){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),16000);
 try{
  const res=await fetch(url,{method:"GET",redirect:"follow",signal:ctrl.signal,headers:{"User-Agent":"ATLAS-DeveloperSourceAuditor/1.0 (+https://github.com/02zmarketingcontact-del/atlas-bds-tphcm)","Accept":"text/html"}});
  const text=String(await res.text()).slice(0,limit);
  const title=text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]*>/g,"").trim().slice(0,150)||"";
  const hash=crypto.createHash("sha256").update(text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/\s+/g," ").slice(0,250000)).digest("hex").slice(0,24);
  return{url,final_url:res.url,http_status:res.status,reachable:res.ok,title,html_digest_short:hash,source_check_only:true};
 }catch(err){return{url,reachable:false,error:err.message,source_check_only:true}}finally{clearTimeout(timer)}
}
(async()=>{
 for(const url of urls)audit.push(await inspect(url));
 const indexed=new Set(registry.projects.map(p=>p.project_id));
 const unresearched=projects.filter(p=>!indexed.has(p.id)).map(p=>({id:p.id,name:p.name,development_brand:p.developer,priority:"find owner corporate domain"}));
 const report={checked_at:new Date().toISOString(),scope:"developer/project websites only",checked_urls:audit.length,reachable:audit.filter(x=>x.reachable).length,unresearched_projects:unresearched.length,source_checks:audit,research_queue:unresearched,data_changed:false,publication:"No auto-publication. Review corporate ownership, legal entity, source permission and content before accepting new claims."};
 fs.writeFileSync(path+"/developer-source-audit.json",JSON.stringify(report,null,2));
 console.log("ATLAS DEVELOPER AUDIT",JSON.stringify({checked:report.checked_urls,reachable:report.reachable,missing_projects:report.unresearched_projects}));
 for(const item of audit)console.log((item.reachable?"SOURCE OK ":"SOURCE ISSUE ")+item.url+" "+(item.http_status||item.error));
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,"### ATLAS Developer source watch\\n\\nSources: "+report.reachable+"/"+report.checked_urls+" available; "+report.unresearched_projects+" projects without developer-confirmed sources. Report is downloadable; **not** a publication of new data.\\n");
})();
