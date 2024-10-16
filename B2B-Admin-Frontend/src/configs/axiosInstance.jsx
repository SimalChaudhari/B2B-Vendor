// src/configs/axiosInstance.jsx

import axios from 'axios';
import { API_URL } from './env';

const axiosInstance = axios.create({
  baseURL: API_URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use dot notation to set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type dynamically based on the request data
    if (config.data instanceof FormData) {
      // If the request data is FormData, set Content-Type to multipart/form-data
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      // Otherwise, set Content-Type to application/json
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config; // Return the config directly
  },
  (error) => Promise.reject(error)
);

// Response interceptor (you can customize this if needed)
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response
  (error) => Promise.reject(error) // Handle response errors
);

export default axiosInstance;
