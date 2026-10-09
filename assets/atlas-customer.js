/* Atlas customer experience — additive enhancement to the V3.2 map.
   The existing sale map remains the source of truth. Rent inventory is NEVER
   inferred from sale prices; unverified rentals are never displayed as live. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const LANG = {
    vi: {
      buy: "MUA BÁN", rent: "CHO THUÊ", trusted: "Dữ liệu phải có nguồn", goal: "Tôi đang tìm...", home: "Mua để ở", invest: "Đầu tư", foreign: "Khách nước ngoài", important: "Những điều cần kiểm tra", verify: "Trạng thái nguồn:", notyet: "Chưa có nguồn thuê đã xác minh", rentalIntro: "Bản đồ giá mua không phải bản đồ giá thuê. Atlas chỉ công bố giá thuê và căn trống khi đã có nguồn có quyền sử dụng và ngày xác nhận.", searchRent:"Tìm tên dự án hoặc khu vực...", allZones:"Tất cả khu vực", allBeds:"Mọi loại căn", allBudgets:"Mọi ngân sách", rentalList:"Nguồn cho thuê có kiểm chứng", noInventory:"Chưa có căn cho thuê được xác minh", missingInventory:"Không tạo tin thuê hoặc giá thuê giả để lấp chỗ trống. Có thể khảo sát các dự án hiện có hoặc mở nguồn bên ngoài.", noResults:"Không có căn nào phù hợp tiêu chí", external:"Tra cứu nguồn thuê bên ngoài", sourceWarning:"Liên kết bên ngoài không đồng nghĩa căn còn trống hay giá đã được Atlas kiểm tra.", rentalMap:"Chế độ thuê · chưa có giá thuê xác minh · chỉ bản đồ nền", validate: "Kiểm tra tình trạng căn và hợp đồng trước khi đặt cọc.", pending:"Đang chuẩn bị kết nối nguồn cho thuê hợp lệ", projects:"Dự án có thể khảo sát", priceSale:"Giá bán tham khảo chưa xác minh", homeChecks:["Tổng giá và nghĩa vụ vay hằng tháng","Đi làm, trường học và tiện ích","Pháp lý và thời điểm bàn giao"], investChecks:["Giá mua đối chiếu căn tương đương","Nguồn thuê thực tế, tỷ lệ trống và chi phí","Thanh khoản, thuế phí và rủi ro"], foreignChecks:["Tư cách và điều kiện được mua","Dự án đủ điều kiện ≠ còn suất nước ngoài","Hợp đồng, thời hạn sở hữu và chi phí"], foreignNotice:"Hiện chưa có dự án nào trong Atlas được gắn suất mua nước ngoài đã xác minh. Không sử dụng bộ lọc này để kết luận dự án không cho phép người nước ngoài mua.", priceHint:"Không có báo giá nào trong 32 dự án đã được xác minh độc lập.", rentPrice:"Giá thuê/tháng", source:"Nguồn ngoài ↗", rentalStatus:"Chưa tích hợp dữ liệu thuê", marketSale:"Bản đồ giá chào bán", marketRent:"Bản đồ cho thuê", rentData:"dữ liệu thuê đã kiểm chứng" },
    en: {
      buy:"BUY / SELL",rent:"RENT",trusted:"Source-linked information",goal:"I am looking to...",home:"Buy to live",invest:"Invest",foreign:"Foreign buyer",important:"Verify before deciding",verify:"Data status:",notyet:"No verified rental listings yet",rentalIntro:"Sale asking prices do not represent rents. Atlas displays rental availability only when a permitted source and check date exist.",searchRent:"Search property or neighborhood...",allZones:"All areas",allBeds:"All unit types",allBudgets:"Any budget",rentalList:"Verified rental sources",noInventory:"No validated rentals available",missingInventory:"Atlas will not fabricate available apartments or rent figures. Browse existing developments or external listing platforms.",noResults:"No matching rentals",external:"Explore external rental sources",sourceWarning:"External sources have not been validated by Atlas for availability or pricing.",rentalMap:"Rental mode · no verified rent data · base map only",validate:"Confirm availability and lease terms before placing a deposit.",pending:"Preparing permitted rental data feeds",projects:"Developments to research",priceSale:"Unverified sale asking prices",homeChecks:["Total cost and monthly mortgage burden","Commute, schools and amenities","Legal status and handover"],investChecks:["Price versus comparable apartments","Observed rent, vacancy and expenses","Liquidity, taxes and downside"],foreignChecks:["Purchaser eligibility","Project sale eligibility ≠ remaining foreign quota","Contract, tenure and costs"],foreignNotice:"None of the existing projects has confirmed remaining foreign purchase quota in Atlas. Do not interpret this as an outright purchase ban.",priceHint:"None of the 32 project price ranges is independently verified.",rentPrice:"Monthly rent",source:"External source ↗",rentalStatus:"Rental feed not connected",marketSale:"Sale asking-price map",marketRent:"Rental map",rentData:"verified rentals"},
    zh: {
      buy:"买卖",rent:"出租",trusted:"信息附来源",goal:"您的需求",home:"自住购房",invest:"公寓投资",foreign:"外国买家",important:"购买前需核实",verify:"数据状态：",notyet:"暂无已核实出租房源",rentalIntro:"售价并非租金。Atlas 只展示来源授权且经过日期核实的租金与空置状态。",searchRent:"搜索项目或地区...",allZones:"全部地区",allBeds:"全部房型",allBudgets:"全部预算",rentalList:"已核实出租来源",noInventory:"暂无已确认的出租房源",missingInventory:"Atlas 不会虚构可租房源或租金。您可以先查看项目或前往第三方平台核实。",noResults:"未找到符合条件的出租房源",external:"第三方出租平台",sourceWarning:"第三方信息尚未通过 Atlas 核实是否有房及价格。",rentalMap:"出租模式 · 暂无已核实租金 · 仅显示底图",validate:"支付订金前须核实空置状态与租赁合同。",pending:"正在对接授权出租信息",projects:"可考察的住宅项目",priceSale:"售价参考未独立核实",homeChecks:["总购房成本与月供负担","通勤、学校与配套设施","法律状态与交房时间"],investChecks:["与同类房源对比价格","真实租金、空置率与费用","流动性、税费及风险"],foreignChecks:["外国人购房资格","项目可售不等于仍有外国人购房配额","合同、产权年限与费用"],foreignNotice:"Atlas 目前没有任何已核实的外国人剩余购房名额。不能据此推断项目禁止外国人购买。",priceHint:"现有32个项目均尚未独立验证报价。",rentPrice:"月租",source:"外部来源 ↗",rentalStatus:"尚未连接出租数据",marketSale:"销售报价地图",marketRent:"出租地图",rentData:"已核实出租房源"}
  };
  let mode = "sale", rentals = [], selectedGoal = "home";
  function language(){return ["vi","en","zh"].includes(window.AtlasI18N?.getLang?.())?window.AtlasI18N.getLang():"vi";}
  function t(key){return LANG[language()][key] || LANG.vi[key] || key;}
  function safeText(x){return String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
  function safeUrl(raw){try {const u=new URL(raw);return u.protocol==="https:"?u.href:null;}catch{return null;}}
  function zoneLabel(z){return ({hcm:"TP.HCM",bd:"Bình Dương cũ",brvt:"Bà Rịa – Vũng Tàu cũ",edge:"Long An / Tây Ninh"})[z]||"Khác";}
  function formatCurrency(value){return (Number(value)||0).toLocaleString(language()==="en"?"en-US":"vi-VN");}
  function renderGoal(){
    const panel=$("atlas-goal-content");
    if (!panel)return;
    const key=selectedGoal==="home"?"homeChecks":selectedGoal==="invest"?"investChecks":"foreignChecks";
    panel.innerHTML='<p class="atlas-section-caption">'+safeText(t("important"))+'</p><ul class="atlas-goal-checks">'+t(key).map(x=>'<li>✓ '+safeText(x)+'</li>').join("")+'</ul>'+(selectedGoal==="foreign"?'<p class="atlas-foreign-note">'+safeText(t("foreignNotice"))+'</p>':'')+'<p class="atlas-data-note">'+safeText(t("priceHint"))+'</p>';
    document.querySelectorAll("[data-atlas-goal]").forEach(btn=>{
      btn.classList.toggle("active",btn.dataset.atlasGoal===selectedGoal);
      btn.setAttribute("aria-pressed",String(btn.dataset.atlasGoal===selectedGoal));
    });
  }
  function renderRentals(){
    const root=$("atlas-rental-items");if(!root)return;
    const q=($("atlas-rent-search")?.value||"").trim().toLocaleLowerCase();
    const zone=$("atlas-rent-zone")?.value||"all";
    const bedrooms=$("atlas-rent-beds")?.value||"all";
    const budget=$("atlas-rent-budget")?.value||"all";
    const allowed=rentals.filter(r=>{
      if(r.verified!==true||r.availability!=="confirmed_available"||!r.confirmed_at)return false;
      if(zone!=="all" && r.zone!==zone)return false;
      if(bedrooms!=="all" && Number(r.bedrooms)!==Number(bedrooms))return false;
      if(budget!=="all" && !(Number(r.rent_vnd_month)>0 && Number(r.rent_vnd_month)<=Number(budget)))return false;
      return !q||[r.project_name,r.zone,r.address].join(" ").toLocaleLowerCase().includes(q);
    });
    $("atlas-rent-count").textContent=allowed.length+" "+t("rentData");
    if(!allowed.length){root.innerHTML='<div class="atlas-rent-empty"><strong>'+safeText(rentals.length?t("noResults"):t("noInventory"))+'</strong><p>'+safeText(t("missingInventory"))+'</p></div>';return;}
    root.innerHTML=allowed.map(r=>{
      const link=safeUrl(r.source_url);
      return '<article class="atlas-rent-card"><b>'+safeText(r.project_name)+'</b><p>'+safeText(zoneLabel(r.zone))+' · '+safeText(r.bedrooms)+'PN · '+safeText(r.area_sqm)+' m²</p><strong>'+formatCurrency(r.rent_vnd_month)+' VND/'+(language()==="en"?"month":"tháng")+'</strong><small>'+safeText(t("verify"))+' '+safeText(r.confirmed_at)+'</small>'+(link?'<a target="_blank" rel="noopener noreferrer" href="'+safeText(link)+'">'+safeText(t("source"))+'</a>':'')+'</article>';
    }).join("");
  }
  function updateLanguage(){
    const rentButton=$("atlas-market-rent"),saleButton=$("atlas-market-sale");
    if(!rentButton||!saleButton)return;
    saleButton.textContent=t("buy");rentButton.textContent=t("rent");
    $("atlas-trusted").textContent=t("trusted");$("atlas-goal-title").textContent=t("goal");
    document.querySelectorAll("[data-atlas-goal]").forEach(btn=>btn.textContent=t(btn.dataset.atlasGoal==="home"?"home":btn.dataset.atlasGoal==="invest"?"invest":"foreign"));
    $("atlas-rent-intro").textContent=t("rentalIntro");$("atlas-rent-search").placeholder=t("searchRent");
    $("atlas-rent-sources-title").textContent=t("external");$("atlas-source-note").textContent=t("sourceWarning");
    $("atlas-rent-map-note").textContent=t("rentalMap");
    document.querySelectorAll("[data-atlas-market]").forEach(btn=>{
      const pressed=btn.dataset.atlasMarket===mode;
      btn.classList.toggle("active",pressed);btn.setAttribute("aria-pressed",String(pressed));
    });
    renderGoal();renderRentals();
  }
  function setMode(next){
    mode=next==="rent"?"rent":"sale";
    document.body.dataset.atlasMarket=mode;
    $("atlas-sale-panel").hidden=mode!=="sale";
    $("atlas-rent-panel").hidden=mode!=="rent";
    $("atlas-rent-map-note").hidden=mode!=="rent";
    if(mode==="rent") $("detailClose")?.click();
    const tab=document.querySelector('[data-tab="projects"]');
    if(tab && !tab.classList.contains("on"))tab.click();
    updateLanguage();
    try {history.replaceState(null,"",new URL(location.href).pathname+new URL(location.href).search.replace(/([?&])market=(sale|rent)/,"$1").replace(/[?&]$/,"")+(location.search.includes("?")?"&":"?")+"market="+mode+location.hash);} catch(_){}
  }
  function initMarkup(){
    const section=$("tab-projects");if(!section)return;
    const sale=document.createElement("div");sale.id="atlas-sale-panel";
    while(section.firstChild)sale.appendChild(section.firstChild);
    section.appendChild(sale);
    const bar=document.createElement("div");bar.className="atlas-market-switch";bar.setAttribute("role","group");bar.setAttribute("aria-label","Market type");
    bar.innerHTML='<button type="button" id="atlas-market-sale" data-atlas-market="sale" aria-pressed="true" class="active">MUA BÁN</button><button type="button" id="atlas-market-rent" data-atlas-market="rent" aria-pressed="false">CHO THUÊ</button>';
    section.prepend(bar);
    const trust=document.createElement("div");trust.className="atlas-trustline";trust.innerHTML='<span>●</span><span id="atlas-trusted"></span>';
    bar.after(trust);
    const goal=document.createElement("section");goal.className="atlas-goals";goal.innerHTML='<p id="atlas-goal-title" class="atlas-section-caption"></p><div class="atlas-goal-options"><button type="button" data-atlas-goal="home"></button><button type="button" data-atlas-goal="invest"></button><button type="button" data-atlas-goal="foreign"></button></div><div id="atlas-goal-content"></div>';
    sale.prepend(goal);
    const rent=document.createElement("section");rent.id="atlas-rent-panel";rent.hidden=true;
    rent.innerHTML='<div class="atlas-rent-head"><strong id="atlas-rent-count"></strong><p id="atlas-rent-intro"></p></div><input id="atlas-rent-search" class="atlas-full" type="search" aria-label="Rental project search" /><div class="atlas-rent-filters"><select id="atlas-rent-zone" aria-label="Rental area"><option value="all">Tất cả khu vực</option><option value="hcm">TP.HCM</option><option value="bd">Bình Dương cũ</option><option value="edge">Long An / Tây Ninh</option><option value="brvt">Bà Rịa – Vũng Tàu</option></select><select id="atlas-rent-beds" aria-label="Rental bedrooms"><option value="all">Phòng ngủ</option><option value="1">1 PN</option><option value="2">2 PN</option><option value="3">3 PN</option></select><select id="atlas-rent-budget" aria-label="Rental budget"><option value="all">Ngân sách / tháng</option><option value="10000000">≤ 10 triệu</option><option value="20000000">≤ 20 triệu</option><option value="30000000">≤ 30 triệu</option><option value="50000000">≤ 50 triệu</option></select></div><div id="atlas-rental-items"></div><div class="atlas-rent-external"><b id="atlas-rent-sources-title"></b><a href="https://batdongsan.com.vn/cho-thue-can-ho-chung-cu" rel="noopener noreferrer" target="_blank">Batdongsan.com.vn ↗</a><a href="https://www.nhatot.com/" rel="noopener noreferrer" target="_blank">Nhà Tốt ↗</a><small id="atlas-source-note"></small></div>';
    section.appendChild(rent);
    const note=document.createElement("div");note.id="atlas-rent-map-note";note.hidden=true;note.setAttribute("role","status");$("mapStage")?.appendChild(note);
    document.querySelectorAll("[data-atlas-market]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.atlasMarket)));
    document.querySelectorAll("[data-atlas-goal]").forEach(b=>b.addEventListener("click",()=>{selectedGoal=b.dataset.atlasGoal;renderGoal();}));
    ["atlas-rent-search","atlas-rent-zone","atlas-rent-beds","atlas-rent-budget"].forEach(id=>$(id).addEventListener("input",renderRentals));
    updateLanguage();
    window.addEventListener("atlasLanguageChanged",updateLanguage);
    // Rent data can load in parallel and must never change the sale dataset.
    fetch(new URL("data/rent_listings.json",document.baseURI),{cache:"no-store"})
      .then(res=>{if(!res.ok)throw new Error("rent HTTP "+res.status);return res.json()})
      .then(data=>{rentals=Array.isArray(data)?data:[];renderRentals()})
      .catch(()=>{rentals=[];renderRentals();});
    if(new URLSearchParams(location.search).get("market")==="rent")setMode("rent");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initMarkup,{once:true});
  else initMarkup();
})();
