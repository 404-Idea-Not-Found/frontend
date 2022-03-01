import { useEffect, useState } from "react";

import fetchMeetingList from "../api/fetchMeetingList";

function useMeetingListSearch(query, lastId) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ isError: false, errorMessage: null });
  const [meetingList, setMeetingList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  // const [lastId , setLastId] = useState();

  useEffect(() => {
    setMeetingList([]);
    setHasMore(false);
  }, [query]);

  useEffect(() => {
    // const controller = new AbortController();
    async function apiWrapper() {
      setIsLoading(true);
      setError({ isError: false, errorMessage: null });

      try {
        const { data } = await fetchMeetingList(query, lastId);
        setMeetingList((existingMeetingList) => [
          ...existingMeetingList,
          ...data.meetingList,
        ]);
        setHasMore(!!data.meetingList.length);
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

    // return () => controller.abort();
  }, [query, lastId]);
  return { isLoading, error, meetingList, hasMore };
}

export default useMeetingListSearch;
