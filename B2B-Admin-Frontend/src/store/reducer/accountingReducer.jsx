import { RECEIVABLE_GET_BY_LIST, RECEIVABLE_LIST } from "../constants/actionTypes";

const initialState = {
    receivable: [],
    getByReceivable: ''

};
const AccountingReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case RECEIVABLE_LIST:
            return {
                ...state,
                receivable: payload,
            };
        case RECEIVABLE_GET_BY_LIST:
            return {
                ...state,
                getByReceivable: payload,
            };
        default:
            return state;
    }
};

export default AccountingReducer;
