import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'underline',
}) => {
  if (variant === 'pills') {
    return (
      <div className={`inline-flex p-1 bg-[#EEF3F0] dark:bg-[#18231E] rounded-xl border border-[#D9E4DD] dark:border-[#26372F] gap-1 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-[#25362E] text-[#1B352A] dark:text-white shadow-xs font-semibold'
                  : 'text-[#586D63] dark:text-[#889F94] hover:text-[#1B352A] dark:hover:text-white'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-[#E2ECE6] text-[#1E3A2F] dark:bg-[#1A2621] dark:text-[#B5CCC1]'
                      : 'bg-[#DEE7E2] text-[#556960] dark:bg-[#1C2822] dark:text-[#7A8E85]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`border-b border-[#E2ECE7] dark:border-[#23312B] flex gap-6 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 pt-1 text-sm font-medium transition-colors select-none flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'text-[#1E3A2F] dark:text-[#E2ECE7] font-semibold'
                : 'text-[#6A7D74] dark:text-[#859A8F] hover:text-[#1E3A2F] dark:hover:text-white'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                  isActive
                    ? 'bg-[#E5ECE8] text-[#1E3A2F] dark:bg-[#2A3B33] dark:text-[#B8CEC4]'
                    : 'bg-[#F0F4F2] text-[#697B72] dark:bg-[#1F2C26] dark:text-[#7D9388]'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D5A4A] dark:bg-[#48806E] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
