// src/redux/groupSlice.js
import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    selectedGroup: '', // Store selected group here
  },
  reducers: {
    setSelectedGroupR: (state, action) => {
      state.selectedGroup = action.payload;
    },
    resetSelectedGroup: (state) => {
      state.selectedGroup = ''; // Reset to initial state
    },
  },
});

export const { setSelectedGroupR, resetSelectedGroup } = groupSlice.actions;
export default groupSlice.reducer;
