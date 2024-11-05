import config from '../config/config'; // Correct import path

// Function to add a contact message
export const addContactUs = async (data) => {
    try {
        const response = await config.post('/contact/create', data); // Use axios to post
        return response.data; // Return the data from response
    } catch (error) {
        console.error('Error adding contact message:', error);
        throw error; // Re-throw the error for further handling
    }
};
