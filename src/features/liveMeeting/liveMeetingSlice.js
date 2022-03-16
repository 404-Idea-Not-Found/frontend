import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  chatList: [],
  isLoading: true,
  meeting: {},
  isFetchingMeeting: true,
  isWhiteBoardAllowed: false,
  isRecruit: false,
  painterList: {},
  recruitList: {},
  ownerDisconnectedDuringMeeting: false,
  error: { isError: false, errorMessage: null },
};

export const liveMeetingSlice = createSlice({
  name: "liveMeeting",
  initialState,
  reducers: {
    meetingConnected: (state, action) => {
      state.chatList = action.payload.chatList;
      state.isLoading = false;
      state.error = { isError: false, errorMessage: null };
      if (action.payload.isOwner) {
        state.isWhiteBoardAllowed = true;
      }
    },
    meetingReset: (state) => {
      state.chatList = [];
      state.isLoading = true;
      state.meeting = {};
      state.isFetchingMeeting = false;
      state.isWhiteBoardAllowed = false;
      state.isRecruit = false;
      state.painterList = {};
      state.recruitList = {};
      state.ownerDisconnectedDuringMeeting = false;
      state.error = { isError: false, errorMessage: null };
    },
    meetingErrorHapeened: (state, action) => {
      state.chatList = [];
      state.isLoading = true;
      state.meeting = {};
      state.isFetchingMeeting = false;
      state.isWhiteBoardAllowed = false;
      state.painterList = {};
      state.recruitList = {};
      state.ownerDisconnectedDuringMeeting = false;
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    meetingErrorChecked: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
    meetingFetched: (state, action) => {
      state.isFetchingMeeting = false;
      state.meeting = action.payload.meeting;
    },
    fetchMeetingRequestSent: (state) => {
      state.isFetchingMeeting = true;
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
    chatSubmitted: (state, action) => {
      state.chatList.push(action.payload);
    },
    recruitAdded: (state, action) => {
      state.recruitList[action.payload.requestorSocketId] = {
        username: action.payload.username,
        userId: action.payload.userId,
        allowed: true,
      };
    },
    recruitRemoved: (state, action) => {
      delete state.recruitList[action.payload];
    },
    recruitRequestSuccessfullySent: (state) => {
      state.isRecruit = true;
    },
    kickedFromRecruitList: (state) => {
      state.isRecruit = false;
    },
    ownerDisconnectedDuringMeeting: (state) => {
      state.ownerDisconnectedDuringMeeting = true;
    },
  },
});

export const {
  meetingConnected,
  meetingReset,
  meetingErrorHapeened,
  meetingErrorChecked,
  meetingFetched,
  fetchMeetingRequestSent,
  painterAdded,
  painterRemoved,
  painterAllowed,
  whiteboardAllowed,
  whiteboardDisallowed,
  chatSubmitted,
  recruitAdded,
  recruitRemoved,
  recruitRequestSuccessfullySent,
  kickedFromRecruitList,
  ownerDisconnectedDuringMeeting,
  closedVideo,
} = liveMeetingSlice.actions;

export default liveMeetingSlice.reducer;
