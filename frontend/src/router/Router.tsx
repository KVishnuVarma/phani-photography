import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../Pages/Home';
import LoginPage from '../Pages/Auth/Login';
import RegisterPage from '../Pages/Auth/Register';
import GalleryPage from '../Pages/Gallery';
import PackagesPage from '../Pages/Packages';
import BookingPage from '../Pages/Booking';
import UserDashboard from '../Pages/Users/UserDashboard';
import AdminDashboard from '../Pages/AdminDashboard';
import ProtectedRoute from '../Components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
  },
  {
    path: '/packages',
    element: <PackagesPage />,
  },
  {
    path: '/booking/:packageId',
    element: (
      <ProtectedRoute>
        <BookingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/dashboard',
    element: (
      <ProtectedRoute requiredRole="user">
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
