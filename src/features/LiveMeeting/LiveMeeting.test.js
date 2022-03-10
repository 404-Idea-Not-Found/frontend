import { BrowserRouter, Route, Routes } from "react-router-dom";

import { render, fireEvent, screen } from "../../common/util/testUtils";
import { initialState as loginInitialState } from "../login/loginSlice";
import { initialState as myPageInitialState } from "../myPage/myPageSlice";
import { initialState as videoInitialState } from "../video/videoSlice";
import LiveMeeting from "./LiveMeeting";
import { initialState as liveMeetingInitialState } from "./liveMeetingSlice";

jest.mock("./liveMeetingSagas", () => ({
  __esModule: true,
  ...jest.requireActual("./liveMeetingSagas"),
  createGetMeetingAction: () => ({ type: "none" }),
  createConnectSocketAction: () => ({ type: "none" }),
}));

const wrappedLiveMeetingComponent = (
  <BrowserRouter>
    <Routes>
      <Route path="meeting/live/:meetingId" element={<LiveMeeting />} />
      <Route path="/main" element={<div>main screen</div>} />
    </Routes>
  </BrowserRouter>
);

describe("LiveMeeting", () => {
  let initialState = {
    login: JSON.parse(JSON.stringify(loginInitialState)),
    myPage: JSON.parse(JSON.stringify(myPageInitialState)),
    video: JSON.parse(JSON.stringify(videoInitialState)),
    liveMeeting: JSON.parse(JSON.stringify(liveMeetingInitialState)),
  };

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/meeting/live/testMeetingId");
  });

  afterEach(() => {
    initialState = {
      login: JSON.parse(JSON.stringify(loginInitialState)),
      myPage: JSON.parse(JSON.stringify(myPageInitialState)),
      video: JSON.parse(JSON.stringify(videoInitialState)),
      liveMeeting: JSON.parse(JSON.stringify(liveMeetingInitialState)),
    };
  });

  it("should show ownerdisconnection screen when owner disconnect", () => {
    initialState.login.userId = "notOwner";
    initialState.liveMeeting.ownerDisconnectedDuringMeeting = true;
    initialState.liveMeeting.meeting.owner = "owner";

    render(wrappedLiveMeetingComponent, { preloadedState: initialState });
    expect(screen.getByText("주최자의 연결이 끊겼습니다!")).toBeInTheDocument();
  });

  it("should announce owner to start meeting if meeting is not live", () => {
    initialState.login.userId = "owner";
    initialState.liveMeeting.isFetchingMeeting = false;
    initialState.liveMeeting.meeting = {
      owner: "owner",
      isLive: false,
      isEnd: false,
    };

    render(wrappedLiveMeetingComponent, { preloadedState: initialState });
    expect(screen.getByText("미팅을 시작해 주세요!")).toBeInTheDocument();
  });

  it("owner can start meeting", () => {
    initialState.login.userId = "owner";
    initialState.liveMeeting.isFetchingMeeting = false;
    initialState.liveMeeting.meeting = {
      owner: "owner",
      isLive: false,
      isEnd: false,
    };

    render(wrappedLiveMeetingComponent, { preloadedState: initialState });
    const meetingStartButtonEl = screen.getByText("미팅시작");

    fireEvent.click(meetingStartButtonEl);

    expect(screen.getByText("지우기")).toBeInTheDocument();
    expect(screen.getByTestId("video")).toBeInTheDocument();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("should show 'please wait' screen for participant when meeting is not live", () => {
    initialState.login.userId = "notOwner";
    initialState.liveMeeting.isFetchingMeeting = false;
    initialState.liveMeeting.meeting = {
      owner: "owner",
      isLive: false,
      isEnd: false,
    };

    render(wrappedLiveMeetingComponent, { preloadedState: initialState });

    expect(
      screen.getByText("아직 주최자가 미팅을 시작하지 않았습니다.")
    ).toBeInTheDocument();
  });

  it("should show 'meeting end' screen for participant when meeiting is end", () => {
    initialState.login.userId = "notOwner";
    initialState.liveMeeting.isFetchingMeeting = false;
    initialState.liveMeeting.meeting = {
      owner: "owner",
      isLive: false,
      isEnd: true,
    };

    render(wrappedLiveMeetingComponent, { preloadedState: initialState });

    expect(screen.getByText("이미 종료된 미팅입니다!")).toBeInTheDocument();
  });
});
