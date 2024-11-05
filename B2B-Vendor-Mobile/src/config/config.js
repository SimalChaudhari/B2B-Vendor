// src/config/config.js
import axios from 'axios';

// Use your local IP address or your actual server URL
const baseURL = 'http://192.168.1.112:3000'; // Adjust based on your network
// const baseURL = 'http://localhost:3000'; // Adjust based on your network

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export the axios instance
export default axiosInstance;
