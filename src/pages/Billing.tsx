import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  FileText,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Transaction } from '../types';

export const Billing: React.FC = () => {
  const { transactions, patients, addTransaction, markTransactionAsPaid } = usePractice();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Paid' | 'Pending' | 'Overdue'>('all');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [receiptModalInvoice, setReceiptModalInvoice] = useState<Transaction | null>(null);

  // New Invoice Form state
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [newAmount, setNewAmount] = useState(2000);
  const [newDate, setNewDate] = useState('2026-09-10');
  const [newService, setNewService] = useState('Individual Psychotherapy Session (45 min)');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Direct Debit' | 'Insurance Co-pay'>('UPI');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.service.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || tx.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, selectedStatus]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId);
    if (!pat) return;

    addTransaction({
      patientId: newPatientId,
      patientName: pat.name,
      patientAvatar: pat.avatar,
      date: newDate,
      amount: Number(newAmount) || 2000,
      status: 'Pending',
      paymentMethod: newPaymentMethod,
      service: newService,
    });

    setIsNewInvoiceModalOpen(false);
  };

  const getStatusBadge = (status: 'Paid' | 'Pending' | 'Overdue') => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success" size="sm">Paid</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'Overdue':
        return <Badge variant="danger" size="sm">Overdue</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
            Billing & Invoices
          </h1>
          <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
            Track practice revenues, manage patient invoices, and issue receipts.
          </p>
        </div>

        <Button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Invoice
        </Button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              This Month's Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#182C23] dark:text-[#E5EEE9]">
              ₹42,500
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              +12.4% vs previous cycle
            </p>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Pending Invoices
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#182C23] dark:text-[#E5EEE9]">
              ₹6,500
            </div>
            <p className="text-xs text-[#71847A] dark:text-[#7F9387] mt-1">
              3 invoices awaiting settlement
            </p>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Total Settled (YTD)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#182C23] dark:text-[#E5EEE9]">
              ₹1,28,000
            </div>
            <p className="text-xs text-[#71847A] dark:text-[#7F9387] mt-1">
              100% fictional portfolio numbers
            </p>
          </div>
        </Card>

        <Card hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667B71] dark:text-[#899E94] uppercase tracking-wider">
              Average Session Fee
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF4F0] dark:bg-[#1E2B25] text-[#1E3A2F] dark:text-[#88BFAB] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#182C23] dark:text-[#E5EEE9]">
              ₹2,000
            </div>
            <p className="text-xs text-[#71847A] dark:text-[#7F9387] mt-1">
              Standard 45-minute clinical rate
            </p>
          </div>
        </Card>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#18221E] p-3 rounded-xl border border-[#E5EDE8] dark:border-[#22312B]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A8F83] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, invoice ID or session item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#F4F8F5] dark:bg-[#141D19] border border-[#DEE7E1] dark:border-[#24352D] rounded-lg text-[#182C23] dark:text-[#E2EDE7] focus:outline-none focus:border-[#2D5A4A]"
          />
        </div>

        <div className="inline-flex p-1 bg-[#EEF3F0] dark:bg-[#151D1A] rounded-lg border border-[#DCE6E0] dark:border-[#25352D] gap-1 self-start sm:self-auto">
          {(['all', 'Paid', 'Pending', 'Overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStatus === status
                  ? 'bg-white dark:bg-[#25362E] text-[#1B3429] dark:text-white shadow-2xs font-semibold'
                  : 'text-[#596D63] dark:text-[#83978D] hover:text-[#182C23]'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <Card padding="none" className="overflow-hidden border border-[#DCE6DF] dark:border-[#23332B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6EFEA] dark:border-[#213028] bg-[#FAFBF9] dark:bg-[#151D1A] text-[11px] font-semibold text-[#667B71] dark:text-[#7A9084] uppercase tracking-wider">
                <th className="py-3 px-5">Invoice</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF3EF] dark:divide-[#1F2D27] text-xs">
              {filteredTransactions.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-[#F6FAF8] dark:hover:bg-[#1C2722] transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={inv.patientAvatar} name={inv.patientName} size="xs" />
                      <span className="font-semibold text-[#182C23] dark:text-[#E2EDE7]">
                        {inv.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#52665C] dark:text-[#9FB1A8] max-w-[200px] truncate">
                    {inv.service}
                  </td>
                  <td className="py-3.5 px-4 text-[#52665C] dark:text-[#9FB1A8]">
                    {inv.date}
                  </td>
                  <td className="py-3.5 px-4 text-[#687C71] dark:text-[#889B92]">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#182C23] dark:text-white">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {inv.status !== 'Paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markTransactionAsPaid(inv.id)}
                          className="h-7 text-[11px] px-2 text-emerald-700 dark:text-emerald-400"
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReceiptModalInvoice(inv)}
                        icon={<FileText className="w-3 h-3" />}
                        className="h-7 text-[11px] px-2"
                      >
                        Receipt
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Create Invoice */}
      <Modal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        title="Create Practice Invoice"
        subtitle="Generate a billing record for a patient session."
        maxWidth="md"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Patient
            </label>
            <select
              value={newPatientId}
              onChange={(e) => setNewPatientId(e.target.value)}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Session Fee (₹)"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              required
            />
            <Input
              label="Invoice Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Service Item Description"
            placeholder="e.g. Individual Psychotherapy (45m)"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#34463E] dark:text-[#B5C9BF]">
              Payment Method
            </label>
            <select
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value as any)}
              className="w-full rounded-lg bg-white dark:bg-[#151D1A] border border-[#D9E4DD] dark:border-[#273730] text-sm text-[#1C2321] dark:text-[#E4EDE7] p-2.5 focus:border-[#2D5A4A] focus:outline-none"
            >
              <option value="UPI">UPI (Instant Transfer)</option>
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Direct Debit">Direct Bank Transfer</option>
              <option value="Insurance Co-pay">Insurance Co-pay</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6EEE9] dark:border-[#22312A]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewInvoiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Issue Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Receipt */}
      {receiptModalInvoice && (
        <Modal
          isOpen={!!receiptModalInvoice}
          onClose={() => setReceiptModalInvoice(null)}
          title="Clinical Practice Receipt"
          subtitle={`Receipt for ${receiptModalInvoice.invoiceNumber}`}
          maxWidth="md"
        >
          <div className="space-y-4 p-4 rounded-xl bg-[#F6FAF8] dark:bg-[#141C19] border border-[#DEE7E1] dark:border-[#23332B] text-xs">
            <div className="flex justify-between items-center border-b border-[#E1EAE4] dark:border-[#23322B] pb-3">
              <div>
                <h4 className="font-bold text-sm text-[#182C23] dark:text-white">
                  Serenity Practice
                </h4>
                <p className="text-[11px] text-[#697C72]">Dr. Ananya Sharma, Ph.D.</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#182C23] dark:text-white">
                  {receiptModalInvoice.invoiceNumber}
                </span>
                <p className="text-[11px] text-[#697C72]">{receiptModalInvoice.date}</p>
              </div>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="flex justify-between">
                <span className="text-[#697C72]">Billed To:</span>
                <span className="font-semibold text-[#182C23] dark:text-white">
                  {receiptModalInvoice.patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697C72]">Service:</span>
                <span className="font-semibold text-[#182C23] dark:text-white">
                  {receiptModalInvoice.service}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697C72]">Payment Mode:</span>
                <span className="font-semibold text-[#182C23] dark:text-white">
                  {receiptModalInvoice.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697C72]">Payment Status:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 capitalize">
                  {receiptModalInvoice.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E1EAE4] dark:border-[#23322B] flex justify-between items-center text-sm">
              <span className="font-bold text-[#182C23] dark:text-white">Total Amount:</span>
              <span className="font-bold text-base text-[#1E3A2F] dark:text-[#88BFA9]">
                ₹{receiptModalInvoice.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button
              size="sm"
              onClick={() => setReceiptModalInvoice(null)}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Done
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
