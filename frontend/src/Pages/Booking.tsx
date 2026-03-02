import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPackageById, createBooking, createPayment } from '../api';
import ThemeToggle from '../Components/ThemeToggle';
import PaymentModal from '../Components/PaymentModal';
import AdvancePaymentForm from '../Components/AdvancePaymentForm';

interface Package {
  _id: string;
  title: string;
  price: number;
}

const BookingPage: React.FC = () => {
  const { packageId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingAmount, setBookingAmount] = useState(0);

  const [formData, setFormData] = useState({
    sessionDate: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return;
      try {
        const data = await getPackageById(packageId);
        setPkg(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handlePayNow = () => {
    setShowPaymentModal(false);
    setShowPaymentForm(true);
  };

  const handlePayLater = () => {
    setShowPaymentModal(false);
    navigate('/user/dashboard');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePaymentSubmit = async (paymentFormData: any) => {
    if (!bookingId || !user || !token) return;

    try {
      const paymentData = {
        bookingId,
        userId: user.id,
        amount: paymentFormData.amount,
        paymentMethod: paymentFormData.paymentMethod,
        upiId: paymentFormData.upiId,
        displayName: paymentFormData.displayName,
        transactionId: paymentFormData.transactionId,
        screenshot: paymentFormData.screenshot,
      };

      await createPayment(paymentData, token);
      setShowPaymentForm(false);
      
      // Show success message and redirect
      alert('Payment submitted successfully! Admin will verify within 2-4 hours.');
      navigate('/user/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert('Failed to submit payment: ' + (err.message || 'Unknown error'));
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    navigate('/user/dashboard');
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg || !user || !token) return;

    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        userId: user.id,
        packageId: pkg._id,
        amount: pkg.price,
        sessionDate: new Date(formData.sessionDate),
        contactInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
      };

      const response = await createBooking(bookingData, token);
      
      // Check if booking was created successfully
      if (response?._id) {
        setBookingId(response._id);
        setBookingAmount(pkg.price);
        setShowPaymentModal(true);
      } else {
        setError('Booking created but failed to get booking ID');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
        <div className="text-2xl">Package not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-20 px-4">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        bookingId={bookingId || ''}
        bookingAmount={bookingAmount}
        onPayNow={handlePayNow}
        onPayLater={handlePayLater}
        onClose={() => {
          setShowPaymentModal(false);
          navigate('/user/dashboard');
        }}
      />

      {/* Payment Form */}
      {showPaymentForm && bookingId && (
        <AdvancePaymentForm
          bookingId={bookingId}
          bookingAmount={bookingAmount}
          token={token || ''}
          onSubmit={handlePaymentSubmit}
          onCancel={handlePaymentCancel}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
          <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-400 mb-2">Book {pkg.title}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Price: <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">${pkg.price}</span>
          </p>

          {error && (
            <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Session Date *</label>
              <input
                type="datetime-local"
                value={formData.sessionDate}
                onChange={(e) =>
                  setFormData({ ...formData, sessionDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-3 rounded font-bold disabled:opacity-50 transition"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
