import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchBanner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

