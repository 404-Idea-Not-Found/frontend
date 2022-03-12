import { signInWithPopup } from "firebase/auth";
import { expectSaga } from "redux-saga-test-plan";

import authenticate404Token from "../../common/api/authenticate404Token";
import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import getLocalFourOFourToken from "../../common/util/getLocalFourOFourToken";
import {
  createLogInWithGoogleAction,
  createVerify404TokenAction,
  watchLogInWithGoogle,
  watchVerify404Token,
} from "./loginSagas";
import { userLoggedIn, userLoginFailed } from "./loginSlice";

jest.mock("firebase/auth", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/auth"),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("../../common/api/authenticateGoogleToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../common/api/authenticate404Token", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../common/util/getLocalFourOFourToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("loginSagas", () => {
  it("should log in user with successful login attempt", () => {
    const testValue = "helloSagaTest";
    signInWithPopup.mockImplementation(() => ({ user: "done" }));
    authenticateGoogleToken.mockImplementation(() => ({
      data: { test: testValue },
    }));

    return expectSaga(watchLogInWithGoogle)
      .put(userLoggedIn({ test: testValue }))
      .dispatch(createLogInWithGoogleAction())
      .silentRun();
  });

  it("should not log in user with unsuccessful login attempt", () => {
    const testError = "helloError";
    signInWithPopup.mockRejectedValue(new Error(testError));

    return expectSaga(watchLogInWithGoogle)
      .put(userLoginFailed(testError))
      .dispatch(createLogInWithGoogleAction())
      .silentRun();
  });

  it("should verify404Token with valid token", () => {
    const testData = "testData";
    getLocalFourOFourToken.mockReturnValue("mockToken");
    authenticate404Token.mockResolvedValue({ data: testData });

    return expectSaga(watchVerify404Token)
      .put(userLoggedIn(testData))
      .dispatch(createVerify404TokenAction())
      .silentRun();
  });

  it("should verify404Token with invalid token", () => {
    const testError = "helloError";
    getLocalFourOFourToken.mockReturnValue("mockToken");
    authenticate404Token.mockRejectedValue(new Error(testError));

    return expectSaga(watchVerify404Token)
      .not.put(userLoggedIn(testError))
      .dispatch(createVerify404TokenAction())
      .silentRun();
  });
});
