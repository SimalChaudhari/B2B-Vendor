import axios from 'axios';

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://192.168.1.112:3000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authVerify = async (contact) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', { contact });
        return response?.data;
    } catch (error) {
        console.error('Error verifying OTP:', error?.response?.data || error.message);
        throw error;
    }
};

export const authLogin = async (contact, otp) => {
    try {
        const response = await axiosInstance.post('/auth/login', { contact, otp });

        // Ensure your backend returns the correct structure
        const token = response?.data?.access_token; // Ensure this is correct
        const user = response?.data?.user; // Adjust if the user data structure is different


        console.log('====================================');
        console.log("API ", response?.data);
        console.log('====================================');

        return { success: true, user, token }; // Return user and token
    } catch (error) {
        console.error('Error during login:', error?.response?.data || error.message);
        throw error; // This will propagate the error to the calling function
    }
};

