import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import authenticateGoogleToken from "../../common/api/authenticateGoogleToken";
import testInitialReduxState from "../../common/util/testInitialReduxState";
import {
  render,
  fireEvent,
  screen,
  runSagaMiddleware,
} from "../../common/util/testUtils";
import Login from "./Login";

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

const wrappedLoginComponent = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<div>main screen</div>} />
    </Routes>
  </BrowserRouter>
);

describe("Login", () => {
  let initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    initialState = JSON.parse(JSON.stringify(testInitialReduxState));
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
