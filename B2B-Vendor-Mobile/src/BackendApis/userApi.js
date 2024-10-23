// src/BackendApis/authApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../config/axiosInstance'; // Correct import path

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

// Logout function to clear AsyncStorage
export const authLogout = async () => {
    try {
        // Clear AsyncStorage entries
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userData');
        console.log('User logged out and AsyncStorage cleared');
        return { success: true };
    } catch (error) {
        console.error('Error logging out:', error);
        return { success: false, error: error.message };
    }
};
