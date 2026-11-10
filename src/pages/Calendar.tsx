import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  User,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { Appointment } from '../types';

export const Calendar: React.FC = () => {
  const { appointments } = usePractice();

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Focus date: Thursday Sep 10, 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 10)); // Sep 10, 2026

  // Days of week for Week View
  const weekDays = useMemo(() => {
    // Current date is Sep 10, 2026 (Thursday). Start of week Monday Sep 7, 2026
    return [
      { name: 'Mon', dateNum: '7', fullDate: '2026-09-07' },
      { name: 'Tue', dateNum: '8', fullDate: '2026-09-08' },
      { name: 'Wed', dateNum: '9', fullDate: '2026-09-09' },
      { name: 'Thu', dateNum: '10', fullDate: '2026-09-10', isToday: true },
      { name: 'Fri', dateNum: '11', fullDate: '2026-09-11' },
      { name: 'Sat', dateNum: '12', fullDate: '2026-09-12' },
      { name: 'Sun', dateNum: '13', fullDate: '2026-09-13' },
    ];
  }, []);

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const handleOpenNew = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
            Practice Calendar
          </h1>
          <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
            Manage your practice schedule, consultations, and patient sessions.
          </p>
        </div>

        <Button onClick={handleOpenNew} icon={<Plus className="w-4 h-4" />}>
          Schedule Session
        </Button>
      </div>

      {/* Calendar Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#18221E] p-3 rounded-xl border border-[#E5EDE8] dark:border-[#22312B] shadow-2xs">
        {/* Date Navigation */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {}}
              className="p-1.5 rounded-lg border border-[#DCE6E0] dark:border-[#273931] hover:bg-[#F2F7F4] dark:hover:bg-[#202E27] text-[#55695F] dark:text-[#8E9F95] transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {}}
              className="p-1.5 rounded-lg border border-[#DCE6E0] dark:border-[#273931] hover:bg-[#F2F7F4] dark:hover:bg-[#202E27] text-[#55695F] dark:text-[#8E9F95] transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7] select-none">
            September 2026
          </span>

          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4F0] dark:bg-[#1F2C26] text-[#24493B] dark:text-[#88BFAB]">
            Week 37
          </span>
        </div>

        {/* View Switcher: Month / Week / Day */}
        <div className="inline-flex p-1 bg-[#EEF3F0] dark:bg-[#151D1A] rounded-lg border border-[#DCE6E0] dark:border-[#25352D] self-start sm:self-auto">
          {(['month', 'week', 'day'] as const).map((view) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                  isActive
                    ? 'bg-white dark:bg-[#25362E] text-[#1B3429] dark:text-white shadow-2xs font-semibold'
                    : 'text-[#596D63] dark:text-[#83978D] hover:text-[#182C23]'
                }`}
              >
                {view}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW: WEEK VIEW (Primary SaaS layout) */}
      {currentView === 'week' && (
        <Card padding="none" className="overflow-hidden border border-[#DDE7E1] dark:border-[#22332B]">
          {/* Header Days of the Week */}
          <div className="grid grid-cols-7 border-b border-[#E6EFEA] dark:border-[#213028] bg-[#FAFBF9] dark:bg-[#151D1A]">
            {weekDays.map((d) => (
              <div
                key={d.fullDate}
                className={`py-3 px-2 text-center border-r last:border-r-0 border-[#E8F0EA] dark:border-[#213028] ${
                  d.isToday ? 'bg-[#EEF5F1] dark:bg-[#1A2621]' : ''
                }`}
              >
                <span className="text-[11px] font-semibold text-[#6C8075] dark:text-[#7D9287] uppercase tracking-wider block">
                  {d.name}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 mt-0.5 rounded-full text-xs font-bold ${
                    d.isToday
                      ? 'bg-[#1E3A2F] text-white dark:bg-[#2E5C4C]'
                      : 'text-[#182C23] dark:text-[#E2ECE7]'
                  }`}
                >
                  {d.dateNum}
                </span>
              </div>
            ))}
          </div>

          {/* Week Grid Body */}
          <div className="grid grid-cols-7 divide-x divide-[#E8F0EA] dark:divide-[#213028] min-h-[460px] bg-white dark:bg-[#18221E]">
            {weekDays.map((d) => {
              const dayAppointments = appointments.filter((a) => a.date === d.fullDate);
              return (
                <div
                  key={d.fullDate}
                  className={`p-2 space-y-2.5 min-h-[300px] transition-colors ${
                    d.isToday ? 'bg-[#FAFBF9]/70 dark:bg-[#161F1B]/70' : ''
                  }`}
                >
                  {dayAppointments.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-[#91A399] dark:text-[#52645B] opacity-0 hover:opacity-100 transition-opacity">
                      <span>No sessions</span>
                    </div>
                  ) : (
                    dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => handleOpenEdit(apt)}
                        className="p-2.5 rounded-xl bg-[#F4F8F6] dark:bg-[#1D2B24] border border-[#DEE9E3] dark:border-[#283C32] hover:border-[#8EA89D] dark:hover:border-[#416858] cursor-pointer shadow-2xs hover:shadow-xs transition-all group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#5A6E64] dark:text-[#889F94] mb-1">
                          <span className="font-bold text-[#1E3A2F] dark:text-[#9ECBB9] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {apt.time}
                          </span>
                          <span className="text-[10px]">{apt.durationMinutes}m</span>
                        </div>

                        <p className="text-xs font-bold text-[#182C23] dark:text-[#E2EDE7] truncate group-hover:text-[#234F3F] dark:group-hover:text-emerald-300">
                          {apt.patientName}
                        </p>

                        <p className="text-[10px] text-[#697C72] dark:text-[#83978E] truncate mt-0.5">
                          {apt.type}
                        </p>

                        <div className="mt-2 pt-1.5 border-t border-[#E2EBE5] dark:border-[#24352D] flex items-center justify-between text-[10px] text-[#667A70] dark:text-[#7A8E84]">
                          <span className="truncate max-w-[80px]">
                            {apt.location.includes('Video') ? 'Telehealth' : 'Clinic'}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VIEW: DAY VIEW */}
      {currentView === 'day' && (
        <Card padding="lg">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6EFEA] dark:border-[#213028] mb-6">
            <div>
              <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                Thursday, September 10, 2026
              </h3>
              <p className="text-xs text-[#6B7E74] dark:text-[#889B91]">
                {appointments.filter((a) => a.date === '2026-09-10').length} sessions scheduled today
              </p>
            </div>
            <Badge variant="success" size="sm" dot>
              Active Today
            </Badge>
          </div>

          <div className="space-y-4">
            {appointments
              .filter((a) => a.date === '2026-09-10')
              .map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => handleOpenEdit(apt)}
                  className="p-4 rounded-xl bg-[#F6FAF8] dark:bg-[#1A2520] border border-[#DEE8E2] dark:border-[#25362E] hover:border-[#8EA89D] dark:hover:border-[#385145] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Avatar src={apt.patientAvatar} name={apt.patientName} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#182C23] dark:text-[#E4EEE8]">
                          {apt.patientName}
                        </h4>
                        <Badge variant="neutral" size="sm">
                          {apt.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#697C72] dark:text-[#889D92] mt-0.5">
                        {apt.location} · {apt.durationMinutes} minutes duration
                      </p>
                      {apt.notes && (
                        <p className="text-xs text-[#4F6359] dark:text-[#A7BAAF] mt-1.5 italic">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7] bg-white dark:bg-[#151D1A] px-3 py-1.5 rounded-lg border border-[#DEE7E2] dark:border-[#283931]">
                      {apt.time}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(apt)}>
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* VIEW: MONTH VIEW */}
      {currentView === 'month' && (
        <Card padding="none" className="overflow-hidden border border-[#DDE7E1] dark:border-[#22332B]">
          <div className="grid grid-cols-7 border-b border-[#E6EFEA] dark:border-[#213028] bg-[#FAFBF9] dark:bg-[#151D1A] text-center text-[11px] font-semibold text-[#6B8075] dark:text-[#7C9186] py-2 uppercase tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#EBF1ED] dark:divide-[#212E27] min-h-[420px] bg-white dark:bg-[#18221E]">
            {Array.from({ length: 35 }).map((_, index) => {
              const dayNum = index - 0; // August 31 to October 4
              const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
              const formattedDate = `2026-09-${String(dayNum).padStart(2, '0')}`;
              const hasAppointments = isCurrentMonth
                ? appointments.filter((a) => a.date === formattedDate)
                : [];
              const isToday = dayNum === 10;

              return (
                <div
                  key={index}
                  className={`p-2 min-h-[85px] flex flex-col justify-between ${
                    !isCurrentMonth ? 'bg-[#FAFBF9]/40 dark:bg-[#141C19]/40 opacity-40' : ''
                  } ${isToday ? 'bg-[#EEF5F1]/50 dark:bg-[#1A2621]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center'
                          : 'text-[#3E5148] dark:text-[#9FB1A8]'
                      }`}
                    >
                      {dayNum > 0 && dayNum <= 30 ? dayNum : ''}
                    </span>
                    {hasAppointments.length > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {hasAppointments.length} apt
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {hasAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => handleOpenEdit(apt)}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#EDF4F0] dark:bg-[#202E27] text-[#1E3A2F] dark:text-[#A7CDBE] truncate cursor-pointer hover:underline"
                      >
                        {apt.time} {apt.patientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        initialData={selectedAppointment}
      />
    </div>
  );
};
