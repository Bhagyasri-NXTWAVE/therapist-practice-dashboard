import React from 'react';

export interface SerenityLogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SerenityLogo: React.FC<SerenityLogoProps> = ({
  showTagline = false,
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Soft organic logo shape: twin calming pebble leaves */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Base soft organic petal */}
          <path
            d="M8 20C8 12.5 13.5 7 21 7C28.5 7 29 16 23 23C17 30 8 27.5 8 20Z"
            fill="#1E3A2F"
            className="dark:fill-[#2F5E4E] transition-colors"
          />
          {/* Intersecting soft sage petal */}
          <path
            d="M26 15C26 22 21 27 14 27C7.5 27 7 19 13 13C19 7 26 8.5 26 15Z"
            fill="#8EA89D"
            fillOpacity="0.82"
            className="dark:fill-[#668B7C] transition-colors"
          />
          {/* Gentle core accent */}
          <circle cx="18.5" cy="18.5" r="2.5" fill="#FAF9F6" className="dark:fill-[#121614]" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`tracking-tight text-[#182C23] dark:text-[#E8F0EC] ${textSizes[size]}`}>
          Serenity
        </span>
        {showTagline && (
          <span className="text-[11px] text-[#697B72] dark:text-[#8E9F95] font-normal -mt-0.5">
            A calmer practice
          </span>
        )}
      </div>
    </div>
  );
};
