// src/services/contactUsApi.js

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const addContactMessage = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/contact/create`, data);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
