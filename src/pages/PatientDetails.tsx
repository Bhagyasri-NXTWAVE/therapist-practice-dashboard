import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Briefcase,
  AlertCircle,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { patientIndividualTrends } from '../data/initialData';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, getSessionNotesByPatient, appointments } = usePractice();

  const patient = patients.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'sessions' | 'notes'>('overview');
  const [progressRange, setProgressRange] = useState<'7d' | '30d' | '3m'>('7d');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  if (!patient) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<AlertCircle className="w-6 h-6" />}
          title="Patient record not found"
          description="The requested patient identifier was not found in your directory."
          actionLabel="Return to Patients Directory"
          onAction={() => navigate('/patients')}
        />
      </div>
    );
  }

  const patientNotes = getSessionNotesByPatient(patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  // Individual chart data fallback
  const trendData =
    patientIndividualTrends[patient.id]?.[progressRange] ||
    patientIndividualTrends['pat-1'][progressRange];

  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'progress', label: 'Progress Trends' },
    { id: 'sessions', label: 'Session History', count: patientAppointments.length },
    { id: 'notes', label: 'Session Notes', count: patientNotes.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/patients')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#54685E] hover:text-[#182C23] dark:text-[#8E9F96] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Patient Directory</span>
      </button>

      {/* Patient Profile Header Card */}
      <Card padding="lg" className="border border-[#DCE6E0] dark:border-[#24352D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Key Info */}
          <div className="flex items-start sm:items-center gap-4">
            <Avatar
              src={patient.avatar}
              name={patient.name}
              size="xl"
              statusIndicator={patient.status === 'active' ? 'online' : undefined}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#182C23] dark:text-[#E6EFEA] tracking-tight">
                  {patient.name}
                </h1>
                <Badge variant={patient.status === 'active' ? 'success' : 'neutral'} size="sm">
                  {patient.status === 'active' ? 'Active patient' : patient.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#63776E] dark:text-[#8D9F95] mt-2">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#7E9187]" />
                  {patient.occupation} ({patient.age} yrs)
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7E9187]" />
                  {patient.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#7E9187]" />
                  {patient.phone}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {patient.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#EDF3F0] dark:bg-[#1F2C26] text-[#41554C] dark:text-[#A7BCB2] border border-[#DEE7E1] dark:border-[#273830]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <Button
              variant="outline"
              size="sm"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => navigate('/messages')}
            >
              Message
            </Button>
            <Button
              size="sm"
              icon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => setIsScheduleOpen(true)}
            >
              Schedule Session
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards Under Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-[#E8F0EB] dark:border-[#22312A]">
          <div className="p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#151D1A] border border-[#DEE8E2] dark:border-[#22332B]">
            <span className="text-[11px] font-semibold text-[#667B70] dark:text-[#889B92] uppercase tracking-wider block">
              Next Scheduled Appointment
            </span>
            <div className="text-sm sm:text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{patient.nextAppointmentDate || 'None Scheduled'}</span>
            </div>
            <p className="text-[11px] text-[#71847A] dark:text-[#7A8E83] mt-0.5">
              {patient.preferredTime}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#151D1A] border border-[#DEE8E2] dark:border-[#22332B]">
            <span className="text-[11px] font-semibold text-[#667B70] dark:text-[#889B92] uppercase tracking-wider block">
              Sessions Completed
            </span>
            <div className="text-sm sm:text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2D5A4A] dark:text-[#4F8B77]" />
              <span>{patient.sessionsCompleted} Sessions</span>
            </div>
            <p className="text-[11px] text-[#71847A] dark:text-[#7A8E83] mt-0.5">
              Last on {patient.lastSessionDate}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#151D1A] border border-[#DEE8E2] dark:border-[#22332B]">
            <span className="text-[11px] font-semibold text-[#667B70] dark:text-[#889B92] uppercase tracking-wider block">
              Member In Practice Since
            </span>
            <div className="text-sm sm:text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>{patient.memberSince}</span>
            </div>
            <p className="text-[11px] text-[#71847A] dark:text-[#7A8E83] mt-0.5">
              Emergency: {patient.emergencyContact}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as any)}
      />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col (7 cols): Personal details & goals */}
          <div className="lg:col-span-7 space-y-6">
            <Card padding="md">
              <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7] mb-3">
                Practice Background & Preferences
              </h3>
              <div className="space-y-3 text-xs text-[#52665D] dark:text-[#9FB1A8]">
                <div className="flex justify-between py-1.5 border-b border-[#EDF3EF] dark:border-[#212E27]">
                  <span className="font-medium text-[#71837A] dark:text-[#81958B]">Status:</span>
                  <span className="font-semibold text-[#182C23] dark:text-white capitalize">
                    {patient.status}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EDF3EF] dark:border-[#212E27]">
                  <span className="font-medium text-[#71837A] dark:text-[#81958B]">Career / Role:</span>
                  <span className="font-semibold text-[#182C23] dark:text-white">
                    {patient.occupation}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EDF3EF] dark:border-[#212E27]">
                  <span className="font-medium text-[#71837A] dark:text-[#81958B]">Emergency Contact:</span>
                  <span className="font-semibold text-[#182C23] dark:text-white">
                    {patient.emergencyContact}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EDF3EF] dark:border-[#212E27]">
                  <span className="font-medium text-[#71837A] dark:text-[#81958B]">Preferred Time Window:</span>
                  <span className="font-semibold text-[#182C23] dark:text-white">
                    {patient.preferredTime}
                  </span>
                </div>
              </div>
            </Card>

            {/* Latest Clinical Note Preview */}
            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                  Most Recent Session Reflection
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('notes')}
                  icon={<ChevronRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  All Notes
                </Button>
              </div>

              {patientNotes[0] ? (
                <div className="p-4 rounded-xl bg-[#FAFBF9] dark:bg-[#161F1B] border border-[#E4ECE7] dark:border-[#23312B] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#182C23] dark:text-[#E2EDE7]">
                      Session #{patientNotes[0].sessionNumber} · {patientNotes[0].date}
                    </span>
                    <span className="text-[#6D8076] dark:text-[#80958A]">
                      {patientNotes[0].durationMinutes} minutes
                    </span>
                  </div>
                  <p className="text-xs text-[#52665D] dark:text-[#9FB1A8] leading-relaxed">
                    {patientNotes[0].sessionSummary}
                  </p>
                  <div className="pt-2 text-[11px] text-[#71847A] dark:text-[#7A8E83] flex items-center gap-1.5">
                    <strong>Mood observed:</strong> {patientNotes[0].moodObserved}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#71847A] dark:text-[#82968B]">
                  No session notes logged yet for this patient.
                </p>
              )}
            </Card>
          </div>

          {/* Right Col (5 cols): Demo Wellbeing Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                  Wellbeing Metrics
                </h3>
                <Badge variant="neutral" size="sm">
                  Demo Metrics
                </Badge>
              </div>

              <div className="space-y-4">
                <ProgressBar
                  label="Reported Mood Balance"
                  value={patient.fictionalMetrics.mood}
                  color="sage"
                />
                <ProgressBar
                  label="Sleep Quality Score"
                  value={patient.fictionalMetrics.sleep}
                  color="blue"
                />
                <ProgressBar
                  label="Tension Level (Low is calmer)"
                  value={patient.fictionalMetrics.stress}
                  color="amber"
                />
                <ProgressBar
                  label="Physical & Mental Energy"
                  value={patient.fictionalMetrics.energy}
                  color="green"
                />
              </div>

              <p className="text-[11px] text-[#798C82] dark:text-[#677B70] mt-4 pt-3 border-t border-[#EDF3EF] dark:border-[#22312A] leading-relaxed">
                * Simulated metric ratings for demonstration purposes. Serenity does not provide clinical or diagnostic assessments.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Progress Trends (Charts) */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                    Patient Reflection Trends
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5ECE8] dark:bg-[#202E27] text-[#4A5D54] dark:text-[#90A79C] font-medium">
                    Demo Data
                  </span>
                </div>
                <p className="text-xs text-[#6B7E74] dark:text-[#889B91] mt-0.5">
                  Fictional visual metrics tracking self-reported wellbeing parameters.
                </p>
              </div>

              {/* Range Toggle */}
              <div className="inline-flex p-0.5 bg-[#EEF3F0] dark:bg-[#1E2923] rounded-lg border border-[#D9E3DC] dark:border-[#273830]">
                {(['7d', '30d', '3m'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setProgressRange(r)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      progressRange === r
                        ? 'bg-white dark:bg-[#2C3E36] text-[#1E3A2F] dark:text-white shadow-2xs font-semibold'
                        : 'text-[#61746B] dark:text-[#82968B] hover:text-[#182C23]'
                    }`}
                  >
                    {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '3 Months'}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Multi-Area Visualization */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="patMoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A4A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2D5A4A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="patSleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B7A68" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B7A68" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE6" opacity={0.6} />
                  <XAxis dataKey="label" stroke="#84988F" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#84988F" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E2B25',
                      borderColor: '#293C33',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    name="Mood Rating"
                    stroke="#2D5A4A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#patMoodGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sleep"
                    name="Sleep Quality"
                    stroke="#3B7A68"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#patSleepGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#E8F0EA] dark:border-[#22312A] text-xs text-[#5B7065] dark:text-[#8D9F95]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2D5A4A]" />
                <span>Reported Mood Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3B7A68]" />
                <span>Sleep Quality Rating</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Session History */}
      {activeTab === 'sessions' && (
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E6EFE9] dark:border-[#213028] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                Appointment & Session History
              </h3>
              <p className="text-xs text-[#6B7D74] dark:text-[#83978D]">
                Scheduled and historical practice appointments for {patient.name}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsScheduleOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Book Session
            </Button>
          </div>

          <div className="divide-y divide-[#EDF3EF] dark:divide-[#212E27]">
            {patientAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6B7D74]">
                No appointments logged yet.
              </div>
            ) : (
              patientAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAF9] dark:hover:bg-[#1A2520] transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                          {apt.type}
                        </h4>
                        <Badge variant="success" size="sm">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#667970] dark:text-[#84978D] mt-0.5">
                        {apt.date} at {apt.time} ({apt.durationMinutes} minutes) · {apt.location}
                      </p>
                      {apt.notes && (
                        <p className="text-xs text-[#4F6359] dark:text-[#A4B7AD] mt-1.5 italic">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/sessions')}
                  >
                    Open Session Workspace
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Tab 4: Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
              Session Notes ({patientNotes.length})
            </h3>
            <Button
              size="sm"
              onClick={() => navigate('/sessions')}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Write New Note
            </Button>
          </div>

          <div className="space-y-4">
            {patientNotes.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-6 h-6" />}
                title="No session notes recorded yet"
                description={`Start documenting your clinical reflections and observational notes for ${patient.name}.`}
                actionLabel="Open Session Workspace"
                onAction={() => navigate('/sessions')}
              />
            ) : (
              patientNotes.map((note) => (
                <Card key={note.id} padding="md" className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6EFEA] dark:border-[#22312A] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                        Session #{note.sessionNumber} · {note.date}
                      </h4>
                      <p className="text-xs text-[#677B70] dark:text-[#84988E]">
                        Duration: {note.durationMinutes} min · Next Follow-up: {note.followUpDate}
                      </p>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {note.moodObserved}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#667A70] dark:text-[#85998F] uppercase tracking-wider block mb-1">
                      Session Summary
                    </span>
                    <p className="text-xs text-[#41544B] dark:text-[#A5B8AE] leading-relaxed">
                      {note.sessionSummary}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#667A70] dark:text-[#85998F] uppercase tracking-wider block mb-1">
                      Reflections & Progress
                    </span>
                    <p className="text-xs text-[#41544B] dark:text-[#A5B8AE] leading-relaxed">
                      {note.progressNotes}
                    </p>
                  </div>

                  {note.homeworkOrReflections && (
                    <div className="p-2.5 rounded-lg bg-[#F5F8F6] dark:bg-[#151D1A] border border-[#DEE8E1] dark:border-[#23332B] text-xs">
                      <strong className="text-[#1E3A2F] dark:text-[#88BFA9]">
                        Agreed Reflection Target:
                      </strong>{' '}
                      <span className="text-[#4E6258] dark:text-[#9FB1A7]">
                        {note.homeworkOrReflections}
                      </span>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultPatientId={patient.id}
      />
    </div>
  );
};
