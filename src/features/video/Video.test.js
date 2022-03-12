import { BrowserRouter, Route, Routes } from "react-router-dom";

import testInitialReduxState from "../../common/util/testInitialReduxState";
import {
  render,
  screen,
  runSagaMiddleware,
  fireEvent,
} from "../../common/util/testUtils";
import { createAttachSocketEventListenerAction } from "../liveMeeting/liveMeetingSagas";
import Video from "./Video";
import { createGetUserMediaAction } from "./videoSagas";

jest.mock("./videoSagas", () => ({
  __esModule: true,
  ...jest.requireActual("./videoSagas"),
  createRtcSignalReceivedAction: jest.fn(),
  createGetUserMediaAction: jest.fn(),
}));

jest.mock("../liveMeeting/liveMeetingSagas", () => ({
  __esModule: true,
  ...jest.requireActual("../liveMeeting/liveMeetingSagas"),
  createAttachSocketEventListenerAction: jest.fn(),
}));

const mainScreenContent = "mainScreenContent";

const createWrappedVideoComponent = (isOwner) => (
  <BrowserRouter>
    <Routes>
      <Route
        path="meeting/live/:meetingId"
        element={<Video isOwner={isOwner} />}
      />
      <Route path="/main" element={<div>{mainScreenContent}</div>} />
    </Routes>
  </BrowserRouter>
);

describe("Video", () => {
  let initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/meeting/live/:testId");
  });

  afterEach(() => {
    initialState = JSON.parse(JSON.stringify(testInitialReduxState));
  });

  it("should attach 'requestVideo' socket event and get user media when meeting owner's socket is connected", () => {
    initialState.liveMeeting.isLoading = false;
    initialState.video.isVideoLoaded = true;
    createGetUserMediaAction.mockReturnValue({ type: "test" });
    createAttachSocketEventListenerAction.mockReturnValue({ type: "test" });
    render(createWrappedVideoComponent(true), { preloadedState: initialState });

    expect(createGetUserMediaAction.mock.calls.length).toBe(1);
    expect(createAttachSocketEventListenerAction.mock.calls.length).toBe(1);
  });

  it("should not attach 'requestVideo' socket event but get user media when meeting participant's socket is connected", () => {
    initialState.liveMeeting.isLoading = false;
    initialState.video.isVideoLoaded = true;
    createGetUserMediaAction.mockReturnValue({ type: "test" });
    createAttachSocketEventListenerAction.mockReturnValue({ type: "test" });
    render(createWrappedVideoComponent(false), {
      preloadedState: initialState,
    });

    expect(createGetUserMediaAction.mock.calls.length).toBe(1);
    expect(createAttachSocketEventListenerAction.mock.calls.length).toBe(0);
  });

  it("should show permission error when user denies the cam and mic permission", () => {
    initialState.liveMeeting.isLoading = false;
    initialState.video.error = {
      isError: true,
      errorMessage: "Permission error",
    };
    createGetUserMediaAction.mockReturnValue({ type: "test" });
    createAttachSocketEventListenerAction.mockReturnValue({ type: "test" });
    render(createWrappedVideoComponent(true), {
      preloadedState: initialState,
    });

    expect(
      screen.getByText("카메라와 마이크에 접근할 수 없습니다. ⛔️")
    ).toBeInTheDocument();

    const toMainButtonEl = screen.getByText("메인으로");

    fireEvent.click(toMainButtonEl);

    expect(screen.getByText(mainScreenContent)).toBeInTheDocument();
  });

  it("should show unknown error when error happens", () => {
    initialState.liveMeeting.isLoading = false;
    initialState.video.error = {
      isError: true,
      errorMessage: "Unknown error",
    };
    createGetUserMediaAction.mockReturnValue({ type: "test" });
    createAttachSocketEventListenerAction.mockReturnValue({ type: "test" });
    render(createWrappedVideoComponent(true), {
      preloadedState: initialState,
    });

    expect(screen.getByText("알수없는 에러발생 🤪")).toBeInTheDocument();

    const toMainButtonEl = screen.getByText("메인으로");

    fireEvent.click(toMainButtonEl);

    expect(screen.getByText(mainScreenContent)).toBeInTheDocument();
  });
});
