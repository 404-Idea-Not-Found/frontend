import { call, put, takeEvery } from "redux-saga/effects";

import cancelMeetingReservation from "../../common/api/cancelMeetingReservation";
import deleteMeeting from "../../common/api/deleteMeeting";
import fetchMyPageMeetingList from "../../common/api/fetchMyPageMeetingList";
import getErrorMessage from "../../common/util/getErrorMessage";
import sleep from "../../common/util/sleep";
import {
  meetingListLoaded,
  myPageErrorHappened,
  meetingDeleted,
  calledApi,
  apiLoaded,
  reservationCanceled,
} from "./myPageSlice";

const actionType = {
  GET_MY_PAGE_MEETING: "GET_MY_PAGE_MEETING",
  CANCEL_MEETING: "CANCEL_MEETING",
  CANCEL_RESERVATION: "CANCEL_RESERVATION",
};

const myPageSagaActionCreators = {
  createGetMyPageMeetingAction: (userId, email) => ({
    type: actionType.GET_MY_PAGE_MEETING,
    payload: { userId, email },
  }),
  createCancelMeetingAction: (meetingId) => ({
    type: actionType.CANCEL_MEETING,
    payload: { meetingId },
  }),
  createCancelReservationAction: (meetingId) => ({
    type: actionType.CANCEL_RESERVATION,
    payload: { meetingId },
  }),
};

function* getMyPageMeeting(action) {
  try {
    const { data } = yield call(
      fetchMyPageMeetingList,
      action.payload.userId,
      action.payload.email
    );

    yield put(meetingListLoaded(data.catagorizedMyPageMeeting));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    yield put(myPageErrorHappened(errorMessage));
  }
}

function* cancelMeeting(action) {
  try {
    yield put(calledApi());
    yield call(deleteMeeting, action.payload.meetingId);
    yield put(meetingDeleted(action.payload.meetingId));
    yield call(sleep, 500);
    yield put(apiLoaded());
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    yield put(myPageErrorHappened(errorMessage));
  }
}

function* cancelReservation(action) {
  try {
    yield put(calledApi());
    yield call(cancelMeetingReservation, action.payload.meetingId);
    yield put(reservationCanceled(action.payload.meetingId));
    yield call(sleep, 500);
    yield put(apiLoaded());
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    yield put(myPageErrorHappened(errorMessage));
  }
}

export function* watchGetMyPageMeeting() {
  yield takeEvery(actionType.GET_MY_PAGE_MEETING, getMyPageMeeting);
}

export function* watchCancelMeeting() {
  yield takeEvery(actionType.CANCEL_MEETING, cancelMeeting);
}

export function* watchCancelReservation() {
  yield takeEvery(actionType.CANCEL_RESERVATION, cancelReservation);
}

export const {
  createGetMyPageMeetingAction,
  createCancelMeetingAction,
  createCancelReservationAction,
} = myPageSagaActionCreators;
