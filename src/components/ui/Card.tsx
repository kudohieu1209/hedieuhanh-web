import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xs ${
        hover ? 'hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-5 pb-3 border-b border-slate-100 dark:border-slate-800/60 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-xl ${className}`}>
    {children}
  </div>
);
