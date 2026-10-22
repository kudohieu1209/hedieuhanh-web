import React, { useState } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  ChevronDown, 
  Check, 
  Clock, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MemberId } from '../../types';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const { data, currentMember, setCurrentMemberId, theme, toggleTheme } = useApp();
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

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
    <header className="h-14 bg-white/95 dark:bg-[#0d131f]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle & Week Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Week Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Tuần {data.settings.currentWeek} / 7
            </span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">
              {currentWeekObj?.title || 'Đang thực hiện'}
            </span>
          </div>

          {/* Next Report Countdown */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Báo cáo kế tiếp:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {data.settings.nextReportDate}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
              {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hôm nay!'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick User Switcher, Theme Toggle & GitHub */}
      <div className="flex items-center gap-2.5">
        {/* Member Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-medium"
          >
            <img
              src={currentMember.avatarUrl}
              alt={currentMember.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500/40"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
              {currentMember.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {memberDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMemberDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Đổi người dùng làm việc
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chuyển đổi góc nhìn giữa 3 thành viên
                  </div>
                </div>

                <div className="space-y-0.5">
                  {data.members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentMemberId(member.id as MemberId);
                        setMemberDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        member.id === currentMember.id
                          ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{member.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{member.role}</div>
                        </div>
                      </div>
                      {member.id === currentMember.id && (
                        <Check className="w-4 h-4 text-sky-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          aria-label="Đổi giao diện"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* GitHub Button */}
        <a
          href={data.settings.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
};
