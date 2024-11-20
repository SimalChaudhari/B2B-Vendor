import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { RECEIVABLE_GET_BY_LIST, RECEIVABLE_LIST } from "../constants/actionTypes";

export const receivableList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/ledgers/receivable');
        dispatch({
            type: RECEIVABLE_LIST,
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

export const receivableGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/ledgers/receivable/${id}`);
        dispatch({
            type: RECEIVABLE_GET_BY_LIST,
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

export const syncReceivable = () => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/ledgers/receivable/fetch');
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'ledgers fetched and stored successfully!');
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

export const deleteReceivable = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/ledgers/receivable/delete/${id}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'ledgers deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};


