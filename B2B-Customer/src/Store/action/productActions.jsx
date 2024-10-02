import { toast } from "sonner";
import axiosInstance from "src/Config/config";
import { PRODUCT_LIST } from "../constants/actionTypes";

export const productListData = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/products');
        
        // Log the specific data portion of the response
        // console.log('Product Data:', response?.data?.data);

        dispatch({
            type: PRODUCT_LIST,
            payload: response?.data?.data, // Assuming response contains the products data
        });

        return true; // Return true when successful
    } catch (error) {
        // Improved error logging for debugging
        console.error('Error fetching product list:', error);

        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        
        // Show the error message in toast notification
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};
