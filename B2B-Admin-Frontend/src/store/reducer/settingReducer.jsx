import {  FAQ_LIST,FAQ_GET_BY_LIST } from "../constants/actionTypes";

const initialState = {
    faq: [],
    getByFAQ: ''

};
const settingReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case FAQ_LIST:
            return {
                ...state,
                faq: payload,
            };
        case FAQ_GET_BY_LIST:
            return {
                ...state,
                getByFAQ: payload,
            };
        default:
            return state;
    }
};

export default settingReducer;
