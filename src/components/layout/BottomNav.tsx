import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Milestone, 
  CheckSquare, 
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const BottomNav: React.FC = () => {
  const { data } = useApp();

  const uncompletedTasksCount = data.tasks.filter(t => t.status !== 'done').length;

  const navItems = [
    { to: '/', label: 'Lộ trình', icon: Milestone, badge: `T${data.settings.currentWeek}` },
    { to: '/tasks', label: 'Nhiệm vụ', icon: CheckSquare, badge: uncompletedTasksCount > 0 ? uncompletedTasksCount.toString() : undefined },
    { to: '/questions', label: 'Ôn tập', icon: GraduationCap },
  ];

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/90 dark:bg-[#0d131f]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-full px-3 py-2 transition-all shadow-apple dark:shadow-apple-dark"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all relative ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-sky-500' : ''}`} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold font-mono rounded-full bg-sky-500 text-white shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold mt-0.5 tracking-tight truncate max-w-[72px]">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-4 h-0.5 bg-sky-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* GitHub: mở repo mã nguồn */}
        <a
          href={data.settings.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-full text-slate-500 hover:text-slate-900 active:scale-95 transition-all"
        >
          <GithubIcon className="w-5 h-5" />
          <span className="text-xs font-mono font-bold mt-0.5 tracking-tight">
            GitHub
          </span>
        </a>
      </div>
    </nav>
  );
};
