(() => {
"use strict";
const $=id=>document.getElementById(id);
const item=(tag,txt,cls)=>{const el=document.createElement(tag);if(txt!==undefined)el.textContent=txt;if(cls)el.className=cls;return el};
const safeURL=value=>{try{const u=new URL(value);return /^https:$/.test(u.protocol)?u.href:null}catch(_){return null}};
const fmt=n=>Number(n).toLocaleString("vi-VN",{maximumFractionDigits:2});
let catalog={projects:[]},history={observations:[]},rental={site_entries:[],portals:[]},feedback={objective_protocol:{categories:[]},project_scores:[]},risk={flood:{portals:[]},traffic:{portals:[]}};
const SEGMENTS={
primary:{title:"Sơ cấp · Chủ đầu tư mở bán",eyebrow:"PRIMARY MARKET",description:"Căn được chủ đầu tư bán lần đầu theo tháp/đợt, có chính sách và bảng giá ngày công bố. Cần đối chiếu với pháp nhân và giỏ hàng chính thức.",note:"Dự án gắn cờ đang bán; chưa xác minh giỏ hàng hoặc giá sơ cấp từng căn.",caution:"Không có đơn vị sản phẩm sơ cấp được xác minh trong kho hiện tại. Giá chào chung không thay thế bảng giá chủ đầu tư."},
secondary:{title:"Thứ cấp · Chuyển nhượng",eyebrow:"SECONDARY MARKET",description:"Giao dịch giữa các chủ sở hữu sau mở bán. Ghi rõ căn, diện tích thông thủy, pháp lý, giá chào và ngày ghi nhận.",note:"Dự án đã bàn giao; chưa xác minh có căn sang nhượng đang giao dịch.",caution:"Đã bàn giao không có nghĩa có nguồn căn thứ cấp thực tế. Mức giá giao dịch đã chốt chưa được cung cấp."},
rental:{title:"Cho thuê · Tin đăng và hợp đồng",eyebrow:"RENTAL MARKET",description:"Tin chào thuê theo căn, số phòng ngủ, diện tích, tình trạng nội thất và phí. Giá thuê đã ký hợp đồng là chuỗi khác.",note:"Dự án đã bàn giao; chưa xác minh có căn trống đang cho thuê.",caution:"Chưa có giá thuê từng căn theo dự án được duyệt; xem các thống kê chào thuê của từng nền tảng ở phần dưới."}
};
function outputCard(root,blocks){root.replaceChildren();for(const x of blocks)root.append(x)}
function drawMarket(segment){
 const config=SEGMENTS[segment];$("segmentTitle").textContent=config.title;$("segmentEyebrow").textContent=config.eyebrow;$("segmentDesc").textContent=config.description;$("segmentCountNote").textContent=config.note;$("segmentCaution").textContent=config.caution;$("segmentMap").href="./map-v4.html?market="+encodeURIComponent(segment);
 for(const btn of document.querySelectorAll("[data-tab]")){const active=btn.dataset.tab===segment;btn.classList.toggle("selected",active);btn.setAttribute("aria-selected",String(active))}
 const chosen=catalog.projects.filter(p=>String(p.availability?.[segment]||"").startsWith("candidate_"));
 $("segmentCount").textContent=String(chosen.length);
 const root=$("segmentProjects");root.replaceChildren();if(!chosen.length)root.append(item("p","Chưa có dự án ứng viên."));
 for(const p of chosen){const a=item("a",p.project_name,"projectTag");a.href="./map-v4.html?p="+encodeURIComponent(p.project_id)+"&market="+encodeURIComponent(segment);root.append(a)}
}
function drawInsights(){
 const root=$("insightGrid");
 // Keep metric-specific interpretations separate and never imply that unlike numbers are a uniform time series.
 const ids=["SAVILLS-HCMC-2023Q4-PRIMARY-PRICE","SAVILLS-HCMC-2024-SALES-LOWERBOUND","SAVILLS-HCMC-2025-SALES","SAVILLS-HCMC-2025Q4-PRIMARY-PRICE","BDS-HCMC-2025MAR-ASKING-PRICE","BDS-HCMC-2026MAY-RENT-INTEREST"];
 const map=new Map(history.observations.map(x=>[x.id,x]));const names={
"SAVILLS-HCMC-2023Q4-PRIMARY-PRICE":"Giá căn hộ sơ cấp · quý IV/2023",
"SAVILLS-HCMC-2024-SALES-LOWERBOUND":"Số căn hộ báo cáo bán trong 2024",
"SAVILLS-HCMC-2025-SALES":"Lượng bán theo Savills 2025",
"SAVILLS-HCMC-2025Q4-PRIMARY-PRICE":"Giá sơ cấp bình quân · quý IV/2025",
"BDS-HCMC-2025MAR-ASKING-PRICE":"Giá rao bán căn hộ · tháng 3/2025",
"BDS-HCMC-2026MAY-RENT-INTEREST":"Mức quan tâm thuê · so cùng kỳ 2026"};
 root.replaceChildren();
 for(const id of ids){const x=map.get(id);if(!x||!x.approved_for_public_display)continue;const el=item("article",undefined,"insightCard");
 el.append(item("span",(x.market_type==="rental"?"CHO THUÊ":x.market_type==="secondary"?"GIÁ RAO / KHÔNG PHÂN SƠ-THỨ CẤP":"SƠ CẤP / BÁO CÁO")+" · "+x.year,"kicker"));
 const unit=x.unit==="million_VND_per_m2_NSA"||x.unit==="million_VND_per_m2"?"triệu VND/m²":x.unit==="apartment_units"?"căn":"%";
 el.append(item("strong",(x.bound==="greater_than"?"> ":"")+fmt(x.value)+" "+unit),item("h3",names[id]||x.metric),item("p",x.methodology||""));
 const href=safeURL(x.source_url);if(href){const a=item("a","Mở nghiên cứu gốc ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";el.append(a)}root.append(el)}
 const years=[...new Set(history.observations.filter(x=>x.approved_for_public_display).map(x=>x.year))];
 $("yearsCovered").textContent=years.length+"/21";const pills=$("yearPills");pills.replaceChildren();
 for(let y=2006;y<=2026;y++){const s=item("span",String(y));if(years.includes(y))s.classList.add("covered");pills.append(s)}
}
function drawRentals(){
 const root=$("rentalSources");root.replaceChildren();
 for(const x of rental.site_entries||[]){const c=item("article",undefined,"rentalCard");c.append(item("small",x.site+" · "+x.period),item("h3",x.stat));
 const unit=x.unit==="percent"?"%":"triệu đồng/căn/tháng";c.append(item("strong",fmt(x.value)+(unit==="%"?"%":" "+unit)),item("p",x.comparability||x.geography||""));const href=safeURL(x.source_url);if(href){const a=item("a","Kiểm tra nguồn ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";c.append(a)}root.append(c)}
 const links=$("rentalLinks");links.replaceChildren();for(const p of rental.portals||[]){const url=safeURL(p.url);if(!url)continue;const a=item("a","Tìm tin tại "+p.site+" ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";links.append(a)}
}
function drawReviews(){
 const rubric=$("reviewRubric");rubric.replaceChildren();
 for(const c of feedback.objective_protocol?.categories||[]){const e=item("div",c.vi);e.append(item("small","Trọng số nghiên cứu: "+Math.round(c.weight*100)+"%"));rubric.append(e)}
 $("ratedProjects").textContent=(feedback.project_scores||[]).length;
 $("reviewThreshold").textContent="Ngưỡng: tối thiểu "+(feedback.objective_protocol?.minimum_unique_independent_responses||15)+" phản hồi độc lập/dự án";
 const root=$("marketSentiment");root.replaceChildren();
 for(const s of feedback.editorial_market_signals||[]){const p=item("p","Nghiên cứu hành vi chung: "+s.min+"–"+s.max+"% tỷ trọng tìm kiếm chung cư trên nền tảng (giai đoạn "+s.period+"). ĐÂY KHÔNG PHẢI điểm hài lòng cư dân. ");const href=safeURL(s.source_url);if(href){const a=item("a","Xem báo cáo ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";p.append(a)}root.append(p)}
}
function drawRisks(){
 for(const kind of ["flood","traffic"]){const root=$(kind+"Links");root.replaceChildren();for(const p of risk[kind]?.portals||[]){const href=safeURL(p.url);if(!href)continue;const a=item("a",p.name+" ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";root.append(a)}}
}
async function load(name){const res=await fetch(new URL("data/"+name,document.baseURI),{cache:"no-store"});if(!res.ok)throw Error(name+" HTTP "+res.status);return res.json()}
async function start(){for(const btn of document.querySelectorAll("[data-tab]"))btn.onclick=()=>drawMarket(btn.dataset.tab);
 try{
 const [a,b,c,d,e]=await Promise.all([load("apartment_market_layers.json"),load("market_history_2006_2026.json"),load("rental_market_snapshots.json"),load("resident_sentiment.json"),load("rainy_season_risk_sources.json")]);
 catalog=a;history=b;rental=c;feedback=d;risk=e;
 $("projects").textContent=a.counts.total;$("primaryCandidates").textContent=a.counts.legacy_sale_flag;$("secondaryCandidates").textContent=a.counts.legacy_handover_flag;
 $("historyObservations").textContent=b.observations.filter(o=>o.approved_for_public_display).length;
 drawMarket(new URLSearchParams(location.search).get("mode") in SEGMENTS?new URLSearchParams(location.search).get("mode"):"primary");drawInsights();drawRentals();drawReviews();drawRisks();
 }catch(err){console.error("Atlas market research:",err);$("segmentProjects").textContent="Lỗi tải dữ liệu: "+err.message;$("insightGrid").textContent="Không tải được quan sát thị trường."}}
start();
})();