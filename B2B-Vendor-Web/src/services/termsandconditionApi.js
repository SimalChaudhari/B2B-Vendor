import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchTermsAndCondition = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/terms-conditions`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

