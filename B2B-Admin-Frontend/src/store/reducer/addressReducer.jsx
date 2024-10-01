import { ADDRESS_LIST } from "../constants/actionTypes";

const initialState = {
    address: []
};
const addressReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case ADDRESS_LIST:
            return {
                ...state,
                address: payload,
            };
        default:
            return state;
    }
};
export default addressReducer;
