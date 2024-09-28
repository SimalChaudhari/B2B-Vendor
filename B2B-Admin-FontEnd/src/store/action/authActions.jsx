import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";


// Function to hash the token using the Web Cryptography API
async function hashToken(token) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(token); // Encode the token as a Uint8Array
        const hashedBuffer = await crypto.subtle.digest('SHA-256', data); // Hashing using SHA-256  
        // Convert the hashed buffer to a byte array
        const hashedArray = Array.from(new Uint8Array(hashedBuffer));
        // Convert byte array to hex string using template literals
        const hashedToken = hashedArray
        
        return hashedToken; // Return the hashed token
    } catch (error) {
        console.error("Error hashing token:", error);
        throw error; // Rethrow the error for further handling
    }
}


// Function to verify the token
async function verifyToken(originalToken, hashedToken) {
    const hashedOriginalToken = await hashToken(originalToken); // Hash the original token
    return hashedOriginalToken === hashedToken; // Compare hashed values
}

export const sendOtp = (email) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('auth/verify-otp', email);
        console.log("🚀 ~ sendOtp ~ response:", response)
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};


export const validateOtp = (email, otp) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('auth/login', { email, otp });

        // Hash the token using the Web Crypto API
        const token = response?.data?.access_token;
        // console.log("🚀 ~ validateOtp ~ token:", token)
        const hashedToken = await hashToken(token);
        // console.log("🚀 ~ validateOtp ~ hashedToken:", hashedToken)

        const isValid = await verifyToken(token, hashedToken);
        // console.log("🚀 ~ validateOtp ~ isValid:", isValid)

        localStorage.setItem('userData', JSON.stringify({ user: response?.data?.user }));
        localStorage.setItem('token', hashedToken); // Store the hashed token

        dispatch({
            type: 'LOGIN',
            payload: { user: response?.data?.user, token: hashedToken },
        });
        return { success: true, user: response?.data?.user }; //

    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};
