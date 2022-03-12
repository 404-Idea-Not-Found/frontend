import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { put, takeEvery, call } from "redux-saga/effects";

import authenticate404Token from "../../common/api/authenticate404Token";
import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import getErrorMessage from "../../common/util/getErrorMessage";
import getLocalFourOFourToken from "../../common/util/getLocalFourOFourToken";
import { userLoggedIn, userLoginFailed } from "./loginSlice";

const loginSagaActionCreators = {
  createLogInWithGoogleAction: () => ({
    type: "LOG_IN_WITH_GOOGLE",
  }),
  createVerify404TokenAction: () => ({
    type: "VERIFY_404_TOKEN",
  }),
};

function* logInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const { user } = yield call(signInWithPopup, auth, provider);

    const { data } = yield call(authenticateGoogleToken, user.accessToken);

    localStorage.setItem("fourOFourToken", data.fourOFourToken);

    yield put(userLoggedIn(data));
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    yield put(userLoginFailed(errorMessage));
  }
}

function* verify404Token() {
  try {
    const fourOFourToken = getLocalFourOFourToken();

    if (!fourOFourToken) return;

    const { data } = yield call(authenticate404Token, fourOFourToken);
    yield put(userLoggedIn(data));
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

export const { createLogInWithGoogleAction, createVerify404TokenAction } =
  loginSagaActionCreators;
