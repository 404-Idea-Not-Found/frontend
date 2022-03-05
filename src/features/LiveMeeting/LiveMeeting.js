/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useGetMeeting from "../../common/hooks/useGetMeeting";
import { COLOR } from "../../common/util/constants";
import Chat from "../chat/Chatroom";
import { selectUserId } from "../login/selectors";
import Whiteboard from "../whiteboard/Whiteboard";
import ControlPanel from "./ControlPanel";
import {
  createConnectSocketAction,
  createDisconnectSocketAction,
} from "./liveMeetingSagas";
import { selectError, selectIsLoading } from "./selector";

const LiveMeetingContainer = styled.div`
  height: calc(100% - 1rem - 21px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 1450px;

  .whiteboard-chat-wrapper {
    width: 100%;
    min-width: 1450px;
    display: flex;
    justify-content: center;
  }
`;

const AccessDeniedCard = styled.div`
  height: calc(100% - 1rem - 21px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 1450px;

  h1 {
    font-size: 5rem;
  }

  p {
    font-weight: bold;
    font-size: 2rem;
  }

  a {
    color: black;
    display: block;
    background-color: ${COLOR.LEMON};
    text-decoration: none;
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;
    transition: all 0.4s;
  }

  a:hover {
    opacity: 0.3;
  }

  .meeting-start-button {
    border: none;
    background-color: ${COLOR.BRIGHT_GREEN};
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;
    transition: all 0.4s;
  }

  .meeting-start-button:hover {
    opacity: 0.3;
  }
`;

function LiveMeeting() {
  const userId = useSelector(selectUserId);
  const liveMeetingStoreError = useSelector(selectError);
  const isLiveMeetingLoading = useSelector(selectIsLoading);
  console.log(
    "initial state",
    userId,
    liveMeetingStoreError,
    isLiveMeetingLoading
  );
  const [didOwnerStartedMeeting, setDidOwnerStartedMeeting] = useState(false);
  const dispatch = useDispatch();
  const { meetingId } = useParams();
  const {
    isLoading,
    error: apiError,
    meeting,
  } = useGetMeeting(meetingId, isLiveMeetingLoading);
  const isOwner = meeting?.owner === userId;

  useEffect(() => {
    if (!isOwner && meeting.isLive && !meeting.isEnd) {
      dispatch(
        createConnectSocketAction(meetingId, isOwner, meeting.chatList, userId)
      );

      return () => {
        dispatch(createDisconnectSocketAction());
      };
    }
  }, [meetingId, isOwner, meeting.isLive, meeting.isEnd, dispatch, userId]);

  useEffect(() => {
    if (isOwner && didOwnerStartedMeeting) {
      dispatch(
        createConnectSocketAction(meetingId, isOwner, meeting.chatList, userId)
      );
      setDidOwnerStartedMeeting(false);

      return () => {
        dispatch(createDisconnectSocketAction());
      };
    }
  }, [
    meetingId,
    isOwner,
    meeting.isLive,
    didOwnerStartedMeeting,
    meeting.isEnd,
    dispatch,
    userId,
  ]);

  if (!isLoading && !meeting.isLive && !meeting.isEnd) {
    if (isOwner) {
      return (
        <AccessDeniedCard>
          <h1>미팅을 시작해 주세요!</h1>
          <p>미팅을 시작하시겠습니까?</p>
          <p>미팅을 시작해주셔야 다른 참여자가 입장할 수 있습니다.</p>
          <button
            className="meeting-start-button"
            type="button"
            onClick={() => {
              setDidOwnerStartedMeeting(true);
            }}
          >
            미팅시작
          </button>
        </AccessDeniedCard>
      );
    }

    return (
      <AccessDeniedCard>
        <h1>Please Wait...</h1>
        <p>아직 주최자가 미팅을 시작하지 않았습니다.</p>
        <p>잠시후 새로고침 해보세요!</p>
        <Link reloadDocument={true} to={`/main/meeting/live/${meetingId}`}>
          새로고침
        </Link>
      </AccessDeniedCard>
    );
  }

  if (!isLoading && meeting.isEnd) {
    return (
      <AccessDeniedCard>
        <h1>이미 종료된 미팅입니다!</h1>
      </AccessDeniedCard>
    );
  }

  return (
    <LiveMeetingContainer>
      {!isLiveMeetingLoading &&
        !liveMeetingStoreError.isError &&
        !apiError.isError && (
          <div className="whiteboard-chat-wrapper">
            <Whiteboard isOwner={isOwner} />
            <Chat />
          </div>
        )}
      {(isLiveMeetingLoading || isLoading || liveMeetingStoreError.isError) && (
        <Loader spinnerWidth="10%" containerHeight="30%" />
      )}
      {!isLiveMeetingLoading &&
        !isLoading &&
        !liveMeetingStoreError.isError && (
          <ControlPanel
            isOwner={isOwner}
            ownerId={meeting.owner}
            meetingId={meetingId}
          />
        )}
      {apiError.isError && (
        <ErrorMessage errorMessage={apiError.errorMessage} />
      )}
      {liveMeetingStoreError.isError && (
        <ErrorMessage errorMessage={liveMeetingStoreError.errorMessage} />
      )}
    </LiveMeetingContainer>
  );
}

export default LiveMeeting;
