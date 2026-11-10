import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className = '',
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`bg-white dark:bg-[#18221E] border border-[#E4ECE7] dark:border-[#23312B] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-[0_4px_16px_rgba(30,58,47,0.06)] hover:border-[#D1E0D7] dark:hover:border-[#2E4239]' : ''
      } ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
