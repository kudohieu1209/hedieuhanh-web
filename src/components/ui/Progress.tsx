import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  barColor?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  barColor = 'bg-gradient-to-r from-red-600 to-amber-500',
  showText = false,
  size = 'md',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
          <span>Tiến độ hoàn thành</span>
          <span className="text-red-700 dark:text-red-400">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/50 ${sizes[size]} shadow-inner`}>
        <div
          className={`${barColor} h-full rounded-full transition-all duration-500 ease-out shadow-xs`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
