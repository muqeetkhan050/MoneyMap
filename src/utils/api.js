import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getUser = () => api.get('/auth/user');

// Upload API
export const uploadBankStatement = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Analytics APIs
export const getOverview = () => api.get('/analytics/overview');
export const getTransactions = () => api.get('/analytics/transactions');
export const getCategories = () => api.get('/analytics/categories');
export const getBudget = () => api.get('/mybudget/budget');



export default api;