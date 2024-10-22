import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { Order_LIST, ORDER_BY_LIST } from "../constants/actionTypes";

export const orderList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/order');
        dispatch({
            type: Order_LIST,
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

export const orderGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/order/get/${id}`);

        dispatch({
            type: ORDER_BY_LIST,
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

export const createOrder = (data) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/order/generate', data);
        return response;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const createOrderItem = (data) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/order/add-items', data);

        if (response && response.status >= 200 && response.status < 300) {
            toast.success('Order Has been Placed successfully!');
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