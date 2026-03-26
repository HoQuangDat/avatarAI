# 📖 Hướng Dẫn Sử Dụng Nhanh AvatarAI.vn

Chào mừng bạn đến với **AvatarAI.vn** - nền tảng mạnh mẽ giúp tạo video tự động với khuôn mặt và giọng nói của chính bạn. Dưới đây là luồng làm việc 4 bước đơn giản để tạo ra video AI thành phẩm:

## 1. ⚙️ Thiết lập ban đầu (Dành cho Admin/Dev)
Đảm bảo bạn đã điền các khóa API vào file `.env.local`:
- **MongoDB**: Cơ sở dữ liệu lưu trạng thái.
- **Cloudinary**: Để lưu trữ ảnh Avatar và Video sau render.
- **ElevenLabs API**: Để dùng engine tạo Text-to-Speech (nhân bản giọng nói).
- **D-ID API**: Dùng cho engine tạo video Lipsync.
- **Gemini API**: Dùng cho tính năng tự động viết/khuyên dùng kịch bản (Script).

*Lưu ý: Bạn có thể đăng ký tài khoản miễn phí tại các dịch vụ trên.*

---

## 2. 👤 Tạo Avatar Của Riêng Bạn
- Tại Menu Trái, nhấn vào **Quản lý Avatar**.
- Nhấn **Tạo Avatar Mới**.
- **Bước Hình Ảnh**: Upload một bức ảnh chụp chân dung (nhìn rõ mặt, không bị che khuất, hướng nhìn chính diện).
- **Bước Thu Âm**: Nếu bạn muốn clone giọng của chính mình, bấm vào Tab 2 để dùng Mic thu ngay một đoạn Voice Sample ngắn (đọc đoạn text hiển thị trên web).
- Nhấn **Lưu Avatar**. Hệ thống sẽ tải dữ liệu lên Cloud và chạy nền tạo mẫu giọng nói qua ElevenLabs.

---

## 3. 🎬 Chế Bản Video
- Từ Menu, ấn vào **Tạo Video Mới**. Quy trình bao gồm 3 bước:
  1. **Chọn Avatar**: Click chọn avatar bạn vừa tạo.
  2. **Viết Script**: Bạn có thể tự gõ kịch bản mà bạn muốn Avatar tự nói, hoặc điền nhanh chủ đề (ví dụ: "Mẹo học Tiếng Anh") và bấm tính năng 🪄 **AI Viết Hộ** (dùng chip Gemini Google).
  3. **Tạo & Render**: Hệ thống sẽ ghép giọng nói đã nhân bản + kịch bản + khuôn mặt lại với nhau.

---

## 4. ⏳ Quản Lý & Tải Xuống
- Sau khi bấm Tạo, quá trình *Render* sẽ tự động chạy ngầm. Trạng thái sẽ update realtime trên màn hình thành **Hoàn thành** khi xong. Truy cập mục **Thư viện Video** để xem toàn bộ danh sách.
- Nhấn **Tải Xuống / Play** để xem video thành phẩm.

> **💡 Credit Mẹo:** Tài khoản *Demo* cung cấp sẵn cho bạn 99 credits để test. Mỗi video tạo ra sẽ tiêu tốn 1 credit.
