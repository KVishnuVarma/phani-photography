import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  getAllScanners,
  uploadScanner,
  updateScanner,
  deleteScanner,
  toggleScannerStatus,
} from '../../api';
import { useAuth } from '../../context/AuthContext';

interface Scanner {
  _id: string;
  scannerUrl: string;
  scannerType: 'UPI' | 'QR' | 'BankDetails' | 'PhonePe' | 'GooglePay' | 'Paytm';
  description?: string;
  isActive: boolean;
  uploadedBy?: { _id: string; username?: string };
  createdAt?: string;
  updatedAt?: string;
}

const SCANNER_TYPES = [
  { id: 'UPI', label: 'UPI', icon: '💳' },
  { id: 'QR', label: 'QR Code', icon: '📱' },
  { id: 'BankDetails', label: 'Bank Details', icon: '🏦' },
  { id: 'PhonePe', label: 'PhonePe', icon: '📱' },
  { id: 'GooglePay', label: 'Google Pay', icon: '🔵' },
  { id: 'Paytm', label: 'Paytm', icon: '🎯' },
];

const AdminScannerManagement: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingScanner, setEditingScanner] = useState<Scanner | null>(null);
  
  const [formData, setFormData] = useState({
    scannerUrl: '',
    scannerType: 'UPI' as 'UPI' | 'QR' | 'BankDetails' | 'PhonePe' | 'GooglePay' | 'Paytm',
    description: '',
  });
  const [scannerFile, setScannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchScanners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScanners = async () => {
    try {
      setLoading(true);
      const data = await getAllScanners(token);
      const scannerList = Array.isArray(data) ? data : (data?.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      setScanners(scannerList);
    } catch (error) {
      console.error('Error fetching scanners:', error);
      setMessage('Failed to load scanners');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingScanner(null);
    setFormData({ scannerUrl: '', scannerType: 'UPI', description: '' });
    setScannerFile(null);
    setPreviewUrl('');
    setIsAddingNew(true);
    setMessage('');
  };

  const handleEditScanner = (scanner: Scanner) => {
    setEditingScanner(scanner);
    setFormData({
      scannerUrl: scanner.scannerUrl,
      scannerType: scanner.scannerType,
      description: scanner.description || '',
    });
    setPreviewUrl(scanner.scannerUrl);
    setScannerFile(null);
    setIsAddingNew(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingScanner(null);
    setFormData({ scannerUrl: '', scannerType: 'UPI', description: '' });
    setScannerFile(null);
    setPreviewUrl('');
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    setScannerFile(file);
    setMessage('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      // Set the base64 as scannerUrl
      setFormData({ ...formData, scannerUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (!scannerFile && !editingScanner) {
        setMessage('Please select a scanner image');
        setSubmitting(false);
        return;
      }

      if (!formData.scannerUrl.trim()) {
        setMessage('Scanner image is required');
        setSubmitting(false);
        return;
      }

      if (editingScanner) {
        // Update existing
        await updateScanner(editingScanner._id, formData, token);
        setMessage('Scanner updated successfully!');
      } else {
        // Add new
        await uploadScanner(formData, token);
        setMessage('Scanner uploaded successfully!');
      }

      // Refresh list
      await fetchScanners();
      handleCancel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.message || 'Failed to save scanner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScanner = async (scannerId: string) => {
    if (!window.confirm('Are you sure you want to delete this scanner?')) return;

    try {
      setSubmitting(true);
      await deleteScanner(scannerId, token);
      setMessage('Scanner deleted successfully!');
      await fetchScanners();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete scanner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (scannerId: string) => {
    try {
      setSubmitting(true);
      await toggleScannerStatus(scannerId, token);
      await fetchScanners();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.message || 'Failed to toggle status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading scanners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            message.includes('successfully')
              ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-800 dark:text-red-300'
          }`}
        >
          {message}
        </motion.div>
      )}

      {/* Add/Edit Scanner Form */}
      {isAddingNew && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
            {editingScanner ? '✏️ Edit Scanner' : '➕ Add New Scanner'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Scanner Type */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Scanner Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SCANNER_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setFormData({ ...formData, scannerType: type.id as any })}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      formData.scannerType === type.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
                    }`}
                  >
                    <span className="text-xl block mb-1">{type.icon}</span>
                    <span className="text-xs font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scanner Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Scanner Image *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">📸 Click to upload or drag and drop</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">PNG, JPG, GIF (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={!editingScanner}
                  />
                </label>
              </div>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Preview</p>
                <img
                  src={previewUrl}
                  alt="Scanner preview"
                  className="max-w-xs h-auto rounded-lg border border-neutral-300 dark:border-neutral-600"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Description (Optional)
              </label>
              <textarea
                placeholder="e.g., UPI ID: yourname@upi or Scan this QR for PhonePe payment"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
              >
                {submitting ? 'Saving...' : editingScanner ? '💾 Update Scanner' : '➕ Add Scanner'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Scanners List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Payment Scanners</h2>
          {!isAddingNew && (
            <button
              onClick={handleAddNew}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              ➕ Add Scanner
            </button>
          )}
        </div>

        {scanners.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-4">📱 No payment scanners added yet</p>
            <button
              onClick={handleAddNew}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Add Your First Scanner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scanners.map((scanner) => (
              <motion.div
                key={scanner._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border p-4 ${
                  scanner.isActive
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 opacity-60'
                }`}
              >
                {/* Preview */}
                <div className="mb-3">
                  <img
                    src={scanner.scannerUrl}
                    alt={scanner.scannerType}
                    className="w-full h-48 object-contain rounded-lg border border-neutral-300 dark:border-neutral-600"
                  />
                </div>

                {/* Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {SCANNER_TYPES.find((t) => t.id === scanner.scannerType)?.label}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        scanner.isActive
                          ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                          : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {scanner.isActive ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>

                  {scanner.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{scanner.description}</p>
                  )}

                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    Added: {new Date(scanner.createdAt || '').toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(scanner._id)}
                    disabled={submitting}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold transition text-sm ${
                      scanner.isActive
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    } disabled:opacity-50`}
                  >
                    {scanner.isActive ? '🔄 Disable' : '✓ Enable'}
                  </button>
                  <button
                    onClick={() => handleEditScanner(scanner)}
                    className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteScanner(scanner._id)}
                    disabled={submitting}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScannerManagement;
