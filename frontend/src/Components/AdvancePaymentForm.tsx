import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getActiveScanners } from '../api';

interface Scanner {
  _id: string;
  scannerType: string;
  description?: string;
  scannerUrl: string;
}

interface AdvancePaymentFormProps {
  bookingId: string;
  bookingAmount: number;
  token: string;
  onSubmit: (paymentData: unknown) => Promise<void>;
  onCancel: () => void;
}

const PAYMENT_METHODS = [
  { id: 'Phonepe', name: 'PhonePe', icon: '📱' },
  { id: 'Paytm', name: 'Paytm', icon: '📲' },
  { id: 'GooglePay', name: 'Google Pay', icon: '💳' },
  { id: 'UPI', name: 'UPI', icon: '🏦' },
  { id: 'BankTransfer', name: 'Bank Transfer', icon: '🏦' },
];

const PRESET_AMOUNTS = [
  { value: 100, label: '+100' },
  { value: 500, label: '+500' },
  { value: 1000, label: '+1000' },
  { value: 2000, label: '+2000' },
];

const AdvancePaymentForm: React.FC<AdvancePaymentFormProps> = ({
  bookingId,
  bookingAmount,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    paymentMethod: 'Phonepe',
    amount: 1000,
    upiId: '',
    displayName: '',
    screenshot: '',
    transactionId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [loadingScanners, setLoadingScanners] = useState(true);

  useEffect(() => {
    fetchScanners();
  }, []);

  const fetchScanners = async () => {
    try {
      setLoadingScanners(true);
      const data = await getActiveScanners();
      const scannerList = Array.isArray(data) ? data : (data?.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      setScanners(scannerList);
    } catch (error) {
      console.error('Error fetching scanners:', error);
    } finally {
      setLoadingScanners(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.upiId.trim()) {
      setError('Please enter your UPI ID');
      return;
    }

    if (!formData.displayName.trim()) {
      setError('Please enter your display name');
      return;
    }

    if (!formData.transactionId.trim()) {
      setError('Please enter your transaction ID');
      return;
    }

    if (!screenshotFile && !formData.screenshot.trim()) {
      setError('Please upload payment screenshot');
      return;
    }

    if (formData.amount < 100) {
      setError('Minimum advance payment is ₹100');
      return;
    }

    setSubmitting(true);
    try {
      // If file is selected, convert to base64
      let screenshotUrl = formData.screenshot;
      if (screenshotFile) {
        screenshotUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(screenshotFile);
        });
      }

      await onSubmit({
        bookingId,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        upiId: formData.upiId,
        displayName: formData.displayName,
        screenshot: screenshotUrl,
        transactionId: formData.transactionId,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-300 font-serif">
          Advance Payment
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Complete your advance payment to confirm your booking
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm font-semibold">ℹ️ Important</p>
          <p className="text-sm mt-1">You must upload a screenshot and provide a transaction ID to submit your payment. The admin will verify your payment within 2-4 hours.</p>
        </div>

        {/* Payment Scanners */}
        {!loadingScanners && scanners.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-300 dark:border-primary-600 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-bold text-primary-800 dark:text-primary-300 mb-3">📱 Payment Methods</h3>
            <div className="space-y-2">
              {scanners.map((scanner) => (
                <div key={scanner._id} className="bg-white dark:bg-neutral-800 p-3 rounded-lg border border-primary-200 dark:border-primary-700">
                  <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">{scanner.scannerType}</p>
                  {scanner.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{scanner.description}</p>
                  )}
                  <img
                    src={scanner.scannerUrl}
                    alt={scanner.scannerType}
                    className="max-w-[150px] h-auto mt-2 rounded border border-neutral-300 dark:border-neutral-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-3">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    formData.paymentMethod === method.id
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{method.icon}</span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-3">
              Select Advance Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none mb-3"
              min="100"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: preset.value })}
                  className={`py-2 rounded font-semibold transition ${
                    formData.amount === preset.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 dark:bg-neutral-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
              Min: ₹100 | Max: ₹{bookingAmount}
            </p>
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-2">
              Your UPI ID *
            </label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-2">
              Display Name (as shown in payment) *
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Transaction ID *REQUIRED* */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-2">
              Transaction ID * (Required)
            </label>
            <input
              type="text"
              placeholder="Your transaction reference number"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none"
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Enter the transaction ID from your payment app
            </p>
          </div>

          {/* Payment Screenshot Upload *REQUIRED* */}
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 font-semibold mb-2">
              📸 Payment Screenshot * (Required)
            </label>
            <div className="space-y-2">
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-4 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setScreenshotFile(e.target.files[0]);
                      setFormData({ ...formData, screenshot: e.target.files[0].name });
                    }
                  }}
                  className="hidden"
                  id="screenshot-upload"
                  required
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                    {screenshotFile ? '✓ ' + screenshotFile.name : '📤 Click to upload screenshot'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
              {screenshotFile && (
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  ✓ File selected: {screenshotFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary-50 dark:bg-neutral-700 p-4 rounded-lg border border-primary-200 dark:border-neutral-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">Advance Amount:</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ₹{formData.amount}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-neutral-600 dark:text-neutral-400">
              <span>Remaining at shoot:</span>
              <span>₹{bookingAmount - formData.amount}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || !screenshotFile || !formData.transactionId.trim()}
              className={`flex-1 font-bold py-3 rounded-lg transition ${
                !screenshotFile || !formData.transactionId.trim()
                  ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white disabled:opacity-50'
              }`}
            >
              {submitting ? 'Processing...' : !screenshotFile ? '📸 Upload Screenshot First' : !formData.transactionId.trim() ? '📝 Enter Transaction ID' : '✓ Submit Payment'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center mt-4">
            ⏳ Your payment will be verified within 2-4 hours. You'll receive confirmation via email.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdvancePaymentForm;
