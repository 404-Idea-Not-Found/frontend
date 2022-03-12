import { expectSaga } from "redux-saga-test-plan";

import fetchMeetingList from "../../common/api/fetchMeetingList";
import {
  createGetMeetingListAction,
  createLoadMoreWithSameQueryAction,
  watchGetMeetingList,
  watchLoadMoreWithSameQuery,
} from "./sidebarSagas";
import {
  firstMeetingListRequestSent,
  getMeetingListApiEnd,
  meetingListLoaded,
  meetingListRequestFailed,
  moreMeetingListLoadedWithSameQuery,
  subsequentMeetingListRequestSent,
} from "./SidebarSlice";

jest.mock("../../common/api/fetchMeetingList", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("sidebarSagas", () => {
  describe("watchGetMeetingList", () => {
    it("should dispatch meeting list from successful api call", () => {
      const testQuery = "testQuery";
      const mockApiReturn = {
        data: {
          meetingList: ["test"],
          query: testQuery,
        },
      };
      fetchMeetingList.mockReturnValue(mockApiReturn);

      return expectSaga(watchGetMeetingList)
        .put(firstMeetingListRequestSent())
        .put(meetingListLoaded(mockApiReturn.data))
        .dispatch(createGetMeetingListAction(testQuery))
        .silentRun(800);
    });

    it("should dispatch error from unsuccessful api call", () => {
      const testError = "helloError";
      fetchMeetingList.mockRejectedValue(new Error(testError));

      return expectSaga(watchGetMeetingList)
        .put(firstMeetingListRequestSent())
        .put(meetingListRequestFailed({ errorMessage: testError }))
        .dispatch(createGetMeetingListAction())
        .silentRun();
    });
  });

  describe("watchLoadMoreWithSameQuery", () => {
    const testQuery = "testQuery";
    const testLastId = "testLastId";
    const storeState = {
      sidebar: {
        hasMore: true,
        query: testQuery,
        lastId: testLastId,
      },
    };
    const mockApiReturn = {
      data: {
        meetingList: ["test"],
        query: testQuery,
      },
    };

    it("should load more meeting with same query from successful api call", () => {
      fetchMeetingList.mockReturnValue(mockApiReturn);

      return expectSaga(watchLoadMoreWithSameQuery)
        .withState(storeState)
        .put(subsequentMeetingListRequestSent())
        .put(
          moreMeetingListLoadedWithSameQuery({
            meetingList: mockApiReturn.data.meetingList,
          })
        )
        .dispatch(createLoadMoreWithSameQueryAction(testLastId))
        .silentRun(800);
    });

    it("should not load more meeting if 'hasMore' is false", () => {
      const copiedStoreState = JSON.parse(JSON.stringify(storeState));

      copiedStoreState.sidebar.hasMore = false;

      return expectSaga(watchLoadMoreWithSameQuery)
        .withState(copiedStoreState)
        .put(subsequentMeetingListRequestSent())
        .put(getMeetingListApiEnd())
        .dispatch(createLoadMoreWithSameQueryAction())
        .silentRun();
    });

    it("should dispatch error from unsuccessful api call", () => {
      const testError = "helloError";
      fetchMeetingList.mockRejectedValue(new Error(testError));

      return expectSaga(watchLoadMoreWithSameQuery)
        .withState(storeState)
        .put(subsequentMeetingListRequestSent())
        .put(meetingListRequestFailed({ errorMessage: testError }))
        .dispatch(createLoadMoreWithSameQueryAction())
        .silentRun();
    });
  });
});
