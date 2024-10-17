
const initialState = {


};
const settingReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
    
        case "":
            return {
                ...state,
            //    payload,
            };
        default:
            return state;
    }
};

export default settingReducer;
