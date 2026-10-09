# Bật GitHub Pages

1. Mở **Settings → Pages** trong repository này.
2. Phần **Build and deployment**, chọn **Source: Deploy from a branch**.
3. Chọn **Branch: main** và **Folder: /(root)** rồi nhấn **Save**.
4. Đợi GitHub tạo trang (một vài phút), sau đó dùng URL được xác nhận trong **Settings → Pages**.
5. Mở URL trong Chrome, chọn **VI / EN / 中文**, thử **Đường phố / Vệ tinh**, lọc giá, bấm dự án và tab **Dữ liệu**.
6. Nếu không thấy nền bản đồ, kiểm tra trình duyệt có truy cập được `tile.openstreetmap.org` hoặc `server.arcgisonline.com`; ứng dụng có nút chuyển nền.

Tự động kiểm tra giá hằng ngày **chưa hoạt động** cho tới khi có workflow, nguồn có quyền sử dụng và kết quả kiểm thử trên môi trường production. Không thêm key riêng tư vào repository public.
