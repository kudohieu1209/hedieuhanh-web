import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Database, AlertTriangle, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { data, isRemote } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isDemo = data.settings.mode === 'demo' || !isRemote;

  return (
    <div
      className={`relative px-4 py-2 text-xs font-medium border-b backdrop-blur-md transition-all flex items-center justify-between gap-3 ${
        isDemo
          ? 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/20 dark:bg-amber-950/20'
          : 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-emerald-500/20 dark:bg-emerald-950/20'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {isDemo ? (
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDemo ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isDemo ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </span>

        <span className="truncate text-[11px] sm:text-xs">
          {isDemo ? (
            <>
              <strong className="font-semibold uppercase tracking-wider text-[10px] mr-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                Demo Mode
              </strong>
              <span className="hidden sm:inline font-medium">
                Dữ liệu đang lưu cục bộ trên trình duyệt. Kết nối Supabase PostgreSQL để đồng bộ thời gian thực cho 3 thành viên.
              </span>
              <span className="sm:hidden font-medium text-slate-700 dark:text-slate-300">
                Dữ liệu lưu cục bộ trình duyệt
              </span>
            </>
          ) : (
            <>
              <strong className="font-semibold uppercase tracking-wider text-[10px] mr-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                Team Cloud
              </strong>
              <span className="hidden sm:inline font-medium">
                Đã kết nối Supabase Cloud. Dữ liệu đang được đồng bộ hóa thời gian thực giữa 3 thành viên.
              </span>
              <span className="sm:hidden font-medium text-slate-700 dark:text-slate-300">
                Đang đồng bộ qua Supabase
              </span>
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {isDemo && (
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/30 transition-all text-[11px] sm:text-xs font-bold shadow-2xs hover:scale-102"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Kết nối Cloud</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-current opacity-60 hover:opacity-100"
          title="Đóng thanh thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
