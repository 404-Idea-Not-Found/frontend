import { useEffect, useState } from "react";

import fetchMeeting from "../api/fetchMeeting";
import getErrorMessage from "../util/getErrorMessage";
import sleep from "../util/sleep";

function useCheckOwner(meetingId, userId) {
  const [isCheckingOwner, setIsCheckingOwner] = useState(true);
  const [ownerCheckError, setOwnerCheckError] = useState({
    isError: false,
    errorMessage: null,
  });
  const [meetingData, setMeetingData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function apiWrapper() {
      setIsCheckingOwner(true);
      setOwnerCheckError({
        isError: false,
        errorMessage: null,
      });

      try {
        const { data } = await fetchMeeting(meetingId);

        await sleep(200);
        setMeetingData(data.meeting);
        // setIsOwner(data.meeting.owner === userId);
        setIsCheckingOwner(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setOwnerCheckError({
          isError: true,
          errorMessage,
        });
      }
    }

    apiWrapper();

    return () => {
      controller.abort();
    };
  }, [meetingId, userId]);

  return { isCheckingOwner, ownerCheckError, meetingData };
}

export default useCheckOwner;
