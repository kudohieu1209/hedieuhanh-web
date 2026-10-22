import { DefenseQuestion } from '../types';

export const DEFENSE_QUESTIONS: DefenseQuestion[] = [
  // --- NHÓM 1: KHÁI NIỆM & TỔNG THỂ ---
  {
    id: 'q-1',
    question: 'Cooked, Raw, No-Echo khác nhau thế nào? Chương trình nào cần chế độ Raw?',
    type: 'theory',
    category: 'tty_layer',
    difficulty: 'easy',
    suggestedAnswer: 'Cooked gom cả dòng (read trả về khi có \\n), có echo và sửa dòng. No-Echo giống Cooked nhưng không echo (dùng nhập pass). Raw trả về ngay từng byte, không echo, không sửa dòng, Ctrl-C chỉ là byte 3. Cần Raw: vi, game, và chính Shell khi có Line Editor mũi tên.',
    detailedExplanation: `Trong Cooked (Canonical), kernel lưu ký tự vào buffer và xử lý Backspace, Ctrl-U, Ctrl-W; chỉ khi gõ Enter thì read() mới nhận được dữ liệu; phím Ctrl-C/Z sinh tín hiệu. 
Trong No-Echo, cờ ECHO tắt, ký tự không hiện lên màn hình.
Trong Raw, lflag = 0, read() nhận ngay từng phím; Ctrl-C chỉ là byte ASCII 0x03. 
Chính Shell của nhóm cần Raw Mode để bắt chuỗi escape ESC [ A..D của phím mũi tên và duyệt history.`,
    codeReference: 'kernel/console.c: consoleintr() và consoleread() kiểm tra t->lflag & ICANON/ECHO/ISIG',
    author: 'Nguyễn Tuấn Anh',
    tags: ['TTY', 'ioctl', 'Cooked', 'Raw', 'No-Echo'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-2',
    question: 'Vì sao cần nhóm tiến trình (Process Group - PGID), không gửi tín hiệu ngắt từng tiến trình riêng rẽ?',
    type: 'theory',
    category: 'architecture',
    difficulty: 'medium',
    suggestedAnswer: 'Một lệnh như pipeline `counter | cat` gồm nhiều tiến trình. Khi bấm Ctrl-Z, phải dừng TẤT CẢ cùng lúc. Kernel không biết job là gì, nó chỉ biết PGID. Shell gom các tiến trình của 1 job vào chung 1 nhóm bằng setpgid.',
    detailedExplanation: `Nếu không có PGID, khi bấm Ctrl-Z, hệ thống chỉ biết gửi ngắt cho tiến trình đầu tiên. Lúc đó counter dừng lại còn cat vẫn chạy, hoặc ngược lại, dẫn đến pipe bị treo hoặc rơi vào trạng thái bất định. Bằng cách gán chung 1 pgid cho cả pipeline, ksignal(-fgpgid, SIGTSTP) sẽ duyệt bảng proc và đánh dấu dừng cho toàn bộ tiến trình trong nhóm đồng thời.`,
    codeReference: 'kernel/proc.c: ksignal(int pgid, int sig) kiểm tra p->pgid == -pgid',
    author: 'Mai Duy Hiếu',
    tags: ['Process Group', 'PGID', 'Pipeline', 'Signal'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-3',
    question: 'Tại một thời điểm có bao nhiêu nhóm tiền cảnh? Tiến trình nền đọc bàn phím thì chuyện gì xảy ra?',
    type: 'flow',
    category: 'tty_layer',
    difficulty: 'medium',
    suggestedAnswer: 'Mỗi terminal có đúng 1 nhóm tiền cảnh (t->fgpgid). Tiến trình nền gọi read() sẽ gửi SIGTTIN cho cả nhóm của nó và tự dừng lại. Shell bắt được qua waitpid và báo `[1]+ Stopped (tty input)`. Sau khi người dùng gõ `fg`, nó mới đọc tiếp được.',
    detailedExplanation: `Mỗi struct tty chỉ có một trường fgpgid duy nhất. Khi một tiến trình gọi consoleread(), kernel kiểm tra p->pgid != t->fgpgid. Nếu đúng là tiến trình nền, kernel gửi ksignal(-p->pgid, SIGTTIN) và gọi stopcheck() để tiến trình tự nhường CPU. Nếu tiến trình bỏ qua SIGTTIN thì read trả về -1.`,
    codeReference: 'kernel/console.c: đầu vòng lặp trong hàm consoleread()',
    author: 'Nguyễn Tuấn Anh',
    tags: ['Foreground', 'Background', 'SIGTTIN', 'consoleread'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'confident',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-4',
    question: 'Vì sao tuyệt đối KHÔNG ĐƯỢC NGỦ (sleep) trong hàm consoleintr()?',
    type: 'counter_arg',
    category: 'architecture',
    difficulty: 'hard',
    suggestedAnswer: 'consoleintr() chạy trong ngữ cảnh ngắt phần cứng (interrupt context), không thuộc về bất kỳ tiến trình nào. Nếu gọi sleep(), kernel sẽ "ngủ" nhầm tiến trình đang bị ngắt dở hoặc gây hoảng loạn (panic "sched locks") vì đang giữ spinlock của UART/console.',
    detailedExplanation: `Ngữ cảnh ngắt không có luồng riêng, nó mượn stack và thời gian của tiến trình đang chạy tại thời điểm CPU nhận ngắt. Nếu gọi sleep() ở đây, hệ điều hành sẽ lưu trạng thái ngữ cảnh ngắt vào channel ngủ, làm tê liệt bộ điều phối scheduler. Vì vậy tại consoleintr(), mọi thao tác xử lý phím ngắt Ctrl-C/Ctrl-Z chỉ là "đánh dấu" (ksignal -> sigdeliver) rồi thoát ra ngay.`,
    codeReference: 'kernel/console.c: hàm consoleintr(int c)',
    author: 'Nguyễn Tuấn Anh',
    tags: ['Interrupt Context', 'consoleintr', 'Spinlock', 'Scheduler'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'understood'
    }
  },

  // --- NHÓM 2: KERNEL & SIGNALS ---
  {
    id: 'q-5',
    question: 'Khi nhấn Ctrl-Z lúc `counter` đang chạy, chuyện gì xảy ra, từng bước từ phần cứng đến Shell?',
    type: 'flow',
    category: 'process_signal',
    difficulty: 'hard',
    suggestedAnswer: '1. UART ngắt -> uartintr -> consoleintr(0x1a) in ^Z -> ksignal(-fgpgid, SIGTSTP).\n2. sigdeliver đặt pendstop = SIGTSTP; counter đang ở SLEEPING (sys_pause) chuyển sang RUNNABLE.\n3. counter thức dậy, thấy pendstop -> stopcheck() -> wakeup(parent), state = STOPPED, sched().\n4. Shell chờ trong waitpid(pgid, WUNTRACED) thấy con STOPPED có stopsig -> in `[1]+ Stopped counter` và lấy lại terminal.',
    detailedExplanation: `Đây là câu hỏi toàn diện về chuỗi xử lý tín hiệu. 
Bước 1 xảy ra ở ngắt phần cứng: consoleintr không ngủ, chỉ gọi ksignal duyệt bảng proc và sigdeliver đánh dấu. 
Bước 2: sys_pause() trong xv6 là vòng lặp kiểm tra pendstop. Nhờ sigdeliver chuyển state = RUNNABLE, tiến trình được scheduler chọn chạy tiếp.
Bước 3: counter chạy tới stopcheck(), lấy wait_lock, wakeup Shell, lấy p->lock, đổi state = STOPPED, nhả wait_lock rồi gọi sched().
Bước 4: Shell thức dậy trong kwaitpid, đọc được status (20<<8)|0x7f, in ra màn hình và gọi tcsetpgrp(0, shell_pid).`,
    codeReference: 'kernel/console.c (consoleintr) -> kernel/proc.c (ksignal, sigdeliver, stopcheck, kwaitpid) -> user/sh.c (fgjob)',
    author: 'Mai Duy Hiếu',
    tags: ['Ctrl-Z', 'SIGTSTP', 'stopcheck', 'waitpid', 'Luồng xử lý'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-6',
    question: 'Chương trình `spin.c` chạy vòng lặp vô tận, không bao giờ gọi syscall nào. Làm sao nó có thể bị Ctrl-Z tạm dừng?',
    type: 'edge_case',
    category: 'process_signal',
    difficulty: 'medium',
    suggestedAnswer: 'Nhờ vào NGẮT TIMER (đồng hồ phần cứng). Cứ khoảng 0.1 giây, ngắt timer đưa CPU từ user space vào usertrap(). Ở cuối hàm usertrap(), ngay trước khi quay về user space, có lời gọi stopcheck(). Tại đây tiến trình phát hiện cờ pendstop và tự dừng lại.',
    detailedExplanation: `Một chương trình CPU-bound như \`while(1){}\` không bao giờ chủ động vào kernel bằng syscall. Tuy nhiên, kiến trúc RISC-V luôn có ngắt timer định kỳ. Khi ngắt timer xảy ra, trap.c:usertrap() được kích hoạt để scheduler nhường CPU. Nhóm đã khéo léo đặt lời gọi stopcheck() ngay ở cuối usertrap(). Khi người dùng bấm Ctrl-Z, consoleintr đánh dấu pendstop, và lần ngắt timer kế tiếp sẽ ép spin dừng lại ngay lập tức.`,
    codeReference: 'kernel/trap.c: hàm usertrap() ở dòng gọi stopcheck() trước khi trả về user space',
    author: 'Mai Duy Hiếu',
    tags: ['Timer Interrupt', 'spin.c', 'usertrap', 'CPU-bound'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-7',
    question: 'Vì sao không cho tiến trình kiểm tra và dừng ngay bên trong hàm sleep() gốc của xv6?',
    type: 'counter_arg',
    category: 'process_signal',
    difficulty: 'hard',
    suggestedAnswer: 'Vì có những chỗ gọi sleep() khi ĐANG GIỮ SLEEPLOCK, ví dụ khóa inode (ilock) hoặc khóa log (begin_op) của file system. Nếu dừng tiến trình ở đó, các tiến trình khác muốn đọc/ghi file sẽ bị treo cứng cả hệ thống.',
    detailedExplanation: `Trong thiết kế hệ điều hành, ta chỉ được phép đưa tiến trình vào trạng thái STOPPED tại các "Điểm an toàn" (Safe points) - tức là thời điểm tiến trình không nắm giữ bất kỳ tài nguyên dùng chung hay khóa độc quyền nào. Nếu cho dừng trong sleep(), tiến trình có thể đang giữ khóa buffer disk hoặc inode; khi đó việc dừng lại hàng giờ đồng hồ sẽ khiến toàn bộ hệ thống file bị tê liệt vĩnh viễn (deadlock toàn cục).`,
    codeReference: 'kernel/proc.c: sleep() và stopcheck()',
    author: 'Mai Duy Hiếu',
    tags: ['Safe Point', 'Sleeplock', 'ilock', 'Deadlock'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-8',
    question: 'Trong `stopcheck()`, vì sao phải gọi `wakeup(p->parent)` TRƯỚC rồi mới lấy khóa `p->lock`?',
    type: 'code_reading',
    category: 'process_signal',
    difficulty: 'hard',
    suggestedAnswer: 'Hàm wakeup() cần duyệt và lấy spinlock của mọi tiến trình, kể cả p. Nếu đang giữ p->lock mà gọi wakeup thì sẽ tự khóa chính mình (Self-deadlock). Cha cũng không thể đọc trạng thái con quá sớm vì cha cần wait_lock, mà con đang giữ wait_lock tới khi đặt xong STOPPED.',
    detailedExplanation: `Đây là quy tắc khóa chuẩn xác kế thừa từ hàm kexit() gốc của xv6. Thứ tự:
1. acquire(&wait_lock)
2. wakeup(p->parent) // Báo thức an toàn
3. acquire(&p->lock) // Giờ mới lấy khóa con
4. p->state = STOPPED; p->stopsig = pendstop;
5. release(&wait_lock) // Nhả wait_lock, lúc này cha mới được vào đọc danh sách con
6. sched()`,
    codeReference: 'kernel/proc.c: hàm stopcheck()',
    author: 'Mai Duy Hiếu',
    tags: ['Deadlock', 'Lock Ordering', 'stopcheck', 'wait_lock'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'not_understood'
    }
  },
  {
    id: 'q-9',
    question: 'Có tình huống tương tranh (Race condition) nào giữa việc nhận SIGCONT và việc chuẩn bị dừng trong `stopcheck()` không?',
    type: 'edge_case',
    category: 'process_signal',
    difficulty: 'hard',
    suggestedAnswer: 'Có thể SIGCONT đến sau khi tiến trình thấy pendstop nhưng trước khi nó kịp đặt STOPPED. Lệnh sigdeliver(SIGCONT) sẽ xóa pendstop = 0. Vì vậy trong stopcheck(), sau khi lấy p->lock, ta KIỂM TRA LẠI: if (p->pendstop) mới đặt STOPPED, nếu pendstop đã bị xóa thì hủy dừng.',
    detailedExplanation: `Kỹ thuật này gọi là Double-Checked Locking trên biến pendstop. Khi đang ở giữa usertrap và stopcheck, một lệnh 'fg' hay 'bg' có thể phát ra SIGCONT. Hàm sigdeliver khi nhận SIGCONT sẽ đặt p->pendstop = 0. Nhờ việc stopcheck() kiểm tra lại cờ pendstop khi đã nắm giữ p->lock, nếu phát hiện pendstop == 0, nó sẽ hủy thao tác sched() và tiếp tục chạy bình thường, không bao giờ bị kẹt lại ở STOPPED.`,
    codeReference: 'kernel/proc.c: stopcheck() dòng `if (p->pendstop)`',
    author: 'Mai Duy Hiếu',
    tags: ['Race Condition', 'SIGCONT', 'stopcheck', 'Double Check'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-10',
    question: 'Vì sao hàm `scheduler()` của xv6 không cần chỉnh sửa bất kỳ dòng code nào mà vẫn quản lý được tiến trình STOPPED?',
    type: 'theory',
    category: 'process_signal',
    difficulty: 'easy',
    suggestedAnswer: 'Vì vòng lặp scheduler() gốc của xv6 chỉ kiểm tra điều kiện `if (p->state == RUNNABLE)`. Trạng thái STOPPED là một giá trị enum hoàn toàn khác biệt, do đó bộ điều phối tự động bỏ qua các tiến trình này cho đến khi SIGCONT chuyển chúng về RUNNABLE.',
    detailedExplanation: `enum procstate có các giá trị: UNUSED, USED, SLEEPING, RUNNABLE, RUNNING, ZOMBIE, STOPPED. Trong kernel/proc.c: scheduler(), CPU chạy vòng lặp vô tận duyệt qua bảng proc[NPROC]. Chỉ những tiến trình có p->state == RUNNABLE mới được chọn để switch sang. Tiến trình STOPPED tự nhiên không bao giờ được cấp thời gian thực thi.`,
    codeReference: 'kernel/proc.c: hàm scheduler()',
    author: 'Mai Duy Hiếu',
    tags: ['Scheduler', 'RUNNABLE', 'procstate'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-11',
    question: 'Shell biết một job bị dừng bằng cách nào? Hàm `wait()` cũ của xv6 có làm được việc này không?',
    type: 'theory',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Hàm wait() cũ KHÔNG làm được vì nó chỉ đánh thức khi con trở thành ZOMBIE (chết). Nhóm bổ sung syscall waitpid() với cờ WUNTRACED để báo cả khi con bị STOPPED, và dùng trường stopsig để mỗi lần dừng chỉ báo đúng 1 lần duy nhất.',
    detailedExplanation: `wait() cũ trong xv6 chỉ duyệt con có state == ZOMBIE để giải phóng bộ nhớ và trả về mã exit. Khi tiến trình dừng bởi Ctrl-Z, state của nó là STOPPED. Syscall kwaitpid() mới duyệt thêm điều kiện: if ((options & WUNTRACED) && p->state == STOPPED && p->stopsig > 0), thì đóng gói status mã hóa dạng POSIX ((p->stopsig << 8) | 0x7f), đặt p->stopsig = 0 và trả về pid của con cho Shell.`,
    codeReference: 'kernel/proc.c: hàm kwaitpid()',
    author: 'Trần Đức Dũng',
    tags: ['waitpid', 'WUNTRACED', 'stopsig', 'ZOMBIE'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-12',
    question: 'Trong pipeline `counter | cat`, Shell chỉ đợi tiến trình đầu nhóm. Tiến trình đó đang ngủ trong `wait()` hai con, làm sao nó có thể dừng được?',
    type: 'edge_case',
    category: 'architecture',
    difficulty: 'hard',
    suggestedAnswer: 'Hàm kwaitpid() trong Kernel cũng được thiết kế như một ĐIỂM DỪNG: Trước khi ngủ, nó kiểm tra stoppending. Nếu thiếu điều này, Ctrl-Z sẽ dừng counter và cat nhưng Shell không được báo thức và màn hình sẽ bị đơ hoàn toàn.',
    detailedExplanation: `Khi chạy pipeline, Shell fork ra tiến trình đầu nhóm (sh con), tiến trình này fork tiếp counter và cat rồi gọi wait() chờ 2 con này kết thúc. Khi người dùng bấm Ctrl-Z, cả nhóm nhận SIGTSTP. Nhờ kwaitpid() có kiểm tra p->pendstop trước khi sleep, tiến trình sh con tự gọi stopcheck() và dừng lại, từ đó báo tiếp về cho Shell cha ở ngoài cùng.`,
    codeReference: 'kernel/proc.c: kiểm tra stoppending trong kwaitpid()',
    author: 'Trần Đức Dũng',
    tags: ['Pipeline', 'kwaitpid', 'Safe Point', 'stoppending'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'not_understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-13',
    question: 'Lệnh `kill %1` một job đang dừng: Vì sao Shell dùng SIGKILL mà không dùng SIGINT?',
    type: 'theory',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Theo chuẩn POSIX, với tiến trình đang dừng (STOPPED), tín hiệu SIGINT chỉ được đánh dấu vào cờ killed, còn tiến trình vẫn ĐỨNG YÊN không chạy cho tới khi có SIGCONT. Ngược lại, SIGKILL luôn lập tức đánh thức tiến trình chuyển sang RUNNABLE để nó kết thúc ngay.',
    detailedExplanation: `Xem hàm sigdeliver(): khi sig == SIGKILL, nếu p->state == STOPPED, nó ép p->state = RUNNABLE và p->killed = SIGKILL. Khi scheduler nạp nó, usertrap thấy p->killed liền gọi kexit(). Nếu chỉ gửi SIGINT, tiến trình STOPPED không được đổi sang RUNNABLE, nó vẫn đứng yên ở trạng thái đóng băng mãi mãi.`,
    codeReference: 'kernel/proc.c: hàm sigdeliver() nhánh SIGKILL vs nhánh tín hiệu thường',
    author: 'Trần Đức Dũng',
    tags: ['kill', 'SIGKILL', 'SIGINT', 'POSIX'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-14',
    question: 'Điều gì xảy ra khi Shell thoát (exit) mà vẫn còn job đang ở trạng thái STOPPED?',
    type: 'edge_case',
    category: 'process_signal',
    difficulty: 'hard',
    suggestedAnswer: 'Hàm reparent() bàn giao con cho init (PID 1) và gửi SIGHUP rồi SIGCONT cho các con đang bị dừng, để chúng được scheduler cấp CPU chạy tiếp và tự kết thúc. Nếu thiếu điều này, các tiến trình mồ côi sẽ bị kẹt vĩnh viễn ở STOPPED.',
    detailedExplanation: `Tiến trình init chỉ là một vòng lặp wait() đơn giản, không thể gõ 'fg' để đánh thức tiến trình STOPPED. Do đó nếu chỉ bàn giao cho init mà không đánh thức nó, tiến trình con mồ côi sẽ chiếm giữ slot struct proc mãi mãi. Giải pháp: reparent() gửi SIGHUP (để đánh dấu tự kết thúc) và gửi tiếp SIGCONT (để chuyển state = RUNNABLE thức dậy tự gọi kexit).`,
    codeReference: 'kernel/proc.c: hàm reparent()',
    author: 'Mai Duy Hiếu',
    tags: ['Orphaned Process', 'reparent', 'SIGHUP', 'SIGCONT'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-15',
    question: 'Syscall `ioctl` đi từ ứng dụng User Space xuống thiết bị driver Console như thế nào?',
    type: 'code_reading',
    category: 'tty_layer',
    difficulty: 'medium',
    suggestedAnswer: 'ioctl(fd, req, arg) -> sys_ioctl (lấy struct file từ fd) -> fileioctl (kiểm tra type == FD_DEVICE) -> devsw[major].ioctl(minor, req, arg) -> consoleioctl. Thiết kế tương đồng hoàn toàn với cơ chế của read và write.',
    detailedExplanation: `Đây là thiết kế mở rộng tinh tế của Unix. Trong xv6, bảng devsw[] lưu con trỏ hàm của các driver thiết bị ngoại vi. Nhóm đã thêm trường ioctl vào struct devsw:
\`int (*ioctl)(int minor, int req, uint64 arg);\`. 
Khi user gọi ioctl(), kernel phân giải fd thành struct file, xác nhận là thiết bị ký tự rồi gọi devsw[file->major].ioctl(file->minor, req, arg). Tham số minor cho biết đang tác động vào console (minor 0) hay tty1 (minor 1).`,
    codeReference: 'kernel/sysfile.c: sys_ioctl() -> kernel/file.c: fileioctl() -> kernel/console.c: consoleioctl()',
    author: 'Nguyễn Tuấn Anh',
    tags: ['ioctl', 'devsw', 'FD_DEVICE', 'Architecture'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'confident',
      'member-3': 'understood'
    }
  },

  // --- NHÓM 3: SHELL & KIỂM THỬ ---
  {
    id: 'q-16',
    question: 'Vì sao sau khi fork(), cả tiến trình cha (Shell) và tiến trình con đều cùng phải gọi `setpgid` và `tcsetpgrp`?',
    type: 'counter_arg',
    category: 'shell_jobctl',
    difficulty: 'hard',
    suggestedAnswer: 'Vì không thể biết cha hay con chạy trước (Race condition). Nếu chỉ con gọi, cha có thể gửi tín hiệu tới nhóm chưa kịp tạo. Nếu chỉ cha gọi, con có thể đã exec và đọc bàn phím khi chưa ở tiền cảnh nên bị dính SIGTTIN. Cả hai cùng gọi thì dù ai trước cũng đều chuẩn xác.',
    detailedExplanation: `Sau fork(), scheduler có thể cấp CPU cho cha trước hoặc con trước. 
Trường hợp 1: Con chạy trước, nếu con không tự gán nhóm và chiếm terminal, nó có thể gọi read() và bị kernel phát SIGTTIN vì vẫn đang mang PGID của Shell nền.
Trường hợp 2: Cha chạy trước, nếu cha không gán nhóm cho con, cha có thể gọi ngay tcsetpgrp(0, pid) hoặc waitpid tới một nhóm chưa tồn tại.
Cả hai cùng gọi: Lời gọi thứ hai là idempotent (không gây hại), đảm bảo PGID và Foreground Group luôn được thiết lập trước khi bất kỳ thao tác I/O nào diễn ra.`,
    codeReference: 'user/sh.c: đoạn fork() trong hàm runjob()',
    author: 'Trần Đức Dũng',
    tags: ['Race Condition', 'setpgid', 'tcsetpgrp', 'fork'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-17',
    question: 'Vì sao Shell phải bỏ qua các tín hiệu SIGINT/SIGTSTP/SIGTTIN, còn tiến trình con phải khôi phục về `SIG_DFL`?',
    type: 'theory',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Shell không được phép chết hay dừng khi người dùng bấm Ctrl-C hoặc khi đọc bàn phím. Thuộc tính sigignore được kế thừa qua fork() và exec(), nên nếu tiến trình con không tự đặt lại SIG_DFL thì chương trình con cũng sẽ "miễn nhiễm" với Ctrl-C.',
    detailedExplanation: `Shell là người quản lý terminal. Nếu Shell bị Ctrl-C giết chết thì toàn bộ phiên làm việc của người dùng biến mất. Vì vậy khi khởi động, Shell gọi signal(SIGINT, SIG_IGN)... 
Trong Unix/POSIX, cờ bỏ qua tín hiệu được giữ nguyên qua exec(). Do đó, trước khi gọi runcmd() để exec sang chương trình người dùng (như counter hay grep), tiến trình con bắt buộc phải gọi signal(..., SIG_DFL) để trả lại hành vi mặc định (nhận Ctrl-C thì bị giết, Ctrl-Z thì dừng).`,
    codeReference: 'user/sh.c: main() và runjob()',
    author: 'Trần Đức Dũng',
    tags: ['sigignore', 'SIG_DFL', 'SIG_IGN', 'Shell Lifecycle'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-18',
    question: 'Vì sao Shell phải lưu và khôi phục chế độ terminal (termios) của mỗi job?',
    type: 'flow',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Một chương trình như `ttydemo raw` đổi terminal sang Raw. Khi người dùng bấm Ctrl-Z, terminal vẫn đang ở Raw. Shell phải trả terminal về Cooked cho chính nó dùng, và khi người dùng gõ `fg`, Shell phải phục hồi lại chế độ Raw cho job đó.',
    detailedExplanation: `Mỗi tiến trình có nhu cầu giao tiếp terminal khác nhau (ví dụ vim cần Raw, Shell prompt cần Cooked). Nếu Shell không lưu struct termios của job khi job bị dừng, thì khi fg quay lại, chương trình vim sẽ bị hỏng hiển thị vì terminal đang ở Cooked. Shell lưu termios vào struct job->tmodes và khôi phục bằng tcsetattr(0, &j->tmodes) trong hàm fgjob().`,
    codeReference: 'user/sh.c: hàm fgjob() lưu và nạp j->tmodes',
    author: 'Trần Đức Dũng',
    tags: ['termios', 'fgjob', 'Raw Mode', 'Terminal State'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-19',
    question: 'Line Editor (chỉnh sửa dòng lệnh bằng phím mũi tên) chạy ở Kernel hay Shell? Vì sao?',
    type: 'theory',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Chạy ở SHELL (trong chế độ Raw). Kernel chỉ xử lý sửa dòng thô sơ (Backspace). Phím mũi tên gửi chuỗi ký tự ESC [ A..D, và lịch sử lệnh (history) là dữ liệu của Shell người dùng, không thuộc trách nhiệm của driver terminal. GNU Readline trong Linux cũng làm như vậy.',
    detailedExplanation: `Triết lý Unix là "Giữ kernel càng nhỏ gọn càng tốt". Driver console chỉ cung cấp cơ chế vận chuyển byte. Việc diễn giải chuỗi escape ANSI thành chuyển động con trỏ, chèn ký tự vào bộ đệm và lưu mảng lịch sử lệnh là nghiệp vụ thuần túy của ứng dụng Shell ở tầng User Space.`,
    codeReference: 'user/sh.c: hàm readline() và mảng history[]',
    author: 'Trần Đức Dũng',
    tags: ['Line Editor', 'ANSI Escape', 'GNU Readline', 'User vs Kernel'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-20',
    question: 'Nếu người dùng gõ lệnh `bg` cho một job từng bị dừng vì cố đọc bàn phím (SIGTTIN), chuyện gì sẽ xảy ra?',
    type: 'edge_case',
    category: 'shell_jobctl',
    difficulty: 'medium',
    suggestedAnswer: 'Job đó thức dậy, tiếp tục vòng lặp read(), lại thấy mình vẫn đang ở tiến trình nền, lại kích hoạt SIGTTIN và LẬP TỨC DỪNG LẠI TIẾP. Muốn nó đọc được phím thì bắt buộc phải dùng lệnh `fg`.',
    detailedExplanation: `Lệnh bg chỉ gửi SIGCONT để đánh thức tiến trình nhưng KHÔNG chuyển quyền tiền cảnh (không gọi tcsetpgrp). Vì vậy khi tiến trình quay lại consoleread(), điều kiện p->pgid != t->fgpgid vẫn đúng 100%. Kernel tiếp tục phát SIGTTIN và gọi stopcheck(), Shell lại in [1]+ Stopped (tty input). Đây là hành vi hoàn toàn chuẩn xác theo POSIX.`,
    codeReference: 'kernel/console.c: consoleread() -> user/sh.c: bgjob()',
    author: 'Trần Đức Dũng',
    tags: ['bg', 'SIGTTIN', 'consoleread', 'Edge Case'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-21',
    question: 'QEMU virt chỉ có 1 cổng UART vật lý duy nhất, làm thế nào nhóm triển khai được 2 Terminal độc lập?',
    type: 'theory',
    category: 'architecture',
    difficulty: 'hard',
    suggestedAnswer: 'Nhóm xây dựng mô hình TERMINAL ẢO (Virtual Terminal) trong Kernel, tương tự Alt-F1/Alt-F2 trên Linux: Mảng struct tty tty[2] có buffer và fgpgid riêng; phím Ctrl-T đổi cons.active; output của terminal ẩn được lưu trong obuf (2KB) và in lại khi chuyển tới.',
    detailedExplanation: `Vì phần cứng chỉ có 1 kênh truyền nối tiếp, giải pháp là đa hợp phần mềm (Multiplexing). 
Mỗi terminal có minor riêng: tty[0] (console) và tty[1]. 
init.c mở 2 shell riêng biệt trên minor 0 và minor 1. 
Ký tự gõ vào đi tới tty[cons.active]. 
Khi tiến trình trên terminal ẩn ghi ra màn hình, consolewrite() ghi dữ liệu vào vòng đệm obuf. Khi người dùng bấm Ctrl-T, consoleintr đổi cons.active và tuôn toàn bộ dữ liệu trong obuf ra màn hình.`,
    codeReference: 'kernel/console.c: struct tty tty[NTTY], biến cons.active, xử lý C(\'T\')',
    author: 'Nguyễn Tuấn Anh',
    tags: ['Virtual Terminal', 'Ctrl-T', 'obuf', 'Multiplexing'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'confident',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-22',
    question: 'Những nhược điểm và giới hạn kỹ thuật của cách làm Terminal ảo dùng chung 1 UART là gì?',
    type: 'counter_arg',
    category: 'architecture',
    difficulty: 'medium',
    suggestedAnswer: '1. Không vẽ lại toàn bộ màn hình khi chuyển đổi mà chỉ in lại nội dung đã lưu trong obuf và dòng prompt.\n2. Bộ đệm obuf chỉ có 2 KB, nếu output của terminal ẩn quá dài sẽ bị mất các byte cũ.\n3. Phím Ctrl-T bị Kernel chặn bắt trực tiếp, nên chương trình Raw không nhận được phím này.',
    detailedExplanation: `Để vẽ lại toàn màn hình chuẩn xác như Linux VT, cần một bộ nhớ video frame buffer hoặc giả lập ANSI terminal đầy đủ trong Kernel (rất nặng cho xv6). 
Giới hạn 2KB obuf là sự đánh đổi hợp lý để không tốn RAM kernel stack. 
Việc "nuốt" phím Ctrl-T tương tự như phím Alt-F1 trong Linux console không được gửi tới ứng dụng X11.`,
    codeReference: 'kernel/console.c: obuf[2048] và kiểm tra if (c == C(\'T\'))',
    author: 'Nguyễn Tuấn Anh',
    tags: ['Limitations', 'obuf', 'Virtual Terminal', 'Trade-offs'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'confident',
      'member-3': 'understood'
    }
  },
  {
    id: 'q-23',
    question: 'Làm thế nào để nhóm chứng minh rằng các thay đổi trong mã nguồn không làm hỏng chức năng gốc của xv6?',
    type: 'theory',
    category: 'testing',
    difficulty: 'medium',
    suggestedAnswer: 'Chạy bộ test hồi quy toàn diện `test-xv6.py usertests` cả trước và sau khi chỉnh sửa: Kết quả đều đạt `ALL TESTS PASSED`. Hàm wait() cũ của xv6 vẫn được bảo toàn nguyên vẹn ngữ nghĩa để các test case gốc không bị ảnh hưởng.',
    detailedExplanation: `Bài kiểm thử usertests trong xv6 kiểm tra hàng trăm ca góc cạnh về syscall, bộ nhớ ảo, hệ thống file, pipe và tiến trình. Việc nhóm giữ nguyên hàm wait() cũ (chỉ thêm kwaitpid() mới) và đảm bảo các cờ trạng thái mới không làm sai lệch quy trình giải phóng ZOMBIE là minh chứng rõ ràng nhất cho tính ổn định của kernel.`,
    codeReference: 'test-xv6.py: chạy lệnh `usertests` trong QEMU',
    author: 'Trần Đức Dũng',
    tags: ['usertests', 'Regression Testing', 'xv6 Compatibility'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-24',
    question: 'Script kiểm thử tự động `test-jobctl.py` mô phỏng việc người dùng gõ phím vào QEMU bằng cách nào?',
    type: 'code_reading',
    category: 'testing',
    difficulty: 'medium',
    suggestedAnswer: 'Dùng thư viện Python `pexpect` khởi chạy `make qemu` trong một pseudo-terminal (pty), gửi các byte ký tự thô thật (`\\x03` cho Ctrl-C, `\\x1a` cho Ctrl-Z, `\\x14` cho Ctrl-T, `\\x1b[A` cho mũi tên lên) rồi chờ regex output tương ứng.',
    detailedExplanation: `Thay vì kiểm thử bằng tay dễ sai sót, script test-jobctl.py khởi tạo một tiến trình QEMU qua pexpect.spawn(). Nó gửi từng byte có giãn cách thời gian như người thật gõ, lọc bỏ các chuỗi mã màu ANSI rồi dùng biểu thức chính quy (Regex) để xác nhận chuỗi phản hồi (ví dụ pattern \`\\[1\\]\\+ Stopped\\s+counter\`).`,
    codeReference: 'test-jobctl.py: class XV6, các hàm type(), expect(), expect_none()',
    author: 'Trần Đức Dũng',
    tags: ['pexpect', 'test-jobctl.py', 'Automation', 'keystroke simulation'],
    memberRatings: {
      'member-1': 'understood',
      'member-2': 'understood',
      'member-3': 'confident'
    }
  },
  {
    id: 'q-25',
    question: 'Thầy yêu cầu sửa trực tiếp: "Đổi phím chuyển terminal từ Ctrl-T sang Ctrl-N". Bạn sửa ở file nào và dòng nào?',
    type: 'code_reading',
    category: 'tty_layer',
    difficulty: 'easy',
    suggestedAnswer: 'Mở file `kernel/console.c`, tìm tới hàm `consoleintr(int c)`. Tìm dòng kiểm tra `if (c == C(\'T\'))` và sửa thành `if (c == C(\'N\'))`. Sau đó chạy `make qemu` để kiểm tra.',
    detailedExplanation: `Macro C(x) trong kernel/console.c biến một ký tự thành mã điều khiển (ví dụ C('T') = 'T' - '@' = 0x14; C('N') = 'N' - '@' = 0x0e). Đây là bài tập kinh điển thầy Tiến hay yêu cầu sinh viên sửa trực tiếp tại bàn vấn đáp để kiểm tra xem sinh viên có thực sự tự viết code hay không.`,
    codeReference: 'kernel/console.c: dòng 80 trong consoleintr()',
    author: 'Nguyễn Tuấn Anh',
    tags: ['Live Code', 'Ctrl-T', 'consoleintr', 'Bài tập vấn đáp'],
    memberRatings: {
      'member-1': 'confident',
      'member-2': 'confident',
      'member-3': 'confident'
    }
  }
];
