import { PRODUCT_LIST } from "../constants/actionTypes";

const initialState = {
    product: [],

};
const productReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case PRODUCT_LIST:
            return {
                ...state,
                product: payload,
            };
        default:
            return state;
    }
};

export default productReducer;
