import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  statusIndicator?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  statusIndicator,
  className = '',
}) => {
  const [hasError, setHasError] = React.useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-medium',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    away: 'bg-amber-400',
    offline: 'bg-zinc-400',
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#E0E8E3] dark:border-[#2A3831] shadow-xs`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#E5ECE8] dark:bg-[#273830] text-[#1E3A2F] dark:text-[#A4C2B4] font-medium flex items-center justify-center border border-[#D5E1DA] dark:border-[#31453C] select-none`}
        >
          {initials}
        </div>
      )}
      {statusIndicator && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#161D1A] ${statusSizeClasses[size]} ${statusColors[statusIndicator]}`}
        />
      )}
    </div>
  );
};
