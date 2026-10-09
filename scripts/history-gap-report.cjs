// ATLAS 2006-2026 honest historical coverage summary.
const fs=require("node:fs");
const doc=JSON.parse(fs.readFileSync("data/market_history_2006_2026.json","utf8"));
const obs=doc.observations.filter(o=>o.approved_for_public_display===true);
const years=Array.from({length:21},(_,i)=>2006+i);
const covered=years.filter(y=>obs.some(o=>o.year===y));
const rows=["# ATLAS historic source coverage","","Generated UTC: "+new Date().toISOString(),"Approved observations: **"+obs.length+"**","Years with at least one observation: **"+covered.length+"/21**","","| Year | Approved records | Research fields |","|---|---:|---|"];
for(const y of years){const items=obs.filter(o=>o.year===y),metrics=[...new Set(items.map(o=>o.metric))];rows.push("| "+y+" | "+items.length+" | "+(metrics.length?metrics.join(", "):"**MISSING SOURCE**")+" |")}
rows.push("","Missing means no approved observation, never no market activity.");
fs.mkdirSync("artifacts",{recursive:true});const report=rows.join("\n")+"\n";fs.writeFileSync("artifacts/history-gap-report.md",report);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report);console.log("ATLAS history: "+obs.length+" approved observations / "+covered.length+" years with data / 21 labels.");