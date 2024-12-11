import axios from 'axios';

// Base URLs for different API endpoints
const API_AUTH_URL = 'http://localhost:3000/api/auth';
const API_ORDER_URL = 'http://localhost:3000/api/orders';
const API_COLLECTION_URL = 'http://localhost:3000/api/collections';
const API_CUSTOMER_URL = 'http://localhost:3000/api/customers';
const API_PRODUCT_URL = 'http://localhost:3000/api/products';

// Create an Axios instance with default settings
export const api = axios.create({
  baseURL: 'http://localhost:3000',
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
    return Promise.reject({ message: errorMsg });
  }
);

// Authentication functions
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`${API_AUTH_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error; // Pass the error for handling in the calling function
  }
};

// Order functions
export const addOrder = async (orderData) => {
  try {
    const response = await api.post(`${API_ORDER_URL}/add-order`, orderData);
    return response.data;
  } catch (error) {
    throw error; // Let the component handle the error
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get(`${API_ORDER_URL}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Collection functions
export const addCollection = async (collectionData) => {
  try {
    const response = await api.post(`${API_COLLECTION_URL}/add-collection`, collectionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollections = async () => {
  try {
    const response = await api.get(`${API_COLLECTION_URL}`);
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

