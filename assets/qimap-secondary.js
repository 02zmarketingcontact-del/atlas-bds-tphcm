(() => {
"use strict";
const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el};
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g,"");
const statuses={
issuer_says_completed:{label:"Nguồn doanh nghiệp: hoàn thành",className:"issued",group:"issuer"},
issuer_says_handed_over:{label:"Nguồn doanh nghiệp: bàn giao",className:"issued",group:"issuer"},
historical_portfolio_presence:{label:"Hồ sơ lịch sử doanh nghiệp",className:"",group:"historical"},
operating_referenced_by_historic_rental_market:{label:"Báo cáo thị trường thuê cũ",className:"",group:"historical"},
platform_directory_candidate_only:{label:"Đầu mối tra cứu, chưa xác minh",className:"",group:"candidate"},
platform_reports_handed_over_unverified:{label:"Tin bên thứ ba báo bàn giao",className:"",group:"candidate"},
map_existing_unverified_status:{label:"Bản đồ hiện có",className:"",group:"historical"}};
let full=[],filtered=[],count=0,sourceCount=0,locations=47;
function base(p){return{research_id:"map-"+p.id,name:p.name,aliases:[],regional_scope:p.zone==="bd"?"Binh_Duong_pre_2025":p.zone==="brvt"?"Ba_Ria_Vung_Tau_pre_2025":p.zone==="edge"?"Long_An_pre_2025":"HCMC_old_boundary",developer_or_publication_group:p.developer||"Chưa xác minh",lifecycle_status:"map_existing_unverified_status",handover_year:null,parent_project_id:null,evidence_source:{url:p.source||null},map_project_id:p.id,source_origin:"existing_map",historical_secondary_priority:"P1"}}
function combine(seed,mapped){
const list=[],index=new Map();
function add(p){
 const matches=[p.name,...(p.aliases||[])].map(norm).filter(Boolean);
 const found=matches.map(k=>index.get(k)).find(Boolean);
 if(found){
  if(p.map_project_id){found.map_project_id=p.map_project_id;found.legacy_reference=true;found.name=p.name}
  else{found.lifecycle_status=p.lifecycle_status;found.evidence_source=p.evidence_source;found.handover_year=p.handover_year;found.developer_or_publication_group=p.developer_or_publication_group;found.research_id=p.research_id;found.parent_project_id=p.parent_project_id;found.historical_secondary_priority=p.historical_secondary_priority;found.regional_scope=p.regional_scope;found.aliases=[...new Set([...(found.aliases||[]),...(p.aliases||[])])]}
  for(const key of matches)index.set(key,found);return;
 }
 const copy={...p};list.push(copy);for(const key of matches)index.set(key,copy);
}
for(const p of mapped)add(base(p));
for(const p of seed)add(p);
return list;
}
function allowedURL(s){try{const url=new URL(s);return url.protocol==="https:"?url.href:null}catch{return null}}
function projectCard(p){
 const x=statuses[p.lifecycle_status]||statuses.map_existing_unverified_status;
 const card=node("article",undefined,"card"),head=node("div",undefined,"line");
 head.append(node("span",x.label,"flag "+x.className),node("span",p.developer_or_publication_group,"developer"));card.append(head,node("h3",p.name));
 card.append(node("p",p.handover_year?"Năm bàn giao nguồn ghi nhận: "+p.handover_year:"Mốc bàn giao: chưa xác minh", "detail"));
 const tags=node("div",undefined,"meta");
 const areaNames={"HCMC_old_boundary":"TP.HCM cũ","Binh_Duong_pre_2025":"Bình Dương cũ","Ba_Ria_Vung_Tau_pre_2025":"Bà Rịa–Vũng Tàu cũ","Long_An_pre_2025":"Long An cũ"};tags.append(node("span",areaNames[p.regional_scope]||"Vùng đang rà soát"));
 tags.append(node("span","Sơ cấp / thứ cấp tách riêng"));
 if(p.map_project_id)tags.append(node("span","Đã có ghim bản đồ"));
 if(p.parent_project_id)tags.append(node("span","Phân kỳ thuộc dự án mẹ"));
 card.append(tags);
 if(p.parent_project_id)card.append(node("p","Có phân kỳ/dự án mẹ — không cộng chồng số căn","context"));
 const links=node("div",undefined,"links");
 if(allowedURL(p.evidence_source?.url)){const a=node("a","Xem nguồn ↗");a.href=p.evidence_source.url;a.target="_blank";a.rel="noopener noreferrer";links.append(a)}
 if(p.map_project_id){const a=node("a","Mở bản đồ ↗");a.href="./map-v4.html?p="+encodeURIComponent(p.map_project_id);links.append(a)}
 else links.append(node("span","Chưa có tọa độ dự án đã kiểm chứng","disabled"));
 card.append(links);
 return card;
}
function draw(reset=true){
 const q=norm($("query").value),status=$("life").value,region=$("region").value,developer=$("developer").value;
 filtered=full.filter(p=>{
  const x=statuses[p.lifecycle_status]||statuses.map_existing_unverified_status;
  return (status==="all"||x.group===status)&&(region==="all"||p.regional_scope===region)&&(developer==="all"||p.developer_or_publication_group===developer)&&(!$("mappedOnly").checked||!!p.map_project_id)&&(!q||[p.name,p.developer_or_publication_group,...(p.aliases||[])].some(t=>norm(t).includes(q)));
 }).sort((a,b)=>((a.historical_secondary_priority==="P0"?0:1)-(b.historical_secondary_priority==="P0"?0:1))||a.name.localeCompare(b.name,"vi"));
 if(reset){count=0;$("cards").replaceChildren()}
 const selected=filtered.slice(count,count+45);
 for(const p of selected)$("cards").append(projectCard(p));
 count+=selected.length;
 $("shownCount").textContent="Hiển thị "+Math.min(count,filtered.length)+" / "+filtered.length+" mục phù hợp";
 if(!filtered.length)$("cards").append(node("p","Không có kết quả. Thử từ khóa khác."));
 $("more").hidden=count>=filtered.length;
}
function areas(list){
 locations=list.length;$("auditCount").textContent=String(locations);
 const root=$("auditRegion");for(const code of [...new Set(list.map(x=>x.region_version))]){const opt=node("option",code.replace("_pre_2025"," (cũ)"));opt.value=code;root.append(opt)}
 const render=()=>{const el=$("areaGrid");el.replaceChildren();for(const p of list.filter(p=>root.value==="all"||root.value===p.region_version)){const item=node("div",undefined,"area-cell");item.append(node("strong",p.historic_district),node("small","Đang tiếp tục kiểm tra nguồn 2006–2026"));el.append(item)}};
 root.onchange=render;render();
}
function csv(){
 const cols=[["Mã nghiên cứu","Tên dự án","Nhà phát triển","Trạng thái","Vùng lịch sử","Năm bàn giao nguồn","Dự án mẹ","Ghim trên bản đồ","Nguồn"]];
 for(const p of filtered)cols.push([p.research_id||"",p.name,p.developer_or_publication_group,p.lifecycle_status,p.regional_scope,p.handover_year||"",p.parent_project_id||"",p.map_project_id||"",p.evidence_source?.url||""]);
 const q=x=>'"'+String(x??"").replace(/"/g,'""')+'"';
 const str="\ufeff"+cols.map(row=>row.map(q).join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([str],{type:"text/csv;charset=utf-8"}));
 const a=node("a");a.href=url;a.download="QiMap_Research_Secondary_Projects.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),700);
}
async function load(path){const r=await fetch(new URL(path,document.baseURI),{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status+" "+path);return r.json()}
async function init(){
 try{
  const [newData,existing,audit]=await Promise.all([load("data/apartment_project_expansion_2006_2026.json"),load("data/projects.json"),load("data/geographic_audit_grid_2026.json")]);
  if(!Array.isArray(newData.projects)||!Array.isArray(existing))throw Error("Cấu trúc dữ liệu chưa hợp lệ.");
  full=combine(newData.projects,existing);
  $("countSeed").textContent=String(newData.projects.length);
  $("countMapped").textContent=String(existing.length);
  $("countCombined").textContent=String(full.length);
  $("countIssuer").textContent=String(newData.projects.filter(x=>["issuer_says_completed","issuer_says_handed_over"].includes(x.lifecycle_status)).length);
  const developers=[...new Set(full.map(x=>x.developer_or_publication_group))].sort((a,b)=>a.localeCompare(b,"vi"));
  for(const d of developers){const opt=node("option",d);opt.value=d;$("developer").append(opt)}
  for(const name of ["query","life","region","developer","mappedOnly"])$(name).addEventListener(name==="query"?"input":"change",()=>draw());
  $("more").onclick=()=>draw(false);$("downloadCsv").onclick=csv;
  areas(audit.audit_cells||[]);draw();
 }catch(err){console.error("QiMap Secondary Catalogue:",err);$("shownCount").textContent="Lỗi tải danh mục";$("cards").replaceChildren(node("p","Không tải được kho dự án: "+err.message))}
}
init();
})();