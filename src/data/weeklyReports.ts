// Generated from docs/PROGRESS REPORT*.docx by scripts/docx2ts.py; do not edit by hand.
// The .docx files are the official reports; regenerate this file after editing them.
import { WeeklyReport } from '../types';

export const WEEKLY_REPORTS: WeeklyReport[] = [
  {
    "id": "report-w1",
    "weekNumber": 1,
    "reportPeriodFrom": "18/10/2026",
    "reportPeriodTo": "25/10/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "submitted",
    "summaryOfProgress": "Tuần 1 (18/10 – 25/10/2026) là tuần khởi động của đề tài “TTY layer and job control”. Trọng tâm của tuần là hiểu rõ xv6-riscv gốc, phân tích yêu cầu đề bài và thống nhất kiến trúc tổng thể, theo đúng kế hoạch 7 tuần nhóm đã lập. Nhóm đã dựng xong môi trường biên dịch (RISC-V toolchain, QEMU) và khởi động thành công xv6; từ tuần 2, nhóm lần lượt phân tích và kiểm chứng từng phân hệ, mỗi tuần kèm minh chứng chạy thật.\n\nBa thành viên khảo sát song song ba phân hệ của xv6 gốc: vòng đời tiến trình và luồng trap (proc.c, proc.h, trap.c), console và UART (console.c, uart.c), shell (sh.c). Kết quả là danh sách các hạn chế cần giải quyết: xv6 gốc chưa có nhóm tiến trình (pgid), chưa có trạng thái STOPPED, console luôn echo và đệm theo dòng, không có ioctl() và foreground process group, shell không quản lý job. Từ đó nhóm chốt kiến trúc 3 tầng Process & Signal – TTY Layer – Shell, mỗi tầng một người phụ trách, và thống nhất nguyên tắc quan trọng nhất: tín hiệu chỉ được đánh dấu, tiến trình tự dừng tại điểm an toàn khi không giữ khóa.\n\nVề quản lý dự án, nhóm đã lập board Trello, design thinking board trên Figma (Empathize & Define: vấn đề của người dùng; Ideate: kiến trúc 3 tầng) và ma trận kiểm thử 6 test case (TC-01 đến TC-06, trạng thái Pending). Tiến độ bám sát kế hoạch tuần 1; cumulative progress theo lộ trình 7 tuần đạt khoảng 15%. Tuần 2 tập trung vào cấu trúc dữ liệu và system call nền tảng: struct proc, struct tty, ioctl() và bảng job.",
    "technicalActivities": [
      {
        "id": "w1-act-1",
        "name": "Activity 1: Khảo sát vòng đời tiến trình của xv6 gốc (Process & Signal)",
        "description": "Đọc kernel/proc.h, proc.c, trap.c: enum procstate (UNUSED, USED, SLEEPING, RUNNABLE, RUNNING, ZOMBIE), scheduler() chỉ chọn tiến trình RUNNABLE, các luồng fork/exec/wait, và cách cờ p->killed được kiểm tra trong usertrap() trước khi quay về user space. Kết luận: xv6 gốc chưa có khái niệm nhóm tiến trình và trạng thái dừng; muốn hỗ trợ Ctrl-Z cần thêm trạng thái STOPPED và áp dụng cùng kiểu “đánh dấu rồi tự xử lý” như p->killed, để không dừng tiến trình khi nó đang giữ khóa.",
        "outputAndEvidence": ""
      },
      {
        "id": "w1-act-2",
        "name": "Activity 2: Khảo sát console và UART của xv6 gốc (TTY Layer)",
        "description": "Đọc kernel/console.c, uart.c và lần theo đường đi của một ký tự: ngắt UART → consoleintr() → bộ đệm cons.buf (chỉ số r/w/e) → consoleread(). xv6 gốc đã có cooked mode cơ bản (Backspace, Ctrl-U, Ctrl-D, Ctrl-P) nhưng luôn echo và luôn đệm đến hết dòng; Ctrl-C và Ctrl-Z chỉ là ký tự thường; chưa có ioctl() và foreground process group. Điểm cần lưu ý: consoleintr() chạy trong ngữ cảnh ngắt nên không được ngủ, vì vậy chỉ có thể gửi tín hiệu chứ không dừng tiến trình tại chỗ. Nhóm đề xuất mô hình cờ ECHO / ICANON / ISIG theo kiểu termios để biểu diễn 3 chế độ Cooked, No-Echo, Raw.",
        "outputAndEvidence": ""
      },
      {
        "id": "w1-act-3",
        "name": "Activity 3: Khảo sát shell xv6 gốc, lập công cụ quản lý và kế hoạch kiểm thử (Shell & Testing)",
        "description": "Đọc user/sh.c: parsecmd() → runcmd() với các kiểu lệnh EXEC, REDIR, PIPE, LIST, BACK; toán tử & chỉ fork rồi không chờ, shell không lưu lại job nào. Xác định các lệnh nội tại cần có: jobs, fg, bg, kill %n. Thiết lập board Trello, design thinking board trên Figma và ma trận kiểm thử 6 kịch bản bám yêu cầu đề: Ctrl-C, Ctrl-Z, bg, fg, pipeline là một job, tiến trình nền đọc terminal (SIGTTIN).",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Đọc và ghi chú proc.h, proc.c, trap.c; vẽ máy trạng thái tiến trình của xv6 gốc và xác định vị trí của trạng thái STOPPED; liệt kê các trường dự kiến cần có trong struct proc (pgid, pendstop, stopsig) và các tín hiệu tối thiểu (SIGINT, SIGTSTP, SIGCONT).",
        "outputsAchieved": "ghi chú phân tích vòng đời tiến trình và luồng trap, danh sách trường cần bổ sung, thử nghiệm biên dịch định vị (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc console.c, uart.c; vẽ luồng ký tự từ ngắt UART tới consoleread(); lập bảng các phím đặc biệt xv6 gốc đã có và cần bổ sung; đề xuất cờ ECHO / ICANON / ISIG và các request ioctl (TCGETS, TCSETS, TIOCGPGRP, TIOCSPGRP); dựng design thinking board trên Figma; chủ trì trình bày tuần 1.",
        "outputsAchieved": "sơ đồ luồng xử lý console, bảng phím đặc biệt, phác thảo termios.h, Figma board (minh chứng e).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc sh.c (parse, pipeline, lệnh nền &); đề xuất cấu trúc bảng job (job ID, pgid, trạng thái, tên lệnh); lập board Trello và ma trận kiểm thử TC-01 đến TC-06; phác thảo luồng lệnh fg/bg.",
        "outputsAchieved": "board Trello, test matrix (minh chứng d), ghi chú luồng xử lý của sh.c.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Nhóm chốt hướng xử lý chính cho job control: phím Ctrl-C / Ctrl-Z được nhận trong consoleintr() (ngữ cảnh ngắt) → gửi tín hiệu cho cả nhóm tiến trình tiền cảnh của terminal (fgpgid) → tín hiệu chỉ được đánh dấu (killed / pendstop) → tiến trình tự kết thúc hoặc tự chuyển sang STOPPED tại điểm an toàn, ví dụ trước khi quay về user space trong usertrap(). Shell biết job bị dừng thông qua waitpid() với cờ WUNTRACED. Chi tiết sẽ được kiểm chứng ở tuần 3–4.",
      "sourceCodeEnhanced": "Tuần 1 nhóm không sửa logic kernel. Công việc là đọc, ghi chú và định vị các file/hàm sẽ phân tích ở các tuần sau: kernel/proc.h, proc.c, trap.c, sysproc.c (Process & Signal); console.c, file.c, sysfile.c (TTY); user/sh.c, ulib.c (Shell). Ngoài ra có một thử nghiệm biên dịch nhỏ để xác nhận vị trí cần bổ sung trường mới trong struct proc (minh chứng b).",
      "testingResult": "Đã cài RISC-V toolchain và QEMU, biên dịch và khởi động xv6 thành công (minh chứng c). Đã thiết kế ma trận 6 test case TC-01 đến TC-06, hiện ở trạng thái Pending (minh chứng d); cột Actual Result sẽ được điền khi kiểm chứng phân hệ tương ứng từ tuần 3 đến tuần 5. Phương pháp kiểm thử: script test-jobctl.py gõ phím thật từ máy host qua pexpect, và usertests để kiểm tra hồi quy."
    },
    "todo": {
      "remainingIssues": "- xv6 gốc chưa có nhóm tiến trình (pgid) và các system call setpgid() / getpgid().\n- enum procstate chưa có trạng thái STOPPED; wait() không báo được tiến trình con bị dừng.\n- console.c luôn echo và đệm theo dòng; chưa có ioctl() để đổi chế độ (Raw, No-Echo) và chưa có foreground process group.\n- sh.c chưa có bảng job và các lệnh jobs, fg, bg, kill %n.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 2: thiết kế và nền tảng):\n- Task 1 (Hoàng): Phân tích struct proc mở rộng (pgid, STOPPED, pendstop, stopsig), luồng setpgid() / getpgid() và việc fork() kế thừa pgid.\n- Task 2 (Hiếu): Phân tích struct tty và cờ ECHO / ICANON / ISIG; đường đi của ioctl(): sys_ioctl → devsw → consoleioctl với TCGETS / TCSETS; chuẩn bị demo ttydemo ở 3 chế độ.\n- Task 3 (Tuấn Anh): Phân tích và kiểm chứng bảng job trong shell (job ID, pgid, trạng thái, tên lệnh) và các hàm bọc tcsetattr / tcsetpgrp trong ulib.c.\n- Task 4 (Hiếu + Hoàng): Thống nhất giao diện giữa TTY và Process: fgpgid của terminal và hàm gửi tín hiệu theo nhóm.\n- Task 5 (Cả nhóm): Cập nhật Figma (sơ đồ cấu trúc dữ liệu và system call) và Trello tuần 2; Hoàng chủ trì trình bày tuần 2.",
      "milestone": "Kết thúc tuần 2, nhóm giải thích được các cấu trúc dữ liệu mở rộng (struct proc, struct tty) và đường đi của các system call mới, demo được ttydemo ở 3 chế độ Cooked / No-Echo / Raw. Đây là nền tảng để tuần 3 kiểm chứng Ctrl-C / Ctrl-Z và trạng thái STOPPED."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w2",
    "weekNumber": 2,
    "reportPeriodFrom": "25/10/2026",
    "reportPeriodTo": "01/11/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "submitted",
    "summaryOfProgress": "Tuần 2 (25/10 – 01/11/2026) tập trung vào thiết kế và nền tảng: làm rõ các cấu trúc dữ liệu, system call và giao diện nối ba phân hệ Process & Signal – TTY Layer – Shell. Nhóm đối chiếu từng file của xv6 gốc (commit 06aad25) với bản mở rộng trong repository, lần theo đường đi của các system call mới và chạy kiểm chứng trên QEMU.\n\nVề Process, struct proc có thêm trạng thái STOPPED và các trường pgid, pendstop, stopsig, sigignore; pgid được kế thừa qua fork() và đổi bằng setpgid(). Về TTY, mỗi terminal là một struct tty với bộ đệm r/w/e, cờ lflag (ECHO / ICANON / ISIG) và fgpgid; ioctl() đi theo đường sys_ioctl → fileioctl → devsw[CONSOLE].ioctl → consoleioctl với 4 request TCGETS, TCSETS, TIOCGPGRP, TIOCSPGRP. Về Shell, bảng job lưu job ID, pgid, trạng thái và tên lệnh; mỗi lệnh chạy trong một nhóm riêng và shell trao terminal cho job tiền cảnh bằng tcsetpgrp(). Giao diện giữa TTY và Process được thống nhất: terminal chỉ cần biết fgpgid và gọi ksignal(-fgpgid, sig).\n\nMinh chứng tuần này gồm bảng so sánh cấu trúc dữ liệu, ttydemo ở 3 chế độ Cooked / No-Echo / Raw và kết quả Ctrl-P cho thấy các tiến trình của một pipeline có chung pgid. Nhóm cũng ghi nhận các giới hạn của thiết kế, ví dụ setpgid() không kiểm tra nhóm đích, tcsetpgrp() không kiểm tra quyền. Tiến độ bám sát kế hoạch tuần 2; cumulative progress theo lộ trình 7 tuần đạt khoảng 30%. Tuần 3 kiểm chứng xử lý tín hiệu Ctrl-C / Ctrl-Z và trạng thái STOPPED.",
    "technicalActivities": [
      {
        "id": "w2-act-1",
        "name": "Activity 1: Phân tích struct proc mở rộng và Process Group (Process & Signal)",
        "description": "So sánh kernel/proc.h giữa xv6 gốc và bản mở rộng: enum procstate thêm STOPPED; struct proc thêm pgid, pendstop, stopsig, sigignore, còn killed đổi nghĩa từ cờ 0/1 thành số hiệu tín hiệu. Lần theo vòng đời của pgid: allocproc() đặt 0, userinit() cho init pgid = 1, fork() cho con kế thừa pgid của cha, setpgid() đổi nhóm. Đường đi system call: setpgid() ở user → usys.pl (ecall) → syscall() với SYS_setpgid = 26 → sys_setpgid() → ksetpgid(). ksetpgid() chỉ cho đổi nhóm của chính mình hoặc của con trực tiếp, và giữ wait_lock vì phải đọc p->parent. procdump (Ctrl-P) in thêm cột pgid để quan sát.",
        "outputAndEvidence": ""
      },
      {
        "id": "w2-act-2",
        "name": "Activity 2: Phân tích struct tty, 3 chế độ terminal và ioctl() (TTY Layer)",
        "description": "struct cons của xv6 gốc được tách thành mảng struct tty tty[NTTY]; mỗi terminal có bộ đệm r/w/e, lflag và fgpgid riêng. kernel/termios.h định nghĩa 3 cờ ECHO, ICANON, ISIG và 3 chế độ: Cooked = ECHO|ICANON|ISIG, No-Echo = ICANON|ISIG, Raw = 0. ioctl() đi cùng đường với read/write: sys_ioctl → fileioctl → devsw[CONSOLE].ioctl → consoleioctl; vì vậy devsw có thêm con trỏ ioctl và struct file có thêm minor để biết đang làm việc với terminal nào. consoleioctl giữ cons.lock khi đọc/ghi lflag, fgpgid và chép dữ liệu qua either_copyin / either_copyout. fgpgid là cầu nối với phân hệ Process: consoleintr() chỉ cần gửi tín hiệu tới -fgpgid. Phía user có các hàm bọc tcgetattr, tcsetattr, tcgetpgrp, tcsetpgrp, isatty trong ulib.c.",
        "outputAndEvidence": ""
      },
      {
        "id": "w2-act-3",
        "name": "Activity 3: Kiểm chứng thiết kế bảng job trong Shell (Shell & Testing)",
        "description": "Đọc user/sh.c: struct job gồm id, pgid, state (FREE / RUNNING / STOPPED / DONE), status, tmodes và cmd, tối đa 16 job. Khi khởi động, shell tự tạo nhóm riêng (setpgid(0, 0)), giữ terminal bằng tcsetpgrp() và bỏ qua SIGINT / SIGTSTP. Với mỗi lệnh, runjob() fork một tiến trình đầu job; cả cha và con cùng gọi setpgid() để tránh race, rồi addjob() ghi job vào bảng. Job tiền cảnh được trao terminal và shell chờ bằng waitpid() với WUNTRACED. Khi job dừng, shell lưu chế độ terminal của job (tmodes) để khôi phục khi fg.",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Đối chiếu proc.h, proc.c, sysproc.c giữa xv6 gốc và bản mở rộng; vẽ vòng đời pgid và đường đi system call setpgid / getpgid; dùng Ctrl-P quan sát pgid của pipeline; chủ trì trình bày tuần 2.",
        "outputsAchieved": "bảng so sánh struct proc và ảnh mã nguồn (minh chứng b), sơ đồ đường đi setpgid(), minh chứng d.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc console.c, termios.h, file.c, sysfile.c; vẽ đường đi ioctl() từ user tới consoleioctl(); lập bảng 3 chế độ Cooked / No-Echo / Raw; chạy ttydemo kiểm chứng; tổng hợp báo cáo tuần 2.",
        "outputsAchieved": "bảng so sánh struct tty (minh chứng b), minh chứng c.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc sh.c (struct job, addjob, runjob, fgjob) và các hàm bọc trong ulib.c; xác nhận cách shell tạo nhóm và trao terminal cho job; cập nhật Trello tuần 2; vẽ sơ đồ đường đi ioctl() / setpgid() trên Figma; chuẩn bị kịch bản kiểm thử Ctrl-C / Ctrl-Z cho tuần 3.",
        "outputsAchieved": "ghi chú thiết kế bảng job, board Trello (minh chứng a), sơ đồ Figma tuần 2 (minh chứng e).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Mô hình nhóm tiến trình và nhóm tiền cảnh: mỗi dòng lệnh shell là một job, chạy trong một process group riêng có pgid = pid của tiến trình đầu job; các tiến trình con (ví dụ hai đầu của pipe) kế thừa pgid qua fork(). Mỗi terminal giữ một fgpgid; khi người dùng gõ Ctrl-C / Ctrl-Z, kernel chỉ cần gửi tín hiệu tới -fgpgid là trúng cả job tiền cảnh, không trúng shell và các job nền. Để tránh race sau fork(), cả shell và tiến trình con đều gọi setpgid(), ai chạy trước cũng cho cùng kết quả. ioctl() đi qua bảng devsw giống read/write nên phần chung (sys_ioctl, fileioctl) không phụ thuộc thiết bị. Khi TCSETS tắt ICANON, phần dòng đang gõ dở được chuyển thành dữ liệu đọc được (w = e) để không bị mất.",
      "sourceCodeEnhanced": "Tuần 2 nhóm không viết thêm chức năng mà rà soát phần nền tảng của bản mở rộng, đối chiếu với xv6 gốc theo từng file: kernel/proc.h, proc.c, sysproc.c (STOPPED, pgid, ksetpgid, kgetpgid); kernel/termios.h (mới), console.c (struct tty, consoleioctl); file.h, file.c, sysfile.c (devsw.ioctl, fileioctl, sys_ioctl); syscall.h, syscall.c, usys.pl (6 system call mới, số 23–28); user/ulib.c (5 hàm bọc), user/sh.c (bảng job), user/ttydemo.c.",
      "testingResult": "Kiểm chứng trên QEMU (Ubuntu): (1) ttydemo ở 3 chế độ Cooked / No-Echo / Raw (minh chứng c); (2) quan sát pgid bằng Ctrl-P khi chạy pipeline counter | cat (minh chứng d). Kết quả: (1) ttydemo PASS cả 3 chế độ, kết quả khớp mong đợi; (2) quan sát pgid PASS: sh đầu job (pid 4), counter (pid 5) và cat (pid 6) có chung pgid 4, khác nhóm của shell (pgid 2). Ma trận TC-01 đến TC-06 vẫn ở trạng thái Pending; các test case Ctrl-C / Ctrl-Z sẽ chạy ở tuần 3."
    },
    "todo": {
      "remainingIssues": "- setpgid() không kiểm tra nhóm đích có tồn tại; xv6 chưa có khái niệm session như POSIX.\n- TIOCSPGRP (tcsetpgrp()) không kiểm tra người gọi có đang ở tiền cảnh; tiến trình nền vẫn ghi được ra terminal (chưa dùng SIGTTOU).\n- struct termios mới chỉ có lflag, chưa có mảng ký tự điều khiển (c_cc) nên không đổi được phím Ctrl-C / Ctrl-Z.\n- Bảng job cố định 16 phần tử, tên lệnh lưu tối đa 100 ký tự.\n- Chưa kiểm chứng việc gửi tín hiệu Ctrl-C / Ctrl-Z và trạng thái STOPPED (kế hoạch tuần 3).",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 3: tín hiệu và Ctrl-C / Ctrl-Z):\n- Task 1 (Hoàng): Phân tích và kiểm chứng ksignal(), sigdeliver(), stopcheck(); phân biệt SIGINT (kết thúc), SIGTSTP (dừng) và SIGCONT (chạy tiếp); chủ trì trình bày tuần 3.\n- Task 2 (Hiếu): Kiểm chứng nhánh ISIG trong consoleintr(): Ctrl-C / Ctrl-Z bỏ dòng đang gõ, in ^C / ^Z và gửi tín hiệu tới nhóm tiền cảnh bằng ksignal(-fgpgid, ...).\n- Task 3 (Tuấn Anh): Kiểm chứng shell với job tiền cảnh: fgjob(), waitpid() với WUNTRACED, thông báo “[1]+ Stopped”; chạy các test case Ctrl-C / Ctrl-Z và điền Actual Result.\n- Task 4 (Hiếu + Hoàng): Demo counter → Ctrl-Z → Ctrl-P thấy trạng thái stop; giải thích vì sao dừng tại điểm an toàn stopcheck() giúp tránh deadlock.\n- Task 5 (Cả nhóm): Cập nhật Figma (luồng phím → tín hiệu → trạng thái tiến trình) và Trello tuần 3.",
      "milestone": "Kết thúc tuần 3, nhóm giải thích và demo được luồng phím bấm → UART/console → tín hiệu → trạng thái tiến trình: Ctrl-C kết thúc job tiền cảnh, Ctrl-Z đưa job sang STOPPED (quan sát bằng Ctrl-P), các test case Ctrl-C / Ctrl-Z có kết quả thật. Đây là nền tảng để tuần 4 kiểm chứng jobs / fg / bg."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w3",
    "weekNumber": 3,
    "reportPeriodFrom": "01/11/2026",
    "reportPeriodTo": "08/11/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "draft",
    "summaryOfProgress": "Tuần 3 (01/11 – 08/11/2026) tập trung vào xử lý tín hiệu: làm rõ cách kernel biến phím Ctrl-C / Ctrl-Z thành tín hiệu tác động tới cả job tiền cảnh, và cách tiến trình dừng / chạy tiếp mà không gây deadlock. Nhóm lần theo luồng phím bấm → ngắt UART → consoleintr() → ksignal(-fgpgid, sig) → sigdeliver() → trạng thái tiến trình → shell, đọc mã ở cả ba phân hệ và chạy kiểm chứng trên QEMU.\n\nNguyên tắc chính đã được kiểm chứng trong mã: tín hiệu chỉ được đánh dấu, tiến trình tự xử lý tại điểm an toàn. sigdeliver() ghi SIGINT vào p->killed và SIGTSTP vào p->pendstop; tiến trình tự kết thúc bằng kexit(), hoặc tự chuyển sang STOPPED trong stopcheck() khi sắp quay về user space hay khi đang chờ ở console, pipe, pause(), waitpid(), tức là lúc không giữ khoá nào. SIGCONT đưa tiến trình STOPPED về RUNNABLE. Phía shell, fgjob() chờ bằng waitpid(..., WUNTRACED) nên biết cả khi job bị dừng và in “[1]+ Stopped”. Ở dấu nhắc, shell đọc lệnh ở chế độ Raw nên Ctrl-C chỉ là một byte, line editor của shell bỏ dòng đang gõ chứ không sinh tín hiệu.\n\nKết quả kiểm thử: 4/4 test Ctrl-C / Ctrl-Z trong test-jobctl.py PASS; demo counter → Ctrl-Z → Ctrl-P cho thấy counter ở trạng thái stop, fg chạy tiếp đúng số đếm, Ctrl-C kết thúc job. Nhóm cũng ghi nhận các giới hạn, ví dụ chưa có signal handler ở user space, tín hiệu kết thúc gửi tới tiến trình đang dừng chỉ có hiệu lực sau SIGCONT. Tiến độ bám sát kế hoạch tuần 3; cumulative progress theo lộ trình 7 tuần đạt khoảng 45%. Tuần 4 kiểm chứng jobs / fg / bg / kill %n và waitpid() với WNOHANG / WUNTRACED.",
    "technicalActivities": [
      {
        "id": "w3-act-1",
        "name": "Activity 1: Phân tích sigdeliver(), ksignal() và stopcheck() (Process & Signal)",
        "description": "kernel/signal.h đánh số tín hiệu theo Linux (SIGINT 2, SIGKILL 9, SIGCONT 18, SIGSTOP 19, SIGTSTP 20, SIGTTIN 21) và chỉ có 2 cách xử lý: SIG_DFL hoặc SIG_IGN. ksignal(pid, sig) với pid < 0 duyệt bảng proc, lấy p->lock của từng tiến trình có pgid = -pid (trừ init) rồi gọi sigdeliver(). sigdeliver() chỉ đánh dấu, không dừng hay huỷ tiến trình tại chỗ: SIGKILL ghi killed và đánh thức cả tiến trình đang STOPPED; SIGCONT huỷ pendstop và đưa STOPPED về RUNNABLE; tín hiệu nằm trong bitmask sigignore thì bỏ, trừ SIGKILL / SIGSTOP / SIGCONT; tín hiệu dừng ghi vào pendstop; các tín hiệu còn lại ghi vào killed. usertrap() gọi stopcheck() trước khi quay về user space: nếu có pendstop thì ghi stopsig, đặt state = STOPPED, đánh thức cha đang chờ trong waitpid() và gọi sched(). Scheduler chỉ chạy tiến trình RUNNABLE nên tiến trình nằm yên đến khi có SIGCONT hoặc SIGKILL; khi chạy tiếp, usertrap() kiểm tra killed thêm một lần.",
        "outputAndEvidence": ""
      },
      {
        "id": "w3-act-2",
        "name": "Activity 2: Kiểm chứng Ctrl-C / Ctrl-Z trong consoleintr() (TTY Layer)",
        "description": "consoleintr() chạy trong ngữ cảnh ngắt UART và giữ cons.lock. Khi cờ ISIG bật và phím là Ctrl-C (0x03) hoặc Ctrl-Z (0x1A): bỏ dòng đang gõ dở (e = w), nếu có ECHO thì in ^C / ^Z, rồi gọi ksignal(-fgpgid, SIGINT hoặc SIGTSTP) cho cả nhóm tiền cảnh của terminal đang hiển thị. Ngắt không được ngủ nên ở đây chỉ gửi (đánh dấu) tín hiệu. Khi ISIG tắt (chế độ Raw), hai phím này vào bộ đệm như byte thường (đã thấy ở tuần 2: key ^C = 3). consoleread() cũng là một điểm an toàn: tiến trình đang chờ nhập mà bị Ctrl-Z sẽ nhả cons.lock, gọi stopcheck(), sau SIGCONT thì quay lại chờ tiếp. Ctrl-C ở dấu nhắc của shell là trường hợp khác: shell đọc lệnh bằng readline() ở chế độ Raw (TTY_RAW = 0, ISIG tắt), nên kernel không gửi tín hiệu nào; readline() nhận byte 3, in ^C và bỏ dòng đang gõ.",
        "outputAndEvidence": ""
      },
      {
        "id": "w3-act-3",
        "name": "Activity 3: Kiểm chứng shell với job tiền cảnh (Shell & Testing)",
        "description": "main() trong sh.c gọi signal(..., SIG_IGN) cho SIGINT, SIGTSTP, SIGTTIN, SIGTTOU để bản thân shell không bị kết thúc hay dừng; tiến trình con trong runjob() đặt lại SIG_DFL trước khi exec. fgjob() trao terminal cho job bằng tcsetpgrp(), rồi chờ bằng waitpid(pgid, &status, WUNTRACED): waitpid() trả về khi job kết thúc hoặc khi job bị dừng (status = (stopsig << 8) | 0x7f, WIFSTOPPED đúng). setstatus() chuyển job sang STOPPED hoặc DONE; shell lấy lại terminal, lưu chế độ terminal của job (tmodes) và printjob() in “[1]+ Stopped  counter”. Job bị Ctrl-C kết thúc (WTERMSIG = SIGINT) thì shell không in gì, giống bash. Đối chiếu kết quả các test Ctrl-C / Ctrl-Z với ma trận TC-01 đến TC-06.",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Đọc signal.h, proc.c (sigdeliver, ksignal, stoppending, stopcheck, ksigdisp), trap.c (usertrap), sysproc.c (sys_sigsend, sys_signal, sys_pause); vẽ máy trạng thái RUNNING → STOPPED → RUNNABLE; lập bảng xử lý từng tín hiệu; giải thích vì sao chỉ dừng ở điểm an toàn; chủ trì trình bày tuần 3.",
        "outputsAchieved": "bảng xử lý tín hiệu và ảnh mã nguồn (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc nhánh ISIG trong consoleintr() và các điểm gọi stopcheck() trong consoleread(), pipe.c; chạy test-jobctl.py nhóm test Ctrl-C / Ctrl-Z; chạy demo counter → Ctrl-Z → Ctrl-P → fg → Ctrl-C; tổng hợp báo cáo tuần 3.",
        "outputsAchieved": "kết quả kiểm thử (minh chứng c), demo (minh chứng d).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc fgjob(), setstatus(), printjob(), updatejobs() trong sh.c và các macro WIFSTOPPED / WSTOPSIG trong wait.h; đối chiếu kết quả test với ma trận kiểm thử, điền Actual Result cho TC-01, TC-02; cập nhật Trello tuần 3; vẽ sơ đồ luồng phím → tín hiệu → trạng thái tiến trình trên Figma.",
        "outputsAchieved": "ma trận kiểm thử cập nhật, board Trello (minh chứng a), sơ đồ Figma tuần 3 (minh chứng e).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Mô hình “đánh dấu rồi tự xử lý”. Ngắt bàn phím không được ngủ, còn tiến trình đích có thể đang giữ khoá (pipe, log, sleeplock của inode); nếu dừng nó ngay tại chỗ thì các tiến trình khác chờ khoá đó sẽ kẹt mãi (deadlock). Vì vậy consoleintr() chỉ gọi ksignal(), sigdeliver() chỉ ghi killed / pendstop và đánh thức tiến trình đang ngủ; chính tiến trình đó sẽ kết thúc hoặc dừng ở các điểm an toàn không giữ khoá: trước khi quay về user space (usertrap), và trong các vòng chờ có thể ngắt (consoleread, piperead / pipewrite, pause, waitpid). Chương trình chỉ tính toán, không gọi system call (spin) vẫn dừng được nhờ ngắt timer đưa nó vào usertrap(). Khi dừng, stopcheck() lấy wait_lock rồi p->lock theo cùng thứ tự với kexit() và đánh thức cha trước khi đổi state, nên waitpid(WUNTRACED) của shell không bỏ lỡ sự kiện. Mỗi lần dừng chỉ được báo một lần: waitpid() đọc xong thì xoá stopsig về 0.",
      "sourceCodeEnhanced": "Tuần 3 nhóm không sửa mã nguồn mà rà soát phần xử lý tín hiệu của bản mở rộng theo từng file: kernel/signal.h; kernel/proc.c (sigdeliver, ksignal, kkill, stoppending, stopcheck, ksigdisp); kernel/trap.c (usertrap gọi stopcheck); kernel/console.c (consoleintr nhánh ISIG, consoleread); kernel/pipe.c; kernel/sysproc.c (sys_pause, sys_sigsend, sys_signal); kernel/wait.h; user/sh.c (main, runjob, fgjob, setstatus, printjob, readline); user/counter.c, user/spin.c.",
      "testingResult": "Chạy python3 test-jobctl.py ctrl trên Ubuntu (QEMU); mỗi test khởi động một xv6 mới và gõ phím thật qua pexpect. Kết quả 4/4 PASS: test_ctrl_c_kills_foreground, test_ctrl_z_bg_fg, test_ctrl_z_cpu_bound, test_ctrl_c_at_prompt (minh chứng c). Demo thủ công (minh chứng d): counter (pid 4) đang đếm, Ctrl-Z → shell in “[1]+ Stopped counter”, Ctrl-P cho thấy “4 4 stop counter”; fg → counter đếm tiếp từ 5; Ctrl-C → in ^C, Ctrl-P không còn counter. Ma trận kiểm thử: TC-01 (Ctrl-C) và TC-02 (Ctrl-Z) chuyển sang PASS; test_ctrl_z_bg_fg đã chạy qua bg / fg nhưng TC-03, TC-04 sẽ kiểm chứng đầy đủ ở tuần 4; TC-05 (pipeline), TC-06 (SIGTTIN) vẫn Pending."
    },
    "todo": {
      "remainingIssues": "- Chỉ có hành động mặc định (kết thúc, dừng, chạy tiếp) hoặc bỏ qua (SIG_IGN); chưa có signal handler ở user space, chưa chặn tín hiệu tạm thời được (không có sigprocmask).\n- Tín hiệu kết thúc (SIGINT, SIGTERM) gửi tới tiến trình đang STOPPED chỉ được ghi nhận; tiến trình kết thúc sau khi nhận SIGCONT. Muốn huỷ ngay job đang dừng phải dùng kill %n (SIGKILL).\n- Tiến trình chỉ dừng ở những chỗ có gọi stopcheck(); nếu đang chờ ở chỗ khác trong kernel (ví dụ I/O đĩa) thì phải đợi tới khi quay về user space mới dừng.\n- consoleintr() gọi ksignal() khi đang giữ cons.lock, và ksignal() duyệt cả 64 phần tử bảng proc, lấy từng p->lock; thứ tự khoá cons.lock → p->lock phải giữ nhất quán. Chưa kiểm thử nhấn Ctrl-C / Ctrl-Z dồn dập trên nhiều CPU.\n- Các vấn đề từ tuần 2 vẫn còn: setpgid() không kiểm tra nhóm đích, tcsetpgrp() không kiểm tra quyền, SIGTTOU chưa dùng.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 4: hoàn thiện job control):\n- Task 1 (Hoàng): Phân tích và kiểm chứng waitpid() với WNOHANG, WUNTRACED; mã trạng thái WIFEXITED / WIFSIGNALED / WIFSTOPPED; vì sao mỗi lần dừng chỉ báo một lần.\n- Task 2 (Hiếu): Kiểm chứng TIOCGPGRP / TIOCSPGRP và quyền đọc terminal: tiến trình nền gọi read() nhận SIGTTIN (cat &), shell in “Stopped (tty input)”.\n- Task 3 (Tuấn Anh): Kiểm chứng các lệnh jobs, fg, bg, kill %n và chạy nền bằng &; chủ trì trình bày tuần 4.\n- Task 4 (Cả nhóm): Demo counter → Ctrl-Z → jobs → bg → jobs → fg → Ctrl-C; chạy test_ctrl_z_bg_fg, test_background_read_stops và điền Actual Result cho TC-03, TC-04, TC-06.\n- Task 5 (Cả nhóm): Cập nhật Figma (máy trạng thái của job: Running / Stopped / Done) và Trello tuần 4.",
      "milestone": "Kết thúc tuần 4, nhóm giải thích và demo được vòng đời đầy đủ của một job: chạy tiền cảnh → Ctrl-Z → jobs → bg → fg → Ctrl-C; phân biệt Process, Process Group và Job; nêu được shell trao và lấy lại terminal ra sao, ý nghĩa của SIGCONT, WUNTRACED, WNOHANG. TC-03, TC-04, TC-06 có kết quả thật. Đây là nền tảng để tuần 5 kiểm chứng pipeline và các trường hợp đặc biệt."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w4",
    "weekNumber": 4,
    "reportPeriodFrom": "08/11/2026",
    "reportPeriodTo": "15/11/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "draft",
    "summaryOfProgress": "Tuần 4 (08/11 – 15/11/2026) tập trung hoàn thiện job control: kiểm chứng đầy đủ luồng tiền cảnh / nền gồm waitpid() với WNOHANG / WUNTRACED, quyền đọc terminal (TIOCGPGRP / TIOCSPGRP, SIGTTIN) và các lệnh jobs, fg, bg, kill %n, chạy nền bằng &. Tuấn Anh chủ trì trình bày.\n\nNhóm phân biệt rõ ba khái niệm: Process (một tiến trình, có pid), Process Group (các tiến trình chung pgid, nhận tín hiệu cùng lúc) và Job (một dòng lệnh của shell, ứng với đúng một process group). Shell trao terminal cho job tiền cảnh bằng tcsetpgrp(), chờ bằng waitpid(pgid, WUNTRACED), rồi lấy lại terminal khi job kết thúc hoặc dừng. Trước mỗi dấu nhắc, shell gọi waitpid(-1, WNOHANG | WUNTRACED) để thu trạng thái job nền mà không bị chặn, thay cho SIGCHLD. bg và fg đều gửi SIGCONT cho cả nhóm; fg còn trao terminal và khôi phục chế độ terminal của job. Tiến trình nền gọi read() trên terminal sẽ gửi SIGTTIN cho nhóm của nó và tự dừng; sau fg thì đọc lại thành công.\n\nKết quả: toàn bộ test-jobctl.py 12/12 PASS, trong đó các test của tuần này là test_ctrl_z_bg_fg, test_ctrl_z_cpu_bound, test_background_read_stops; demo counter → Ctrl-Z → jobs → bg → jobs → fg → Ctrl-C và cat & → jobs → fg chạy đúng kịch bản. TC-03 (bg), TC-04 (fg), TC-06 (SIGTTIN) chuyển sang PASS. Giới hạn ghi nhận: chưa có session, tcsetpgrp() không kiểm tra quyền, output của job nền chen vào dòng đang gõ. Cumulative progress khoảng 60%. Tuần 5 kiểm chứng pipeline và các trường hợp đặc biệt.",
    "technicalActivities": [
      {
        "id": "w4-act-1",
        "name": "Activity 1: Phân tích waitpid() với WNOHANG và WUNTRACED (Process & Signal)",
        "description": "sys_waitpid() gọi kwaitpid(pid, addr, options, 1), quét bảng proc dưới wait_lock: pid > 0 là đúng con đó, pid = -1 là con bất kỳ, pid < -1 là con bất kỳ trong nhóm -pid. Con ở trạng thái ZOMBIE: trả về mã theo kiểu Linux, (exit code << 8) nếu tự exit, số hiệu tín hiệu nếu bị tín hiệu kết thúc. Có WUNTRACED: con ở STOPPED với stopsig ≠ 0 được báo bằng (stopsig << 8) | 0x7f rồi xoá stopsig, nên mỗi lần dừng chỉ báo một lần. Có WNOHANG: chưa con nào đổi trạng thái thì trả 0 ngay. Trước khi ngủ chờ, kwaitpid() gọi stopcheck() nếu chính nó bị yêu cầu dừng (tiến trình đầu job của pipeline đang wait). wait() cũ gọi kwaitpid(-1, addr, 0, 0), trả mã exit thô như xv6 gốc, nên usertests không bị ảnh hưởng. kernel/wait.h cung cấp WIFEXITED, WEXITSTATUS, WIFSIGNALED, WTERMSIG, WIFSTOPPED, WSTOPSIG.",
        "outputAndEvidence": ""
      },
      {
        "id": "w4-act-2",
        "name": "Activity 2: Kiểm chứng TIOCGPGRP / TIOCSPGRP và SIGTTIN (TTY Layer)",
        "description": "consoleioctl() xử lý TIOCGPGRP bằng cách đọc fgpgid dưới cons.lock rồi chép ra user; TIOCSPGRP nhận pgid > 0, ghi vào fgpgid và gọi wakeup(&t->r) để tiến trình đang chờ đọc (vốn ở nền, nay thành tiền cảnh) kiểm tra lại. Trong consoleread(), nếu fgpgid ≠ 0 và pgid của người đọc khác fgpgid: nếu đã đọc được một phần thì trả về phần đó; nếu tiến trình bỏ qua SIGTTIN (như shell) thì read() trả -1 thay vì treo; ngược lại gửi SIGTTIN cho cả nhóm của nó bằng ksignal(-pgid, SIGTTIN), gọi stopcheck() để dừng, sau khi được tiếp tục thì kiểm tra lại từ đầu. Ghi ra terminal từ nền vẫn được phép (chưa dùng SIGTTOU), giống Linux khi tắt TOSTOP.",
        "outputAndEvidence": ""
      },
      {
        "id": "w4-act-3",
        "name": "Activity 3: Kiểm chứng jobs, fg, bg, kill %n và & (Shell & Testing)",
        "description": "runjob() nhận dạng dấu & ở cuối dòng: job nền được in “[1] pid” và không được trao terminal. jobs gọi listjobs(1), in mọi job với trạng thái Running / Stopped / Stopped (tty input) / Done / Interrupted / Killed; dấu + đánh dấu job hiện tại (curjob), là job mặc định của fg / bg. fg [%n] in tên lệnh rồi gọi fgjob(j, 1): khôi phục tmodes, tcsetpgrp(), sigsend(-pgid, SIGCONT), chờ waitpid(WUNTRACED). bg [%n] chỉ gửi SIGCONT, không đổi terminal, in “[1]+ Running counter &”. kill %n gửi SIGKILL cho cả nhóm nên giết được cả job đang dừng. Trước mỗi dấu nhắc, getcmd() gọi listjobs(0) để báo các job vừa đổi trạng thái và lấy lại terminal cho shell. Bảng job có 16 phần tử; job đã kết thúc được giải phóng sau khi báo.",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Đọc kwaitpid(), kwait(), sys_waitpid() và kernel/wait.h; lập bảng mã trạng thái (exit / bị tín hiệu kết thúc / bị dừng) và các macro giải mã; giải thích vì sao mỗi lần dừng chỉ báo một lần và vì sao wait() cũ không đổi hành vi.",
        "outputsAchieved": "bảng mã trạng thái và ảnh mã nguồn (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc consoleioctl() (TIOCGPGRP / TIOCSPGRP) và nhánh SIGTTIN trong consoleread(); chạy demo cat & → jobs → fg; chạy lại test-jobctl.py; tổng hợp báo cáo tuần 4.",
        "outputsAchieved": "minh chứng d.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc builtin(), jobarg(), listjobs(), fgjob(), runjob() trong sh.c; chạy demo counter → Ctrl-Z → jobs → bg → jobs → fg → Ctrl-C; điền Actual Result cho TC-03, TC-04, TC-06; cập nhật Trello, Figma; chủ trì trình bày tuần 4.",
        "outputsAchieved": "minh chứng a, c, e.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Vòng đời của một job phía shell: JOB_RUNNING (tiền cảnh hoặc nền) ⇄ JOB_STOPPED (do Ctrl-Z hoặc SIGTTIN; ra khỏi bằng fg / bg qua SIGCONT) → JOB_DONE (exit, Ctrl-C, kill %n) → JOB_FREE sau khi đã báo cho người dùng. Shell không dùng SIGCHLD vì xv6 không có signal handler; thay vào đó nó hỏi kernel: waitpid(-1, WNOHANG | WUNTRACED) trước mỗi dấu nhắc, và waitpid(pgid, WUNTRACED) khi có job tiền cảnh. Quyền với terminal tách thành hai việc: đọc (chỉ nhóm tiền cảnh, kiểm tra pgid == fgpgid trong consoleread) và nhận tín hiệu bàn phím (chỉ nhóm fgpgid). Khi job dừng, shell lưu chế độ terminal của job (tmodes) để fg khôi phục đúng, ví dụ chương trình đang ở chế độ Raw.",
      "sourceCodeEnhanced": "Tuần 4 nhóm không sửa mã nguồn mà rà soát: kernel/proc.c (kwaitpid, kwait); kernel/sysproc.c (sys_waitpid); kernel/wait.h; kernel/console.c (consoleioctl: TIOCGPGRP, TIOCSPGRP; consoleread: SIGTTIN); user/ulib.c (tcgetpgrp, tcsetpgrp); user/sh.c (builtin, jobarg, listjobs, updatejobs, setstatus, printjob, fgjob, runjob, getcmd).",
      "testingResult": "Chạy python3 test-jobctl.py (12 kịch bản) trên Ubuntu / QEMU: 12/12 PASS. Các test của tuần 4: test_ctrl_z_bg_fg (Ctrl-Z → bg → jobs → fg → Ctrl-C, cuối cùng bảng job rỗng), test_ctrl_z_cpu_bound (spin → Ctrl-Z → kill %1 → jobs in “Killed”), test_background_read_stops (cat & → jobs in “Stopped (tty input)” → fg → gõ hello → cat in lại). Demo thủ công (minh chứng c, d): sau Ctrl-Z, Ctrl-P thấy “4 4 stop counter”; bg in “[1]+ Running counter &” và counter tiếp tục in số trong khi shell nhận lệnh; fg in “counter” rồi đếm tiếp; cat & in “[1] 5”, jobs in “[1]+ Stopped (tty input) cat”, fg rồi gõ hello thì cat in lại hello. Ma trận: TC-01 đến TC-04 và TC-06 PASS; test pipeline cũng PASS nhưng TC-05 được phân tích ở tuần 5."
    },
    "todo": {
      "remainingIssues": "- Chưa có session và controlling terminal đầy đủ như POSIX: quyền đọc chỉ kiểm tra bằng pgid == fgpgid của terminal đang đọc.\n- TIOCSPGRP (tcsetpgrp()) không kiểm tra người gọi có ở tiền cảnh, cũng không kiểm tra nhóm pgid có tồn tại; tiến trình bất kỳ có thể chiếm terminal.\n- Ghi ra terminal từ nền luôn được phép (SIGTTOU chưa dùng): trong demo, số do counter chạy nền in ra chen vào giữa dòng lệnh đang gõ.\n- Shell biết job nền kết thúc nhờ hỏi trước mỗi dấu nhắc (không có SIGCHLD), nên thông báo “Done” chỉ hiện sau khi người dùng nhấn Enter.\n- Bảng job cố định 16 phần tử; dòng lệnh và tên lệnh tối đa 100 ký tự.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 5: pipeline và các trường hợp đặc biệt):\n- Task 1 (Hoàng): Kiểm chứng dừng cả process group; xử lý tiến trình mồ côi đang STOPPED bằng SIGHUP + SIGCONT trong reparent().\n- Task 2 (Hiếu): Kiểm chứng khôi phục chế độ terminal (tmodes, shell_tmodes) khi job dừng / chạy tiếp; tiến trình nền đọc terminal (SIGTTIN); phân tích nguy cơ deadlock khi dừng lúc giữ khoá.\n- Task 3 (Tuấn Anh): Kiểm chứng pipeline là một job: counter | cat; chủ trì trình bày tuần 5.\n- Task 4 (Cả nhóm): Demo counter | cat → Ctrl-Z → Ctrl-P → fg → Ctrl-C và thoát shell khi còn job đang dừng; chạy test_pipeline_is_one_job, test_exit_with_stopped_job; điền Actual Result cho TC-05.\n- Task 5 (Cả nhóm): Cập nhật Figma (pipeline trong một process group, tiến trình mồ côi) và Trello tuần 5.",
      "milestone": "Kết thúc tuần 5, nhóm giải thích và demo được vì sao một pipeline phải được điều khiển như một job, các tiến trình của pipeline dừng / chạy tiếp / kết thúc cùng nhau, tiến trình mồ côi đang dừng được dọn khi shell thoát, và nêu được nguy cơ deadlock khi dừng lúc giữ khoá. Cả 6 test case TC-01 đến TC-06 có kết quả thật."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w5",
    "weekNumber": 5,
    "reportPeriodFrom": "15/11/2026",
    "reportPeriodTo": "22/11/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "draft",
    "summaryOfProgress": "Tuần 5 (15/11 – 22/11/2026) kiểm chứng pipeline và các trường hợp đặc biệt: một pipeline phải được điều khiển như một job duy nhất, tiến trình mồ côi đang dừng, khôi phục chế độ terminal khi job dừng / chạy tiếp, và nguy cơ deadlock khi tiến trình dừng lúc còn giữ khoá. Tuấn Anh chủ trì trình bày.\n\nVới counter | cat, shell chỉ fork một tiến trình đầu job (một sh con) và đặt nó vào nhóm mới; sh con fork tiếp counter và cat, hai tiến trình này kế thừa pgid qua fork(). Vì vậy Ctrl-C / Ctrl-Z gửi tới -fgpgid trúng cả ba tiến trình cùng lúc, và shell chỉ cần chờ tiến trình đầu nhóm. Tiến trình đầu nhóm đang ngủ trong wait() nên kwaitpid() cũng là một điểm dừng; piperead() / pipewrite() cũng gọi stopcheck() khi đang chờ, sau khi nhả pi->lock. Khi shell thoát mà còn job đang dừng, reparent() giao tiến trình con cho init và gửi SIGHUP rồi SIGCONT cho tiến trình đang STOPPED, để nó chạy tiếp và tự kết thúc thay vì đứng yên mãi.\n\nKết quả: test_pipeline_is_one_job và test_exit_with_stopped_job PASS (toàn bộ 12/12 test PASS); demo cho thấy sh, counter, cat chung pgid 4 và cùng ở trạng thái stop, Ctrl-C sau fg kết thúc cả pipeline, và job đang dừng (kể cả pipeline) biến mất sau khi shell thoát. TC-05 chuyển sang PASS, cả 6 test case trong ma trận đã có kết quả thật. Cumulative progress khoảng 75%. Tuần 6 kiểm chứng tính năng mở rộng (Multi-TTY, lịch sử lệnh, line editor) và tổng hợp kiểm thử.",
    "technicalActivities": [
      {
        "id": "w5-act-1",
        "name": "Activity 1: Dừng cả process group và tiến trình mồ côi đang dừng (Process & Signal)",
        "description": "ksignal(-pgid, SIGTSTP) đánh dấu pendstop cho mọi tiến trình của nhóm; mỗi tiến trình tự dừng ở điểm an toàn của riêng nó: counter dừng trong pause() hoặc khi quay về user space, cat dừng trong piperead(), sh đầu job dừng trong kwaitpid(). reparent() (gọi trong kexit(), giữ wait_lock) giao các con cho init; con nào đang STOPPED được gửi SIGHUP rồi SIGCONT, vì init không làm job control nên không ai còn fg / bg được nó. Thứ tự này là bắt buộc: sigdeliver() không đánh thức tiến trình đang dừng khi nhận SIGHUP, nên nếu chỉ gửi SIGHUP thì tiến trình đứng ở STOPPED mãi; SIGCONT làm nó RUNNABLE, chạy tới usertrap() và thấy killed = SIGHUP. Với pipeline, việc này lan dần: sh đầu job kết thúc thì counter và cat lại thành mồ côi và nhận SIGHUP + SIGCONT.",
        "outputAndEvidence": ""
      },
      {
        "id": "w5-act-2",
        "name": "Activity 2: Khôi phục chế độ terminal và nguy cơ deadlock (TTY Layer)",
        "description": "Mỗi job có tmodes riêng: khi job dừng, fgjob() đọc chế độ terminal hiện tại (tcgetattr) lưu vào j->tmodes rồi đặt lại shell_tmodes (Cooked); khi fg, tcsetattr(0, &j->tmodes) được gọi trước tcsetpgrp() nên chương trình đang ở Raw (ví dụ ttydemo raw) chạy tiếp vẫn ở Raw. Line editor của shell tự chuyển sang Raw khi đọc lệnh và trả về shell_tmodes trước khi chạy lệnh. Về deadlock: nếu tiến trình bị dừng ngay khi đang giữ một khoá (pi->lock, cons.lock, khoá log, sleeplock của inode), mọi tiến trình khác cần khoá đó, kể cả shell, sẽ chờ mãi. Vì vậy mọi chỗ gọi stopcheck() trong vòng chờ (consoleread, piperead, pipewrite, sys_pause, kwaitpid) đều nhả khoá trước, dừng, sau khi tiếp tục thì lấy lại khoá và kiểm tra lại điều kiện.",
        "outputAndEvidence": ""
      },
      {
        "id": "w5-act-3",
        "name": "Activity 3: Kiểm chứng pipeline là một job (Shell & Testing)",
        "description": "runjob() fork một tiến trình đầu job; cả cha và con gọi setpgid() để nhóm = pid của tiến trình đầu job. Tiến trình đầu job chạy runcmd() cho cây lệnh PIPE: tạo pipe, fork hai con (counter, cat) rồi wait() cả hai. Shell chỉ thêm một mục vào bảng job với tên là cả dòng “counter | cat”, và waitpid(pgid) chờ tiến trình đầu job. Dòng lệnh có ; (LIST) cũng vậy: mọi tiến trình con đều thuộc cùng nhóm. Kịch bản kiểm thử: counter | cat → Ctrl-Z → Ctrl-P (ba tiến trình chung pgid, cùng stop) → fg → Ctrl-C → Ctrl-P (không còn counter, cat); và thoát shell khi còn job đang dừng.",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Đọc reparent(), kexit() và các điểm gọi stopcheck() trong kwaitpid(), sys_pause(); giải thích thứ tự SIGHUP → SIGCONT và chuỗi lan truyền với pipeline; chạy demo thoát shell khi còn job đang dừng.",
        "outputsAchieved": "ảnh mã nguồn reparent() (minh chứng b), minh chứng d.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc phần tmodes / shell_tmodes trong fgjob(), readline(), và các vòng chờ trong console.c, pipe.c; lập bảng điểm dừng an toàn cùng khoá được nhả trước khi dừng; tổng hợp báo cáo tuần 5.",
        "outputsAchieved": "bảng điểm dừng an toàn (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc runjob(), runcmd() nhánh PIPE / LIST / BACK; chạy demo counter | cat; điền Actual Result cho TC-05; cập nhật Trello, Figma; chủ trì trình bày tuần 5.",
        "outputsAchieved": "minh chứng a, c, e.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Ba quy tắc giúp pipeline hoạt động như một đơn vị: (1) nhóm được tạo một lần ở tiến trình đầu job, mọi tiến trình con kế thừa pgid qua fork() nên shell không cần biết pid của từng vế; (2) tín hiệu bàn phím luôn gửi theo nhóm (ksignal(-fgpgid)) nên mọi vế nhận cùng lúc; (3) mỗi tiến trình tự dừng ở điểm an toàn của riêng nó, và stopcheck() đánh thức cha. Shell chỉ chờ tiến trình đầu job: khi tiến trình này dừng (trong kwaitpid()), waitpid(WUNTRACED) của shell trả về và shell in “[1]+ Stopped counter | cat”. Mọi điểm dừng trong vòng chờ theo cùng một mẫu: nhả khoá → stopcheck() → lấy lại khoá → kiểm tra lại điều kiện. Mẫu này tránh dừng khi đang giữ khoá, và không bỏ lỡ sự kiện xảy ra trong lúc dừng.",
      "sourceCodeEnhanced": "Tuần 5 nhóm không sửa mã nguồn mà rà soát: kernel/proc.c (reparent, kexit, kwaitpid); kernel/pipe.c (pipewrite, piperead); kernel/sysproc.c (sys_pause); kernel/console.c (consoleread); user/sh.c (runjob, runcmd, fgjob, readline); user/counter.c.",
      "testingResult": "Chạy lại toàn bộ test-jobctl.py: 12/12 PASS. Trong phạm vi tuần 5: test_pipeline_is_one_job (counter | cat → Ctrl-Z → Ctrl-P: counter và cat cùng pgid, cùng stop → fg → Ctrl-C → Ctrl-P không còn counter / cat) và test_exit_with_stopped_job (counter → Ctrl-Z → exit → init khởi động lại sh → Ctrl-P không còn counter). Demo thủ công (minh chứng c, d): sh (pid 4), counter (pid 5), cat (pid 6) đều có pgid 4 và trạng thái stop; sau fg + Ctrl-C chỉ còn init và hai shell. Nhóm thử thêm trường hợp pipeline đang dừng rồi thoát shell: sau exit, Ctrl-P không còn sh, counter, cat của job, cho thấy SIGHUP + SIGCONT lan qua cả hai cấp. Ma trận: TC-01 đến TC-06 đều PASS."
    },
    "todo": {
      "remainingIssues": "- Chưa có SIGPIPE: theo mã pipewrite(), khi đầu đọc đã đóng thì write() chỉ trả về -1. Chương trình bỏ qua lỗi ghi (như counter) sẽ chạy mãi, pipeline chỉ dừng khi người dùng nhấn Ctrl-C.\n- Ghi ra terminal từ nền vẫn được phép (SIGTTOU chưa dùng), output của job nền có thể chen vào dòng đang gõ.\n- Các vế của pipeline dừng ở điểm an toàn riêng nên không dừng cùng một thời điểm; vế đang chạy có thể in thêm vài dòng sau khi nhấn Ctrl-Z.\n- Các vấn đề cũ: chưa có session, setpgid() không kiểm tra nhóm đích, tcsetpgrp() không kiểm tra quyền.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 6: tính năng mở rộng và kiểm thử):\n- Task 1 (Hoàng): Rà soát các điểm dừng an toàn, race condition, thứ tự khoá; chạy usertests để kiểm tra hồi quy phần process, scheduler, signal.\n- Task 2 (Hiếu): Kiểm chứng Multi-TTY: hai shell độc lập, chuyển terminal bằng Ctrl-T, giữ output của terminal đang ẩn; chủ trì trình bày tuần 6.\n- Task 3 (Tuấn Anh): Kiểm chứng lịch sử lệnh, line editor, phím mũi tên; chạy toàn bộ 12 test trong test-jobctl.py và thống kê pass / fail.\n- Task 4 (Cả nhóm): Báo cáo các lỗi phát hiện (nếu có): nguyên nhân, cách sửa và kết quả kiểm thử lại.\n- Task 5 (Cả nhóm): Cập nhật Figma (Multi-TTY, line editor) và Trello tuần 6.",
      "milestone": "Kết thúc tuần 6, nhóm demo được hai terminal ảo độc lập (Ctrl-T) và lịch sử lệnh / sửa dòng, có thống kê pass / fail thật của 12 test job control và usertests, cùng danh sách lỗi (nếu có) kèm cách xử lý. Đây là đầu vào cho tuần 7 kiểm thử tổng thể và nghiệm thu."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w6",
    "weekNumber": 6,
    "reportPeriodFrom": "22/11/2026",
    "reportPeriodTo": "29/11/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "draft",
    "summaryOfProgress": "Tuần 6 (22/11 – 29/11/2026) đánh giá tính ổn định và các tính năng mở rộng: hai terminal ảo dùng chung một UART (chuyển bằng Ctrl-T), lịch sử lệnh và line editor của shell, cùng việc chạy toàn bộ bộ kiểm thử. Hiếu chủ trì trình bày, Tuấn Anh trình bày phần kiểm thử.\n\nMulti-TTY: máy virt của QEMU chỉ có một UART nên kernel giữ mảng tty[NTTY] với NTTY = 2; mỗi terminal có bộ đệm vào, lflag và fgpgid riêng, init chạy một shell trên console (minor 0) và một shell trên tty1 (minor 1). Phím gõ luôn tới terminal đang hiển thị (cons.active); output của terminal đang ẩn được giữ trong obuf 2 KB và in lại khi chuyển tới. Line editor: khi chờ lệnh, shell chuyển terminal sang Raw và tự xử lý ←/→, Home/End, Ctrl-A / Ctrl-E, Backspace, Ctrl-U, ↑/↓ để duyệt 16 lệnh gần nhất; mỗi lần sửa thì vẽ lại dòng bằng mã ANSI.\n\nKết quả: test-jobctl.py 12/12 PASS; usertests (bản nhanh -q) ALL TESTS PASSED, cho thấy phần mở rộng không làm hỏng xv6 gốc. Lần chạy này không phát hiện lỗi mới. Rà soát mã cho thấy mọi điểm dừng đều nhả khoá trước khi dừng. Cumulative progress khoảng 90%. Tuần 7 kiểm thử tổng thể, kiểm tra CI và chuẩn bị nghiệm thu.",
    "technicalActivities": [
      {
        "id": "w6-act-1",
        "name": "Activity 1: Rà soát điểm dừng an toàn, race condition và thứ tự khoá (Process & Signal)",
        "description": "Lập danh sách mọi chỗ gọi stopcheck(): usertrap(), consoleread() (2 chỗ), piperead(), pipewrite(), sys_pause(), kwaitpid(); mỗi chỗ đều nhả khoá đang giữ trước khi gọi. Thứ tự khoá: stopcheck() và kexit() cùng lấy wait_lock trước p->lock; consoleintr() lấy cons.lock rồi tới p->lock (qua ksignal), và không có chỗ nào lấy cons.lock khi đang giữ p->lock. Race giữa shell và job sau fork(): cả hai cùng gọi setpgid() (và tcsetpgrp() với job tiền cảnh) nên ai chạy trước cũng cho cùng kết quả. Race giữa SIGCONT và stopcheck(): stopcheck() kiểm tra lại pendstop dưới p->lock, nếu SIGCONT hoặc SIGKILL tới trước thì không dừng. Chạy usertests để kiểm tra hồi quy phần process / scheduler.",
        "outputAndEvidence": ""
      },
      {
        "id": "w6-act-2",
        "name": "Activity 2: Kiểm chứng Multi-TTY và chuyển terminal bằng Ctrl-T (TTY Layer)",
        "description": "init mở “console” và “tty1” (cùng major CONSOLE, minor 0 và 1) rồi chạy một shell trên mỗi terminal; struct file giữ minor để consoleread / consolewrite / consoleioctl biết đang làm việc với terminal nào. consolewrite() tới terminal đang ẩn ghi vào obuf (vòng tròn 2 KB, đầy thì mất phần cũ nhất) và nhớ dòng màn hình hiện tại (line[]), ví dụ dấu nhắc. consoleintr() nhận Ctrl-T thì gọi switchtty(): đổi cons.active, in “[ttyN]”, in lại output đã giữ (hoặc dòng hiện tại), và in lại phần dòng đang gõ dở nếu terminal ở chế độ Cooked có ECHO. Mỗi terminal có fgpgid riêng nên Ctrl-C trên tty1 chỉ tới job tiền cảnh của tty1.",
        "outputAndEvidence": ""
      },
      {
        "id": "w6-act-3",
        "name": "Activity 3: Kiểm chứng lịch sử lệnh, line editor và chạy toàn bộ kiểm thử (Shell & Testing)",
        "description": "readline() đặt terminal về Raw, đọc từng byte: ký tự in được chèn tại vị trí con trỏ; Backspace, Ctrl-U xoá; Ctrl-A / Ctrl-E, Home / End, ←/→ di chuyển; dãy ESC [ A / B duyệt lịch sử; Ctrl-C in ^C và bỏ dòng; Ctrl-D ở dòng trống là hết đầu vào (shell thoát, init khởi động lại). Sau mỗi phím, redraw() in “\\r$ ” + dòng + “\\x1b[K” rồi lùi con trỏ bằng “\\x1b[nD”. addhistory() lưu 16 lệnh gần nhất theo vòng tròn, bỏ qua lệnh trùng lệnh liền trước; lệnh history in danh sách. Mỗi shell (mỗi terminal) có lịch sử riêng. Chạy toàn bộ test-jobctl.py (12 kịch bản) và test-xv6.py -q usertests.",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Lập bảng các điểm gọi stopcheck() và khoá được nhả; rà soát thứ tự khoá wait_lock → p->lock và cons.lock → p->lock; phân tích các race sau fork() và giữa SIGCONT với stopcheck(); chạy usertests.",
        "outputsAchieved": "kết quả usertests (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Đọc struct tty (obuf, line), consolewrite(), switchtty(), nhánh Ctrl-T trong consoleintr(), user/init.c; demo hai shell độc lập với Ctrl-T; chủ trì trình bày tuần 6; tổng hợp báo cáo.",
        "outputsAchieved": "minh chứng c.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Đọc readline(), redraw(), addhistory() và lệnh history; demo lịch sử lệnh và sửa dòng; chạy toàn bộ test-jobctl.py, thống kê pass / fail; cập nhật Trello, Figma.",
        "outputsAchieved": "bảng kết quả kiểm thử (minh chứng b), minh chứng a, d, e.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Terminal ảo trên một UART: số minor của thiết bị là chỉ số terminal, mọi trạng thái (bộ đệm vào, lflag, fgpgid, obuf) đặt trong struct tty, còn UART chỉ hiển thị terminal cons.active. Cách này không cần thêm driver mới: read / write / ioctl vẫn đi qua devsw[CONSOLE], chỉ khác minor. Line editor đặt ở user space (trong shell) thay vì trong kernel: kernel chỉ cần chế độ Raw, shell tự làm phím mũi tên và lịch sử; chương trình khác vẫn nhận terminal ở chế độ Cooked như cũ vì shell trả về shell_tmodes trước khi chạy lệnh.",
      "sourceCodeEnhanced": "Tuần 6 nhóm không sửa mã nguồn mà rà soát: kernel/console.c (struct tty, consolewrite, switchtty, consoleintr nhánh Ctrl-T); kernel/file.h, file.c (minor); user/init.c; user/sh.c (readline, redraw, addhistory, lệnh history); kernel/proc.c, trap.c, pipe.c, sysproc.c (các điểm stopcheck); test-jobctl.py, test-xv6.py.",
      "testingResult": "test-jobctl.py: 12/12 PASS (bảng ở minh chứng b). usertests bản nhanh (test-xv6.py -q usertests): ALL TESTS PASSED; các dòng “usertrap(): unexpected scause” trong log là của những test cố ý truy cập bộ nhớ sai, đúng như xv6 gốc. Demo Multi-TTY (minh chứng c): Ctrl-T sang [tty1], chạy counter; Ctrl-T về [tty0], gõ echo on-tty0, không thấy output của counter; Ctrl-T sang tty1 thấy phần output đã giữ (counter 4 → 9); Ctrl-C trên tty1 kết thúc counter. Demo lịch sử (minh chứng d): ↑ ↑ Enter chạy lại echo first; gõ echo hllo, ← 3 lần, chèn e → in hello; history in đủ danh sách."
    },
    "todo": {
      "remainingIssues": "- Output của terminal đang ẩn chỉ giữ tối đa 2 KB, đầy thì mất phần cũ nhất; khi chuyển terminal không vẽ lại cả màn hình, chỉ in phần đã giữ hoặc dòng hiện tại.\n- Lịch sử lệnh chỉ có 16 lệnh, nằm trong bộ nhớ của từng shell (mất khi shell thoát); dòng lệnh tối đa 100 ký tự; chưa có Tab completion.\n- Line editor vẽ lại bằng \\r nên chưa kiểm thử với dòng lệnh dài hơn chiều rộng terminal.\n- Chưa kiểm tra lại CI trên GitHub Actions (kiểm tra định dạng clang-format, build trên macOS); làm ở tuần 7.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (tuần 7: kiểm thử tổng thể và nghiệm thu):\n- Task 1 (Hoàng): Kiểm tra lại Process / Signal, các trạng thái biên; chạy usertests bản đầy đủ và crash test để kiểm tra hồi quy.\n- Task 2 (Hiếu): Kiểm tra TTY, Multi-TTY, việc chuyển tiền cảnh và lỗi tích hợp giữa các phân hệ.\n- Task 3 (Tuấn Anh): Hoàn thiện bộ test, kiểm tra GitHub Actions, tài liệu thiết kế, hướng dẫn chạy và kịch bản demo.\n- Task 4 (Cả nhóm): Chuẩn bị slide, chia thời lượng thuyết trình, luyện demo 5 phút theo DEMO.md và trả lời phản biện.\n- Task 5 (Cả nhóm): Tổng hợp giới hạn kỹ thuật và hướng phát triển; cập nhật Figma, Trello tuần 7.",
      "milestone": "Kết thúc tuần 7, nhóm có bản mã nguồn nghiệm thu, kết quả kiểm thử có log (job control, usertests, crash test, CI), báo cáo cuối kỳ, slide và kịch bản demo đã luyện; mỗi thành viên giải thích được đường đi của Ctrl-Z từ bàn phím tới tiến trình và shell."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  },
  {
    "id": "report-w7",
    "weekNumber": 7,
    "reportPeriodFrom": "29/11/2026",
    "reportPeriodTo": "06/12/2026",
    "course": "Operating Systems [Multimedia] – 20261",
    "projectCode": "26126",
    "projectTitle": "TTY layer and job control",
    "designThinkingPage": "https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU",
    "taskManagementPage": "https://trello.com/b/fgC11Nz9/os-project-26126",
    "status": "draft",
    "summaryOfProgress": "Tuần 7 (29/11 – 06/12/2026) là tuần kiểm thử tổng thể và nghiệm thu. Nhóm chạy lại toàn bộ kiểm thử job control và kiểm thử tương thích xv6 gốc, kiểm tra CI trên GitHub Actions, hoàn thiện tài liệu (README, DESIGN, DEMO), slide và kịch bản demo 5 phút, đồng thời tổng hợp các giới hạn kỹ thuật và hướng phát triển.\n\nTrong phạm vi đề tài, hệ thống đã có: ba chế độ terminal Cooked / No-Echo / Raw qua ioctl(); process group, trạng thái STOPPED và tín hiệu thu nhỏ với điểm dừng an toàn; Ctrl-C / Ctrl-Z tới nhóm tiền cảnh; waitpid() với WNOHANG / WUNTRACED; shell có bảng job, jobs / fg / bg / kill %n, chạy nền bằng &, pipeline là một job, SIGTTIN khi job nền đọc terminal, dọn tiến trình mồ côi đang dừng; phần mở rộng gồm hai terminal ảo (Ctrl-T), lịch sử lệnh và line editor.\n\nKết quả: test-jobctl.py 12/12 PASS; usertests và crash test của xv6 gốc PASS (chi tiết ở mục 4c); ma trận TC-01 đến TC-06 đều PASS. Trạng thái CI trên GitHub Actions được ghi ở minh chứng d. Cumulative progress đạt 100% theo lộ trình 7 tuần; nhóm chuyển sang chuẩn bị bảo vệ.",
    "technicalActivities": [
      {
        "id": "w7-act-1",
        "name": "Activity 1: Kiểm thử hồi quy Process & Signal (Process & Signal)",
        "description": "Chạy usertests bản đầy đủ và crash test của xv6 gốc (test-xv6.py) để chắc chắn các thay đổi ở struct proc, wait(), kill(), usertrap() không làm hỏng hành vi cũ. Kiểm tra lại các trạng thái biên đã phân tích ở tuần 3–6: SIGKILL tới tiến trình đang dừng, SIGCONT tới trước khi tiến trình kịp dừng, tiến trình mồ côi đang dừng, Ctrl-Z với chương trình không gọi system call (spin).",
        "outputAndEvidence": ""
      },
      {
        "id": "w7-act-2",
        "name": "Activity 2: Kiểm tra TTY và tích hợp giữa các phân hệ (TTY Layer)",
        "description": "Chạy lại các kịch bản TTY trên cả hai terminal: ba chế độ của ttydemo, Ctrl-C / Ctrl-Z trên tty1 trong khi tty0 có job đang dừng, cat & trên mỗi terminal (fgpgid riêng từng terminal). Đối chiếu đường đi đầy đủ của Ctrl-Z: UART → consoleintr() → ksignal(-fgpgid) → sigdeliver() → stopcheck() → waitpid(WUNTRACED) của shell → “[1]+ Stopped” → tcsetpgrp() trả terminal cho shell.",
        "outputAndEvidence": ""
      },
      {
        "id": "w7-act-3",
        "name": "Activity 3: CI, tài liệu và kịch bản demo (Shell & Testing)",
        "description": "Kiểm tra workflow GitHub Actions: trên Ubuntu chạy make fmt && git diff --exit-code (clang-format), build kernel, test-xv6.py usertests và crash; trên macOS build bằng riscv64-elf-gcc. Hoàn thiện README (cách chạy), DESIGN.md (thiết kế, giới hạn đã biết), DEMO.md (kịch bản 5 phút gồm 7 phần: Ctrl-Z → bg → fg → Ctrl-C, pipeline, spin, SIGTTIN, ba chế độ terminal, mở rộng, test tự động).",
        "outputAndEvidence": ""
      }
    ],
    "contributions": {
      "member-2": {
        "memberId": "member-2",
        "assignedRole": "Process & Signal",
        "technicalWork": "Chạy usertests đầy đủ và crash test; kiểm tra các trạng thái biên của Process / Signal; chuẩn bị phần slide về tín hiệu, STOPPED và điểm dừng an toàn.",
        "outputsAchieved": "log usertests và crash test (minh chứng b).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-1": {
        "memberId": "member-1",
        "assignedRole": "TTY Layer",
        "technicalWork": "Kiểm tra TTY và Multi-TTY, đường đi tích hợp của Ctrl-Z; chuẩn bị phần slide về TTY, ba chế độ và Multi-TTY; tổng hợp báo cáo cuối kỳ.",
        "outputsAchieved": "demo tổng thể (minh chứng c).",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      },
      "member-3": {
        "memberId": "member-3",
        "assignedRole": "Shell & Testing",
        "technicalWork": "Kiểm tra GitHub Actions, hoàn thiện tài liệu và kịch bản demo; chuẩn bị phần slide về shell, job control và kiểm thử; cập nhật Trello, Figma.",
        "outputsAchieved": "trạng thái CI (minh chứng d), minh chứng a, e.",
        "completedTasksSummary": "",
        "evidenceLinks": ""
      }
    },
    "codeReview": {
      "algorithmicDevelopment": "Tổng kết thiết kế: (1) tín hiệu chỉ được đánh dấu (killed / pendstop), tiến trình tự kết thúc hoặc tự dừng ở điểm an toàn không giữ khoá; (2) Ctrl-C / Ctrl-Z được gửi theo nhóm tới fgpgid của terminal, nên trúng cả job tiền cảnh và không trúng shell; (3) shell là nơi duy nhất làm job control: mỗi dòng lệnh là một job trong một process group, terminal được trao bằng tcsetpgrp(), trạng thái được thu bằng waitpid() với WUNTRACED / WNOHANG; (4) terminal là thiết bị có trạng thái riêng (lflag, fgpgid, bộ đệm), đổi qua ioctl() đi cùng đường với read / write.",
      "sourceCodeEnhanced": "Tuần 7 nhóm không thêm chức năng. Các file chính của bản nghiệm thu: kernel/proc.h, proc.c, trap.c, sysproc.c, signal.h, wait.h (Process & Signal); kernel/console.c, termios.h, file.h, file.c, sysfile.c, user/init.c (TTY); user/sh.c, ulib.c, ttydemo.c, counter.c, spin.c, test-jobctl.py (Shell & Testing); tài liệu README.md, DESIGN.md, DEMO.md.",
      "testingResult": "test-jobctl.py: 12/12 PASS. test-xv6.py -q usertests: ALL TESTS PASSED. usertests bản đầy đủ (test-xv6.py usertests): ALL TESTS PASSED. Crash test (test-xv6.py crash): 3/3 OK (khôi phục log, khôi phục file mồ côi 2 lần). Ma trận kiểm thử TC-01 đến TC-06: 6/6 PASS. CI: xem minh chứng d."
    },
    "todo": {
      "remainingIssues": "- Không có signal handler ở user space (sigaction, sigreturn), chỉ có hành động mặc định hoặc bỏ qua; shell thay SIGCHLD bằng waitpid(WNOHANG) trước mỗi dấu nhắc.\n- Không có session và controlling terminal đầy đủ; setpgid() không kiểm tra nhóm đích; tcsetpgrp() không kiểm tra người gọi.\n- Ghi ra terminal từ nền luôn được phép (không có SIGTTOU); chưa có SIGPIPE.\n- Tiến trình đang chờ ở chỗ không phải điểm dừng (ví dụ chờ đĩa) chỉ dừng khi quay về user space.\n- Multi-TTY: output của terminal ẩn giữ tối đa 2 KB, chuyển terminal không vẽ lại cả màn hình; lịch sử lệnh 16 mục, không lưu ra file.",
      "nextPeriodTasks": "b) List of tasks to carry out in the next period (chuẩn bị bảo vệ):\n- Task 1 (Cả nhóm): Luyện demo 5 phút theo DEMO.md trên máy sẽ dùng khi bảo vệ (make clean && make qemu trước khi vào phòng).\n- Task 2 (Cả nhóm): Ôn câu hỏi phản biện: đường đi của Ctrl-Z, vì sao dừng ở điểm an toàn, Process / Process Group / Job, vì sao cả shell và con đều gọi setpgid(), SIGHUP + SIGCONT cho tiến trình mồ côi.\n- Task 3 (Cả nhóm): Đánh dấu bản nghiệm thu trên Git (tag) để bản demo và bản nộp là một.",
      "milestone": "Bảo vệ đồ án: demo đủ 7 phần trong DEMO.md, mỗi thành viên trình bày phân hệ mình phụ trách và trả lời được câu hỏi về đường đi tích hợp; nêu trung thực các giới hạn đã biết ở mục 5a."
    },
    "lecturerFeedback": "",
    "version": "1.0",
    "updatedBy": "Mai Duy Hiếu",
    "updatedAt": "2026-11-07T00:00:00Z"
  }
];
