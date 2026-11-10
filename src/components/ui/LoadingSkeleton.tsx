import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'rounded-md h-4 w-full',
    rectangular: 'rounded-xl w-full h-24',
    circular: 'rounded-full w-10 h-10',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={style}
      className={`animate-pulse bg-[#E5EDE8] dark:bg-[#202E27] ${variantStyles[variant]} ${className}`}
    />
  );
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#18221E] border border-[#E4ECE7] dark:border-[#23312B] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" className="w-24 h-3.5" />
        <LoadingSkeleton variant="circular" className="w-8 h-8" />
      </div>
      <LoadingSkeleton variant="text" className="w-28 h-7 mt-1" />
      <LoadingSkeleton variant="text" className="w-20 h-3" />
    </div>
  );
};
