// src/BackendApis/cartApi.js

import axiosInstance from '../config/axiosInstance'; // Correct import path

// Add a product to the cart
export const addCart = async (Itemdata) => {
    try {
        const response = await axiosInstance.post('/cart/add', Itemdata); // Remove the wrapping around Itemdata
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


// Increase item quantity
export const increaseQuantity = async (id) => {
    try {
        await axiosInstance.patch(`/cart/increment/${id}`);
        // toast.success('Quantity increased!');
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to increase quantity.';
        // toast.error(errorMessage);
        console.error('Error increasing quantity:', error);
        throw error;
    }
};

// Decrease item quantity
export const decreaseQuantity = async (id) => {
    try {
        await axiosInstance.patch(`/cart/decrement/${id}`);
        // toast.success('Quantity decreased!');
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to decrease quantity.';
        // toast.error(errorMessage);
        console.error('Error decreasing quantity:', error);
        throw error;
    }
};

// Delete a cart item by ID
export const deleteCartItem = async (id) => {
    try {
        const response = await axiosInstance.delete(`/cart/delete/${id}`);
        // toast.success('Item removed from cart!');
        return response.data; // Return response if needed
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'Failed to delete cart item.';
        // toast.error(errorMessage);
        console.error('Error deleting cart item:', error);
        throw error;
    }
};