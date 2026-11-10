import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#D2DFD8] dark:border-[#24362E] bg-[#FAFBF9] dark:bg-[#151D1A]/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] dark:bg-[#202E27] text-[#24493B] dark:text-[#A7C8B8] flex items-center justify-center mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#182C23] dark:text-[#E2EDE7] mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-[#62766D] dark:text-[#889E93] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
