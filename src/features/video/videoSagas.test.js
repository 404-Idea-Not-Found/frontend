import { expectSaga } from "redux-saga-test-plan";
import Peer from "simple-peer";

import { createAttachSocketEventListenerAction } from "../liveMeeting/liveMeetingSagas";
import {
  createGetUserMediaAction,
  createRtcCallEndAction,
  createRtcSignalReceivedAction,
  webRtcFlow,
} from "./videoSagas";
import { videoErrorHappened, videoLoaded, videoReset } from "./videoSlice";

jest.mock("simple-peer", () => jest.fn().mockImplementation(() => {}));

describe("videoSagas", () => {
  beforeEach(() => {
    Object.defineProperty(window, "navigator", {
      value: {},
      writable: true,
    });

    window.navigator = { mediaDevices: {} };
    window.navigator.mediaDevices.getUserMedia = () => {};
  });

  it("should establish meeting owner's functioning webRtc connection", async () => {
    const testCaller = "testCaller";
    const testCallerSignal = "testCallerSignal";
    const dispatchMock = jest.fn();

    const peerOnMock = jest.fn();
    const peerSignalMock = jest.fn();
    const peerDestroyMock = jest.fn();

    Peer.mockImplementation(() => ({
      on: peerOnMock,
      signal: peerSignalMock,
      destroy: peerDestroyMock,
    }));

    await expectSaga(webRtcFlow)
      .put(videoLoaded())
      .put(videoReset())
      .dispatch(
        createGetUserMediaAction(
          true,
          {
            current: {
              srcObject: {},
            },
          },
          dispatchMock
        )
      )
      .dispatch(createRtcSignalReceivedAction(testCaller, testCallerSignal))
      .dispatch(createRtcCallEndAction())
      .silentRun();

    // test peer eventListener
    expect(peerOnMock.mock.calls[0][0]).toBe("signal");
    expect(peerOnMock.mock.calls[1][0]).toBe("connect");
    expect(peerOnMock.mock.calls[2][0]).toBe("error");

    // test incoming peer signal
    expect(peerSignalMock.mock.calls[0][0]).toBe(testCallerSignal);
  });

  it("should establish meeting participant's functioning webRtc connection", async () => {
    const dispatchMock = jest.fn();

    const peerOnMock = jest.fn();
    const peerSignalMock = jest.fn();
    const peerDestroyMock = jest.fn();

    Peer.mockImplementation(() => ({
      on: peerOnMock,
      signal: peerSignalMock,
      destroy: peerDestroyMock,
    }));

    await expectSaga(webRtcFlow)
      .put(videoReset())
      .dispatch(
        createGetUserMediaAction(
          false,
          {
            current: {
              srcObject: {},
            },
          },
          dispatchMock
        )
      )
      .dispatch(createRtcCallEndAction())
      .silentRun();

    // test peer eventListener
    expect(peerOnMock.mock.calls[0][0]).toBe("signal");
    expect(peerOnMock.mock.calls[1][0]).toBe("stream");
    expect(peerOnMock.mock.calls[2][0]).toBe("connect");
    expect(peerOnMock.mock.calls[3][0]).toBe("error");

    // test dispatching peer socket event
    expect(dispatchMock.mock.calls[0][0].type).toBe(
      createAttachSocketEventListenerAction().type
    );
  });

  it("should dispatch user media error when failed to get userMedia", () => {
    const testUserMediaError = "helloUserMediaError";

    window.navigator.mediaDevices.getUserMedia = () => {
      throw new Error(testUserMediaError);
    };

    return expectSaga(webRtcFlow)
      .put(videoReset())
      .put(videoErrorHappened(testUserMediaError))
      .dispatch(createGetUserMediaAction())
      .silentRun();
  });
});
