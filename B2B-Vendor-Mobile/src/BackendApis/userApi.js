// src/BackendApis/authApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../config/axiosInstance'; // Correct import path


// Create address data
export const addVendorAddress = async (AddressData) => {
    try {
        const response = await axiosInstance.post(`/addresses/create`, AddressData); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error Add Address Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};

// Fetch address data
export const fetchAddress = async () => {
    try {
        const response = await axiosInstance.get(`/addresses`); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching Address Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};

// Fetch user data
export const fetchUserData = async () => {
    try {
        const response = await axiosInstance.get(`/users`); // Use axiosInstance directly
        return response.data; // Return the data from response
    } catch (error) {
        console.error(`Error fetching User Data:`, error);
        throw error; // Re-throw the error for further handling
    }
};

// src/BackendApis/authApi.js
export const authLogout = async (clearContext) => {
    try {
        console.log('Starting logout process...');
        // Clear AsyncStorage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userData');

        console.log('AsyncStorage cleared successfully');

        // Clear context state if function is provided
        if (clearContext) {
            console.log('Clearing context...');
            clearContext();
        }

        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: error.message };
    }
};
