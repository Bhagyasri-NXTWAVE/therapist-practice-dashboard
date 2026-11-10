export type PatientStatus = 'active' | 'inactive' | 'new';

export type SessionType = 'Individual Session' | 'Follow-up' | 'Initial Consultation' | 'Online Session';

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  age: number;
  email: string;
  phone: string;
  status: PatientStatus;
  occupation: string;
  emergencyContact: string;
  memberSince: string;
  sessionsCompleted: number;
  lastSessionDate: string;
  nextAppointmentDate?: string;
  preferredTime: string;
  tags: string[];
  notesCount: number;
  fictionalMetrics: {
    mood: number; // 0-100 demo percentage
    sleep: number; // 0-100 demo percentage
    stress: number; // 0-100 demo percentage (lower is better)
    energy: number; // 0-100 demo percentage
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  date: string; // YYYY-MM-DD
  time: string; // "10:00 AM"
  durationMinutes: number;
  type: SessionType;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
  location: 'In-Clinic (Room 2B)' | 'Telehealth / Video Call' | 'Phone';
}

export interface SessionNote {
  id: string;
  patientId: string;
  patientName: string;
  sessionNumber: number;
  date: string;
  durationMinutes: number;
  sessionSummary: string;
  moodObserved: string; // e.g., "Calm and reflective", "Anxious but communicative"
  progressNotes: string;
  followUpDate: string;
  homeworkOrReflections?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'therapist' | 'patient';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  isOnline?: boolean; // Add this line
  messages?: any[];   // Add this line (or use a specific Message[] type if you have one)
}
export interface Transaction {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  amount: number; // in INR ₹ or currency
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceNumber: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Direct Debit' | 'Insurance Co-pay';
  service: string;
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'appointment' | 'payment' | 'message';
  title: string;
  timestamp: string;
  patientName: string;
  linkTo: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'message' | 'billing' | 'clinical';
  linkTo?: string;
}

export interface TherapistProfile {
  name: string;
  title: string;
  degree: string;
  avatar: string;
  email: string;
  phone: string;
  specialization: string;
  practiceName: string;
  defaultSessionDuration: number;
  workingHours: string;
  currencySymbol: string;
  appointmentReminders: boolean;
  messageAlerts: boolean;
  paymentAlerts: boolean;
}
