import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Calendar, CheckCircle, Crown, RefreshCw, LayoutDashboard, Package, Image } from "lucide-react";
import Navbar from "../../Components/Navbar";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full font-sans text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-400 flex items-center gap-3">
              <User size={32} />
              Profile Details
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">Manage your account information</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Username Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <User size={24} className="text-primary-700 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Username</p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-white break-all">{user?.username}</p>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail size={24} className="text-blue-700 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Email Address</p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white break-all">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Member Since Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Calendar size={24} className="text-amber-700 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Member Since</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">March 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-green-400 dark:hover:border-green-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle size={24} className="text-green-700 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Account Status</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </motion.div>

            {/* Account Type */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-yellow-400 dark:hover:border-yellow-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Crown size={24} className="text-yellow-700 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Account Type</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">Premium Member</p>
                </div>
              </div>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-600 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <RefreshCw size={24} className="text-purple-700 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold mb-1 uppercase tracking-wide">Last Updated</p>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-400">About Your Journey</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Your photography experience with us</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-3xl shadow-lg"
          >
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Welcome to your professional photography profile! This is your personal space where you can track and manage all your photography sessions and bookings with us.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Whether you're capturing precious family moments, celebrating milestones, or documenting special events, you're building an amazing portfolio of memories with us. Access your dashboard anytime to view your bookings, explore new packages, or browse our gallery of stunning photography.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
                <CheckCircle size={20} />
                <span className="font-semibold">Account Verified</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle size={20} />
                <span className="font-semibold">All Services Active</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <CheckCircle size={20} />
                <span className="font-semibold">Premium Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Action Section */}
      <section className="bg-neutral-50 dark:bg-neutral-950 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-400">Quick Actions</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Navigate to different sections of the platform</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/user/dashboard")}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-5 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <LayoutDashboard size={24} />
              View Dashboard
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              onClick={() => navigate("/packages")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-5 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Package size={24} />
              Browse Packages
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/gallery")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-5 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Image size={24} />
              View Gallery
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
