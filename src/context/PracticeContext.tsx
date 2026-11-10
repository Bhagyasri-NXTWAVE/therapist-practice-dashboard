import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Patient,
  Appointment,
  SessionNote,
  Conversation,
  Message,
  Transaction,
  ActivityItem,
  NotificationItem,
  TherapistProfile,
} from '../types';
import {
  initialTherapist,
  initialPatients,
  initialAppointments,
  initialSessionNotes,
  initialConversations,
  initialMessages,
  initialTransactions,
  initialActivities,
  initialNotifications,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface PracticeContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;

  // Search Palette
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Therapist profile
  therapist: TherapistProfile;
  updateTherapist: (profile: Partial<TherapistProfile>) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'memberSince' | 'sessionsCompleted' | 'lastSessionDate' | 'notesCount' | 'fictionalMetrics'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Session Notes
  sessionNotes: SessionNote[];
  addSessionNote: (note: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => SessionNote;
  updateSessionNote: (id: string, updates: Partial<SessionNote>) => void;
  deleteSessionNote: (id: string) => void;
  getSessionNotesByPatient: (patientId: string) => SessionNote[];

  // Conversations & Messages
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'invoiceNumber'>) => Transaction;
  markTransactionAsPaid: (id: string) => void;

  // Activities & Notifications
  activities: ActivityItem[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Simulated Loading state demo
  isLoadingData: boolean;
  refreshPracticeData: () => void;
  resetToInitialData: () => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'serenity_theme',
  THERAPIST: 'serenity_therapist',
  PATIENTS: 'serenity_patients',
  APPOINTMENTS: 'serenity_appointments',
  NOTES: 'serenity_notes',
  CONVERSATIONS: 'serenity_conversations',
  MESSAGES: 'serenity_messages',
  TRANSACTIONS: 'serenity_transactions',
  NOTIFICATIONS: 'serenity_notifications',
};

export const PracticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setThemeMode = useCallback((mode: 'light' | 'dark') => {
    setIsDark(mode === 'dark');
  }, []);

  // Global Command Palette state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast manager
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Therapist profile
  const [therapist, setTherapist] = useState<TherapistProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THERAPIST);
      return saved ? JSON.parse(saved) : initialTherapist;
    } catch {
      return initialTherapist;
    }
  });

  const updateTherapist = useCallback((profile: Partial<TherapistProfile>) => {
    setTherapist((prev) => {
      const updated = { ...prev, ...profile };
      localStorage.setItem(STORAGE_KEYS.THERAPIST, JSON.stringify(updated));
      return updated;
    });
    showToast('Practice settings updated', 'Your changes have been saved to local preferences.');
  }, [showToast]);

  // Patients state
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : initialPatients;
    } catch {
      return initialPatients;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch {
      // ignore
    }
  }, [patients]);

  const addPatient = useCallback((newPatientData: Omit<Patient, 'id' | 'memberSince' | 'sessionsCompleted' | 'lastSessionDate' | 'notesCount' | 'fictionalMetrics'>) => {
    const newPatient: Patient = {
      ...newPatientData,
      id: `pat-${Date.now()}`,
      memberSince: 'September 2026',
      sessionsCompleted: 0,
      lastSessionDate: 'None yet',
      notesCount: 0,
      fictionalMetrics: {
        mood: 70,
        sleep: 65,
        stress: 40,
        energy: 65,
      },
    };
    setPatients((prev) => [newPatient, ...prev]);
    showToast('Patient added', `${newPatient.name} has been added to your patient directory.`);
    return newPatient;
  }, [showToast]);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Patient record updated', 'Changes have been recorded.');
  }, [showToast]);

  const deletePatient = useCallback((id: string) => {
    const p = patients.find((pat) => pat.id === id);
    setPatients((prev) => prev.filter((item) => item.id !== id));
    showToast('Patient removed', p ? `${p.name} has been removed.` : undefined, 'info');
  }, [patients, showToast]);

  const getPatientById = useCallback((id: string) => {
    return patients.find((p) => p.id === id);
  }, [patients]);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  const addAppointment = useCallback((newAptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [...prev, newApt]);
    // update patient nextAppointmentDate
    updatePatient(newApt.patientId, { nextAppointmentDate: newApt.date });
    showToast('Appointment scheduled', `${newApt.type} with ${newApt.patientName} on ${newApt.date} at ${newApt.time}.`);
    return newApt;
  }, [showToast, updatePatient]);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Appointment updated', 'The appointment details have been adjusted.');
  }, [showToast]);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment cancelled', 'The scheduled appointment was removed from the calendar.', 'info');
  }, [showToast]);

  // Session Notes state
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : initialSessionNotes;
    } catch {
      return initialSessionNotes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(sessionNotes));
    } catch {
      // ignore
    }
  }, [sessionNotes]);

  const addSessionNote = useCallback((noteData: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: SessionNote = {
      ...noteData,
      id: `sn-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setSessionNotes((prev) => [newNote, ...prev]);
    // Increment patient notes count & completed sessions
    setPatients((prev) =>
      prev.map((p) =>
        p.id === noteData.patientId
          ? {
              ...p,
              notesCount: (p.notesCount || 0) + 1,
              sessionsCompleted: p.sessionsCompleted + 1,
              lastSessionDate: noteData.date,
            }
          : p
      )
    );
    showToast('Session notes saved', `Notes for ${noteData.patientName} (Session #${noteData.sessionNumber}) have been securely recorded.`);
    return newNote;
  }, [showToast]);

  const updateSessionNote = useCallback((id: string, updates: Partial<SessionNote>) => {
    setSessionNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
    showToast('Session notes updated', 'Your edits have been saved to local storage.');
  }, [showToast]);

  const deleteSessionNote = useCallback((id: string) => {
    setSessionNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted', 'Session note was deleted.', 'info');
  }, [showToast]);

  const getSessionNotesByPatient = useCallback((patientId: string) => {
    return sessionNotes.filter((n) => n.patientId === patientId);
  }, [sessionNotes]);

  // Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : initialConversations;
    } catch {
      return initialConversations;
    }
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [conversations, messages]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: 'therapist',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastMessageTimestamp: 'Just now',
            }
          : c
      )
    );
  }, []);

  const markConversationAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'invoiceNumber'>) => {
    const count = transactions.length + 1;
    const padded = String(count).padStart(3, '0');
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      invoiceNumber: `INV-2026-${padded}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Invoice generated', `Created ${newTx.invoiceNumber} for ${newTx.patientName} (₹${newTx.amount.toLocaleString()}).`);
    return newTx;
  }, [transactions.length, showToast]);

  const markTransactionAsPaid = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Paid' } : t))
    );
    showToast('Payment confirmed', 'Marked transaction as Paid.');
  }, [showToast]);

  // Activities & Notifications
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications updated', 'All notifications marked as read.');
  }, [showToast]);

  // Loading state simulation
  const [isLoadingData, setIsLoadingData] = useState(false);
  const refreshPracticeData = useCallback(() => {
    setIsLoadingData(true);
    setTimeout(() => {
      setIsLoadingData(false);
      showToast('Data refreshed', 'Practice statistics re-synchronized.');
    }, 600);
  }, [showToast]);

  const resetToInitialData = useCallback(() => {
    localStorage.clear();
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setSessionNotes(initialSessionNotes);
    setConversations(initialConversations);
    setMessages(initialMessages);
    setTransactions(initialTransactions);
    setTherapist(initialTherapist);
    setActivities(initialActivities);
    setNotifications(initialNotifications);
    showToast('Demo data reset', 'Practice records restored to initial demonstration state.');
  }, [showToast]);

  return (
    <PracticeContext.Provider
      value={{
        isDark,
        toggleTheme,
        setThemeMode,
        isSearchOpen,
        setIsSearchOpen,
        therapist,
        updateTherapist,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        sessionNotes,
        addSessionNote,
        updateSessionNote,
        deleteSessionNote,
        getSessionNotesByPatient,
        conversations,
        messages,
        sendMessage,
        markConversationAsRead,
        transactions,
        addTransaction,
        markTransactionAsPaid,
        activities,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        isLoadingData,
        refreshPracticeData,
        resetToInitialData,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
