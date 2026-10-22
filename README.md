# xv6 Team Hub — Nền tảng Quản lý Đồ án Hệ điều hành HUST

Hệ thống quản lý tiến độ, kiến thức, phân công nhiệm vụ và ngân hàng câu hỏi bảo vệ đồ án môn Hệ điều hành tại **Đại học Bách khoa Hà Nội (HUST)**.

- **Đề tài:** Đề #27: TTY Layer & Job Control trên `xv6-riscv`.
- **Nhóm sinh viên:** 3 người (Mai Duy Hiếu - 20223967, Nguyễn Tuấn Anh - 20223988, Trần Đức Dũng - 20223912).
- **Giảng viên hướng dẫn:** TS. Phạm Văn Tiến (`tien.phamvan1@hust.edu.vn`).
- **Mã nguồn đồ án:** [github.com/kudohieu1209/hedieuhanh-hust](https://github.com/kudohieu1209/hedieuhanh-hust) (Nhánh: `tty-jobctl`).

---

## I. TÍNH NĂNG CHÍNH

1. **Dashboard Tổng quan**:
   - Thống kê tiến độ thực tế 7 tuần tính theo khối lượng nhiệm vụ & checklist.
   - Hiển thị ngày báo cáo tiếp theo có đếm ngược.
   - Nhiệm vụ cá nhân của thành viên đang đăng nhập.
   - Báo cáo PDF gần nhất, danh sách nội dung còn yếu và lỗi đang chờ xử lý.
   - Bảng tiến độ so sánh 3 thành viên.

2. **Lộ trình 7 Tuần (Roadmap) & Module Báo Cáo Tiến Độ (HUST Standard)**:
   - Dòng thời gian trực quan 7 tuần với ngày báo cáo tùy chỉnh.
   - Phân công nhiệm vụ cụ thể cho từng thành viên theo từng tuần.
   - Checklist nghiệm thu tương tác trực tiếp cập nhật tiến độ tuần.
   - Kịch bản demo terminal lệnh QEMU có nút sao chép 1 chạm.
   - **Weekly Progress Report Module**:
     - Bám sát 100% mẫu `Progress-Report-template.docx` của giảng viên hướng dẫn (TS. Phạm Văn Tiến).
     - Bộ đếm từ thời gian thực với cảnh báo tự động chuẩn 200–300 từ.
     - Nút tự động tạo bản nháp từ tiến độ tuần ("Tạo bản nháp từ tiến độ tuần").
     - Tách riêng mục đóng góp của 3 thành viên với phân quyền chỉnh sửa.
     - Mục TODO hỗ trợ chuyển nhanh việc tồn đọng sang tuần kế tiếp.
     - Xuất trực tiếp file Word (.docx) chuẩn format Times New Roman 12pt và Xem / In PDF.

3. **Quản lý 3 Thành viên**:
   - Hồ sơ chi tiết từng người: Avatar, tên, vai trò, bio, mã nguồn phụ trách.
   - Danh sách file code liên kết trực tiếp tới GitHub repository.
   - Tiến độ 12 chủ đề kiến thức theo 3 mức (Đã đọc / Đã hiểu / Sẵn sàng bảo vệ ★).
   - Danh sách câu hỏi vấn đáp trả lời chưa tốt để tập trung ôn tập.

4. **Bảng Quản lý Nhiệm vụ (Kanban Board)**:
   - 4 Cột: Cần làm, Đang thực hiện, Chờ kiểm tra, Hoàn thành.
   - Bộ lọc theo người phụ trách, tuần, độ ưu tiên và tìm kiếm từ khóa.
   - Modal chi tiết nhiệm vụ, checklist con, bằng chứng hoàn thành và bình luận nội bộ.
   - Chặn đánh dấu "Hoàn thành" khi chưa hoàn thành đủ tiêu chí nghiệm thu.

5. **Thư viện Kiến thức Chuyên sâu**:
   - 12 bài học chi tiết dựa trên `DESIGN.md` của đồ án:
     - *Process & Signal:* Trạng thái STOPPED, Cơ chế tín hiệu thu nhỏ, stopcheck() tránh Deadlock, waitpid() WUNTRACED/WNOHANG, Xử lý tiến trình mồ côi.
     - *TTY Layer:* Quầy lễ tân và điện thoại, 3 chế độ Cooked/Raw/No-Echo, SIGTTIN bảo vệ tiến trình nền, Terminal ảo thứ hai qua 1 UART (Ctrl-T).
     - *Shell & Job Control:* Kiến trúc Shell và khắc phục Race Condition fork, Đồng bộ Pipeline counter | cat, Line Editor và Lịch sử lệnh.
   - Sơ đồ ASCII, trích đoạn code và câu hỏi tự kiểm tra.

6. **Ngân hàng Câu hỏi Vấn đáp Bảo vệ**:
   - 25+ câu hỏi chọn lọc phân loại theo lý thuyết, đọc code, luồng xử lý, tình huống góc cạnh và phản biện.
   - Ẩn/hiện đáp án gợi ý và giải thích chi tiết cơ chế kernel.
   - Tự đánh giá mức độ tự tin từng câu theo cá nhân.
   - **Chế độ Thi thử Vấn đáp (Mock Defense)**: Ngẫu nhiên 5 hoặc 10 câu hỏi, tính điểm và xuất kết quả.

7. **Quản lý Tài liệu & Báo cáo PDF**:
   - Lưu trữ tập trung Báo cáo PDF, Slide, Sơ đồ và Kịch bản demo.
   - Trình xem PDF trực tiếp ngay trong trình duyệt (PDF Viewer iframe).

8. **Kiểm thử & Quản lý Lỗi**:
   - 12 Bài kiểm thử tự động đẩy phím từ máy host (`test-jobctl.py`).
   - Kiểm thử hồi quy toàn diện xv6 (`test-xv6.py usertests` ALL TESTS PASSED).
   - Trình theo dõi lỗi (Bug Tracker) với các bước tái hiện và giải pháp khắc phục.

9. **Nhật ký Báo cáo & Nhận xét Giảng viên**:
   - Biên bản họp từng tuần với TS. Phạm Văn Tiến.
   - Ghi nhận câu hỏi hóc búa của thầy và việc cần bổ sung (Action items).

10. **Cài đặt & Đồng bộ Supabase**:
    - Chế độ **Demo Mode** (chạy ngay không cần setup, lưu LocalStorage).
    - Chế độ **Team Mode** (kết nối Supabase PostgreSQL đồng bộ nhóm thời gian thực).
    - Kịch bản SQL Migrations (`schema.sql` và `seed.sql`) có nút copy.
    - Sao lưu toàn bộ dữ liệu ra JSON và phục hồi nhanh chóng.

---

## II. CÔNG NGHỆ SỬ DỤNG

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS + Dark Mode
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Database / Backend:** Supabase (PostgreSQL + RLS + Storage)
- **Fallback:** LocalStorage Provider cho Demo Mode

---

## III. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc pnpm

### 2. Khởi chạy môi trường phát triển (Dev)
```bash
# Di chuyển vào thư mục dự án
cd web

# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy server phát triển
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173`. Ứng dụng đã có sẵn toàn bộ dữ liệu mẫu chi tiết của đồ án Đề #27 và chạy hoàn toàn độc lập ở chế độ **Demo Mode**!

### 3. Kiểm tra TypeScript & Build Production
```bash
# Kiểm tra types và build
npm run build

# Xem trước bản build
npm run preview
```

---

## IV. HƯỚNG DẪN KẾT NỐI SUPABASE (TEAM MODE)

1. Đăng ký tài khoản miễn phí tại [supabase.com](https://supabase.com).
2. Tạo một Project mới (ví dụ: `xv6-team-hub`).
3. Mở mục **SQL Editor**, sao chép nội dung file `src/supabase/schema.sql` và nhấn **Run** để khởi tạo các bảng và chính sách RLS.
4. (Tùy chọn) Chạy tiếp file `src/supabase/seed.sql` để nạp dữ liệu ban đầu.
5. Lấy **Project URL** và **anon public key** tại mục *Project Settings -> API*.
6. Vào giao diện web mục **Cài đặt -> Kết nối Supabase**, dán URL và Anon Key rồi nhấn **Kiểm tra & Kích hoạt Team Mode**.
7. Hoặc tạo file `.env` từ `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## V. TRIỂN KHAI LÊN VERCEL HOẶC NETLIFY

Website được thiết kế tương thích hoàn hảo cho Vercel hoặc Netlify:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Single Page App Routing:** Thêm file `vercel.json` hoặc `_redirects` cho Netlify:
  ```
  /*    /index.html   200
  ```
