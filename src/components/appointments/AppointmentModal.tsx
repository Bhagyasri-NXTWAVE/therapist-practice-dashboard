import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { usePractice } from '../../context/PracticeContext';
import { Appointment, SessionType } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Appointment | null;
  defaultPatientId?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  defaultPatientId,
}) => {
  const { patients, addAppointment, updateAppointment, deleteAppointment } = usePractice();

  const [patientId, setPatientId] = useState(defaultPatientId || (patients[0]?.id || ''));
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('10:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState<SessionType>('Individual Session');
  const [location, setLocation] = useState<'In-Clinic (Room 2B)' | 'Telehealth / Video Call' | 'Phone'>('In-Clinic (Room 2B)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDate(initialData.date);
      setTime(initialData.time);
      setDurationMinutes(initialData.durationMinutes);
      setType(initialData.type);
      setLocation(initialData.location);
      setNotes(initialData.notes || '');
    } else {
      setPatientId(defaultPatientId || (patients[0]?.id || ''));
      setDate('2026-09-10');
      setTime('10:00 AM');
      setDurationMinutes(45);
      setType('Individual Session');
      setLocation('In-Clinic (Room 2B)');
      setNotes('');
    }
  }, [initialData, defaultPatientId, patients, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (!selectedPatient) return;

    if (initialData) {
      updateAppointment(initialData.id, {
        patientId,
        patientName: selectedPatient.name,
        patientAvatar: selectedPatient.avatar,
        date,
        time,
        durationMinutes,
        type,
        location,
        notes,
      });
    } else {
      addAppointment({
        patientId,
        patientName: selectedPatient.name,
        patientAvatar: selectedPatient.avatar,
        date,
        time,
        durationMinutes,
        type,
        location,
        status: 'scheduled',
        notes,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (initialData) {
      deleteAppointment(initialData.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Appointment' : 'Schedule Practice Session'}
      subtitle={
        initialData
          ? 'Modify appointment details, reschedule, or cancel this session.'
          : 'Set up an upcoming clinical consultation or follow-up session.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
            Patient
          </label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={!!initialData}
            className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15 disabled:opacity-70"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.occupation})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time"
            type="text"
            placeholder="e.g. 10:00 AM, 02:30 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        {/* Duration & Session Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes (Standard)</option>
              <option value={60}>60 Minutes (Extended)</option>
              <option value={90}>90 Minutes (Intake / Comprehensive)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Session Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SessionType)}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15"
            >
              <option value="Individual Session">Individual Session</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Initial Consultation">Initial Consultation</option>
              <option value="Online Session">Online Session</option>
            </select>
          </div>
        </div>

        {/* Location / Mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
            Setting / Modality
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as any)}
            className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15"
          >
            <option value="In-Clinic (Room 2B)">In-Clinic (Room 2B)</option>
            <option value="Telehealth / Video Call">Telehealth / Video Call</option>
            <option value="Phone">Phone Consultation</option>
          </select>
        </div>

        {/* Notes */}
        <Textarea
          label="Preparation / Focus Notes"
          rows={3}
          placeholder="e.g. Review cognitive reframing worksheet, follow up on sleep habits..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6EEE9] dark:border-[#22312A]">
          {initialData ? (
            <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
              Cancel Session
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {initialData ? 'Save Changes' : 'Schedule Appointment'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
