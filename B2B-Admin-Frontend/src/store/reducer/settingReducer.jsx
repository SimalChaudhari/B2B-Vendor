import { FAQ_LIST, FAQ_GET_BY_LIST, CONTACT_GET_BY_LIST, CONTACT_LIST } from "../constants/actionTypes";

const initialState = {
    faq: [],
    contact: [],
    getByFAQ: '',
    getByContact: ''

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

        case CONTACT_LIST:
            return {
                ...state,
                contact: payload,
            };
        case CONTACT_GET_BY_LIST:
            return {
                ...state,
                getByContact: payload,
            };
        default:
            return state;
    }
};

export default settingReducer;
