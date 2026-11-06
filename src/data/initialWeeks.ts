import { WeekRoadmap } from '../types';
import { WEEKLY_REPORTS } from './weeklyReports';

// Lộ trình 7 tuần theo "Kế hoạch báo cáo 7 tuần" của nhóm (docs/Ke_hoach_bao_cao_7_tuan_TTY_Job_Control_xv6.md).
// Nội dung báo cáo của từng tuần lấy từ file .docx chính thức (xem weeklyReports.ts).
// member-1 = Mai Duy Hiếu (TTY), member-2 = Nguyễn Huy Hoàng (Process & Signal), member-3 = Vũ Tuấn Anh (Shell & Testing).
//
// Chỉ ghi nhận xét của thầy (lecturerFeedback, postReportRequests) khi thầy đã thật sự nhận xét.

// ===== LINK BÁO CÁO (OneDrive) =====
// Dán link chia sẻ OneDrive của từng tuần vào đây (để "Anyone with the link can view").
// Tuần nào còn để trống thì web dùng file .docx trong public/reports.
export const REPORT_LINKS: Record<number, string> = {
  1: '',
  2: '',
  3: 'https://husteduvn-my.sharepoint.com/:w:/r/personal/hieu_md223967_sis_hust_edu_vn/_layouts/15/Doc.aspx?sourcedoc=%7BE0C25115-10D7-4324-B224-05A47A9FF2B9%7D&file=PROGRESS%20REPORT%20tu%E1%BA%A7n%203.docx&action=default&mobileredirect=true',
  4: 'https://husteduvn-my.sharepoint.com/:w:/r/personal/hieu_md223967_sis_hust_edu_vn/_layouts/15/Doc.aspx?sourcedoc=%7B005E0195-0DF4-4073-8B2D-839E579F7AF3%7D&file=PROGRESS%20REPORT%20tu%E1%BA%A7n%204.docx&action=default&mobileredirect=true',
  5: 'https://husteduvn-my.sharepoint.com/:w:/r/personal/hieu_md223967_sis_hust_edu_vn/_layouts/15/Doc.aspx?sourcedoc=%7B861878C8-EB98-47EC-A6C6-A913F9423F01%7D&file=PROGRESS%20REPORT%20tu%E1%BA%A7n%205.docx&action=default&mobileredirect=true',
  6: 'https://husteduvn-my.sharepoint.com/:w:/r/personal/hieu_md223967_sis_hust_edu_vn/_layouts/15/Doc.aspx?sourcedoc=%7BFCA2BFC6-C8D3-47B8-BF58-28B1D41B79A3%7D&file=PROGRESS%20REPORT%20tu%E1%BA%A7n%206.docx&action=default&mobileredirect=true',
  7: 'https://husteduvn-my.sharepoint.com/:w:/r/personal/hieu_md223967_sis_hust_edu_vn/_layouts/15/Doc.aspx?sourcedoc=%7B226E8721-7E1F-4F7D-B237-B8C10BFC2974%7D&file=PROGRESS%20REPORT%20tu%E1%BA%A7n%207.docx&action=default&mobileredirect=true'
};

const reportFile = (w: number) =>
  REPORT_LINKS[w] || `${import.meta.env.BASE_URL}reports/progress-report-tuan-${w}.docx`;
const report = (w: number) => WEEKLY_REPORTS.find(r => r.weekNumber === w);

