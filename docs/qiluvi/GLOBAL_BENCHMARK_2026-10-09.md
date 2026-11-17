# QILUVI Global Benchmark Report — Sprint 0 / 09-10-2026

**Chủ trì:** Global Real Estate Research Director (GLOBAL-01) • **Phản biện:** Independent Risk Auditor • **P:** P1 • **Trạng thái:** desk research có nguồn, **chưa phải full UX test**.

## Phạm vi và phương pháp
- 19 website/dịch vụ trong 5 thị trường; nguồn là trang chính thức có thể xem hoặc kết quả đánh chỉ mục chính thức, được rà soát ngày **09/10/2026**. Danh sách gồm dịch vụ công và dịch vụ thương mại; không ngụ ý mọi dịch vụ là doanh nghiệp môi giới.
- **C2:** kiểm tra được trang với nội dung/menu/định nghĩa tính năng; **C1:** xác nhận domain hoặc index, chưa đủ để khẳng định luồng cụ thể; **C0:** bị 403/timeout hoặc thiếu quyền. Không có trạng thái C3 (đã hoàn thành 3 luồng tương tác trong browser cho mỗi sản phẩm) ở vòng này.
- Không chụp ảnh trực tiếp vì môi trường không có trình duyệt tương tác với 19 nền tảng; không diễn đạt đọc HTML/search result thành trải nghiệm khách hàng. **Acceptance GLOBAL-01 về 3 journeys/nền tảng hiện BLOCKED**.
- Không sao chép hình ảnh, data feeds, code, review của đối thủ. Cần rà lại điều khoản/API mỗi nguồn trước khi sử dụng dữ liệu. Chỉ quan sát pattern UX công khai.

## Bảng benchmark 19 nguồn

