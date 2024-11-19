import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchBanner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

