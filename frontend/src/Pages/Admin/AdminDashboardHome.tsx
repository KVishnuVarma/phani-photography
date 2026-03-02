import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  getDashboardMetrics,
  getRecentBookings,
  getUpcomingPhotoshoots,
  getBookings,
  updateBookingStatus,
} from '../../api';

interface Booking {
  _id: string;
  userId: any;
  packageId: any;
  sessionDate: string;
  status: string;
  amount: number;
  contactInfo: {
    name: string;
    email: string;
  };
}

interface Metrics {
  todayBookings: number;
  weeklyBookings: number;
  monthlyRevenue: number;
  totalClients: number;
}

const AdminDashboardHome: React.FC = () => {
  const { user, token } = useAuth();

  const [metrics, setMetrics] = useState<Metrics>({
    todayBookings: 0,
    weeklyBookings: 0,
    monthlyRevenue: 0,
    totalClients: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingPhotoshoots, setUpcomingPhotoshoots] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [metricsData, recentData, upcomingData, allData] = await Promise.all([
          getDashboardMetrics(token),
          getRecentBookings(token),
          getUpcomingPhotoshoots(token),
          getBookings(token),
        ]);

        setMetrics(metricsData);
        setRecentBookings(recentData);
        setUpcomingPhotoshoots(upcomingData);
        setAllBookings(allData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateBookingStatus(bookingId, newStatus, token);
      // Refresh bookings
      const updated = await getBookings(token);
      setAllBookings(updated);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Today's Bookings",
            value: metrics.todayBookings,
            color: 'from-yellow-600 to-yellow-400',
          },
          {
            label: 'Weekly Bookings',
            value: metrics.weeklyBookings,
            color: 'from-blue-600 to-blue-400',
          },
          {
            label: 'Monthly Revenue',
            value: `$${metrics.monthlyRevenue}`,
            color: 'from-green-600 to-green-400',
          },
          {
            label: 'Total Clients',
            value: metrics.totalClients,
            color: 'from-purple-600 to-purple-400',
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${metric.color} p-6 rounded-lg text-black`}
          >
            <p className="text-sm font-semibold opacity-80">{metric.label}</p>
            <p className="text-4xl font-bold mt-2">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 p-6 rounded-lg mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-400">No recent bookings</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-700 p-4 rounded border border-gray-600 hover:border-yellow-500 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Client Name</p>
                    <p className="font-semibold">{booking.contactInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Package</p>
                    <p className="font-semibold">{booking.packageId?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="font-semibold">
                      {new Date(booking.sessionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Photoshoots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 p-6 rounded-lg mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Upcoming Photoshoots</h2>
        {upcomingPhotoshoots.length === 0 ? (
          <p className="text-gray-400">No upcoming photoshoots</p>
        ) : (
          <div className="space-y-4">
            {upcomingPhotoshoots.map((shoot) => (
              <div
                key={shoot._id}
                className="bg-gray-700 p-4 rounded border border-gray-600 hover:border-green-500 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Client</p>
                    <p className="font-semibold">{shoot.contactInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(shoot.sessionDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Package</p>
                    <p className="font-semibold">{shoot.packageId?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        shoot.status === 'Confirmed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {shoot.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* All Bookings with Status Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Client Name</th>
                <th className="text-left py-3 px-4">Package</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                  <td className="py-3 px-4">{booking.contactInfo.name}</td>
                  <td className="py-3 px-4">{booking.packageId?.title || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {new Date(booking.sessionDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-yellow-400 font-semibold">${booking.amount}</td>
                  <td className="py-3 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardHome;
