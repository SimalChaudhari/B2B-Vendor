import axios from 'axios';

const BASE_URL = 'http://192.168.1.112:3000';

export const fetchBanner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching Banner:', error);
        throw error;
    }
};
