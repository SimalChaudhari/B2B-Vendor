import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// const BASE_URL = 'http://192.168.1.112:3000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// UserAction.js

export const authRegister = async (Data) => {
    
    try {
        const response = await axiosInstance.post('/auth/register', {
            name: Data.name,
            address: Data.address,
            country: Data.country,
            state: Data.state,
            pincode: Data.pincode,
            mobile: Data.mobile,
            email: Data.email,
        });
        return response?.data;
    } catch (error) {
        console.error('Failed Process :', error?.response?.data || error.message);
        throw error;
    }
};

