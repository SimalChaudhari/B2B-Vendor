import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { PRODUCT_LIST } from "../constants/actionTypes";

export const productList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/products');
        dispatch({
            type: PRODUCT_LIST,
            payload: response.data?.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const createProduct = (productData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/products/create', productData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'User registered successfully!');
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

export const editProduct = (productId, productData) => async (dispatch) => {
    try {
        const response = await axiosInstance.patch(`/products/update/${productId}`, productData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Product updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteProduct = (productId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/products/delete/${productId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Product deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};