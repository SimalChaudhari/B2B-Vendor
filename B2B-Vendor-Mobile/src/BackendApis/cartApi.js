// src/BackendApis/cartApi.js

import axiosInstance from '../config/axiosInstance'; // Correct import path

// Add a product to the cart
export const addCart = async (productId, quantity) => {
    try {
        const response = await axiosInstance.post('/cart/add', { productId, quantity }); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Fetch a single item by ID 
export const fetchCart = async () => {
    try {
        const response = await axiosInstance.get(`/cart`); // Use axiosInstance directly
        
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Cart Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};
