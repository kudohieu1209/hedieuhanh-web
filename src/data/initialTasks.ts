import { Task } from '../types';

export const INITIAL_TASKS: Task[] = [
  // --- DONE TASKS ---
  {
    id: 'task-1',
    title: 'Mở rộng struct proc & Thêm trạng thái STOPPED',
    description: 'Thêm enum STOPPED vào enum procstate, thêm các trường pgid, pendstop, stopsig, sigignore vào struct proc trong kernel/proc.h.',
    assigneeId: 'member-1',
    weekNumber: 2,
    priority: 'urgent',
    status: 'done',
    deadline: '2026-09-28',
    checklist: [
      { id: 't1-1', text: 'Khai báo enum procstate { UNUSED, USED, SLEEPING, RUNNABLE, RUNNING, ZOMBIE, STOPPED }', completed: true },
      { id: 't1-2', text: 'Thêm pgid, pendstop, stopsig, sigignore vào struct proc', completed: true },
      { id: 't1-3', text: 'Cập nhật fork() để con kế thừa pgid và sigignore', completed: true },
      { id: 't1-4', text: 'Cập nhật exec() để giữ nguyên pgid và sigignore', completed: true }
    ],
    codeFiles: ['kernel/proc.h', 'kernel/proc.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/06aad25',
    proofOfCompletion: 'Kernel biên dịch sạch 0 cảnh báo. usertests chạy pass bình thường.',
    comments: [
      {
        id: 'c1',
        memberId: 'member-1',
        authorName: 'Mai Duy Hiếu',
        content: 'Đã hoàn thành commit struct proc, các trường int killed cũng đổi ý nghĩa thành số hiệu tín hiệu.',
        createdAt: '2026-09-28T14:20:00Z'
      }
    ],
    createdAt: '2026-09-23T08:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Triển khai Syscall ioctl & 3 Chế độ Terminal',
    description: 'Cài đặt hàm bọc devsw.ioctl, cấu trúc struct termios, và xử lý TCGETS, TCSETS trong consoleioctl.',
    assigneeId: 'member-2',
    weekNumber: 2,
    priority: 'high',
    status: 'done',
    deadline: '2026-09-29',
    checklist: [
      { id: 't2-1', text: 'Định nghĩa struct termios trong kernel/termios.h', completed: true },
      { id: 't2-2', text: 'Mở rộng devsw trong file.h thêm con trỏ ioctl(int minor, int req, uint64 arg)', completed: true },
      { id: 't2-3', text: 'Viết sys_ioctl() và fileioctl() kiểm tra FD_DEVICE', completed: true },
      { id: 't2-4', text: 'Viết consoleioctl() xử lý TCGETS và TCSETS', completed: true }
    ],
    codeFiles: ['kernel/termios.h', 'kernel/file.c', 'kernel/console.c', 'kernel/sysfile.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/3b4e8f1',
    proofOfCompletion: 'Chạy ttydemo noecho và ttydemo raw hoạt động chuẩn xác từng byte.',
    comments: [
      {
        id: 'c2',
        memberId: 'member-2',
        authorName: 'Nguyễn Tuấn Anh',
        content: 'Đã test thành công copyin/copyout từ user space, không sợ bị crash khi truyền con trỏ rác.',
        createdAt: '2026-09-29T10:15:00Z'
      }
    ],
    createdAt: '2026-09-24T09:00:00Z',
    updatedAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Cơ chế Tín hiệu & Điểm dừng an toàn stopcheck()',
    description: 'Triển khai sigdeliver(), ksignal() chỉ đánh dấu cờ; stopcheck() dừng tiến trình tại các điểm an toàn không giữ khóa.',
    assigneeId: 'member-1',
    weekNumber: 3,
    priority: 'urgent',
    status: 'done',
    deadline: '2026-10-05',
    checklist: [
      { id: 't3-1', text: 'Viết sigdeliver() và ksignal() chuyển tiến trình SLEEPING sang RUNNABLE', completed: true },
      { id: 't3-2', text: 'Cài đặt stopcheck() giải quyết khóa: acquire(wait_lock) -> wakeup -> acquire(p->lock)', completed: true },
      { id: 't3-3', text: 'Đặt điểm dừng tại cuối usertrap() để ngắt timer bắt được chương trình chiếm CPU', completed: true },
      { id: 't3-4', text: 'Đặt điểm dừng tại consoleread(), piperead(), sys_pause()', completed: true }
    ],
    codeFiles: ['kernel/proc.c', 'kernel/trap.c', 'kernel/pipe.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/5c9d2a4',
    proofOfCompletion: 'Thử nghiệm với spin.c: Nhấn Ctrl-Z dừng thành công và Ctrl-P in đúng stop.',
    comments: [],
    createdAt: '2026-09-30T08:30:00Z',
    updatedAt: '2026-10-05T17:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Bắt Ctrl-C và Ctrl-Z trong ngữ cảnh ngắt UART',
    description: 'Xử lý ký tự ngắt 0x03 và 0x1a trong consoleintr(), kiểm tra cờ ISIG và phát tín hiệu cho cả nhóm tiền cảnh.',
    assigneeId: 'member-2',
    weekNumber: 3,
    priority: 'high',
    status: 'done',
    deadline: '2026-10-06',
    checklist: [
      { id: 't4-1', text: 'Bắt ký tự 0x03 (Ctrl-C) -> in ^C -> ksignal(-t->fgpgid, SIGINT)', completed: true },
      { id: 't4-2', text: 'Bắt ký tự 0x1a (Ctrl-Z) -> in ^Z -> ksignal(-t->fgpgid, SIGTSTP)', completed: true },
      { id: 't4-3', text: 'Đảm bảo consoleintr() không bao giờ gọi sleep()', completed: true }
    ],
    codeFiles: ['kernel/console.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/7e8a1f9',
    proofOfCompletion: 'Ctrl-C giết chết counter ngay lập tức; Shell vẫn tiếp tục nhận lệnh.',
    comments: [],
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-06T15:00:00Z'
  },
  {
    id: 'task-5',
    title: 'Syscall waitpid() với WUNTRACED và WNOHANG',
    description: 'Mở rộng cơ chế thu thập trạng thái con: Báo cho cha khi con bị dừng (WUNTRACED) và kiểm tra không chặn (WNOHANG).',
    assigneeId: 'member-1',
    weekNumber: 4,
    priority: 'high',
    status: 'done',
    deadline: '2026-10-12',
    checklist: [
      { id: 't5-1', text: 'Tạo kernel/wait.h với các macro WIFEXITED, WIFSTOPPED, WSTOPSIG...', completed: true },
      { id: 't5-2', text: 'Cài đặt kwaitpid(pid, status, options) hỗ trợ pid == -1, pid > 0, pid < -1', completed: true },
      { id: 't5-3', text: 'Xử lý stopsig để mỗi lần con dừng chỉ báo một lần duy nhất', completed: true },
      { id: 't5-4', text: 'Giữ nguyên hàm wait() cũ để không làm gãy usertests', completed: true }
    ],
    codeFiles: ['kernel/wait.h', 'kernel/proc.c', 'kernel/sysproc.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/9f1c4e2',
    proofOfCompletion: 'Shell nhận diện chính xác WIFSTOPPED và đọc được stopsig 20 (SIGTSTP).',
    comments: [],
    createdAt: '2026-10-07T08:00:00Z',
    updatedAt: '2026-10-12T19:00:00Z'
  },
  {
    id: 'task-6',
    title: 'Xây dựng Bảng Job và các lệnh fg, bg, jobs trong Shell',
    description: 'Viết lại user/sh.c để hỗ trợ quản lý job, chuyển đổi foreground/background và gọi tcsetpgrp.',
    assigneeId: 'member-3',
    weekNumber: 4,
    priority: 'urgent',
    status: 'done',
    deadline: '2026-10-13',
    checklist: [
      { id: 't6-1', text: 'Tạo cấu trúc struct job jobs[MAXJOBS] trong user/sh.c', completed: true },
      { id: 't6-2', text: 'Cài đặt hàm fgjob(): chuyển terminal, gửi SIGCONT nếu cần, waitpid', completed: true },
      { id: 't6-3', text: 'Cài đặt hàm bgjob(): gửi SIGCONT và giữ terminal cho Shell', completed: true },
      { id: 't6-4', text: 'Cả cha lẫn con cùng gọi setpgid() và tcsetpgrp() tránh race condition', completed: true },
      { id: 't6-5', text: 'Trước mỗi prompt: quét waitpid(-1, WNOHANG|WUNTRACED) để thu thập trạng thái', completed: true }
    ],
    codeFiles: ['user/sh.c', 'user/ulib.c'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/2d6b8c1',
    proofOfCompletion: 'Chuỗi demo counter -> Ctrl-Z -> bg -> fg -> Ctrl-C chạy trơn tru.',
    comments: [
      {
        id: 'c3',
        memberId: 'member-3',
        authorName: 'Trần Đức Dũng',
        content: 'Đã hoàn thành mốc tuần 4! Cả nhóm đã thử nghiệm trực tiếp trên QEMU.',
        createdAt: '2026-10-13T21:00:00Z'
      }
    ],
    createdAt: '2026-10-08T09:30:00Z',
    updatedAt: '2026-10-13T20:30:00Z'
  },

  // --- REVIEW TASKS (Chờ kiểm tra) ---
  {
    id: 'task-7',
    title: 'Bảo vệ Đọc Terminal Nền: Triển khai SIGTTIN',
    description: 'Trong consoleread(), nếu tiến trình đọc bàn phím mà không thuộc nhóm tiền cảnh (fgpgid) thì gửi SIGTTIN cho cả nhóm và tự dừng.',
    assigneeId: 'member-2',
    weekNumber: 4,
    priority: 'high',
    status: 'review',
    deadline: '2026-10-18',
    checklist: [
      { id: 't7-1', text: 'Kiểm tra p->pgid != fgpgid ở đầu vòng lặp consoleread()', completed: true },
      { id: 't7-2', text: 'Gửi SIGTTIN cho cả nhóm và gọi stopcheck()', completed: true },
      { id: 't7-3', text: 'Nếu tiến trình có cờ sigignore bỏ qua SIGTTIN thì trả về -1', completed: true },
      { id: 't7-4', text: 'Viết test_background_read_stops trong test-jobctl.py', completed: true }
    ],
    codeFiles: ['kernel/console.c', 'test-jobctl.py'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/4a1d9e0',
    proofOfCompletion: 'Lệnh cat & tự động dừng, Shell báo Stopped (tty input). Sau fg đọc thành công.',
    comments: [
      {
        id: 'c4',
        memberId: 'member-2',
        authorName: 'Nguyễn Tuấn Anh',
        content: 'Nhờ Dũng chạy thử script test-jobctl.py trên máy Ubuntu xem có bị timeout không nhé.',
        createdAt: '2026-10-18T14:00:00Z'
      }
    ],
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z'
  },
  {
    id: 'task-8',
    title: 'Đồng bộ Pipeline thành một Job (counter | cat)',
    description: 'Đảm bảo khi chạy pipeline, hai vế của lệnh | thuộc chung 1 pgid; Ctrl-Z/Ctrl-C dừng/giết cả hai nhánh cùng lúc.',
    assigneeId: 'member-3',
    weekNumber: 5,
    priority: 'urgent',
    status: 'review',
    deadline: '2026-10-21',
    checklist: [
      { id: 't8-1', text: 'Gán pgid của nhánh thứ hai bằng pid của nhánh thứ nhất', completed: true },
      { id: 't8-2', text: 'Bổ sung kiểm tra stoppending trong kwaitpid() để tiến trình cha pipeline tự dừng', completed: true },
      { id: 't8-3', text: 'Viết test_pipeline_is_one_job kiểm tra cả 2 tiến trình đều chuyển STOPPED', completed: true }
    ],
    codeFiles: ['user/sh.c', 'kernel/proc.c', 'test-jobctl.py'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/6c3b8a7',
    proofOfCompletion: 'Ctrl-P xác nhận counter và cat có cùng pgid và cùng stop.',
    comments: [],
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-21T18:00:00Z'
  },
  {
    id: 'task-9',
    title: 'Xử lý Tiến trình Mồ côi Bị dừng trong reparent()',
    description: 'Khi tiến trình cha thoát mà con đang ở trạng thái STOPPED, gửi SIGHUP rồi SIGCONT để con tự thức dậy và kết thúc.',
    assigneeId: 'member-1',
    weekNumber: 5,
    priority: 'medium',
    status: 'review',
    deadline: '2026-10-22',
    checklist: [
      { id: 't9-1', text: 'Kiểm tra p->state == STOPPED trong hàm reparent()', completed: true },
      { id: 't9-2', text: 'Gọi sigdeliver(p, SIGHUP) rồi sigdeliver(p, SIGCONT)', completed: true },
      { id: 't9-3', text: 'Viết test_exit_with_stopped_job trong test-jobctl.py', completed: true }
    ],
    codeFiles: ['kernel/proc.c', 'test-jobctl.py'],
    prOrCommitUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/commit/8e7f1c3',
    proofOfCompletion: 'Sau khi exit Shell, tiến trình counter bị dừng được dọn dẹp sạch sẽ.',
    comments: [],
    createdAt: '2026-10-16T10:00:00Z',
    updatedAt: '2026-10-22T11:00:00Z'
  },

  // --- IN_PROGRESS TASKS (Đang thực hiện) ---
  {
    id: 'task-10',
    title: 'Triển khai Line Editor & Phím Mũi tên trong Shell',
    description: 'Chạy Shell ở raw mode, bắt chuỗi escape ESC [ A..D để điều hướng con trỏ trái/phải, chèn ký tự và xóa màn hình.',
    assigneeId: 'member-3',
    weekNumber: 6,
    priority: 'high',
    status: 'in_progress',
    deadline: '2026-10-25',
    checklist: [
      { id: 't10-1', text: 'Bắt mã ANSI: ESC [ D (trái), ESC [ C (phải)', completed: true },
      { id: 't10-2', text: 'Cài đặt hàm chèn ký tự và vẽ lại dòng lệnh tại vị trí con trỏ', completed: true },
      { id: 't10-3', text: 'Xử lý phím mũi tên lên/xuống để duyệt mảng history', completed: false },
      { id: 't10-4', text: 'Viết test_history_and_line_editing trong test-jobctl.py', completed: false }
    ],
    codeFiles: ['user/sh.c'],
    prOrCommitUrl: '',
    proofOfCompletion: '',
    comments: [
      {
        id: 'c5',
        memberId: 'member-3',
        authorName: 'Trần Đức Dũng',
        content: 'Đang ghép logic buffer lịch sử 16 lệnh. Cần căn chuẩn ký tự escape để không làm lệch terminal.',
        createdAt: '2026-10-22T15:30:00Z'
      }
    ],
    createdAt: '2026-10-21T08:00:00Z',
    updatedAt: '2026-10-22T15:30:00Z'
  },
  {
    id: 'task-11',
    title: 'Terminal Ảo Thứ Hai (NTTY=2) dùng chung 1 UART',
    description: 'Cài đặt 2 terminal ảo trong kernel/console.c, đổi bằng Ctrl-T, lưu buffer obuf 2KB khi terminal đang ẩn.',
    assigneeId: 'member-2',
    weekNumber: 6,
    priority: 'high',
    status: 'in_progress',
    deadline: '2026-10-26',
    checklist: [
      { id: 't11-1', text: 'Mở rộng struct tty tty[2] và biến cons.active', completed: true },
      { id: 't11-2', text: 'Bắt Ctrl-T (0x14) chuyển đổi qua lại giữa tty0 và tty1', completed: true },
      { id: 't11-3', text: 'Lưu output của terminal ẩn vào obuf và in lại khi chuyển tới', completed: false },
      { id: 't11-4', text: 'Sửa user/init.c chạy shell thứ hai trên tty1', completed: false }
    ],
    codeFiles: ['kernel/console.c', 'user/init.c'],
    prOrCommitUrl: '',
    proofOfCompletion: '',
    comments: [
      {
        id: 'c6',
        memberId: 'member-2',
        authorName: 'Nguyễn Tuấn Anh',
        content: 'Đã xong phần chuyển cons.active, đang hoàn thiện ghi buffer obuf dạng circular buffer.',
        createdAt: '2026-10-22T16:00:00Z'
      }
    ],
    createdAt: '2026-10-21T09:00:00Z',
    updatedAt: '2026-10-22T16:00:00Z'
  },

  // --- TODO TASKS (Cần làm) ---
  {
    id: 'task-12',
    title: 'Chạy Toàn Bộ 12 Kịch Bản Test Tự Động test-jobctl.py',
    description: 'Chạy script Python pexpect từ máy host đẩy phím vào QEMU, kiểm tra 12 kịch bản tự động và ghi log chi tiết.',
    assigneeId: 'member-3',
    weekNumber: 6,
    priority: 'high',
    status: 'todo',
    deadline: '2026-10-27',
    checklist: [
      { id: 't12-1', text: 'Chạy test_ctrl_c_kills_foreground và test_ctrl_z_bg_fg', completed: false },
      { id: 't12-2', text: 'Chạy test_pipeline_is_one_job và test_second_terminal', completed: false },
      { id: 't12-3', text: 'Chạy test_exit_with_stopped_job', completed: false },
      { id: 't12-4', text: 'Xuất kết quả 12/12 PASS ra file log nộp thầy', completed: false }
    ],
    codeFiles: ['test-jobctl.py'],
    prOrCommitUrl: '',
    proofOfCompletion: '',
    comments: [],
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z'
  },
  {
    id: 'task-13',
    title: 'Kiểm thử Hồi quy Toàn diện usertests trên xv6-riscv',
    description: 'Chạy test-xv6.py usertests để kiểm chứng không làm hỏng bất kỳ chức năng cũ nào của xv6 gốc.',
    assigneeId: 'member-1',
    weekNumber: 7,
    priority: 'urgent',
    status: 'todo',
    deadline: '2026-10-31',
    checklist: [
      { id: 't13-1', text: 'Đảm bảo syscall wait() cũ vẫn trả đúng status mã thô (-1 khi bị kill)', completed: false },
      { id: 't13-2', text: 'Chạy toàn bộ usertests in ra ALL TESTS PASSED', completed: false },
      { id: 't13-3', text: 'Đo lường thời gian chạy và mức tiêu thụ bộ nhớ', completed: false }
    ],
    codeFiles: ['test-xv6.py', 'kernel/proc.c'],
    prOrCommitUrl: '',
    proofOfCompletion: '',
    comments: [],
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z'
  },
  {
    id: 'task-14',
    title: 'Hoàn thiện Báo Cáo Kỹ Thuật PDF & Bộ Slide Bảo Vệ',
    description: 'Viết báo cáo kỹ thuật tổng kết ~40 trang theo quy chuẩn HUST, sơ đồ kiến trúc, giải thích code và bộ slide bảo vệ.',
    assigneeId: 'all',
    weekNumber: 7,
    priority: 'high',
    status: 'todo',
    deadline: '2026-11-02',
    checklist: [
      { id: 't14-1', text: 'Thành viên 1 hoàn thiện chương Process, Signal & Synchronization', completed: false },
      { id: 't14-2', text: 'Thành viên 2 hoàn thiện chương TTY Layer & Terminal ảo', completed: false },
      { id: 't14-3', text: 'Thành viên 3 hoàn thiện chương Shell Job Control & Automated Testing', completed: false },
      { id: 't14-4', text: 'Tổng hợp slide thuyết trình 25 trang và kịch bản demo 5 phút', completed: false }
    ],
    codeFiles: [],
    prOrCommitUrl: '',
    proofOfCompletion: '',
    comments: [],
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z'
  }
];
