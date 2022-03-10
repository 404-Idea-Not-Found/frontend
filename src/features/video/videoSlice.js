import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isCallIncomming: false,
  callerSignal: null,
  caller: null,
  isVideoLoaded: false,
  error: { isError: false, errorMessage: null },
};

export const videoSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    callReceived: (state) => {
      state.isCallIncomming = true;
    },
    callChecked: (state) => {
      state.isCallIncomming = false;
    },
    videoLoaded: (state) => {
      state.isVideoLoaded = true;
    },
    lastIdChanged: (state, action) => {
      state.lastId = action.payload.lastId;
    },
    sidebarReset: (state) => {
      state.query = "";
      state.lastId = null;
    },
    videoErrorHappened: (state, action) => {
      state.error = {
        isError: true,
        errorMessage: action.payload,
      };
    },
    videoErrorChecked: (state) => {
      state.error = {
        isError: false,
        errorMessage: null,
      };
    },
    videoReset: (state) => {
      state.isCallIncomming = false;
      state.callerSignal = false;
      state.caller = null;
      state.isVideoLoaded = false;
      state.error = { isError: false, errorMessage: null };
    },
  },
});

export const {
  callReceived,
  callChecked,
  videoLoaded,
  lastIdChanged,
  sidebarReset,
  videoErrorHappened,
  videoErrorChecked,
  videoReset,
} = videoSlice.actions;

export default videoSlice.reducer;