export const INITIAL_WEEKS: WeekRoadmap[] = [
  {
    weekNumber: 1,
    title: 'Tìm hiểu xv6 và phân tích yêu cầu',
    subtitle: 'Nắm kiến trúc xv6 gốc, xác định vấn đề cần giải quyết và thiết kế tổng quan',
    goals: [
      'Khảo sát vòng đời tiến trình, scheduler, fork / exec / wait của xv6 gốc',
      'Khảo sát console, UART và đường đi của một ký tự',
      'Khảo sát shell xv6 gốc, pipeline và lệnh nền &',
      'Chốt kiến trúc 3 tầng Process & Signal – TTY Layer – Shell, dựng môi trường QEMU'
    ],
    customReportDate: '2026-10-25',
    status: 'reported',
    memberAssignments: {
      'member-1': ['Đọc console.c, uart.c: luồng ký tự từ ngắt UART tới consoleread()', 'Đề xuất cờ ECHO / ICANON / ISIG và các request ioctl', 'Dựng Figma board; chủ trì trình bày tuần 1'],
      'member-2': ['Đọc proc.h, proc.c, trap.c: vòng đời tiến trình và luồng trap', 'Xác định vị trí trạng thái STOPPED và các trường pgid, pendstop, stopsig'],
      'member-3': ['Đọc sh.c: parse, pipeline, lệnh nền &', 'Lập board Trello và ma trận kiểm thử TC-01 đến TC-06']
    },
    deliverables: ['Bảng hạn chế của xv6 gốc', 'Sơ đồ kiến trúc 3 tầng (Figma)', 'xv6 khởi động được trên QEMU', 'Ma trận kiểm thử 6 test case (Pending)'],
    checklist: [
      { id: 'w1-1', text: 'Cài RISC-V toolchain và QEMU, khởi động được xv6', completed: true, assignedMemberId: 'all' },
      { id: 'w1-2', text: 'Ghi chú phân tích proc.c / trap.c', completed: true, assignedMemberId: 'member-2' },
      { id: 'w1-3', text: 'Sơ đồ luồng xử lý console / UART', completed: true, assignedMemberId: 'member-1' },
      { id: 'w1-4', text: 'Board Trello và ma trận kiểm thử TC-01 đến TC-06', completed: true, assignedMemberId: 'member-3' },
      { id: 'w1-5', text: 'Nộp báo cáo tuần 1', completed: true, assignedMemberId: 'member-1' }
    ],
    demoScript: ['make qemu', '# xv6 kernel is booting ...', '# init: starting sh on console', '# init: starting sh on tty1', '$ echo hello', '# Ctrl-P: danh sách tiến trình', '# Ctrl-A x: thoát QEMU'],
    notes: '',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(1),
    report: report(1),
    updatedAt: '2026-10-25T12:00:00Z'
  },
  {
    weekNumber: 2,
    title: 'Thiết kế và nền tảng: struct proc, struct tty, ioctl, bảng job',
    subtitle: 'Làm rõ cấu trúc dữ liệu, system call và giao diện nối các phân hệ',
    goals: [
      'So sánh struct proc của xv6 gốc với bản mở rộng (STOPPED, pgid, pendstop, stopsig, sigignore)',
      'Phân tích struct tty, ba chế độ Cooked / No-Echo / Raw và đường đi của ioctl()',
      'Kiểm chứng thiết kế bảng job trong shell',
      'Thống nhất giao diện TTY ↔ Process qua fgpgid'
    ],
    customReportDate: '2026-11-01',
    status: 'reported',
    memberAssignments: {
      'member-1': ['Đọc console.c, termios.h, file.c, sysfile.c', 'Vẽ đường đi ioctl() tới consoleioctl()', 'Demo ttydemo ở 3 chế độ; tổng hợp báo cáo'],
      'member-2': ['Đối chiếu proc.h, proc.c, sysproc.c giữa xv6 gốc và bản mở rộng', 'Đường đi setpgid() / getpgid()', 'Quan sát pgid bằng Ctrl-P; chủ trì trình bày tuần 2'],
      'member-3': ['Đọc sh.c: struct job, addjob, runjob', 'Cập nhật Trello, vẽ sơ đồ tuần 2 trên Figma']
    },
    deliverables: ['Bảng so sánh cấu trúc dữ liệu xv6 gốc / bản mở rộng', 'Demo ttydemo 3 chế độ', 'Quan sát pgid của pipeline bằng Ctrl-P'],
    checklist: [
      { id: 'w2-1', text: 'Bảng so sánh struct proc / struct tty', completed: true, assignedMemberId: 'member-2' },
      { id: 'w2-2', text: 'ttydemo cooked / noecho / raw: PASS', completed: true, assignedMemberId: 'member-1' },
      { id: 'w2-3', text: 'counter | cat chung pgid (Ctrl-P): PASS', completed: true, assignedMemberId: 'member-2' },
      { id: 'w2-4', text: 'Trello + Figma tuần 2', completed: true, assignedMemberId: 'member-3' },
      { id: 'w2-5', text: 'Nộp báo cáo tuần 2', completed: true, assignedMemberId: 'member-1' }
    ],
    demoScript: ['$ ttydemo cooked     # gõ abc, Backspace, Enter → read() returned 3 bytes: ab', '$ ttydemo noecho     # gõ hello → you typed 5 characters (not shown)', '$ ttydemo raw        # Ctrl-C → key ^C = 3; q để thoát', '$ counter | cat      # Ctrl-Z rồi Ctrl-P: sh, counter, cat chung pgid'],
    notes: '',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(2),
    report: report(2),
    updatedAt: '2026-11-01T12:00:00Z'
  },
  {
    weekNumber: 3,
    title: 'Xử lý tín hiệu và Ctrl-C / Ctrl-Z',
    subtitle: 'Kernel biến phím bấm thành tín hiệu tác động tới tiến trình như thế nào',
    goals: [
      'Luồng phím bấm → UART / console → tín hiệu → trạng thái tiến trình',
      'Phân biệt kết thúc bởi SIGINT và tạm dừng bởi SIGTSTP',
      'Vì sao stopcheck() chỉ dừng ở điểm an toàn (tránh deadlock)'
    ],
    customReportDate: '2026-11-08',
    status: 'in_progress',
    memberAssignments: {
      'member-1': ['Kiểm chứng Ctrl-C / Ctrl-Z trong consoleintr() và gửi tín hiệu tới fgpgid', 'Chạy test-jobctl.py ctrl, demo counter → Ctrl-Z → Ctrl-P', 'Tổng hợp báo cáo tuần 3'],
      'member-2': ['Phân tích sigdeliver(), ksignal(), stopcheck()', 'SIGINT / SIGTSTP / SIGCONT', 'Chủ trì trình bày tuần 3'],
      'member-3': ['Kiểm chứng fgjob(), waitpid(WUNTRACED), “[1]+ Stopped”', 'Điền Actual Result TC-01, TC-02; Trello + Figma tuần 3']
    },
    deliverables: ['Bảng xử lý từng tín hiệu trong sigdeliver()', 'Kết quả test Ctrl-C / Ctrl-Z', 'Demo counter → Ctrl-Z → Ctrl-P → fg → Ctrl-C'],
    checklist: [
      { id: 'w3-1', text: 'python3 test-jobctl.py ctrl: 4/4 PASS (chạy 07/11)', completed: true, assignedMemberId: 'member-1' },
      { id: 'w3-2', text: 'Demo counter → Ctrl-Z → Ctrl-P → fg → Ctrl-C chạy đúng (07/11)', completed: true, assignedMemberId: 'member-1' },
      { id: 'w3-3', text: 'Ảnh mã nguồn sigdeliver() / stopcheck() (minh chứng b)', completed: false, assignedMemberId: 'member-2' },
      { id: 'w3-4', text: 'Ảnh test + demo (minh chứng c, d)', completed: false, assignedMemberId: 'member-1' },
      { id: 'w3-5', text: 'Trello + Figma tuần 3 (minh chứng a, e)', completed: false, assignedMemberId: 'member-3' },
      { id: 'w3-6', text: 'Nộp báo cáo tuần 3', completed: false, assignedMemberId: 'member-1' }
    ],
    demoScript: ['$ counter', 'counter[4]: 1', 'counter[4]: 2', '^Z', '[1]+ Stopped	counter', '# Ctrl-P → 4 4 stop   counter', '$ fg', 'counter', 'counter[4]: 5', '^C'],
    notes: 'Ở dấu nhắc, shell đọc lệnh ở chế độ Raw nên Ctrl-C chỉ là byte 3 do readline() xử lý, không phải tín hiệu.',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(3),
    report: report(3),
    updatedAt: '2026-11-07T00:00:00Z'
  },
  {
    weekNumber: 4,
    title: 'Hoàn thiện job control: waitpid, jobs, fg, bg, SIGTTIN',
    subtitle: 'Kiểm chứng luồng điều khiển tiền cảnh / nền đầy đủ',
    goals: [
      'waitpid() với WNOHANG, WUNTRACED; mã trạng thái WIFEXITED / WIFSIGNALED / WIFSTOPPED',
      'TIOCGPGRP / TIOCSPGRP, quyền đọc terminal và SIGTTIN',
      'Các lệnh jobs, fg, bg, kill %n và chạy nền bằng &',
      'Phân biệt Process, Process Group và Job'
    ],
    customReportDate: '2026-11-15',
    status: 'not_started',
    memberAssignments: {
      'member-1': ['Kiểm chứng TIOCGPGRP / TIOCSPGRP và nhánh SIGTTIN trong consoleread()', 'Demo cat & → jobs → fg', 'Tổng hợp báo cáo tuần 4'],
      'member-2': ['Phân tích kwaitpid(), WNOHANG, WUNTRACED, wait.h', 'Bảng mã trạng thái'],
      'member-3': ['Kiểm chứng jobs, fg, bg, kill %n, &', 'Demo Ctrl-Z → jobs → bg → fg → Ctrl-C', 'Chủ trì trình bày tuần 4']
    },
    deliverables: ['Bảng mã trạng thái waitpid()', 'Demo vòng đời job', 'Demo SIGTTIN', 'TC-03, TC-04, TC-06 có kết quả'],
    checklist: [
      { id: 'w4-1', text: 'test_ctrl_z_bg_fg, test_ctrl_z_cpu_bound, test_background_read_stops: PASS (chạy thử 07/11)', completed: true, assignedMemberId: 'member-3' },
      { id: 'w4-2', text: 'Ảnh mã nguồn kwaitpid() (minh chứng b)', completed: false, assignedMemberId: 'member-2' },
      { id: 'w4-3', text: 'Ảnh demo vòng đời job (minh chứng c)', completed: false, assignedMemberId: 'member-3' },
      { id: 'w4-4', text: 'Ảnh demo cat & (minh chứng d)', completed: false, assignedMemberId: 'member-1' },
      { id: 'w4-5', text: 'Trello + Figma tuần 4', completed: false, assignedMemberId: 'member-3' },
      { id: 'w4-6', text: 'Nộp báo cáo tuần 4', completed: false, assignedMemberId: 'member-1' }
    ],
    demoScript: ['$ counter', '^Z', '[1]+ Stopped	counter', '$ jobs', '[1]+ Stopped	counter', '$ bg', '[1]+ Running	counter &', '$ fg', 'counter', '^C', '$ cat &', '[1] 5', '$ jobs', '[1]+ Stopped (tty input)	cat', '$ fg', 'cat', 'hello', 'hello'],
    notes: 'Bản nháp báo cáo đã có sẵn; kết quả test là chạy thật ngày 07/11. Ảnh minh chứng chụp trong tuần 4.',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(4),
    report: report(4),
    updatedAt: '2026-11-07T00:00:00Z'
  },
  {
    weekNumber: 5,
    title: 'Pipeline và các trường hợp đặc biệt',
    subtitle: 'Pipeline là một job, tiến trình mồ côi đang dừng, khôi phục chế độ terminal',
    goals: [
      'Vì sao một pipeline phải được điều khiển như một job duy nhất',
      'Nguy cơ deadlock khi tiến trình dừng lúc còn giữ khoá',
      'Xử lý tiến trình mồ côi đang dừng (SIGHUP + SIGCONT)'
    ],
    customReportDate: '2026-11-22',
    status: 'not_started',
    memberAssignments: {
      'member-1': ['Khôi phục chế độ TTY (tmodes, shell_tmodes)', 'Bảng điểm dừng an toàn và khoá được nhả', 'Tổng hợp báo cáo tuần 5'],
      'member-2': ['Dừng cả process group; reparent() gửi SIGHUP + SIGCONT', 'Demo thoát shell khi còn job đang dừng'],
      'member-3': ['Kiểm chứng counter | cat là một job', 'Điền TC-05; chủ trì trình bày tuần 5']
    },
    deliverables: ['Bảng điểm dừng an toàn', 'Demo pipeline là một job', 'Demo tiến trình mồ côi', 'TC-05 có kết quả'],
    checklist: [
      { id: 'w5-1', text: 'test_pipeline_is_one_job, test_exit_with_stopped_job: PASS (chạy thử 07/11)', completed: true, assignedMemberId: 'member-3' },
      { id: 'w5-2', text: 'Ảnh mã nguồn reparent() (minh chứng b)', completed: false, assignedMemberId: 'member-2' },
      { id: 'w5-3', text: 'Ảnh demo counter | cat (minh chứng c)', completed: false, assignedMemberId: 'member-3' },
      { id: 'w5-4', text: 'Ảnh demo thoát shell khi còn job dừng (minh chứng d)', completed: false, assignedMemberId: 'member-2' },
      { id: 'w5-5', text: 'Trello + Figma tuần 5', completed: false, assignedMemberId: 'member-3' },
      { id: 'w5-6', text: 'Nộp báo cáo tuần 5', completed: false, assignedMemberId: 'member-1' }
    ],
    demoScript: ['$ counter | cat', '^Z', '[1]+ Stopped	counter | cat', '# Ctrl-P → 4 4 stop sh / 5 4 stop counter / 6 4 stop cat', '$ fg', '^C', '$ counter | cat', '^Z', '$ exit', '# Ctrl-P → không còn sh, counter, cat của job'],
    notes: 'Bản nháp báo cáo đã có sẵn; kết quả test là chạy thật ngày 07/11. Ảnh minh chứng chụp trong tuần 5.',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(5),
    report: report(5),
    updatedAt: '2026-11-07T00:00:00Z'
  },
  {
    weekNumber: 6,
    title: 'Tính năng mở rộng và kiểm thử',
    subtitle: 'Multi-TTY (Ctrl-T), lịch sử lệnh, line editor và thống kê kiểm thử',
    goals: [
      'Hai terminal ảo dùng chung một UART, chuyển bằng Ctrl-T',
      'Lịch sử lệnh, line editor, phím mũi tên',
      'Chạy 12 test job control và usertests, thống kê pass / fail',
      'Rà soát điểm dừng an toàn, race condition, thứ tự khoá'
    ],
    customReportDate: '2026-11-29',
    status: 'not_started',
    memberAssignments: {
      'member-1': ['Kiểm chứng Multi-TTY: struct tty, obuf, switchtty(), Ctrl-T', 'Chủ trì trình bày tuần 6; tổng hợp báo cáo'],
      'member-2': ['Rà soát điểm dừng an toàn, thứ tự khoá, race', 'Chạy usertests'],
      'member-3': ['Kiểm chứng readline(), history', 'Chạy toàn bộ test-jobctl.py, thống kê pass / fail']
    },
    deliverables: ['Bảng kết quả 12 test', 'Demo Multi-TTY', 'Demo lịch sử lệnh và sửa dòng'],
    checklist: [
      { id: 'w6-1', text: 'test-jobctl.py: 12/12 PASS (chạy thử 07/11)', completed: true, assignedMemberId: 'member-3' },
      { id: 'w6-2', text: 'test-xv6.py -q usertests: ALL TESTS PASSED (chạy thử 07/11)', completed: true, assignedMemberId: 'member-2' },
      { id: 'w6-3', text: 'Ảnh demo Multi-TTY (minh chứng c)', completed: false, assignedMemberId: 'member-1' },
      { id: 'w6-4', text: 'Ảnh demo lịch sử lệnh (minh chứng d)', completed: false, assignedMemberId: 'member-3' },
      { id: 'w6-5', text: 'Trello + Figma tuần 6', completed: false, assignedMemberId: 'member-3' },
      { id: 'w6-6', text: 'Nộp báo cáo tuần 6', completed: false, assignedMemberId: 'member-1' }
    ],
    demoScript: ['# Ctrl-T → [tty1]', '$ counter', '# Ctrl-T → [tty0]: không thấy output của counter', '$ echo on-tty0', '# Ctrl-T → [tty1]: in lại phần output đã giữ', '^C', '$ echo first', '$ echo second', '# ↑ ↑ Enter → chạy lại echo first', '$ history', 'python3 test-jobctl.py   # trên máy host'],
    notes: 'Bản nháp báo cáo đã có sẵn; kết quả test là chạy thật ngày 07/11. Ảnh minh chứng chụp trong tuần 6.',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(6),
    report: report(6),
    updatedAt: '2026-11-07T00:00:00Z'
  },
  {
    weekNumber: 7,
    title: 'Kiểm thử tổng thể và nghiệm thu',
    subtitle: 'Hồi quy, CI, tài liệu, slide, demo và phản biện',
    goals: [
      'Chạy lại toàn bộ kiểm thử job control và kiểm thử tương thích xv6 gốc',
      'Kiểm tra GitHub Actions (clang-format, build Linux / macOS)',
      'Hoàn thiện README, DESIGN, DEMO; slide; luyện demo 5 phút',
      'Tổng hợp giới hạn kỹ thuật và hướng phát triển'
    ],
    customReportDate: '2026-12-06',
    status: 'not_started',
    memberAssignments: {
      'member-1': ['Kiểm tra TTY, Multi-TTY, tích hợp Ctrl-Z đầu-cuối', 'Slide phần TTY; tổng hợp báo cáo cuối kỳ'],
      'member-2': ['usertests đầy đủ, crash test, trạng thái biên Process / Signal', 'Slide phần tín hiệu'],
      'member-3': ['GitHub Actions, tài liệu, kịch bản demo', 'Slide phần shell và kiểm thử']
    },
    deliverables: ['Bản mã nguồn nghiệm thu (tag)', 'Log kiểm thử', 'Báo cáo cuối kỳ, slide, demo'],
    checklist: [
      { id: 'w7-1', text: 'test-xv6.py usertests (đầy đủ): ALL TESTS PASSED (chạy thử 07/11)', completed: true, assignedMemberId: 'member-2' },
      { id: 'w7-2', text: 'test-xv6.py crash: 3/3 OK (chạy thử 07/11)', completed: true, assignedMemberId: 'member-2' },
      { id: 'w7-3', text: 'Kiểm tra GitHub Actions (Ubuntu + macOS)', completed: false, assignedMemberId: 'member-3' },
      { id: 'w7-4', text: 'Slide và luyện demo theo DEMO.md', completed: false, assignedMemberId: 'all' },
      { id: 'w7-5', text: 'Nộp báo cáo tuần 7', completed: false, assignedMemberId: 'member-1' }
    ],
    demoScript: ['make clean && make qemu', '# Làm theo DEMO.md: 1) Ctrl-Z → bg → fg → Ctrl-C  2) pipeline  3) spin  4) SIGTTIN  5) ttydemo  6) Ctrl-T, history', 'python3 test-jobctl.py', 'python3 test-xv6.py usertests'],
    notes: 'Bản nháp báo cáo đã có sẵn; kết quả test là chạy thật ngày 07/11. CI cần kiểm tra trên GitHub.',
    lecturerFeedback: '',
    postReportRequests: [],
    pdfUrl: '',
    slideUrl: '',
    reportFileUrl: reportFile(7),
    report: report(7),
    updatedAt: '2026-11-07T00:00:00Z'
  }
];
