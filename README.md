## Danh mục căn hộ thứ cấp đã mở rộng

- [QiMap — Kho 126 tên dự án và phân kỳ chung cư cũ](https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/secondary-catalog.html). Dữ liệu đã đối chiếu trực tiếp với 32 dự án gắn ghim; mức khử trùng lặp chỉ dựa vào tên/bí danh.
- Giá thứ cấp/giá thuê từng căn hiện chưa xác minh và không được tự tạo; tọa độ từ kho nghiên cứu không tự động thêm vào bản đồ.

**Thương hiệu công khai:** QiMap là sản phẩm bản đồ và phân tích thuộc QILUVI. Các tệp kỹ thuật atlas-* và đường dẫn GitHub hiện tại được giữ để tương thích ngược, không phải tên sản phẩm hiển thị.

# QiMap by QILUVI — Nền tảng dữ liệu bất động sản

**Bắt đầu review tại:** https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/review.html

- [Bản đồ thực V4](https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/map-v4.html)
- [Lịch sử căn hộ 2006–2026](https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/history.html)
- [Checklist nghiệm thu V1](docs/V1_REVIEW_2026_10_09.md)
- [ATLAS Progress Desk](https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/23)

**Giới hạn hiện tại:** hồ sơ mẫu, giá chào chưa xác minh độc lập, quy hoạch GIS chính thức chưa kết nối, chưa có chuỗi thống kê trọn 20 năm. Nền móng đã có nhưng V1 không phải cổng giao dịch hay bảng giá được xác minh.

---

# ATLAS BĐS TP.HCM — Interactive Apartment Price Map (V3.2)

Bản đồ tương tác căn hộ khu vực TP.HCM mở rộng và vùng lân cận: **Tiếng Việt / English / 中文**. Hiển thị ô giá trực tiếp, hồ sơ dự án, so sánh, bộ lọc và lớp GIS quy hoạch tùy chọn.

## Mở bản đồ

Sau khi chủ repository bật **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**, trang công khai dự kiến là:

https://02zmarketingcontact-del.github.io/atlas-bds-tphcm/

> Link chỉ hoạt động sau khi GitHub Pages thực sự hoàn tất việc xuất bản. Kiểm tra phần Settings → Pages để lấy URL xác nhận.

## Cảnh báo dữ liệu

**Đây là bản beta nghiên cứu, KHÔNG phải bảng giá được xác minh.** Có 32 dự án mẫu; 3 tọa độ được đánh dấu đã đối chiếu ở dữ liệu gốc; **0 báo giá được xác minh độc lập**. Phần lớn vị trí còn lại là ước lượng. Các khoảng giá là giá chào tham khảo, không phải giá giao dịch. Ngày import dữ liệu không đồng nghĩa ngày cập nhật giá.

- `data/projects.json`: dữ liệu dự án public và trường `priceVerified`, `coordVerified`, `priceDateVerified`.
- `data/update_status.json`: trạng thái nguồn giá. Hiện là `not_configured`, **chưa có nguồn cập nhật giá tự động**.
- `data/price_history.json`: lịch sử giá đã duyệt (ban đầu rỗng).

Không xuất bản thông tin khách hàng, giỏ hàng nội bộ, API key, thông tin thanh toán hoặc dữ liệu giá không được phép công bố.

## Bản đồ nền & quy hoạch

Sử dụng OpenStreetMap và Esri imagery, cần Internet; **không cần Google Maps API key** ở chế độ mặc định. Google Maps API là tùy chọn và cần key riêng được giới hạn domain + billing. Lớp quy hoạch trực tiếp chỉ sử dụng GeoJSON/KML hoặc WMS có quyền; bản đồ mở không thay thế bản đồ quy hoạch pháp lý.

## Cập nhật dữ liệu

Các tệp `data/*.json` được website tải qua HTTPS. Chỉnh sửa dữ liệu trong repository rồi commit để tái triển khai. **Lịch chạy cập nhật tự động chưa kích hoạt và chưa có feed giá hợp lệ**, nên không được quảng bá là dữ liệu giá được đồng bộ hằng ngày. Mô-đun kiểm chứng, duyệt và lịch chạy sẽ được tích hợp riêng trước khi nhận nguồn CSV/JSON được cấp phép.

## Quyền truy cập

Repository Public cho phép xem mã nguồn; GitHub Pages cần được kích hoạt riêng. Không yêu cầu người xem đăng nhập khi website public đã được xuất bản.
