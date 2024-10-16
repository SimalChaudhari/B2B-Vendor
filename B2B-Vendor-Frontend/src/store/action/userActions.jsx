import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { USER_LIST } from "../constants/actionTypes";

export const userList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/users');
        dispatch({
            type: USER_LIST,
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
