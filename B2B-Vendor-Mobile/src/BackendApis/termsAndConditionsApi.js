import axios from 'axios';

const BASE_URL = 'http://192.168.1.112:3000';

export const fetchTermsAndConditions = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/terms-conditions`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching TermsAndConditions :', error);
        throw error;
    }
};
