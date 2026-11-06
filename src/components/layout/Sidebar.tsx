import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Milestone, 
  Users, 
  CheckSquare, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { data, overallProgress } = useApp();

  const navItems: { to: string; label: string; icon: typeof LayoutDashboard; badge?: string; badgeColor?: string }[] = [
    { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Lộ trình 7 tuần', icon: Milestone, badge: `T${data.settings.currentWeek}` },
    { to: '/members', label: 'Thành viên', icon: Users, badge: '3' },
    { to: '/tasks', label: 'Quản lý nhiệm vụ', icon: CheckSquare, badge: data.tasks.filter(t => t.status !== 'done').length.toString() },
    { to: '/knowledge', label: 'Kiến thức cần nắm', icon: BookOpen, badge: data.knowledgeTopics.length.toString() },
    { to: '/questions', label: 'Ôn tập bảo vệ', icon: GraduationCap, badge: data.defenseQuestions.length.toString() },
    { to: '/documents', label: 'Tài liệu & Báo cáo', icon: FileText, badge: data.documents.length.toString() },
  ];

  return (
    <aside className="w-full md:w-64 bg-white/90 dark:bg-[#0d131f]/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full select-none shrink-0 transition-colors">
      {/* Brand & Logo with macOS Traffic Light Window Control */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
        {/* macOS Traffic Light Dots */}
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="ds-mac-dots" aria-hidden="true">
            <span className="ds-mac-dot ds-mac-dot-red" />
            <span className="ds-mac-dot ds-mac-dot-yellow" />
            <span className="ds-mac-dot ds-mac-dot-green" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            xv6-riscv workstation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0 ring-2 ring-sky-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none font-sans">
                xv6 Team Hub
              </h1>
              <span className="px-1.5 py-0.5 text-[9.5px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full font-bold border border-sky-300/40 dark:border-sky-700/40">
                #27
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
              TTY Layer &amp; Job Control
            </p>
          </div>
        </div>

        {/* Overall Progress Widget */}
        <div className="mt-3.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="ds-live-dot" />
              Tiến độ đồ án HUST
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Menu Điều Hướng
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:text-sky-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* GitHub External Section */}
        <div className="pt-3">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Kho Lưu Trữ Đồ Án
          </div>
          <a
            href={data.settings.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Terminal className="w-4 h-4 shrink-0 text-sky-500" />
              <span className="truncate font-mono">hedieuhanh-hust</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </a>
        </div>
      </nav>

    </aside>
  );
};
