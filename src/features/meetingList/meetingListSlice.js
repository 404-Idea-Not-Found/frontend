import { createSlice } from "@reduxjs/toolkit";

export const meetingListSlice = createSlice({
  name: "meetingList",
  initialState: {
    meetingList: [],
    lastId: undefined,
    isLoading: true,
    error: { isError: false, errorMessage: null },
  },
  reducers: {
    meetingListLoaded: (state, action) => {
      state.meetingList = [...state.meetingList, ...action.payload];
      state.isLoading = false;

      if (action.payload.length) {
        state.lastId = action.payload[action.payload.length - 1]._id;
      }

      if (!action.payload.length) {
        state.lastId = null;
      }
    },
    meetingListRequestSent: (state) => {
      state.isLoading = true;
    },
    failedFetchingMeetingList: (state, action) => {
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    userCheckedError: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
  },
});

export const {
  meetingListLoaded,
  meetingListRequestSent,
  failedFetchingMeetingList,
  userCheckedError,
} = meetingListSlice.actions;

export default meetingListSlice.reducer;
