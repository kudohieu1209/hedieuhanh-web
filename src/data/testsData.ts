import { TestCase, BugItem } from '../types';

// Kết quả chạy thật trên máy của Hiếu (Ubuntu, QEMU) ngày 07/11/2026.
export const INITIAL_TESTS: TestCase[] = [
  {
    "id": "tc-1",
    "suite": "signals",
    "name": "test_ctrl_c_kills_foreground",
    "commandOrFunction": "python3 test-jobctl.py ctrl_c_kills_foreground",
    "description": "Ctrl-C kết thúc counter, shell vẫn chạy",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_ctrl_c_kills_foreground        OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-2",
    "suite": "job_control",
    "name": "test_ctrl_z_bg_fg",
    "commandOrFunction": "python3 test-jobctl.py ctrl_z_bg_fg",
    "description": "Ctrl-Z → bg → jobs → fg → Ctrl-C, cuối cùng bảng job rỗng",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_ctrl_z_bg_fg                   OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-3",
    "suite": "signals",
    "name": "test_ctrl_z_cpu_bound",
    "commandOrFunction": "python3 test-jobctl.py ctrl_z_cpu_bound",
    "description": "spin (không gọi system call) dừng nhờ ngắt timer; kill %1 → Killed",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_ctrl_z_cpu_bound               OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-4",
    "suite": "job_control",
    "name": "test_background_read_stops",
    "commandOrFunction": "python3 test-jobctl.py background_read_stops",
    "description": "cat & → Stopped (tty input) → fg đọc được dòng gõ vào",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_background_read_stops          OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-5",
    "suite": "pipeline",
    "name": "test_pipeline_is_one_job",
    "commandOrFunction": "python3 test-jobctl.py pipeline_is_one_job",
    "description": "counter | cat dừng / kết thúc cùng nhau, chung pgid",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_pipeline_is_one_job            OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-6",
    "suite": "tty_modes",
    "name": "test_noecho_mode",
    "commandOrFunction": "python3 test-jobctl.py noecho_mode",
    "description": "ttydemo noecho không in mật khẩu ra màn hình",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_noecho_mode                    OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-7",
    "suite": "tty_modes",
    "name": "test_raw_mode",
    "commandOrFunction": "python3 test-jobctl.py raw_mode",
    "description": "ttydemo raw: phím trả về ngay, Ctrl-C chỉ là byte 3",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_raw_mode                       OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-8",
    "suite": "tty_modes",
    "name": "test_cooked_mode_editing",
    "commandOrFunction": "python3 test-jobctl.py cooked_mode_editing",
    "description": "Backspace và Ctrl-W do kernel xử lý ở chế độ Cooked",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_cooked_mode_editing            OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-9",
    "suite": "line_editor",
    "name": "test_history_and_line_editing",
    "commandOrFunction": "python3 test-jobctl.py history_and_line_editing",
    "description": "↑ ↑ Enter chạy lại lệnh cũ, ← rồi chèn ký tự, lệnh history",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_history_and_line_editing       OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-10",
    "suite": "multi_tty",
    "name": "test_second_terminal",
    "commandOrFunction": "python3 test-jobctl.py second_terminal",
    "description": "Ctrl-T sang tty1, output của tty1 không lẫn sang tty0, Ctrl-C trên tty1",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_second_terminal                OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-11",
    "suite": "proc_groups",
    "name": "test_exit_with_stopped_job",
    "commandOrFunction": "python3 test-jobctl.py exit_with_stopped_job",
    "description": "Thoát shell khi còn job đang dừng: job được dọn (SIGHUP + SIGCONT)",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_exit_with_stopped_job          OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-12",
    "suite": "signals",
    "name": "test_ctrl_c_at_prompt",
    "commandOrFunction": "python3 test-jobctl.py ctrl_c_at_prompt",
    "description": "Ctrl-C ở dấu nhắc bỏ dòng đang gõ dở",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:27:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "test_ctrl_c_at_prompt               OK\n(cả bộ: 12/12 tests passed)"
  },
  {
    "id": "tc-13",
    "suite": "regression",
    "name": "usertests (bản nhanh)",
    "commandOrFunction": "python3 test-xv6.py -q usertests",
    "description": "Test gốc của xv6, kiểm tra phần mở rộng không làm hỏng xv6",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:29:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "ALL TESTS PASSED\n(các dòng \"usertrap(): unexpected scause\" là của test cố ý truy cập bộ nhớ sai)"
  },
  {
    "id": "tc-14",
    "suite": "regression",
    "name": "usertests (bản đầy đủ)",
    "commandOrFunction": "python3 test-xv6.py usertests",
    "description": "Toàn bộ usertests của xv6",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:37:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "ALL TESTS PASSED"
  },
  {
    "id": "tc-15",
    "suite": "regression",
    "name": "crash test",
    "commandOrFunction": "python3 test-xv6.py crash",
    "description": "Khôi phục log và file mồ côi sau khi QEMU bị tắt đột ngột",
    "status": "pass",
    "lastRunAt": "2026-11-06T18:37:00Z",
    "executedBy": "Mai Duy Hiếu",
    "outputLog": "Test recovery of log: OK\nTest recovery of an orphaned file: OK\nTest recovery of an orphaned file: OK"
  }
];

// Chưa ghi nhận lỗi nào; các giới hạn đã biết nằm ở mục 5a của báo cáo và DESIGN.md §7.
export const INITIAL_BUGS: BugItem[] = [];
