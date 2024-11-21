// src/BackendApis/cartApi.js

import axiosInstance from '../config/axiosInstance'; // Correct import path

// Add Order Api
export const addOrderFirst = async (addressId, totalPrice, totalQuantity, discount, finalAmount, DeliveryType) => {
    try {
        const response = await axiosInstance.post('/order/generate', { addressId, totalPrice, totalQuantity, discount, finalAmount, DeliveryType }); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error('Error adding to Order:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Add Items 
export const addOrderSecond = async (id, orderProducts) => {   
    try {
        const response = await axiosInstance.post(`/order/add-items`, {id, products:orderProducts}); // Use axiosInstance directly
        
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Order Item:`, error);
        throw error; // Re-throw the error for further handling
    }
};

// Fetch All Data
export const getAllOrder = async () => {   
    try {
        const response = await axiosInstance.get(`/order/get`); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Orders And Items:`, error);
        throw error; // Re-throw the error for further handling
    }
};
