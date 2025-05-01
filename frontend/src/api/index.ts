const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getServices = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/services`);
  return handleResponse(response);
};

export const getTestimonials = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/testimonials`);
  return handleResponse(response);
};

export const getGalleryImages = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/gallery`);
  return handleResponse(response);
};

export const submitContactForm = async (formData: any): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(response);
};

export const bookSession = async (sessionData: any): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });
  return handleResponse(response);
};
