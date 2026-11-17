# QILUVI — Product Charter & Implementation Plan
**Version:** 0.1 working draft | **Date:** 2026-10-09 | **Status:** Proposal for review, not release sign-off

## 1. Quyết định nền tảng

- **Thương hiệu mẹ:** QILUVI. Định vị: nền tảng thông tin, phân tích và kết nối bất động sản dựa trên bằng chứng.
- **Sản phẩm đầu tiên:** QiMap by QILUVI, bản đồ thông minh + kho dữ liệu căn hộ + phân tích dự án minh bạch.
- **Không đổi** tên repository, URL GitHub Pages hoặc đường dẫn kỹ thuật lúc này, để giữ tương thích. QILUVI là tên thương hiệu hiển thị; QiMap là tên sản phẩm.
- **Địa bàn V1:** TP.HCM và vùng lân cận; lưu đồng thời địa giới lịch sử và địa giới hành chính ở thời điểm được công bố để không làm méo chuỗi dữ liệu.
- **Bất động sản V1:** CHỈ căn hộ mua bán sơ cấp, căn hộ mua bán thứ cấp và căn hộ cho thuê. Không thêm đất nền, nhà phố, KCN, văn phòng hay khách sạn vào V1.
- **Khách hàng chính:** người mua ở thực, nhà đầu tư và khách hàng quốc tế cần dữ liệu Việt Nam có thể giải thích, dẫn nguồn và hiểu đúng pháp lý.
- **Ngôn ngữ ưu tiên:** tiếng Việt / English / 简体中文, thuật ngữ pháp lý dịch kèm nguyên bản tiếng Việt; 繁體中文 sau khi rà soát chất lượng.
- **Lịch sử thị trường:** 2011–2026 là lớp dữ liệu NỀN TẢNG bắt buộc ngay từ đầu (nếu thiếu phải đánh dấu khoảng trống theo năm/quý). Tư liệu trước 2011 là lớp mở rộng có nguồn, không được thay thế giai đoạn 2011–2026.
- **Điểm khác biệt:** không sao chép tin đăng hàng loạt; không giả định dữ liệu không có; phân biệt dữ liệu đã xác minh, lời quảng cáo và phân tích/suy luận.

## 2. Brand Architecture

| Thành phần | Tên | Trách nhiệm |
|---|---|---|
| Corporate / master brand | **QILUVI** | Sứ mệnh, niềm tin, nghiên cứu, kết nối và bảo đảm phương pháp |
| Product | **QiMap** | Bản đồ, discovery, analytics, so sánh dự án, historical intelligence |
| Endorsement | **QiMap by QILUVI** | Dùng trên header, footer, metadata, landing page |
| Technical | `atlas-bds-tphcm` | Giữ tương thích; không hiển thị như tên thương hiệu |

**Giá trị thương hiệu:** Connectivity / Transparency / Intelligence / Trust / Future-ready.

**Đề xuất định vị (không phải tuyên bố về chất lượng dữ liệu đã đạt):**
- VI: **Kết nối dữ liệu. Làm rõ quyết định.**
- EN: **Connected Data. Clearer Decisions.**
- ZH-CN: **连接数据，明晰决策。**

**Câu chuyện biểu tượng:** hai hình khối kết nối tạo thành cấu trúc mở, diễn đạt cầu nối giữa thị trường Việt Nam, dữ liệu và người sử dụng. Ý nghĩa cá nhân Hân – Dy – Kỳ có thể được giấu trong bản giải thích nội bộ; không suy diễn rằng tên hoặc hình khối mang nghĩa tiếng Trung cố định. Đánh giá phong thủy Kim/Thổ là định hướng thẩm mỹ theo yêu cầu, không phải cam kết về tài vận.

**Visual system có sẵn:** Ivory #F6F3EC, Graphite #223139, Champagne #B49B77, Platinum #C9CDCC, White #FFFFFF. Các tệp SVG/CSS hiện hữu là bản thiết kế nền, chưa mặc định là logo đã chốt đăng ký pháp lý.

**Brand quality gates:** thử logo tại 16/32/64px, giao diện sáng/tối, in đen trắng, font Trung-Việt-Anh, độ đọc trên mobile, similarity check đối thủ, kiểm tra nhãn hiệu và tên miền trước khi đăng ký/công bố như sở hữu riêng.

## 3. Những màn hình V1 cần có

