import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import {
  render,
  fireEvent,
  screen,
  runSagaMiddleware,
} from "../../common/util/testUtils";
import { initialState as liveMeetingInitialState } from "../liveMeeting/liveMeetingSlice";
import { initialState as myPageInitialState } from "../myPage/myPageSlice";
import { initialState as videoInitialState } from "../video/videoSlice";
import Login from "./Login";
import { initialState as loginInitialState } from "./loginSlice";

jest.mock("firebase/auth", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/auth"),
  getAuth: jest.fn(() => "done"),
  GoogleAuthProvider: jest.fn(() => "done"),
  signInWithPopup: jest.fn(),
}));

jest.mock("../../common/api/authenticateGoogleToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const wrappedLoginComponent = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<div>main screen</div>} />
    </Routes>
  </BrowserRouter>
);

describe("Login", () => {
  let initialState = {
    login: JSON.parse(JSON.stringify(loginInitialState)),
    myPage: JSON.parse(JSON.stringify(myPageInitialState)),
    video: JSON.parse(JSON.stringify(videoInitialState)),
    liveMeeting: JSON.parse(JSON.stringify(liveMeetingInitialState)),
  };

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    initialState = {
      login: JSON.parse(JSON.stringify(loginInitialState)),
      myPage: JSON.parse(JSON.stringify(myPageInitialState)),
      video: JSON.parse(JSON.stringify(videoInitialState)),
      liveMeeting: JSON.parse(JSON.stringify(liveMeetingInitialState)),
    };
  });

  it("should show two login button", () => {
    render(wrappedLoginComponent, { preloadedState: initialState });

    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByText("Look around without sign in")).toBeInTheDocument();
  });

  it("should show google login popup when click 'Sign in with Google'", () => {
    getAuth.mockImplementation(() => "done");
    GoogleAuthProvider.mockImplementation(() => "done");
    signInWithPopup.mockImplementation(() => ({
      user: {
        accessToken: "token",
      },
    }));
    authenticateGoogleToken.mockImplementation(() => ({
      data: { fourOFourToken: "token" },
    }));

    render(wrappedLoginComponent, { preloadedState: initialState });

    const signinWithGoogleButtonEl = screen.getByText("Sign in with Google");
    fireEvent.click(signinWithGoogleButtonEl);

    expect(getAuth.mock.calls.length).toBe(1);
    expect(signInWithPopup.mock.calls.length).toBe(1);
    expect(GoogleAuthProvider.mock.calls.length).toBe(1);
  });

  it("should show error popup when login fails", () => {
    initialState.login.error = { isError: true, errorMessage: null };

    render(wrappedLoginComponent, { preloadedState: initialState });

    expect(screen.getByText("로그인에 실패 했습니다")).toBeInTheDocument();
  });
});
