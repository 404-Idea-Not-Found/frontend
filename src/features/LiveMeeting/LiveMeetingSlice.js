import { createSlice } from "@reduxjs/toolkit";

export const liveMeetingSlice = createSlice({
  name: "liveMeeting",
  initialState: {
    chatList: [],
    isLoading: true,
    isWhiteBoardAllowed: false,
    isVoiceAllowed: false,
    painterList: {},
    speakerList: [],
    recruitmentList: [],
    error: { isError: false, errorMessage: null },
  },
  reducers: {
    meetingConnected: (state, action) => {
      state.chatList = action.payload.meetingData.chatList;
      state.isLoading = false;
      state.error = { isError: false, errorMessage: null };
      if (action.payload.isOwner) {
        state.isWhiteBoardAllowed = true;
      }
    },
    meetingDisconnected: (state) => {
      state.chatList = [];
      state.isLoading = true;
      state.isWhiteBoardAllowed = false;
      state.isVoiceAllowed = false;
      state.painterList = {};
      state.speakerList = [];
      state.recruitmentList = [];
      state.error = { isError: false, errorMessage: null };
    },
    meetingErrorHapeened: (state, action) => {
      state.chatList = [];
      state.isLoading = true;
      state.isWhiteBoardAllowed = false;
      state.isVoiceAllowed = false;
      state.painterList = {};
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
      state.painterList[action.payload.requestorSocketId] = {
        username: action.payload.username,
        allowed: false,
      };
    },
    painterAllowed: (state, action) => {
      state.painterList[action.payload].allowed = true;
    },
    painterRemoved: (state, action) => {
      delete state.painterList[action.payload];
    },
    whiteboardAllowed: (state) => {
      state.isWhiteBoardAllowed = true;
    },
    whiteboardDisallowed: (state) => {
      state.isWhiteBoardAllowed = false;
    },
    speakerAdded: (state, action) => {
      state.speakerList = [...new Set(state.speakerList.push(action.payload))];
    },
    speakerRemoved: (state, action) => {
      state.speakerList = state.speakerList.filter(
        (speaker) => speaker !== action.payload
      );
    },
    chatSubmitted: (state, action) => {
      state.chatList.push(action.payload);
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
  painterAdded,
  painterRemoved,
  painterAllowed,
  whiteboardAllowed,
  whiteboardDisallowed,
  chatSubmitted,
} = liveMeetingSlice.actions;

export default liveMeetingSlice.reducer;
