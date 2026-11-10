import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  color?: 'green' | 'blue' | 'amber' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  color = 'sage',
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const colorClasses = {
    green: 'bg-emerald-500 dark:bg-emerald-400',
    blue: 'bg-teal-600 dark:bg-teal-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    sage: 'bg-[#2D5A4A] dark:bg-[#4E8875]',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-medium text-[#465A51] dark:text-[#A7BCB2]">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-[#1F332A] dark:text-[#E2EDE7] tabular-nums">{clamped}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#E5ECE8] dark:bg-[#202E27] rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
