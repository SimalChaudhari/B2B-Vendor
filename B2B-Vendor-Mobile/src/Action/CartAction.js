// /redux/cartActions.js
import { setCart, clearCart } from './CartReducer';
import {
  addCart,
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem,
} from '../BackendApis/cartApi';

// Function to fetch cart items from the API
export const fetchCartItemsApi = async () => {
  try {
    const cartItems = await fetchCart(); // Call API to fetch cart
    console.log('====================================');
    console.log("5555555 cartItems",cartItems);
    console.log('====================================');
    return cartItems; // Return fetched cart items
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to add an item to the cart
export const addItemToCartApi = async (productId, quantity) => {
  try {
    await addCart(productId, quantity); // Call API to add item
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to increase item quantity
export const increaseCartItemQuantityApi = async (id) => {
  try {
    await increaseQuantity(id); // Call API to increase quantity
  } catch (error) {
    console.error('Failed to increase item quantity:', error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to decrease item quantity
export const decreaseCartItemQuantityApi = async (id) => {
  try {
    await decreaseQuantity(id); // Call API to decrease quantity
  } catch (error) {
    console.error('Failed to decrease item quantity:', error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to delete an item from the cart
export const deleteItemFromCartApi = async (id) => {
  try {
    await deleteCartItem(id); // Call API to delete item
  } catch (error) {
    console.error('Failed to delete item from cart:', error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to clear the cart
export const clearCartItemsApi = () => {
  return clearCart(); // Return action to clear cart
};

// Actions that use the above API functions and dispatch to Redux store
export const fetchCartItems = () => async (dispatch) => {
  const cartItems = await fetchCartItemsApi(); // Fetch cart items from API
  dispatch(setCart(cartItems)); // Dispatch action to set cart in store
};

export const addItemToCartAction = (productId, quantity) => async (dispatch) => {
  await addItemToCartApi(productId, quantity); // Add item to cart
  dispatch(fetchCartItems()); // Refetch the cart after adding item
};

export const increaseCartItemQuantity = (id) => async (dispatch) => {
  await increaseCartItemQuantityApi(id); // Increase item quantity
  dispatch(fetchCartItems()); // Refetch the cart after updating
};

export const decreaseCartItemQuantity = (id) => async (dispatch) => {
  await decreaseCartItemQuantityApi(id); // Decrease item quantity
  dispatch(fetchCartItems()); // Refetch the cart after updating
};

export const deleteItemFromCart = (id) => async (dispatch) => {
  await deleteItemFromCartApi(id); // Delete item from cart
  dispatch(fetchCartItems()); // Refetch the cart after deleting
};

export const clearCart = () => (dispatch) => {
  dispatch(clearCartItemsApi()); // Dispatch action to clear cart
};
