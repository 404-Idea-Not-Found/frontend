import { eventChannel } from "redux-saga";
import { call, cancel, fork, put, take, takeEvery } from "redux-saga/effects";

import fetchMeeting from "../../common/api/fetchMeeting";
import connectSocket from "../../common/config/socket";
import getErrorMessage from "../../common/util/getErrorMessage";
import sleep from "../../common/util/sleep";
import {
  chatSubmitted,
  fetchMeetingRequestSent,
  kickedFromRecruitList,
  meetingConnected,
  meetingErrorHapeened,
  meetingFetched,
  ownerDisconnectedDuringMeeting,
  painterAdded,
  painterRemoved,
  recruitAdded,
  recruitRequestSuccessfullySent,
  whiteboardAllowed,
  whiteboardDisallowed,
} from "./liveMeetingSlice";

const actionType = {
  GET_MEETING: "GET_MEETING",
  EMIT_SOCKET_EVENT: "EMIT_SOCKET_EVENT",
  DISCONNECT_SOCKET: "DISCONNECT_SOCKET",
  ATTACH_SOCKET_EVENT_LISTENER: "ATTACH_SOCKET_EVENT_LISTENER",
  REMOVE_SOCKET_EVENT_LISTENER: "REMOVE_SOCKET_EVENT_LISTENER",
  CONNECT_SOCKET: "CONNECT_SOCKET",
  ALLOW_PAINTER: "ALLOW_PAINTER",
};

const liveMeetingSagaActionCreators = {
  createGetMeetingAction: (meetingId) => ({
    type: actionType.GET_MEETING,
    payload: { meetingId },
  }),
  createConnectSocketAction: (room, isOwner, chatList, userId) => ({
    type: actionType.CONNECT_SOCKET,
    payload: { room, isOwner, chatList, userId },
  }),
  createEmitSocketEventAction: (socketEventName, socketPayload) => ({
    type: actionType.EMIT_SOCKET_EVENT,
    payload: { socketEventName, socketPayload },
  }),
  createDisconnectSocketAction: () => ({
    type: actionType.DISCONNECT_SOCKET,
  }),
  createAttachSocketEventListenerAction: (socketEventName, callback) => ({
    type: actionType.ATTACH_SOCKET_EVENT_LISTENER,
    payload: { socketEventName, callback },
  }),
  createRemoveSocketEventListenerAction: (socketEventName) => ({
    type: actionType.REMOVE_SOCKET_EVENT_LISTENER,
    payload: { socketEventName },
  }),
  createAllowPainterAction: (socketId) => ({
    type: actionType.ALLOW_PAINTER,
    payload: { socketId },
  }),
};

function createSokcetChannel(socket) {
  return eventChannel((emit) => {
    socket.once("initialChatLoaded", (chatList) =>
      emit({ type: "chatListReceived", payload: chatList })
    );
    socket.on("chatReceived", (chat) => emit(chatSubmitted(chat)));
    socket.on("paintRequest", (painter) => {
      emit(painterAdded(painter));
    });
    socket.on("participantDisconnected", (socketId) => {
      emit(painterRemoved(socketId));
    });
    socket.on("whiteboardAllowed", () => {
      emit(whiteboardAllowed());
    });
    socket.on("whiteboardDisallowed", () => {
      emit(whiteboardDisallowed());
    });
    socket.on("requestRecruitment", (recruit) => {
      socket.emit("recruitRequestAccepted", recruit.requestorSocketId);
      emit(recruitAdded(recruit));
    });
    socket.on("recruitRequestAccepted", () => {
      emit(recruitRequestSuccessfullySent());
    });
    socket.on("kickedFromRecuitList", () => {
      emit(kickedFromRecruitList());
    });
    socket.on("requestOwnerVideo", () => {
      emit();
    });
    socket.on("ownerDisconnected", () => {
      emit(ownerDisconnectedDuringMeeting());
    });
    socket.on("DBError", (error) => {
      const errorMessage = getErrorMessage(error);
      emit(new Error(errorMessage));
    });
    socket.on("error", emit(new Error("socket error!")));
    socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        emit(new Error("socket error!"));
      }
    });

    return () => socket.disconnect();
  });
}

function* listenSocketEvent(socket) {
  const socketChannel = yield call(createSokcetChannel, socket);

  while (true) {
    try {
      const action = yield take(socketChannel);
      yield put(action);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      socketChannel.close();
      yield put(meetingErrorHapeened(errorMessage));
    }
  }
}

function* emitSocketEvent(socket) {
  while (true) {
    const { payload } = yield take(actionType.EMIT_SOCKET_EVENT);
    socket.emit(payload.socketEventName, payload.socketPayload);
  }
}

function* attachSocketEventListener(socket) {
  while (true) {
    const { payload } = yield take(actionType.ATTACH_SOCKET_EVENT_LISTENER);
    socket.on(payload.socketEventName, payload.callback);
  }
}

function* removeSocketEventListener(socket) {
  while (true) {
    const { payload } = yield take(actionType.REMOVE_SOCKET_EVENT_LISTENER);
    socket.off(payload.socketEventName);
  }
}

function* handleIO(socket) {
  yield fork(listenSocketEvent, socket);
  yield fork(emitSocketEvent, socket);
  yield fork(attachSocketEventListener, socket);
  yield fork(removeSocketEventListener, socket);
}

function* getMeeting({ payload }) {
  try {
    yield put(fetchMeetingRequestSent());
    const { data } = yield call(fetchMeeting, payload.meetingId);
    yield sleep(350);
    yield put(meetingFetched({ meeting: data.meeting }));
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    yield put(meetingErrorHapeened(errorMessage));
  }
}

export function* sokcetFlow() {
  while (true) {
    try {
      const { payload } = yield take(actionType.CONNECT_SOCKET);
      const socket = yield call(
        connectSocket,
        payload.room,
        payload.isOwner,
        payload.userId
      );

      yield put(
        meetingConnected({
          chatList: payload.chatList,
          isOwner: payload.isOwner,
          userId: payload.userId,
        })
      );
      const task = yield fork(handleIO, socket);
      yield take(actionType.DISCONNECT_SOCKET);
      socket.disconnect();
      yield cancel(task);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      yield put(meetingErrorHapeened(errorMessage));
    }
  }
}

export function* watchGetMeeting() {
  yield takeEvery(actionType.GET_MEETING, getMeeting);
}

export const {
  createGetMeetingAction,
  createConnectSocketAction,
  createEmitSocketEventAction,
  createDisconnectSocketAction,
  createAttachSocketEventListenerAction,
  createRemoveSocketEventListenerAction,
  createAllowPainterAction,
} = liveMeetingSagaActionCreators;
