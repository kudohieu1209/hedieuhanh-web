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
  TestTube2, 
  MessageSquare, 
  Settings,
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { data, currentMember, overallProgress } = useApp();

  const navItems = [
    { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Lộ trình 7 tuần', icon: Milestone, badge: `T${data.settings.currentWeek}` },
    { to: '/members', label: 'Thành viên', icon: Users, badge: '3' },
    { to: '/tasks', label: 'Quản lý nhiệm vụ', icon: CheckSquare, badge: data.tasks.filter(t => t.status !== 'done').length.toString() },
    { to: '/knowledge', label: 'Kiến thức cần nắm', icon: BookOpen, badge: data.knowledgeTopics.length.toString() },
    { to: '/questions', label: 'Ôn tập bảo vệ', icon: GraduationCap, badge: data.defenseQuestions.length.toString() },
    { to: '/documents', label: 'Tài liệu & Báo cáo', icon: FileText, badge: data.documents.length.toString() },
    { to: '/tests', label: 'Kiểm thử & Lỗi', icon: TestTube2, badge: data.bugs.filter(b => b.status === 'open').length > 0 ? `${data.bugs.filter(b => b.status === 'open').length} lỗi` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { to: '/meetings', label: 'Nhận xét giảng viên', icon: MessageSquare, badge: data.meetings.length.toString() },
    { to: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0d131f] border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-full select-none shrink-0 transition-colors">
      {/* Brand & Logo */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                xv6 Team Hub
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded font-semibold">
                #27
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
              TTY Layer & Job Control
            </p>
          </div>
        </div>

        {/* Overall Progress Widget */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              Tiến độ đồ án
            </span>
            <span className="font-semibold font-mono text-slate-900 dark:text-white">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Menu Quản lý
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-sky-500" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* GitHub External Section */}
        <div className="pt-3">
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Kho Lưu Trữ
          </div>
          <a
            href={data.settings.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Terminal className="w-4 h-4 shrink-0" />
              <span className="truncate">hedieuhanh-hust</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </a>
        </div>
      </nav>

      {/* Current Active Member Footer Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
        <NavLink
          to="/members"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
        >
          <img
            src={currentMember.avatarUrl}
            alt={currentMember.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-500 transition-colors">
              {currentMember.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {currentMember.role}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </NavLink>
      </div>
    </aside>
  );
};
