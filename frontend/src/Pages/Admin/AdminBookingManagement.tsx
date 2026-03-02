import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBookings, updateBookingStatus, deleteBooking } from '../../api';
import { motion } from 'framer-motion';

interface Booking {
  _id: string;
  userId: any;
  packageId: any;
  sessionDate: string;
  status: 'Pending' | 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled';
  amount: number;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
}

const AdminBookingManagement: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [bookings, statusFilter]);

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const data = await getBookings(token);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!token) return;

    try {
      await updateBookingStatus(bookingId, newStatus, token);
      setSuccess(`Booking status updated to ${newStatus}!`);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await deleteBooking(bookingId, token);
      setSuccess('Booking deleted successfully!');
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-600';
      case 'Confirmed':
        return 'bg-green-500/20 text-green-400 border-green-600';
      case 'Scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-600';
      case 'Completed':
        return 'bg-purple-500/20 text-purple-400 border-purple-600';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-600';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-600';
    }
  };

  const getProgressPercentage = (status: string) => {
    const statuses = ['Pending', 'Confirmed', 'Scheduled', 'Completed'];
    return ((statuses.indexOf(status) + 1) / statuses.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'Pending').length,
    confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    completed: bookings.filter((b) => b.status === 'Completed').length,
    revenue: bookings.filter((b) => b.status !== 'Cancelled').reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Bookings', value: stats.total, color: 'from-blue-600 to-blue-400' },
          { label: 'Pending', value: stats.pending, color: 'from-yellow-600 to-yellow-400' },
          { label: 'Confirmed', value: stats.confirmed, color: 'from-green-600 to-green-400' },
          { label: 'Completed', value: stats.completed, color: 'from-purple-600 to-purple-400' },
          { label: 'Revenue', value: `$${stats.revenue}`, color: 'from-emerald-600 to-emerald-400' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg text-black`}
          >
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter & Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 p-6 rounded-lg"
      >
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-2 rounded font-semibold transition ${
              statusFilter === 'All'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-4 py-2 rounded font-semibold transition ${
              statusFilter === 'Pending'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter('Confirmed')}
            className={`px-4 py-2 rounded font-semibold transition ${
              statusFilter === 'Confirmed'
                ? 'bg-green-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-4 py-2 rounded font-semibold transition ${
              statusFilter === 'Completed'
                ? 'bg-purple-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </motion.div>

      {/* Bookings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Booking Details</h2>

        {filteredBookings.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded text-center text-gray-400">
            No bookings found
          </div>
        ) : (
          filteredBookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition"
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Booking Progress</span>
                  <span className={`font-semibold border px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(booking.status)}%` }}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Client Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-400">Name:</span> {booking.contactInfo.name}
                    </p>
                    <p>
                      <span className="text-gray-400">Email:</span> {booking.contactInfo.email}
                    </p>
                    <p>
                      <span className="text-gray-400">Phone:</span> {booking.contactInfo.phone}
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Booking Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-400">Package:</span>{' '}
                      {booking.packageId?.title || 'N/A'}
                    </p>
                    <p>
                      <span className="text-gray-400">Session Date:</span>{' '}
                      {new Date(booking.sessionDate).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-gray-400">Booked On:</span>{' '}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Payment Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-2xl font-bold text-yellow-400">${booking.amount}</p>
                    <p className="text-gray-400">Payment Pending</p>
                    <p className="text-xs text-gray-500">
                      ID: {booking._id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="border-t border-gray-700 pt-4 flex flex-wrap gap-2">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  className="flex-1 min-w-[150px] bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/40 px-4 py-2 rounded text-sm transition"
                >
                  Delete Booking
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AdminBookingManagement;
