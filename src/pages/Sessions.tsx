import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { SessionNote } from '../types';

export const Sessions: React.FC = () => {
  const {
    patients,
    appointments,
    sessionNotes,
    addSessionNote,
    updateSessionNote,
    deleteSessionNote,
  } = usePractice();

  // Active session being drafted or edited
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    sessionNotes[0]?.id || null
  );

  // Filter query for notes list
  const [searchQuery, setSearchQuery] = useState('');

  // Editor form state
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [sessionNumber, setSessionNumber] = useState(9);
  const [date, setDate] = useState('2026-09-10');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [sessionSummary, setSessionSummary] = useState('');
  const [moodObserved, setMoodObserved] = useState('Calm and reflective');
  const [progressNotes, setProgressNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-09-17');
  const [homeworkOrReflections, setHomeworkOrReflections] = useState('');
  const [isNewMode, setIsNewMode] = useState(false);

  // Sync editor when selectedNoteId changes
  useEffect(() => {
    if (isNewMode) return;
    const note = sessionNotes.find((n) => n.id === selectedNoteId);
    if (note) {
      setPatientId(note.patientId);
      setSessionNumber(note.sessionNumber);
      setDate(note.date);
      setDurationMinutes(note.durationMinutes);
      setSessionSummary(note.sessionSummary);
      setMoodObserved(note.moodObserved);
      setProgressNotes(note.progressNotes);
      setFollowUpDate(note.followUpDate);
      setHomeworkOrReflections(note.homeworkOrReflections || '');
    }
  }, [selectedNoteId, sessionNotes, isNewMode]);

  const handleStartNewNote = (preselectedPatientId?: string) => {
    setIsNewMode(true);
    setSelectedNoteId(null);
    const chosenPatId = preselectedPatientId || patients[0]?.id || '';
    const pat = patients.find((p) => p.id === chosenPatId);
    setPatientId(chosenPatId);
    setSessionNumber((pat?.sessionsCompleted || 0) + 1);
    setDate('2026-09-10');
    setDurationMinutes(45);
    setSessionSummary('');
    setMoodObserved('Receptive and focused');
    setProgressNotes('');
    setFollowUpDate('2026-09-17');
    setHomeworkOrReflections('');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    if (!pat) return;

    if (isNewMode || !selectedNoteId) {
      const created = addSessionNote({
        patientId,
        patientName: pat.name,
        sessionNumber,
        date,
        durationMinutes,
        sessionSummary: sessionSummary.trim() || 'Session reflection and progress discussion.',
        moodObserved,
        progressNotes: progressNotes.trim() || 'Continued engagement in behavioral self-observation exercises.',
        followUpDate,
        homeworkOrReflections,
      });
      setIsNewMode(false);
      setSelectedNoteId(created.id);
    } else {
      updateSessionNote(selectedNoteId, {
        sessionNumber,
        date,
        durationMinutes,
        sessionSummary,
        moodObserved,
        progressNotes,
        followUpDate,
        homeworkOrReflections,
      });
    }
  };

  const handleDelete = () => {
    if (selectedNoteId) {
      deleteSessionNote(selectedNoteId);
      const remaining = sessionNotes.filter((n) => n.id !== selectedNoteId);
      if (remaining.length > 0) {
        setSelectedNoteId(remaining[0].id);
      } else {
        handleStartNewNote();
      }
    }
  };

  const filteredNotes = sessionNotes.filter(
    (n) =>
      n.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.sessionSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.moodObserved.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPatient = patients.find((p) => p.id === patientId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
            Session Workspace
          </h1>
          <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
            Record observational reflections, progress markers, and practice notes.
          </p>
        </div>

        <Button
          onClick={() => handleStartNewNote()}
          icon={<Plus className="w-4 h-4" />}
        >
          New Session Note
        </Button>
      </div>

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Notes & Sessions List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Schedule for Today */}
          <Card padding="sm" className="bg-[#FAFBF9] dark:bg-[#151E1A] border-[#DCE8E1] dark:border-[#23332B]">
            <span className="text-[11px] font-semibold text-[#667C71] dark:text-[#82998E] uppercase tracking-wider block mb-2 px-1">
              Today's Scheduled Consultations
            </span>
            <div className="space-y-1.5">
              {appointments
                .filter((a) => a.date === '2026-09-10')
                .map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => handleStartNewNote(apt.patientId)}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#18231F] border border-[#E3EDE7] dark:border-[#25362E] hover:border-[#8EA89D] dark:hover:border-[#385145] cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={apt.patientAvatar} name={apt.patientName} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2EDE7] truncate">
                          {apt.patientName}
                        </p>
                        <p className="text-[10px] text-[#71847A] dark:text-[#7A8E84]">
                          {apt.time} · {apt.type}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2">
                      Write
                    </Button>
                  </div>
                ))}
            </div>
          </Card>

          {/* Notes Library */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-3.5 border-b border-[#E6EFEA] dark:border-[#22312A] flex items-center justify-between">
              <span className="text-xs font-bold text-[#182C23] dark:text-[#E2EDE7]">
                Logged Notes ({filteredNotes.length})
              </span>
            </div>

            <div className="p-2 border-b border-[#EBF1ED] dark:border-[#1F2C26]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#7C9085] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs bg-[#F4F8F6] dark:bg-[#151D1A] rounded-lg border border-[#DEE7E2] dark:border-[#24352D] text-[#182C23] dark:text-[#E4EEE8] focus:outline-none focus:border-[#2D5A4A]"
                />
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto divide-y divide-[#EBF1ED] dark:divide-[#1F2C26]">
              {filteredNotes.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#73877D]">
                  No session notes match your search.
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = !isNewMode && selectedNoteId === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        setIsNewMode(false);
                        setSelectedNoteId(note.id);
                      }}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#EEF5F1] dark:bg-[#1C2822] border-l-3 border-[#2D5A4A] dark:border-[#4B8570]'
                          : 'hover:bg-[#F8FAF9] dark:hover:bg-[#17221E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#182C23] dark:text-[#E2EDE7]">
                          {note.patientName}
                        </span>
                        <span className="text-[10px] text-[#71847A] dark:text-[#7C9084]">
                          {note.date}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#485C52] dark:text-[#8EAE9E]">
                        Session #{note.sessionNumber} ({note.durationMinutes}m)
                      </p>
                      <p className="text-xs text-[#63776D] dark:text-[#80958B] line-clamp-2 mt-1">
                        {note.sessionSummary}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (8 cols): Large Clinical Notes Editor */}
        <div className="lg:col-span-8">
          <Card padding="lg" className="border border-[#DCE6E0] dark:border-[#24352D]">
            <form onSubmit={handleSaveNote} className="space-y-5">
              {/* Editor Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6EFE9] dark:border-[#213028]">
                <div className="flex items-center gap-3">
                  {currentPatient && (
                    <Avatar
                      src={currentPatient.avatar}
                      name={currentPatient.name}
                      size="md"
                    />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-[#182C23] dark:text-[#E2EDE7]">
                      {isNewMode
                        ? 'Draft New Session Note'
                        : `Session #${sessionNumber} Workspace`}
                    </h3>
                    <p className="text-xs text-[#667970] dark:text-[#889B92]">
                      Patient: <strong className="text-[#182C23] dark:text-white">{currentPatient?.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Top Action buttons */}
                <div className="flex items-center gap-2">
                  {!isNewMode && selectedNoteId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    icon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>

              {/* Patient & Session Setup Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
                    Patient Record
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    disabled={!isNewMode}
                    className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15 disabled:opacity-75"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Session #"
                  type="number"
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(Number(e.target.value))}
                  required
                />

                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Duration & Observed Demeanor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
                    Session Duration
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none focus:ring-2 focus:ring-[#2D5A4A]/15"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes (Standard)</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>

                <Input
                  label="Mood & Demeanor Observed"
                  placeholder="e.g. Calm, expressive, grounded, anxious at start"
                  value={moodObserved}
                  onChange={(e) => setMoodObserved(e.target.value)}
                  required
                />
              </div>

              {/* Large Session Summary */}
              <Textarea
                label="Session Summary"
                placeholder="Key themes explored, conversational focal points, challenges discussed..."
                rows={3}
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                required
              />

              {/* Clinical Progress & Observations */}
              <Textarea
                label="Progress Notes & Interventions Used"
                placeholder="Observational reflections, somatic awareness progress, coping exercises practiced in session..."
                rows={5}
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                required
              />

              {/* Follow-up & Homework */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Follow-Up Target Date"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
                <Input
                  label="Agreed Reflection Exercise / Homework"
                  placeholder="e.g. Daily 10-min breath check-in, bedtime journaling"
                  value={homeworkOrReflections}
                  onChange={(e) => setHomeworkOrReflections(e.target.value)}
                />
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E6EFE9] dark:border-[#22312A]">
                <span className="text-[11px] text-[#71847A] dark:text-[#677B70]">
                  Session notes persist safely to browser localStorage.
                </span>

                <div className="flex items-center gap-2.5">
                  {isNewMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewMode(false)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                    Save Session Notes
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
