import { expectSaga } from "redux-saga-test-plan";

import cancelMeetingReservation from "../../common/api/cancelMeetingReservation";
import deleteMeeting from "../../common/api/deleteMeeting";
import fetchMyPageMeetingList from "../../common/api/fetchMyPageMeetingList";
import {
  createCancelMeetingAction,
  createCancelReservationAction,
  createGetMyPageMeetingAction,
  watchCancelMeeting,
  watchCancelReservation,
  watchGetMyPageMeeting,
} from "./myPageSagas";
import {
  apiLoaded,
  calledApi,
  meetingDeleted,
  meetingListLoaded,
  myPageErrorHappened,
  reservationCanceled,
} from "./myPageSlice";

jest.mock("../../common/api/fetchMyPageMeetingList", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../common/api/deleteMeeting", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../common/api/cancelMeetingReservation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("myPageSagas", () => {
  describe("watchGetMyPageMeeting", () => {
    it("should dispatch myPageMeeting from successful api call", () => {
      const testCatagorizedMyPageMeeting = "catagorizedMyPageMeeting";
      fetchMyPageMeetingList.mockReturnValue({
        data: { catagorizedMyPageMeeting: testCatagorizedMyPageMeeting },
      });

      return expectSaga(watchGetMyPageMeeting)
        .put(meetingListLoaded(testCatagorizedMyPageMeeting))
        .dispatch(createGetMyPageMeetingAction())
        .silentRun();
    });

    it("should dispatch error from unsuccessful api call", () => {
      const testError = "helloError";
      fetchMyPageMeetingList.mockRejectedValue(new Error(testError));

      return expectSaga(watchGetMyPageMeeting)
        .put(myPageErrorHappened(testError))
        .dispatch(createGetMyPageMeetingAction())
        .silentRun();
    });
  });

  describe("watchCancelMeeting", () => {
    it("should cancel meeting from successful api call", () => {
      const testMeetingId = "testId";

      return expectSaga(watchCancelMeeting)
        .put(calledApi())
        .put(meetingDeleted(testMeetingId))
        .put(apiLoaded())
        .dispatch(createCancelMeetingAction(testMeetingId))
        .silentRun(800);
    });

    it("should dispatch error from unsuccessful api call", () => {
      const testError = "helloError";
      deleteMeeting.mockRejectedValue(new Error(testError));

      return expectSaga(watchCancelMeeting)
        .put(myPageErrorHappened(testError))
        .dispatch(createCancelMeetingAction())
        .silentRun();
    });
  });

  describe("watchCancelReservation", () => {
    it("should cancel reservation from successful api call", () => {
      const testMeetingId = "testId";

      return expectSaga(watchCancelReservation)
        .put(calledApi())
        .put(reservationCanceled(testMeetingId))
        .put(apiLoaded())
        .dispatch(createCancelReservationAction(testMeetingId))
        .silentRun(800);
    });

    it("should dispatch error from unsuccessful api call", () => {
      const testError = "helloError";
      cancelMeetingReservation.mockRejectedValue(new Error(testError));

      return expectSaga(watchCancelReservation)
        .put(myPageErrorHappened(testError))
        .dispatch(createCancelReservationAction())
        .silentRun();
    });
  });
});
