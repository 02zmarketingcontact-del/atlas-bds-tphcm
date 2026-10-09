/* Public industrial discovery pilot. No copied InlandV listings. */
(()=>{
 const entries=[
  {name:"KCN Tân Tạo",region:"TP.HCM (khu Tây)",kind:"KCN",source:"https://hepza.hochiminhcity.gov.vn/"},
  {name:"KCN Tân Bình",region:"TP.HCM",kind:"KCN",source:"https://hepza.hochiminhcity.gov.vn/"},
  {name:"KCX Tân Thuận",region:"TP.HCM (khu Nam)",kind:"KCX",source:"https://hepza.hochiminhcity.gov.vn/"},
  {name:"KCN VSIP I",region:"Thuận An (Bình Dương cũ)",kind:"KCN",source:"https://www.vsip.com.vn/"},
  {name:"KCN Mỹ Phước",region:"Bến Cát (Bình Dương cũ)",kind:"KCN",source:"https://becamex.com.vn/"},
  {name:"KCN Long Hậu",region:"Long An cũ / Tây Ninh",kind:"KCN",source:"https://longhau.com.vn/"}
 ];
 const t={vi:{title:"Danh mục khảo sát ban đầu",sub:"Các địa điểm dưới đây là ứng viên tra cứu, không phải lời chào thuê/bán. Giá, diện tích trống, điện nước và pháp lý từng lô chưa được Atlas xác minh.",choose:"Bạn đang cần loại bất động sản nào?",a:"Đất trong KCN",b:"Nhà xưởng xây sẵn",c:"Kho / logistics",d:"Đất ngoài KCN",search:"Tìm KCN, khu vực...",no:"Chưa xác minh nguồn hàng",why:"Trước khi nhận báo giá cần kiểm tra:",need:"Ngành nghề được tiếp nhận · Giá & thời hạn thuê · Hạ tầng điện/nước thải · Logistics · Pháp lý · Tình trạng trống",ref:"Nguồn tham khảo ↗",inland:"Tham khảo mô hình danh mục tại InlandV ↗"},en:{title:"Industrial research shortlist",sub:"Research candidates only, not verified available industrial listings. No quoted rent or availability is implied.",choose:"What type of space?",a:"Industrial land",b:"Ready-built factory",c:"Warehouse / logistics",d:"Land outside parks",search:"Search park or area...",no:"Inventory unverified",why:"Validate before requesting an offer:",need:"Permitted sector · Rent and lease term · Power/wastewater · Access · Legal status · Vacancy",ref:"Reference ↗",inland:"Industrial categories at InlandV ↗"},zh:{title:"工业园区考察清单",sub:"仅供选址研究，并非已核实的可租或可售房源。价格、空置状态和法律资料仍待确认。",choose:"您寻找哪种物业？",a:"园区工业用地",b:"现成厂房",c:"仓库及物流",d:"园区外土地",search:"搜索园区或区域...",no:"房源尚未核实",why:"报价前应核实：",need:"准入行业 · 租价及期限 · 水电及污水 · 交通 · 法律状态 · 空置情况",ref:"参考来源 ↗",inland:"参考 InlandV 分类 ↗"}};
 let active="a";
 function lang(){const l=window.AtlasI18N?.getLang?.()||"vi";return t[l]||t.vi}
 function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function render(){
  const el=document.getElementById("atlas-industrial-panel");if(!el)return;const x=lang();
  const q=(document.getElementById("industrySearch")?.value||"").toLowerCase();
  const shown=entries.filter(e=>(e.name+" "+e.region).toLowerCase().includes(q));
  el.innerHTML='<div class="infoMini">'+esc(x.sub)+'</div><div class="sectionTitle withSpace">'+esc(x.choose)+'</div><div class="regions">'+["a","b","c","d"].map(k=>'<button type="button" class="industry-kind '+(active===k?"selected":"")+'" data-type="'+k+'">'+esc(x[k])+'</button>').join("")+'</div><div class="fieldRow"><input id="industrySearch" aria-label="Search industrial parks" placeholder="'+esc(x.search)+'" value="'+esc(q)+'"/></div><div class="sectionTitle">'+esc(x.title)+'</div>'+shown.map(e=>'<div class="compareItem"><div><b>'+esc(e.name)+'</b><div class="fieldHelp">'+esc(e.region)+' · '+esc(e.kind)+' · '+esc(x.no)+'</div></div><a target="_blank" rel="noopener noreferrer" href="'+e.source+'">'+esc(x.ref)+'</a></div>').join("")+'<div class="infoMini"><b>'+esc(x.why)+'</b> '+esc(x.need)+'</div><p><a href="https://inlandv.com/" target="_blank" rel="noopener noreferrer">'+esc(x.inland)+'</a></p>';
  el.querySelectorAll(".industry-kind").forEach(b=>b.onclick=()=>{active=b.dataset.type;render()});
  el.querySelector("#industrySearch").addEventListener("input",function(){const v=this.value;render();const search=document.getElementById("industrySearch");search.value=v;search.focus();search.setSelectionRange(v.length,v.length)});
 }
 document.addEventListener("DOMContentLoaded",()=>{render();window.addEventListener("atlasLanguageChanged",render)});
})();