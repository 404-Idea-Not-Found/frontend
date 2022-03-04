import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { put, takeEvery, call } from "redux-saga/effects";

import authenticate404Token from "../../common/api/authenticate404Token";
import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import getErrorMessage from "../../common/util/getErrorMessage";
import { userLoggedIn, userLoginFailed } from "./loginSlice";

export const loginSagaActionCreators = {
  logInWithGoogle: () => ({
    type: "LOG_IN_WITH_GOOGLE",
  }),
  verify404Token: () => ({
    type: "VERIFY_404_TOKEN",
  }),
};

export function* logInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const { user } = yield call(signInWithPopup, auth, provider);
    const res = yield authenticateGoogleToken(user.accessToken);

    localStorage.setItem("fourOFourToken", res.data.fourOFourToken);

    yield put(userLoggedIn(res.data));
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    yield put(userLoginFailed(errorMessage));
  }
}

export function* verify404Token() {
  try {
    const fourOFourToken = localStorage.getItem("fourOFourToken");

    if (!fourOFourToken) return;

    const res = yield authenticate404Token(fourOFourToken);

    yield put(userLoggedIn(res.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "Failed to verify local 404 token from server, need re-login!"
    );
  }
}

export function* watchLogInWithGoogle() {
  yield takeEvery("LOG_IN_WITH_GOOGLE", logInWithGoogle);
}

export function* watchVerify404Token() {
  yield takeEvery("VERIFY_404_TOKEN", verify404Token);
}
