import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Check,
  CheckCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePractice } from '../../context/PracticeContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenNewAppointment: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenNewAppointment,
}) => {
  const {
    therapist,
    isDark,
    toggleTheme,
    setIsSearchOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = usePractice();

  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'message':
        return <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'billing':
        return <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#4D6559] dark:text-[#8EAB9D]" />;
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-[#151D1A]/90 backdrop-blur-md border-b border-[#E6EFE9] dark:border-[#212E27] sticky top-0 z-20 flex items-center justify-between gap-3">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#5D7066] hover:bg-[#EEF3F0] dark:hover:bg-[#1E2923] hover:text-[#182B24] dark:text-[#90A299] dark:hover:text-white transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 flex items-center justify-between px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#F4F7F5] dark:bg-[#1B2521] border border-[#DEE7E2] dark:border-[#26372F] text-xs sm:text-sm text-[#73857C] dark:text-[#7D9187] hover:border-[#8EA89D] dark:hover:border-[#385145] hover:bg-[#EEF3F0] dark:hover:bg-[#1F2B26] transition-all group"
          title="Search patients, appointments, notes (Cmd + K)"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#7A8E84] group-hover:text-[#1E3A2F] dark:group-hover:text-emerald-400 transition-colors" />
            <span className="truncate">Search patients, appointments, notes...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-[#5A6D63] dark:text-[#849B90] bg-white dark:bg-[#151D1A] border border-[#D5E1DB] dark:border-[#273831] rounded-md shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Appointment button */}
        <Button
          onClick={onOpenNewAppointment}
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          New Session
        </Button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#5F7368] hover:text-[#192C23] hover:bg-[#EEF3F0] dark:text-[#889B91] dark:hover:text-white dark:hover:bg-[#1E2923] border border-transparent hover:border-[#DCE6E0] dark:hover:border-[#273931] transition-all"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-[#5F7368] hover:text-[#192C23] hover:bg-[#EEF3F0] dark:text-[#889B91] dark:hover:text-white dark:hover:bg-[#1E2923] border border-transparent hover:border-[#DCE6E0] dark:hover:border-[#273931] transition-all"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151D1A]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#18231E] border border-[#DEE7E2] dark:border-[#273830] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 px-4 border-b border-[#E6EEE9] dark:border-[#22312A] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                    Notifications
                  </h4>
                  <p className="text-[11px] text-[#697C72] dark:text-[#84978D]">
                    {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="inline-flex items-center gap-1 text-xs text-[#244A3C] dark:text-[#8EC0AD] hover:underline font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#EBF1ED] dark:divide-[#212E27]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#6F8278]">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationAsRead(item.id);
                        if (item.linkTo) {
                          setIsNotifOpen(false);
                          navigate(item.linkTo);
                        }
                      }}
                      className={`p-3.5 px-4 flex items-start gap-3 hover:bg-[#F7FAF8] dark:hover:bg-[#1C2722] cursor-pointer transition-colors ${
                        !item.read ? 'bg-[#F2F7F4]/60 dark:bg-[#1A2822]/60' : ''
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white dark:bg-[#141C19] border border-[#E0E9E3] dark:border-[#25362E] shadow-2xs mt-0.5">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs ${!item.read ? 'font-semibold text-[#182C23] dark:text-white' : 'font-medium text-[#465950] dark:text-[#A7BCB2]'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-[#7A8E83] dark:text-[#6E8177] shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-[#64776D] dark:text-[#8C9E95] mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E2ECE6] dark:bg-[#23312B]" />

        {/* Therapist Profile Chip */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-1 py-1 pr-2 rounded-xl hover:bg-[#EEF3F0] dark:hover:bg-[#1E2923] cursor-pointer transition-colors select-none"
          title="Account & Practice Settings"
        >
          <Avatar
            src={therapist.avatar}
            name={therapist.name}
            size="sm"
            statusIndicator="online"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7] leading-tight">
              {therapist.name}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Practice
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
