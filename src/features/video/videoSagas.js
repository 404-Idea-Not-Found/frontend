/* eslint-disable no-shadow */
import { eventChannel } from "redux-saga";
import { call, fork, put, take } from "redux-saga/effects";
import Peer from "simple-peer";

import ICE_SERVERS from "../../common/config/webRTC";
import getErrorMessage from "../../common/util/getErrorMessage";
import {
  createAttachSocketEventListenerAction,
  createEmitSocketEventAction,
} from "../LiveMeeting/liveMeetingSagas";
import { videoErrorHappened, videoLoaded } from "./videoSlice";

const actionType = {
  GET_USER_MEDIA: "GET_USER_MEDIA",
  DISCONNECT_SOCKET: "DISCONNECT_SOCKET",
  RTC_SIGNAL_RECEIVED: "RTC_SIGNAL_RECEIVED",
  RTC_CALL_END: "RTC_CALL_END",
};

const videoSagaActionCreators = {
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

function createOwnerPeerChannel(stream, callerSignal, caller, peerList) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    config: ICE_SERVERS,
    stream,
  });

  return eventChannel((emit) => {
    peer.on("signal", (signal) => {
      emit(createEmitSocketEventAction("acceptCall", { signal, caller }));
    });

    peer.on("connect", () => {
      peerList.push(peer);
    });

    peer.on("error", (error) => {
      const errorMessage = getErrorMessage(error);
      emit(new Error(errorMessage));
    });

    peer.signal(callerSignal);
  });
}

function createParticipantPeerChannel(stream, userVideoRef, peerList) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: ICE_SERVERS,
    stream,
  });

  put(
    createAttachSocketEventListenerAction("callAccepted", (signal) => {
      peer.signal(signal);
    })
  );

  return eventChannel((emit) => {
    peer.on("signal", (signal) => {
      emit(createEmitSocketEventAction("requestVideo", signal));
    });

    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
      emit(videoLoaded());
    });

    peer.on("connect", () => {
      peerList.push(peer);
    });

    peer.on("error", (error) => {
      const errorMessage = getErrorMessage(error);
      emit(new Error(errorMessage));
    });
  });
}

function* handleOwnerPeer(stream, callerSignal, caller, peerList) {
  const peerChannel = yield call(
    createOwnerPeerChannel,
    stream,
    callerSignal,
    caller,
    peerList
  );

  while (true) {
    const action = yield take(peerChannel);
    yield put(action);
  }
}

function* handleParticipantPeer(stream, userVideoRef, peerList) {
  const peerChannel = yield call(
    createParticipantPeerChannel,
    stream,
    userVideoRef,
    peerList
  );

  while (true) {
    const action = yield take(peerChannel);
    yield put(action);
  }
}

export function* webRtcFlow() {
  while (true) {
    let stream;
    const peerList = [];

    try {
      const { payload } = yield take(actionType.GET_USER_MEDIA);
      stream = yield navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (payload.isOwner) {
        payload.userVideoRef.current = stream;
        yield put(videoLoaded());

        while (true) {
          const { payload } = yield take(actionType.RTC_SIGNAL_RECEIVED);
          // eslint-disable-next-line no-unused-vars
          const ownerTask = yield fork(
            handleOwnerPeer,
            stream,
            payload.signal,
            payload.caller,
            peerList
          );
        }
      }

      if (!payload.isOwner) {
        // eslint-disable-next-line no-unused-vars
        const participantTask = yield fork(
          handleParticipantPeer,
          stream,
          payload.userVideoRef,
          peerList
        );
      }

      yield take();
    } catch (error) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const errorMessage = getErrorMessage(error);
      yield put(videoErrorHappened(errorMessage));
    }
  }
}

export const { GET_USER_MEDIA } = videoSagaActionCreators;
