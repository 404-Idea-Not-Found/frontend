import { call, put, select, takeEvery } from "redux-saga/effects";

import fetchMeetingList from "../../common/api/fetchMeetingList";
import getErrorMessage from "../../common/util/getErrorMessage";
import sleep from "../../common/util/sleep";
import { selectHasMore, selectLastId, selectQuery } from "./selectors";
import {
  firstMeetingListRequestSent,
  getMeetingListApiEnd,
  meetingListLoaded,
  meetingListRequestFailed,
  moreMeetingListLoadedWithSameQuery,
  subsequentMeetingListRequestSent,
} from "./SidebarSlice";

const actionType = {
  GET_MEETING_LIST: "GET_MEETING_LIST",
  LOAD_MORE_WITH_SAME_QUERY: "LOAD_MORE_WITH_SAME_QUERY",
};

const meetingListSagaActionCreators = {
  createGetMeetingListAction: (query) => ({
    type: actionType.GET_MEETING_LIST,
    payload: { query },
  }),
  createLoadMoreWithSameQueryAction: (lastId) => ({
    type: actionType.LOAD_MORE_WITH_SAME_QUERY,
    payload: { lastId },
  }),
};

function* getMeetingList(action) {
  try {
    yield put(firstMeetingListRequestSent());
    const { data } = yield call(fetchMeetingList, action.payload.query);
    yield sleep(600);
    yield put(
      meetingListLoaded({
        meetingList: data.meetingList,
        query: action.payload.query,
      })
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    yield put(meetingListRequestFailed({ errorMessage }));
  }
}

function* loadMoreWithSameQuery() {
  try {
    yield put(subsequentMeetingListRequestSent());
    const hasMore = yield select(selectHasMore);

    if (!hasMore) {
      yield put(getMeetingListApiEnd());
      return;
    }

    const query = yield select(selectQuery);
    const lastId = yield select(selectLastId);
    const { data } = yield call(fetchMeetingList, query, lastId);

    yield sleep(600);
    yield put(
      moreMeetingListLoadedWithSameQuery({
        meetingList: data.meetingList,
      })
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    yield put(meetingListRequestFailed({ errorMessage }));
  }
}

export function* watchGetMeetingList() {
  yield takeEvery(actionType.GET_MEETING_LIST, getMeetingList);
}

export function* watchLoadMoreWithSameQuery() {
  yield takeEvery(actionType.LOAD_MORE_WITH_SAME_QUERY, loadMoreWithSameQuery);
}

export const { createGetMeetingListAction, createLoadMoreWithSameQueryAction } =
  meetingListSagaActionCreators;
