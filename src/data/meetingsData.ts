import { MeetingNote } from '../types';

export const INITIAL_MEETINGS: MeetingNote[] = [
  {
    id: 'meet-1',
    weekNumber: 1,
    date: '2026-09-22',
    presenter: 'Mai Duy Hiếu',
    attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Nguyễn Huy Hoàng', 'TS. Phạm Văn Tiến (GVHD)'],
    reportedContent: 'Trình bày kết quả khảo sát cây mã nguồn xv6-riscv commit 06aad25; đề xuất phân chia 3 tầng: Process/Signal - TTY Layer - Shell.',
    lecturerQuestions: [
      'Tại sao xv6 gốc chưa thể hỗ trợ lệnh `fg` và `bg`?',
      'Nhóm dự định test các phím ngắt Ctrl-C/Ctrl-Z tự động như thế nào?'
    ],
    lecturerFeedback: 'Ý tưởng chia 3 tầng rõ ràng. Cần chuẩn bị script test tự động bằng Python từ máy host đẩy phím vào QEMU, không được chỉ demo bằng tay.',
    actionItems: [
      { id: 'act-1-1', text: 'Viết tài liệu thiết kế DESIGN.md chi tiết cấu trúc dữ liệu', assigneeId: 'member-1', deadline: '2026-09-28', status: 'done' },
      { id: 'act-1-2', text: 'Thiết kế cấu trúc ioctl và các hằng số termios', assigneeId: 'member-2', deadline: '2026-09-28', status: 'done' }
    ],
    status: 'completed'
  },
  {
    id: 'meet-2',
    weekNumber: 2,
    date: '2026-09-29',
    presenter: 'Nguyễn Tuấn Anh',
    attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Nguyễn Huy Hoàng', 'TS. Phạm Văn Tiến (GVHD)'],
    reportedContent: 'Trình bày bản thiết kế struct proc mở rộng, struct tty và cơ chế ioctl qua devsw. Chạy demo bước đầu ttydemo noecho.',
    lecturerQuestions: [
      'ioctl đi qua bảng devsw như thế nào so với read/write?',
      'Tại sao struct termios cần giữ kích thước nhỏ gọn?'
    ],
    lecturerFeedback: 'Thiết kế ioctl chuẩn POSIX. Tuần tới tập trung hoàn thành cơ chế tín hiệu và bắt phím ngắt.',
    actionItems: [
      { id: 'act-2-1', text: 'Triển khai sigdeliver và stopcheck tránh deadlock', assigneeId: 'member-1', deadline: '2026-10-05', status: 'done' },
      { id: 'act-2-2', text: 'Xử lý ký tự ngắt 0x03 và 0x1a trong consoleintr', assigneeId: 'member-2', deadline: '2026-10-05', status: 'done' }
    ],
    status: 'completed'
  },
  {
    id: 'meet-3',
    weekNumber: 3,
    date: '2026-10-06',
    presenter: 'Mai Duy Hiếu',
    attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Nguyễn Huy Hoàng', 'TS. Phạm Văn Tiến (GVHD)'],
    reportedContent: 'Báo cáo cơ chế tín hiệu thu nhỏ: sigdeliver() đánh dấu cờ và stopcheck() tại các điểm an toàn. Demo dừng spin.c bằng ngắt timer.',
    lecturerQuestions: [
      'Vì sao không cho tiến trình dừng ngay trong sleep()?',
      'Thứ tự lấy khóa giữa wait_lock và p->lock trong stopcheck() là gì?'
    ],
    lecturerFeedback: 'Cách giải thích thứ tự lấy khóa rất thuyết phục. Nhóm đã chứng minh được không có nguy cơ deadlock.',
    actionItems: [
      { id: 'act-3-1', text: 'Mở rộng syscall waitpid() hỗ trợ WUNTRACED và WNOHANG', assigneeId: 'member-1', deadline: '2026-10-12', status: 'done' },
      { id: 'act-3-2', text: 'Hoàn thiện các lệnh jobs, fg, bg trong user/sh.c', assigneeId: 'member-3', deadline: '2026-10-12', status: 'done' }
    ],
    status: 'completed'
  },
  {
    id: 'meet-4',
    weekNumber: 4,
    date: '2026-10-13',
    presenter: 'Nguyễn Huy Hoàng',
    attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Nguyễn Huy Hoàng', 'TS. Phạm Văn Tiến (GVHD)'],
    reportedContent: 'Demo trực tiếp chuỗi thao tác hoàn chỉnh: counter -> Ctrl-Z -> jobs -> bg -> fg -> Ctrl-C. Trình bày cơ chế SIGTTIN bảo vệ tiến trình nền.',
    lecturerQuestions: [
      'Tại sao sau fork() cả cha lẫn con cùng phải gọi setpgid và tcsetpgrp?',
      'Khi một job nền cố tình đọc bàn phím thì chuyện gì xảy ra?'
    ],
    lecturerFeedback: 'Rất ấn tượng! Nhóm đã hoàn thành 100% yêu cầu cốt lõi của đề tài trước thời hạn. Khuyến khích hoàn thiện các stretch goal để lấy điểm 10.',
    actionItems: [
      { id: 'act-4-1', text: 'Kiểm tra tình huống biên: cả pipeline counter | cat có dừng đồng thời không?', assigneeId: 'member-3', deadline: '2026-10-19', status: 'done' },
      { id: 'act-4-2', text: 'Xử lý tiến trình mồ côi bị dừng khi Shell exit', assigneeId: 'member-1', deadline: '2026-10-19', status: 'done' },
      { id: 'act-4-3', text: 'Bắt đầu làm Line editor và Terminal ảo thứ hai', assigneeId: 'member-2', deadline: '2026-10-25', status: 'in_progress' }
    ],
    status: 'completed'
  },
  {
    id: 'meet-5',
    weekNumber: 5,
    date: '2026-10-20',
    presenter: 'Mai Duy Hiếu',
    attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Nguyễn Huy Hoàng', 'TS. Phạm Văn Tiến (GVHD)'],
    reportedContent: 'Báo cáo giải quyết Pipeline thành 1 job duy nhất, xử lý tiến trình mồ côi bằng SIGHUP + SIGCONT trong reparent(), và tiến độ triển khai Line Editor.',
    lecturerQuestions: [
      'Tại sao phải gửi cả SIGHUP lẫn SIGCONT khi dọn dẹp tiến trình con mồ côi bị dừng?',
      'Line editor bắt phím mũi tên dựa trên mã byte nào?'
    ],
    lecturerFeedback: 'Chuẩn bị tuần tới báo cáo hoàn thiện bộ test tự động 12 test case và demo terminal ảo.',
    actionItems: [
      { id: 'act-5-1', text: 'Hoàn thiện 12/12 bài test tự động test-jobctl.py', assigneeId: 'member-3', deadline: '2026-10-26', status: 'in_progress' },
      { id: 'act-5-2', text: 'Hoàn thiện bộ đệm obuf cho terminal ảo tty1', assigneeId: 'member-2', deadline: '2026-10-26', status: 'in_progress' }
    ],
    status: 'completed'
  }
];
