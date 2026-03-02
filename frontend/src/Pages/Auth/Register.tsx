import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../api';
import ThemeToggle from '../../Components/ThemeToggle';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await registerUser(username, email, password);
      // Auto login after registration
      const loginResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((r) => r.json());

      login(loginResponse.user, loginResponse.token);
      navigate('/user/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-4 py-8">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl dark:shadow-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-400 mb-2 text-center">Create Account</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6 text-sm sm:text-base">Join us today</p>

        {error && (
          <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Full Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
              placeholder="•••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
              placeholder="•••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-2.5 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-neutral-600 dark:text-neutral-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
