import React from 'react';
import { Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Topbar: React.FC = () => {
  const { data } = useApp();
  const currentWeekObj = data.weeks.find(w => w.weekNumber === data.settings.currentWeek);

  const pill =
    'flex items-center gap-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-full px-3.5 py-1.5 shadow-apple dark:shadow-apple-dark text-xs';

  return (
    <>
      {/* Điện thoại: 2 pill nổi trái / phải, cùng kiểu thanh điều hướng dưới (nội dung cuộn bên dưới) */}
      <div className="md:hidden fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] left-3.5 right-3.5 z-40 flex items-center justify-between pointer-events-none">
        <div className={`${pill} pointer-events-auto`}>
          <Terminal className="w-3.5 h-3.5 text-red-600" />
          <span className="font-bold font-mono text-slate-900 dark:text-slate-100">xv6-riscv</span>
        </div>
        <div className={`${pill} pointer-events-auto`}>
          <span className="ds-live-dot" />
          <span className="font-bold font-mono text-slate-900 dark:text-slate-100">Tuần {data.settings.currentWeek}/7</span>
        </div>
      </div>

      {/* Máy tính */}
      <header className="hidden md:flex shrink-0 sticky top-0 z-30 h-14 bg-white/85 dark:bg-[#0d131f]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-xs shadow-2xs">
          <span className="ds-live-dot" />
          <span className="font-bold font-mono text-slate-900 dark:text-slate-100">Tuần {data.settings.currentWeek}/7</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[320px]">
            {currentWeekObj?.title || 'Đang thực hiện'}
          </span>
        </div>
        <a
          href={data.settings.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>
      </header>
    </>
  );
};
