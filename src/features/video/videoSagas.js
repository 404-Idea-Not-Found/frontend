/* eslint-disable no-shadow */
import { eventChannel } from "redux-saga";
import { call, cancel, fork, put, take } from "redux-saga/effects";
import Peer from "simple-peer";

import ICE_SERVERS from "../../common/config/webRTC";
import getErrorMessage from "../../common/util/getErrorMessage";
import {
  createAttachSocketEventListenerAction,
  createEmitSocketEventAction,
} from "../LiveMeeting/liveMeetingSagas";
import { videoErrorHappened, videoLoaded, videoReset } from "./videoSlice";

const actionType = {
  GET_USER_MEDIA: "GET_USER_MEDIA",
  RTC_SIGNAL_RECEIVED: "RTC_SIGNAL_RECEIVED",
  RTC_CALL_END: "RTC_CALL_END",
};

const videoSagaActionCreators = {
  createGetUserMediaAction: (isOwner, userVideoRef, dispatch) => ({
    type: actionType.GET_USER_MEDIA,
    payload: { isOwner, userVideoRef, dispatch },
  }),
  createRtcSignalReceivedAction: (from, callerSignal) => ({
    type: actionType.RTC_SIGNAL_RECEIVED,
    payload: { caller: from, callerSignal },
  }),
  createRtcCallEndAction: () => ({
    type: actionType.RTC_CALL_END,
    payload: { terminate: true },
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

    return () => peer.destroy();
  });
}

function createParticipantPeerChannel(
  stream,
  userVideoRef,
  peerList,
  dispatch
) {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: ICE_SERVERS,
    stream,
  });

  dispatch(
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

    return () => peer.destroy();
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
    try {
      const action = yield take(peerChannel);
      yield put(action);
    } catch {
      peerChannel.close();
    }
  }
}

function* handleParticipantPeer(stream, userVideoRef, peerList, dispatch) {
  const peerChannel = yield call(
    createParticipantPeerChannel,
    stream,
    userVideoRef,
    peerList,
    dispatch
  );

  try {
    while (true) {
      const action = yield take(peerChannel);
      yield put(action);
    }
  } catch {
    peerChannel.close();
  }
}

export function* webRtcFlow() {
  while (true) {
    let stream;
    const peerList = [];
    const taskList = [];

    try {
      const { payload } = yield take(actionType.GET_USER_MEDIA);
      stream = yield navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (payload.isOwner) {
        payload.userVideoRef.current.srcObject = stream;
        yield put(videoLoaded());

        while (true) {
          const { payload } = yield take([
            actionType.RTC_SIGNAL_RECEIVED,
            actionType.RTC_CALL_END,
          ]);

          if (payload.terminate) break;

          // eslint-disable-next-line no-unused-vars
          const ownerTask = yield fork(
            handleOwnerPeer,
            stream,
            payload.callerSignal,
            payload.caller,
            peerList
          );

          taskList.push(ownerTask);
        }
      }

      if (!payload.isOwner) {
        // eslint-disable-next-line no-unused-vars
        const participantTask = yield fork(
          handleParticipantPeer,
          stream,
          payload.userVideoRef,
          peerList,
          payload.dispatch
        );

        taskList.push(participantTask);

        yield take(actionType.RTC_CALL_END);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      yield put(videoErrorHappened(errorMessage));
    } finally {
      cancel(taskList);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      peerList.forEach((peer) => {
        peer.destroy();
      });
      yield put(videoReset());
    }
  }
}

export const {
  createGetUserMediaAction,
  createRtcSignalReceivedAction,
  createRtcCallEndAction,
} = videoSagaActionCreators;
