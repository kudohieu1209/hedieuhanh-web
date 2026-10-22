import { TestCase, BugItem } from '../types';

export const INITIAL_TESTS: TestCase[] = [
  {
    id: 'tc-1',
    suite: 'signals',
    name: 'test_ctrl_c_kills_foreground',
    commandOrFunction: './test-jobctl.py ctrl_c_kills',
    description: 'Chạy counter, nhấn Ctrl-C (\\x03), kiểm tra counter bị giết ngay lập tức và Shell vẫn sống để nhận lệnh tiếp.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:30:00Z',
    executedBy: 'Nguyễn Huy Hoàng',
    outputLog: `test_ctrl_c_kills_foreground        OK
- Spawned xv6 in QEMU (PID 2841)
- Sent command: counter
- Matched output: counter[4]: 2
- Sent keystroke: \\x03 (Ctrl-C)
- Matched output: ^C
- Verified no counter output for 2.5s: PASS
- Sent command: echo still-alive
- Matched output: still-alive`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-2',
    suite: 'job_control',
    name: 'test_ctrl_z_bg_fg',
    commandOrFunction: './test-jobctl.py ctrl_z_bg_fg',
    description: 'Chạy chuỗi kinh điển: Chạy counter -> Ctrl-Z (\\x1a) dừng -> bg chạy ngầm -> jobs kiểm tra -> fg kéo về tiền cảnh -> Ctrl-C ngắt.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:32:00Z',
    executedBy: 'Nguyễn Huy Hoàng',
    outputLog: `test_ctrl_z_bg_fg                   OK
- Sent: counter
- Sent: \\x1a (Ctrl-Z)
- Matched: [1]+ Stopped  counter
- Sent: bg
- Matched: [1]+ Running  counter &
- Matched background tick: counter[4]: 3
- Sent: jobs
- Matched: [1]+ Running  counter
- Sent: fg
- Sent: \\x03 (Ctrl-C)
- Verified job table cleaned up: PASS`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-3',
    suite: 'signals',
    name: 'test_ctrl_z_cpu_bound',
    commandOrFunction: './test-jobctl.py cpu_bound',
    description: 'Kiểm tra spin.c (vòng lặp vô tận không gọi syscall) phải bị dừng thành công thông qua ngắt timer tại usertrap(), sau đó kill %1.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:35:00Z',
    executedBy: 'Mai Duy Hiếu',
    outputLog: `test_ctrl_z_cpu_bound               OK
- Sent: spin
- Slept 1s for CPU load
- Sent: \\x1a (Ctrl-Z)
- Matched: [1]+ Stopped  spin
- Sent: \\x10 (Ctrl-P procdump)
- Matched procdump: 5 5 stop spin
- Sent: kill %1
- Matched: [1]+ Killed  spin`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-4',
    suite: 'job_control',
    name: 'test_background_read_stops',
    commandOrFunction: './test-jobctl.py background_read',
    description: 'Khởi chạy cat & ở chế độ nền. Khi cat gọi read(), kernel phát SIGTTIN ép cat dừng lại. Sau khi fg thì nhập được dữ liệu.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:37:00Z',
    executedBy: 'Nguyễn Tuấn Anh',
    outputLog: `test_background_read_stops          OK
- Sent: cat &
- Matched: [1] 7
- Sent: jobs
- Matched: [1]+ Stopped (tty input)  cat
- Sent: fg
- Typed: hello\\r
- Matched echo: hello
- Sent: \\x04 (Ctrl-D EOF)
- Matched: cat-done`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-5',
    suite: 'pipeline',
    name: 'test_pipeline_is_one_job',
    commandOrFunction: './test-jobctl.py pipeline',
    description: 'Chạy counter | cat. Nhấn Ctrl-Z đảm bảo cả counter và cat cùng thuộc 1 PGID và đều chuyển trạng thái STOPPED. Sau fg, Ctrl-C giết cả hai.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:40:00Z',
    executedBy: 'Nguyễn Huy Hoàng',
    outputLog: `test_pipeline_is_one_job            OK
- Sent: counter | cat
- Sent: \\x1a (Ctrl-Z)
- Matched: [1]+ Stopped  counter | cat
- Sent: \\x10 (Ctrl-P)
- Verified counter pgid == cat pgid: PGID 6 (PASS)
- Sent: fg
- Sent: \\x03 (Ctrl-C)
- Verified both processes killed: PASS`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-6',
    suite: 'tty_modes',
    name: 'test_noecho_mode',
    commandOrFunction: './test-jobctl.py noecho',
    description: 'Chạy ttydemo noecho, gõ mật khẩu bí mật. Kiểm tra chuỗi mật khẩu không bị in lại ra màn hình.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:42:00Z',
    executedBy: 'Nguyễn Tuấn Anh',
    outputLog: `test_noecho_mode                    OK
- Sent: ttydemo noecho
- Matched: password: 
- Typed: secret\\r
- Matched: you typed 6 characters
- Verified 'secret' was NOT echoed: PASS`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-7',
    suite: 'tty_modes',
    name: 'test_raw_mode',
    commandOrFunction: './test-jobctl.py raw',
    description: 'Chạy ttydemo raw, gõ phím ký tự thấy mã nhận ngay lập tức mà không cần nhấn Enter. Nhấn Ctrl-C thấy mã byte 3.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:45:00Z',
    executedBy: 'Nguyễn Tuấn Anh',
    outputLog: `test_raw_mode                       OK
- Sent: ttydemo raw
- Matched: raw mode
- Typed: a
- Matched: key 'a' = 97 (instant return)
- Typed: \\x03 (Ctrl-C)
- Matched: key ^C = 3 (not a signal)
- Typed: q
- Matched: back-to-cooked`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-8',
    suite: 'tty_modes',
    name: 'test_cooked_mode_editing',
    commandOrFunction: './test-jobctl.py cooked',
    description: 'Chạy ttydemo cooked, kiểm tra phím Backspace (\\x7f) xóa lùi ký tự và Ctrl-W (\\x17) xóa nguyên 1 từ.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:47:00Z',
    executedBy: 'Nguyễn Tuấn Anh',
    outputLog: `test_cooked_mode_editing            OK
- Sent: ttydemo cooked
- Typed: abx\\x7fd\\r (backspace erases x)
- Matched read() returned 4 bytes: abd
- Typed: one two\\x17three\\r (Ctrl-W erases two)
- Matched read() returned 10 bytes: one three
- Typed: q\\r`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-9',
    suite: 'line_editor',
    name: 'test_history_and_line_editing',
    commandOrFunction: './test-jobctl.py history',
    description: 'Kiểm tra phím mũi tên lên gọi lại lệnh cũ trong history, mũi tên trái di chuyển con trỏ và chèn ký tự.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:50:00Z',
    executedBy: 'Nguyễn Huy Hoàng',
    outputLog: `test_history_and_line_editing       OK
- Executed: echo first
- Executed: echo second
- Typed: UP + UP + Enter
- Matched executed: first
- Typed: echo hllo + LEFT*3 + e + Enter
- Matched executed: hello
- Typed: history
- Matched: 1  echo first \\n 2  echo second`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-10',
    suite: 'multi_tty',
    name: 'test_second_terminal',
    commandOrFunction: './test-jobctl.py second_terminal',
    description: 'Bấm Ctrl-T (\\x14) chuyển sang tty1, chạy counter; bấm Ctrl-T về tty0 đảm bảo output không bị lem; bấm Ctrl-T lại xem output đã giữ.',
    status: 'pass',
    lastRunAt: '2026-10-21T14:55:00Z',
    executedBy: 'Nguyễn Tuấn Anh',
    outputLog: `test_second_terminal                OK
- Sent: \\x14 (Ctrl-T)
- Matched: [tty1]
- Sent on tty1: counter
- Sent: \\x14 (Ctrl-T back to tty0)
- Matched: [tty0]
- Verified no counter output on tty0: PASS
- Sent: \\x14 (Ctrl-T back to tty1)
- Matched buffered output: counter[4]: 3
- Sent: \\x03 (Ctrl-C)
- Matched: tty1-ok`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-11',
    suite: 'proc_groups',
    name: 'test_exit_with_stopped_job',
    commandOrFunction: './test-jobctl.py exit_stopped',
    description: 'Dừng counter bằng Ctrl-Z, sau đó gõ exit Shell. Kernel phải gửi SIGHUP + SIGCONT trong reparent() để dọn dẹp sạch tiến trình mồ côi.',
    status: 'pass',
    lastRunAt: '2026-10-21T15:00:00Z',
    executedBy: 'Mai Duy Hiếu',
    outputLog: `test_exit_with_stopped_job          OK
- Sent: counter
- Sent: \\x1a (Ctrl-Z)
- Sent: exit
- Matched: init: starting sh on console
- Sent: \\x10 (Ctrl-P)
- Verified counter was reaped: PASS (no orphaned stopped counter in procdump)`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048291'
  },
  {
    id: 'tc-12',
    suite: 'regression',
    name: 'xv6_usertests_all_passed',
    commandOrFunction: './test-xv6.py usertests',
    description: 'Chạy toàn bộ bộ test hồi quy của xv6 gốc (hơn 40 bài kiểm thử filesystem, pipe, memory, fork, exec, wait).',
    status: 'pass',
    lastRunAt: '2026-10-21T15:10:00Z',
    executedBy: 'Mai Duy Hiếu',
    outputLog: `usertests starting
test copyin: OK
test copyout: OK
test sbrkmuch: OK
test kernmem: OK
test forkfork: OK
test bigfile: OK
test dirfile: OK
test iref: OK
test forktest: OK
test bigdir: OK
... (35 more tests) ...
ALL TESTS PASSED`,
    githubActionsUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/actions/runs/1048290'
  }
];

