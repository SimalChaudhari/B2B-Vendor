import axios from 'axios';  // First import

// require('dotenv').config(); // Add this line for dotenv

// Add an empty line after import statements to satisfy ESLint
// const API_URL = process.env.VITE_API_URL;
// const TOKEN = process.env.VITE_TOKEN;  // If you need the token
const API_URL = "http://localhost:3000/";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHlvcG1haWwuY29tIiwiaWQiOiJjOGI2YzEyYS0zMTQwLTQzMTAtOTllMi1mZjFlZjgxMmUyNzMiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3Mjc3NTY0Nzd9.9w8vUmUj-RfD16KJGR3mSxsMkZ5dh8EzPPqCxQu_k1k";  // If you need the token

console.log('API URL:', API_URL);
console.log('Token:', TOKEN); // Should output the token from the .env file

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
      config.headers.Authorization = `Bearer ${token}`; // Using dot notation
    }
    return config; // Returning the config directly
  },
  (error) => Promise.reject(error)
);

// Response interceptor (you can customize this if needed)
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response
  (error) => Promise.reject(error) // Handle response errors
);

export default axiosInstance;
