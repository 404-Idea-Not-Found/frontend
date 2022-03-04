import { all } from "redux-saga/effects";

import { sokcetFlow } from "../features/LiveMeeting/liveMeetingSagas";
import {
  watchLogInWithGoogle,
  watchVerify404Token,
} from "../features/login/loginSagas";

export default function* rootSaga() {
  yield all([watchLogInWithGoogle(), watchVerify404Token(), sokcetFlow()]);
}
