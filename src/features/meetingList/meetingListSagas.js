import { put, takeEvery, call, select } from "redux-saga/effects";

import fetchMeetingList from "../../common/api/fetchMeetingList";
import {
  meetingListLoaded,
  meetingListRequestSent,
  failedFetchingMeetingList,
} from "./meetingListSlice";
import { selectMetingListLastId } from "./selectors";

export const meetingListSagaActionCreators = {
  getMeetingList: () => ({
    type: "GET_MEETING_LIST",
  }),
};

export function* getMeetingList() {
  put(meetingListRequestSent());
  try {
    const lastId = yield select(selectMetingListLastId);
    const res = yield call(fetchMeetingList, lastId);

    yield put(meetingListLoaded(res.data.meetingList));
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data.errorMessage;
    }

    yield put(failedFetchingMeetingList(errorMessage));
  }
}

export function* watchGetMeetingList() {
  yield takeEvery("GET_MEETING_LIST", getMeetingList);
}
