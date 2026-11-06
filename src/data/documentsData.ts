import { DocumentItem } from '../types';

const REPO = 'https://github.com/kudohieu1209/hedieuhanh-hust/blob/main/';
const sizes = ['1.2 MB', '1.1 MB', '21 KB', '20 KB', '19 KB', '20 KB', '18 KB'];

// Báo cáo tuần: file .docx chính thức (public/reports). Tuần 3–7 là bản nháp, còn chỗ tô vàng chờ ảnh minh chứng.
const reports: DocumentItem[] = sizes.map((size, i) => ({
  id: `doc-report-${i + 1}`,
  title: `Báo cáo tiến độ tuần ${i + 1} (.docx)`,
  type: 'report_pdf',
  weekNumber: i + 1,
  fileUrl: `${import.meta.env.BASE_URL}reports/progress-report-tuan-${i + 1}.docx`,
  isExternalUrl: false,
  fileSize: size,
  version: i < 2 ? 'đã nộp' : 'bản nháp',
  uploaderName: 'Mai Duy Hiếu',
  uploadedAt: i < 2 ? ['2026-10-25T12:00:00Z', '2026-11-01T12:00:00Z'][i] : '2026-11-07T00:00:00Z'
}));

const repoDocs: DocumentItem[] = [
  { id: 'doc-design', title: 'Thiết kế kỹ thuật (DESIGN.md)', type: 'research', fileUrl: REPO + 'DESIGN.md' },
  { id: 'doc-demo', title: 'Kịch bản demo 5 phút (DEMO.md)', type: 'demo_guide', fileUrl: REPO + 'DEMO.md' },
  { id: 'doc-readme', title: 'README: cách build và chạy', type: 'reference', fileUrl: REPO + 'README.md' }
].map(d => ({ ...d, type: d.type as DocumentItem['type'], isExternalUrl: true, version: 'main', uploaderName: 'Mai Duy Hiếu', uploadedAt: '2026-10-20T00:00:00Z' }));

export const INITIAL_DOCUMENTS: DocumentItem[] = [...reports, ...repoDocs];
