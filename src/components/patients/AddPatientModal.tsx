import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { usePractice } from '../../context/PracticeContext';
import { PatientStatus } from '../../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addPatient } = usePractice();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(28);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM)');
  const [status, setStatus] = useState<PatientStatus>('new');
  const [tagsInput, setTagsInput] = useState('Mindfulness, Wellness');

  const avatarPlaceholders = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenAvatar = avatarPlaceholders[Math.floor(Math.random() * avatarPlaceholders.length)];
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    addPatient({
      name: name.trim(),
      age: Number(age) || 30,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim() || '+91 98000 12345',
      occupation: occupation.trim() || 'Independent Professional',
      emergencyContact: emergencyContact.trim() || 'Family Contact',
      preferredTime,
      status,
      tags: tags.length ? tags : ['General Consultation'],
      avatar: chosenAvatar,
    });

    // Reset form
    setName('');
    setAge(28);
    setEmail('');
    setPhone('');
    setOccupation('');
    setEmergencyContact('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Patient"
      subtitle="Register a new fictional patient record into your directory."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Maya Chen"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PatientStatus)}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15"
            >
              <option value="new">New Patient</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / On Pause</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="patient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="+91 98000 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Occupation"
            placeholder="e.g. Design Director"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
          <Input
            label="Preferred Session Window"
            placeholder="e.g. Morning (10:00 AM)"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
        </div>

        <Input
          label="Emergency Contact (Name & Number)"
          placeholder="e.g. Alex Chen (Partner) - +91 98000 11111"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
        />

        <Input
          label="Therapeutic Tags / Focus Topics (comma-separated)"
          placeholder="Mindfulness, Stress Resilience, Sleep Hygiene"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6EEE9] dark:border-[#22312A]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Save Patient Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};
