import { useEffect, useState } from "react";

import fetchMeeting from "../api/fetchMeeting";
import getErrorMessage from "../util/getErrorMessage";
import sleep from "../util/sleep";

function useGetMeeting(meetingId) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ isError: false, errorMessage: null });
  const [meeting, setMeeting] = useState();

  useEffect(() => {
    const controller = new AbortController();
    async function apiWrapper() {
      setIsLoading(true);
      setError(false);

      try {
        const { data } = await fetchMeeting(meetingId);

        await sleep(350);
        setMeeting(data.meeting);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = getErrorMessage(err);

        setError({ isError: true, errorMessage });
      }
    }

    apiWrapper();

    return () => {
      controller.abort();
    };
  }, [meetingId]);

  return { isLoading, error, meeting };
}

export default useGetMeeting;
