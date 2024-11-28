import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

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

// Fetch items based on a search query
export const fetchItemsSearch = async (query) => {
    try {
        // Fetch all items
        const response = await axios.get(`${BASE_URL}/items`);
        const items = response?.data;

        if (query) {
            const filteredItems = items.data.filter(item => 
                item.itemName.toLowerCase().includes(query.toLowerCase()) || 
                (item.subGroup1 && item.subGroup1.toLowerCase().includes(query.toLowerCase())) ||
                (item.subGroup2 && item.subGroup2.toLowerCase().includes(query.toLowerCase()))
            );
            return filteredItems;
        }

        // If no query, return all items
        return items;

    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};

