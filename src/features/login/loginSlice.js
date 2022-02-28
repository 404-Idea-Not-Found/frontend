import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
    username: null,
    email: null,
    profilePicture: null,
    error: { isError: false, errorMessage: null },
  },
  reducers: {
    userLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.email = null;
      state.profilePicture = null;
    },
    userLoginFailed: (state, action) => {
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    userCheckedLoginError: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
  },
});

export const {
  userLoggedIn,
  userLoggedOut,
  userLoginFailed,
  userCheckedLoginError,
} = loginSlice.actions;

export default loginSlice.reducer;
