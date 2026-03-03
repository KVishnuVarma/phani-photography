import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../Components/ThemeToggle';
import AdminDashboardHome from './Admin/AdminDashboardHome';
import AdminGalleryManagement from './Admin/AdminGalleryManagement';
import AdminPackageManagement from './Admin/AdminPackageManagement';
import AdminBookingManagement from './Admin/AdminBookingManagement';
import AdminPaymentVerification from './Admin/AdminPaymentVerification';
import AdminScannerManagement from './Admin/AdminScannerManagement';
import AdminReviewManagement from './Admin/AdminReviewManagement';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'packages' | 'gallery' | 'payments' | 'scanners' | 'reviews'>(
    'dashboard'
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard' as const, label: '📊 Dashboard', icon: '📊' },
    { id: 'bookings' as const, label: '📅 Bookings', icon: '📅' },
    { id: 'packages' as const, label: '📦 Packages', icon: '📦' },
    { id: 'gallery' as const, label: '🖼️ Gallery', icon: '🖼️' },
    { id: 'scanners' as const, label: '📱 Scanners', icon: '📱' },
    { id: 'reviews' as const, label: '⭐ Reviews', icon: '⭐' },
    { id: 'payments' as const, label: '💰 Payments', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-400">Admin Control Panel</h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Welcome, {user?.username}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition ${
                activeTab === tab.id
                  ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-primary-700 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'dashboard' && <AdminDashboardHome />}
          {activeTab === 'bookings' && <AdminBookingManagement />}
          {activeTab === 'packages' && <AdminPackageManagement />}
          {activeTab === 'gallery' && <AdminGalleryManagement />}
          {activeTab === 'scanners' && <AdminScannerManagement />}
          {activeTab === 'reviews' && <AdminReviewManagement />}
          {activeTab === 'payments' && <AdminPaymentVerification />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
