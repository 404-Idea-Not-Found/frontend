import { expectSaga } from "redux-saga-test-plan";
import { io } from "socket.io-client";

import fetchMeeting from "../../common/api/fetchMeeting";
import connectSocket from "../../common/config/socket";
import {
  createAttachSocketEventListenerAction,
  createConnectSocketAction,
  createDisconnectSocketAction,
  createEmitSocketEventAction,
  createGetMeetingAction,
  sokcetFlow,
  watchGetMeeting,
} from "./liveMeetingSagas";
import {
  fetchMeetingRequestSent,
  meetingConnected,
  meetingDisconnected,
  meetingErrorHapeened,
  meetingFetched,
} from "./liveMeetingSlice";

jest.mock("../../common/api/fetchMeeting", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("socket.io-client", () => ({
  __esModule: true,
  ...jest.requireActual("socket.io-client"),
  io: jest.fn(),
}));

jest.mock("./liveMeetingSagas", () => ({
  __esModule: true,
  ...jest.requireActual("./liveMeetingSagas"),
  connectSocket: jest.fn(),
}));

jest.mock("../../common/config/socket", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("liveMeetingSaga", () => {
  describe("watchGetMeeting", () => {
    it("should dispatch returned meeting from api", () => {
      const testMeeting = "testMeeting";
      fetchMeeting.mockReturnValue({ data: { meeting: testMeeting } });

      return expectSaga(watchGetMeeting)
        .put(fetchMeetingRequestSent())
        .put(meetingFetched({ meeting: testMeeting }))
        .dispatch(createGetMeetingAction())
        .silentRun(500);
    });

    it("should dispatch error when failed", () => {
      const testError = "helloError";
      fetchMeeting.mockRejectedValue(new Error(testError));

      return expectSaga(watchGetMeeting)
        .put(meetingErrorHapeened(testError))
        .dispatch(createGetMeetingAction())
        .silentRun();
    });
  });

  describe("socketFlow", () => {
    it("should establish functioning socket connection with successful connection attempt.", async () => {
      const room = "testRoom";
      const isOwner = false;
      const chatList = ["test"];
      const userId = "testId";

      const socketOnMock = jest.fn();
      const socketOnceMock = jest.fn();
      const socketDisconnectMock = jest.fn();
      const socketEmitMock = jest.fn();

      const testSocketEventName = "testSocketEventName";
      const testSocketPayload = "testSocketPayload";
      const testAttachedSocketEventName = "testAttachedSocketEventName";
      const testAttachedSocketCallback = () => {};

      io.mockReturnValue({ on: () => {} });

      connectSocket.mockReturnValue({
        on: socketOnMock,
        once: socketOnceMock,
        off: jest.fn(),
        disconnect: socketDisconnectMock,
        emit: socketEmitMock,
      });

      await expectSaga(sokcetFlow)
        .put(
          meetingConnected({
            chatList,
            isOwner,
            userId,
          })
        )
        .put(meetingDisconnected())
        .dispatch(createConnectSocketAction(room, isOwner, chatList, userId))
        .dispatch(
          createEmitSocketEventAction(testSocketEventName, testSocketPayload)
        )
        .dispatch(
          createAttachSocketEventListenerAction(
            testAttachedSocketEventName,
            testAttachedSocketCallback
          )
        )
        .dispatch(createDisconnectSocketAction())
        .silentRun();

      // test socket event channel
      expect(socketOnMock.mock.calls[0][0]).toBe("chatReceived");
      expect(socketOnMock.mock.calls[1][0]).toBe("paintRequest");
      expect(socketOnMock.mock.calls[2][0]).toBe("participantDisconnected");
      expect(socketOnMock.mock.calls[3][0]).toBe("whiteboardAllowed");
      expect(socketOnMock.mock.calls[4][0]).toBe("whiteboardDisallowed");
      expect(socketOnMock.mock.calls[5][0]).toBe("requestRecruitment");
      expect(socketOnMock.mock.calls[6][0]).toBe("recruitRequestAccepted");
      expect(socketOnMock.mock.calls[7][0]).toBe("kickedFromRecuitList");
      expect(socketOnMock.mock.calls[8][0]).toBe("requestOwnerVideo");
      expect(socketOnMock.mock.calls[9][0]).toBe("ownerDisconnected");
      expect(socketOnMock.mock.calls[10][0]).toBe("DBError");
      expect(socketOnMock.mock.calls[11][0]).toBe("error");
      expect(socketOnMock.mock.calls[12][0]).toBe("disconnect");

      // test socket emit
      expect(socketEmitMock.mock.calls[0]).toEqual([
        testSocketEventName,
        testSocketPayload,
      ]);

      // test socket attach
      expect(socketOnMock.mock.calls[13]).toEqual([
        testAttachedSocketEventName,
        testAttachedSocketCallback,
      ]);

      // test socket once
      expect(socketOnceMock.mock.calls[0][0]).toBe("initialChatLoaded");

      // test socket disconnect
      expect(socketDisconnectMock.mock.calls[0]).toEqual([]);
    });

    it("should throw error when socket connection is failed", () => {
      const testError = "helloError";
      connectSocket.mockRejectedValue(new Error(testError));

      return expectSaga(sokcetFlow)
        .dispatch(createConnectSocketAction())
        .put(meetingErrorHapeened(testError))
        .put(meetingDisconnected())
        .silentRun();
    });
  });
});
