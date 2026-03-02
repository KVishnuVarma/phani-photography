const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Auth endpoints
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const getUserProfile = async (userId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Package endpoints
export const getAllPackages = async () => {
  const response = await fetch(`${API_BASE_URL}/packages`);
  return handleResponse(response);
};

export const getPackageById = async (packageId: string) => {
  const response = await fetch(`${API_BASE_URL}/packages/${packageId}`);
  return handleResponse(response);
};

export const createPackage = async (packageData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(packageData),
  });
  return handleResponse(response);
};

export const updatePackage = async (packageId: string, packageData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(packageData),
  });
  return handleResponse(response);
};

export const deletePackage = async (packageId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Booking endpoints
export const createBooking = async (bookingData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const getBookings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUserBookings = async (userId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getBookingById = async (bookingId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateBookingStatus = async (bookingId: string, status: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const deleteBooking = async (bookingId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Gallery endpoints
export const uploadImage = async (imageUrl: string, caption: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/gallery/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageUrl, caption }),
  });
  return handleResponse(response);
};

export const getGalleryImages = async () => {
  const response = await fetch(`${API_BASE_URL}/gallery/get`);
  return handleResponse(response);
};

export const deleteImage = async (imageId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/gallery/delete/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Works endpoints
export const getWorks = async () => {
  const response = await fetch(`${API_BASE_URL}/works/all`);
  return handleResponse(response);
};

export const addWork = async (formData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/works/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};

// Dashboard endpoints
export const getDashboardMetrics = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getRecentBookings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/recent-bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUpcomingPhotoshoots = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/upcoming-photoshoots`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Legacy endpoints (kept for compatibility)
export const getServices = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/packages`);
  return handleResponse(response);
};

export const getTestimonials = async (): Promise<any[]> => {
  // This would need a testimonials endpoint or can be mocked
  return [];
};

export const submitContactForm = async (_formData: any): Promise<void> => {
  // This would need a contact endpoint
  return Promise.resolve();
};

export const bookSession = async (sessionData: any): Promise<void> => {
  return createBooking(sessionData, localStorage.getItem('token') || '');
};
// Payment endpoints
export const createPayment = async (paymentData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });
  return handleResponse(response);
};

export const getPaymentByBooking = async (bookingId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/booking/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getPaymentsByUser = async (userId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAllPayments = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getPaymentsByStatus = async (status: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/status/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  adminNotes: string,
  token: string,
  scannerUrl?: string
) => {
  const response = await fetch(`${API_BASE_URL}/payments/verify/${paymentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, adminNotes, scannerUrl }),
  });
  return handleResponse(response);
};

export const getPaymentStats = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/payments/stats/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Scanner endpoints
export const getActiveScanners = async () => {
  const response = await fetch(`${API_BASE_URL}/scanners/active`);
  return handleResponse(response);
};

export const getAllScanners = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/scanners/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const uploadScanner = async (scannerData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/scanners/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scannerData),
  });
  return handleResponse(response);
};

export const updateScanner = async (scannerId: string, scannerData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/scanners/${scannerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scannerData),
  });
  return handleResponse(response);
};

export const deleteScanner = async (scannerId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/scanners/${scannerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const toggleScannerStatus = async (scannerId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/scanners/${scannerId}/toggle`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};