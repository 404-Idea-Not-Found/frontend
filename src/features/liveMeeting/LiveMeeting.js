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
import { createGetMeetingListAction } from "../sidebar/sidebarSagas";
import { createRtcCallEndAction } from "../video/videoSagas";
import Whiteboard from "../whiteboard/Whiteboard";
import ControlPanel from "./ControlPanel";
import {
  createConnectSocketAction,
  createDisconnectSocketAction,
  createGetMeetingAction,
} from "./liveMeetingSagas";
import { meetingReset } from "./liveMeetingSlice";
import {
  selectError,
  selectIsFetchingMeeting,
  selectIsLoading,
  selectMeeting,
  selectOwnerDisconnectedDuringMeeting,
} from "./selectors";

const LiveMeetingContainer = styled.div`
  height: calc(100vh - 3.5rem);
  display: flex;
  width: fit-content;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  margin: 0 auto;
  padding: 0 1rem;

  .whiteboard-chat-wrapper {
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
  }
`;

const AccessDeniedCard = styled.div`
  height: calc(100vh - 1rem - 21px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;

  h1 {
    font-size: 5rem;

    @media (max-width: 1440px) {
      font-size: 4rem;
    }
  }

  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    font-size: 2rem;

    @media (max-width: 1440px) {
      font-size: 1.4rem;
    }
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
    border-radius: 7px;
    background-color: ${COLOR.BRIGHT_GREEN};
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;

    @media (max-width: 1440px) {
      font-size: 2.5rem;
    }
  }

  .existing-start-time-outer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
  }

  .existing-start-time-inner-wrapper {
    display: flex;
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
        dispatch(createGetMeetingListAction(""));
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
        dispatch(createGetMeetingListAction(""));
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

  useEffect(
    () => () => {
      dispatch(meetingReset());
    },
    []
  );

  if (!isOwner && ownerDisconnectedDuringMeeting) {
    return (
      <Modal
        onModalClose={() => {
          dispatch(createRtcCallEndAction());
          navigate("/main");
        }}
      >
        <h1>???????????? ????????? ???????????????!</h1>
        <p>????????? ???????????????...</p>
      </Modal>
    );
  }

  if (isOwner && meeting.isLive && !error.isError) {
    return (
      <Modal
        onModalClose={() => {
          dispatch(createRtcCallEndAction());
          navigate("/main");
        }}
      >
        <h1>?????? ???????????? ??????????????? ???????????????!</h1>
        <p>???????????? ????????? ?????? ????????? ????????? ?????? ??????????????? ???????????????????</p>
        <p>????????? ?????? ??????????????????!</p>
      </Modal>
    );
  }

  if (
    !isFetchingMeeting &&
    !meeting.isLive &&
    !meeting.isEnd &&
    isOwner &&
    !didOwnerStartedMeeting &&
    !error.isError
  ) {
    return (
      <AccessDeniedCard>
        <h1>????????? ????????? ?????????!</h1>
        <div className="existing-start-time-outer-wrapper">
          <div className="existing-start-time-inner-wrapper">
            ???????????? ??????????????????:
            <span className="existing-start-time">
              {dayjs(meeting.startTime).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </div>
          {!isMeetingWaitingOwner && (
            <div className="existing-start-time-warning">
              (?????? ????????? ????????? ??????????????? ?????? ???????????????. ????????? ???????????????
              ?????? ?????????????????? ?????????!)
            </div>
          )}
        </div>
        <p>????????? ?????????????????????????</p>
        <p>????????? ?????????????????? ?????? ???????????? ????????? ??? ????????????.</p>
        <button
          className="meeting-start-button"
          type="button"
          onClick={() => {
            setDidOwnerStartedMeeting(true);
          }}
        >
          ????????????
        </button>
      </AccessDeniedCard>
    );
  }

  if (
    !isFetchingMeeting &&
    !meeting.isLive &&
    !meeting.isEnd &&
    !isOwner &&
    !error.isError
  ) {
    return (
      <AccessDeniedCard>
        <h1>Please Wait...</h1>
        <p>?????? ???????????? ????????? ???????????? ???????????????.</p>
        <p>????????? ???????????? ????????????!</p>
        <Link reloadDocument={true} to={`/main/meeting/live/${meetingId}`}>
          ????????????
        </Link>
      </AccessDeniedCard>
    );
  }

  if (!isFetchingMeeting && meeting.isEnd && !error.isError) {
    return (
      <AccessDeniedCard>
        <h1>?????? ????????? ???????????????!</h1>
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
        <Loader spinnerWidth="200px" containerHeight="90%" />
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
