import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  topDelta: 0,
  leftDelta: 0,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    containerScrolled: (state, action) => {
      state.topDelta = action.payload.topDelta;
      state.leftDelta = action.payload.leftDelta;
    },
    deltaReset: (state) => {
      state.topDelta = 0;
      state.leftDelta = 0;
    },
  },
});

export const { containerScrolled, deltaReset } = mainSlice.actions;

export default mainSlice.reducer;
