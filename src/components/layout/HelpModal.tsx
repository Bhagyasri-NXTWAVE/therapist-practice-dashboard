import React from 'react';
import { Modal } from '../ui/Modal';
import { Command, Calendar, Search, FileText, Moon, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Serenity Practice Guide & Shortcuts"
      subtitle="Quick reference for therapist practice workflow and keyboard hotkeys."
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs text-[#4F645A] dark:text-[#9FB3A8]">
        {/* Shortcuts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#20362C] dark:text-[#E2ECE7] mb-2.5 flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F3F7F5] dark:bg-[#1C2822] border border-[#DEE8E2] dark:border-[#273830]">
              <span>Global Search Palette</span>
              <kbd className="px-2 py-0.5 text-[10px] font-bold bg-white dark:bg-[#151D1A] rounded border border-[#D5E0DA] dark:border-[#2D3E35]">
                ⌘ / Ctrl + K
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F3F7F5] dark:bg-[#1C2822] border border-[#DEE8E2] dark:border-[#273830]">
              <span>Close Modals / Overlays</span>
              <kbd className="px-2 py-0.5 text-[10px] font-bold bg-white dark:bg-[#151D1A] rounded border border-[#D5E0DA] dark:border-[#2D3E35]">
                Escape
              </kbd>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#20362C] dark:text-[#E2ECE7] mb-2.5 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Practice Management Features</span>
          </h4>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-white dark:bg-[#1A2520] border border-[#E0EAE4] dark:border-[#26372F] flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#182C23] dark:text-[#E2EDE7]">Multi-View Calendar</p>
                <p className="mt-0.5 text-[#677B71] dark:text-[#889C92]">
                  Switch between Month, Week, and Day views. Click any appointment to reschedule, adjust duration, or cancel.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1A2520] border border-[#E0EAE4] dark:border-[#26372F] flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#182C23] dark:text-[#E2EDE7]">Clinical Session Workspace</p>
                <p className="mt-0.5 text-[#677B71] dark:text-[#889C92]">
                  Draft non-diagnostic clinical notes, record behavioral observations, set follow-up targets, and persist notes safely in localStorage.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#1A2520] border border-[#E0EAE4] dark:border-[#26372F] flex items-start gap-2.5">
              <Moon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#182C23] dark:text-[#E2EDE7]">Calming Dark Mode</p>
                <p className="mt-0.5 text-[#677B71] dark:text-[#889C92]">
                  Custom designed charcoal and deep sage theme engineered for evening documentation without eye strain.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-3 rounded-xl bg-[#F0F5F2] dark:bg-[#18241F] border border-[#DCE6DF] dark:border-[#25362E] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#2E5848] dark:text-[#78B09B] mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed text-[#51675D] dark:text-[#89A195]">
            <strong className="text-[#1A2E25] dark:text-[#D5E3DC]">Fictional Portfolio Disclaimer:</strong> All patient identities, appointment dates, therapy records, transactions, and wellbeing metrics displayed in Serenity are synthetic demonstration figures.
          </p>
        </div>
      </div>
    </Modal>
  );
};
