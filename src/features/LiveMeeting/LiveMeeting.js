import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Whiteboard from "../whiteboard/Whiteboard";

function LiveMeeting() {
  const dispatch = useDispatch();
  const { meetingId } = useParams();

  useEffect(() => {
    dispatch({ type: "CONNECT_SOCKET", payload: { room: meetingId } });

    return () => dispatch({ type: "DISCONNECT_SOCKET" });
  });

  return (
    <div>
      <Whiteboard />
    </div>
  );
}

export default LiveMeeting;
