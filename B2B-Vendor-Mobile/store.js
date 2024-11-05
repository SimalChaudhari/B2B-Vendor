import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import authReducer from "./redux/authReducer";
import groupReducer from "./redux/groupReducer";
import productAndAddressReducer from "./redux/productAndAddressReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        auth: authReducer,
        group: groupReducer,
        productAndAddress: productAndAddressReducer,
    }
})