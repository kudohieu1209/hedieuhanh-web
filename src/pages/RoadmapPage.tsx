import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Presentation, 
  Terminal, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { WeekRoadmap, WeekStatus } from '../types';
import { WeeklyProgressReportTab } from '../components/report/WeeklyProgressReportTab';

export const RoadmapPage: React.FC = () => {
  const { data, updateWeek } = useApp();
  const [expandedWeek, setExpandedWeek] = useState<number>(data.settings.currentWeek);
  const [editingWeek, setEditingWeek] = useState<WeekRoadmap | null>(null);
  const [copiedDemo, setCopiedDemo] = useState<number | null>(null);
  const [weekSubTabs, setWeekSubTabs] = useState<Record<number, 'plan' | 'report'>>({});

  const getActiveTab = (weekNumber: number): 'plan' | 'report' => weekSubTabs[weekNumber] || 'plan';
  const setWeekTab = (weekNumber: number, tab: 'plan' | 'report') => {
    setWeekSubTabs(prev => ({ ...prev, [weekNumber]: tab }));
  };

  const statusLabels: Record<WeekStatus, { label: string; variant: BadgeVariant }> = {
    not_started: { label: 'Chưa bắt đầu', variant: 'default' },
    in_progress: { label: 'Đang thực hiện', variant: 'primary' },
    ready_to_report: { label: 'Chờ báo cáo', variant: 'warning' },
    reported: { label: 'Đã báo cáo', variant: 'purple' },
    accepted: { label: 'Đã nghiệm thu', variant: 'success' },
  };

  const handleToggleChecklist = (week: WeekRoadmap, checklistId: string) => {
    const updatedChecklist = week.checklist.map(item => 
      item.id === checklistId ? { ...item, completed: !item.completed } : item
    );
    updateWeek({
      ...week,
      checklist: updatedChecklist
    });
  };

  const handleCopyDemo = (weekNum: number, script: string[]) => {
    navigator.clipboard.writeText(script.join('\n'));
    setCopiedDemo(weekNum);
    setTimeout(() => setCopiedDemo(null), 2000);
  };

  const handleSaveWeekEdit = () => {
    if (editingWeek) {
      updateWeek(editingWeek);
      setEditingWeek(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Milestone className="w-6 h-6 text-sky-500" />
            Lộ Trình Nghiên Cứu & Báo Cáo 7 Tuần
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kế hoạch chi tiết từ khảo sát xv6, thiết kế cấu trúc dữ liệu, triển khai tín hiệu, Job Control đến bảo vệ đồ án
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tuần trọng tâm:
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold font-mono text-xs">
            Tuần {data.settings.currentWeek}
          </span>
        </div>
      </div>

      {/* 7-Week Timeline Overview Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
        {data.weeks.map((w) => {
          const isCurrent = w.weekNumber === data.settings.currentWeek;
          const isExpanded = w.weekNumber === expandedWeek;
          const completedItems = w.checklist.filter(i => i.completed).length;
          const pct = w.checklist.length > 0 ? Math.round((completedItems / w.checklist.length) * 100) : 0;

          return (
            <button
              key={w.weekNumber}
              onClick={() => setExpandedWeek(w.weekNumber)}
              className={`p-2 sm:p-3 rounded-xl border text-left transition-all ${
                isExpanded
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/30 dark:bg-sky-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  T{w.weekNumber}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-500 animate-pulse" />
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                {w.title.split(':')[0]}
              </div>
              <div className="mt-1 sm:mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
                <span>{pct}%</span>
                <span className="font-mono hidden xs:inline">{w.customReportDate.slice(5)}</span>
              </div>
              <Progress value={pct} size="sm" className="mt-1" />
            </button>
          );
        })}
      </div>

      {/* Accordion / Detailed Week Cards */}
      <div className="space-y-4">
        {data.weeks.map((week) => {
          const isExpanded = week.weekNumber === expandedWeek;
          const completedCount = week.checklist.filter(c => c.completed).length;
          const progressPct = week.checklist.length > 0 
            ? Math.round((completedCount / week.checklist.length) * 100) 
            : 0;

          return (
            <Card
              key={week.weekNumber}
              className={`transition-all duration-200 ${
                isExpanded ? 'ring-1 ring-sky-500/30 shadow-md' : 'opacity-90'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                    week.status === 'accepted'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : week.weekNumber === data.settings.currentWeek
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {week.weekNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        Tuần {week.weekNumber}: {week.title}
                      </h3>
                      <Badge variant={statusLabels[week.status].variant}>
                        {statusLabels[week.status].label}
                      </Badge>
                      {week.weekNumber === data.settings.currentWeek && (
                        <span className="text-[10px] font-semibold text-sky-500 font-mono">
                          [Đang diễn ra]
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {week.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden md:flex flex-col items-end text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {week.customReportDate}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {completedCount}/{week.checklist.length} tiêu chí xong ({progressPct}%)
                    </span>
                  </div>
                  <button className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsed Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
                <div
                  className="bg-sky-500 h-1 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                  {/* Sub-tab Navigation: Kế hoạch vs Báo cáo tiến độ (Mẫu HUST) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setWeekTab(week.weekNumber, 'plan')}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          getActiveTab(week.weekNumber) === 'plan'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Kế hoạch</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWeekTab(week.weekNumber, 'report')}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          getActiveTab(week.weekNumber) === 'report'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Báo cáo (HUST)</span>
                        <Badge
                          variant={
                            week.report?.status === 'submitted' ? 'success' :
                            week.report?.status === 'approved' ? 'primary' :
                            week.report?.status === 'review' ? 'warning' : 'default'
                          }
                          className="text-[10px] py-0 px-1.5 font-normal hidden xs:inline-flex"
                        >
                          {week.report?.status === 'submitted' ? 'Đã nộp' :
                           week.report?.status === 'approved' ? 'Đã duyệt' :
                           week.report?.status === 'review' ? 'Chờ KT' : 'Nháp'}
                        </Badge>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {getActiveTab(week.weekNumber) === 'plan' 
                        ? 'Tiêu chí & phân công nhiệm vụ tuần' 
                        : 'Mẫu chuẩn 5 phần theo Progress-Report-template.docx'}
                    </div>
                  </div>

                  {getActiveTab(week.weekNumber) === 'report' ? (
                    <WeeklyProgressReportTab week={week} />
                  ) : (
                    <>
                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                            Ngày báo cáo: <strong>{week.customReportDate}</strong>
                          </span>
                          <span>·</span>
                          <span className="text-slate-500">
                            Cập nhật: {new Date(week.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Edit2 className="w-3.5 h-3.5" />}
                            onClick={() => setEditingWeek(week)}
                          >
                            Chỉnh sửa tuần này
                          </Button>
                        </div>
                      </div>

                      {/* 2 Columns: Goals & Deliverables */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Goals */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                            Mục tiêu tuần
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {week.goals.map((g, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                            Sản phẩm bàn giao
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {week.deliverables.map((d, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="font-medium">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 3 Members Specific Assignments */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Phân công nhiệm vụ cụ thể 3 thành viên
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {data.members.map((m) => {
                            const tasks = week.memberAssignments[m.id] || [];
                            return (
                              <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <img
                                    src={m.avatarUrl}
                                    alt={m.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                    {m.name}
                                  </span>
                                </div>
                                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                  {tasks.map((taskStr, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-sky-500 font-bold">›</span>
                                      <span>{taskStr}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Interactive Completion Checklist */}
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                              Tiêu chí nghiệm thu (Checklist)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Tích chọn để cập nhật tiến độ thực tế tuần
                            </p>
                          </div>
                          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                            {completedCount}/{week.checklist.length} ({progressPct}%)
                          </span>
                        </div>

                        <div className="space-y-2">
                          {week.checklist.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklist(week, item.id)}
                                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 mt-0.5"
                              />
                              <span
                                className={`text-xs leading-relaxed ${
                                  item.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-200 font-medium'
                                }`}
                              >
                                {item.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Demo Script & Terminal Commands */}
                      {week.demoScript && week.demoScript.length > 0 && (
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Terminal className="w-4 h-4 text-sky-400" />
                              <span className="font-semibold text-slate-300">Kịch bản Demo QEMU:</span>
                            </div>
                            <button
                              onClick={() => handleCopyDemo(week.weekNumber, week.demoScript)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                            >
                              {copiedDemo === week.weekNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Đã sao chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Sao chép lệnh</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="overflow-x-auto p-3 rounded-lg bg-black/50 text-slate-300 text-[11px] leading-relaxed">
                            {week.demoScript.join('\n')}
                          </pre>
                        </div>
                      )}

                      {/* Documents & Slides Links */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {week.pdfUrl && (
                          <a
                            href={week.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Báo cáo PDF</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                        {week.slideUrl && (
                          <a
                            href={week.slideUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                          >
                            <Presentation className="w-3.5 h-3.5" />
                            <span>Slide Thuyết Trình</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>

                      {/* Lecturer Feedback & Post-report requests */}
                      {week.lecturerFeedback && (
                        <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 text-xs space-y-2">
                          <div className="flex items-center gap-2 font-semibold text-sky-800 dark:text-sky-300">
                            <MessageSquare className="w-4 h-4" />
                            <span>Nhận xét của GVHD (TS. Phạm Văn Tiến):</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                            "{week.lecturerFeedback}"
                          </p>
                          {week.postReportRequests && week.postReportRequests.length > 0 && (
                            <div className="pt-2 border-t border-sky-500/20">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                                Yêu cầu chỉnh sửa sau báo cáo:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                                {week.postReportRequests.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal: Chỉnh sửa thông tin tuần */}
      {editingWeek && (
        <Modal
          isOpen={!!editingWeek}
          onClose={() => setEditingWeek(null)}
          title={`Chỉnh sửa Tuần ${editingWeek.weekNumber}: ${editingWeek.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Trạng thái tuần:</label>
              <select
                value={editingWeek.status}
                onChange={(e) => setEditingWeek({ ...editingWeek, status: e.target.value as WeekStatus })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="not_started">Chưa bắt đầu</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="ready_to_report">Chờ báo cáo</option>
                <option value="reported">Đã báo cáo</option>
                <option value="accepted">Đã nghiệm thu</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Ngày báo cáo (YYYY-MM-DD):</label>
              <input
                type="date"
                value={editingWeek.customReportDate}
                onChange={(e) => setEditingWeek({ ...editingWeek, customReportDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Link PDF Báo cáo:</label>
              <input
                type="text"
                value={editingWeek.pdfUrl || ''}
                onChange={(e) => setEditingWeek({ ...editingWeek, pdfUrl: e.target.value })}
                placeholder="https://raw.githubusercontent.com/.../BaoCao.pdf"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Link Slide:</label>
              <input
                type="text"
                value={editingWeek.slideUrl || ''}
                onChange={(e) => setEditingWeek({ ...editingWeek, slideUrl: e.target.value })}
                placeholder="https://docs.google.com/presentation/d/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Nhận xét của thầy:</label>
              <textarea
                rows={3}
                value={editingWeek.lecturerFeedback}
                onChange={(e) => setEditingWeek({ ...editingWeek, lecturerFeedback: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setEditingWeek(null)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSaveWeekEdit}>
                Lưu Thay Đổi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
