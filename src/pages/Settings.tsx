import React, { useState } from 'react';
import {
  User,
  Building,
  Clock,
  Moon,
  Sun,
  Bell,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Avatar } from '../components/ui/Avatar';

export const Settings: React.FC = () => {
  const {
    therapist,
    updateTherapist,
    isDark,
    toggleTheme,
    resetToInitialData,
  } = usePractice();

  // Form State
  const [name, setName] = useState(therapist.name);
  const [title, setTitle] = useState(therapist.title);
  const [degree, setDegree] = useState(therapist.degree);
  const [email, setEmail] = useState(therapist.email);
  const [phone, setPhone] = useState(therapist.phone);
  const [specialization, setSpecialization] = useState(therapist.specialization);
  const [practiceName, setPracticeName] = useState(therapist.practiceName);
  const [defaultDuration, setDefaultDuration] = useState(therapist.defaultSessionDuration);
  const [workingHours, setWorkingHours] = useState(therapist.workingHours);

  // Notifications State
  const [reminders, setReminders] = useState(therapist.appointmentReminders);
  const [messages, setMessages] = useState(therapist.messageAlerts);
  const [payments, setPayments] = useState(therapist.paymentAlerts);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTherapist({
      name,
      title,
      degree,
      email,
      phone,
      specialization,
      practiceName,
      defaultSessionDuration: Number(defaultDuration) || 45,
      workingHours,
      appointmentReminders: reminders,
      messageAlerts: messages,
      paymentAlerts: payments,
    });
  };

  const handleExportData = () => {
    const practiceBackup = {
      therapist,
      exportDate: new Date().toISOString(),
      disclaimer: 'Fictional demonstration data for Serenity Practice Management.',
    };
    const blob = new Blob([JSON.stringify(practiceBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serenity-practice-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
          Practice Settings
        </h1>
        <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
          Manage your therapist profile, practice parameters, and display preferences.
        </p>
      </div>

      {/* 1. Therapist Profile Section */}
      <Card padding="lg">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6EFEA] dark:border-[#213028] gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={therapist.avatar}
                name={therapist.name}
                size="lg"
              />
              <div>
                <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                  Practitioner Profile
                </h3>
                <p className="text-xs text-[#6A7E74] dark:text-[#84988E]">
                  This information appears on invoices, receipts, and client appointment invites.
                </p>
              </div>
            </div>

            <Button type="submit" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
              Save Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name & Honorific"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Clinical Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Degree / Credentials"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            />
            <Input
              label="Practice Name"
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Professional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Specialization & Clinical Framework"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </form>
      </Card>

      {/* 2. Practice Configuration */}
      <Card padding="lg">
        <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mb-1">
          Practice Operating Parameters
        </h3>
        <p className="text-xs text-[#6A7E74] dark:text-[#84988E] mb-5">
          Configure default session timing and working consultation hours.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Default Session Length
            </label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Standard)</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <Input
            label="Practice Working Hours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
          />
        </div>
      </Card>

      {/* 3. Appearance & Theme */}
      <Card padding="lg">
        <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mb-1">
          Interface Appearance
        </h3>
        <p className="text-xs text-[#6A7E74] dark:text-[#84988E] mb-4">
          Serenity features a specialized dual-mode theme engineered for visual comfort.
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#151D1A] border border-[#DEE8E2] dark:border-[#23332B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1F2C26] flex items-center justify-center text-[#24493A] dark:text-[#88BFAB] border border-[#DEE7E1] dark:border-[#2B3E34]">
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#182C23] dark:text-[#E2EDE7]">
                {isDark ? 'Calming Dark Theme' : 'Clean Sage Light Theme'}
              </p>
              <p className="text-[11px] text-[#697C72] dark:text-[#84988E]">
                Currently active: {isDark ? 'DARK' : 'LIGHT'}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            icon={isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          >
            Switch to {isDark ? 'Light' : 'Dark'}
          </Button>
        </div>
      </Card>

      {/* 4. Notification Toggles */}
      <Card padding="lg">
        <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mb-1">
          Practice Notifications
        </h3>
        <p className="text-xs text-[#6A7E74] dark:text-[#84988E] mb-4">
          Control simulated reminder and update preferences.
        </p>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F6FAF8] dark:hover:bg-[#161F1B] cursor-pointer transition-colors border border-transparent hover:border-[#E2EBE6] dark:hover:border-[#22332B]">
            <div>
              <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                Appointment Reminders
              </p>
              <p className="text-[11px] text-[#697C72] dark:text-[#84988E]">
                Receive automated notifications 1 hour before scheduled patient sessions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={reminders}
              onChange={(e) => setReminders(e.target.checked)}
              className="w-4 h-4 text-[#2D5A4A] rounded focus:ring-0 focus:outline-none accent-[#2D5A4A]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F6FAF8] dark:hover:bg-[#161F1B] cursor-pointer transition-colors border border-transparent hover:border-[#E2EBE6] dark:hover:border-[#22332B]">
            <div>
              <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                Patient Messages
              </p>
              <p className="text-[11px] text-[#697C72] dark:text-[#84988E]">
                Display banner notifications when incoming patient inquiries arrive.
              </p>
            </div>
            <input
              type="checkbox"
              checked={messages}
              onChange={(e) => setMessages(e.target.checked)}
              className="w-4 h-4 text-[#2D5A4A] rounded focus:ring-0 focus:outline-none accent-[#2D5A4A]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F6FAF8] dark:hover:bg-[#161F1B] cursor-pointer transition-colors border border-transparent hover:border-[#E2EBE6] dark:hover:border-[#22332B]">
            <div>
              <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                Settlement & Payment Alerts
              </p>
              <p className="text-[11px] text-[#697C72] dark:text-[#84988E]">
                Notifications when patient invoices are settled via UPI or Card.
              </p>
            </div>
            <input
              type="checkbox"
              checked={payments}
              onChange={(e) => setPayments(e.target.checked)}
              className="w-4 h-4 text-[#2D5A4A] rounded focus:ring-0 focus:outline-none accent-[#2D5A4A]"
            />
          </label>
        </div>
      </Card>

      {/* 5. Demo Data Management & Portfolio Disclaimer */}
      <Card padding="lg" className="border-rose-200/60 dark:border-rose-950/40">
        <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7] mb-1">
          Demo Data & Portfolio Reset
        </h3>
        <p className="text-xs text-[#6A7E74] dark:text-[#84988E] mb-4">
          All records are stored locally in your browser storage. You can restore initial mock records or export current state anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Practice JSON
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all patients, appointments, and notes to original demo data?')) {
                resetToInitialData();
              }
            }}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset to Default Demo Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
