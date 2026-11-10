import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Calendar,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpDown,
  MoreVertical,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { AddPatientModal } from '../components/patients/AddPatientModal';
import { AppointmentModal } from '../components/appointments/AppointmentModal';
import { PatientStatus } from '../types';

export const Patients: React.FC = () => {
  const { patients } = usePractice();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | PatientStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick schedule modal
  const [schedulingPatientId, setSchedulingPatientId] = useState<string | null>(null);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'all' || patient.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, selectedStatus]);

  const statusCounts = useMemo(() => {
    return {
      all: patients.length,
      active: patients.filter((p) => p.status === 'active').length,
      inactive: patients.filter((p) => p.status === 'inactive').length,
      new: patients.filter((p) => p.status === 'new').length,
    };
  }, [patients]);

  const getStatusBadgeVariant = (status: PatientStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      case 'new':
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
            Patients
          </h1>
          <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
            Manage your fictional patient directory & active therapy profiles.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Patient
        </Button>
      </div>

      {/* Search Bar & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#18221E] p-3 rounded-xl border border-[#E5EDE8] dark:border-[#22312B] shadow-2xs">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7B8E84] dark:text-[#677C71] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by name, tag, occupation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-[#F5F8F6] dark:bg-[#151D1A] border border-[#DEE7E1] dark:border-[#25362E] rounded-lg text-[#182C23] dark:text-[#E2EDE7] placeholder-[#798C82] dark:placeholder-[#5E7267] focus:outline-none focus:border-[#2D5A4A]"
          />
        </div>

        {/* Status Filters */}
        <div className="inline-flex p-1 bg-[#F0F5F2] dark:bg-[#151D1A] rounded-lg border border-[#DCE6E0] dark:border-[#24352D] gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'active', label: 'Active', count: statusCounts.active },
              { key: 'new', label: 'New', count: statusCounts.new },
              { key: 'inactive', label: 'Inactive', count: statusCounts.inactive },
            ] as const
          ).map((filter) => {
            const isSelected = selectedStatus === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-[#25362E] text-[#1A3328] dark:text-white shadow-2xs font-semibold'
                    : 'text-[#61746B] dark:text-[#80958A] hover:text-[#182C23] dark:hover:text-white'
                }`}
              >
                <span>{filter.label}</span>
                <span className="text-[10px] opacity-75">({filter.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient List: Responsive Table / Grid */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No patients found"
          description="Try adjusting your search keywords or active status filters to locate the patient record."
          actionLabel="Add New Patient"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-[#18221E] border border-[#E5EDE8] dark:border-[#22312B] rounded-2xl shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6EFEA] dark:border-[#213028] bg-[#FAFBF9] dark:bg-[#151D1A]/70 text-[11px] font-semibold text-[#667B71] dark:text-[#7A9084] uppercase tracking-wider">
                  <th className="py-3 px-5">Patient Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Age / Career</th>
                  <th className="py-3 px-4">Last Session</th>
                  <th className="py-3 px-4">Next Scheduled</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF3EF] dark:divide-[#1F2D27] text-sm">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="hover:bg-[#F6FAF8] dark:hover:bg-[#1C2722] cursor-pointer transition-colors group"
                  >
                    {/* Patient Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={patient.avatar}
                          name={patient.name}
                          size="md"
                          statusIndicator={patient.status === 'active' ? 'online' : undefined}
                        />
                        <div>
                          <p className="font-semibold text-[#182C23] dark:text-[#E2ECE7] group-hover:text-[#234D3F] dark:group-hover:text-emerald-300 transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-xs text-[#708479] dark:text-[#83978D]">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(patient.status)} size="sm">
                        {patient.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Age & Career */}
                    <td className="py-3.5 px-4 text-xs text-[#4E6258] dark:text-[#A7BCB2]">
                      <p className="font-medium text-[#1E3027] dark:text-[#CCDCD4]">
                        {patient.age} yrs
                      </p>
                      <p className="text-[11px] text-[#71847A] dark:text-[#7A8E84]">
                        {patient.occupation}
                      </p>
                    </td>

                    {/* Last Session */}
                    <td className="py-3.5 px-4 text-xs text-[#52665C] dark:text-[#9FB2A8]">
                      {patient.lastSessionDate || 'None yet'}
                    </td>

                    {/* Next Appointment */}
                    <td className="py-3.5 px-4 text-xs">
                      {patient.nextAppointmentDate ? (
                        <span className="font-medium text-emerald-800 dark:text-emerald-300">
                          {patient.nextAppointmentDate}
                        </span>
                      ) : (
                        <span className="text-[#84978E] dark:text-[#677A71]">None set</span>
                      )}
                    </td>

                    {/* Progress indicator */}
                    <td className="py-3.5 px-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-[11px] mb-1 text-[#55695F] dark:text-[#8C9F95]">
                          <span>Mood</span>
                          <span className="font-semibold tabular-nums">
                            {patient.fictionalMetrics.mood}%
                          </span>
                        </div>
                        <div className="w-full bg-[#E5ECE8] dark:bg-[#23312B] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2D5A4A] dark:bg-[#4C8875] h-full rounded-full"
                            style={{ width: `${patient.fictionalMetrics.mood}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSchedulingPatientId(patient.id)}
                          icon={<Calendar className="w-3.5 h-3.5" />}
                        >
                          Book
                        </Button>
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="p-1.5 rounded-lg text-[#74877D] hover:text-[#182C23] hover:bg-[#EEF4F0] dark:text-[#879C91] dark:hover:text-white dark:hover:bg-[#22312A] transition-colors"
                          aria-label="View patient profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[#EDF3EF] dark:divide-[#212E27]">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="p-4 flex flex-col gap-3 hover:bg-[#F6FAF8] dark:hover:bg-[#1C2722] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={patient.avatar} name={patient.name} size="md" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#182C23] dark:text-[#E2ECE7]">
                        {patient.name}
                      </h4>
                      <p className="text-xs text-[#6F8378] dark:text-[#85988E]">
                        {patient.occupation} · {patient.age} yrs
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(patient.status)} size="sm">
                    {patient.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-[#52665D] dark:text-[#8E9F95] pt-1">
                  <span>Last: {patient.lastSessionDate || 'None'}</span>
                  <span>Next: {patient.nextAppointmentDate || 'Not set'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Quick Schedule Modal */}
      <AppointmentModal
        isOpen={!!schedulingPatientId}
        onClose={() => setSchedulingPatientId(null)}
        defaultPatientId={schedulingPatientId || undefined}
      />
    </div>
  );
};
