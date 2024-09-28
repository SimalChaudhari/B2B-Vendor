
const initialState = {
  authUser: []
};
const userReducer = (state = initialState, { type, payload } = {}) => {

  switch (type) {
    case "AUTH_DATA":
      return {
        ...state,
        authUser: payload,
      };

    default:
      return state;
  }
};
export default userReducer;
