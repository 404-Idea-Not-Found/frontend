import { eventChannel } from "redux-saga";
import { call, cancel, fork, put, take, takeEvery } from "redux-saga/effects";
import { io } from "socket.io-client";

import getErrorMessage from "../../common/util/getErrorMessage";
import {
  chatSubmitted,
  kickedFromRecruitList,
  meetingConnected,
  meetingDisconnected,
  meetingErrorHapeened,
  painterAdded,
  painterRemoved,
  recruitAdded,
  recruitRequestSuccessfullySent,
  whiteboardAllowed,
  whiteboardDisallowed,
} from "./LiveMeetingSlice";

const actionType = {
  EMIT_SOCKET_EVENT: "EMIT_SOCKET_EVENT",
  DISCONNECT_SOCKET: "DISCONNECT_SOCKET",
  ATTACH_SOCKET_EVENT_LISTENER: "ATTACH_SOCKET_EVENT_LISTENER",
  REMOVE_SOCKET_EVENT_LISTENER: "REMOVE_SOCKET_EVENT_LISTENER",
  CONNECT_SOCKET: "CONNECT_SOCKET",
  ALLOW_PAINTER: "ALLOW_PAINTER",
};

const liveMeetingSagaActionCreators = {
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

async function connectSocket(room, isOwner, userId) {
  const socket = io(
    `${process.env.REACT_APP_SERVER_URL}?room=${room}&isOwner=${isOwner}&userId=${userId}`
  );
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("socket: ", socket.id, "connected");
      resolve(socket);
    });
    socket.on("connect_error", (error) => {
      reject(new Error(error.data));
    });
    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("socket: ", socket.id, "disconnected!");
    });
  });
}

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
    const { payload } = yield take("EMIT_SOCKET_EVENT");
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
      yield put(meetingDisconnected());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      yield put(meetingErrorHapeened(errorMessage));
      yield put(meetingDisconnected());
    }
  }
}
export function* watchDisconnectSokcet() {
  yield takeEvery("CONN_SOCKET", () => {});
}

export const {
  createConnectSocketAction,
  createEmitSocketEventAction,
  createDisconnectSocketAction,
  createAttachSocketEventListenerAction,
  createRemoveSocketEventListenerAction,
  createAllowPainterAction,
} = liveMeetingSagaActionCreators;
