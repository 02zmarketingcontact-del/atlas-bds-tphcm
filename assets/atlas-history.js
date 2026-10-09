(() => {
"use strict";
const $=id=>document.getElementById(id);
const make=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
let observations=[],year=2026;
function sourceLink(parent,o){if(typeof o.source_url==="string"&&/^https:\/\//.test(o.source_url)){const a=make("a","Nguồn ↗");a.href=o.source_url;a.target="_blank";a.rel="noopener noreferrer";parent.append(a)}}
function observationLabel(o){const terms={reported_units_sold:"Căn hộ bán được theo báo cáo",new_apartment_units_entered:"Nguồn cung căn hộ mới",average_selling_price:"Giá bình quân theo báo cáo",residential_price_index:"Chỉ số giá nhà ở Savills (SPPI)",absorption_rate:"Tỷ lệ hấp thụ",primary_asking_price:"Giá chào sơ cấp",secondary_asking_price:"Giá chào thứ cấp",rent_asking_price:"Giá thuê chào"};return terms[o.metric]||o.metric}
function display(o){const unit=o.unit==="apartment_units"?"căn hộ":o.unit==="USD_per_m2"?"USD/m²":o.unit==="index_points"?"điểm":o.unit||"";return Number(o.value).toLocaleString("vi-VN",{maximumFractionDigits:2})+" "+unit+(o.approximate?" (xấp xỉ)":"")}
function drawYears(){const root=$("years");root.replaceChildren();for(let y=2006;y<=2026;y++){const b=make("button",String(y));b.type="button";if(observations.some(x=>x.year===y))b.classList.add("has-data");if(y===year)b.classList.add("active");b.onclick=()=>{year=y;drawYears();drawData()};root.append(b)}}
function drawData(){
 $("heading").textContent="Năm "+year;
 const all=observations.filter(x=>x.year===year&&x.approved_for_public_display===true&&(!x.grade||x.grade==="all"));
 const tbody=$("yearObservations");tbody.replaceChildren();
 if(!all.length){const tr=make("tr"),td=make("td","Chưa có quan sát được phê duyệt cho năm này. Tiếp tục tìm báo cáo gốc.");td.colSpan=3;tr.append(td);tbody.append(tr);return}
 for(const o of all.sort((a,b)=>String(a.period_start).localeCompare(String(b.period_start)))){
  const tr=make("tr"),c1=make("td",observationLabel(o)),c2=make("td"),c3=make("td");
  c2.append(make("span",display(o)));
  c3.append(make("div",(o.period_start||"")+(o.period_end?" — "+o.period_end:"")));
  sourceLink(c3,o);
  tr.append(c1,c2,c3);tbody.append(tr);
 }
}
function drawBarChart(){
 const selected=observations.filter(x=>x.series_id==="savills_hcmc_apartment_sales_2014_2018"&&x.approved_for_public_display).sort((a,b)=>a.year-b.year);
 const root=$("marketChart");root.replaceChildren();if(!selected.length){root.textContent="Chưa có chuỗi đồng nhất để công bố.";return}
 const max=Math.max(...selected.map(x=>x.value));
 for(const o of selected){const col=make("div",undefined,"bar");col.append(make("b",Number(o.value).toLocaleString("vi-VN")));const bar=make("div",undefined,"stem");bar.style.height=Math.max(8,Math.round(135*o.value/max))+"px";col.append(bar,make("small",String(o.year)));root.append(col)}
}
function drawSPPI(){
 const data=observations.filter(o=>o.series_id==="savills_hcmc_residential_price_index"&&o.approved_for_public_display).sort((a,b)=>a.period_start.localeCompare(b.period_start));const root=$("indexObservations");root.replaceChildren();
 for(const o of data){const b=make("div",undefined,"indexCard");b.append(make("small",String(o.period_start)+" đến "+o.period_end),make("strong",String(o.value)+" điểm"));sourceLink(b,o);root.append(b)}
 if(!data.length)root.append(make("p","Chưa có mốc chỉ số được duyệt."));
}
async function init(){try{const res=await fetch(new URL("./data/market_history_2006_2026.json",document.baseURI),{cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);const j=await res.json();observations=(j.observations||[]).filter(o=>o.approved_for_public_display===true);
  const covered=new Set(observations.map(x=>x.year));$("observationsCount").textContent=observations.length;$("coveredYears").textContent=covered.size;
  $("dataNote").textContent="Hiện mới có "+covered.size+"/21 năm dương lịch chứa dữ kiện có nguồn, tổng "+observations.length+" quan sát. Thiếu nguồn không đồng nghĩa giá bằng 0.";
  drawYears();drawData();drawBarChart();drawSPPI();
 }catch(err){console.error("ATLAS historical data:",err);$("dataNote").textContent="Không tải được dữ liệu lịch sử: "+err.message}}
init();
})();