import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { SerenityLogo } from './SerenityLogo';
import { Avatar } from '../ui/Avatar';
import { usePractice } from '../../context/PracticeContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  onOpenHelp,
}) => {
  const { therapist, conversations } = usePractice();
  const location = useLocation();

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      to: '/patients',
      label: 'Patients',
      icon: Users,
      badge: undefined,
    },
    {
      to: '/calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: undefined,
    },
    {
      to: '/sessions',
      label: 'Sessions',
      icon: FileText,
      badge: undefined,
    },
    {
      to: '/messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
    },
    {
      to: '/billing',
      label: 'Billing',
      icon: CreditCard,
      badge: undefined,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAFBF9] dark:bg-[#151D1A] border-r border-[#E5EDE8] dark:border-[#223029] select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#EAF0EC] dark:border-[#1F2C26]">
        <SerenityLogo showTagline size="md" />
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-[#667970] hover:text-[#192B23] hover:bg-[#EEF3F0] dark:hover:bg-[#202E27] dark:text-[#889B92]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#798C82] dark:text-[#677D72]">
          Practice Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/'
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#1E3A2F] text-white shadow-xs dark:bg-[#2D5A4A]'
                  : 'text-[#485B52] dark:text-[#9FB1A8] hover:bg-[#EEF3F0] dark:hover:bg-[#1E2A24] hover:text-[#182C23] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-[#6C8075] dark:text-[#7A8F84] group-hover:text-[#1E3A2F] dark:group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {typeof item.badge !== 'undefined' && (
                <span
                  className={`px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Subtle Portfolio Notice Banner */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-[#F0F5F2] dark:bg-[#1A2520] border border-[#DEE7E1] dark:border-[#25352E]">
        <div className="flex items-center gap-2 text-xs font-medium text-[#244638] dark:text-[#9EC1B1]">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#2D5A4A] dark:text-[#4B8570]" />
          <span>Fictional Practice Demo</span>
        </div>
        <p className="text-[11px] text-[#697E74] dark:text-[#7E9388] mt-1 leading-snug">
          All client profiles & metrics are simulated for portfolio review.
        </p>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-3 border-t border-[#EAF0EC] dark:border-[#1F2C26] space-y-2">
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#566B61] dark:text-[#8D9F96] hover:bg-[#EEF3F0] dark:hover:bg-[#1E2923] hover:text-[#192B23] dark:hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#75887E]" />
          <span>Keyboard Shortcuts & Tips</span>
        </button>

        {/* Therapist Profile Row */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-[#1A2320] border border-[#E5EDE8] dark:border-[#25352E]">
          <Avatar
            src={therapist.avatar}
            name={therapist.name}
            size="sm"
            statusIndicator="online"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7] truncate">
              {therapist.name}
            </p>
            <p className="text-[10px] text-[#6C8075] dark:text-[#84978D] truncate">
              {therapist.specialization.split('&')[0].trim()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
