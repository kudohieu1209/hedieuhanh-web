import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Milestone, 
  CheckSquare, 
  GraduationCap, 
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  onOpenMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMenu }) => {
  const { data } = useApp();

  const uncompletedTasksCount = data.tasks.filter(t => t.status !== 'done').length;

  const navItems = [
    { to: '/', label: 'Lộ trình', icon: Milestone, badge: `T${data.settings.currentWeek}` },
    { to: '/tasks', label: 'Nhiệm vụ', icon: CheckSquare, badge: uncompletedTasksCount > 0 ? uncompletedTasksCount.toString() : undefined },
    { to: '/knowledge', label: 'Kiến thức', icon: BookOpen },
    { to: '/questions', label: 'Ôn tập', icon: GraduationCap },
  ];

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/90 dark:bg-[#0d131f]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-full px-3 py-2 transition-all shadow-apple dark:shadow-apple-dark"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-lg mx-auto">
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
                  <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[60px] ${isActive ? 'font-bold' : 'font-medium'}`}>
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

        {/* Menu More Button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95 transition-all"
          aria-label="Mở tất cả menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
            Thêm
          </span>
        </button>
      </div>
    </nav>
  );
};
