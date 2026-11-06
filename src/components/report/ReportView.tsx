import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { WeekRoadmap } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

// Hiển thị (chỉ đọc) nội dung báo cáo tuần, lấy từ file .docx chính thức (xem weeklyReports.ts).
export const ReportView: React.FC<{ week: WeekRoadmap }> = ({ week }) => {
  const { data } = useApp();
  const r = week.report;
  const external = !!week.reportFileUrl && /^https?:/.test(week.reportFileUrl);

  const download = week.reportFileUrl && (
    <a
      href={week.reportFileUrl}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition-colors"
    >
      {external ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
      {external ? 'Xem báo cáo trên OneDrive' : 'Tải file .docx'}
    </a>
  );

  if (!r) {
    return <div className="text-xs text-slate-500">Chưa có báo cáo cho tuần này. {download}</div>;
  }

  const lines = (text: string) =>
    text.split('\n').map(l => l.trim()).filter(Boolean);

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h4>
      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">{children}</div>
    </section>
  );

  const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
          <span>{t.replace(/^- /, '')}</span>
        </li>
      ))}
    </ul>
  );

  const next = lines(r.todo.nextPeriodTasks);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {r.reportPeriodFrom} – {r.reportPeriodTo}
          </span>
          <Badge variant={r.status === 'submitted' ? 'success' : 'default'}>
            {r.status === 'submitted' ? 'Đã nộp' : 'Bản nháp'}
          </Badge>
        </div>
        {download}
      </div>

      <Section title="1. Tóm tắt tiến độ">
        {r.summaryOfProgress.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <Section title="2. Hoạt động kỹ thuật">
        {r.technicalActivities.map(a => (
          <p key={a.id}><strong className="text-slate-900 dark:text-white">{a.name}.</strong> {a.description}</p>
        ))}
      </Section>

      <Section title="3. Đóng góp của từng thành viên">
        {data.members.map(m => {
          const c = r.contributions[m.id];
          if (!c) return null;
          return (
            <div key={m.id} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 mb-1">
                <img src={m.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                <strong className="text-slate-900 dark:text-white">{m.name}</strong>
                <span className="text-[11px] text-slate-500">({c.assignedRole})</span>
              </div>
              <p>{c.technicalWork}</p>
              {c.outputsAchieved && <p className="mt-1"><strong>Output:</strong> {c.outputsAchieved}</p>}
            </div>
          );
        })}
      </Section>

      <Section title="4. Mã nguồn và kiểm thử">
        <p><strong className="text-slate-900 dark:text-white">a. Thuật toán:</strong> {r.codeReview.algorithmicDevelopment}</p>
        <p><strong className="text-slate-900 dark:text-white">b. Mã nguồn:</strong> {r.codeReview.sourceCodeEnhanced}</p>
        <p><strong className="text-slate-900 dark:text-white">c. Kết quả kiểm thử:</strong> {r.codeReview.testingResult}</p>
      </Section>

      <Section title="5. Việc còn lại">
        <p className="font-semibold text-slate-900 dark:text-white">a) Vấn đề còn tồn tại</p>
        <Bullets items={lines(r.todo.remainingIssues)} />
        <p className="font-semibold text-slate-900 dark:text-white pt-1">{next[0]}</p>
        <Bullets items={next.slice(1)} />
        <p><strong className="text-slate-900 dark:text-white">c) Mốc tiếp theo:</strong> {r.todo.milestone}</p>
      </Section>

      <p className="text-[11px] text-slate-400">
        Mục 6 (ảnh minh chứng) chỉ có trong file báo cáo. Nội dung trên lấy từ file .docx của tuần {week.weekNumber}.
      </p>
    </div>
  );
};
