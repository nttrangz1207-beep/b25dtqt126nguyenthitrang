# SAGE AI ENTERPRISE // HỆ THỐNG PHÂN TÍCH DỮ LIỆU & DỰ BÁO KINH DOANH

Ứng dụng AI Agent phân tích dữ liệu và dự báo kinh doanh thông minh với giao diện hoàn toàn mới được thiết kế chính xác theo bảng phối màu **Color Palette từ Coolors.co**:
- `#5D7B6F` (Deep Sage Green - Xanh rêu trầm quý phái)
- `#A4C3A2` (Muted Willow Green - Xanh liễu dịu mắt)
- `#B0D4B8` (Soft Celadon Mint - Xanh ngọc celadon trang nhã)
- `#EAE7D6` (Warm Linen/Cream - Trắng kem ấm áp)
- `#D7F9FA` (Soft Pale Aqua / Ice Mist - Xanh băng thanh khiết)
- Kết hợp với thẻ kính mờ trong suốt (**Frosted Glassmorphism** `rgba(255, 255, 255, 0.82)`), viền tinh tế và phông chữ chuẩn `Plus Jakarta Sans` dễ đọc, sắc nét và chuyên nghiệp.

---

## 🌟 CÁC CẢI TIẾN TRỌNG TÂM THEO ĐÚNG YÊU CẦU CỦA BẠN

### 1. Bảng Màu Chuẩn Xác Theo Ảnh Chụp Coolors
- **Từ bỏ hoàn toàn màu hồng trước đây**, thay thế bằng bảng màu 5 tông tự nhiên từ ảnh chụp Coolors của bạn:
  - Màu chủ đạo nút bấm, điểm nhấn: `#5D7B6F`
  - Màu nền dải chuyển màu: Từ `#EAE7D6` qua `#D7F9FA` sang `#B0D4B8`
  - Màu viền và thanh điều hướng: `#A4C3A2` và `#B0D4B8`
  - Thẻ làm việc trong veo (Frosted Glass), chống mỏi mắt và tăng tối đa độ tập trung vào dữ liệu.

### 2. Kiến Trúc Điều Hướng Phân Tách Rõ Ràng (Strict Multi-Page Workflow)
- **Trang 1 // Màn Hình Bắt Đầu (Page Welcome):**
  - Giao diện tinh gọn, tập trung duy nhất vào việc bắt đầu quy trình.
  - Hiển thị thông tin Chủ sở hữu AI và ô nhập/chỉnh sửa Gmail cá nhân của bạn để tiếp nhận báo cáo.
  - Khu vực kéo thả tệp linh hoạt hỗ trợ mọi tệp CSV hoặc Excel (`.xlsx`, `.xls`).
  - Hai nút bấm tiện lợi nạp nhanh dữ liệu mẫu 1-click.
- **Trang 2 // Tổng Thể Các Bước (Overview Roadmap & Báo Cáo Lỗi Ban Đầu):**
  - Bản đồ lộ trình trực quan tổng thể 7 bước làm sạch và phân tích.
  - Bảng thống kê chi tiết các lỗi phát hiện ngay khi nạp tệp:
    - Tổng số dòng dữ liệu.
    - Số lượng ô bị khuyết thiếu (Missing/Null).
    - Số lượng dòng bị trùng lặp 100% (Duplicate rows).
    - Số lượng điểm ngoại lai bất thường (Outliers IQR).
  - Nút bấm điều hướng dẫn dắt người dùng bắt đầu xử lý Bước 1.
- **Trang 3.. // Từng Bước Riêng Biệt (Step-by-Step Dedicated Screens 1 đến 7):**
  - Tách bạch từng bước thành các không gian làm việc chuyên biệt.
  - **Mỗi bước đều làm rõ 3 nội dung:**
    1. *Mục đích bước này là gì?* (Giải thích dễ hiểu, không hàn lâm rườm rà).
    2. *Dữ liệu đang sai những lỗi gì?* (Hiển thị danh sách lỗi cụ thể: Dòng số mấy, Cột nào, Giá trị sai là gì).
    3. *Phương án xử lý cụ thể?* (Áp dụng thuật toán gì: Median, Mode, IQR Winsorize, ISO 8601).
  - **Cơ Chế Khóa Nghiêm Ngặt (Strict Gatekeeping):**
    - Người dùng **tuyệt đối không thể nhảy cóc** sang bước tiếp theo.
    - Nút *"Xác Nhận & Sang Bước Tiếp Theo"* bị khóa mờ (`disabled`) cho đến khi người dùng bấm nút *"Chạy thuật toán kiểm tra"* và hệ thống xử lý hoàn tất 100%.

