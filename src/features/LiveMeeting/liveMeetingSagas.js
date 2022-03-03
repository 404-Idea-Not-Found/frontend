import { eventChannel } from "redux-saga";
import { call, cancel, fork, put, take, takeEvery } from "redux-saga/effects";
import { io } from "socket.io-client";

async function connectSocket(room) {
  const socket = io(`${process.env.REACT_APP_SERVER_URL}?room=${room}`);
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("socket: ", socket.id, "connected");
      resolve(socket);
    });
    socket.on("connect_error", () => {
      reject(new Error("failed to connect socket!"));
      socket.disconnect();
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
    socket.on("receiveChat", (chat) =>
      emit({ type: "chatReceived", payload: chat })
    );

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
      socketChannel.close();
      put({ type: "DISCONNECT_SOCKET" });
      put({ type: "socketErrorHappened", payload: error.message });
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
    const { payload } = yield take("ATTACH_SOCKET_EVENT_LISTENER");
    socket.on(payload.socketEventName, payload.callback);
  }
}

function* removeSocketEventListener(socket) {
  while (true) {
    const { payload } = yield take("REMOVE_SOCKET_EVENT_LISTENER");
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
      const { payload } = yield take("CONNECT_SOCKET");
      const socket = yield call(connectSocket, payload.room);
      const task = yield fork(handleIO, socket);
      yield take("DISCONNECT_SOCKET");
      socket.disconnect();
      yield cancel(task);
      yield put({ type: "userDisconnectedSocket" });
    } catch (error) {
      put({ type: "socketErrorHappened", payload: error.message });
    }
  }
}

export function* watchDisconnectSokcet() {
  yield takeEvery("CONN_SOCKET", () => {});
}
