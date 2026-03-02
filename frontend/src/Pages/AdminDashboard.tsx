import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboardHome from './Admin/AdminDashboardHome';
import AdminGalleryManagement from './Admin/AdminGalleryManagement';
import AdminPackageManagement from './Admin/AdminPackageManagement';
import AdminBookingManagement from './Admin/AdminBookingManagement';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'packages' | 'gallery'>(
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
