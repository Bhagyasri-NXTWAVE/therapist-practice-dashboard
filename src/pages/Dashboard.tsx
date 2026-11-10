import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar as CalendarIcon,
  CreditCard,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Plus,
  RefreshCw,
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
import { practiceProgressData } from '../data/initialData';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { Appointment } from '../types';

export const Dashboard: React.FC = () => {
  const {
    therapist,
    patients,
    appointments,
    activities,
    isLoadingData,
    refreshPracticeData,
  } = usePractice();

  const navigate = useNavigate();

  // Metric selector for Practice Progress chart
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'sleep' | 'stress'>('mood');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m'>('7d');

  // Appointment modal state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Today's appointments (filter for 2026-09-10 or scheduled)
  const todayAppointments = appointments.filter((a) => a.date === '2026-09-10');

  // Chart configuration
  const metricConfigs = {
    mood: {
      label: 'Average Mood Index',
      color: '#2D5A4A',
      gradientId: 'moodGradient',
      unit: '%',
      description: 'Aggregate patient-reported daily reflections',
    },
    sleep: {
      label: 'Sleep Quality Score',
      color: '#3B7A68',
      gradientId: 'sleepGradient',
      unit: '%',
      description: 'Average nocturnal restfulness ratings',
    },
    stress: {
      label: 'Tension Index',
      color: '#8A9E94',
      gradientId: 'stressGradient',
      unit: '%',
      description: 'Reported workplace & environmental tension',
    },
  };

  const currentMetricConfig = metricConfigs[selectedMetric];
  const chartData = practiceProgressData[timeRange];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
            Good morning, {therapist.name.split(' ')[0]} {therapist.name.split(' ')[1]} 👋
          </h1>
          <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
            Here's what's happening with your practice today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPracticeData}
            isLoading={isLoadingData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedAppointment(null);
              setIsAppointmentModalOpen(true);
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Schedule Session
          </Button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Patients */}
        <Card
          hoverEffect
          className="cursor-pointer group"
          onClick={() => navigate('/patients')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Total Patients
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center transition-transform group-hover:scale-105">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E5EEE9] tracking-tight">
              128
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.4%</span>
              <span className="text-[#7A8E84] dark:text-[#6E8177] font-normal">from last month</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Today's Sessions */}
        <Card
          hoverEffect
          className="cursor-pointer group"
          onClick={() => navigate('/calendar')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Today's Sessions
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center transition-transform group-hover:scale-105">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E5EEE9] tracking-tight">
              {todayAppointments.length}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#52665D] dark:text-[#8E9F96]">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {todayAppointments.length} remaining
              </span>
              <span className="text-[#7A8E84] dark:text-[#6E8177]">today</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Monthly Revenue */}
        <Card
          hoverEffect
          className="cursor-pointer group"
          onClick={() => navigate('/billing')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Monthly Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center transition-transform group-hover:scale-105">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E5EEE9] tracking-tight">
              ₹42,500
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4%</span>
              <span className="text-[#7A8E84] dark:text-[#6E8177] font-normal">monthly target</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Upcoming Next */}
        <Card
          hoverEffect
          className="cursor-pointer group"
          onClick={() => {
            if (todayAppointments[0]) {
              setSelectedAppointment(todayAppointments[0]);
              setIsAppointmentModalOpen(true);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Next Session
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center transition-transform group-hover:scale-105">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-[#182C23] dark:text-[#E5EEE9] tracking-tight truncate">
              {todayAppointments[0]?.time || '10:00 AM'}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#52665D] dark:text-[#8E9F96] truncate">
              <span className="font-semibold text-[#182C23] dark:text-white truncate">
                {todayAppointments[0]?.patientName || 'Sarah Miller'}
              </span>
              <span className="text-[#7A8E84] dark:text-[#6E8177] shrink-0">· 45m</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule & Practice Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7 cols): Today's Schedule Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                  Today's Schedule
                </h3>
                <p className="text-xs text-[#6B7E74] dark:text-[#889B91] mt-0.5">
                  Thursday, September 10, 2026 · 4 sessions planned
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/calendar')}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                View Calendar
              </Button>
            </div>

            {/* Timeline Items */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EEE9] dark:before:bg-[#202E27]">
              {todayAppointments.map((apt, index) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-[#18221E] border-2 border-[#2D5A4A] dark:border-[#46806C] group-hover:scale-125 transition-transform" />

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAFBF9] dark:bg-[#1A2521] border border-[#E6EFEA] dark:border-[#24342C] hover:border-[#8EA89D] dark:hover:border-[#385145] transition-all group-hover:shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar src={apt.patientAvatar} name={apt.patientName} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#182C23] dark:text-[#E4EEE8] group-hover:text-[#234B3D] dark:group-hover:text-emerald-300 transition-colors">
                              {apt.patientName}
                            </h4>
                            <Badge variant={index === 0 ? 'success' : 'neutral'} size="sm">
                              {apt.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#6B7D75] dark:text-[#8A9C93] mt-0.5">
                            {apt.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-sm font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                            {apt.time}
                          </span>
                          <span className="block text-[11px] text-[#71847A] dark:text-[#6F8278]">
                            {apt.durationMinutes} min
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/sessions');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-flex"
                        >
                          Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Practice Activity */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                Recent Activity
              </h3>
              <span className="text-xs text-[#72857B] dark:text-[#84978D]">
                Real-time updates
              </span>
            </div>

            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate(act.linkTo)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F3F7F5] dark:hover:bg-[#1A2520] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#182C23] dark:text-[#DCE8E2]">
                        {act.title}
                      </p>
                      <span className="text-[10px] text-[#788C82] dark:text-[#677B70]">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#889C92]" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col (5 cols): Practice Progress Trends (Recharts) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card padding="lg" className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                    Practice Progress
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5ECE8] dark:bg-[#202E27] text-[#4A5D54] dark:text-[#90A79C] font-medium">
                    Demo
                  </span>
                </div>
                <p className="text-xs text-[#6B7E74] dark:text-[#889B91] mt-0.5">
                  {currentMetricConfig.description}
                </p>
              </div>

              {/* Range Toggle */}
              <div className="inline-flex p-0.5 bg-[#EEF3F0] dark:bg-[#1E2923] rounded-lg border border-[#D9E3DC] dark:border-[#273830] self-start sm:self-auto">
                {(['7d', '30d', '3m'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                      timeRange === range
                        ? 'bg-white dark:bg-[#2C3E36] text-[#1E3A2F] dark:text-white shadow-2xs font-semibold'
                        : 'text-[#61746B] dark:text-[#82968B] hover:text-[#182C23]'
                    }`}
                  >
                    {range === '7d' ? '7D' : range === '30d' ? '30D' : '3M'}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {(['mood', 'sleep', 'stress'] as const).map((metric) => {
                const isSelected = selectedMetric === metric;
                return (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize select-none ${
                      isSelected
                        ? 'bg-[#1E3A2F] text-white shadow-2xs dark:bg-[#2E5B4B]'
                        : 'bg-[#F2F6F4] text-[#4E6258] hover:bg-[#E5ECE8] dark:bg-[#1B2721] dark:text-[#95A89F] dark:hover:bg-[#23332B]'
                    }`}
                  >
                    {metric}
                  </button>
                );
              })}
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetricConfig.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={currentMetricConfig.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EBE6" opacity={0.6} />
                  <XAxis
                    dataKey="label"
                    stroke="#84988F"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#84988F"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E2B25',
                      borderColor: '#293C33',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      padding: '8px 12px',
                    }}
                    formatter={(value: any) => [`${value}%`, currentMetricConfig.label]}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={currentMetricConfig.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#metricGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Caution / Disclaimer Notice */}
            <div className="mt-4 p-3 rounded-xl bg-[#FAFBF9] dark:bg-[#161F1B] border border-[#E7EFEA] dark:border-[#223229] flex items-center justify-between text-xs text-[#6B7F75] dark:text-[#83978D]">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Practice wellbeing trends are steady
              </span>
              <span className="text-[10px] text-[#8C9F95] dark:text-[#64796E]">
                Demo data only
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Appointment Edit / Create Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setSelectedAppointment(null);
        }}
        initialData={selectedAppointment}
      />
    </div>
  );
};
