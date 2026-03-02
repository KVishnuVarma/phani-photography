import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserBookings } from "../../api";
import ThemeToggle from "../../Components/ThemeToggle";

interface Booking {
  _id: string;
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

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden mt-16">
        <motion.div
          className="absolute inset-0 bg-cover bg-center z-0 brightness-[.3]"
          style={{
            backgroundImage: "url('/phani.jpg')",
            y: yImage,
            scale: scaleImage,
          }}
        />

        <motion.div
          style={{ y: yText }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome, {user?.username}!
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-neutral-200 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Your Photography Journey
          </motion.p>
        </motion.div>
      </section>

      {/* User Info Section */}
      <section className="bg-neutral-100 dark:bg-neutral-900 px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Username</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{user?.username}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Email</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{user?.email}</p>
            </div>
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
