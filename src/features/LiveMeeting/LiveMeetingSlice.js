import { createSlice } from "@reduxjs/toolkit";

export const liveMeetingSlice = createSlice({
  name: "liveMeeting",
  initialState: {
    chatList: [],
    isOwner: false,
    isWhiteBoardAllowed: false,
    isVoiceAllowed: false,
    error: { isError: false, errorMessage: null },
  },
  reducers: {
    meetingConnected: (state, action) => {
      state.chatList = action.payload.chatList;
      state.isOwner = action.payload.isOwner;
      state.isWhiteBoardAllowed = action.payload.isWhiteBoardAllowed;
      state.isVoiceAllowed = action.payload.isVoiceAllowed;
      state.error = { isError: false, errorMessage: null };
    },
    meetingDisconnected: (state) => {
      state.chatList = [];
      state.isOwner = false;
      state.isWhiteBoardAllowed = false;
      state.isVoiceAllowed = false;
      state.error = { isError: false, errorMessage: null };
    },
    meetingErrorHapeened: (state, action) => {
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    meetingErrorChecked: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
  },
});

export const {
  meetingConnected,
  meetingDisconnected,
  meetingErrorHapeened,
  meetingErrorChecked,
} = liveMeetingSlice.actions;

export default liveMeetingSlice.reducer;
