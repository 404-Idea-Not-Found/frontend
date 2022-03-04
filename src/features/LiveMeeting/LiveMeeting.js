import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useCheckOwner from "../../common/hooks/useCheckOwner";
import { selectUserId } from "../login/selectors";
import Whiteboard from "../whiteboard/Whiteboard";
import ControlPanel from "./ControlPanel";

function LiveMeeting() {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const { meetingId } = useParams();
  const { isOwner, isCheckingOwner, ownerCheckError } = useCheckOwner(
    meetingId,
    userId
  );

  useEffect(() => {
    dispatch({ type: "CONNECT_SOCKET", payload: { room: meetingId } });

    return () => dispatch({ type: "DISCONNECT_SOCKET" });
  });

  return (
    <div>
      <Whiteboard isOwner={isOwner} />
      {isCheckingOwner && <Loader spinnerWidth="10%" containerHeight="30%" />}
      {!isCheckingOwner && <ControlPanel isOwner={isOwner} />}
      {ownerCheckError.isError && (
        <ErrorMessage errorMessage={ownerCheckError.errorMessage} />
      )}
    </div>
  );
}

export default LiveMeeting;
