import { BrowserRouter, Route, Routes } from "react-router-dom";

import testInitialReduxState from "../../common/util/initialState";
import { render, screen, runSagaMiddleware } from "../../common/util/testUtils";
import MyPage from "./MyPage";
import { createGetMyPageMeetingAction } from "./myPageSagas";

// jest.mock("../../common/api/fetchMyPageMeetingList", () => ({
//   __esModule: true,
//   default: jest.fn(),
// }));

jest.mock("./myPageSagas", () => ({
  __esModule: true,
  ...jest.requireActual("./myPageSagas"),
  createGetMyPageMeetingAction: jest.fn(),
}));

const wrappedMyPageComponent = (
  <BrowserRouter>
    <Routes>
      <Route path="my-page" element={<MyPage />} />
    </Routes>
  </BrowserRouter>
);

describe("MyPage", () => {
  const initialState = JSON.parse(JSON.stringify(testInitialReduxState));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/my-page");
  });

  it("should show warning when user is not logged in", () => {
    render(wrappedMyPageComponent, { preloadedState: initialState });

    expect(screen.getByText("로그인이 필요 합니다!")).toBeInTheDocument();
  });

  it("should show loaded meeting", async () => {
    initialState.login.userId = "test";
    initialState.login.email = "test@gmail.com";
    initialState.liveMeeting.meetingList = {
      plannedMeeting: [
        {
          _id: "testId",
          title: "testTitle",
          description: "testDescription",
          owner: "testOwner",
          reservation: ["testReservation@gmail.com"],
          colleague: [
            {
              username: "testColleague",
              currentSocketId: "testSocketId",
              email: "testColleague@gmail.com",
              profilePicture: "testProfilePicture",
            },
          ],
          recruitmentNumber: 3,
          startTime: "2100-12-12T10:10",
          isLive: false,
          isEnd: false,
        },
      ],
    };

    createGetMyPageMeetingAction.mockImplementation(() => ({ type: "none" }));

    render(wrappedMyPageComponent, { preloadedState: initialState });

    expect(screen.getByText("testTitle")).toBeInTheDocument();
  });
});
