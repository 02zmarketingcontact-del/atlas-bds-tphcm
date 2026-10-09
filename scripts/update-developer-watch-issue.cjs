"use strict";
// Invoked only by actions/github-script on trusted main workflow runs.
const fs=require("node:fs");
module.exports=async function({github,context,core}){
 const path="artifacts/developer-daily-audit.json",issue_number=44;
 if(!fs.existsSync(path)){core.warning("Daily source report not found; no issue update.");return}
 const report=JSON.parse(fs.readFileSync(path,"utf8"));
 const {owner,repo}=context.repo;
 const {data:issue}=await github.rest.issues.get({owner,repo,issue_number});
 const start="<!-- ATLAS_DEVELOPER_WATCH_START -->",end="<!-- ATLAS_DEVELOPER_WATCH_END -->";
 const original=String(issue.body||""),i=original.indexOf(start),j=original.indexOf(end);
 if(i<0||j<i)throw Error("Developer issue missing owned markers");
 const s=report.summary,stamp=report.run_at.slice(0,16).replace("T"," ")+" UTC";
 const changed=(report.alerts||[]).filter(a=>a.kind==="source_content_changed");
 const pending=(report.discovery_queue||[]).map(p=>p.name).slice(0,10);
 const rows=[
 "**Lần kiểm tra:** "+stamp,
 "",
 "| Chỉ số | Kết quả |",
 "|---|---:|",
 "| Dự án trong danh mục | "+s.all_projects+" |",
 "| Có website thương hiệu phát triển đã nhận diện | "+s.assigned_official_brands+" |",
 "| Thiếu nguồn doanh nghiệp được xác minh | "+s.pending_official_source+" |",
 "| Trang nguồn duy nhất được theo dõi | "+s.unique_source_pages+" |",
 "| Trang có nội dung dự án đọc được | "+s.pages_with_project_text+" |",
 "| Trang có thay đổi cần đối chiếu | "+s.changed_pages+" |",
 "| Bị giới hạn / lỗi truy cập | "+s.errors_or_robots+" |",
 "",
 "**Chưa tìm được nguồn doanh nghiệp:** "+(pending.join(", ")||"Không"),
 "",
 "**Thay đổi đang chờ đối chiếu:**",
 ...(changed.length?changed.slice(0,10).map(x=>"- ["+x.projects.join(", ")+"]("+x.url+"): "+(x.candidate_topics||[]).join(", ")):["_Không có thay đổi nội dung được phát hiện sau mốc baseline._"]),
 "",
 "Không tự đăng giá căn hộ, pháp lý, tồn kho hoặc quota người nước ngoài chỉ từ dấu vết thay đổi website.",
 "",
 "[Xem workflow & artifact](https://github.com/"+owner+"/"+repo+"/actions/workflows/atlas-developer-daily.yml)"
 ].join("\n");
 const body=original.slice(0,i+start.length)+"\n"+rows+"\n"+original.slice(j);
 if(body!==original)await github.rest.issues.update({owner,repo,issue_number,body});
 const alerts=report.alerts||[];
 if(!alerts.length){core.info("Daily status updated without material alerts.");return}
 const eventKey="<!-- atlas-official-alert:"+report.run_at.slice(0,10)+":"+alerts.map(a=>a.url).sort().join("|").slice(0,400)+" -->";
 const existing=await github.rest.issues.listComments({owner,repo,issue_number,per_page:100,page:1});
 if(existing.data.some(c=>String(c.body||"").includes(eventKey))){core.info("Already notified.");return}
 const message="@"+owner+" · **ATLAS — nguồn doanh nghiệp có "+alerts.length+" thay đổi cần kiểm tra**\n\n"+
 alerts.slice(0,12).map(a=>"- **"+(a.kind==="source_content_changed"?"Nội dung thay đổi":"Nguồn mất khả năng truy cập")+"**: "+a.url+" — dự án: "+a.projects.join(", ")).join("\n")+
 "\n\n**Không có thông số dự án nào được tự động công bố.** Mở nguồn gốc và đối chiếu trước khi phê duyệt.\n\n"+eventKey;
 await github.rest.issues.createComment({owner,repo,issue_number,body:message});
 core.info("Alert recorded in ATLAS Developer Source Watch issue.");
};