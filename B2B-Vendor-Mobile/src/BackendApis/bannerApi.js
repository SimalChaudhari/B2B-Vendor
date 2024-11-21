import axios from 'axios';
import { API_URL_SECONDARY } from '@env';

// const BASE_URL = 'http://192.168.1.112:3000';
const BASE_URL = API_URL_SECONDARY;

export const fetchBanner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching Banner:', error);
        throw error;
    }
};
