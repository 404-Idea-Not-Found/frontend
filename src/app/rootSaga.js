import { all } from "redux-saga/effects";

import {
  watchloggedInWithGoogle,
  watchVerified404Token,
} from "../features/login/loginSagas";

export default function* rootSaga() {
  yield all([watchloggedInWithGoogle(), watchVerified404Token()]);
}
