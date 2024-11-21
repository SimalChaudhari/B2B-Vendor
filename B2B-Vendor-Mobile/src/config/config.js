// src/config/config.js
import axios from 'axios';
import { API_URL_SECONDARY } from '@env';

// Use your local IP address or your actual server URL
// const baseURL = 'http://192.168.1.112:3000'; // Adjust based on your network
const baseURL = API_URL_SECONDARY; // Adjust based on your network
// const baseURL = 'http://localhost:3000'; // Adjust based on your network

// console.log('API_URL_SECONDARY :', API_URL_SECONDARY);
const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export the axios instance
export default axiosInstance;
