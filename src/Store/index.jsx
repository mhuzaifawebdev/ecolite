import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Store/Slices/userSlice';
import surveyReducer from '../Store/Slices/surveySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    surveys: surveyReducer,
  },
});

export default store;
