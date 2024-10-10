import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { CONTACT_GET_BY_LIST, CONTACT_LIST, FAQ_GET_BY_LIST, FAQ_LIST } from "../constants/actionTypes";

// FAQ Settings
export const FAQList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/faq');
        dispatch({
            type: FAQ_LIST,
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

export const FAQGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/faq/${id}`);
        dispatch({
            type: FAQ_GET_BY_LIST,
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

export const createFAQ = (faqData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/faq/create', faqData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ created successfully!');
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

export const editFAQ = (faqId, faqData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/faq/update/${faqId}`, faqData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteFAQ = (faqId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/faq/delete/${faqId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

// Contact Settings

export const contactList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/contact');
         dispatch({
            type: CONTACT_LIST,
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

export const contactGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/contact/get/${id}`);

        dispatch({
            type: CONTACT_GET_BY_LIST,
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

export const createContact = (contactData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/contact/create', contactData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'contact created successfully!');
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

export const editContact = (contactId, contactData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/contact/update/${contactId}`, contactData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'contact updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteContact = (contactId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/contact/delete/${contactId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'contact deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};