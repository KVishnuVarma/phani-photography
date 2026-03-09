import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Image, Package, Mail, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    if (isAuthenticated) {
      navigate('/user/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition cursor-pointer bg-transparent border-none p-0"
        >
          Photography Studio
        </button>
        <div className="flex gap-3 sm:gap-6 items-center">
          <button onClick={handleHomeClick} className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition cursor-pointer bg-transparent border-none p-0">
            <Home size={18} />
            Home
          </button>
          <Link to="/gallery" className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
            <Image size={18} />
            Gallery
          </Link>
          <Link to="/packages" className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
            <Package size={18} />
            Packages
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                <User size={18} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition font-semibold cursor-pointer bg-transparent border-none p-0"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/contact" className="flex items-center gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                <Mail size={18} />
                Contact
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
              >
                <LogIn size={18} />
                Login
              </Link>
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
