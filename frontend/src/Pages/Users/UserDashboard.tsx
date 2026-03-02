/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserBookings } from "../../api";
import ThemeToggle from "../../Components/ThemeToggle";

interface Booking {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packageId: any;
  sessionDate: string;
  status: string;
  amount: number;
}

const UserDashboard: React.FC = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 600], [0, -200]);
  const scaleImage = useTransform(scrollY, [0, 600], [1.2, 1.4]);
  const yText = useTransform(scrollY, [0, 600], [0, -60]);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !token) return;
      try {
        const data = await getUserBookings(user.id, token);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full font-sans text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">Photography Studio</h1>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/gallery")}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Gallery
            </button>
            <button
              onClick={() => navigate("/packages")}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Packages
            </button>
            {/* Profile Button */}
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition font-medium"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section - Photography Summary */}
      <section className="relative w-full bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 px-6 md:px-16 py-20 mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Welcome, {user?.username}! 📸
            </h1>
            <p className="text-lg md:text-xl text-neutral-100 max-w-2xl mx-auto">
              Capture moments, create memories. Explore your photography journey with us.
            </p>
          </motion.div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur dark:bg-neutral-800/30 rounded-lg p-6 border border-white/20 dark:border-neutral-700/20 text-center"
            >
              <p className="text-4xl font-bold text-white mb-2">{bookings.length}</p>
              <p className="text-neutral-100 font-semibold">Total Bookings</p>
              <p className="text-sm text-neutral-200 mt-1">Sessions Booked</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur dark:bg-neutral-800/30 rounded-lg p-6 border border-white/20 dark:border-neutral-700/20 text-center"
            >
              <p className="text-4xl font-bold text-white mb-2">
                {bookings.filter(b => b.status === 'Completed').length}
              </p>
              <p className="text-neutral-100 font-semibold">Shoots Completed</p>
              <p className="text-sm text-neutral-200 mt-1">Finished Sessions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur dark:bg-neutral-800/30 rounded-lg p-6 border border-white/20 dark:border-neutral-700/20 text-center"
            >
              <p className="text-4xl font-bold text-white mb-2">
                ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0)}
              </p>
              <p className="text-neutral-100 font-semibold">Total Investment</p>
              <p className="text-sm text-neutral-200 mt-1">Spent on Sessions</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">Your Bookings</h2>

          {loading ? (
            <div className="text-neutral-600 dark:text-neutral-400 text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded text-center border border-neutral-200 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">No bookings yet</p>
              <button
                onClick={() => navigate("/packages")}
                className="bg-primary-600 text-white px-6 py-2 rounded font-bold hover:bg-primary-700 transition"
              >
                Browse Packages
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Package</p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {booking.packageId?.title || "Package"}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Session Date</p>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {new Date(booking.sessionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Price</p>
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        ${booking.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Status</p>
                      <p
                        className={`text-lg font-semibold ${
                          booking.status === "Confirmed"
                            ? "text-green-500 dark:text-green-400"
                            : booking.status === "Completed"
                            ? "text-primary-600 dark:text-primary-400"
                            : booking.status === "Cancelled"
                            ? "text-red-500 dark:text-red-400"
                            : "text-primary-600 dark:text-primary-400"
                        }`}
                      >
                        {booking.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="bg-neutral-100 dark:bg-neutral-900 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary-700 dark:text-primary-400">Admin Achievements 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Achievement: Photography Virtuoso */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="text-5xl mb-3">📸</div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Photography Virtuoso</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Master of all photography styles & techniques
              </p>
            </motion.div>

            {/* Achievement: Wedding Specialist */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="text-5xl mb-3">💒</div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Wedding Specialist</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                50+ stunning wedding photoshoots completed
              </p>
            </motion.div>

            {/* Achievement: Studio Legend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="text-5xl mb-3">⭐</div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Studio Legend</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                100+ happy clients & 95%+ satisfaction rate
              </p>
            </motion.div>

            {/* Achievement: Memory Maker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 text-center hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="text-5xl mb-3">✨</div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Memory Maker</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                1000+ perfect moments captured for eternity
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Photography */}
      <section className="bg-neutral-50 dark:bg-neutral-950 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary-700 dark:text-primary-400">About Your Photography Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">📷 Our Mission</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We believe every moment deserves to be captured beautifully. Our professional photographers work with you to create stunning, timeless images that tell your unique story.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">✨ Why Photography?</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Photography is not just about taking pictures—it's about preserving emotions, celebrating moments, and creating memories that last forever. With us, your memories become art.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">🎨 Our Expertise</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                From weddings to portraits, outdoor shoots to special events, our diverse portfolio covers all photography styles. Each shoot is customized to your unique vision.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-4">🌟 Your Experience</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                With {bookings.length} bookings and {bookings.filter(b => b.status === 'Completed').length} completed shoots, you're building an amazing portfolio with us!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-100 dark:bg-neutral-900 px-6 md:px-16 py-16 text-center border-t border-neutral-200 dark:border-neutral-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-400">Ready for More?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Explore our gallery and book your next photography session
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/gallery")}
              className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white px-6 py-3 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 transition border border-neutral-300 dark:border-neutral-700"
            >
              View Gallery
            </button>
            <button
              onClick={() => navigate("/packages")}
              className="bg-primary-600 text-white px-6 py-3 rounded font-bold hover:bg-primary-700 transition"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default UserDashboard;
