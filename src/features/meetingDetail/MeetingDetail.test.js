import { BrowserRouter, Route, Routes } from "react-router-dom";

import cancelMeetingReservation from "../../common/api/cancelMeetingReservation";
import reserveMeeting from "../../common/api/reserveMeeting";
import useGetMeeting from "../../common/hooks/useGetMeeting";
import testInitialReduxState from "../../common/util/initialState";
import mockMeeting from "../../common/util/mockMeeting";
import {
  render,
  fireEvent,
  screen,
  runSagaMiddleware,
} from "../../common/util/testUtils";
import MeetingDetailContainer from "./MeetingDetailContainer";

jest.mock("../../common/hooks/useGetMeeting", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => () => "done",
}));

jest.mock("../../common/api/reserveMeeting", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../common/api/cancelMeetingReservation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const wrappedMeetingDetailComponent = (
  <BrowserRouter>
    <Routes>
      <Route
        path="meeting/detail/:meetingId"
        element={<MeetingDetailContainer />}
      />
    </Routes>
  </BrowserRouter>
);

describe("MeetingDetail", () => {
  let initialState = JSON.parse(JSON.stringify(testInitialReduxState));
  let mockMeetingCopy = JSON.parse(JSON.stringify(mockMeeting));

  beforeAll(() => {
    render(<div id="root" />);
    runSagaMiddleware();
  });

  beforeEach(() => {
    render(<div id="root" />);
    window.history.pushState({}, "", "/meeting/detail/testMeetingId");
  });

  afterEach(() => {
    initialState = JSON.parse(JSON.stringify(testInitialReduxState));
    mockMeetingCopy = JSON.parse(JSON.stringify(mockMeeting));
  });

  describe("reservation", () => {
    beforeEach(() => {
      useGetMeeting.mockImplementation(() => ({
        isLoading: false,
        error: { isError: false, errorMessage: null },
        meeting: mockMeetingCopy,
      }));

      mockMeetingCopy.startTime = "2100-03-10T12:32";
    });

    it("should show need login when not logged-in and clicked reservation button", async () => {
      initialState.login.userId = "notOwner";

      render(wrappedMeetingDetailComponent, { preloadedState: initialState });

      const meetingReservationButtonEl = screen.getByText("미팅 참여 예약");

      fireEvent.click(meetingReservationButtonEl);

      const test = await screen.findByText("로그인이 필요합니다!");

      expect(test).toBeInTheDocument();
    });

    it("should show 'reservation success' when successfully reserved the meeting", async () => {
      initialState.login.userId = "notOwner";

      render(wrappedMeetingDetailComponent, { preloadedState: initialState });

      const meetingReservationButtonEl = screen.getByText("미팅 참여 예약");

      fireEvent.click(meetingReservationButtonEl);

      const meetingSuccess = await screen.findByText(
        "미팅 예약에 성공했습니다!"
      );

      expect(meetingSuccess).toBeInTheDocument();
    });

    it("should show 'reservation failed' when meeting reservation failed", async () => {
      initialState.login.userId = "notOwner";
      reserveMeeting.mockImplementation(() => {
        throw new Error("test");
      });

      render(wrappedMeetingDetailComponent, { preloadedState: initialState });

      const meetingReservationButtonEl = screen.getByText("미팅 참여 예약");

      fireEvent.click(meetingReservationButtonEl);

      const meetingSuccess = await screen.findByText(
        "미팅 예약에 실패 했습니다!"
      );

      expect(meetingSuccess).toBeInTheDocument();
    });

    it("should show 'reservation cancel success' when successfully canceled reservation", async () => {
      initialState.login.email = "test@gmail.com";

      cancelMeetingReservation.mockImplementation(() => "success");

      render(wrappedMeetingDetailComponent, { preloadedState: initialState });

      const meetingReservationButtonEl = screen.getByText("예약 취소");

      fireEvent.click(meetingReservationButtonEl);

      const reservationCancelSuccess = await screen.findByText(
        "미팅 예약을 취소 했습니다..."
      );

      expect(reservationCancelSuccess).toBeInTheDocument();
    });

    it("should show 'reservation cancel failed' when canceled reservation failed", async () => {
      initialState.login.email = "test@gmail.com";

      cancelMeetingReservation.mockImplementation(() => {
        throw new Error("test");
      });

      render(wrappedMeetingDetailComponent, { preloadedState: initialState });

      const meetingReservationButtonEl = screen.getByText("예약 취소");

      fireEvent.click(meetingReservationButtonEl);

      const reservationCancelSuccess = await screen.findByText(
        "미팅 예약에 실패 했습니다!"
      );

      expect(reservationCancelSuccess).toBeInTheDocument();
    });
  });
});
