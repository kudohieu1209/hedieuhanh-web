import React from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const { data, theme, toggleTheme } = useApp();

  // Compute days until next report
  const calculateDaysLeft = (targetDateStr: string) => {
    try {
      const target = new Date(targetDateStr);
      const now = new Date();
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const daysLeft = calculateDaysLeft(data.settings.nextReportDate);
  const currentWeekObj = data.weeks.find(w => w.weekNumber === data.settings.currentWeek);

  return (
    <div className="flex flex-col shrink-0 sticky top-0 z-30">
      {/* Incident.io Style Top Banner */}
      <div className="ds-top-bar px-3 sm:px-6 py-2 text-xs flex items-center justify-between border-b transition-colors">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold font-mono tracking-wide bg-sky-500 text-white shadow-xs shrink-0">
            HUST · ĐỒ ÁN #27
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate text-xs">
            Báo cáo Tuần {data.settings.currentWeek}
            {currentWeekObj?.report && (
              <>: <strong>{currentWeekObj.report.reportPeriodFrom} – {currentWeekObj.report.reportPeriodTo}</strong></>
            )}
            {' '}· Hạn báo cáo: <strong>{data.settings.nextReportDate}</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            <span>Chi tiết tiến độ &amp; nộp báo cáo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Apple Frosted Glass Top Bar */}
      <header className="h-14 bg-white/85 dark:bg-[#0d131f]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 flex items-center justify-between transition-colors shadow-2xs">
        {/* Left: Mobile Toggle & Week Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Week Pill with macOS Pulse Dot */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs shadow-2xs">
              <span className="ds-live-dot" />
              <span className="font-bold text-slate-900 dark:text-white">
                Tuần {data.settings.currentWeek} / 7
              </span>
              <span className="hidden sm:inline text-slate-400">·</span>
              <span className="hidden sm:inline text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">
                {currentWeekObj?.title || 'Đang thực hiện'}
              </span>
            </div>

            {/* Next Report Countdown */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium px-3 py-1.5 rounded-full bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Hạn báo cáo:</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">
                {data.settings.nextReportDate}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold shadow-2xs">
                {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hôm nay!'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle & GitHub */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors shadow-2xs"
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng (Apple Canvas)' : 'Chuyển sang Giao diện Tối'}
            aria-label="Đổi giao diện"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>

          {/* GitHub Pill Button */}
          <a
            href={data.settings.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </header>
    </div>
  );
};
