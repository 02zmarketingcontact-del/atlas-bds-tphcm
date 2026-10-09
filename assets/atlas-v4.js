/* ATLAS V4 map engine. Sources are informative, never inferred transaction prices. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const t0={
 vi:{navMap:"Bản đồ",navHistory:"Dữ liệu 20 năm",pageTitle:"Bản đồ căn hộ TP.HCM",subtitle:"Vị trí thực, giá chào tham khảo và lớp kết nối giao thông.",projectCountLabel:"Dự án có dữ liệu",verifiedCountLabel:"Tọa độ đã đối chiếu",searchLabel:"Tìm tên dự án, chủ đầu tư, khu vực",zoneLabel:"Khu vực",statusLabel:"Tình trạng dự án",minPriceLabel:"Giá từ (triệu/m²)",maxPriceLabel:"Đến (triệu/m²)",verifiedOnlyLabel:"Chỉ vị trí đã đối chiếu",labelsEnabledLabel:"Hiển thị ô giá trên bản đồ",sellMode:"Mua bán",rentMode:"Cho thuê · Đang xây dữ liệu",resultsTitle:"Dự án phù hợp",fitResults:"Xem tất cả trên bản đồ ↗",dataCaution:"Giá hiển thị là giá chào tham khảo, KHÔNG phải giá giao dịch.",baseMapLabel:"Bản đồ nền",metroLabel:"Metro số 1 · sơ đồ tham khảo",planningLabel:"Quy hoạch GIS",uploadPlanningLabel:"+ Nạp lớp GeoJSON của bạn",layerNote:"Metro là sơ đồ minh họa; quy hoạch cần nguồn GIS có quyền sử dụng, không thay bản đồ pháp lý.",planningOfficial:"Tra cứu quy hoạch tại cổng TP.HCM ↗",confirmedLegend:"Tọa độ đã đối chiếu",approxLegend:"Vị trí ước lượng",noticeHeading:"Không tải được bản đồ nền",noticeBody:"Kiểm tra Internet hoặc chuyển nguồn bản đồ.",retryMap:"Thử tải lại",all:"Tất cả",sale:"Đang mở bán",handover:"Đã bàn giao",unverified:"Chưa xác minh",locationEstimated:"Tọa độ ước lượng",locationVerified:"Tọa độ đã đối chiếu",priceRef:"Khoảng giá chào tham khảo",priceUnknown:"Chưa có giá xác minh",developer:"Đơn vị phát triển",projectStatus:"Trạng thái dự án",foreignInvestment:"Vốn/đối tác nước ngoài",foreignBuyer:"Điều kiện mua của người nước ngoài",history:"Lịch sử giá",historyMissing:"Chưa có lịch sử giá đã duyệt.",review:"Đánh giá độc lập",reviewMissing:"Chưa có hồ sơ đánh giá kiểm chứng.",source:"Xem nguồn tham khảo ↗",dataWarning:"Giá này chưa được xác minh độc lập; không phải giá giao dịch. Vị trí chấm nét đứt là ước lượng.",noResults:"Không có dự án phù hợp.",loadError:"Không tải được dữ liệu dự án.",planningEmpty:"Chưa có lớp GIS quy hoạch được xác minh. Có thể nạp GeoJSON hợp lệ hoặc mở cổng quy hoạch chính thức.",planningLoaded:"Đã nạp lớp GeoJSON vào phiên trình duyệt này; nguồn chưa được xác minh.",planningInvalid:"Tệp không phải GeoJSON FeatureCollection hợp lệ.",street:"Đường phố",sat:"Vệ tinh"},
 en:{navMap:"Map",navHistory:"15-year data",pageTitle:"HCMC Apartment Map",subtitle:"Real basemap, indicative asking prices and transit overlays.",projectCountLabel:"Indexed projects",verifiedCountLabel:"Checked coordinates",searchLabel:"Find project, developer or area",zoneLabel:"Area",statusLabel:"Project status",minPriceLabel:"Min (million VND/m²)",maxPriceLabel:"Max (million VND/m²)",verifiedOnlyLabel:"Checked coordinates only",labelsEnabledLabel:"Show asking-price markers",sellMode:"Buy / Sell",rentMode:"Rent · Data pending",resultsTitle:"Matching projects",fitResults:"Fit projects ↗",dataCaution:"Asking-price references only, NOT completed transaction prices.",baseMapLabel:"Basemap",metroLabel:"Metro line 1 · schematic",planningLabel:"Planning GIS",uploadPlanningLabel:"+ Upload your GeoJSON",layerNote:"Metro alignment is illustrative; planning requires a licensed GIS source and is not legally authoritative.",planningOfficial:"Official HCMC planning portal ↗",confirmedLegend:"Checked coordinates",approxLegend:"Approximate locations",noticeHeading:"Map tiles unavailable",noticeBody:"Check connection or change basemap provider.",retryMap:"Retry",all:"All",sale:"On sale",handover:"Handed over",unverified:"Not verified",locationEstimated:"Approximate coordinate",locationVerified:"Checked coordinate",priceRef:"Indicative asking-price range",priceUnknown:"No verified price",developer:"Developer",projectStatus:"Project status",foreignInvestment:"Foreign investment / partner",foreignBuyer:"Foreign-buyer eligibility",history:"Price history",historyMissing:"No approved history yet.",review:"Independent assessment",reviewMissing:"No verified review yet.",source:"Open reference source ↗",dataWarning:"Prices are not independently verified transactions; dashed markers indicate approximate coordinates.",noResults:"No matching projects.",loadError:"Project data unavailable.",planningEmpty:"No verified planning GIS layer. Upload a permitted GeoJSON or use the official portal.",planningLoaded:"GeoJSON loaded locally; source remains unverified.",planningInvalid:"Not a valid GeoJSON FeatureCollection.",street:"Streets",sat:"Satellite"}
};
const langs={"zh-CN":{pageTitle:"胡志明市公寓地图",subtitle:"真实底图、挂牌参考价与交通图层",navMap:"地图",navHistory:"15年数据",projectCountLabel:"收录项目",verifiedCountLabel:"核对坐标",searchLabel:"搜索项目、开发商或地区",zoneLabel:"区域",statusLabel:"项目状态",verifiedOnlyLabel:"仅核对坐标",labelsEnabledLabel:"显示价格标签",sellMode:"买卖",rentMode:"租赁 · 数据建设中",resultsTitle:"匹配项目",fitResults:"查看全部 ↗",dataCaution:"挂牌参考价，不代表实际成交价。",metroLabel:"地铁1号线 · 示意",planningLabel:"规划 GIS",planningOfficial:"官方规划网站 ↗",foreignInvestment:"外资/合作方",foreignBuyer:"外国人购买资格",unverified:"尚未核实",historyMissing:"暂无核准的历史价格。"},
"zh-TW":{pageTitle:"胡志明市公寓地圖",subtitle:"實際底圖、開價參考與交通圖層",navMap:"地圖",navHistory:"15年數據",projectCountLabel:"收錄項目",verifiedCountLabel:"已核對座標",searchLabel:"搜尋項目、開發商或地區",zoneLabel:"地區",statusLabel:"項目狀態",verifiedOnlyLabel:"僅顯示已核對座標",labelsEnabledLabel:"顯示價格標籤",sellMode:"買賣",rentMode:"租賃 · 數據建置中",resultsTitle:"符合項目",fitResults:"查看全部 ↗",dataCaution:"僅為開價參考，不代表實際成交價。",metroLabel:"捷運1號線 · 示意",planningLabel:"都市規劃 GIS",planningOfficial:"官方都市規劃網站 ↗",foreignInvestment:"外資/合作夥伴",foreignBuyer:"外國人購買資格",unverified:"尚未核實",historyMissing:"暫無審核通過的歷史價格。"},
ko:{pageTitle:"호찌민 아파트 지도",subtitle:"실제 지도, 매물 호가 및 교통 레이어",navMap:"지도",navHistory:"15년 데이터",projectCountLabel:"등록 프로젝트",verifiedCountLabel:"확인된 좌표",searchLabel:"프로젝트·개발사·지역 검색",zoneLabel:"지역",statusLabel:"상태",verifiedOnlyLabel:"확인된 좌표만",labelsEnabledLabel:"가격 표시",sellMode:"매매",rentMode:"임대 · 준비 중",resultsTitle:"검색 결과",fitResults:"전체 보기 ↗",dataCaution:"표시 가격은 호가이며 실거래가가 아닙니다.",metroLabel:"지하철 1호선 · 개략도",planningLabel:"도시계획 GIS",foreignInvestment:"해외 투자/파트너",foreignBuyer:"외국인 구매 자격",unverified:"미확인"},
ru:{pageTitle:"Карта квартир Хошимина",subtitle:"Реальная карта, ориентировочные цены предложений и транспорт",navMap:"Карта",navHistory:"Данные за 15 лет",projectCountLabel:"Проекты",verifiedCountLabel:"Проверенные координаты",searchLabel:"Поиск проекта, застройщика или района",zoneLabel:"Район",statusLabel:"Статус",verifiedOnlyLabel:"Только проверенные координаты",labelsEnabledLabel:"Показывать цены",sellMode:"Продажа",rentMode:"Аренда · В разработке",resultsTitle:"Результаты",fitResults:"Показать все ↗",dataCaution:"Цены объявлений, не подтверждённые цены сделок.",metroLabel:"Метро 1 · схема",planningLabel:"Градостроительный GIS",foreignInvestment:"Иностранные инвестиции",foreignBuyer:"Покупка иностранцами",unverified:"Не проверено"}};
let lang="vi",map=null,projects=[],markers=[],selected=null,metro=null,planning=null,styleMode="vector",fallbackCount=0,errorCount=0,lastStyleTimer=null,interactive=false;
let metroCatalog={lines:[]}, planningCatalog={sources:[]}, developerCatalog={projects:[]};
let projectUniverse={records:[],counts:{}};
let developerOfficialRegistry={projects:[]},developerMonitorState={projects:{}},developerCandidateStaging={candidates:[]};
let metroStops={type:"FeatureCollection",features:[]},busStops={type:"FeatureCollection",features:[]};
let transitPopupsRegistered=false;

const zones={hcm:"TP.HCM · khu trung tâm/Đông",south:"TP.HCM · Khu Nam",west:"TP.HCM · Khu Tây",bd:"Bình Dương cũ",edge:"Vùng ven / lân cận"};
function tr(key){return (langs[lang]&&langs[lang][key])||(t0[lang]&&t0[lang][key])||t0.vi[key]||key}
function setText(id,value){const e=$(id);if(e)e.textContent=value}
function validUrl(url){try{const x=new URL(String(url));return /^https?:$/.test(x.protocol)?x.href:null}catch(_){return null}}
function safeDate(str){const d=new Date(str);return Number.isNaN(d.getTime())?"—":d.toLocaleDateString(lang==="vi"?"vi-VN":"en-GB")}
function labelPrice(p){if(!Number.isFinite(+p.min)||!Number.isFinite(+p.max))return "—";return Math.round((+p.min+(+p.max))/2)+" tr/m²"}
function band(p){return Number.isFinite(+p.min)&&Number.isFinite(+p.max)?(+p.min).toLocaleString("vi-VN")+"–"+(+p.max).toLocaleString("vi-VN")+" triệu VND/m²":"—"}
function node(tag,cls,txt){let x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function fillSelect(select,items){select.replaceChildren();for(const [v,label] of items){const o=node("option","",label);o.value=v;select.append(o)}}
function applyLanguage(){document.documentElement.lang=lang==="zh-CN"?"zh-Hans":lang==="zh-TW"?"zh-Hant":lang;const ids=["navMap","navHistory","pageTitle","subtitle","projectCountLabel","verifiedCountLabel","searchLabel","zoneLabel","statusLabel","minPriceLabel","maxPriceLabel","verifiedOnlyLabel","labelsEnabledLabel","sellMode","rentMode","resultsTitle","fitResults","dataCaution","baseMapLabel","metroLabel","planningLabel","uploadPlanningLabel","layerNote","planningOfficial","confirmedLegend","approxLegend","noticeHeading","noticeBody","retryMap"];ids.forEach(id=>setText(id,tr(id)));const v=$("zone").value,s=$("status").value;fillSelect($("zone"),[["all",tr("all")],...Object.entries(zones)]);$("zone").value=v||"all";fillSelect($("status"),[["all",tr("all")],["sale",tr("sale")],["handover",tr("handover")]]);$("status").value=s||"all";render()}
function validProject(p){return p&&typeof p.id==="string"&&typeof p.name==="string"&&Number.isFinite(+p.lat)&&Number.isFinite(+p.lng)&&p.lat>9&&p.lat<12&&p.lng>105&&p.lng<109}
function filtered(){const q=$("search").value.toLocaleLowerCase().trim(),zone=$("zone").value,status=$("status").value,min=Number($("minPrice").value)||0,max=$("maxPrice").value?Number($("maxPrice").value):Infinity;return projects.filter(p=>{const content=[p.name,p.address,p.developer,p.zoneNew].join(" ").toLocaleLowerCase();return (!q||content.includes(q))&&(zone==="all"||p.zone===zone)&&(status==="all"||p.status===status)&&(!$("verifiedOnly").checked||p.coordVerified)&&(+p.max>=min&&+p.min<=max)})}
function renderList(items){const el=$("projectList");el.replaceChildren();if(!items.length){el.append(node("p","muted",tr("noResults")));return}for(const p of items){const b=node("button","projectCard");b.type="button";b.append(node("div","name",p.name),node("div","sub",(zones[p.zone]||p.zoneNew||"TP.HCM")+" · "+(p.coordVerified?tr("locationVerified"):tr("locationEstimated"))),node("div","price",band(p)));b.append(node("span","tag"+(p.coordVerified?" verified":""),p.priceVerified?"Đã xác minh giá":tr("priceRef")));b.addEventListener("click",()=>openProject(p));el.append(b)}}
function clearMarkers(){markers.forEach(m=>m.remove());markers=[]}
function renderMarkers(items){
 if(!map||!interactive)return;clearMarkers();
 const compact=!$("labelsEnabled").checked;
 const lowZoom=map.getZoom()<12.3&&$("labelsEnabled").checked;
 const addProjectMarker=(p,small)=>{
  const b=node("button","projectMarker "+(p.coordVerified?"verified":"estimate")+(p.id===selected?" selected":"")+(small?" compact":""));
  b.type="button";b.title=p.name+" · "+band(p)+" · "+(p.coordVerified?tr("locationVerified"):tr("locationEstimated"));
  b.setAttribute("aria-label",b.title);
  b.append(node("b","",p.name),node("span","",labelPrice(p)));
  b.addEventListener("click",e=>{e.stopPropagation();openProject(p)});
  markers.push(new maplibregl.Marker({element:b,anchor:"center"}).setLngLat([+p.lng,+p.lat]).addTo(map));
 };
 if(lowZoom){
  // DOM-marker grouping at regional zoom avoids 32 overlapping price tiles.
  // These are groups for presentation only, not additional data points.
  const groups=new Map();
  for(const p of items){
   const pt=map.project([+p.lng,+p.lat]);
   const key=Math.floor(pt.x/115)+":"+Math.floor(pt.y/85);
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(p);
  }
  for(const g of groups.values()){
   if(g.length===1){addProjectMarker(g[0],false);continue}
   const center={lng:g.reduce((a,x)=>a+Number(x.lng),0)/g.length,lat:g.reduce((a,x)=>a+Number(x.lat),0)/g.length};
   const b=node("button","projectCluster");b.type="button";b.title=g.length+" dự án tại khu vực này · Nhấp để phóng to";
   b.setAttribute("aria-label",b.title);
   b.append(node("strong","",String(g.length)),node("small","",lang==="en"?"projects":lang==="zh-CN"||lang==="zh-TW"?"个项目":"dự án"));
   b.addEventListener("click",e=>{e.stopPropagation();map.easeTo({center:[center.lng,center.lat],zoom:Math.min(16,Math.max(13,map.getZoom()+2)),duration:450})});
   markers.push(new maplibregl.Marker({element:b,anchor:"center"}).setLngLat([center.lng,center.lat]).addTo(map));
  }
  return;
 }
 for(const p of items)addProjectMarker(p,compact);
}

function foldUniverse(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g,"")}
function archiveStatusLabel(code){return ({
issuer_says_completed:"Nguồn doanh nghiệp: hoàn thành",
issuer_says_handed_over:"Nguồn doanh nghiệp: đã bàn giao",
historical_portfolio_presence:"Có trong hồ sơ lịch sử doanh nghiệp",
operating_referenced_by_historic_rental_market:"Có trong báo cáo thị trường thuê cũ",
platform_directory_candidate_only:"Danh mục nền tảng — chờ kiểm chứng",
platform_reports_handed_over_unverified:"Tin bên thứ ba báo bàn giao",
map_existing_unverified_status:"Có trong bản đồ"
})[code]||"Đang đối chiếu nguồn"}
function openArchiveProfile(p){
 const el=$("detail");if(!el)return;
 selected=null;el.replaceChildren();el.hidden=false;
 const close=node("button","close","×");close.type="button";close.ariaLabel="Đóng hồ sơ";close.onclick=()=>{el.hidden=true};el.append(close);
 el.append(node("span","eyebrow","QiMap / HỒ SƠ THỊ TRƯỜNG THỨ CẤP"),node("h2","",p.name));
 el.append(node("p","",archiveStatusLabel(p.lifecycle_status)));
 el.append(node("div","caution","Chưa xác minh tọa độ để gắn ghim. Chưa có giá chuyển nhượng/giá thuê từng căn được duyệt. Đây là hồ sơ nghiên cứu, không phải giỏ hàng đang giao dịch."));
 detailRow(el,"Nhà phát triển/nhóm nguồn",p.developer||"Chưa xác minh");
 detailRow(el,"Địa bàn lịch sử",p.region_scope||"Chưa đối chiếu địa giới");
 detailRow(el,"Năm bàn giao nguồn ghi nhận",p.year_handover||"Chưa xác minh");
 if(p.project_group)detailRow(el,"Dự án mẹ / phân kỳ",p.project_group+" · không cộng số căn hai lần");
 detailRow(el,"Phân loại thị trường","Thứ cấp: đang nghiên cứu · Cho thuê: đang nghiên cứu");
 const url=validUrl(p.source_url);
 if(url){const a=node("a","","Xem tài liệu dẫn nguồn ↗");a.href=url;a.rel="noopener noreferrer";a.target="_blank";el.append(a)}
 const link=node("a","","Mở hồ sơ trong kho căn hộ cũ ↗");
 link.href="./secondary-catalog.html?q="+encodeURIComponent(p.name);el.append(link);
}
function renderUniverseSidebar(){
 const root=$("universeSearchResults");if(!root)return;root.replaceChildren();
 const counts=projectUniverse?.counts||{};
 setText("universeMapTotal",counts.combined_project_and_phase_records?String(counts.combined_project_and_phase_records):"—");
 setText("universeMapExtra",counts.archive_only_records?String(counts.archive_only_records):"—");
 const q=foldUniverse($("search")?.value.trim());
 if(!q||q.length<2){
  root.append(node("p","universeMessage","Nhập tên dự án cũ, ví dụ “Sunrise City” hoặc “The Vista”."));
  return;
 }
 const matches=(projectUniverse.records||[]).filter(p=>!p.has_existing_map_marker&&[p.name,p.developer,...(p.aliases||[])].some(v=>foldUniverse(v).includes(q)));
 const count=node("p","universeSearchCount",matches.length+" hồ sơ lịch sử phù hợp — không có ghim tọa độ");
 root.append(count);
 if(!matches.length){root.append(node("p","universeMessage","Chưa tìm thấy trong kho nghiên cứu. Mở kho đầy đủ để xem theo nhà phát triển."));return}
 for(const p of matches.slice(0,10)){
  const card=node("button","archiveResearchCard");card.type="button";
  card.append(node("strong","",p.name),node("span","",archiveStatusLabel(p.lifecycle_status)),node("small","","Chưa xác minh tọa độ / giá thứ cấp"));
  card.onclick=()=>openArchiveProfile(p);root.append(card);
 }
 if(matches.length>10){const more=node("a","archiveMore","Xem đủ "+matches.length+" hồ sơ ↗");more.href="./secondary-catalog.html?q="+encodeURIComponent($("search").value.trim());root.append(more)}
}
function render(){if(!projects.length)return;const items=filtered();setText("projectCount",String(items.length));setText("verifiedCount",String(items.filter(x=>x.coordVerified).length));renderList(items);renderMarkers(items);renderUniverseSidebar()}
function detailRow(parent,key,value){const row=node("div","detailRow");row.append(node("span","",key),node("span","",value));parent.append(row)}
function openProject(p){selected=p.id;renderMarkers(filtered());const el=$("detail");el.replaceChildren();el.hidden=false;const close=node("button","close","×");close.type="button";close.ariaLabel="Close";close.addEventListener("click",()=>{selected=null;el.hidden=true;renderMarkers(filtered())});el.append(close,node("span","eyebrow","QiMap / PROJECT PROFILE"),node("h2","",p.name),node("p","",p.address||p.zoneNew||""));el.append(node("strong","",band(p)));el.append(node("div","caution",tr("dataWarning")));detailRow(el,tr("projectStatus"),tr(p.status)||p.status||"—");detailRow(el,tr("developer"),p.developer||"—");detailRow(el,tr("locationVerified"),p.coordVerified?tr("locationVerified"):tr("locationEstimated"));detailRow(el,tr("foreignInvestment"),tr("unverified"));detailRow(el,tr("foreignBuyer"),tr("unverified"));detailRow(el,tr("history"),tr("historyMissing"));detailRow(el,tr("review"),tr("reviewMissing"));appendTransportProfile(el,p);appendDeveloperProfile(el,p);appendOfficialSourceStatus(el,p);detailRow(el,"Ngày dữ liệu nhập",p.updated?safeDate(p.updated):"—");const url=validUrl(p.source);if(url){const a=node("a","",tr("source"));a.href=url;a.rel="noopener noreferrer";a.target="_blank";el.append(a)}const route=node("a","","Xem hồ sơ vị trí trên OpenStreetMap ↗");route.target="_blank";route.rel="noopener noreferrer";route.href="https://www.openstreetmap.org/?mlat="+encodeURIComponent(p.lat)+"&mlon="+encodeURIComponent(p.lng)+"#map=16/"+encodeURIComponent(p.lat)+"/"+encodeURIComponent(p.lng);el.append(route);if(map)map.easeTo({center:[+p.lng,+p.lat],zoom:Math.max(12,map.getZoom()),duration:500})}
function fitProjects(){if(!map)return;const list=filtered();if(!list.length)return;const bounds=new maplibregl.LngLatBounds();list.forEach(p=>bounds.extend([+p.lng,+p.lat]));if(list.length===1)map.easeTo({center:[+list[0].lng,+list[0].lat],zoom:14});else map.fitBounds(bounds,{padding:{top:80,bottom:90,left:80,right:window.innerWidth>800?300:80},maxZoom:14,duration:600})}
function rasterStyle(mode){const url=mode==="sat"?"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}":"https://tile.openstreetmap.org/{z}/{x}/{y}.png";const att=mode==="sat"?"Tiles © Esri, Maxar, Earthstar Geographics":"© OpenStreetMap contributors";return {version:8,sources:{base:{type:"raster",tiles:[url],tileSize:256,attribution:att}},layers:[{id:"base",type:"raster",source:"base"}]}}
function setBase(mode,automatic){if(!map)return;clearTimeout(lastStyleTimer);styleMode=mode;$("baseMap").value=mode;errorCount=0;const style=mode==="vector"?"https://tiles.openfreemap.org/styles/liberty":rasterStyle(mode);setText("noticeBody",automatic?"Nguồn nền trước đó không phản hồi; đang thử "+mode+"...":tr("noticeBody"));map.setStyle(style);lastStyleTimer=setTimeout(()=>{if(styleMode==="vector")setBase("osm",true);else if(styleMode==="osm")setBase("sat",true);else showFailure()},12000)}
function showFailure(){const n=$("mapNotice");n.hidden=false;setText("noticeHeading",tr("noticeHeading"));setText("noticeBody",tr("noticeBody"))}

function renderMetroCatalog(){
 const host=$("transitList");if(!host)return;host.replaceChildren();
 const filter=$("metroStatusFilter")?.value||"all";
 const all=Array.isArray(metroCatalog?.lines)?metroCatalog.lines:[];
 const items=all.filter(line=>filter==="all"||(filter==="other"?!["operating","under_construction"].includes(line.status):line.status===filter));
 if(!items.length){host.append(node("small","",all.length?"Không có tuyến phù hợp.":"Chưa có dữ liệu tuyến."));return}
 for(const line of items){
  const el=node("div","transitItem");
  const status=node("span","transitStatus "+line.status,line.status_label_vi||line.status);
  const title=node("strong","",line.name);
  const foot=node("small","",line.opened_on?"Vận hành từ "+line.opened_on:line.construction_start?"Khởi công "+line.construction_start:line.target_label||"Đang chuẩn bị");
  el.append(status,title,foot);
  if(line.target_year&&!line.opened_on&&line.construction_start)el.append(node("small","transitTarget","Mốc kế hoạch: "+(line.target_label||line.target_year)));
  if(line.target_year&&!line.opened_on&&!line.construction_start)el.append(node("small","transitTarget","Dự kiến: "+(line.target_label||line.target_year)));
  if(line.geometry_status==="no_verified_gis")el.append(node("small","transitWarning","Chưa có tim tuyến GIS đáng tin cậy để vẽ"));
  if(validUrl(line.source_url)){const a=node("a","","Xem nguồn cơ quan công bố ↗");a.href=line.source_url;a.target="_blank";a.rel="noopener noreferrer";el.append(a)}
  host.append(el);
 }
}
function renderPlanningCatalog(){
 const host=$("planningSources");if(!host)return;host.replaceChildren();
 for(const src of planningCatalog?.sources||[]){const href=validUrl(src.url);if(!href)continue;const a=node("a","",src.name+" ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";host.append(a)}
}
function createStopPopup(evt){
 const feature=evt?.features?.[0];if(!feature||!map)return;
 const props=feature.properties||{},coordinates=feature.geometry?.coordinates;
 if(!Array.isArray(coordinates)||coordinates.length<2)return;
 const isMetro=props.category==="metro_station";
 const box=node("div","atlasStopPopup");box.append(node("strong","",String(props.name|| (isMetro?"Ga metro":"Trạm xe buýt"))));
 box.append(node("p","",isMetro?"Điểm ga theo OpenStreetMap, chưa đối chiếu dữ liệu vận hành.":"Vị trí điểm dừng theo OpenStreetMap; tuyến, giờ và tình trạng sử dụng cần kiểm chứng."));
 if(validUrl(props.osm_url)){const a=node("a","","Kiểm tra điểm trên OpenStreetMap ↗");a.href=props.osm_url;a.target="_blank";a.rel="noopener noreferrer";box.append(a)}
 new maplibregl.Popup({offset:14,maxWidth:"260px"}).setLngLat(coordinates).setDOMContent(box).addTo(map);
}
function initTransitInteractions(){
 if(!map||transitPopupsRegistered)return;transitPopupsRegistered=true;
 for(const id of ["atlasMetroStations","atlasBusStops"]){
  map.on("click",id,createStopPopup);
  map.on("mouseenter",id,()=>{map.getCanvas().style.cursor="pointer"});
  map.on("mouseleave",id,()=>{map.getCanvas().style.cursor=""});
 }
}
function asGeoCollection(obj){return obj?.type==="FeatureCollection"&&Array.isArray(obj.features)?obj:{type:"FeatureCollection",features:[]}}
function updateTransitLayers(){
 if(!map||!map.getStyle())return;
 const specs=[
  {source:"atlasMetroStops",layer:"atlasMetroStations",data:metroStops,color:"#236caa",radius:6,stroke:2,minZoom:10},
  {source:"atlasBusStopsSource",layer:"atlasBusStops",data:busStops,color:"#328b68",radius:4,stroke:1.3,minZoom:12.6}
 ];
 for(const x of specs){
  if(!map.getSource(x.source))map.addSource(x.source,{type:"geojson",data:asGeoCollection(x.data),attribution:"© OpenStreetMap contributors · ODbL"});
  else map.getSource(x.source).setData(asGeoCollection(x.data));
  if(!map.getLayer(x.layer))map.addLayer({id:x.layer,type:"circle",source:x.source,minzoom:x.minZoom,paint:{"circle-radius":x.radius,"circle-color":x.color,"circle-stroke-width":x.stroke,"circle-stroke-color":"#ffffff","circle-opacity":0.92}});
  const enabled=x.layer==="atlasMetroStations"?$("metroStationsToggle")?.checked:$("busStopsToggle")?.checked;
  map.setLayoutProperty(x.layer,"visibility",enabled?"visible":"none");
 }
 initTransitInteractions();
}
function transitDistance(a,b){const rad=Math.PI/180;const dlat=(b[1]-a[1])*rad,dlon=(b[0]-a[0])*rad;const h=Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
function closestStop(project,geo){
 const coord=[Number(project.lng),Number(project.lat)];
 let best=null;
 for(const f of geo?.features||[]){const c=f.geometry?.coordinates;if(!Array.isArray(c)||!Number.isFinite(c[0])||!Number.isFinite(c[1]))continue;const d=transitDistance(coord,c);if(!best||d<best.meters)best={name:f.properties?.name||"Điểm dừng",meters:d}}
 return best;
}
function appendTransportProfile(container,project){
 const metroStop=closestStop(project,metroStops),busStop=closestStop(project,busStops);
 if(metroStop)detailRow(container,"Ga Metro gần nhất (đường chim bay)",metroStop.name+" · "+Math.round(metroStop.meters)+"m");
 if(busStop)detailRow(container,"Trạm xe buýt gần nhất (đường chim bay)",busStop.name+" · "+Math.round(busStop.meters)+"m");
 if(metroStop||busStop)container.append(node("p","transitCaution","Khoảng cách đường chim bay từ tọa độ dự án; không phải quãng đường đi bộ, chưa xác minh tình trạng phục vụ của trạm."));
}
function appendDeveloperProfile(container,project){
 const record=(developerCatalog?.projects||[]).find(item=>item.project_id===project.id);
 if(!record){container.append(node("p","transitCaution","Hồ sơ thông số từ website chủ đầu tư: đang nghiên cứu."));return}
 container.append(node("h3","developerHeading","Thông tin từ nguồn dự án/chủ đầu tư"));
 const labels={land_area_ha:"Diện tích đất",land_area_m2:"Diện tích đất",tower_count:"Số tháp",total_units:"Tổng căn theo công bố",residential_units:"Căn hộ để ở",total_products:"Tổng sản phẩm",product_total_approx:"Tổng sản phẩm (xấp xỉ)"};
 for(const claim of record.claims||[])detailRow(container,labels[claim.field]||claim.field,String(claim.value)+" "+(claim.unit==="ha"?"ha":claim.unit==="m2"?"m²":claim.unit==="towers"?"tháp":claim.unit==="residential_units"?"căn":claim.unit==="units"?"căn":"sản phẩm"));
 if(record.foreign_partner_participation_verified)detailRow(container,"Đối tác quốc tế được công bố",(record.foreign_partners_reported||[]).join(", "));
 container.append(node("p","transitCaution","Dữ kiện do đơn vị phát triển công bố; chưa đồng nghĩa hồ sơ pháp lý hoặc quyền mua của khách nước ngoài được xác minh."));
 for(const src of (record.sources||[]).slice(0,2)){const href=validUrl(src.url);if(!href)continue;const a=node("a","","Nguồn: "+new URL(href).hostname+" ↗");a.href=href;a.target="_blank";a.rel="noopener noreferrer";container.append(a)}
}


function appendOfficialSourceStatus(container,project){
 const ref=developerOfficialRegistry.projects?.find(p=>p.project_id===project.id);
 const watch=developerMonitorState.projects?.[project.id];
 const status=watch?.monitor_status||"not_checked";
 const heading=node("h3","developerHeading","Nguồn doanh nghiệp phát triển · theo dõi hằng ngày");
 container.append(heading);
 if(!ref?.source){
  container.append(node("p","officialSourceWarning","Chưa xác minh trang nguồn chính thức của doanh nghiệp phát triển. QiMap không thay bằng website môi giới."));
 }else{
  const sourceLink=validUrl(ref.source.url);
  if(sourceLink){
   const link=node("a","officialSourceLink","Mở trang nguồn doanh nghiệp ↗");
   link.href=sourceLink;link.target="_blank";link.rel="noopener noreferrer";container.append(link);
  }
  const role=ref.source.role==="developer_portfolio"?"Trang danh mục của doanh nghiệp":ref.source.role==="developer_project_microsite"?"Website dự án liên kết với thương hiệu phát triển":"Trang dự án trên website doanh nghiệp";
  detailRow(container,"Cấp nguồn",role);
  detailRow(container,"Tình trạng rà soát",{
   baseline_created:"Đã tạo mốc dữ liệu để đối chiếu hằng ngày",
   unchanged:"Trang dự án chưa phát hiện thay đổi từ mốc trước",
   source_changed:"Nguồn có thay đổi — đang chờ kiểm chứng",
   skipped_robots:"Website không cho phép bộ quét truy cập",
   blocked_by_publisher:"Website giới hạn truy cập tự động",
   no_project_text_on_official_page:"Chưa tìm thấy thông tin dự án trên trang này",
   http_error:"Nguồn gặp lỗi HTTP — cần kiểm tra lại",
   fetch_error:"Không tải được nguồn trong lượt rà soát",
   official_source_discovery_pending:"Chưa có trang chính thức được xác minh"
  }[status]||"Chưa kiểm tra nguồn theo lịch");
  if(watch?.last_checked_at)detailRow(container,"Ngày kiểm tra trang",safeDate(watch.last_checked_at));
  if(status==="source_changed")container.append(node("p","officialSourceWarning","Thay đổi nguồn chưa được duyệt, không tự động làm thay đổi giá hoặc pháp lý."));
  const candidates=(developerCandidateStaging.candidates||[]).filter(x=>x.project_id===project.id&&x.status==="UNVERIFIED_REVIEW_REQUIRED");
  if(candidates.length)detailRow(container,"Thông số chờ thẩm định",String(candidates.length)+" gợi ý mới từ nguồn gốc");
 }
 container.append(node("p","transitCaution","Nguồn website doanh nghiệp ≠ xác nhận pháp nhân chủ đầu tư hoặc điều kiện mua cho người nước ngoài. Mọi thông số mới cần đối chiếu tài liệu và thời điểm công bố."));
 const more=node("a","officialSourceLink","Nhật ký rà soát nguồn trên GitHub ↗");
 more.href="https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/44";more.target="_blank";more.rel="noopener noreferrer";container.append(more);
}
function changeLayers(){if(!map||!map.isStyleLoaded())return;const metroOn=$("metroToggle").checked,planOn=$("planningToggle").checked;for(const [id,geo] of [["metro",metro],["planning",planning]]){if(!geo||!map.getSource(id))continue;map.getSource(id).setData(geo)}if(map.getLayer("metroLine"))map.setLayoutProperty("metroLine","visibility",metroOn?"visible":"none");if(map.getLayer("planningFill"))map.setLayoutProperty("planningFill","visibility",planOn?"visible":"none");if(map.getLayer("planningOutline"))map.setLayoutProperty("planningOutline","visibility",planOn?"visible":"none");updateTransitLayers()}
function addLayers(){if(!map||!map.isStyleLoaded())return;try{if(!map.getSource("metro"))map.addSource("metro",{type:"geojson",data:metro||{type:"FeatureCollection",features:[]}});if(!map.getLayer("metroLine"))map.addLayer({id:"metroLine",type:"line",source:"metro",layout:{"line-join":"round","line-cap":"round",visibility:"none"},paint:{"line-color":"#cf5d3e","line-width":4,"line-opacity":0.86,"line-dasharray":[2,2]}});if(!map.getSource("planning"))map.addSource("planning",{type:"geojson",data:planning||{type:"FeatureCollection",features:[]}});if(!map.getLayer("planningFill"))map.addLayer({id:"planningFill",type:"fill",source:"planning",layout:{visibility:"none"},paint:{"fill-color":"#b58e54","fill-opacity":0.23}});if(!map.getLayer("planningOutline"))map.addLayer({id:"planningOutline",type:"line",source:"planning",layout:{visibility:"none"},paint:{"line-color":"#9d6e3f","line-width":2}});changeLayers();updateTransitLayers()}catch(err){console.warn("ATLAS GIS:",err)}}
function initMap(){if(typeof maplibregl==="undefined"){showFailure();return}const p=new URLSearchParams(location.search);let lat=Number(p.get("lat")),lng=Number(p.get("lng")),z=Number(p.get("z"));const validCoord=p.has("lat")&&p.has("lng")&&lat>9&&lat<12&&lng>105&&lng<109;map=new maplibregl.Map({container:"map",style:"https://tiles.openfreemap.org/styles/liberty",center:validCoord?[lng,lat]:[106.73,10.82],zoom:p.has("z")&&z>=8&&z<=18?z:11,attributionControl:true});map.addControl(new maplibregl.NavigationControl({showCompass:false}),"bottom-right");map.on("style.load",()=>{interactive=true;addLayers();renderMarkers(filtered())});map.on("moveend",()=>renderMarkers(filtered()));map.on("idle",()=>{clearTimeout(lastStyleTimer);$("mapNotice").hidden=true});map.on("error",err=>{errorCount++;console.warn("ATLAS map:",err?.error?.message||"tile error");if(errorCount>=8){if(styleMode==="vector")setBase("osm",true);else if(styleMode==="osm")setBase("sat",true);else showFailure()}});lastStyleTimer=setTimeout(()=>{if(styleMode==="vector")setBase("osm",true)},12000)}
async function getJson(path){const r=await fetch(new URL(path,document.baseURI),{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);return r.json()}
async function loadData(){try{const p=await getJson("data/projects.json");if(!Array.isArray(p))throw Error("invalid projects");projects=p.filter(validProject)}catch(err){setText("projectList",tr("loadError")+" "+err.message);projects=[]}const layerData=await Promise.allSettled([getJson("data/metro_1_schematic.geojson"),getJson("data/planning_layers.geojson")]);metro=layerData[0].status==="fulfilled"?layerData[0].value:null;planning=layerData[1].status==="fulfilled"?layerData[1].value:null;if(!planning)planning={type:"FeatureCollection",features:[]};if(map&&map.isStyleLoaded())addLayers();const other=await Promise.allSettled([getJson("data/transit_lines_2026.json"),getJson("data/planning_sources_2026.json"),getJson("data/project_developer_sources.json"),getJson("data/metro_stations_osm.geojson"),getJson("data/bus_stops_osm.geojson"),getJson("data/developer_official_registry.json"),getJson("data/developer_source_monitor_state.json"),getJson("data/developer_fact_candidates.json"),getJson("data/project_search_index.json")]);
metroCatalog=other[0].status==="fulfilled"?other[0].value:{lines:[]};planningCatalog=other[1].status==="fulfilled"?other[1].value:{sources:[]};developerCatalog=other[2].status==="fulfilled"?other[2].value:{projects:[]};
metroStops=asGeoCollection(other[3].status==="fulfilled"?other[3].value:null);busStops=asGeoCollection(other[4].status==="fulfilled"?other[4].value:null);
developerOfficialRegistry=other[5].status==="fulfilled"?other[5].value:{projects:[]};developerMonitorState=other[6].status==="fulfilled"?other[6].value:{projects:{}};developerCandidateStaging=other[7].status==="fulfilled"?other[7].value:{candidates:[]};
projectUniverse=other[8].status==="fulfilled"&&Array.isArray(other[8].value?.records)?other[8].value:{records:[],counts:{}};
renderMetroCatalog();renderPlanningCatalog();updateTransitLayers();const selectedId=new URLSearchParams(location.search).get("p");if(selectedId){const project=projects.find(x=>x.id===selectedId);if(project)setTimeout(()=>openProject(project),500)}render()}
function setup(){try{lang=localStorage.getItem("atlas.language")||"vi"}catch(_){}if(!["vi","en","zh-CN","zh-TW","ko","ru"].includes(lang))lang="vi";$("language").value=lang;const controls=["search","zone","status","minPrice","maxPrice","verifiedOnly","labelsEnabled"];controls.forEach(id=>$(id).addEventListener("input",render));$("language").addEventListener("change",e=>{lang=e.target.value;try{localStorage.setItem("atlas.language",lang)}catch(_){}applyLanguage()});$("fitResults").onclick=fitProjects;$("mobileSidebar").onclick=()=>$("sidebar").classList.toggle("open");$("baseMap").onchange=e=>setBase(e.target.value,false);$("metroToggle").onchange=()=>{if(!metro)console.warn("Metro data missing");changeLayers()};$("metroStationsToggle").onchange=updateTransitLayers;$("busStopsToggle").onchange=updateTransitLayers;$("metroStatusFilter").onchange=renderMetroCatalog;$("planningToggle").onchange=()=>{if(!planning?.features?.length){alert(tr("planningEmpty"));$("planningToggle").checked=false}changeLayers()};$("planningUpload").onchange=async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>5e6){alert(tr("planningInvalid"));return}try{const g=JSON.parse(await f.text());if(g.type!=="FeatureCollection"||!Array.isArray(g.features)||g.features.length>2000)throw Error("Invalid GeoJSON");planning=g;$("planningToggle").checked=true;changeLayers();alert(tr("planningLoaded"))}catch(err){alert(tr("planningInvalid"))}e.target.value=""};$("retryMap").onclick=()=>setBase("vector",false);$("map").addEventListener("click",()=>{if(window.innerWidth<820)$("sidebar").classList.remove("open")});applyLanguage()}
setup();initMap();loadData();
})();