import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPackageById, createBooking } from '../api';

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
      } catch (err: any) {
        setError(err.message || 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

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

      await createBooking(bookingData, token);
      navigate('/user/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Package not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Book {pkg.title}</h1>
          <p className="text-gray-300 mb-8">
            Price: <span className="text-3xl font-bold text-yellow-400">${pkg.price}</span>
          </p>

          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Session Date *</label>
              <input
                type="datetime-local"
                value={formData.sessionDate}
                onChange={(e) =>
                  setFormData({ ...formData, sessionDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-500 text-black py-3 rounded font-bold hover:bg-yellow-600 disabled:opacity-50 transition"
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
