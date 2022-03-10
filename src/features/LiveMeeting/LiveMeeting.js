/* eslint-disable consistent-return */
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import Modal from "../../common/components/Modal";
import { COLOR } from "../../common/util/constants";
import Chat from "../chat/Chatroom";
import { selectUserId } from "../login/selectors";
import { sidebarRefreshed } from "../sidebar/SidebarSlice";
import Whiteboard from "../whiteboard/Whiteboard";
import ControlPanel from "./ControlPanel";
import {
  createConnectSocketAction,
  createDisconnectSocketAction,
  createGetMeetingAction,
} from "./liveMeetingSagas";
import {
  selectError,
  selectIsFetchingMeeting,
  selectIsLoading,
  selectMeeting,
  selectOwnerDisconnectedDuringMeeting,
} from "./selectors";

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

  .end-meeting-access {
    color: red;
  }

  .meeting-start-button {
    border: none;
    background-color: ${COLOR.BRIGHT_GREEN};
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;
  }

  .existing-start-time {
    background-color: ${COLOR.BRIGHT_GREEN};
  }

  .existing-start-time-warning {
    font-size: 1rem;
    color: red;
  }
`;

function LiveMeeting() {
  const userId = useSelector(selectUserId);
  const error = useSelector(selectError);
  const isSocketConnected = useSelector(selectIsLoading);
  const ownerDisconnectedDuringMeeting = useSelector(
    selectOwnerDisconnectedDuringMeeting
  );
  const meeting = useSelector(selectMeeting);
  const isFetchingMeeting = useSelector(selectIsFetchingMeeting);
  const [didOwnerStartedMeeting, setDidOwnerStartedMeeting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { meetingId } = useParams();

  const isOwner = meeting?.owner === userId;
  const isMeetingWaitingOwner =
    new Date() - new Date(meeting.startTime) > 0 && !meeting.isLive;

  useEffect(() => {
    dispatch(createGetMeetingAction(meetingId));
  }, [meetingId, dispatch]);

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

      return () => {
        setDidOwnerStartedMeeting(false);
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

  if (!isOwner && ownerDisconnectedDuringMeeting) {
    return (
      <Modal
        onModalClose={() => {
          navigate("/main");
          dispatch(sidebarRefreshed());
        }}
      >
        <h1>주최자의 연결이 끊겼습니다!</h1>
        <p>미팅을 종료합니다...</p>
      </Modal>
    );
  }

  if (
    !isFetchingMeeting &&
    !meeting.isLive &&
    !meeting.isEnd &&
    isOwner &&
    !didOwnerStartedMeeting
  ) {
    return (
      <AccessDeniedCard>
        <h1>미팅을 시작해 주세요!</h1>
        <p className="existing-start-time-paragraph">
          설정해둔 미팅시작시간:
          <span className="existing-start-time">
            {dayjs(meeting.startTime).format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <br />
          {!isMeetingWaitingOwner && (
            <span className="existing-start-time-warning">
              (아직 기존에 설정한 미팅시간이 되지 않았습니다. 그래도 주최자니까
              미리 시작하실수는 있어요!)
            </span>
          )}
        </p>
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

  if (!isFetchingMeeting && !meeting.isLive && !meeting.isEnd && !isOwner) {
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

  if (!isFetchingMeeting && meeting.isEnd) {
    return (
      <AccessDeniedCard>
        <h1>이미 종료된 미팅입니다!</h1>
      </AccessDeniedCard>
    );
  }

  return (
    <LiveMeetingContainer>
      {(didOwnerStartedMeeting || meeting.isLive) && (
        <div className="whiteboard-chat-wrapper">
          <Whiteboard isOwner={isOwner} />
          <Chat />
        </div>
      )}
      {(isSocketConnected || isFetchingMeeting || error.isError) && (
        <Loader spinnerWidth="10%" containerHeight="30%" />
      )}
      {!isSocketConnected && !isFetchingMeeting && !error.isError && (
        <ControlPanel
          isOwner={isOwner}
          ownerId={meeting.owner}
          meetingId={meetingId}
        />
      )}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
    </LiveMeetingContainer>
  );
}

export default LiveMeeting;
