import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserAddresses: (state, action) => {
      if (state.user) {
        state.user.addresses = action.payload;
      }
    },
  },
});

export const { setUser, logout, updateUser, updateUserAddresses } = AuthSlice.actions;
export default AuthSlice.reducer;