export const INITIAL_BUGS: BugItem[] = [
  {
    id: 'bug-1',
    title: 'Tiến trình mồ côi bị kẹt vĩnh viễn ở trạng thái STOPPED khi Shell thoát',
    description: 'Khi người dùng cho chạy counter, nhấn Ctrl-Z rồi gõ exit Shell; tiến trình counter vẫn nằm yên ở bảng proc với trạng thái STOPPED, chiếm tài nguyên slot tiến trình của xv6.',
    severity: 'critical',
    status: 'resolved',
    assigneeId: 'member-1',
    relatedTestId: 'tc-11',
    stepsToReproduce: '1. Chạy make qemu\n2. Gõ counter -> Ctrl-Z\n3. Gõ exit\n4. Nhấn Ctrl-P thấy counter vẫn tồn tại với state "stop".',
    solutionNote: 'Trong kernel/proc.c: hàm reparent(), kiểm tra nếu con có pp->state == STOPPED thì gửi sigdeliver(pp, SIGHUP) rồi sigdeliver(pp, SIGCONT) để đánh thức nó tự sát.',
    createdAt: '2026-10-15T10:00:00Z',
    resolvedAt: '2026-10-16T16:30:00Z'
  },
  {
    id: 'bug-2',
    title: 'Bộ đệm obuf của tty1 bị tràn khi tiến trình ngầm in quá 2048 bytes',
    description: 'Khi chuyển sang tty0 và để một tiến trình trên tty1 in liên tục dữ liệu dài hơn 2048 bytes, obuf bị tràn và ghi đè làm mất đoạn đầu dữ liệu.',
    severity: 'minor',
    status: 'open',
    assigneeId: 'member-2',
    relatedTestId: 'tc-10',
    stepsToReproduce: '1. Trên tty1 chạy lệnh in văn bản lớn\n2. Bấm Ctrl-T sang tty0 chờ 5 giây\n3. Bấm Ctrl-T lại tty1 thấy một số dòng chữ ban đầu bị cắt cụt.',
    solutionNote: 'Cần nâng kích thước obuf lên 4096 bytes hoặc bổ sung thông báo [truncated...] khi con trỏ ow vượt quá con trỏ or một vòng tròn.',
    createdAt: '2026-10-20T14:00:00Z'
  },
  {
    id: 'bug-3',
    title: 'Phím mũi tên bị in ra mã lạ khi người dùng nhấn quá nhanh trong Line Editor',
    description: 'Do độ trễ đọc từng byte qua syscall read(0, &c, 1), nếu bấm chuỗi mũi tên nhanh, byte 0x1b và ký tự [ bị ngắt quãng, Shell tưởng nhầm là phím ESC đơn độc.',
    severity: 'minor',
    status: 'resolved',
    assigneeId: 'member-3',
    relatedTestId: 'tc-9',
    stepsToReproduce: 'Gõ phím mũi tên trái liên tục cực nhanh trên bàn phím vật lý.',
    solutionNote: 'Đã bổ sung bộ đệm non-blocking timeout ngắn trong hàm read_escape_sequence() của user/sh.c.',
    createdAt: '2026-10-19T09:00:00Z',
    resolvedAt: '2026-10-21T11:00:00Z'
  }
];
