import { all } from "redux-saga/effects";

import {
  watchlogInWithGoogle,
  watchVerify404Token,
} from "../features/login/loginSagas";
import { watchGetMeetingList } from "../features/meetingList/meetingListSagas";

export default function* rootSaga() {
  yield all([
    watchlogInWithGoogle(),
    watchVerify404Token(),
    watchGetMeetingList(),
  ]);
}
