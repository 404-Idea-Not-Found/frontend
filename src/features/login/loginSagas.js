import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { put, takeEvery, call } from "redux-saga/effects";

import authenticate404Token from "../../common/api/authenticate404Token";
import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import { TIME } from "../../common/util/constants";
import getCookie from "../../common/util/getCookie";
import { userLoggedIn, userLoginFailed } from "./loginSlice";

export const loginSagaActionCreators = {
  loggedInWithGoogle: () => ({
    type: "LOGGED_IN_WITH_GOOGLE",
  }),
  verified404Token: () => ({
    type: "VERIFIED_404_TOKEN",
  }),
};

export function* logInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const { user } = yield call(signInWithPopup, auth, provider);
    const res = yield authenticateGoogleToken(user.accessToken);

    document.cookie = `fourOFourToken=${res.data.fourOFourToken}; max-age=${TIME.DAY_TO_SECONDS}`;

    yield put(userLoggedIn(res.data));
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data.errorMessage;
    }

    yield put(userLoginFailed(errorMessage));
  }
}

export function* verify404Token() {
  try {
    const cookie = getCookie("fourOFourToken");
    if (!cookie) return;
    const res = yield authenticate404Token();

    yield put(userLoggedIn(res.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "Failed to verify local 404 token from server, need re-login!"
    );
  }
}

export function* watchloggedInWithGoogle() {
  yield takeEvery("LOGGED_IN_WITH_GOOGLE", logInWithGoogle);
}

export function* watchVerified404Token() {
  yield takeEvery("VERIFIED_404_TOKEN", verify404Token);
}
