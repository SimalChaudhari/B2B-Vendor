import axios from 'axios';
import { API_URL_SECONDARY } from '@env';

// const BASE_URL = 'http://192.168.1.112:3000';
const BASE_URL = API_URL_SECONDARY;

export const fetchItems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/items`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

// Fetch a single item by ID
export const fetchItemById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/items/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching item with ID ${id}:`, error);
        throw error;
    }
};

export const fetchFilterItems = async (category) => {
    try {
        let response;
        
        // Fetch all items from the backend
        response = await axios.get(`${BASE_URL}/items`);
        const allItems = response?.data;

        // If a category is provided, filter the items based on the category
        if (category) {
            console.log('Filtering items by category:', category);

            // Filter items whose group matches the provided category
            const filteredItems = allItems.data.filter(item => item.group === category);
            return { ...allItems, data: filteredItems }; // Return the filtered items
        } else {
            console.log('No category provided, returning all items');
            return allItems; // Return all items if no category is provided
        }

    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};