import { KnowledgeTopic } from '../types';

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // ==================== PROCESS & SIGNAL ====================
  {
    id: 'kn-1',
    category: 'process_signal',
    title: 'Trạng thái STOPPED & Mở rộng struct proc',
    shortSummary: 'Cách xv6 bổ sung trạng thái tạm dừng STOPPED vào bảng tiến trình và các cờ trạng thái tín hiệu.',
    explanation: `Trong Unix/Linux, một tiến trình không chỉ có sống (RUNNING/RUNNABLE/SLEEPING) hoặc chết (ZOMBIE/UNUSED), mà còn có thể bị tạm dừng (STOPPED) khi nhận tín hiệu SIGTSTP (Ctrl-Z) hoặc SIGSTOP. 

Khi một tiến trình ở trạng thái STOPPED:
1. Scheduler sẽ tự động bỏ qua nó (vì scheduler của xv6 chỉ duyệt các tiến trình có \`p->state == RUNNABLE\`). Do đó, tiến trình STOPPED không nhận được CPU và hoàn toàn đứng yên.
2. Nó chỉ có thể quay trở lại thực thi khi nhận tín hiệu SIGCONT (từ lệnh \`fg\` hoặc \`bg\`) chuyển trạng thái về \`RUNNABLE\`, hoặc bị tiêu diệt bởi SIGKILL.

Để hỗ trợ điều này, ta mở rộng \`struct proc\` trong \`kernel/proc.h\`:
- \`pgid\`: Nhóm tiến trình (Process Group ID), giúp gửi tín hiệu tới cả nhóm cùng lúc.
- \`pendstop\`: Tín hiệu dừng đang chờ (0 = không có, hoặc SIGTSTP, SIGTTIN, SIGSTOP).
- \`stopsig\`: Tín hiệu đã làm tiến trình dừng, cha CHƯA được báo. Sau khi cha thu thập qua \`waitpid\`, \`stopsig\` được đặt về 0 để mỗi lần dừng chỉ báo đúng 1 lần.
- \`sigignore\`: Bitmask các tín hiệu mà tiến trình này bỏ qua.`,
    terminology: [
      { term: 'STOPPED', definition: 'Trạng thái tiến trình bị đóng băng tạm thời, không được scheduler cấp CPU cho đến khi nhận SIGCONT.' },
      { term: 'PGID', definition: 'Process Group ID: Định danh nhóm tiến trình cùng thuộc về một job của shell hoặc một đường ống pipeline.' },
      { term: 'pendstop', definition: 'Cờ lưu tín hiệu dừng đã phát nhưng tiến trình chưa tới điểm an toàn để dừng.' },
      { term: 'stopsig', definition: 'Lưu tín hiệu dừng để cha đọc qua waitpid, ngăn chặn việc báo lặp nhiều lần.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/proc.h',
      code: `enum procstate { UNUSED, USED, SLEEPING, RUNNABLE, RUNNING, ZOMBIE, STOPPED };

struct proc {
  struct spinlock lock;
  enum procstate state;        // Trạng thái tiến trình
  void *chan;                  // Kênh ngủ
  int killed;                  // 0 hoặc SỐ HIỆU tín hiệu đã giết tiến trình
  int xstate;                  // Mã thoát trả cho cha
  int pid;                     // Process ID

  // === CÁC TRƯỜNG BỔ SUNG CHO TTY & JOB CONTROL ===
  int pgid;                    // Nhóm tiến trình (Process Group ID)
  int pendstop;                // Tín hiệu dừng đang chờ (0 = không)
  int stopsig;                 // Đã dừng vì tín hiệu này, cha CHƯA được báo
  uint sigignore;              // Bitmask các tín hiệu bị bỏ qua
  // ...
};`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/proc.h#L37-L45',
    diagram: `
        fork               scheduler
UNUSED ──────► RUNNABLE ◄──────────────► RUNNING ──── exit ───► ZOMBIE ── wait ──► UNUSED
                  ▲  ▲                     │  │
         wakeup/  │  │ SIGCONT, SIGKILL    │  │ stopcheck() thấy pendstop
         signal   │  └──────────── STOPPED ◄──┘ (Ctrl-Z, SIGTTIN, SIGSTOP)
                  │                            
               SLEEPING ◄── sleep() ─────┘
`,
    prerequisites: ['Vòng đời tiến trình xv6 gốc', 'Cơ chế ngắt và scheduler xv6'],
    selfCheckQuestions: [
      'Tại sao scheduler() của xv6 không cần viết thêm dòng code nào vẫn xử lý được trạng thái STOPPED?',
      'Tại sao trường killed lại được đổi nghĩa từ cờ 0/1 sang số hiệu tín hiệu?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-2',
    category: 'process_signal',
    title: 'Cơ chế Tín hiệu thu nhỏ: Đánh dấu & Điểm dừng an toàn',
    shortSummary: 'Nguyên tắc bất di bất dịch: Tín hiệu chỉ đánh dấu cờ; tiến trình tự dừng hoặc tự kết thúc tại điểm an toàn không giữ khóa.',
    explanation: `Trong hệ điều hành, tín hiệu (Signal) thường đến bất ngờ từ ngắt ngoài (ví dụ gõ Ctrl-C/Z trên bàn phím). 
Hàm xử lý ngắt bàn phím (\`consoleintr\`) chạy trong **ngữ cảnh ngắt (interrupt context)**:
- Không thuộc về bất kỳ tiến trình nào.
- KHÔNG BAO GIỜ được gọi \`sleep()\` hoặc chờ khóa lâu, vì sẽ làm treo toàn bộ CPU!

Do đó, nguyên tắc quan trọng nhất của hệ thống tín hiệu là: **CHỈ ĐÁNH DẤU, ĐỂ TIẾN TRÌNH TỰ HÀNH ĐỘNG**.
- \`sigdeliver()\` chỉ đặt \`p->killed\` (nếu tín hiệu kết thúc như SIGINT) hoặc \`p->pendstop\` (nếu tín hiệu dừng như SIGTSTP).
- Nếu tiến trình đang ngủ (\`p->state == SLEEPING\`), chuyển nó sang \`RUNNABLE\` để nó sớm thức dậy kiểm tra cờ.
- Tiến trình tự kết thúc (\`kexit\`) hoặc tự dừng (\`stopcheck\`) tại một **ĐIỂM AN TOÀN**, tức là thời điểm nó không đang giữ khóa nào (không giữ khóa inode, log file system).

Các điểm an toàn trong xv6:
1. **Ngay trước khi quay về user space trong \`usertrap()\`**: Áp dụng cho các chương trình ngốn CPU như \`spin\` (vòng lặp vô tận). Mỗi lần ngắt timer (100ms), tiến trình rơi vào kernel trap, cuối hàm gọi \`stopcheck()\` và lập tức dừng lại!
2. **Trong các vòng chờ có thể bị ngắt**: \`consoleread\`, \`piperead\`, \`sys_pause\`, \`kwaitpid\`.`,
    terminology: [
      { term: 'sigdeliver()', definition: 'Hàm đánh dấu tín hiệu vào struct proc và đánh thức nếu đang ngủ.' },
      { term: 'Điểm an toàn (Safe Point)', definition: 'Thời điểm tiến trình không giữ sleeplock hoặc spinlock hệ thống file, có thể an toàn nhường CPU.' },
      { term: 'usertrap()', definition: 'Điểm chuyển giao giữa Kernel và User space sau mỗi ngắt hoặc syscall.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/proc.c',
      code: `void sigdeliver(struct proc *p, int sig) {
  acquire(&p->lock);
  if (p->state == ZOMBIE || p->state == UNUSED) {
    release(&p->lock);
    return;
  }
  if (sig == SIGKILL) {
    p->killed = SIGKILL;
    if (p->state == SLEEPING || p->state == STOPPED)
      p->state = RUNNABLE;
  } else if (sig == SIGCONT) {
    p->pendstop = 0;
    if (p->state == STOPPED)
      p->state = RUNNABLE;
  } else if (sig == SIGTSTP || sig == SIGTTIN || sig == SIGSTOP) {
    p->pendstop = sig;
    if (p->state == SLEEPING)
      p->state = RUNNABLE;
  }
  release(&p->lock);
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/proc.c#L63-L75',
    diagram: `
Bàn phím ──UART──► consoleintr() [Ngữ cảnh ngắt]
                     │ (chỉ đánh dấu, KHÔNG ngủ)
                     ▼
                 ksignal(-fgpgid, SIGTSTP)
                     │
                     ▼
          sigdeliver(p, SIGTSTP) ──► p->pendstop = SIGTSTP
                                       (nếu SLEEPING ──► RUNNABLE)
                                             │
      Tiến trình chạy tới điểm an toàn        │
         (usertrap / consoleread)           │
                     │                      │
                     ▼                      │
                 stopcheck() ◄──────────────┘
                     │ (thấy pendstop)
                     ▼
           p->state = STOPPED; sched(); // nhường CPU!
`,
    prerequisites: ['Trạng thái STOPPED', 'Cơ chế ngắt UART và trap trong xv6'],
    selfCheckQuestions: [
      'Tại sao không cho tiến trình dừng ngay trong hàm sleep() gốc của xv6?',
      'Chương trình spin.c không bao giờ gọi syscall nào, làm sao nó có thể bị Ctrl-Z tạm dừng?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-3',
    category: 'process_signal',
    title: 'Hàm stopcheck(): Tránh Deadlock giữa wait_lock và p->lock',
    shortSummary: 'Quy tắc thứ tự lấy khóa chuẩn xác để tránh deadlock khi báo cho cha qua waitpid.',
    explanation: `Khi một tiến trình quyết định dừng trong \`stopcheck()\`, nó cần:
1. Đặt \`p->state = STOPPED\` và lưu \`p->stopsig = p->pendstop\`.
2. Báo thức cho tiến trình cha (\`p->parent\`) đang chờ trong \`waitpid\`.
3. Nhường CPU bằng cách gọi \`sched()\`.

Nếu lập trình bất cẩn, rất dễ gây ra **Deadlock (khóa chết)**:
- Hàm \`wakeup(p->parent)\` cần quét và lấy khóa của tiến trình cha.
- Nhưng tiến trình cha trong \`kwaitpid()\` lại đang giữ \`wait_lock\` và quét qua danh sách con để lấy từng \`child->lock\`.

Để không bao giờ bị Deadlock và đảm bảo cha không đọc trạng thái quá sớm, thứ tự thao tác trong \`stopcheck()\` được thiết kế giống hệt \`kexit()\` gốc của xv6:
1. Lấy \`wait_lock\`.
2. Gọi \`wakeup(p->parent)\` trước.
3. Lấy \`p->lock\`.
4. Kiểm tra lại \`p->pendstop\` (tránh race condition với SIGCONT vừa tới).
5. Đặt \`p->stopsig = p->pendstop\` và \`p->state = STOPPED\`.
6. Nhả \`wait_lock\`.
7. Gọi \`sched()\` để nhường CPU.
8. Sau khi được SIGCONT đánh thức thì nhả \`p->lock\`.`,
    terminology: [
      { term: 'Deadlock', definition: 'Hiện tượng 2 hoặc nhiều tiến trình cùng chờ khóa của nhau mà không bao giờ nhả.' },
      { term: 'wait_lock', definition: 'Khóa bảo vệ mối quan hệ cha-con và điều phối wait/waitpid trong xv6.' },
      { term: 'sched()', definition: 'Hàm chuyển ngữ cảnh sang scheduler thread để chọn tiến trình khác chạy.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/proc.c',
      code: `void stopcheck(void) {
  struct proc *p = myproc();
  if (p->pendstop == 0) return;

  acquire(&wait_lock);
  wakeup(p->parent);       // Báo cha (đang chờ trong waitpid) TRƯỚC
  acquire(&p->lock);
  if (p->pendstop) {       // Kiểm tra lại: có thể SIGCONT đã hủy lệnh dừng
    p->stopsig = p->pendstop;
    p->pendstop = 0;
    p->state = STOPPED;
    release(&wait_lock);
    sched();               // Nhường CPU, "đóng băng" cho tới khi có SIGCONT/SIGKILL
  } else {
    release(&wait_lock);
  }
  release(&p->lock);
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/proc.c#L93-L105',
    diagram: `
+-------------------------------------------------------+
|  Tiến trình con trong stopcheck():                     |
|  1. acquire(&wait_lock)                               |
|  2. wakeup(p->parent)  <-- Báo cha TRƯỚC              |
|  3. acquire(&p->lock)                                 |
|  4. p->state = STOPPED; p->stopsig = pendstop;        |
|  5. release(&wait_lock)                               |
|  6. sched()                                           |
+-------------------------------------------------------+
                          ▲
    Khóa wait_lock bảo vệ: Cha muốn đọc danh sách con trong
    waitpid() PHẢI có wait_lock, nên không thể đọc trước
    khi con đã chuyển STOPPED xong!
`,
    prerequisites: ['Khóa spinlock và wait_lock trong xv6', 'Hàm wakeup và sleep trong proc.c'],
    selfCheckQuestions: [
      'Tại sao phải gọi wakeup(p->parent) trước khi lấy p->lock trong stopcheck()?',
      'Có tình huống race condition nào giữa việc nhận SIGCONT và việc chuẩn bị dừng không?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-4',
    category: 'process_signal',
    title: 'Syscall waitpid() & Các Cờ WUNTRACED, WNOHANG',
    shortSummary: 'Mở rộng cơ chế thu thập trạng thái con: Báo cả khi con dừng và kiểm tra không chặn.',
    explanation: `Trong xv6 gốc, hàm \`wait(int *status)\` chỉ có một chức năng duy nhất: ngủ đợi một tiến trình con bất kỳ kết thúc (\`ZOMBIE\`), thu dọn bộ nhớ và trả về mã exit thô.

Đối với Job Control, Shell cần nhiều hơn thế:
1. **Chờ một nhóm tiến trình cụ thể (\`pid < -1\`) hoặc một pid cụ thể (\`pid > 0\`)**: Vì mỗi job có thể gồm nhiều tiến trình (ví dụ \`counter | cat\`).
2. **Cờ WUNTRACED**: Yêu cầu báo cả khi một tiến trình con bị **TẠM DỪNG (STOPPED)**, không chỉ khi nó chết. Mỗi lần dừng chỉ báo đúng 1 lần (dùng trường \`stopsig\`).
3. **Cờ WNOHANG**: Không chặn (non-blocking). Nếu chưa có con nào thay đổi trạng thái, trả về 0 ngay lập tức. Cờ này cực kỳ quan trọng để Shell quét dọn các job chạy ngầm trước khi hiển thị prompt mà không làm đơ giao diện người dùng.

Mã trạng thái \`status\` được mã hóa tương thích chuẩn POSIX:
- \`WIFEXITED(status)\`: Con kết thúc bình thường qua \`exit()\`.
- \`WIFSIGNALED(status)\`: Con bị giết bởi tín hiệu (Ctrl-C, SIGKILL).
- \`WIFSTOPPED(status)\`: Con bị dừng bởi tín hiệu (Ctrl-Z, SIGTTIN).
- \`WSTOPSIG(status)\`: Số hiệu tín hiệu làm con dừng.`,
    terminology: [
      { term: 'WUNTRACED', definition: 'Cờ của waitpid yêu cầu báo cả trạng thái con bị tạm dừng (STOPPED).' },
      { term: 'WNOHANG', definition: 'Cờ không chặn của waitpid, trả về 0 ngay nếu không có tiến trình con nào đổi trạng thái.' },
      { term: 'wait.h', definition: 'Tệp header định nghĩa các macro kiểm tra mã trạng thái status chuẩn POSIX.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/wait.h',
      code: `#ifndef _WAIT_H_
#define _WAIT_H_

#define WNOHANG    1
#define WUNTRACED  2

#define WIFEXITED(s)    (((s) & 0x7f) == 0)
#define WEXITSTATUS(s)  (((s) >> 8) & 0xff)
#define WIFSIGNALED(s)  (((s) & 0x7f) != 0 && ((s) & 0x7f) != 0x7f)
#define WTERMSIG(s)     ((s) & 0x7f)
#define WIFSTOPPED(s)   (((s) & 0xff) == 0x7f)
#define WSTOPSIG(s)     (((s) >> 8) & 0xff)

#endif`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/wait.h',
    diagram: `
waitpid(pid, &status, options)
      │
      ├── options & WUNTRACED:
      │     Nếu con có state == STOPPED && stopsig > 0:
      │       *status = (stopsig << 8) | 0x7f;
      │       con->stopsig = 0; // Đã báo xong, không báo lại
      │       return con->pid;
      │
      ├── options & WNOHANG:
      │     Nếu duyệt hết con mà không con nào đổi trạng thái:
      │       return 0; // Trả về ngay, không ngủ!
      │
      └── Mặc định (blocking):
            sleep(&wait_lock); // Ngủ chờ con báo thức
`,
    prerequisites: ['Syscall wait gốc trong xv6', 'Trạng thái STOPPED và trường stopsig'],
    selfCheckQuestions: [
      'Tại sao wait() cũ của xv6 không thể dùng cho Job Control?',
      'Làm thế nào để đảm bảo một lần Ctrl-Z chỉ khiến waitpid báo về cho Shell đúng một lần duy nhất?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  },

  // ==================== TTY LAYER ====================
  {
    id: 'kn-5',
    category: 'tty_layer',
    title: 'Kiến trúc TTY: Quầy Lễ Tân và Chiếc Điện Thoại',
    shortSummary: 'Mô hình trực quan: Terminal là chiếc điện thoại công cộng, chỉ nhóm tiền cảnh mới được phép nghe/nói.',
    explanation: `Để hiểu TTY Layer một cách sâu sắc và dễ nhớ, hãy dùng hình ảnh ẩn dụ:
**"Quầy lễ tân khách sạn có 1 chiếc điện thoại (Terminal)"**.
- Nhiều nhóm khách (Process Groups) cùng ngồi chờ trong phòng sảnh.
- Nhưng tại mỗi thời điểm, chỉ **MỘT NHÓM duy nhất đứng trước quầy (Foreground Group)** được cầm ống nghe để nói (đọc phím gõ vào) và nghe (in ra màn hình).
- Lễ tân (Shell) là người quyết định nhóm khách nào được lên quầy bằng lệnh \`fg\` hoặc cho phép nhóm khách làm việc riêng ở phía sau bằng \`bg\`.
- Khi người dùng nhấn phím ngắt như **Ctrl-C** hoặc **Ctrl-Z**, tổng đài viễn thông (Kernel / UART ngắt) sẽ phát tín hiệu tới **CẢ NHÓM đang cầm máy trước quầy (\`t->fgpgid\`)**, tuyệt đối không báo cho lễ tân (Shell) hay các nhóm khách đang ngồi chờ trong góc!

Trong Kernel (\`kernel/console.c\`), \`struct tty\` là cấu trúc lưu trữ trạng thái của chiếc điện thoại đó:
- \`buf[128]\`: Bộ đệm ký tự vào, có con trỏ \`r\` (đã đọc tới), \`w\` (đọc được tới), \`e\` (đang sửa tới).
- \`lflag\`: Chế độ hoạt động (Cooked, Raw, No-Echo).
- \`fgpgid\`: ID của nhóm tiền cảnh đang sở hữu terminal.
- \`obuf[2048]\`: Bộ đệm lưu trữ output của terminal khi nó đang bị ẩn (dùng cho terminal ảo).`,
    terminology: [
      { term: 'Terminal (TTY)', definition: 'Lớp trừu tượng quản lý kênh nhập/xuất ký tự giữa người dùng và các tiến trình.' },
      { term: 'Foreground Process Group (fgpgid)', definition: 'Nhóm tiến trình duy nhất được quyền nhận phím gõ và tín hiệu Ctrl-C/Z từ terminal.' },
      { term: 'UART', definition: 'Universal Asynchronous Receiver-Transmitter: Phần cứng giao tiếp nối tiếp nhận byte thô từ bàn phím.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/console.c',
      code: `struct tty {
  char buf[128]; uint r, w, e;   // r: đã đọc tới, w: đọc được tới, e: đang sửa tới
  int lflag;                     // Cờ chế độ: ECHO | ICANON | ISIG
  int fgpgid;                    // Nhóm tiền cảnh sở hữu terminal, 0 = chưa đặt
  char obuf[2048]; uint or, ow;  // Output buffer khi terminal đang bị ẩn
  char line[128]; int linelen;   // Dòng hiện tại trên màn hình
};

struct tty tty[NTTY];            // Hỗ trợ terminal ảo: tty[0] và tty[1]`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/console.c#L45-L55',
    diagram: `
+---------------------------------------------------------------+
|  BÀN PHÍM ──► UART ngắt ──► consoleintr()                     |
|                                │                               |
|        +───────────────────────┴───────────────────────+       |
|        ▼                                               ▼       |
|  Ctrl-C / Ctrl-Z (nếu ISIG)                    Ký tự thông thường
|  ksignal(-fgpgid, SIGINT/SIGTSTP)             (a, b, Enter, Backspace)
|        │                                               │       |
|        ▼                                               ▼       |
|  Gửi tới cả NHÓM TIỀN CẢNH                    struct tty.buf[128]
|  (Tiến trình con đang chạy)                            │       |
|                                                        ▼       |
|                                               consoleread()   |
|                                                (read syscall)  |
+---------------------------------------------------------------+
`,
    prerequisites: ['Lập trình driver thiết bị UART', 'Khái niệm tiến trình và nhóm tiến trình'],
    selfCheckQuestions: [
      'Tại một thời điểm, có thể có bao nhiêu nhóm tiền cảnh trên một terminal?',
      'Nếu không có khái niệm nhóm tiền cảnh (fgpgid), điều gì sẽ xảy ra khi bấm Ctrl-C?'
    ],
    memberProgress: {
      'member-1': 'understood',
      'member-2': 'ready_to_defend',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-6',
    category: 'tty_layer',
    title: 'Ba Chế Độ Terminal qua ioctl: Cooked, Raw và No-Echo',
    shortSummary: 'Phân biệt chi tiết ICANON, ECHO, ISIG và cách chuyển đổi qua TCSETS/TCGETS.',
    explanation: `Thiết bị đầu cuối có 3 chế độ hoạt động chính, được cấu hình bằng syscall \`ioctl(fd, TCSETS, &termios)\`:

1. **Chế độ Cooked (Chế độ nấu chín / Canonical)**:
   - Cờ \`lflag = ECHO | ICANON | ISIG\`.
   - Kernel tự quản lý việc sửa dòng: Xử lý Backspace, Ctrl-U (xóa dòng), Ctrl-W (xóa một từ).
   - Lệnh \`read()\` chỉ trả về khi người dùng nhấn **Enter (\`\\n\`)** hoặc Ctrl-D (EOF).
   - Các phím Ctrl-C và Ctrl-Z tự động chuyển hóa thành tín hiệu SIGINT và SIGTSTP.
   - Thích hợp cho: Các chương trình dòng lệnh thông thường như \`cat\`, \`grep\`, \`echo\`.

2. **Chế độ No-Echo**:
   - Cờ \`lflag = ICANON | ISIG\` (TẮT cờ \`ECHO\`).
   - Mọi đặc điểm giống Cooked, nhưng Kernel **không in lại ký tự** ra màn hình.
   - Thích hợp cho: Nhập mật khẩu bí mật (như demo \`ttydemo noecho\`).

3. **Chế độ Raw (Chế độ sống / Thô)**:
   - Cờ \`lflag = 0\` (Tắt toàn bộ \`ICANON\`, \`ECHO\`, \`ISIG\`).
   - Mọi byte phím bấm tới chương trình **ngay lập tức** mà không cần đợi phím Enter.
   - Kernel không sửa dòng, không tự echo, và Ctrl-C không phát tín hiệu mà chỉ là byte có mã ASCII \`0x03\`.
   - Thích hợp cho: Trình soạn thảo văn bản (\`vi\`, \`nano\`), trò chơi, và **chính Shell** khi hỗ trợ phím mũi tên điều hướng và lịch sử lệnh.`,
    terminology: [
      { term: 'ICANON', definition: 'Cờ Canonical: gom dòng, chỉ trả về dữ liệu khi có ký tự xuống dòng.' },
      { term: 'ECHO', definition: 'Cờ Echo: tự động in lại ký tự người dùng vừa gõ ra màn hình.' },
      { term: 'ISIG', definition: 'Cờ Input Signal: tự động chuyển đổi phím Ctrl-C thành SIGINT và Ctrl-Z thành SIGTSTP.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/console.c',
      code: `int consoleioctl(int minor, int req, uint64 arg) {
  struct tty *t = &tty[minor];
  struct termios tos;
  if (req == TCGETS) {
    tos.c_lflag = t->lflag;
    return copyout(myproc()->pagetable, arg, (char*)&tos, sizeof(tos));
  } else if (req == TCSETS) {
    if (copyin(myproc()->pagetable, (char*)&tos, arg, sizeof(tos)) < 0)
      return -1;
    acquire(&cons.lock);
    t->lflag = tos.c_lflag;
    release(&cons.lock);
    return 0;
  }
  // TIOCGPGRP & TIOCSPGRP...
  return -1;
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/console.c#L180-L210',
    diagram: `
+-----------------------------------------------------------------------+
| Chế độ     | lflag            | read() trả về khi  | Echo? | Ctrl-C/Z |
+------------+------------------+--------------------+-------+----------+
| Cooked     | ECHO|ICANON|ISIG | Có cả dòng (\\n)   | Có    | Tín hiệu |
| No-Echo    | ICANON|ISIG      | Có cả dòng (\\n)   | Không | Tín hiệu |
| Raw        | 0                | Có ít nhất 1 byte  | Không | Là byte  |
+-----------------------------------------------------------------------+
`,
    prerequisites: ['Syscall ioctl trong hệ điều hành Unix', 'Struct termios'],
    selfCheckQuestions: [
      'Chương trình nào trong dự án bắt buộc phải chạy ở chế độ Raw? Tại sao?',
      'Khi ở chế độ Raw, nếu người dùng bấm Ctrl-C thì chuyện gì xảy ra?'
    ],
    memberProgress: {
      'member-1': 'understood',
      'member-2': 'ready_to_defend',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-7',
    category: 'tty_layer',
    title: 'SIGTTIN: Bảo vệ Đọc Terminal cho Tiến trình Nền',
    shortSummary: 'Ngăn chặn hỗn loạn dữ liệu khi hai tiến trình cùng tranh nhau đọc từ bàn phím.',
    explanation: `Hãy tưởng tượng: Bạn đang chạy Shell (tiền cảnh) và vừa khởi chạy \`cat &\` ở chế độ chạy nền.
Nếu không có cơ chế bảo vệ, cả Shell và \`cat\` sẽ cùng gọi \`read()\` trên cùng một bộ đệm bàn phím! Khi bạn gõ \`ls\\n\`, ký tự \`l\` có thể bị \`cat\` cướp mất, còn chữ \`s\` lại vào Shell, dẫn đến loạn dữ liệu hoàn toàn.

Để giải quyết vấn đề kinh điển này, chuẩn POSIX định nghĩa tín hiệu **SIGTTIN (Signal - TTY Input)**:
1. Trong \`consoleread()\`, trước khi lấy ký tự từ bộ đệm, Kernel kiểm tra:
   \`if (p->pgid != t->fgpgid)\` (tức tiến trình hiện tại không thuộc nhóm tiền cảnh).
2. Nếu điều này xảy ra, Kernel gửi **SIGTTIN** cho cả nhóm của nó (\`ksignal(-p->pgid, SIGTTIN)\`) và ép tiến trình tự dừng (\`stopcheck()\`).
3. Shell ở tiền cảnh nhận được thông báo qua \`waitpid\` và in ra màn hình: \`[1]+ Stopped (tty input) cat\`.
4. Người dùng muốn \`cat\` đọc tiếp thì phải gõ lệnh \`fg 1\` để đưa nó lên làm tiền cảnh (\`t->fgpgid = p->pgid\`). Lúc này \`cat\` được thức dậy và đọc bàn phím hợp lệ!
5. Nếu một tiến trình cố tình bỏ qua SIGTTIN (ví dụ Shell), \`read()\` sẽ trả về \`-1\` thay vì bị treo mãi mãi.`,
    terminology: [
      { term: 'SIGTTIN', definition: 'Tín hiệu gửi cho tiến trình chạy nền khi nó cố đọc dữ liệu từ thiết bị đầu cuối TTY.' },
      { term: 'consoleread()', definition: 'Hàm xử lý syscall read() đối với thiết bị console trong xv6.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/console.c',
      code: `int consoleread(int minor, int user_dst, uint64 dst, int n) {
  struct tty *t = &tty[minor];
  struct proc *p = myproc();
  acquire(&cons.lock);

  while (n > 0) {
    // KIỂM TRA BẢO VỆ TIẾN TRÌNH NỀN
    if (t->fgpgid > 0 && p->pgid != t->fgpgid) {
      if (p->sigignore & (1 << SIGTTIN)) {
        release(&cons.lock);
        return -1; // Bỏ qua SIGTTIN thì báo lỗi
      }
      ksignal(-p->pgid, SIGTTIN);
      release(&cons.lock);
      stopcheck(); // Tự dừng lại ngay tại đây
      acquire(&cons.lock);
      continue;
    }
    // Đọc ký tự từ t->buf...
  }
  release(&cons.lock);
  return target - n;
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/console.c#L125-L145',
    diagram: `
Tiến trình nền (Background) ──► consoleread()
                                    │
                         p->pgid != t->fgpgid?
                                    │
                                  CÓ ▼
                       ksignal(-p->pgid, SIGTTIN)
                                    │
                                    ▼
                               stopcheck() ──► Tiến trình chuyển STOPPED!
                                                    │
                                                    ▼
                                          Shell bắt được qua waitpid:
                                          "[1]+ Stopped (tty input)  cat"
`,
    prerequisites: ['Khái niệm Foreground / Background', 'Cơ chế phát tín hiệu ksignal'],
    selfCheckQuestions: [
      'Tiến trình nền ghi ra màn hình (write) thì có bị dừng lại như khi đọc (read) không?',
      'Nếu sau khi bị Stopped (tty input), người dùng gõ lệnh bg thì chuyện gì sẽ xảy ra?'
    ],
    memberProgress: {
      'member-1': 'understood',
      'member-2': 'ready_to_defend',
      'member-3': 'understood'
    }
  },
  {
    id: 'kn-8',
    category: 'tty_layer',
    title: 'Terminal Ảo Thứ Hai qua 1 UART (Ctrl-T)',
    shortSummary: 'Cách xv6 tận dụng 1 UART vật lý duy nhất của QEMU để cung cấp 2 không gian làm việc độc lập.',
    explanation: `Máy ảo \`virt\` của QEMU RISC-V chỉ có duy nhất **1 cổng UART vật lý**. Làm thế nào để nhóm sinh viên đạt điểm tối đa cho Stretch Goal "Terminal thứ hai"?

Nhóm đã hiện thực hóa giải pháp: **Virtual Terminal (Terminal ảo)**, cơ chế hoạt động tương tự như phím tắt Alt-F1 / Alt-F2 trong Linux:
- Kernel quản lý mảng \`struct tty tty[2]\`: \`tty[0]\` gắn với minor 0 (console), \`tty[1]\` gắn với minor 1 (\`tty1\`).
- Mỗi terminal có buffer vào riêng, chế độ riêng (\`lflag\`) và nhóm tiền cảnh riêng (\`fgpgid\`).
- Biến \`cons.active\` trỏ tới terminal đang hiển thị trên màn hình. Ký tự người dùng gõ trên bàn phím luôn đi vào terminal đang active.
- **Phím chuyển đổi Ctrl-T (0x14)**: Bắt trực tiếp trong \`consoleintr()\`. Khi bấm Ctrl-T, kernel đổi \`cons.active = 1 - cons.active\`, in thông báo \`[ttyN]\`, rồi khôi phục lại dòng lệnh và nội dung đã lưu trong bộ đệm \`obuf\`.
- Tiến trình chạy trên terminal đang bị ẩn vẫn có thể in ra; output của nó được lưu tạm vào \`obuf\` (dung lượng 2 KB) và sẽ tuôn ra khi người dùng chuyển về terminal đó.
- Trong \`user/init.c\`: Kernel khởi chạy 2 Shell độc lập: một Shell trên \`console\` và một Shell trên \`tty1\`.`,
    terminology: [
      { term: 'Terminal ảo (Virtual Terminal)', definition: 'Kỹ thuật đa hợp nhiều terminal phần mềm trên một cổng phần cứng duy nhất.' },
      { term: 'obuf', definition: 'Output Buffer: Bộ đệm vòng tròn lưu tạm dữ liệu in ra của terminal đang bị ẩn.' },
      { term: 'minor number', definition: 'Số hiệu phân biệt các thiết bị cùng loại (minor 0 là console, minor 1 là tty1).' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/console.c',
      code: `// Chuyển terminal ảo bằng Ctrl-T trong consoleintr()
if (c == C('T')) {
  cons.active = (cons.active + 1) % NTTY;
  printf("\\n[tty%d]\\n", cons.active);
  struct tty *t = &tty[cons.active];
  // In lại nội dung đã lưu trong obuf của terminal vừa kích hoạt
  while (t->or != t->ow) {
    uartputc_sync(t->obuf[t->or % sizeof(t->obuf)]);
    t->or++;
  }
  return;
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/console.c#L80-L95',
    diagram: `
                      BÀN PHÍM / UART VẬT LÝ
                                │
                      consoleintr() [Ctrl-T]
                                │
               +────────────────┴────────────────+
               ▼                                 ▼
         cons.active == 0                  cons.active == 1
         +--------------+                  +--------------+
         |    tty[0]    |                  |    tty[1]    |
         | (minor = 0)  |                  | (minor = 1)  |
         | Shell #1     |                  | Shell #2     |
         +--------------+                  +--------------+
`,
    prerequisites: ['Khái niệm major và minor device', 'Cấu trúc mảng tty'],
    selfCheckQuestions: [
      'Hạn chế của giải pháp Terminal ảo dùng chung 1 UART là gì?',
      'Tại sao ký tự Ctrl-T không bao giờ được chuyển tới các chương trình đang chạy ở chế độ Raw?'
    ],
    memberProgress: {
      'member-1': 'understood',
      'member-2': 'ready_to_defend',
      'member-3': 'understood'
    }
  },

  // ==================== SHELL & JOB CONTROL ====================
  {
    id: 'kn-9',
    category: 'shell_jobctl',
    title: 'Kiến trúc Job Control trong Shell & Khắc phục Race Condition',
    shortSummary: 'Quy trình khởi động của Shell, bảng Job, và vì sao cả cha lẫn con cùng phải gọi setpgid().',
    explanation: `Trong Unix/Linux, Shell chịu trách nhiệm quản lý Job Control theo chuẩn GNU/POSIX:

1. **Khởi động Shell**:
   - Nếu \`isatty(0)\` (đang chạy trên terminal thực tế):
   - Shell tự đưa mình vào một nhóm tiến trình riêng bằng \`setpgid(0, 0)\`.
   - Chiếm quyền điều khiển terminal: \`tcsetpgrp(0, getpid())\`.
   - Bỏ qua các tín hiệu ngắt: \`signal(SIGINT, SIG_IGN)\`, \`signal(SIGTSTP, SIG_IGN)\`, \`signal(SIGTTIN, SIG_IGN)\` để Shell không bao giờ bị chết khi người dùng bấm Ctrl-C/Z!
   - Đặt terminal về chế độ Cooked.

2. **Khởi chạy mỗi câu lệnh (1 Job)**:
   - Khi chạy lệnh, Shell gọi \`pid = fork()\`.
   - **CÂU HỎI KINH ĐIỂN CỦA GIẢNG VIÊN**: *"Vì sao cả cha lẫn con đều phải gọi \`setpgid()\` và \`tcsetpgrp()\`?"*
   - **Đáp án**: Vì sau khi \`fork()\`, scheduler có thể cho tiến trình cha chạy trước hoặc tiến trình con chạy trước, ta không thể đoán trước được (**Race condition**):
     - Nếu chỉ con gọi \`setpgid\`, cha có thể chạy trước và gửi tín hiệu tới một nhóm tiến trình chưa kịp hình thành!
     - Nếu chỉ cha gọi \`tcsetpgrp\`, con có thể chạy trước, đã \`exec\` và lập tức đọc bàn phím khi chưa được trao quyền tiền cảnh, dẫn đến bị dính SIGTTIN oan uổng!
     - Giải pháp chuẩn mực: Cả cha lẫn con cùng gọi \`setpgid(pid, pid)\` và \`tcsetpgrp\`. Ai chạy trước hay chạy sau thì kết quả cuối cùng vẫn đồng nhất!

3. **Tiến trình con trước khi \`exec\`**:
   - Phải đặt lại hành vi tín hiệu về mặc định (\`SIG_DFL\`) vì cờ bỏ qua \`sigignore\` bị thừa hưởng qua \`fork\` và \`exec\`.`,
    terminology: [
      { term: 'Job', definition: 'Một câu lệnh hoặc một chuỗi pipeline lệnh được quản lý như một thể thống nhất bởi Shell.' },
      { term: 'Race Condition (Điều kiện tương tranh)', definition: 'Lỗi phát sinh khi kết quả của hệ thống phụ thuộc vào thứ tự thực thi ngẫu nhiên giữa các tiến trình.' },
      { term: 'tcsetpgrp()', definition: 'Hàm trao quyền Foreground Process Group của terminal cho một PGID.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'user/sh.c',
      code: `// Cả cha lẫn con cùng gọi để loại bỏ Race Condition
pid = fork();
if (pid == 0) { // Tiến trình con
  setpgid(0, 0);
  if (foreground) {
    tcsetpgrp(0, getpid());
  }
  // Khôi phục tín hiệu về mặc định cho chương trình con
  signal(SIGINT, SIG_DFL);
  signal(SIGTSTP, SIG_DFL);
  signal(SIGTTIN, SIG_DFL);
  runcmd(cmd);
}

// Tiến trình cha (Shell)
setpgid(pid, pid); // Đồng thời gán nhóm cho con
if (foreground) {
  tcsetpgrp(0, pid);
  fgjob(j, 0);       // Chờ con bằng waitpid(pid, &st, WUNTRACED)
} else {
  printf("[%d] %d\\n", j->id, pid); // Chạy nền (&)
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/user/sh.c#L240-L280',
    diagram: `
               Shell (Cha) ──fork()──► Tiến trình con
                   │                       │
      setpgid(pid, pid)             setpgid(0, 0)
                   │                       │
    tcsetpgrp(0, pid)              tcsetpgrp(0, getpid())
                   │                       │
            +──────┴───────────────────────┴──────+
            | DÙ AI CHẠY TRƯỚC HAY CHẠY SAU:     |
            | Nhóm PGID và Foreground Group      |
            | luôn được xác lập chính xác 100%!  |
            +─────────────────────────────────────+
`,
    prerequisites: ['Syscall fork và exec trong Unix', 'Cơ chế kế thừa thuộc tính tiến trình'],
    selfCheckQuestions: [
      'Tại sao Shell cần phải bỏ qua tín hiệu SIGINT và SIGTSTP?',
      'Tại sao tiến trình con phải gọi signal(..., SIG_DFL) trước khi gọi runcmd()?'
    ],
    memberProgress: {
      'member-1': 'understood',
      'member-2': 'understood',
      'member-3': 'ready_to_defend'
    }
  },
  {
    id: 'kn-10',
    category: 'shell_jobctl',
    title: 'Đồng bộ Dừng Cả Pipeline (counter | cat)',
    shortSummary: 'Cách Shell gom toàn bộ các nhánh của pipeline vào chung 1 nhóm và cơ chế lan truyền tín hiệu.',
    explanation: `Một câu lệnh pipeline như: \`counter | cat\` bao gồm 2 tiến trình độc lập được nối với nhau qua một đường ống (pipe).
Người dùng xem đây là **MỘT JOB DUY NHẤT**. Khi nhấn Ctrl-Z, cả \`counter\` lẫn \`cat\` bắt buộc phải dừng đồng thời!

Nếu xử lý sơ sài:
- \`counter\` dừng nhưng \`cat\` vẫn chạy -> \`cat\` bị treo vĩnh viễn ở \`piperead\`.
- Shell không biết job đang ở trạng thái nào.

Cách giải quyết chuẩn xác trong xv6:
1. Shell gán **cùng một PGID** cho tất cả các tiến trình trong pipeline. PGID này lấy theo PID của tiến trình nhánh đầu tiên.
2. Khi người dùng bấm Ctrl-Z: UART phát tín hiệu \`SIGTSTP\` tới \`-fgpgid\`. Cả \`counter\` và \`cat\` đều nhận được cờ \`pendstop\`.
3. Điểm dừng trong Kernel: Tiến trình đầu nhóm của một pipeline có thể đang ngủ trong \`wait()\` để chờ nhánh con của nó. Do đó, hàm \`kwaitpid()\` trong kernel bắt buộc phải là một điểm dừng an toàn: trước khi ngủ, nó phải kiểm tra \`stoppending\`.
4. Khi cả nhóm dừng, Shell hiển thị: \`[1]+ Stopped  counter | cat\`.
5. Khi người dùng gõ \`fg\`, Shell gửi \`SIGCONT\` tới \`-pgid\`, đánh thức đồng thời toàn bộ pipeline tiếp tục bơm dữ liệu qua pipe!`,
    terminology: [
      { term: 'Pipeline', definition: 'Cơ chế nối stdout của lệnh này vào stdin của lệnh kia thông qua pipe descriptor.' },
      { term: 'Job đơn / Job chuỗi', definition: 'Job bao gồm nhiều tiến trình cùng chia sẻ một PGID và vòng đời.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'user/sh.c',
      code: `// Trong hàm runcmd() khi gặp lệnh PIPE (|)
case PIPE:
  pcmd = (struct pipecmd*)cmd;
  pipe(p);
  if (fork1() == 0) {
    close(1);
    dup(p[1]);
    close(p[0]);
    close(p[1]);
    runcmd(pcmd->left);
  }
  if (fork1() == 0) {
    close(0);
    dup(p[0]);
    close(p[0]);
    close(p[1]);
    runcmd(pcmd->right);
  }
  // Tiến trình cha của pipeline chờ cả 2 con...`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/user/sh.c#L150-L175',
    diagram: `
+-----------------------------------------------------------+
| Shell tạo Job: counter | cat                              |
|                          │                                |
|        +─────────────────┴─────────────────+              |
|        ▼ (PGID = 4)                        ▼ (PGID = 4)   |
|   counter [PID 4]                     cat [PID 5]         |
|   (đang in số mỗi giây)               (đang đọc từ pipe)  |
|        │                                   │              |
|        +─────────────────┬─────────────────+              |
|                          │ (Ctrl-Z: ksignal(-4, SIGTSTP)) |
|                          ▼                                |
|          CẢ HAI TIẾN TRÌNH CÙNG CHUYỂN STOPPED!           |
|          Shell in: "[1]+ Stopped  counter | cat"          |
+-----------------------------------------------------------+
`,
    prerequisites: ['Syscall pipe trong xv6', 'Nhóm tiến trình PGID'],
    selfCheckQuestions: [
      'Tại sao kwaitpid() trong Kernel bắt buộc phải là một điểm kiểm tra stopcheck()?',
      'Khi nhấn Ctrl-C lúc pipeline đang chạy, tín hiệu được gửi tới những tiến trình nào?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'ready_to_defend'
    }
  },
  {
    id: 'kn-11',
    category: 'shell_jobctl',
    title: 'Line Editor và Lịch sử Lệnh (Command History)',
    shortSummary: 'Hiện thực hóa trình sửa dòng phím mũi tên và bộ nhớ lịch sử lệnh trong Shell ở Raw Mode.',
    explanation: `Trong xv6 gốc, người dùng chỉ có thể dùng phím Backspace để xóa lùi ký tự cuối cùng. Không thể di chuyển con trỏ sang trái để sửa lỗi chính tả ở giữa câu lệnh, và không thể bấm mũi tên lên để gọi lại lệnh vừa gõ!

Để đạt điểm tuyệt đối cho Stretch Goal, nhóm đã xây dựng **Line Editor hoàn chỉnh** ngay trong Shell (\`user/sh.c\`):

1. **Vì sao Line Editor phải chạy ở Shell mà không đưa vào Kernel?**
   - Kernel chỉ nên làm những việc tối thiểu ở tầng thấp.
   - Các phím mũi tên gửi chuỗi ký tự ANSI Escape (\`ESC [ A\` là lên, \`ESC [ B\` là xuống, \`ESC [ C\` là phải, \`ESC [ D\` là trái).
   - Bộ nhớ lịch sử lệnh (\`history\`) là tri thức của Shell người dùng, không phải của driver bàn phím. Bash hay Zsh đều đưa thư viện \`readline\` vào user space theo nguyên lý này!

2. **Cách hoạt động**:
   - Khi hiển thị prompt, Shell chuyển terminal sang **Raw Mode** qua \`ioctl(TCSETS)\`.
   - Bắt từng byte: Nếu gặp mã \`0x1b\` (ESC), tiếp tục đọc ký tự tiếp theo để phát hiện phím mũi tên.
   - Quản lý mảng ký tự dòng lệnh \`buf[]\` và vị trí con trỏ \`pos\`:
     - Mũi tên trái/phải: Di chuyển \`pos\` và gửi mã điều khiển con trỏ màn hình \`\\x1b[D\` / \`\\x1b[C\`.
     - Chèn ký tự: Dịch các ký tự phía sau sang phải 1 ô, in lại phần đuôi dòng lệnh và kéo con trỏ về đúng vị trí.
     - Mũi tên lên/xuống: Xóa dòng lệnh hiện tại, nạp dòng lệnh từ mảng \`history[]\` và in ra.`,
    terminology: [
      { term: 'Line Editor', definition: 'Trình biên tập dòng lệnh cho phép di chuyển con trỏ, chèn, xóa và duyệt lịch sử.' },
      { term: 'ANSI Escape Sequence', definition: 'Chuỗi byte bắt đầu bằng mã ESC (0x1b) dùng điều khiển con trỏ và màu sắc terminal.' },
      { term: 'Raw Mode trong Shell', definition: 'Chế độ giúp Shell nhận từng phím bấm tức thì để tự xử lý logic điều hướng.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'user/sh.c',
      code: `// Xử lý phím điều hướng trong readline()
char c;
read(0, &c, 1);
if (c == 0x1b) { // ESC sequence
  char seq[2];
  if (read(0, &seq[0], 1) == 1 && read(0, &seq[1], 1) == 1) {
    if (seq[0] == '[') {
      if (seq[1] == 'A') { // Mũi tên LÊN: Duyệt lịch sử cũ
        history_prev(line, &pos);
      } else if (seq[1] == 'D') { // Mũi tên TRÁI: Dịch con trỏ sang trái
        if (pos > 0) { pos--; printf("\\x1b[D"); }
      }
    }
  }
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/user/sh.c#L350-L410',
    diagram: `
Phím gõ ──► Raw Mode (lflag = 0) ──► read(0, &c, 1)
                                         │
                 +───────────────────────┴───────────────────────+
                 ▼                                               ▼
         Ký tự thông thường                              Mã ESC (0x1b)
      (Chèn vào buf tại pos)                        (Đọc tiếp '[A', '[D'...)
                 │                                               │
                 ▼                                               ▼
       In ra màn hình & vẽ lại                       Điều hướng con trỏ /
        con trỏ đúng tọa độ                             Duyệt history[]
`,
    prerequisites: ['Chế độ Raw của terminal', 'Cơ chế đọc phím từng byte'],
    selfCheckQuestions: [
      'Tại sao không nên triển khai Line Editor bên trong Kernel?',
      'Sau khi người dùng gõ Enter xong dòng lệnh, Shell phải làm gì với chế độ terminal trước khi chạy chương trình con?'
    ],
    memberProgress: {
      'member-1': 'read',
      'member-2': 'understood',
      'member-3': 'ready_to_defend'
    }
  },
  {
    id: 'kn-12',
    category: 'process_signal',
    title: 'Xử lý Tiến trình Mồ côi Bị dừng (Orphaned Stopped Process)',
    shortSummary: 'Vì sao khi Shell thoát, tiến trình con đang dừng phải nhận cả SIGHUP lẫn SIGCONT.',
    explanation: `Một tình huống góc cạnh (Edge Case) rất dễ bị trừ điểm nặng khi bảo vệ đồ án:
**"Điều gì xảy ra nếu Shell kết thúc (\`exit\`) khi vẫn còn một tiến trình con đang ở trạng thái STOPPED?"**

1. **Phân tích vấn đề**:
   - Khi Shell chết, theo quy tắc của xv6, hàm \`reparent()\` sẽ bàn giao các tiến trình con mồ côi này cho tiến trình \`init\` (PID 1).
   - Nhưng \`init\` chỉ là một vòng lặp \`wait()\` đơn giản, nó không có Job Control, không có lệnh \`fg\` hay \`bg\`!
   - Nếu tiến trình con đang ở \`STOPPED\`, nó sẽ đứng yên ở trạng thái đóng băng đó mãi mãi trong bộ nhớ, biến thành **"tiến trình xác ướp mồ côi"** làm rò rỉ tài nguyên hệ điều hành.

2. **Giải pháp chuẩn Unix / POSIX**:
   - Trong hàm \`reparent()\` (\`kernel/proc.c\`), khi bàn giao con cho \`init\`:
   - Nếu phát hiện \`p->state == STOPPED\`:
     1. Gửi tín hiệu **SIGHUP** (Hangup - để tiến trình biết kết nối đã ngắt và chuẩn bị tự sát).
     2. **NGAY SAU ĐÓ gửi tiếp tín hiệu SIGCONT**!
   - **TẠI SAO PHẢI GỬI CẢ HAI?**: Vì nếu chỉ gửi SIGHUP thì cờ kết thúc đã được đánh dấu, nhưng tiến trình vẫn đang "ngủ đông" ở \`STOPPED\` và không bao giờ được scheduler cấp CPU để thực hiện việc tự sát!
   - Gửi thêm SIGCONT sẽ đánh thức nó chuyển sang \`RUNNABLE\`. Khi được scheduler chọn chạy, nó lập tức nhận ra mình đã bị SIGHUP và tự gọi \`kexit()\`. \`init\` sẽ gọi \`wait()\` thu dọn xác ướp sạch sẽ!`,
    terminology: [
      { term: 'Orphaned Process (Tiến trình mồ côi)', definition: 'Tiến trình có cha đã kết thúc trước nó; được hệ điều hành bàn giao lại cho init (PID 1).' },
      { term: 'SIGHUP', definition: 'Signal Hangup: Tín hiệu thông báo terminal điều khiển đã bị đóng.' },
      { term: 'reparent()', definition: 'Hàm bàn giao con mồ côi cho init trong kernel/proc.c.' }
    ],
    codeSnippet: {
      language: 'c',
      filename: 'kernel/proc.c',
      code: `// Trong hàm reparent() khi cha kết thúc
void reparent(struct proc *p) {
  struct proc *pp;
  for (pp = proc; pp < &proc[NPROC]; pp++) {
    if (pp->parent == p) {
      pp->parent = initproc;
      wakeup(initproc);
      // NẾU TIẾN TRÌNH CON ĐANG BỊ DỪNG:
      if (pp->state == STOPPED) {
        sigdeliver(pp, SIGHUP);  // Đánh dấu kết thúc
        sigdeliver(pp, SIGCONT); // ĐÁNH THỨC ĐỂ NÓ CHẠY VÀ TỰ CHẾT!
      }
    }
  }
}`
    },
    githubLink: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/kernel/proc.c#L210-L230',
    diagram: `
Shell (Cha) gọi exit() ──► reparent() bàn giao con cho init
                                │
                      Con đang ở STOPPED?
                                │
                              CÓ ▼
                 1. sigdeliver(con, SIGHUP)  (đánh dấu chết)
                 2. sigdeliver(con, SIGCONT) (chuyển RUNNABLE)
                                │
                                ▼
                       Scheduler cấp CPU
                                │
                                ▼
                   Con thấy đã bị killed/SIGHUP
                                │
                                ▼
                           kexit()
                                │
                                ▼
                       init gọi wait() dọn dẹp!
`,
    prerequisites: ['Syscall exit và hàm reparent trong xv6', 'Cơ chế hoạt động của init (PID 1)'],
    selfCheckQuestions: [
      'Tại sao nếu chỉ gửi SIGHUP mà không gửi SIGCONT thì tiến trình mồ côi vẫn không thoát được?',
      'Kịch bản test tự động nào trong test-jobctl.py kiểm chứng tính năng này?'
    ],
    memberProgress: {
      'member-1': 'ready_to_defend',
      'member-2': 'understood',
      'member-3': 'understood'
    }
  }
];
