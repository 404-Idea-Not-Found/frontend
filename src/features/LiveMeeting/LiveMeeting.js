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
import { selectError, selectIsLoading } from "./selector";

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
  const liveMeetingStoreError = useSelector(selectError);
  const isLiveMeetingLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const { meetingId } = useParams();
  const { isLoading, error: apiError, meeting } = useGetMeeting(meetingId);
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