1. **Home / Market Pulse:** bản đồ vùng nghiên cứu, số lượng dự án, dữ liệu đã/đang kiểm chứng; phân biệt rõ nhãn “tham khảo” và “xác minh”.
2. **QiMap Discovery:** lớp chung cư có vị trí nguồn gốc; filter quận/vùng, sơ cấp/thứ cấp/thuê, khoảng giá và trạng thái dự án; không gắn điểm nếu tọa độ chưa đủ chứng cứ.
3. **Project Profile:** danh tính dự án/phân kỳ, CĐT và pháp nhân, vị trí, timeline mở bán/bàn giao, pháp lý, giá từng thị trường, nguồn chứng cứ, đánh giá có lý do và khoảng trống dữ liệu.
4. **Historical Intelligence 2011–2026:** chỉ số nguồn cung/mở bán/hấp thụ/giá riêng theo từng dataset và địa giới; không trộn trung bình các định nghĩa khác nhau, không điền giá bằng nội suy nếu không ghi rõ.
5. **Compare:** so sánh tối đa 3–4 dự án trong cùng tiêu chí (đơn giá/m², tình trạng pháp lý, hạ tầng, thanh khoản, yield cho thuê khi có đủ chứng cứ, rủi ro).
6. **Methodology / Sources:** người dùng xem được xuất xứ, phạm vi sử dụng, thời điểm thu thập và cập nhật; tải bảng giải thích thuật ngữ.
7. **International Buyer Guide:** tách “có vốn/đối tác nước ngoài” khỏi “dự án đủ điều kiện bán cho người nước ngoài” và khỏi “căn/suất còn khả dụng cho người nước ngoài”; nêu tình trạng kiểm chứng, không tư vấn pháp lý cuối cùng bằng một cờ yes/no.

## 4. Tiêu chuẩn minh bạch không thể thương lượng

- **Giá phải có price_type:** primary_list / resale_ask / resale_transacted_verified / rent_ask / rent_contracted_verified. Không hiển thị giá chào như giá giao dịch thực tế.
- **Mỗi observation có:** số đo, đơn vị, khoảng thời gian, ngày nguồn công bố, ngày hệ thống ghi nhận, URL/tài liệu nguồn, bên phát hành, vùng/địa giới, loại căn/mẫu và trạng thái duyệt.
- **Không gắn nhãn “cập nhật hằng ngày”** chỉ vì website chạy cron. Phân biệt: kiểm tra nguồn gần nhất, dữ liệu mới gần nhất, giá được xác minh gần nhất.
- **Sơ cấp / thứ cấp / cho thuê** là ba thị trường khác nhau, không đặt trên cùng một trục giá/m² không có nhãn.
- **Kiểm chứng SPA/suất người nước ngoài:** cần hồ sơ pháp lý có hiệu lực, điều kiện dự án, hạn mức áp dụng và tình trạng suất còn lại xác nhận ở thời điểm cụ thể. Chỉ đánh dấu “chưa xác minh” nếu bằng chứng chưa đầy đủ.
- **Đánh giá dự án độc lập:** hiển thị evidence + counterevidence + nguồn ngày; không chấm điểm chính xác giả nếu thiếu dữ liệu; conflict-of-interest disclosure.
- **Không dùng nội dung, hình ảnh, listing, quy hoạch GIS hoặc geocoding của bên thứ ba ngoài phạm vi giấy phép.**

## 5. Tình trạng ban đầu (căn cứ snapshot repository ngày 2026-10-09)

- QiMap đã có trang `review.html`, `map-v4.html`, `history.html` và danh mục thứ cấp.
- Chỉ mục danh mục có **150 bản ghi tên/phân kỳ** (không phải 150 dự án pháp lý độc lập); **32** có marker hiện hữu; **118** chỉ có hồ sơ tra cứu; **3** tọa độ được gắn cờ đã đối chiếu.
- **0 giá được xác minh độc lập** theo README. Tệp `data/price_history.json` hiện rỗng; `data/update_status.json` = `not_configured`.
- Trang và biểu đồ lịch sử có các quan sát rời rạc; **chưa** có coverage 2011–2026 liên tục hoặc chuỗi chuẩn so sánh cho toàn thị trường.
- Đây là trạng thái review, **chưa được mô tả là nền tảng thống kê giao dịch thực đầy đủ**.

## 6. Thứ tự triển khai ưu tiên (không phình phạm vi)

