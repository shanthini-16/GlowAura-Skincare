import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('glowaura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  otpLogin: (data) => api.post('/auth/otp-login', data),
  googleLogin: (data) => api.post('/auth/google-login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const scanAPI = {
  analyze: (data) => api.post('/scan', data),
  getUserScans: () => api.get('/user/scans'),
  getLatestScan: () => api.get('/user/scans/latest'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/review`, data),
};

export const checkoutAPI = {
  applyCoupon: (data) => api.post('/coupons/apply', data),
  placeOrder: (data) => api.post('/orders', data),
  getOrderTracking: (orderNumber) => api.get(`/orders/${orderNumber}`),
  getUserOrders: () => api.get('/user/orders'),
};

export const wellnessAPI = {
  getDietPlan: (data) => api.post('/diet/generate', data),
  getWeatherAdvice: (city) => api.get('/weather-advice', { params: { city } }),
  askChatbot: (message) => api.post('/chatbot', { message }),
};

export default api;
