import { BrowserRouter, Route, Routes } from "react-router-dom";

import testInitialReduxState from "../../common/util/testInitialReduxState";
import { render, screen, runSagaMiddleware } from "../../common/util/testUtils";
import MyPage from "./MyPage";
import { createGetMyPageMeetingAction } from "./myPageSagas";

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
    initialState.myPage.isLoading = false;
    initialState.myPage.meetingList = {
      plannedMeeting: [
        {
          _id: "testId1",
          title: "testTitle1",
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
      pastMeeting: [
        {
          _id: "testId2",
          title: "testTitle2",
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
      reservedMeeting: [
        {
          _id: "testId3",
          title: "testTitle3",
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
      participatingProject: [
        {
          _id: "testId4",
          title: "testTitle4",
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

    expect(screen.getByText("testTitle1")).toBeInTheDocument();
  });
});
