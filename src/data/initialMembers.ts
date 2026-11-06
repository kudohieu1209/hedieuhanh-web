import { Member } from '../types';

// Ảnh đại diện là chữ cái đầu tên (không dùng ảnh người lạ).
const avatar = (initials: string, bg: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="${bg}"/>` +
      `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#fff">${initials}</text></svg>`
  );

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'member-1',
    name: 'Mai Duy Hiếu',
    studentId: '20223967',
    email: 'hieu.md223967@sis.hust.edu.vn',
    role: 'TTY Layer & Device Driver (Trưởng nhóm)',
    avatarUrl: avatar('H', '#0284c7'),
    bio: 'Chịu trách nhiệm toàn bộ lớp thiết bị đầu cuối TTY: Driver bàn phím/UART, 3 chế độ terminal qua ioctl, quản lý Foreground Process Group, bảo vệ đọc nền SIGTTIN và Terminal ảo thứ hai qua Ctrl-T.',
    focusAreas: [
      'Kiến trúc Terminal, UART và TTY abstraction layer',
      'Ngữ cảnh ngắt bàn phím trong consoleintr() (không được ngủ)',
      '3 Chế độ: Cooked (ICANON), No-Echo, Raw (chương trình nhận phím thô)',
      'Syscall ioctl() với các request TCGETS, TCSETS, TIOCGPGRP, TIOCSPGRP',
      'Điều khiển Foreground Process Group (fgpgid)',
      'Cơ chế phát tín hiệu Ctrl-C (^C) và Ctrl-Z (^Z) cho cả nhóm tiền cảnh',
      'Bảo vệ đọc terminal ngầm: SIGTTIN trong consoleread()',
      'Terminal ảo thứ hai (NTTY=2) dùng chung 1 UART, đổi phím bằng Ctrl-T'
    ],
    assignedFiles: [
      'kernel/console.c',
      'kernel/termios.h',
      'kernel/file.c',
      'kernel/file.h',
      'kernel/sysfile.c',
      'user/init.c'
    ],
    githubUsername: 'kudohieu1209'
  },
  {
    id: 'member-2',
    name: 'Nguyễn Huy Hoàng',
    studentId: '20227610',
    email: '',
    role: 'Kernel & Signal (Process Management)',
    avatarUrl: avatar('HH', '#7c3aed'),
    bio: 'Chịu trách nhiệm kiến trúc lõi Kernel: Vòng đời tiến trình, bảng trạng thái STOPPED, cơ chế tín hiệu thu nhỏ, đồng bộ khóa tránh deadlock, điều phối waitpid và xử lý tiến trình mồ côi.',
    focusAreas: [
      'Cấu trúc struct proc & bảng tiến trình',
      'Cơ chế tín hiệu thu nhỏ (SIGINT, SIGTSTP, SIGCONT, SIGKILL, SIGTTIN)',
      'Hàm sigdeliver(), ksignal(), kkill()',
      'Điểm dừng an toàn stopcheck() & nhường CPU bằng sched()',
      'Syscall waitpid() với các cờ WUNTRACED và WNOHANG',
      'Đồng bộ tránh Deadlock: acquire(wait_lock) trước wakeup(parent) và acquire(p->lock)',
      'Xử lý tiến trình mồ côi bị dừng (reparenting, SIGHUP + SIGCONT)'
    ],
    assignedFiles: [
      'kernel/proc.c',
      'kernel/proc.h',
      'kernel/trap.c',
      'kernel/sysproc.c',
      'kernel/signal.h',
      'kernel/wait.h'
    ],
  },
  {
    id: 'member-3',
    name: 'Vũ Tuấn Anh',
    studentId: '20223864',
    email: '',
    role: 'Shell, Job Control & Automated Testing',
    avatarUrl: avatar('TA', '#059669'),
    bio: 'Chịu trách nhiệm xây dựng Shell có Job Control hoàn chỉnh theo chuẩn POSIX/GNU, Line Editor với phím mũi tên & lịch sử lệnh, và toàn bộ hệ thống kiểm thử tự động Python pexpect.',
    focusAreas: [
      'Vòng lặp và cấu trúc Job Control trong Shell (user/sh.c)',
      'Các lệnh nội tuyến: jobs, fg, bg, kill %n, history, cd',
      'Giải quyết race condition giữa fork(), setpgid() và tcsetpgrp()',
      'Lưu và phục hồi trạng thái terminal (termios) khi fg/bg',
      'Quản lý nhóm của Pipeline (counter | cat) thành 1 job duy nhất',
      'Line Editor chạy trong raw mode: phím mũi tên, insert, history buffer',
      'Hệ thống automated test đẩy phím bằng Python pexpect (test-jobctl.py)',
      'Kiểm thử hồi quy độ tương thích xv6 (test-xv6.py usertests)'
    ],
    assignedFiles: [
      'user/sh.c',
      'user/ulib.c',
      'user/printf.c',
      'user/kill.c',
      'user/counter.c',
      'user/spin.c',
      'user/ttydemo.c',
      'test-jobctl.py',
      'test-xv6.py'
    ],
  }
];
