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
