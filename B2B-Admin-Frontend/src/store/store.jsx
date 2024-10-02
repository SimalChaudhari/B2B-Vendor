import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Correctly import `thunk`
import { composeWithDevTools } from 'redux-devtools-extension'; // Import Redux DevTools
import userReducer from './reducer/userReducer';
import authReducer from './reducer/authReducer';
import addressReducer from './reducer/addressReducer';
import categoryReducer from './reducer/categoryReducer';
import subcategoryReducer from './reducer/subcategoryReducer';
import productReducer from './reducer/productReducer';

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  address: addressReducer,
  category: categoryReducer,
  subcategory: subcategoryReducer,
  product: productReducer

});

// Create the Redux store with the combined reducer, middleware, and Redux DevTools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Integrate DevTools with thunk middleware
);

export default store;
