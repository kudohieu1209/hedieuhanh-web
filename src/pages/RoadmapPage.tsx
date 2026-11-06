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
  AlertCircle,
  BookOpen,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { WeekRoadmap, WeekStatus } from '../types';

export const RoadmapPage: React.FC = () => {
  const { data } = useApp();
  const [expandedWeek, setExpandedWeek] = useState<number>(data.settings.currentWeek);

  const [copiedDemo, setCopiedDemo] = useState<number | null>(null);

  const statusLabels: Record<WeekStatus, { label: string; variant: BadgeVariant }> = {
    not_started: { label: 'Chưa bắt đầu', variant: 'default' },
    in_progress: { label: 'Đang thực hiện', variant: 'primary' },
    ready_to_report: { label: 'Chờ báo cáo', variant: 'warning' },
    reported: { label: 'Đã báo cáo', variant: 'purple' },
    accepted: { label: 'Đã nghiệm thu', variant: 'success' },
  };

  const handleCopyDemo = (weekNum: number, script: string[]) => {
    navigator.clipboard.writeText(script.join('\n'));
    setCopiedDemo(weekNum);
    setTimeout(() => setCopiedDemo(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div>
          <div className="ds-hero-badge mb-2">
            <Milestone className="w-3.5 h-3.5 text-red-600" />
            <span>KẾ HOẠCH BẢO VỆ ĐỒ ÁN HUST</span>
          </div>
          <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Lộ Trình <em>7 Tuần</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            TTY Layer &amp; Job Control trên xv6-riscv: mục tiêu, phân công và báo cáo của từng tuần.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tuần trọng tâm:
          </span>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold font-mono text-xs shadow-xs">
            Tuần {data.settings.currentWeek}
          </span>
        </div>
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
              id={`week-card-${week.weekNumber}`}
              className={`transition-all duration-300 scroll-mt-24 ${
                isExpanded ? 'ring-2 ring-red-500/20 shadow-apple' : 'opacity-95'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                className="p-3.5 sm:p-5 flex items-center justify-between gap-2 sm:gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors select-none"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-xs ${
                    week.status === 'accepted'
                      ? 'bg-emerald-500 text-white'
                      : week.weekNumber === data.settings.currentWeek
                      ? 'bg-gradient-to-tr from-red-600 to-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {week.weekNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 sm:truncate">
                        Tuần {week.weekNumber}: {week.title}
                      </h3>
                      <Badge variant={statusLabels[week.status].variant}>
                        {statusLabels[week.status].label}
                      </Badge>
                      {week.weekNumber === data.settings.currentWeek && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300/50">
                          [Đang diễn ra]
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 sm:truncate font-medium">
                      {week.subtitle}
                    </p>
                    {/* Tiến độ của tuần: thanh + số tiêu chí đã xong + phần trăm */}
                    <div className="mt-2 flex items-center gap-2.5 max-w-sm">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-red-600 to-amber-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {completedCount}/{week.checklist.length} · {progressPct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden md:flex flex-col items-end text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {week.customReportDate}
                    </span>
                  </div>
                  <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <div className="p-3.5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4 sm:space-y-6">
                  {/* Hàng trên: Hạn báo cáo + Nút báo cáo */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>Hạn báo cáo: <strong className="font-mono text-slate-900 dark:text-white">{week.customReportDate}</strong></span>
                    </div>
                    {week.reportFileUrl && (
                      <a
                        href={week.reportFileUrl}
                        {...(/^https?:/.test(week.reportFileUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xs shadow-red-600/30 transition-all shrink-0 active:scale-95"
                      >
                        {/^https?:/.test(week.reportFileUrl) ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span>Xem báo cáo</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 shrink-0" />
                            <span>Tải báo cáo</span>
                          </>
                        )}
                      </a>
                    )}
                  </div>

                      {/* 2 Columns: Goals & Deliverables */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mục tiêu tuần + kiến thức cần nắm (gộp một khối) */}
                        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                            <span className="ds-live-dot" />
                            Mục tiêu &amp; kiến thức cần nắm
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            {week.goals.map((g, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{g}</span>
                              </li>
                            ))}
                          </ul>
                          {(() => {
                            const topics = data.knowledgeTopics.filter(t => t.weeks?.includes(week.weekNumber));
                            if (topics.length === 0) return null;
                            return (
                              <ul className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                                {topics.map(t => (
                                  <li key={t.id} className="flex items-start gap-2">
                                    <BookOpen className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                                    <Link
                                      to={`/knowledge?topic=${t.id}`}
                                      className="font-semibold text-red-700 dark:text-red-300 hover:underline leading-relaxed"
                                    >
                                      {t.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            );
                          })()}
                        </div>

                        {/* Deliverables */}
                        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                            <span className="ds-live-dot" />
                            Sản phẩm bàn giao
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            {week.deliverables.map((d, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="font-semibold leading-relaxed">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 3 Members Specific Assignments */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Phân công nhiệm vụ cụ thể 3 thành viên
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {data.members.map((m) => {
                            const tasks = week.memberAssignments[m.id] || [];
                            return (
                              <div key={m.id} className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs">
                                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                  <img
                                    src={m.avatarUrl}
                                    alt={m.name}
                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-red-500/40"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                                      {m.name}
                                    </span>
                                  </div>
                                </div>
                                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                  {tasks.map((taskStr, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-amber-600 font-bold">›</span>
                                      <span className="leading-relaxed">{taskStr}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Interactive Completion Checklist */}
                      <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                              Tiêu chí nghiệm thu (Checklist)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Đã xong / chưa xong, cập nhật trong mã nguồn (initialWeeks.ts)
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/60">
                            {completedCount}/{week.checklist.length} ({progressPct}%)
                          </span>
                        </div>

                        <div className="space-y-2">
                          {week.checklist.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                readOnly
                                disabled
                                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 mt-0.5"
                              />
                              <span
                                className={`text-xs leading-relaxed ${
                                  item.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-200 font-semibold'
                                }`}
                              >
                                {item.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Demo Script & Terminal Commands in macOS Window Box */}
                      {week.demoScript && week.demoScript.length > 0 ? (
                        <div className="ds-mac-window bg-slate-950 text-slate-100 font-mono text-xs border-slate-800">
                          <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="hidden sm:inline-flex" aria-hidden="true">
                                <span className="ds-mac-dots">
                                  <span className="ds-mac-dot ds-mac-dot-red" />
                                  <span className="ds-mac-dot ds-mac-dot-yellow" />
                                  <span className="ds-mac-dot ds-mac-dot-green" />
                                </span>
                              </span>
                              <span className="text-[11px] font-bold text-slate-300 font-mono truncate">
                                qemu-demo-script.sh
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyDemo(week.weekNumber, week.demoScript)}
                              className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-xs"
                            >
                              {copiedDemo === week.weekNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Đã sao chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Sao chép</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-emerald-400 text-xs leading-relaxed">
                            {week.demoScript.join('\n')}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Tuần này chưa có kịch bản demo.</p>
                      )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

    </div>
  );
};
