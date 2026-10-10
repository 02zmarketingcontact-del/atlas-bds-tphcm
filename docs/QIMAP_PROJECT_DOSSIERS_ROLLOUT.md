# QiMap | Hồ sơ dự án chuẩn, P0 rollout

**Ngày khởi tạo:** 2026-10-10. **Phiên bản:** Project Profile V1, PR #73.

## Mục tiêu

Mỗi tên dự án/ghim/hồ sơ thị trường thứ cấp mở ngay trong QiMap thành hồ sơ 7 mục: (1) tổng quan; (2) vị trí & kết nối; (3) tiện ích; (4) giá & lịch sử; (5) pháp lý/SPA; (6) tiến độ; (7) nguồn. Cùng bộ dữ liệu làm đầu vào xuất PowerPoint và in/PDF. Không đòi người dùng tải slide để đọc.

## Quy tắc kiểm chứng

1. `verified_official`: chỉ khi có liên kết tài liệu có thẩm quyền thực sự, kiểm tra đối chiếu, ngày kiểm tra, phạm vi áp dụng. Nếu nguồn chỉ do CĐT tự công bố và chưa kiểm chứng độc lập thì vẫn ghi rõ `Theo CĐT · chưa xác minh độc lập`.
2. `needs_developer_confirmation`: tài liệu mẫu, tin rao, giới thiệu F1, hình marketing hoặc nguồn thứ ba chưa được xác thực. Trên web ghi `Cần đối chiếu CĐT`; không diễn đạt thành tuyên bố đã xác minh.
3. Thiếu dữ liệu: ghi `Chưa có thông tin được kiểm chứng`; cấm tự nội suy ngày bàn giao, tiến độ tuyến metro, số tầng/sản phẩm và giá giao dịch.
4. Quota/SPА của người nước ngoài phải có cơ sở pháp lý dự án cụ thể, không đánh đồng với CĐT có vốn nước ngoài.
5. Mọi tuyên bố giá cần phân loại `giá chào` hay `giao dịch`, ngày quan sát, VAT/2% bảo trì, hạng căn, mặt bằng, chính sách bán và nguồn cấp phép.
6. Ảnh chỉ được đưa lên khi có quyền sử dụng hoặc thuộc tài sản có giấy phép phù hợp; ghi mô tả, nguồn, thời điểm, giấy phép.
7. Nếu nhiều nguồn mâu thuẫn, gắn `conflicts` và để `needs_developer_confirmation` cho đến khi đối chiếu xong.

## Trật tự nguồn ưu tiên

- Nhóm 1: hồ sơ pháp lý do cơ quan nhà nước phát hành, công bố quy hoạch và văn bản đủ điều kiện bán.
- Nhóm 2: website/fanpage/brochure CĐT chính thức. Lưu bản chụp ngày kiểm tra, chỉ báo là "theo CĐT" cho đến khi rà soát.
- Nhóm 3: đại lý được ủy quyền, phân phối F1, đơn vị vận hành tòa nhà, báo cáo tài chính và báo cáo nghiên cứu có nguồn.
- Nhóm 4: sàn đăng tin và nguồn cộng đồng có quyền truy cập hợp lệ: phục vụ quan sát giá chào, không tự coi là giá giao dịch. Không tham gia nhóm kín bằng công cụ tự động hoặc dùng dữ liệu cá nhân thiếu cho phép.

## Mẫu bản ghi

- `data/project_dossiers_v1.json`: kho nguồn nền của 150 tên dự án/phân kỳ.
- `data/qimap_profile_overrides_v1.json`: thông số bổ sung, nhãn kiểm chứng và xung đột có thể hiện thực.
- Trường mỗi fact: `key`, `group`, `label`, `value`, `status`, `source_tier`, `source_label`, `source_url` (nếu công khai), `checked_at`, `note`.
- Không thay đổi hệ thống id hiện tại; `map-<id>` dành cho dữ liệu bản đồ; hồ sơ lịch sử dùng id trong chỉ mục.
- Thông số theo CĐT chưa đồng nghĩa phê duyệt pháp lý hoặc xác nhận dự án.

## Giai đoạn triển khai

| Lô | Phạm vi | Đầu ra | Tiêu chí nghiệm thu |
| --- | --- | --- | --- |
| A (P0) | 32 dự án có bản ghi bản đồ, Norton Park đầu tiên | 7 tab mặc định, template PowerPoint, nhãn dữ liệu | Mở từ ghim; nguồn rõ; không thiếu nhãn; mobile dùng được |
| B (P0) | 118 hồ sơ có trong danh mục hợp nhất nhưng chưa có ghim nền | Hồ sơ có thể mở từ tìm kiếm | Thiếu tọa độ không chặn mở hồ sơ; nguồn lịch sử giữ nguyên |
| C (P1) | Nhóm ứng viên bổ sung và phân kỳ | Đối chiếu trùng lặp, cha/con, GPS | Không đếm trùng pháp lý hoặc cộng số căn 2 lần |
| D (liên tục) | Bổ sung dữ kiện từ nguồn mới cho toàn bộ kho | Ảnh được cấp phép, pháp lý, giá sơ cấp/thứ cấp/thuê, lịch sử từ 2006 | Không đưa nguồn thiếu kiểm chứng thành sự thật; có log ngày thay đổi |

Các mốc thời gian theo lô chỉ là mục tiêu triển khai, không được coi là đã hoàn thành. CI kiểm tra tính hợp lệ dữ liệu; dữ kiện chưa xác minh vẫn phải hiển thị rõ.

## Chính sách kiểm soát bản phát hành

- `node scripts/validate-qimap-project-profile.cjs`, `node --check assets/qimap-project-profile.js`.
- Kiểm thử giao diện bằng Playwright tại PR preview (Norton Park, hồ sơ khác, desktop/mobile và 7 tab).
- Mỗi lần thay đổi dữ liệu phải có người/nguồn chịu trách nhiệm và ngày kiểm tra; không xóa vết nguồn gốc.
- Bản PowerPoint xuất chỉ chứa thông tin hiện có trong hồ sơ cùng cảnh báo và trang nguồn; không lấy dữ liệu thiếu để chế biểu đồ.

## Norton Park — lô mẫu

Trích 27 mục từ **Infographic Norton Park.pdf (2 trang, tài liệu người dùng cung cấp)** vào `data/qimap_profile_overrides_v1.json`; **tất cả** ở trạng thái `needs_developer_confirmation`. Nhóm thông tin xung đột: tổng quy mô; giá 55–65 vs giá nhập QiMap 66 trước VAT; ga C8 "0 km"; bàn giao 2027–2028. CĐT cần xác nhận bằng tài liệu cập nhật trước khi nâng hạng nguồn.
