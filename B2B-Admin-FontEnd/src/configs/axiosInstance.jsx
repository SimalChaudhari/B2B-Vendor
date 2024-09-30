// src/configs/axiosInstance.jsx

import axios from 'axios';
import { API_URL } from './env';

const axiosInstance = axios.create({
  baseURL: API_URL, // Your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use dot notation instead of bracket notation
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  // Returning the config directly
  },
  (error) => Promise.reject(error)
);

// Response interceptor (you can customize this if needed)
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response
  (error) => Promise.reject(error) // Handle response errors
);

export default axiosInstance;
