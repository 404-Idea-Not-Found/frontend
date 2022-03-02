import { useEffect, useState } from "react";

import fetchMeeting from "../api/fetchMeeting";
import sleep from "../util/sleep";

function useGetMeeting(meetingId) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ isError: false, errorMessage: null });
  const [meeting, setMeeting] = useState();

  useEffect(() => {
    async function apiWrapper() {
      setIsLoading(true);
      setError(false);

      try {
        const { data } = await fetchMeeting(meetingId);

        await sleep(350);
        setMeeting(data.meeting);
        setIsLoading(false);
      } catch (err) {
        let errorMessage = err.message;

        if (err.response) {
          errorMessage = err.response.data.errorMessage;
        }
        setError({ isError: true, errorMessage });
      }
    }

    apiWrapper();
  }, [meetingId]);

  return { isLoading, error, meeting };
}

export default useGetMeeting;
