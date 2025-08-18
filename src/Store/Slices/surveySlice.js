import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  surveys: null,

};

const surveySlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
 
    setSurveysInRD(state, action) {
      state.user = action.payload;
    },
  
  },
});

export const {
    setSurveysInRD,

} = surveySlice.actions;

export default surveySlice.reducer;
