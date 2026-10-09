# QiMap · QILUVI — website identity migration

## Quyết định thương hiệu

- **QILUVI**: thương hiệu mẹ, sứ mệnh dữ liệu, tư vấn và kết nối.
- **QiMap**: tên sản phẩm trực quan hóa bản đồ và dữ liệu thị trường bất động sản.
- Không hiển thị **ATLAS** như tên thương hiệu công khai nữa.
- Các tên cũ như `atlas-v4.js`, `atlas-bds-tphcm` và các URL GitHub Pages tạm thời **được giữ nguyên** để không phá liên kết và các workflow. Đổi repo và domain là giai đoạn triển khai domain riêng với redirect và kiểm thử API.
- `QiMap` là đề xuất thương hiệu sản phẩm, **chưa phải kết luận tra cứu nhãn hiệu**.

## Brand assets

SVG `assets/qiluvi-logo-primary.svg` và `assets/qiluvi-logo-reversed.svg` được dựng lại dựa trên hình logo raster **có trong QILUVI Brand Guidelines Concept v1.0**, không phải file master logo độc lập của nhà thiết kế. Cần thay bằng master vector nguyên gốc nếu được cung cấp để bảo đảm độ chính xác tuyệt đối.

- Icon: `assets/qiluvi-icon.svg`
- Nền hình học định hướng: `assets/qiluvi-connection-network.svg`
- Theme xuyên trang: `assets/qimap-brand.css`
- Brand Colors: Ivory `#F6F3EC`, Graphite `#223139`, Champagne `#B49B77`, Platinum `#C9CDCC`, White `#FFFFFF`.
- Tỷ lệ thị giác tham khảo: 60% light, 30% dark, 10% muted mineral gold.
- Fonts: Inter Display (heading/branding), Inter (interface) và Noto Sans (Tiếng Việt); browser sử dụng fallback hệ thống khi font chưa tải.
- Không dùng gradient, glow hoặc hiệu ứng kim loại trong logo.
- Không đưa hình mạng kết nối lan tỏa vô nghĩa lên mọi phần: chỉ dùng một mô-típ ít chi tiết ở hero và phần giới thiệu.

## Đã áp dụng

- `index.html`: định tuyến khách vào homepage QiMap mới (`review.html`); `?p=` / tọa độ chuyển đến `map-v4.html`; `?legacy=1` chuyển sang bản V3.2.\n- `legacy.html`: sao lưu toàn bộ ứng dụng V3.2 với các asset, ID và luồng cũ, không loại bỏ chức năng.
- `review.html`: homepage QiMap by QILUVI.
- `map-v4.html`: full-screen map và hồ sơ dự án QiMap.
- `history.html`: dữ liệu thị trường 2006–2026.
- Favicons và CSS token cùng nguồn thiết kế, cùng logo.
- QILUVI/QiMap không yêu cầu sửa tên data IDs, JS schema hoặc đường dẫn repo.

## Tiếp theo cần làm

1. Thay bản SVG khôi phục từ PDF bằng master SVG/AI/EPS đã duyệt của nhà thiết kế nếu có.
2. Kết hợp kho chung cư thứ cấp và dự án lâu năm (126 entries nghiên cứu) sau khi dedupe dự án/phase với 32 dự án đang có.
3. Chọn domain chính thức, kiểm tra nhãn hiệu và redirect link cũ nếu đổi repo.
4. Đồng bộ các trang mới trong tương lai theo theme QiMap trước khi triển khai.
