import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePractice } from '../../context/PracticeContext';

export const CommandPalette: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, patients, appointments, sessionNotes, conversations } = usePractice();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        patients: patients.slice(0, 3),
        appointments: appointments.slice(0, 3),
        sessions: sessionNotes.slice(0, 2),
        pages: [
          { label: 'Patient Directory', icon: Users, path: '/patients' },
          { label: 'Practice Calendar', icon: Calendar, path: '/calendar' },
          { label: 'Clinical Session Notes', icon: FileText, path: '/sessions' },
          { label: 'Secure Practice Messaging', icon: MessageSquare, path: '/messages' },
          { label: 'Billing & Invoices', icon: CreditCard, path: '/billing' },
          { label: 'Account & Settings', icon: Settings, path: '/settings' },
        ],
      };
    }

    return {
      patients: patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ),
      appointments: appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      ),
      sessions: sessionNotes.filter(
        (s) =>
          s.patientName.toLowerCase().includes(q) ||
          s.sessionSummary.toLowerCase().includes(q) ||
          s.moodObserved.toLowerCase().includes(q)
      ),
      pages: [
        { label: 'Patient Directory', icon: Users, path: '/patients' },
        { label: 'Practice Calendar', icon: Calendar, path: '/calendar' },
        { label: 'Clinical Session Notes', icon: FileText, path: '/sessions' },
        { label: 'Secure Messages', icon: MessageSquare, path: '/messages' },
        { label: 'Billing & Invoices', icon: CreditCard, path: '/billing' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ].filter((p) => p.label.toLowerCase().includes(q)),
    };
  }, [query, patients, appointments, sessionNotes]);

  const handleSelect = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const totalResultsCount =
    filteredResults.patients.length +
    filteredResults.appointments.length +
    filteredResults.sessions.length +
    filteredResults.pages.length;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-[#17221E] rounded-2xl shadow-2xl border border-[#D9E5DE] dark:border-[#273A32] overflow-hidden z-10"
          >
            {/* Search Input Box */}
            <div className="flex items-center px-4 border-b border-[#E6EFE9] dark:border-[#22332B] gap-3">
              <Search className="w-5 h-5 text-[#677B70] dark:text-[#7F958A] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search practice data..."
                className="w-full py-4 text-sm bg-transparent text-[#182C23] dark:text-[#E4EEE8] placeholder-[#7F9388] dark:placeholder-[#647C70] focus:outline-none"
              />
              <kbd
                onClick={() => setIsSearchOpen(false)}
                className="px-2 py-0.5 text-[10px] font-semibold text-[#667A70] dark:text-[#889E93] bg-[#EFF4F1] dark:bg-[#202E27] rounded cursor-pointer border border-[#DCE5DF] dark:border-[#2C3E36]"
              >
                ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#EDF3EF] dark:divide-[#1F2D27]">
              {totalResultsCount === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-[#20332B] dark:text-[#D5E3DC]">
                    No matching records found
                  </p>
                  <p className="text-xs text-[#6F8278] dark:text-[#81968B] mt-1">
                    Try searching by patient name (e.g. Sarah, Rahul), session type, or topic.
                  </p>
                </div>
              ) : (
                <>
                  {/* Patients Section */}
                  {filteredResults.patients.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-[11px] font-semibold text-[#6B8075] dark:text-[#789083] uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>Patients</span>
                      </div>
                      {filteredResults.patients.map((pat) => (
                        <div
                          key={pat.id}
                          onClick={() => handleSelect(`/patients/${pat.id}`)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F4] dark:hover:bg-[#1E2B25] cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={pat.avatar}
                              alt={pat.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#D8E4DC] dark:border-[#273830]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7] group-hover:text-[#1E3A2F] dark:group-hover:text-emerald-300">
                                {pat.name}
                              </p>
                              <p className="text-[11px] text-[#697C72] dark:text-[#82968B]">
                                {pat.status.toUpperCase()} · {pat.occupation}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8EA397] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Appointments Section */}
                  {filteredResults.appointments.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-[11px] font-semibold text-[#6B8075] dark:text-[#789083] uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Scheduled Appointments</span>
                      </div>
                      {filteredResults.appointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => handleSelect('/calendar')}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F4] dark:hover:bg-[#1E2B25] cursor-pointer transition-colors group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                              {apt.patientName} — {apt.type}
                            </p>
                            <p className="text-[11px] text-[#697C72] dark:text-[#82968B]">
                              {apt.date} at {apt.time} ({apt.durationMinutes} min) · {apt.location}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Session Notes Section */}
                  {filteredResults.sessions.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-[11px] font-semibold text-[#6B8075] dark:text-[#789083] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Clinical Session Notes</span>
                      </div>
                      {filteredResults.sessions.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => handleSelect('/sessions')}
                          className="px-3 py-2 rounded-xl hover:bg-[#F2F7F4] dark:hover:bg-[#1E2B25] cursor-pointer transition-colors group"
                        >
                          <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                            Session #{note.sessionNumber} with {note.patientName} ({note.date})
                          </p>
                          <p className="text-[11px] text-[#697C72] dark:text-[#82968B] line-clamp-1 mt-0.5">
                            {note.sessionSummary}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Navigation Pages */}
                  {filteredResults.pages.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-[11px] font-semibold text-[#6B8075] dark:text-[#789083] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Navigation</span>
                      </div>
                      {filteredResults.pages.map((page) => {
                        const Icon = page.icon;
                        return (
                          <div
                            key={page.path}
                            onClick={() => handleSelect(page.path)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F4] dark:hover:bg-[#1E2B25] cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-[#667A70] dark:text-[#7F9489]" />
                              <span className="text-xs font-medium text-[#182C23] dark:text-[#D9E6DF]">
                                Jump to {page.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#788C81] dark:text-[#677A71]">
                              {page.path}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="p-2.5 px-4 bg-[#F7FAF8] dark:bg-[#141C19] border-t border-[#E6EFE9] dark:border-[#22332B] flex items-center justify-between text-[11px] text-[#697C72] dark:text-[#788E83]">
              <span className="flex items-center gap-1.5">
                Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#1E2B24] border border-[#DEE7E2] dark:border-[#283931] rounded">ESC</kbd> to exit
              </span>
              <span>All patient data is simulated demo data</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
