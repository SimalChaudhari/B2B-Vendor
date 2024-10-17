import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import authReducer from "./redux/authReducer";
import groupReducer from "./redux/groupReducer";

export default configureStore({
    reducer:{
        cart:CartReducer,
        auth: authReducer,
        group: groupReducer,
    }
})