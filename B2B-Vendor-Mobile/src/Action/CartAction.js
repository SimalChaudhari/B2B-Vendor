// /redux/cartActions.js
import { setCart, clearCart } from './CartReducer';
import {
  addCart,
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem,
} from '../BackendApis/cartApi';

// Action to fetch and set the cart items
export const fetchCartItems = () => async (dispatch) => {
  try {
    const cartItems = await fetchCart(); // Call API to fetch cart
    dispatch(setCart(cartItems)); // Dispatch action to set cart in store
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  }
};

// Action to add an item to the cart
export const addItemToCartAction = (productId, quantity) => async (dispatch) => {
  try {
    await addCart(productId, quantity); // Call API to add item
    dispatch(fetchCartItems()); // Refetch the cart after adding item
  } catch (error) {
    console.error('Failed to add item to cart:', error);
  }
};

// Action to increase item quantity
export const increaseCartItemQuantity = (id) => async (dispatch) => {
  try {
    await increaseQuantity(id); // Call API to increase quantity
    dispatch(fetchCartItems()); // Refetch the cart after updating
  } catch (error) {
    console.error('Failed to increase item quantity:', error);
  }
};

// Action to decrease item quantity
export const decreaseCartItemQuantity = (id) => async (dispatch) => {
  try {
    await decreaseQuantity(id); // Call API to decrease quantity
    dispatch(fetchCartItems()); // Refetch the cart after updating
  } catch (error) {
    console.error('Failed to decrease item quantity:', error);
  }
};

// Action to delete an item from the cart
export const deleteItemFromCart = (id) => async (dispatch) => {
  try {
    await deleteCartItem(id); // Call API to delete item
    dispatch(fetchCartItems()); // Refetch the cart after deleting
  } catch (error) {
    console.error('Failed to delete item from cart:', error);
  }
};

// Action to clear the cart
export const clearCartItems = () => (dispatch) => {
  dispatch(clearCart()); // Dispatch action to clear cart
};
