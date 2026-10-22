import { Member } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'member-1',
    name: 'Mai Duy Hiếu',
    studentId: '20223967',
    email: 'hieu.md223967@sis.hust.edu.vn',
    role: 'Process & Signal (Trưởng nhóm)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Chịu trách nhiệm kiến trúc lõi Kernel: Vòng đời tiến trình, bảng trạng thái STOPPED, cơ chế tín hiệu thu nhỏ, đồng bộ khóa tránh deadlock và điều phối waitpid.',
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
    githubUsername: 'kudohieu1209'
  },
  {
    id: 'member-2',
    name: 'Nguyễn Tuấn Anh',
    studentId: '20223988',
    email: 'anh.nt223988@sis.hust.edu.vn',
    role: 'TTY Layer & Device Driver',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Chịu trách nhiệm toàn bộ lớp thiết bị đầu cuối TTY: Driver bàn phím/UART, 3 chế độ terminal qua ioctl, quản lý Foreground Process Group và Terminal ảo thứ hai.',
    focusAreas: [
      'Kiến trúc Terminal, UART và TTY abstraction',
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
    githubUsername: 'tuananh-hust'
  },
  {
    id: 'member-3',
    name: 'Trần Đức Dũng',
    studentId: '20223912',
    email: 'dung.td223912@sis.hust.edu.vn',
    role: 'Shell, Job Control & Testing',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Chịu trách nhiệm xây dựng Shell có Job Control hoàn chỉnh theo chuẩn POSIX/GNU, Line Editor với phím mũi tên & lịch sử lệnh, và toàn bộ hệ thống kiểm thử tự động.',
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
    githubUsername: 'dungtran-hust'
  }
];
