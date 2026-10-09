// QiMap by QILUVI visual identity contract. Keep technical atlas IDs for link compatibility.
const fs=require("node:fs"),assert=require("node:assert/strict");
const read=file=>fs.readFileSync(file,"utf8");
const pages=["index.html","review.html","map-v4.html","history.html","legacy.html"];
for(const path of pages){
 const html=read(path);
 assert(/<title>QiMap[^<]*<\/title>/.test(html),"Missing QiMap title in "+path);
 assert(html.includes('class="qimap-brand-logo"'),"Missing QILUVI logo in "+path);
 assert(html.includes("QiMap"),"Missing QiMap identity in "+path);
 assert(html.includes("./assets/qimap-brand.css"),"Missing shared design system in "+path);
 assert(html.includes("./assets/qiluvi-icon.svg"),"Missing QILUVI favicon in "+path);
 assert(!/<(?:b|strong)>ATLAS<\//.test(html),"Old ATLAS logo shown in "+path);
}
assert(read("index.html").includes("location.replace(destination)"),"Public root must open QiMap homepage");
assert(read("index.html").includes("legacy.html")&&read("index.html").includes("map-v4.html"),"Public routing must preserve legacy and map links");
assert(read("legacy.html").includes("assets/atlas-customer.js"),"Complete V3.2 features must survive in legacy.html");
const css=read("assets/qimap-brand.css");
for(const token of ["#F6F3EC","#223139","#B49B77","#C9CDCC","#FFFFFF"]){
 assert(css.includes(token),"Missing brand color "+token);
}
for(const svg of ["assets/qiluvi-logo-primary.svg","assets/qiluvi-logo-reversed.svg","assets/qiluvi-icon.svg"]){
 const s=read(svg);
 assert(s.startsWith("<svg")&&s.includes("<path")&&s.includes("</svg>"),"Invalid branded SVG "+svg);
 assert(!s.includes("<script"),"Scripts forbidden inside logo "+svg);
}
assert(read("review.html").includes('src="./map-v4.html?embed=1"'),"Map link must survive rebrand");
assert(read("assets/atlas-v4.js").includes("QiMap / PROJECT PROFILE"),"Project sidebar not rebranded");
console.log("QIMAP BRAND QA PASS:",pages.length,"pages; QILUVI logo system and exact PDF palette.");
