export const signupUser = (userData) => {
    return { type: 'SIGNUP_USER', payload: userData };
};




// src/actions/userActions.js

import { baseUrl } from "./Config/Urls";

export const FETCH_USER_DATA = 'FETCH_USER_DATA';

export const fetchUserData = () => async (dispatch) => {
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    const data = await response.json();
    dispatch({
      type: FETCH_USER_DATA,
      payload: data,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
