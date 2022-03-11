import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  query: "",
  lastId: null,
  isLoading: true,
  meetingList: [],
  hasMore: false,
  error: { isError: false, errorMessage: null },
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    firstMeetingListRequestSent: (state) => {
      state.meetingList = [];
      state.error = {
        isError: false,
        errorMessage: null,
      };
      state.isLoading = true;
    },
    subsequentMeetingListRequestSent: (state) => {
      state.isLoading = true;
    },
    meetingListLoaded: (state, action) => {
      state.meetingList = action.payload.meetingList;
      state.hasMore = !!action.payload.meetingList.length;
      state.query = action.payload.query;
      if (action.payload.meetingList.length) {
        state.lastId =
          action.payload.meetingList[action.payload.meetingList.length - 1]._id;
      }
      state.isLoading = false;
    },
    meetingListRequestFailed: (state, action) => {
      state.error = {
        isError: true,
        errorMessage: action.payload.errorMessage,
      };
    },
    moreMeetingListLoadedWithSameQuery: (state, action) => {
      if (action.payload.meetingList.length) {
        state.lastId =
          action.payload.meetingList[action.payload.meetingList.length - 1]._id;
        state.meetingList = [
          ...state.meetingList,
          ...action.payload.meetingList,
        ];
      }
      state.hasMore = !!action.payload.meetingList.length;
      state.isLoading = false;
    },
    getMeetingListApiEnd: (state) => {
      state.isLoading = false;
    },
    sidebarReset: (state) => {
      state.query = "";
      state.lastId = null;
      state.isLoading = true;
      state.meetingList = [];
      state.hasMore = false;
      state.error = { isError: false, errorMessage: null };
    },
  },
});

export const {
  firstMeetingListRequestSent,
  subsequentMeetingListRequestSent,
  meetingListLoaded,
  getMeetingListApiEnd,
  moreMeetingListLoadedWithSameQuery,
  meetingListRequestFailed,
  lastIdChanged,
  sidebarReset,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
