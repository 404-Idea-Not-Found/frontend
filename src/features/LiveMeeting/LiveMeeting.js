import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useGetMeeting from "../../common/hooks/useGetMeeting";
import Chat from "../chat/Chatroom";
import { selectUserId } from "../login/selectors";
import Whiteboard from "../whiteboard/Whiteboard";
import ControlPanel from "./ControlPanel";
import {
  createConnectSocketAction,
  createDisconnectSocketAction,
} from "./liveMeetingSagas";

const LiveMeetingContainer = styled.div`
  height: calc(100% - 1rem - 21px);
  display: flex;
  flex-direction: column;
  min-width: 1450px;

  .whiteboard-chat-wrapper {
    width: 100%;
    min-width: 1450px;
    display: flex;
    justify-content: center;
  }
`;

function LiveMeeting() {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const { meetingId } = useParams();
  const { isLoading, error, meeting } = useGetMeeting(meetingId);
  const isOwner = meeting?.owner === userId;

  useEffect(() => {
    if (meeting) {
      dispatch(createConnectSocketAction(meetingId, isOwner, meeting, userId));
    }

    return () => {
      if (meeting) {
        dispatch(createDisconnectSocketAction());
      }
    };
  }, [meetingId, isOwner, meeting, dispatch, userId]);

  return (
    <LiveMeetingContainer>
      <div className="whiteboard-chat-wrapper">
        <Whiteboard isOwner={isOwner} />
        <Chat />
      </div>
      {isLoading && <Loader spinnerWidth="10%" containerHeight="30%" />}
      {!isLoading && (
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
