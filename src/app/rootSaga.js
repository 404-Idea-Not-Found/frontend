import { all } from "redux-saga/effects";

import {
  sokcetFlow,
  watchGetMeeting,
} from "../features/LiveMeeting/liveMeetingSagas";
import {
  watchLogInWithGoogle,
  watchVerify404Token,
} from "../features/login/loginSagas";
import {
  watchGetMyPageMeeting,
  watchCancelMeeting,
  watchCancelReservation,
} from "../features/myPage/myPageSagas";
import { webRtcFlow } from "../features/video/videoSagas";

export default function* rootSaga() {
  yield all([
    watchLogInWithGoogle(),
    watchVerify404Token(),
    sokcetFlow(),
    webRtcFlow(),
    watchGetMeeting(),
    watchGetMyPageMeeting(),
    watchCancelMeeting(),
    watchCancelReservation(),
  ]);
}
