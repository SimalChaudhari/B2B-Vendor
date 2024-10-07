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
      state.isAuthenticated = true; // Set authentication status to true
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Set authentication status to false
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Update user information
      }
    },
  },
});

// Export actions for use in components
export const { setUser, logout, updateUser } = AuthSlice.actions;

// Export the reducer to be used in the store
export default AuthSlice.reducer;