### P0 — Bắt buộc trước public launch có tuyên bố đáng tin cậy
1. **Identity & source registry:** `project_id` bất biến, quan hệ dự án mẹ/phân kỳ, tên pháp lý, alias, địa giới; `source_id`, license/terms và hồ sơ kiểm tra nguồn.
2. **Market taxonomy:** tách nguồn sơ cấp/thứ cấp/thuê; asking vs transacted; loại tài sản, đơn vị, ngày; duyệt trước khi xuất bản.
3. **Historical coverage matrix 2011–2026:** báo cáo dữ liệu có/không theo năm–quý, nguồn, địa giới, metric; thể hiện gaps ngay trên UI.
4. **Trust labels:** verified / source-attributed / provisional / unavailable với tiêu chí rõ, khả năng click đến hồ sơ nguồn.
5. **Legal foreign buyer classification:** không đồng nhất FDI, chủ thể phát triển có yếu tố nước ngoài, eligibility dự án, quota và suất bán thực tế.
6. **QA và bảo mật:** public read-only, không có API keys, private leads/CRM tách khỏi repo công khai, visual testing desktop/mobile.

### P1 — Trải nghiệm người dùng tạo giá trị
1. Bộ hồ sơ dự án mẫu chuẩn với đầy đủ citation và trường “chưa xác minh”.
2. Bộ so sánh các dự án trong cùng tầm giá/vị trí, có yếu tố ngập, giao thông, vận hành và chi phí sở hữu khi có chứng cứ.
3. Bản đồ layers metro/quy hoạch/ngập theo nguồn được phép và trạng thái hiệu lực; không vẽ tim tuyến hoặc polygon tự suy đoán.
4. Giá thuê, suất sinh lời và dòng tiền dưới dạng **kịch bản có đầu vào minh bạch**, tách dự báo khỏi dữ liệu thực.
5. Ba ngôn ngữ VI/EN/ZH-CN end-to-end, giao diện mobile.

### P2 — Khai thác kinh doanh khi bộ dữ liệu đã đủ
- Báo cáo thị trường theo khu vực; gói nghiên cứu chuyên sâu; tư vấn mua/thuê với công bố quan hệ thương mại.
- Đối tác cung cấp dữ liệu cấp phép; API read-only có version, rate limit, provenance.
- Không triển khai marketplace đại trà, cào dữ liệu đối thủ hoặc paid ranking giả nghiên cứu độc lập.

## 7. Các cổng nghiệm thu

| Gate | Điều kiện nhận |
|---|---|
| Brand | Tên/messaging thống nhất giữa trang chủ, map, hồ sơ, app icon; rà soát nhãn hiệu riêng |
| Dataset identity | Không còn trường hợp phân kỳ bị tính như dự án pháp lý độc lập mà không có nhãn |
| Market history | Có ma trận 2011–2026 rõ coverage và missingness; biểu đồ luôn ghi định nghĩa, nguồn, thời điểm |
| Project sample | Ít nhất 10 hồ sơ ưu tiên được rà soát thủ công, nêu rõ bằng chứng/thiếu hụt, **không buộc bịa giá** |
| Transparency | Mọi giá hiển thị có label chào/giao dịch, ngày, nguồn và trạng thái duyệt; không có claim “live” giả |
| Foreign buyer | Test cases: FDI nhưng chưa đủ điều kiện, đủ điều kiện dự án nhưng không còn quota, chưa có tài liệu |
| Mobile/accessibility | Không tràn layout; nút/filters hoạt động; tương phản/chuyển ngôn ngữ và link nguồn dùng được |
| Security | Không khóa/API key/lead cá nhân trong repo public |

## 8. Công việc ngay sau charter

1. Khóa chuẩn dữ liệu trong `docs/QILUVI_DATA_CONTRACT_V1.md`.
2. Viết migration ánh xạ `data/projects.json`, `data/project_search_index.json` và lịch sử hiện có vào schema mới — **không mutate dữ liệu gốc**.
3. Sinh validation report: dữ liệu thiếu, chứng cứ, tỷ lệ tọa độ/giá được xác minh, coverage theo năm và nguồn.
4. Thiết kế trang project detail theo nguồn–bằng chứng, dùng 3–5 dự án đầu tiên để kiểm thử trải nghiệm.
5. Sau khi nghiệm thu mới gắn thương hiệu QILUVI vào landing page chính và thông báo chiến dịch.

## 9. Quy tắc đo tiến độ
Không tính KPI bằng số dòng import hoặc “150 dự án”. Đo theo:
- số danh tính dự án/phân kỳ xác minh; số nguồn hợp lệ;
- tỷ lệ giá/thuê có phép sử dụng và trạng thái xác minh;
- tỷ lệ địa điểm có tọa độ đã đối chiếu;
- coverage nguồn chỉ số 2011–2026;
- số hồ sơ dùng được cho quyết định thật;
- số lỗi nghiêm trọng của nhãn pháp lý, nguồn và đơn vị đo bằng 0.

**Release policy:** Không được quảng cáo “minh bạch, chính xác, cập nhật hằng ngày” như một năng lực đã đạt khi chưa có evidence vận hành tương ứng.
