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
  barColor = 'bg-sky-500',
  showText = false,
  size = 'md',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Tiến độ</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${barColor} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
