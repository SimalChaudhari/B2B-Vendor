// redux/productAndAddressReducer.js

const initialState = {
    productDetails: null,
    quantity: 1, // Default quantity
    address: null, // Single address to hold
};

const productAndAddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_DETAILS':
            return {
                ...state,
                productDetails: action.payload.productDetails, // Overwrite product details
                quantity: action.payload.quantity,
            };
        case 'SET_QUANTITY':
            return {
                ...state,
                quantity: action.payload,
            };
        case 'ADD_ADDRESS':
            return {
                ...state,
                address: action.payload, // Overwrite existing address with new address
            };
        case 'UPDATE_ADDRESS':
            return {
                ...state,
                address: action.payload.updatedAddress, // Update the single address
            };
        case 'DELETE_ADDRESS':
            return {
                ...state,
                address: null, // Set address to null when deleted
            };
        case 'RESET_PRODUCT_AND_ADDRESS': // Handle the reset action
            return initialState; // Reset state to initial state
        default:
            return state;
    }
};

// Action Creators
export const setProductDetails = (productDetails, quantity) => ({
    type: 'SET_PRODUCT_DETAILS',
    payload: { productDetails, quantity },
});

export const setQuantity = (quantity) => ({
    type: 'SET_QUANTITY',
    payload: quantity,
});

export const addAddress = (address) => ({
    type: 'ADD_ADDRESS',
    payload: address,
});

export const updateAddress = (updatedAddress) => ({ // Update action now does not need index
    type: 'UPDATE_ADDRESS',
    payload: { updatedAddress },
});

export const deleteAddress = () => ({ // Delete action does not require index
    type: 'DELETE_ADDRESS',
});

// Action creator for resetting product and address
export const resetProductAndAddress = () => ({
    type: 'RESET_PRODUCT_AND_ADDRESS',
});

export default productAndAddressReducer;
