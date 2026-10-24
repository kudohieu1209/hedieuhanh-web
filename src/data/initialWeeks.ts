import { WeekRoadmap } from '../types';

export const INITIAL_WEEKS: WeekRoadmap[] = [
  {
    weekNumber: 1,
    title: 'Khảo sát xv6 và Phân tích Yêu cầu',
    subtitle: 'Tìm hiểu kiến trúc xv6-riscv gốc và phân tích chi tiết đề bài Đề #27',
    goals: [
      'Nắm vững kiến trúc xv6-riscv commit 06aad25 trên nền QEMU',
      'Phân tích yêu cầu kỹ thuật Đề #27 và các phần việc ẩn bắt buộc',
      'Thống nhất nguyên tắc thiết kế tổng thể: Quầy lễ tân và chiếc điện thoại',
      'Chuẩn bị môi trường Ubuntu 26.04, RISC-V toolchain và Python pexpect'
    ],
    customReportDate: '2026-09-22',
    status: 'accepted',
    memberAssignments: {
      'member-1': [
        'Đọc kernel/console.c, uart.c: cách nhận ký tự ngắt qua UART',
        'Khảo sát consoleintr() và consoleread(): các phím Ctrl-U, Ctrl-P, Ctrl-D có sẵn',
        'Xác định nguyên tắc ngắt: consoleintr() chạy trong ngữ cảnh ngắt, KHÔNG được ngủ'
      ],
      'member-2': [
        'Đọc kernel/proc.c, proc.h: cách quản lý struct proc, enum procstate',
        'Khảo sát cơ chế scheduler() và các syscall fork, exec, wait',
        'Phân tích thiếu sót của xv6 gốc: chưa có STOPPED, chưa có nhóm tiến trình'
      ],
      'member-3': [
        'Đọc user/sh.c: cơ chế phân tích cú pháp lệnh, thực thi lệnh đơn và pipeline',
        'Khảo sát lệnh chạy nền bằng toán tử & (kiểu lệnh BACK)',
        'Xác định các lệnh nội tuyến cần bổ sung: jobs, fg, bg, kill'
      ]
    },
    deliverables: [
      'Bản phân tích yêu cầu đề bài Đề #27 (Project_catalogue_VN.md)',
      'Sơ đồ kiến trúc 3 tầng: Process/Signal - TTY Layer - User/Shell',
      'Môi trường chạy QEMU RISC-V và bản clone sạch mit-pdos/xv6-riscv'
    ],
    checklist: [
      { id: 'w1-1', text: 'Cài đặt thành công riscv64-linux-gnu-gcc và qemu-system-riscv64', completed: true, assignedMemberId: 'all' },
      { id: 'w1-2', text: 'Chạy thử nghiệm usertests trên xv6 gốc đảm bảo pass 100%', completed: true, assignedMemberId: 'member-3' },
      { id: 'w1-3', text: 'Lập sơ đồ tổng quan luồng xử lý từ UART ngắt đến TTY và Shell', completed: true, assignedMemberId: 'member-1' },
      { id: 'w1-4', text: 'Viết tài liệu khảo sát vòng đời tiến trình xv6 gốc', completed: true, assignedMemberId: 'member-2' }
    ],
    demoScript: [
      '# Kiểm tra môi trường xv6 gốc',
      'cd /home/hieu/xv6-riscv',
      'make qemu',
      '$ echo "xv6 is running"',
      '$ Ctrl-P # xem danh sách tiến trình gốc',
      '$ Ctrl-A x # thoát QEMU'
    ],
    notes: 'Thầy Tiến yêu cầu làm rõ ngay từ đầu: đề #27 bắt buộc phải có script tự động gõ phím từ host để kiểm chứng, không chỉ demo bằng tay.',
    lecturerFeedback: 'Hướng tiếp cận phân tích 3 tầng là hợp lý. Lưu ý không sửa lung tung vào kernel mà phải vẽ sơ đồ chuyển trạng thái trước.',
    postReportRequests: [
      'Bổ sung sơ đồ chuyển trạng thái UNUSED -> RUNNABLE -> RUNNING -> STOPPED -> ZOMBIE vào tài liệu thiết kế.',
      'Làm rõ cách xử lý khi tiến trình cha chết nhưng tiến trình con đang ở trạng thái STOPPED.'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan1_KhaoSat.pdf',
    slideUrl: 'https://docs.google.com/presentation/d/xv6-tuan1-overview',
    updatedAt: '2026-09-22T17:30:00Z'
  },
  {
    weekNumber: 2,
    title: 'Xây dựng Nền tảng: struct proc, struct tty và ioctl',
    subtitle: 'Định nghĩa các cấu trúc dữ liệu cốt lõi trong Kernel và thiết kế API',
    goals: [
      'Định nghĩa struct tty với buffer r/w/e, lflag (ICANON/ECHO/ISIG) và fgpgid',
      'Mở rộng struct proc với trạng thái STOPPED, pgid, pendstop, stopsig, sigignore',
      'Triển khai syscall ioctl() qua bảng devsw với con trỏ ioctl(minor, req, arg)',
      'Thiết kế cấu trúc bảng Job trong Shell (user/sh.c)'
    ],
    customReportDate: '2026-09-29',
    status: 'accepted',
    memberAssignments: {
      'member-1': [
        'Tạo kernel/termios.h với các macro TCGETS, TCSETS, TIOCGPGRP, TIOCSPGRP',
        'Định nghĩa struct tty trong kernel/console.c',
        'Triển khai syscall ioctl (sys_ioctl -> fileioctl -> consoleioctl)'
      ],
      'member-2': [
        'Sửa kernel/proc.h: thêm enum procstate STOPPED, các trường pgid, pendstop, stopsig, sigignore',
        'Sửa fork() để con kế thừa pgid và sigignore; sửa exec() giữ nguyên hai trường này',
        'Thêm syscall sys_setpgid() và sys_getpgid()'
      ],
      'member-3': [
        'Thiết kế struct job trong user/sh.c (pgid, cmd line, state, termios)',
        'Viết hàm bọc user space: tcgetattr, tcsetattr, tcgetpgrp, tcsetpgrp trong user/ulib.c',
        'Viết chương trình thử nghiệm ttydemo kiểm tra các chế độ'
      ]
    },
    deliverables: [
      'Bản thiết kế kỹ thuật DESIGN.md chi tiết cấu trúc dữ liệu và API',
      'Mã nguồn các file: kernel/proc.h, kernel/termios.h, kernel/console.c (khung ioctl)',
      'Chương trình demo ban đầu user/ttydemo.c'
    ],
    checklist: [
      { id: 'w2-1', text: 'Biên dịch thành công kernel với struct proc và struct tty mới', completed: true, assignedMemberId: 'member-2' },
      { id: 'w2-2', text: 'Kiểm thử ioctl(TCSETS) đổi cờ lflag giữa Raw, Cooked và No-Echo', completed: true, assignedMemberId: 'member-1' },
      { id: 'w2-3', text: 'Chạy thử ttydemo noecho kiểm tra không in lại ký tự mật khẩu', completed: true, assignedMemberId: 'member-3' },
      { id: 'w2-4', text: 'Chạy lại usertests đảm bảo các syscall cũ không bị ảnh hưởng', completed: true, assignedMemberId: 'member-3' }
    ],
    demoScript: [
      '# Demo chế độ No-Echo và Raw với ttydemo',
      '$ ttydemo noecho',
      'password: [nhập secret - không hiện chữ]',
      'you typed 6 characters',
      '$ ttydemo raw',
      'key a = 97',
      'q'
    ],
    notes: 'Thầy nhắc: consoleioctl phải kiểm tra minor để chuẩn bị cho việc hỗ trợ terminal ảo thứ hai.',
    lecturerFeedback: 'Thiết kế ioctl đi qua bảng devsw rất chuẩn theo phong cách Unix/xv6. Đã duyệt chuyển sang tuần triển khai tín hiệu.',
    postReportRequests: [
      'Đảm bảo struct termios có kích thước gọn nhẹ, không dùng quá nhiều byte trong kernel stack.',
      'Kiểm tra tính an toàn khi gọi ioctl với địa chỉ user space không hợp lệ (copyin/copyout).'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan2_NenTang.pdf',
    slideUrl: 'https://docs.google.com/presentation/d/xv6-tuan2-struct-design',
    updatedAt: '2026-09-29T16:45:00Z'
  },
  {
    weekNumber: 3,
    title: 'Signals và Bắt Phím Ctrl-C / Ctrl-Z',
    subtitle: 'Triển khai cơ chế tín hiệu thu nhỏ, điểm dừng an toàn và xử lý phím ngắt',
    goals: [
      'Bắt Ctrl-C và Ctrl-Z trong consoleintr(): gửi SIGINT / SIGTSTP cho cả nhóm tiền cảnh',
      'Triển khai cơ chế tín hiệu thu nhỏ: sigdeliver(), ksignal() chỉ đánh dấu cờ',
      'Triển khai stopcheck() tại các điểm an toàn: usertrap(), consoleread(), sys_pause()',
      'Giải quyết triệt để nguy cơ Deadlock khi nhả/lấy khóa trong stopcheck()'
    ],
    customReportDate: '2026-10-06',
    status: 'accepted',
    memberAssignments: {
      'member-1': [
        'Bổ sung xử lý phím Ctrl-C (0x03) và Ctrl-Z (0x1a) trong consoleintr()',
        'Kiểm tra cờ ISIG: nếu bật thì in ^C / ^Z và gọi ksignal(-fgpgid, SIGINT/SIGTSTP)',
        'Đảm bảo consoleintr() không bao giờ gọi sleep() trong ngữ cảnh ngắt'
      ],
      'member-2': [
        'Cài đặt sigdeliver() và ksignal() trong kernel/proc.c',
        'Cài đặt stopcheck() với cơ chế acquire(wait_lock) -> wakeup(p->parent) -> acquire(p->lock)',
        'Đặt điểm kiểm tra stopcheck() ở cuối usertrap() (xử lý tiến trình ngốn CPU như spin)'
      ],
      'member-3': [
        'Tạo hai chương trình kiểm thử: counter.c (ngủ bằng sys_pause) và spin.c (vòng lặp vô tận)',
        'Kiểm thử nhấn Ctrl-C ngắt counter; kiểm thử Ctrl-Z đưa counter vào trạng thái STOPPED',
        'Viết kịch bản test tự động bước đầu bằng Python pexpect'
      ]
    },
    deliverables: [
      'Sơ đồ máy trạng thái tín hiệu: UNUSED -> RUNNABLE -> RUNNING -> STOPPED',
      'Mã nguồn hoàn thiện kernel/console.c (ngắt Ctrl-C/Z) và kernel/proc.c (stopcheck, sigdeliver)',
      'Hai chương trình kiểm thử user/counter.c và user/spin.c'
    ],
    checklist: [
      { id: 'w3-1', text: 'Nhấn Ctrl-C ngắt được counter và in ra ^C', completed: true, assignedMemberId: 'member-1' },
      { id: 'w3-2', text: 'Nhấn Ctrl-Z tạm dừng được spin (tiến trình chiếm CPU nhờ ngắt timer)', completed: true, assignedMemberId: 'member-2' },
      { id: 'w3-3', text: 'Nhấn Ctrl-P thấy rõ trạng thái "stop" và đúng số pgid', completed: true, assignedMemberId: 'member-3' },
      { id: 'w3-4', text: 'Chứng minh không bị deadlock giữa wait_lock và p->lock', completed: true, assignedMemberId: 'member-2' }
    ],
    demoScript: [
      '# Demo ngắt và tạm dừng tiến trình',
      '$ counter',
      'counter[4]: 1',
      'counter[4]: 2',
      '^Z',
      '$ Ctrl-P # thấy dòng: 4 4 stop counter',
      '$ spin',
      '^Z',
      '$ Ctrl-P # thấy dòng: 5 5 stop spin'
    ],
    notes: 'Điểm cực kỳ then chốt trong buổi vấn đáp: Vì sao không được gọi sleep() trong consoleintr()? (Trả lời: Vì consoleintr chạy trong ngữ cảnh ngắt, không thuộc tiến trình nào!).',
    lecturerFeedback: 'Thầy đánh giá cao cách giải thích thứ tự acquire lock trong stopcheck(). Demo Ctrl-Z dừng được spin chứng minh ngắt timer hoạt động đúng.',
    postReportRequests: [
      'Hoàn thiện syscall waitpid để Shell nhận biết được khi con rơi vào STOPPED thay vì chỉ ZOMBIE.',
      'Viết tiếp các lệnh fg và bg trong Shell ở tuần tiếp theo.'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan3_Signals.pdf',
    slideUrl: 'https://docs.google.com/presentation/d/xv6-tuan3-signals-ctrlz',
    updatedAt: '2026-10-06T18:00:00Z'
  },
  {
    weekNumber: 4,
    title: 'Job Control Hoàn Chỉnh: waitpid, fg, bg, jobs và SIGTTIN',
    subtitle: 'Liên kết TTY và Shell: Đưa tiến trình ra nền, kéo về tiền cảnh và bảo vệ I/O',
    goals: [
      'Hỗ trợ TIOCGPGRP và TIOCSPGRP để Shell chuyển giao quyền điều khiển terminal',
      'Triển khai syscall waitpid() với các cờ WUNTRACED và WNOHANG',
      'Xử lý SIGTTIN: Tự động dừng tiến trình nền khi cố tình đọc từ bàn phím',
      'Xây dựng các lệnh nội tuyến trong Shell: jobs, fg, bg, kill %n và toán tử &'
    ],
    customReportDate: '2026-10-13',
    status: 'accepted',
    memberAssignments: {
      'member-1': [
        'Triển khai TIOCSPGRP và TIOCGPGRP trong kernel/console.c',
        'Trong consoleread(): kiểm tra p->pgid != fgpgid -> gửi SIGTTIN và dừng',
        'Nếu tiến trình bỏ qua SIGTTIN thì trả về -1 thay vì treo mãi'
      ],
      'member-2': [
        'Hoàn thiện kwaitpid() trong kernel/proc.c: trả về status mã POSIX khi con STOPPED',
        'Triển khai logic stopsig để mỗi lần con dừng chỉ báo cho cha đúng 1 lần',
        'Xử lý cờ WNOHANG để Shell thu thập trạng thái tiến trình nền mà không bị block'
      ],
      'member-3': [
        'Viết lại vòng lặp Shell: hàm runjob(), fgjob(), listjobs() trong user/sh.c',
        'Triển khai cả cha và con cùng gọi setpgid và tcsetpgrp tránh race condition',
        'Kiểm thử cat & -> jobs hiện Stopped (tty input) -> fg -> đọc bình thường'
      ]
    },
    deliverables: [
      'Mã nguồn hoàn chỉnh Shell có Job Control: user/sh.c, kernel/proc.c, kernel/console.c',
      'Video và kịch bản demo chuỗi thao tác: Ctrl-Z -> bg -> fg -> Ctrl-C',
      'Bản chạy thử nghiệm 12 test case trong test-jobctl.py'
    ],
    checklist: [
      { id: 'w4-1', text: 'Chạy counter -> Ctrl-Z -> bg -> in số ngầm -> fg -> Ctrl-C kết thúc', completed: true, assignedMemberId: 'member-3' },
      { id: 'w4-2', text: 'Lệnh jobs in đúng số thứ tự, trạng thái [1]+ Running/Stopped và tên lệnh', completed: true, assignedMemberId: 'member-3' },
      { id: 'w4-3', text: 'Chạy cat & tự động dừng với thông báo Stopped (tty input)', completed: true, assignedMemberId: 'member-1' },
      { id: 'w4-4', text: 'Lệnh kill %1 gửi SIGKILL kết thúc được cả tiến trình đang bị dừng', completed: true, assignedMemberId: 'member-2' }
    ],
    demoScript: [
      '# Chuỗi demo kinh điển của Đề #27',
      '$ counter',
      'counter[4]: 1',
      '^Z',
      '[1]+ Stopped  counter',
      '$ jobs',
      '[1]+ Stopped  counter',
      '$ bg',
      '[1]+ Running  counter &',
      'counter[4]: 2',
      '$ fg',
      'counter',
      '^C',
      '$ jobs # bảng job đã trống'
    ],
    notes: 'Đã hoàn thành toàn bộ yêu cầu cốt lõi bắt buộc của Đề #27 vào ngày 13/10/2026. Nhánh tty-jobctl đã merge ổn định.',
    lecturerFeedback: 'Rất tốt! Nhóm đã giải quyết xuất sắc phần Job Control cơ bản. Khuyến khích làm tiếp stretch goal (Line editor và terminal thứ hai) để đạt điểm tối đa A+.',
    postReportRequests: [
      'Thử nghiệm tình huống phức tạp: Pipeline counter | cat có bị dừng đồng thời không?',
      'Xử lý tình huống tiến trình mồ côi bị dừng khi Shell thoát.'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan4_JobControl.pdf',
    slideUrl: 'https://docs.google.com/presentation/d/xv6-tuan4-job-control-demo',
    updatedAt: '2026-10-13T20:30:00Z'
  },
  {
    weekNumber: 5,
    title: 'Pipeline và Xử lý các Tình Huống Đặc Biệt',
    subtitle: 'Đảm bảo cả pipeline là một job duy nhất và xử lý triệt để tiến trình mồ côi',
    goals: [
      'Đảm bảo cả pipeline (counter | cat) thuộc chung một pgid và Ctrl-C/Z tới tất cả cùng lúc',
      'Lưu và phục hồi chế độ terminal (termios) khi chuyển đổi giữa Shell và Job',
      'Xử lý điểm dừng trong kwaitpid() khi tiến trình đầu nhóm đang chờ hai nhánh con',
      'Xử lý tiến trình mồ côi đang STOPPED trong reparent(): gửi SIGHUP rồi SIGCONT'
    ],
    customReportDate: '2026-10-20',
    status: 'ready_to_report',
    memberAssignments: {
      'member-1': [
        'Cơ chế khôi phục terminal mode: Shell lưu termios của job trước khi dừng, khôi phục khi fg',
        'Đảm bảo khi job thoát bất thường, terminal luôn được reset về Cooked an toàn',
        'Kiểm tra buffer obuf khi terminal bị tràn output'
      ],
      'member-2': [
        'Sửa reparent() trong kernel/proc.c: gửi SIGHUP rồi SIGCONT cho con bị dừng khi cha chết',
        'Bổ sung kiểm tra stoppending trong kwaitpid() để tiến trình cha pipeline tự dừng',
        'Kiểm tra tính an toàn bộ nhớ khi fork pipeline nhiều tầng'
      ],
      'member-3': [
        'Cải tiến user/sh.c để fork pipeline gán chung pgid của nhánh con đầu tiên',
        'Viết test_pipeline_is_one_job và test_exit_with_stopped_job trong test-jobctl.py',
        'Tối ưu hóa hiển thị prompt sau khi xử lý pipeline'
      ]
    },
    deliverables: [
      'Bản vá Pipeline và Reparenting trên nhánh tty-jobctl',
      'Bộ test case tình huống đặc biệt chạy tự động trong test-jobctl.py',
      'Báo cáo kỹ thuật phân tích các ca góc cạnh (Edge cases)'
    ],
    checklist: [
      { id: 'w5-1', text: 'Chạy counter | cat -> nhấn Ctrl-Z -> cả 2 tiến trình đều chuyển STOPPED', completed: true, assignedMemberId: 'member-3' },
      { id: 'w5-2', text: 'Dùng Ctrl-P xác nhận counter và cat có cùng số pgid', completed: true, assignedMemberId: 'member-2' },
      { id: 'w5-3', text: 'Tạm dừng counter -> gõ exit -> tiến trình con tự kết thúc, không bị zombie treo', completed: true, assignedMemberId: 'member-2' },
      { id: 'w5-4', text: 'Chạy ttydemo raw -> Ctrl-Z -> Shell vẫn nhận phím cooked bình thường', completed: true, assignedMemberId: 'member-1' }
    ],
    demoScript: [
      '# Demo Pipeline là một job',
      '$ counter | cat',
      'counter[4]: 1',
      '^Z',
      '[1]+ Stopped  counter | cat',
      '$ Ctrl-P # xem counter và cat chung pgid 4, đều trạng thái stop',
      '$ fg',
      '^C # cả 2 tiến trình biến mất sạch sẽ'
    ],
    notes: 'Chuẩn bị báo cáo tuần 5 với thầy Tiến vào thứ Ba 27/10/2026.',
    lecturerFeedback: 'Chưa báo cáo (đã nộp bản thảo và slide).',
    postReportRequests: [
      'Chuẩn bị dữ liệu đo kiểm thử tự động cho tuần 6.',
      'Hoàn thiện tài liệu thuyết minh phần stretch goal.'
    ],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan5_Pipeline_EdgeCases.pdf',
    slideUrl: 'https://docs.google.com/presentation/d/xv6-tuan5-pipeline-signals',
    updatedAt: '2026-10-20T19:00:00Z'
  },
  {
    weekNumber: 6,
    title: 'Mở rộng (Stretch Goals) & Tự Động Hóa Kiểm Thử',
    subtitle: 'Hiện thực hóa Line Editor phím mũi tên, Terminal ảo thứ hai và bộ 12 test tự động',
    goals: [
      'Triển khai Terminal ảo thứ hai (tty1) dùng chung 1 UART, đổi qua lại bằng Ctrl-T',
      'Hỗ trợ minor terminal trong devsw: định tuyến consoleioctl và consoleread theo tty[minor]',
      'Xây dựng Line Editor trong user/sh.c: điều hướng mũi tên trái/phải, chèn giữa dòng',
      'Triển khai Command History trong Shell với lệnh history và phím mũi tên lên/xuống',
      'Chạy hoàn tất 12/12 bài kiểm thử tự động trong test-jobctl.py'
    ],
    customReportDate: '2026-10-27',
    status: 'in_progress',
    memberAssignments: {
      'member-1': [
        'Cài đặt NTTY=2 trong kernel/console.c, quản lý tty[0] và tty[1]',
        'Xử lý phím Ctrl-T (0x14) trong consoleintr(): chuyển cons.active và in lại obuf',
        'Sửa user/init.c: mở thêm 1 shell trên tty1 (minor 1)',
        'Hỗ trợ minor terminal trong devsw: định tuyến consoleioctl và consoleread theo tty[minor]'
      ],
      'member-2': [
        'Kiểm tra deadlock và độ tranh chấp lock khi 2 terminal cùng in output đồng thời',
        'Tối ưu hóa kích thước kernel code và bộ đệm obuf (2KB)',
        'Đảm bảo struct proc tương thích đa terminal ảo'
      ],
      'member-3': [
        'Triển khai Line editor chạy raw mode trong user/sh.c (chuỗi ESC [ A..D)',
        'Lưu mảng lịch sử lệnh history[] (16 lệnh) và xử lý phím mũi tên lên/xuống',
        'Hoàn thiện script test-jobctl.py kiểm tra test_second_terminal và test_history'
      ]
    },
    deliverables: [
      'Mã nguồn tính năng Line Editor và Lịch sử lệnh trong user/sh.c',
      'Mã nguồn Terminal ảo thứ hai trong kernel/console.c và user/init.c',
      'Bộ test tự động test-jobctl.py chạy hoàn chỉnh trên máy host'
    ],
    checklist: [
      { id: 'w6-1', text: 'Gõ lệnh dài -> bấm mũi tên trái -> chèn ký tự -> phím mũi tên phải -> Enter chạy đúng', completed: true, assignedMemberId: 'member-3' },
      { id: 'w6-2', text: 'Bấm mũi tên lên lặp lại các lệnh trước đó; gõ history in danh sách lệnh', completed: true, assignedMemberId: 'member-3' },
      { id: 'w6-3', text: 'Bấm Ctrl-T chuyển sang [tty1], chạy counter; bấm Ctrl-T về [tty0] không bị nhiễu', completed: true, assignedMemberId: 'member-1' },
      { id: 'w6-4', text: 'Chạy ./test-jobctl.py đạt 12/12 bài kiểm thử pass', completed: false, assignedMemberId: 'member-3' }
    ],
    demoScript: [
      '# Demo Line Editor và Terminal ảo',
      '$ echo hllo [bấm mũi tên trái 3 lần] e [Enter] -> in hello',
      '$ history',
      '1  echo first',
      '2  echo hello',
      '$ Ctrl-T # chuyển sang [tty1]',
      '[tty1] $ counter',
      '$ Ctrl-T # quay lại [tty0], màn hình hoàn toàn tách biệt'
    ],
    notes: 'Cần lưu ý: obuf có dung lượng 2KB, khi đầy sẽ ghi đè ký tự cũ nhất theo cơ chế circular buffer.',
    lecturerFeedback: 'Chưa báo cáo.',
    postReportRequests: [],
    pdfUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan6_StretchGoals.pdf',
    slideUrl: '',
    updatedAt: '2026-10-22T10:00:00Z'
  },
  {
    weekNumber: 7,
    title: 'Hoàn thiện, Đóng gói & Nghiệm thu Bảo vệ Đồ án',
    subtitle: 'Kiểm thử hồi quy toàn diện, hoàn thiện slide, video demo và diễn tập vấn đáp',
    goals: [
      'Chạy kiểm thử hồi quy toàn bộ hệ thống bằng test-xv6.py usertests (ALL TESTS PASSED)',
      'Đóng gói tài liệu báo cáo kỹ thuật hoàn chỉnh (PDF) và Slide thuyết trình',
      'Quay video demo dự phòng theo kịch bản 5 phút trong DEMO.md',
      'Tập dượt phản biện 25 câu hỏi vấn đáp bảo vệ trong ON_TAP.md'
    ],
    customReportDate: '2026-11-03',
    status: 'not_started',
    memberAssignments: {
      'member-1': [
        'Rà soát driver TTY, giải thích cách UART truyền dữ liệu tới TTY buffer',
        'Luyện giải thích 3 chế độ Raw/Cooked/No-Echo và cơ chế chuyển đổi Terminal ảo',
        'Chuẩn bị demo trực tiếp trên QEMU theo yêu cầu của hội đồng'
      ],
      'member-2': [
        'Rà soát toàn bộ code Kernel, giải thích từng biến mới và lý do khóa',
        'Luyện trả lời câu hỏi hóc búa về Scheduler, Lock ordering và Orphaned stopped process',
        'Chuẩn bị giải thích trực tiếp trên file kernel/proc.c và trap.c'
      ],
      'member-3': [
        'Rà soát kiến trúc Shell, giải thích cơ chế tránh race condition giữa fork và setpgid',
        'Chạy tổng duyệt 12 test tự động và chuẩn bị sửa live code nếu thầy yêu cầu',
        'Lắp ghép slide tổng kết, dựng video demo 5 phút'
      ]
    },
    deliverables: [
      'Báo cáo kỹ thuật đồ án hoàn chỉnh (PDF ~40 trang)',
      'Bộ Slide bảo vệ đồ án chuyên nghiệp (~25 slide)',
      'Video demo 5 phút độ phân giải cao',
      'Repository GitHub sạch sẽ với README, DESIGN, DEMO, ON_TAP'
    ],
    checklist: [
      { id: 'w7-1', text: 'Chạy ./test-xv6.py usertests hoàn thành không có lỗi', completed: false, assignedMemberId: 'member-2' },
      { id: 'w7-2', text: 'Chạy ./test-jobctl.py trên máy host hoàn thành 12/12', completed: false, assignedMemberId: 'member-3' },
      { id: 'w7-3', text: 'Thực hành 5 bài tập tự sửa trực tiếp (đổi phím Ctrl-T sang Ctrl-N, v.v.)', completed: false, assignedMemberId: 'all' },
      { id: 'w7-4', text: 'Tổ chức 2 buổi vấn đáp chéo giữa 3 thành viên', completed: false, assignedMemberId: 'all' }
    ],
    demoScript: [
      '# Tổng duyệt toàn bộ kịch bản 5 phút',
      './test-jobctl.py',
      'make clean && make qemu',
      'Thực hiện tuần tự 7 bước trong file DEMO.md'
    ],
    notes: 'Kỳ vọng điểm: 10/10 (A+) nhờ hoàn thành trọn vẹn cả yêu cầu bắt buộc lẫn stretch goal và kiểm thử tự động.',
    lecturerFeedback: 'Chưa tới tuần nghiệm thu.',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    updatedAt: '2026-10-22T10:00:00Z'
  }
];
