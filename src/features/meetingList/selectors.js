export const selectMetingListLastId = (state) => state.meetingList.lastId;
export const selectMeetingListIsLoading = (state) =>
  state.meetingList.isLoading;
export const selectMeetingListError = (state) => state.meetingList.error;
export const selectMeetingList = (state) => state.meetingList.meetingList;
