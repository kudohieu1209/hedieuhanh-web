import { DocumentItem } from '../types';
import { INITIAL_WEEKS } from './initialWeeks';

// Trang Tài liệu chỉ chứa báo cáo tuần. Link lấy từ REPORT_LINKS trong initialWeeks.ts
// (OneDrive nếu đã dán, nếu chưa thì file .docx trong public/reports).
export const INITIAL_DOCUMENTS: DocumentItem[] = INITIAL_WEEKS.filter(w => w.reportFileUrl).map(w => ({
  id: `doc-report-${w.weekNumber}`,
  title: `Báo cáo tiến độ tuần ${w.weekNumber}`,
  type: 'report_pdf',
  weekNumber: w.weekNumber,
  fileUrl: w.reportFileUrl!,
  isExternalUrl: /^https?:/.test(w.reportFileUrl!),
  version: w.status === 'reported' || w.status === 'accepted' ? 'đã nộp' : 'bản nháp',
  uploaderName: 'Mai Duy Hiếu',
  uploadedAt: w.updatedAt
}));
