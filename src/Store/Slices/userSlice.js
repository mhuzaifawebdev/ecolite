
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInRD: (state, action) => {
      state.user = action.payload;
    },
    clearUserInRD: (state) => {
      state.user = null;
    },
  },
});

export const { setUserInRD, clearUserInRD } = userSlice.actions;
export default userSlice.reducer;



