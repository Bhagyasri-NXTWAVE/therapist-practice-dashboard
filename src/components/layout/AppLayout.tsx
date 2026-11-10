import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { HelpModal } from './HelpModal';
import { AppointmentModal } from '../appointments/AppointmentModal';
import { ToastContainer } from '../ui/ToastContainer';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#111714] text-[#1C2321] dark:text-[#E2ECE7] flex flex-col font-sans transition-colors duration-200">
      {/* App Layout Shell */}
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <Topbar
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
          />

          {/* Page Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Subtle Clean Portfolio Footer */}
          <footer className="py-4 px-6 border-t border-[#E8F0EA] dark:border-[#1E2C24] text-center text-xs text-[#7A8E83] dark:text-[#677C71] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <span>
              <strong>Serenity</strong> — A calmer way to manage your practice.
            </span>
            <span className="text-[11px] text-[#8EA096] dark:text-[#5E7368]">
              Demo application — all patient information is fictional.
            </span>
          </footer>
        </div>
      </div>

      {/* Global Overlays & Modals */}
      <CommandPalette />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};