### 3. Trạm Kiểm Định Con Người (HITL Gatekeeper) Tại Bước 6
- Bảng đối soát toàn diện trước và sau làm sạch.
- Hiển thị chữ ký điện tử SHA-256 xác thực và thông tin Gmail tiếp nhận của bạn.
- Hai nút lựa chọn dứt khoát: **Phê duyệt** (để mở khóa Báo cáo & Dự báo) hoặc **Từ chối** (để quay lại cấu hình lại).

### 4. Báo Cáo Chiến Lược & Dự Báo Kinh Doanh Tại Bước 7
- **KPIs cốt lõi:** Doanh thu tổng, Giá trị đơn bình quân, Tổng đơn hàng, Hệ số biến thiên (CV%).
- **4 Biểu đồ tương tác thời gian thực** (sử dụng bảng màu `#5D7B6F`):
  1. Biểu đồ đường Doanh thu theo chuỗi thời gian.
  2. Biểu đồ thanh Ngành hàng dẫn đầu.
  3. Biểu đồ tròn Thị phần theo Khu vực địa lý.
  4. Biểu đồ phân cực Phân khúc khách hàng.
- **Mô hình Dự báo chu kỳ tới (Holt-Winters / Exponential Smoothing):**
  - Tùy chọn chu kỳ dự báo (7 ngày, 14 ngày, 30 ngày, 60 ngày, 90 ngày).
  - Thanh trượt kịch bản kinh doanh What-If (-30% đến +30%).
  - Dải biên độ tin cậy $95\%$ (Upper & Lower Confidence Interval).
- **Xuất bản dữ liệu:** Tải tệp CSV sạch đã chuẩn hóa, tải báo cáo HTML độc lập, hoặc In/Lưu PDF.

### 5. Khung Chat Hỏi AI Trực Tiếp Đặt Ngay Phía Dưới
- Nằm cố định ngay bên dưới mọi màn hình làm việc, giúp bạn hỏi đáp tức thì nếu thấy số liệu lạ hoặc chưa hiểu phương pháp xử lý.
- 4 nút hỏi nhanh thông minh:
  - 🔍 *Tập dữ liệu của tôi có bao nhiêu lỗi cần sửa?*
  - ⚠️ *Tại sao lại có ngoại lai bất thường ở Bước 4?*
  - 🧹 *Giải thích phương pháp điền ô khuyết thiếu ở Bước 2?*
  - 📈 *Dự báo kinh doanh chu kỳ tới có khả quan không?*
- Khung chat phản hồi dựa trên dữ liệu thực tế đang chạy trong bộ nhớ.

---

## 🚀 HƯỚNG DẪN CHẠY VÀ TRIỂN KHAI LÊN VERCEL

### Cách 1: Triển khai trực tiếp lên Vercel (1-Click Deploy)
Hệ thống đã được bổ sung tệp cấu hình `vercel.json` chuẩn Static Site và cơ chế nạp thư viện Dual-CDN (tự động nạp từ CDN đám mây siêu tốc và dự phòng tệp nội bộ):
1. Bạn có thể kéo thả toàn bộ thư mục dự án lên [Vercel](https://vercel.com) hoặc kết nối qua GitHub.
2. Vercel sẽ tự động nhận diện `vercel.json` và triển khai trang tĩnh hoàn chỉnh ngay lập tức.
3. Không lo bị thiếu tệp `libs/`, không bị lỗi Node serverless function, giao diện hiển thị 100% chuẩn xác y hệt bản chạy tại localhost.

### Cách 2: Chạy cục bộ trên máy tính (Localhost)
- Mở terminal và chạy: `./start.sh` hoặc `node server.js`
- Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)
