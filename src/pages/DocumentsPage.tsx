import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  ExternalLink, 
  Presentation, 
  Compass, 
  Layers, 
  Trash2, 
  Eye, 
  Clock, 
  User,
  Filter,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DocumentItem, DocumentType } from '../types';

export const DocumentsPage: React.FC = () => {
  const { data, currentMember, addDocument, deleteDocument } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');

  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [isAddingModal, setIsAddingModal] = useState(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DocumentType>('report_pdf');
  const [newWeek, setNewWeek] = useState<number>(data.settings.currentWeek);
  const [newUrl, setNewUrl] = useState('');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newSize, setNewSize] = useState('1.5 MB');
  const [newNotes, setNewNotes] = useState('');

  const typeLabels: Record<DocumentType, { label: string; variant: BadgeVariant; icon: any }> = {
    report_pdf: { label: 'Báo cáo PDF', variant: 'primary', icon: FileText },
    slide: { label: 'Slide Thuyết trình', variant: 'warning', icon: Presentation },
    research: { label: 'Tài liệu Nghiên cứu', variant: 'purple', icon: Compass },
    diagram: { label: 'Sơ đồ Kiến trúc', variant: 'default', icon: Layers },
    demo_guide: { label: 'Kịch bản Demo', variant: 'success', icon: FileCheck },
    reference: { label: 'Tài liệu Tham khảo', variant: 'default', icon: FileText },
    lecturer_notes: { label: 'Ghi chú Giảng viên', variant: 'danger', icon: FileText },
  };

  const filteredDocs = data.documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedTypeFilter === 'all' || doc.type === selectedTypeFilter;
    const matchesWeek = selectedWeekFilter === 'all' || (doc.weekNumber && doc.weekNumber.toString() === selectedWeekFilter);
    return matchesSearch && matchesType && matchesWeek;
  });

  const handleCreateDocument = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    addDocument({
      title: newTitle.trim(),
      type: newType,
      weekNumber: Number(newWeek),
      fileUrl: newUrl.trim(),
      isExternalUrl: true,
      fileSize: newSize.trim() || '1.0 MB',
      version: newVersion.trim() || 'v1.0',
      uploaderName: currentMember.name,
      notes: newNotes.trim()
    });

    setIsAddingModal(false);
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-500" />
            Quản Lý Tài Liệu & Báo Cáo PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lưu trữ tập trung các báo cáo PDF từng tuần, slide thuyết trình, sơ đồ kiến trúc và nhận xét của giảng viên
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddingModal(true)}
        >
          Thêm tài liệu mới
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề tài liệu hoặc ghi chú..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
        >
          <option value="all">Tất cả loại tài liệu</option>
          <option value="report_pdf">Báo cáo PDF</option>
          <option value="slide">Slide Thuyết trình</option>
          <option value="research">Tài liệu nghiên cứu</option>
          <option value="diagram">Sơ đồ kiến trúc</option>
          <option value="demo_guide">Kịch bản Demo</option>
          <option value="reference">Tài liệu tham khảo</option>
        </select>

        {/* Week Filter */}
        <select
          value={selectedWeekFilter}
          onChange={(e) => setSelectedWeekFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
        >
          <option value="all">Tất cả tuần</option>
          {data.weeks.map(w => (
            <option key={w.weekNumber} value={w.weekNumber.toString()}>Tuần {w.weekNumber}</option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const typeInfo = typeLabels[doc.type] || typeLabels.reference;
          const Icon = typeInfo.icon;

          return (
            <Card key={doc.id} className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md">
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant={typeInfo.variant}>
                    <Icon className="w-3 h-3 mr-1" />
                    {typeInfo.label}
                  </Badge>
                  {doc.weekNumber && (
                    <span className="text-[11px] font-mono text-slate-400">
                      Tuần {doc.weekNumber}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                  {doc.title}
                </h3>

                {/* Notes */}
                {doc.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {doc.notes}
                  </p>
                )}
              </div>

              {/* Meta & Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {doc.uploaderName}
                  </span>
                  <span>{doc.fileSize} · {doc.version}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setViewingDoc(doc)}
                  >
                    Xem tài liệu
                  </Button>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Mở tab mới"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Xem Tài Liệu (PDF / Web Viewer) */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={viewingDoc.title}
          subtitle={`${typeLabels[viewingDoc.type]?.label} · Phiên bản: ${viewingDoc.version} · Người đăng: ${viewingDoc.uploaderName}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="w-full h-[580px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center relative">
              <iframe
                src={viewingDoc.fileUrl}
                className="w-full h-full rounded-lg"
                title={viewingDoc.title}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <a
                href={viewingDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở trong cửa sổ trình duyệt mới</span>
              </a>

              <Button variant="secondary" onClick={() => setViewingDoc(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Thêm Tài Liệu Mới */}
      {isAddingModal && (
        <Modal
          isOpen={isAddingModal}
          onClose={() => setIsAddingModal(false)}
          title="Thêm Tài Liệu / Báo Cáo Mới"
          subtitle="Gắn link Google Drive, GitHub hoặc file PDF"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Tiêu đề tài liệu:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="VD: Báo cáo Tổng kết Đồ án Hệ điều hành HUST (PDF)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Loại tài liệu:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DocumentType)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="report_pdf">Báo cáo PDF</option>
                  <option value="slide">Slide Thuyết trình</option>
                  <option value="research">Tài liệu Nghiên cứu</option>
                  <option value="diagram">Sơ đồ Kiến trúc</option>
                  <option value="demo_guide">Kịch bản Demo</option>
                  <option value="reference">Tài liệu Tham khảo</option>
                  <option value="lecturer_notes">Ghi chú Giảng viên</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tuần liên quan:</label>
                <select
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {data.weeks.map(w => (
                    <option key={w.weekNumber} value={w.weekNumber}>Tuần {w.weekNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Đường dẫn tệp (URL):</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/.../file.pdf hoặc Google Drive link"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Phiên bản:</label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="v1.0"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Dung lượng:</label>
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="2.4 MB"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Ghi chú tóm tắt:</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ghi chú nội dung hoặc nhận xét..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsAddingModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleCreateDocument}>
                Lưu Tài Liệu
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
