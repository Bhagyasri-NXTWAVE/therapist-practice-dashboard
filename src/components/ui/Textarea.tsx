import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', containerClassName = '', id, rows = 4, ...props }, ref) => {
    const generatedId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={generatedId} className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF] select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={generatedId}
          rows={rows}
          className={`w-full rounded-lg bg-white dark:bg-[#151D1A] border ${
            error
              ? 'border-rose-300 dark:border-rose-800/60 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-[#D9E4DD] dark:border-[#273730] focus:border-[#2D5A4A] dark:focus:border-[#4B8570] focus:ring-[#2D5A4A]/15'
          } text-sm text-[#1C2321] dark:text-[#E4EDE7] placeholder-[#8F9E97] dark:placeholder-[#5E736A] p-3 focus:outline-none focus:ring-2 disabled:bg-[#F3F6F4] dark:disabled:bg-[#1E2924] disabled:cursor-not-allowed transition-colors resize-y leading-relaxed ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B7D75] dark:text-[#889B92]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
