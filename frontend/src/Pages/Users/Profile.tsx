import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../Components/ThemeToggle";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
              className="hover:text-primary-700 dark:hover:text-primary-400 transition"
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
              onClick={() => navigate("/user/dashboard")}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Dashboard
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

      {/* Profile Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 px-6 md:px-16 py-20 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="w-32 h-32 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-6xl border-4 border-white dark:border-neutral-700 shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || '👤'}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-2"
          >
            {user?.username}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-neutral-100"
          >
            Professional Photography Member
          </motion.p>
        </div>
      </section>

      {/* Profile Details Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary-700 dark:text-primary-400">👤 Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Username Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">👤</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Username</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">{user?.username}</p>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📧</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Email Address</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white break-all">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Member Since Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📅</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Member Since</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">March 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">✅</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Account Status</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </motion.div>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">👑</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Account Type</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">Premium Member</p>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">🔄</div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">Last Updated</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">Today</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About You Section */}
      <section className="bg-neutral-100 dark:bg-neutral-900 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary-700 dark:text-primary-400">🎯 About You</h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700 max-w-2xl"
          >
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Welcome to your photography studio profile! This is where you can manage your account details and track your photography journey with us.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              From booking sessions to completing shoots, you're building an amazing portfolio. Keep memories alive by capturing moments that matter most to you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Action Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-primary-700 dark:text-primary-400">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate("/user/dashboard")}
              className="bg-primary-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-primary-700 transition border border-primary-700"
            >
              📊 View Dashboard
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/packages")}
              className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white px-6 py-4 rounded-lg font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition border border-neutral-300 dark:border-neutral-700"
            >
              📸 Browse Packages
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/gallery")}
              className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white px-6 py-4 rounded-lg font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition border border-neutral-300 dark:border-neutral-700"
            >
              🖼️ View Gallery
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
