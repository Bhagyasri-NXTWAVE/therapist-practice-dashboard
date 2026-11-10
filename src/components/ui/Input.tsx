import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', containerClassName = '', id, ...props }, ref) => {
    const generatedId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={generatedId} className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF] select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#6D8378] dark:text-[#7A9186] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={generatedId}
            className={`w-full rounded-lg bg-white dark:bg-[#151D1A] border ${
              error
                ? 'border-rose-300 dark:border-rose-800/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#D9E4DD] dark:border-[#273730] focus:border-[#2D5A4A] dark:focus:border-[#4B8570] focus:ring-[#2D5A4A]/15'
            } text-sm text-[#1C2321] dark:text-[#E4EDE7] placeholder-[#8F9E97] dark:placeholder-[#5E736A] transition-colors py-2 focus:outline-none focus:ring-2 disabled:bg-[#F3F6F4] dark:disabled:bg-[#1E2924] disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#6D8378] dark:text-[#7A9186] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B7D75] dark:text-[#889B92]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
