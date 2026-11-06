import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  trafficLights?: boolean;
  macTitle?: React.ReactNode;
  macAction?: React.ReactNode;
  variant?: 'default' | 'mac' | 'frosted';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  trafficLights = false,
  macTitle,
  macAction,
  variant = 'default',
  ...props 
}) => {
  const isMac = variant === 'mac' || trafficLights || macTitle !== undefined;

  return (
    <div
      className={`bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-[22px] shadow-apple dark:shadow-apple-dark overflow-hidden relative ${
        hover ? 'transition-all duration-300 hover:border-slate-300/90 dark:hover:border-slate-700/90 hover:-translate-y-1 hover:shadow-apple-hover' : ''
      } ${className}`}
      {...props}
    >
      {/* macOS Window Header Bar */}
      {isMac && (
        <div className="ds-mac-titlebar px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* ba chấm macOS chỉ hiện trên màn hình rộng, điện thoại cần chỗ cho tiêu đề */}
            <span className="hidden sm:inline-flex shrink-0" aria-hidden="true">
              <span className="ds-mac-dots">
                <span className="ds-mac-dot ds-mac-dot-red" />
                <span className="ds-mac-dot ds-mac-dot-yellow" />
                <span className="ds-mac-dot ds-mac-dot-green" />
              </span>
            </span>
            {macTitle && (
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 sm:ml-2 tracking-tight flex items-center gap-1.5 min-w-0 truncate">
                {macTitle}
              </div>
            )}
          </div>
          {macAction && (
            <div className="flex items-center gap-2 shrink-0">
              {macAction}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 pb-3 sm:pb-3 border-b border-slate-100 dark:border-slate-800/60 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight font-sans">{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-[22px] ${className}`}>
    {children}
  </div>
);
