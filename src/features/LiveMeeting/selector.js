export const selectPainterList = (state) => state.liveMeeting.painterList;
export const selectSpeakerList = (state) => state.liveMeeting.speakerList;
export const selectIsWhiteboardAllowed = (state) =>
  state.liveMeeting.isWhiteBoardAllowed;
export const selectChatList = (state) => state.liveMeeting.chatList;
export const selectError = (state) => state.liveMeeting.error;
export const selectIsLoading = (state) => state.liveMeeting.isLoading;
export const selectRecruitList = (state) => state.liveMeeting.recruitList;
export const selectIsRecruit = (state) => state.liveMeeting.isRecruit;
export const selectIsVoiceAllowed = (state) => state.liveMeeting.isVoiceAllowed;
export const selectOwnerDisconnectedDuringMeeting = (state) =>
  state.liveMeeting.ownerDisconnectedDuringMeeting;
