import { createSlice } from '@reduxjs/toolkit';

// Initial state for product details and address
const initialState = {
  productDetails: null, // Product details will be stored here
  quantity: 1, // Default quantity is 1
  address: null, // Single address to hold
};

const productAndAddressSlice = createSlice({
  name: 'productAndAddress',
  initialState,
  reducers: {
    // Set or update the product details and quantity
    setProductDetails: (state, action) => {
      const { productDetails, quantity } = action.payload;
      state.productDetails = productDetails; // Overwrite product details
      state.quantity = quantity; // Set or update quantity
    },
    
    // Set or update the quantity for the existing product
    setQuantity: (state, action) => {
      state.quantity = action.payload; // Set new quantity
    },
    
    // Add a new address (or overwrite if address already exists)
    addAddress: (state, action) => {
      state.address = action.payload; // Set address to payload
    },
    
    // Update the existing address
    updateAddress: (state, action) => {
      state.address = action.payload.updatedAddress; // Update the address
    },
    
    // Remove the address (set it to null)
    deleteAddress: (state) => {
      state.address = null; // Remove the address
    },
    
    // Reset product details and address to initial state
    resetProductAndAddress: () => initialState, // Reset everything back to initial state
  },

  clearOrderData: () => initialState,
});

// Export actions to use in components
export const {
  setProductDetails,
  setQuantity,
  addAddress,
  updateAddress,
  deleteAddress,
  resetProductAndAddress,
  clearOrderData,
} = productAndAddressSlice.actions;

// Export the reducer to use in the store
export default productAndAddressSlice.reducer;
