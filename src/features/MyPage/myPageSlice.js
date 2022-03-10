import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  meetingList: {},
  isLoading: true,
  isApiLoading: false,
  error: { isError: false, errorMessage: null },
};

export const myPageSlice = createSlice({
  name: "myPage",
  initialState,
  reducers: {
    meetingListLoaded: (state, action) => {
      state.meetingList = action.payload;
      state.isLoading = false;
      state.error = { isError: false, errorMessage: null };
    },
    meetingDeleted: (state, action) => {
      state.meetingList.plannedMeeting =
        state.meetingList.plannedMeeting.filter(
          (meeting) => meeting._id !== action.payload
        );
    },
    reservationCanceled: (state, action) => {
      state.meetingList.reservedMeeting =
        state.meetingList.reservedMeeting.filter(
          (meeting) => meeting._id !== action.payload
        );
    },
    myPageErrorHappened: (state, action) => {
      state.error.isError = true;
      state.error.errorMessage = action.payload;
    },
    userCheckedMyPageError: (state) => {
      state.error.isError = false;
      state.error.errorMessage = null;
    },
    resetMyPageSlice: (state) => {
      state.meetingList = {};
      state.isLoading = true;
      state.isApiLoading = false;
      state.error = { isError: false, errorMessage: null };
    },
    calledApi: (state) => {
      state.isApiLoading = true;
    },
    apiLoaded: (state) => {
      state.isApiLoading = false;
    },
  },
});

export const {
  meetingListLoaded,
  meetingDeleted,
  reservationCanceled,
  myPageErrorHappened,
  userCheckedMyPageError,
  resetMyPageSlice,
  calledApi,
  apiLoaded,
} = myPageSlice.actions;

export default myPageSlice.reducer;
