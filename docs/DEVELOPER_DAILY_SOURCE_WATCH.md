# ATLAS — Theo dõi website chủ đầu tư / nhà phát triển chính thức mỗi ngày

## Nguyên tắc ưu tiên
1. Website chính thức của **pháp nhân chủ đầu tư**, nếu giấy phép và tên miền đã đối chiếu.
2. Website chính thức của **thương hiệu phát triển dự án** và đường dẫn dự án được công ty liên kết công khai.
3. Hồ sơ công bố pháp lý, tiến độ, chính sách từ kênh doanh nghiệp.
4. Nguồn nghiên cứu thị trường và các trang rao để đối chiếu **giá chào tham khảo**, không thay thế tài liệu chủ đầu tư.
5. Website môi giới không chứng minh quyền đại diện: `official_site_discovery_pending`, không tự nâng thành chính thức.

ATLAS đã lập registry cho toàn bộ 32 mã dự án trong `data/developer_official_registry.json`. Có 28 dự án liên kết đến tên miền của đơn vị phát triển đã nhận diện và 4 dự án đang chờ xác minh. **Đây là xác minh tên miền thương hiệu phát triển, chưa phải xác minh pháp nhân sở hữu đất/đủ điều kiện mở bán.**

## Lịch hằng ngày
- GitHub Actions: `.github/workflows/atlas-developer-daily.yml`
- Mỗi ngày dự kiến **08:00 giờ Việt Nam** (`cron: 0 1 * * *` UTC); lịch GitHub Actions có thể chạy trễ, không đảm bảo đúng từng phút.
- Chạy thủ công: GitHub repository → **Actions → ATLAS daily official developer source review → Run workflow**.
- Không cần máy cá nhân bật liên tục.

## Trạng thái
- **baseline_created**: ghi fingerprint nguồn ngày đầu, chưa khẳng định có thay đổi.
- **unchanged**: dấu vết nội dung liên quan đến dự án không đổi.
- **source_changed**: có thay đổi về văn bản tham chiếu, cần mở trang nguồn xem và đối chiếu.
- **no_project_text_on_official_page**: trang doanh nghiệp có thể không nhắc đến dự án cụ thể; tìm trang dự án riêng.
- **blocked_by_publisher**/**skipped_robots**: không thu thập khi bị nhà xuất bản chặn/robots giới hạn.
- **http_error**/**fetch_error**: trang lỗi hoặc gặp lỗi mạng; không tự coi dự án ngừng bán.

## Quy trình dữ liệu
1. Chỉ truy cập các website doanh nghiệp trong allow-list, giới hạn 750 KB/trang, timeout, tối đa ba origin song song và giãn request mỗi domain.
2. Kiểm tra robots.txt trước khi đọc trang. Không vượt CAPTCHA, đăng nhập, rate limit hoặc crawl hàng loạt.
3. Trích fingerprint dấu vết nội dung dự án và nhóm chủ đề (quy mô, căn hộ, tiến độ, giá, pháp lý, vị trí); **không tự chép nguyên trang**.
4. Ghi `data/developer_source_monitor_state.json`: ngày kiểm tra, HTTP status, fingerprint, trạng thái; không bao gồm dữ liệu khách hàng.
   - Lưu các gợi ý số liệu chưa duyệt từ trang dự án của doanh nghiệp vào `data/developer_fact_candidates.json`. Mỗi mục có mã dự án, trường, giá trị thô, URL gốc, ngày rà soát và cờ `UNVERIFIED_REVIEW_REQUIRED`. **Không dùng file này làm dữ liệu đã xác minh trên website.**
5. Upload artifact `developer-daily-audit.json` và báo cáo Markdown của ngày, giữ 21 ngày.
6. Cập nhật [ATLAS Developer Source Watch](https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/44); bình luận và gửi mention nếu có thay đổi quan trọng.
7. Khi có thay đổi, **con người phải kiểm tra giá, quy mô, pháp lý, ngày bán, quỹ căn và quota sở hữu ngoại quốc** trước khi đưa vào hồ sơ công khai.

## Không có nghĩa
- Website nhà phát triển không tự động là **pháp nhân chủ đầu tư pháp lý**.
- Hash khác không chứng minh giá mới: nội dung site có thể đổi vì mẫu, quảng cáo, khuyến mãi.
- Từ khóa "giá từ" không phải bảng giá tất cả căn; thường chưa phản ánh VAT/ưu đãi, diện tích hoặc điều kiện thanh toán.
- Đã rà soát **nguồn hàng sơ cấp** không có nghĩa sẵn hàng sơ cấp; thứ cấp và thuê cần nguồn sản phẩm riêng.
- Báo cáo **trạng thái nguồn** hoàn toàn khác báo cáo **xác thực từng trường dữ liệu**. Tác vụ không tự ghi đè số liệu khi mâu thuẫn.

## Dashboard và cách vận hành
- Báo cáo: https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/44
- Theo dõi tiến độ tổng: https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/23
- Xem code: `scripts/monitor-developer-official.cjs` và `scripts/update-developer-watch-issue.cjs`

Nếu 7 dự án chưa có nguồn chính thức được xác minh, bổ sung vào registry qua Pull Request sau khi đối chiếu quyền sở hữu tên miền/đường dẫn công bố từ doanh nghiệp.
