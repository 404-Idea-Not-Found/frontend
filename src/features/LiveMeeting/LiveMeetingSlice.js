import { createSlice } from "@reduxjs/toolkit";

export const liveMeetingSlice = createSlice({
  name: "liveMeeting",
  initialState: {
    chatList: [],
    isWhiteBoardAllowed: false,
    isVoiceAllowed: false,
    painterList: [],
    speakerList: [],
    recruitmentList: [],
    error: { isError: false, errorMessage: null },
  },
  reducers: {
    meetingConnected: (state, action) => {
      state.chatList = action.payload.chatList;
      state.isWhiteBoardAllowed = action.payload.isWhiteBoardAllowed;
      state.isVoiceAllowed = action.payload.isVoiceAllowed;
      state.error = { isError: false, errorMessage: null };
    },
    meetingDisconnected: (state) => {
      state.chatList = [];
      state.isWhiteBoardAllowed = false;
      state.isVoiceAllowed = false;
      state.painterList = [];
      state.speakerList = [];
      state.recruitmentList = [];
      state.error = { isError: false, errorMessage: null };
    },
    meetingErrorHapeened: (state, action) => {
      state.chatList = [];
      state.isWhiteBoardAllowed = false;
      state.isVoiceAllowed = false;
      state.painterList = [];
      state.speakerList = [];
      state.recruitmentList = [];
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    meetingErrorChecked: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
    painterAdded: (state, action) => {
      state.painterList = [...new Set(state.painterList.push(action.payload))];
    },
    painterRemoved: (state, action) => {
      state.painterList = state.painterList.filter(
        (painter) => painter !== action.payload
      );
    },
    speakerAdded: (state, action) => {
      state.speakerList = [...new Set(state.speakerList.push(action.payload))];
    },
    speakerRemoved: (state, action) => {
      state.speakerList = state.speakerList.filter(
        (speaker) => speaker !== action.payload
      );
    },
    recruitAdded: (state, action) => {
      state.recruitList = [...new Set(state.recruitList.push(action.payload))];
    },
    recruitRemoved: (state, action) => {
      state.recruitList = state.recruitList.filter(
        (recruit) => recruit !== action.payload
      );
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