| # | Vùng | Nền tảng | Mức xác nhận | Tính năng/đường vào đã thấy | Áp dụng/điều chỉnh tại Việt Nam | Không được suy diễn / bước còn thiếu | Chứng cứ |
|---:|---|---|---|---|---|---|---|
| 1 | CN | **贝壳找房 / Beike** | C1 | Portal tìm mới/cũ/thuê; nghiên cứu 楼盘字典, 真房源 | Học thực thể khu nhà/tòa; không nhập dữ liệu đối thủ | Kiểm tra 3 luồng desktop/mobile vẫn BLOCKED do truy cập nội dung hạn chế | [Nguồn](https://www.ke.com/) |
| 2 | CN | **链家 / Lianjia** | C2 | Danh sách khu nhà hiển thị số giao dịch lịch sử trên hệ thống và mức giá; cảnh báo bảng xếp hạng không đại diện toàn thị trường | Học hồ sơ community, luôn giải thích giao dịch thuộc cơ sở dữ liệu nào | Không suy ra giao dịch pháp lý Việt Nam từ listing/broker | [Nguồn](https://m.lianjia.com/sh/bangdan/ibd5/) |
| 3 | CN | **房天下 / Fang.com** | C2 | Trang tra cứu giá và xu hướng giá theo khu vực | Học điều hướng địa bàn và diễn giải price basis | Không tái sử dụng chỉ số giá hoặc hình gốc | [Nguồn](https://m.fang.com/fangjia/cn.html) |
| 4 | CN | **安居客 / Anjuke** | C1 | Trang giới thiệu căn hộ mới/cũ/thuê; hành trình sâu chưa kiểm tra | Học phân tách inventory và buyer/renter task | Không khẳng định tính xác thực của mọi tin đăng | [Nguồn](https://www.anjuke.com/) |
| 5 | TW | **591 房屋交易網** | C2 | Menu đăng bán/thuê, nhà mới, giao dịch thực công bố, bản đồ, mortgage calculator, nguồn dịch vụ | Học tách quảng cáo khỏi dữ liệu giao dịch và bộ lọc thuê | Việt Nam chưa có luồng đăng ký giao dịch công khai đồng cấp | [Nguồn](https://www.591.com.tw/) |
| 6 | TW | **永慶房屋 / Yungching** | C2 | Tra cứu giao dịch thực và địa bàn theo tuyến vùng | Học đặt dữ liệu giao dịch cạnh thông tin môi giới | Không trình bày thông tin bên bán là dữ liệu chính quyền | [Nguồn](https://evertrust.yungching.com.tw/regionall/) |
| 7 | TW | **樂居 / Leju** | C2 | Giao dịch thực bản đồ/list, hồ sơ cộng đồng, nhà mới, ghi chú xem nhà | Học community-first và map/list switch | Điều chỉnh cho dự án mẹ/phân kỳ/tháp tại Việt Nam | [Nguồn](https://www.leju.com.tw/) |
| 8 | JP | **SUUMO** | C2 | Tìm căn hộ cũ theo ga/khu/vùng/đường đi và bản đồ | Học thông tin khoảng cách ga, tách căn và khu nhà | Không thay bằng khoảng cách đường chim bay | [Nguồn](https://suumo.jp/ms/chuko/tokyo/) |
| 9 | JP | **LIFULL HOME'S Index** | C2 | Registry khu chung cư, giá tham khảo/thuê, đi bộ tới ga | Học hồ sơ tòa gốc kết hợp diễn giải AI estimate | Chỉ tạo estimate ở VN khi có mẫu và kiểm định | [Nguồn](https://lifullhomes-index.jp/building-list/mansion/tokyo-pref/) |
| 10 | JP | **MLIT 不動産情報ライブラリ** | C2 | Cổng giao dịch, đất, GIS quy hoạch, nguy cơ thiên tai, download/API có điều kiện | Học provenance và data-service design | Không được tái phân phối trái điều khoản; chưa có dữ liệu tương đương tại VN | [Nguồn](https://www.reinfolib.mlit.go.jp/) |
| 11 | KR | **Naver Real Estate** | C0 | Trang chính không tải được trong phiên kiểm tra | Nghiên cứu tiếp khi có browser được phép | Tuyệt đối không xác nhận tính năng chưa truy cập | [Nguồn](https://new.land.naver.com/) |
| 12 | KR | **KB부동산** | C2 | Tra cứu 시세, AI시세, thực giao dịch, mua/jeonse/thuê; có phần cần JS/login | Học nguồn định giá và cơ chế giải thích giá | Không tự dùng valuation cho vay ở VN | [Nguồn](https://kbland.kr/main/quickPriceSearch) |
| 13 | KR | **호갱노노 / Hogangnono** | C0 | Truy cập trực tiếp bị 403 | Ứng viên benchmark trải nghiệm bản đồ/giá sau khi có quyền | Chưa kết luận có chức năng cụ thể đang hoạt động | [Nguồn](https://hogangnono.com/) |
| 14 | KR | **직방 / Zigbang** | C0 | Truy cập trực tiếp bị 403 | Ứng viên nghiên cứu hình ảnh/3D khi có browser | Chưa kết luận có VR hiện thời | [Nguồn](https://www.zigbang.com/) |
| 15 | KR | **MOLIT 실거래가공개시스템** | C2 | Cổng công bố thực giao dịch nhà chung cư, đất và tải dữ liệu | Học ghi loại giao dịch, phân tích kỳ và phát hành sau độ trễ | Không suy luận Việt Nam có cùng mức độ công khai | [Nguồn](https://rt.molit.go.kr/) |
| 16 | US | **Zillow** | C2 | Zestimate công bố cách hiểu estimate, lịch sử giá và các nguyên nhân sai lệch | Học cảnh báo sai số/nguồn dữ liệu ngoài-sàn | Không đưa Zestimate-style điểm giá nếu không có calibration | [Nguồn](https://www.zillow.com/zestimate/) |
| 17 | US | **Redfin** | C2 | Công bố định nghĩa thống kê, cải biên dữ liệu và quy tắc cho vùng ít mẫu | Học data dictionary, suppression, revised series | Không gọi báo cáo môi giới là nguồn chính thức pháp lý | [Nguồn](https://www.redfin.com/news/data-center/methodology/) |
| 18 | US | **Realtor.com** | C2 | Trung tâm dữ liệu thị trường cùng lịch nghiên cứu | Học chỉ số địa bàn, chú thích phương pháp | Nguồn MLS tại Mỹ không có bản sao trực tiếp ở Việt Nam | [Nguồn](https://www.realtor.com/RESEARCH/DATA/) |
| 19 | US | **Homes.com** | C2 | Tìm condo buildings, khu vực, trường học, nhà mới/cũ/thuê, công cụ affordability | Học hành trình nhu cầu khu dân cư + căn hộ | Không mở rộng tính năng viễn cảnh thiếu dữ liệu | [Nguồn](https://www.homes.com/) |

## Bốn benchmark sâu nên học trước
1. **Lianjia / Beike (community registry):** tên dự án, tòa, phân kỳ, lịch sử giao dịch *có phạm vi*; QILUVI tạo stable IDs chứ không dựng data lake từ nội dung họ. Dữ liệu chi tiết Beike chưa được browser-verify; tránh claim “真房源 đã xác thực 100%”.
2. **591 + Leju (giao dịch/thuê):** giá đề nghị, giá giao dịch nguồn đăng ký, nhà mới phải tồn tại như các lớp riêng; tại Việt Nam tình trạng tiếp cận giao dịch thực khác đáng kể. Định nghĩa VERIFIED không phải “có một tin đăng”.
3. **MLIT + MOLIT (public data):** bài học quan trọng là **nguồn dữ liệu pháp định, kỳ, tính phù hợp, độ trễ** hơn là bản đồ bắt mắt. Cả hai có phần công bố giao dịch, nhưng **không cấp quyền** khai thác/cross-border tự động cho QiMap.
4. **Zillow + Redfin (valuation discipline):** QILUVI học khai báo phương pháp và sự bất định, không học việc phát giá ước tính khi chưa có chuỗi giao dịch đạt chuẩn. Redfin có lịch sử chỉnh sửa số liệu và để trống khi mẫu mỏng; tham chiếu trực tiếp: https://www.redfin.com/news/data-center/methodology/.

## Gap / cơ hội thị trường cho khách quốc tế
- **Legal-to-project trace:** mỗi dự án tại VN có hồ sơ pháp nhân, giấy tờ, danh sách dự án được phép sở hữu nước ngoài, quota/tòa và ngày cơ quan xác nhận; khác hoàn toàn từ khóa “SPA” do môi giới nêu.
- **One evidence chain:** nhà đầu tư đọc bất kỳ FACT nào cũng biết: ai phát hành, khi nào, về tòa/phân kỳ nào, giá chào/giao dịch/ước tính, đơn vị diện tích, độ tin cậy và điều kiện sử dụng.
- **Bilingual context-aware market history:** 2006–2026 có phân biệt ranh giới địa bàn cũ/mới, mẫu/số liệu, sơ cấp, resale, rent; không nối những chuỗi khác phương pháp.
- **Investor comparison with unknowns:** model cash flow minh bạch, độ tin cậy theo từng input, cảnh báo **insufficient evidence** nếu thiếu một dữ kiện pháp lý/giá quan trọng.
- **Independence plus commercial disclosure:** chuyển sang giới thiệu tư vấn chỉ sau một lớp so sánh công bằng; xung đột hoa hồng nêu công khai.

## Ba hành trình cần kiểm thử thật ở mỗi nền tảng khi có quyền
- J1 first-time foreign/remote buyer: từ trang chủ tìm một khu nhà → hồ sơ → chứng cứ lịch sử giá → so sánh;
- J2 investor landlord: chọn căn → giá mua → chi phí → thuê → lợi suất → liên hệ;
- J3 family tenant: khu vực làm việc → giao thông/trường học → giá thuê → liên hệ.
Log: URL bắt đầu/kết thúc, click path, desktop/mobile viewport, kết quả, ảnh có timestamp, lỗi, quyền truy cập. **Chưa thực thi J1/J2/J3 trên toàn bộ website ở vòng này.**

## Adopt / Adapt / Reject / Later (không chấm điểm vô căn cứ)
- **ADOPT P0:** source provenance; canonical project-building; giá basis separation; explicit unknown; data freshness; legal gating; đơn vị diện tích.
- **ADAPT P0/P1:** map-based apartment discovery; community price timeline chỉ nơi có dữ liệu; rent yield calculator; bản đồ ga đúng tình trạng; comparison có coverage-confidence.
- **LATER P2:** VR tour có giấy phép; cư dân đánh giá sau xác minh; gợi ý AI dùng dữ liệu đã duyệt; API public; app.
- **REJECT hiện tại:** tự gán “giá trị thị trường chuẩn”; nhập giá/ảnh hàng loạt từ đối thủ; AI ranking có hoa hồng làm tín hiệu; dự án gắn ghim bằng tâm quận; nhãn pháp lý đủ điều kiện không có xác nhận chính thức.

## Rủi ro dữ liệu và mô hình kinh doanh
Phần lớn tính năng ở quốc gia gốc dựa vào thị trường dữ liệu bản địa (MLS, thực giá đăng ký, feed sàn, registry). Điều kiện tại VN khác; cần ưu tiên nguồn công quyền, tài liệu phát hành nhà phát triển, đối tác cấp quyền và khảo sát riêng. URL công khai **không đồng nghĩa** giấy phép tải lại hoặc tái phân phối.

**Definition of done báo cáo benchmark:** >=15 nền tảng có URL; >=3 hành trình thật cho mỗi nền tảng hoặc phân loại blocked; ghi 25 bài học gắn feature matrix; mỗi tuần delta mới; chứng cứ & permissions. Vòng hiện tại hoàn tất **desk benchmark v1**, chưa hoàn tất UX lab full.

**Nguồn truy cập nổi bật:** https://www.591.com.tw/ • https://www.leju.com.tw/ • https://www.reinfolib.mlit.go.jp/ • https://rt.molit.go.kr/ • https://www.zillow.com/zestimate/ • https://www.redfin.com/news/data-center/methodology/ .
