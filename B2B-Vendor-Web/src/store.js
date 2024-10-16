import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "./redux/ProductReducer";
// import authReducer from "./redux/authReducer";

export default configureStore({
    reducer:{
        product:ProductReducer,
        // auth: authReducer
    }
})