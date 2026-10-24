import { DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Báo cáo Tiến độ Tuần 4: Job Control Hoàn chỉnh & Quản lý Nhóm',
    type: 'report_pdf',
    weekNumber: 4,
    fileUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan4_JobControl.pdf',
    isExternalUrl: true,
    fileSize: '1.4 MB',
    version: 'v1.2',
    uploaderName: 'Mai Duy Hiếu',
    uploadedAt: '2026-10-13T20:30:00Z',
    notes: 'Bản báo cáo đã được thầy Tiến nghiệm thu và khen ngợi phần sơ đồ giải quyết race condition fork.'
  },
  {
    id: 'doc-2',
    title: 'Tài liệu Thiết kế Kỹ thuật Toàn diện (DESIGN.md)',
    type: 'research',
    weekNumber: 2,
    fileUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/DESIGN.md',
    isExternalUrl: true,
    fileSize: '34 KB',
    version: 'v2.1',
    uploaderName: 'Mai Duy Hiếu',
    uploadedAt: '2026-10-13T09:39:00Z',
    notes: 'Toàn bộ đặc tả struct proc, struct tty, cơ chế tín hiệu thu nhỏ và mã POSIX status.'
  },
  {
    id: 'doc-3',
    title: 'Kịch bản Vấn đáp & Ngân hàng Câu hỏi Ôn tập Bảo vệ (ON_TAP.md)',
    type: 'reference',
    weekNumber: 6,
    fileUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/ON_TAP.md',
    isExternalUrl: true,
    fileSize: '28 KB',
    version: 'v1.5',
    uploaderName: 'Nguyễn Huy Hoàng',
    uploadedAt: '2026-10-13T09:40:00Z',
    notes: '25 câu hỏi tự ôn và 5 bài tập tự sửa trực tiếp thường gặp trong buổi vấn đáp đồ án.'
  },
  {
    id: 'doc-4',
    title: 'Kịch bản Demo Trực tiếp 5 Phút (DEMO.md)',
    type: 'demo_guide',
    weekNumber: 4,
    fileUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/DEMO.md',
    isExternalUrl: true,
    fileSize: '12 KB',
    version: 'v1.0',
    uploaderName: 'Nguyễn Huy Hoàng',
    uploadedAt: '2026-10-13T09:42:00Z',
    notes: '7 bước chạy lệnh mẫu trong QEMU từ counter, pipeline, spin đến terminal ảo.'
  },
  {
    id: 'doc-5',
    title: 'Đặc tả Kỹ thuật Đề tài #27: TTY Layer & Job Control',
    type: 'reference',
    weekNumber: 1,
    fileUrl: 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/main/DESIGN.md',
    isExternalUrl: true,
    fileSize: '45 KB',
    version: 'v1.0',
    uploaderName: 'Mai Duy Hiếu',
    uploadedAt: '2026-09-22T08:00:00Z',
    notes: 'Tài liệu phân tích kiến trúc 3 tầng và đặc tả kỹ thuật chi tiết của Đề tài #27.'
  },
  {
    id: 'doc-6',
    title: 'Slide Thuyết trình Tiến độ Tuần 3: Signals & Bắt phím Ctrl-C/Z',
    type: 'slide',
    weekNumber: 3,
    fileUrl: 'https://docs.google.com/presentation/d/xv6-tuan3-signals-ctrlz',
    isExternalUrl: true,
    fileSize: '3.2 MB',
    version: 'v1.1',
    uploaderName: 'Nguyễn Tuấn Anh',
    uploadedAt: '2026-10-06T18:00:00Z',
    notes: 'Slide trình bày cơ chế không được ngủ trong consoleintr và điểm dừng an toàn stopcheck.'
  },
  {
    id: 'doc-7',
    title: 'Báo cáo Tiến độ Tuần 5: Pipeline & Xử lý Tình huống Biên',
    type: 'report_pdf',
    weekNumber: 5,
    fileUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/BaoCao_Tuan5_Pipeline_EdgeCases.pdf',
    isExternalUrl: true,
    fileSize: '1.8 MB',
    version: 'v1.0',
    uploaderName: 'Mai Duy Hiếu',
    uploadedAt: '2026-10-20T19:00:00Z',
    notes: 'Bản thảo nộp thầy Tiến chuẩn bị cho buổi báo cáo tiến độ tuần 5.'
  },
  {
    id: 'doc-8',
    title: 'Sơ đồ Kiến trúc Tổng thể: TTY & Job Control 3 Tầng',
    type: 'diagram',
    weekNumber: 1,
    fileUrl: 'https://raw.githubusercontent.com/kudohieu1209/hedieuhanh-hust/main/doc/Architecture_Diagram_3Layers.png',
    isExternalUrl: true,
    fileSize: '450 KB',
    version: 'v2.0',
    uploaderName: 'Mai Duy Hiếu',
    uploadedAt: '2026-09-25T14:00:00Z',
    notes: 'Sơ đồ dòng chảy dữ liệu từ UART đến consoleintr, struct tty và Shell.'
  }
];
