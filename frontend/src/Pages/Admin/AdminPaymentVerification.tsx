import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getAllPayments,
  updatePaymentStatus,
  getPaymentsByStatus,
} from '../../api';
import { useAuth } from '../../context/AuthContext';

interface Payment {
  _id: string;
  bookingId: string | { _id: string; sessionDate?: string; contactInfo?: Record<string, unknown>; amount?: number };
  userId: string | { _id: string; username?: string; email?: string };
  amount: number;
  paymentMethod: string;
  upiId: string;
  displayName: string;
  transactionId?: string;
  screenshot?: string;
  scannerUrl?: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Refunded';
  adminNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string | { _id: string; username?: string };
  createdAt: string;
}

const AdminPaymentVerification: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Rejected'>('Verified');
  const [adminNotes, setAdminNotes] = useState('');
  const [scannerUrl, setScannerUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem('token') || '';

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPayments(token);
      // API returns array directly, not wrapped in data property
      const paymentList = Array.isArray(data) ? data : (data?.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      setPayments(paymentList);
      setFilteredPayments(paymentList);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleStatusFilter = async (status: string) => {
    setStatusFilter(status);
    if (status === 'All') {
      setFilteredPayments(payments);
    } else {
      try {
        const data = await getPaymentsByStatus(status, token);
        // API returns array directly
        const paymentList = Array.isArray(data) ? data : (data?.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
        setFilteredPayments(paymentList);
      } catch (error) {
        console.error('Error filtering payments:', error);
      }
    }
  };

  const handleVerifyPayment = async () => {
    if (!selectedPayment) return;

    try {
      setIsUpdating(true);
      await updatePaymentStatus(
        selectedPayment._id,
        verificationStatus,
        adminNotes,
        token,
        scannerUrl || undefined
      );
      
      // Update local state
      setPayments((prev) =>
        prev.map((p) =>
          p._id === selectedPayment._id
            ? {
                ...p,
                status: verificationStatus,
                adminNotes,
                scannerUrl: scannerUrl || p.scannerUrl || '',
                verifiedAt: new Date().toISOString(),
                verifiedBy: user?.id || 'unknown',
              }
            : p
        )
      );

      // Refresh to maintain filter
      if (statusFilter !== 'All') {
        await handleStatusFilter(statusFilter);
      } else {
        setFilteredPayments((prev) =>
          prev.map((p) =>
            p._id === selectedPayment._id
              ? {
                  ...p,
                  status: verificationStatus,
                  adminNotes,
                  scannerUrl: scannerUrl || p.scannerUrl || '',
                  verifiedAt: new Date().toISOString(),
                  verifiedBy: user?.id || 'unknown',
                }
              : p
          )
        );
      }

      setSelectedPayment(null);
      setAdminNotes('');
      setScannerUrl('');
      setVerificationStatus('Verified');
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'Verified':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'Rejected':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'Refunded':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getBookingId = (bookingId: any): string => {
    if (typeof bookingId === 'string') return bookingId;
    if (bookingId?._id) return bookingId._id;
    return 'N/A';
  };

  const getMethodEmoji = (method: string) => {
    const emojis: { [key: string]: string } = {
      Phonepe: '📱',
      Paytm: '🔵',
      GooglePay: '🔵',
      UPI: '💳',
      BankTransfer: '🏦',
    };
    return emojis[method] || '💰';
  };

  const getPaymentStats = () => {
    const stats = {
      total: payments.length,
      pending: payments.filter((p) => p.status === 'Pending').length,
      verified: payments.filter((p) => p.status === 'Verified').length,
      rejected: payments.filter((p) => p.status === 'Rejected').length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      verifiedAmount: payments
        .filter((p) => p.status === 'Verified')
        .reduce((sum, p) => sum + p.amount, 0),
    };
    return stats;
  };

  const stats = getPaymentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 p-4 rounded-lg border border-primary-300 dark:border-primary-600"
        >
          <p className="text-sm text-primary-700 dark:text-primary-300">Total Payments</p>
          <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg border border-yellow-300 dark:border-yellow-600"
        >
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg border border-green-300 dark:border-green-600"
        >
          <p className="text-sm text-green-700 dark:text-green-300">Verified</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.verified}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border border-blue-300 dark:border-blue-600"
        >
          <p className="text-sm text-blue-700 dark:text-blue-300">Total Verified Amount</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            ₹{stats.verifiedAmount.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition-all ${
              statusFilter === status
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-600 dark:text-neutral-400">
              No payments found with status: {statusFilter}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-l-4 p-4 rounded-lg dark:bg-neutral-800 ${getStatusColor(payment.status)}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getMethodEmoji(payment.paymentMethod)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{payment.displayName}</h3>
                      <p className="text-sm opacity-75">
                        Booking ID: {getBookingId(payment.bookingId).slice(-6)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-3">
                    <div>
                      <p className="opacity-75">Payment Method</p>
                      <p className="font-semibold">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="opacity-75">UPI ID</p>
                      <p className="font-semibold break-all">{payment.upiId}</p>
                    </div>
                    <div>
                      <p className="opacity-75">Amount</p>
                      <p className="font-semibold">₹{payment.amount}</p>
                    </div>
                    <div>
                      <p className="opacity-75">Status</p>
                      <span className="inline-block px-2 py-1 bg-opacity-30 rounded text-xs font-semibold">
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  {payment.transactionId && (
                    <p className="text-sm mt-2 opacity-75">
                      Transaction ID: <span className="font-mono font-semibold">{payment.transactionId}</span>
                    </p>
                  )}

                  {payment.screenshot && (
                    <div className="mt-2">
                      <p className="text-sm opacity-75 mb-1">Screenshot:</p>
                      <a
                        href={payment.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline hover:opacity-75"
                      >
                        View Payment Proof
                      </a>
                    </div>
                  )}

                  {payment.adminNotes && (
                    <p className="text-sm mt-2 opacity-75">
                      Notes: <span className="block italic mt-1">{payment.adminNotes}</span>
                    </p>
                  )}

                  <p className="text-xs opacity-50 mt-2">
                    Submitted: {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {payment.status === 'Pending' && (
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setVerificationStatus('Verified');
                      setAdminNotes('');
                      setScannerUrl('');
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    ✓ Review
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Verification Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Verify Payment
            </h2>

            {/* Payment Summary */}
            <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg space-y-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Name: <span className="font-semibold text-neutral-900 dark:text-white">{selectedPayment.displayName}</span>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                UPI ID: <span className="font-semibold text-neutral-900 dark:text-white">{selectedPayment.upiId}</span>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Amount: <span className="font-semibold text-neutral-900 dark:text-white">₹{selectedPayment.amount}</span>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Method: <span className="font-semibold text-neutral-900 dark:text-white">{selectedPayment.paymentMethod}</span>
              </p>
            </div>

            {/* Verification Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white">
                Verification Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setVerificationStatus('Verified')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold ${
                    verificationStatus === 'Verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  ✓ Verified
                </button>
                <button
                  onClick={() => setVerificationStatus('Rejected')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all font-semibold ${
                    verificationStatus === 'Rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  ✗ Rejected
                </button>
              </div>
            </div>

            {/* Scanner/QR Code Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white">
                📱 Payment Scanner/QR Code URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/qr-code.jpg"
                value={scannerUrl}
                onChange={(e) => setScannerUrl(e.target.value)}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Upload UPI ID, QR code, or payment details scanner image for user reference
              </p>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add verification notes, rejection reason, etc."
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPayment}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
              >
                {isUpdating ? 'Updating...' : 'Save Verification'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPaymentVerification;
