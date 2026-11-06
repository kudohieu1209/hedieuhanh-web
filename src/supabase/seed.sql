-- =========================================================================
-- xv6 Team Hub — Seed Data
-- =========================================================================

INSERT INTO members (id, name, student_id, email, role, bio, focus_areas, assigned_files, github_username)
VALUES 
(
  'member-1', 
  'Mai Duy Hiếu', 
  '20223967', 
  'hieu.md223967@sis.hust.edu.vn', 
  'TTY Layer & Device Driver (Trưởng nhóm)', 
  'Chịu trách nhiệm toàn bộ lớp thiết bị đầu cuối TTY: Driver bàn phím/UART, 3 chế độ terminal qua ioctl, quản lý Foreground Process Group và Terminal ảo thứ hai.',
  ARRAY['Kiến trúc Terminal, UART và TTY abstraction', 'Ngữ cảnh ngắt bàn phím trong consoleintr()', '3 Chế độ Cooked, No-Echo, Raw', 'Syscall ioctl với TCSETS/TCGETS', 'Điều khiển Foreground Group', 'Bảo vệ đọc terminal ngầm SIGTTIN', 'Terminal ảo thứ hai Ctrl-T'],
  ARRAY['kernel/console.c', 'kernel/termios.h', 'kernel/file.c', 'kernel/file.h', 'kernel/sysfile.c', 'user/init.c'],
  'kudohieu1209'
),
(
  'member-2', 
  'Nguyễn Huy Hoàng', 
  '20227610', 
  '', 
  'Kernel & Signal (Process Management)', 
  'Chịu trách nhiệm kiến trúc lõi Kernel: Vòng đời tiến trình, bảng trạng thái STOPPED, cơ chế tín hiệu thu nhỏ, đồng bộ khóa tránh deadlock và điều phối waitpid.',
  ARRAY['Cấu trúc struct proc & bảng tiến trình', 'Cơ chế tín hiệu thu nhỏ', 'Điểm dừng an toàn stopcheck()', 'Syscall waitpid() với WUNTRACED', 'Đồng bộ tránh Deadlock', 'Xử lý tiến trình mồ côi bị dừng'],
  ARRAY['kernel/proc.c', 'kernel/proc.h', 'kernel/trap.c', 'kernel/sysproc.c', 'kernel/signal.h', 'kernel/wait.h'],
  NULL
),
(
  'member-3', 
  'Vũ Tuấn Anh', 
  '20223864', 
  '', 
  'Shell, Job Control & Testing (User Space & Integration)', 
  'Chịu trách nhiệm xây dựng Shell có Job Control hoàn chỉnh theo chuẩn POSIX/GNU, Line Editor với phím mũi tên & lịch sử lệnh, và toàn bộ hệ thống kiểm thử tự động.',
  ARRAY['Cấu trúc Job Control trong Shell (user/sh.c)', 'Các lệnh nội tuyến jobs, fg, bg, kill', 'Khắc phục race condition sau fork', 'Quản lý Pipeline thành 1 job', 'Line Editor và Command History', 'Bộ test tự động Python pexpect', 'Kiểm thử hồi quy usertests'],
  ARRAY['user/sh.c', 'user/ulib.c', 'user/printf.c', 'user/kill.c', 'user/counter.c', 'user/spin.c', 'user/ttydemo.c', 'test-jobctl.py', 'test-xv6.py'],
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  student_id = EXCLUDED.student_id,
  email = EXCLUDED.email,
  github_username = EXCLUDED.github_username;

INSERT INTO settings (id, mode, current_member_id, theme, current_week, next_report_date, github_repo_url)
VALUES (1, 'team', 'member-1', 'dark', 3, '2026-11-08', 'https://github.com/kudohieu1209/hedieuhanh-hust')
ON CONFLICT (id) DO NOTHING;
