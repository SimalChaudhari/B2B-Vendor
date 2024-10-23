import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    getToCart : (state, action) =>{
      state.cart = action.payload;
    },
    addToCart: (state, action) => {
      // Check if the item already exists in the cart
      const itemPresent = state.cart.find(item => item.id === action.payload.id);
      if (itemPresent) {
        // Increment the quantity by the amount being added
        itemPresent.quantity += action.payload.quantity;
      } else {
        // Add new item to the cart with quantity initialized
        state.cart.push({ ...action.payload, quantity: action.payload.quantity });
      }
    },
    removeFromCart: (state, action) => {
      // Filter out the item to be removed
      const removeItem = state.cart.filter(item => item.id !== action.payload.id);
      state.cart = removeItem;
    },
    incrementQuantity: (state, action) => {
      // Increment quantity of the specified item
      const itemPresent = state.cart.find(item => item.id === action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      // Decrement quantity of the specified item
      const itemPresent = state.cart.find(item => item.id === action.payload.id);
      if (itemPresent) {
        if (itemPresent.quantity === 1) {
          // If quantity is 1, remove the item from the cart
          const removeItem = state.cart.filter(item => item.id !== action.payload.id);
          state.cart = removeItem;
        } else {
          // Otherwise just decrement the quantity
          itemPresent.quantity--;
        }
      }
    },
    cleanCart: (state) => {
      // Clear the entire cart
      state.cart = [];
    }
  },
});

// Exporting actions for use in components
export const { getToCart, addToCart, removeFromCart, incrementQuantity, decrementQuantity, cleanCart } = CartSlice.actions;

// Exporting the reducer for the store
export default CartSlice.reducer;
