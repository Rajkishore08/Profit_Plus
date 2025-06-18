import axios from 'axios';

// Base URLs for different API endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create an Axios instance with default settings
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor to include the token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
    console.error('API Error:', errorMsg);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    
    return Promise.reject({ message: errorMsg });
  }
);

// Authentication functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Order functions
export const addOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders/add-order', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/api/orders/all-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Collection functions
export const addCollection = async (collectionData) => {
  try {
    const response = await api.post('/api/collections/add-collection', collectionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollections = async () => {
  try {
    const response = await api.get('/api/collections');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomers = async () => {
  try {
    const response = await api.get('/api/orders/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    throw new Error('Failed to load customers.');
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get('/api/orders/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw new Error('Failed to load products.');
  }
};