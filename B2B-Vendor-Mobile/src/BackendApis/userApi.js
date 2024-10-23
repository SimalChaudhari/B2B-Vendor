// src/BackendApis/cartApi.js

import axiosInstance from '../config/axiosInstance'; // Correct import path

// Fetch a single item by ID 
export const fetchAddress = async () => {    
    try {
        const response = await axiosInstance.get(`/addresses`); // Use axiosInstance directly
        
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Address Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};