import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#1E3A2F] hover:bg-[#274D3E] text-white shadow-sm hover:shadow dark:bg-[#2D5A4A] dark:hover:bg-[#386F5C]',
    secondary:
      'bg-[#EEF3F0] hover:bg-[#E2ECE6] text-[#1E3A2F] dark:bg-[#23312B] dark:hover:bg-[#2C3E37] dark:text-[#A4C2B4]',
    outline:
      'border border-[#D4E0D9] hover:border-[#8EA89D] text-[#2C3E37] bg-white hover:bg-[#F7F9F8] dark:border-[#2C3E37] dark:bg-[#1A2320] dark:text-[#D1DDD6] dark:hover:bg-[#222E29]',
    ghost:
      'text-[#4A5D54] hover:text-[#1E3A2F] hover:bg-[#F0F4F2] dark:text-[#9FB2A8] dark:hover:text-white dark:hover:bg-[#23312B]',
    danger:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
