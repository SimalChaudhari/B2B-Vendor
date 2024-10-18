import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { CART_LIST } from "../constants/actionTypes";

export const cartList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/cart');
        dispatch({
            type: CART_LIST,
            payload: response.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const addToCart = (data) => async (dispatch) => {
    console.log("🚀 ~ addToCart ~ data:", data)
    try {
        const response = await axiosInstance.post('/cart/add', data);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Cart created successfully!');
            return true;
        }
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};
