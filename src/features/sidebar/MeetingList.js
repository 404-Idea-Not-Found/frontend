import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import Meeting from "./Meeting";
import {
  selectError,
  selectHasMore,
  selectIsLoading,
  selectMeetingList,
} from "./selectors";
import { createLoadMoreWithSameQueryAction } from "./sidebarSagas";

const MeetingListContainer = styled.ul`
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 6rem - 15px);
  list-style: none;
  overflow-y: auto;
  padding-left: 1rem;
  margin: 0;
`;

const MeetingList = React.memo(function MeetingList() {
  const meetingList = useSelector(selectMeetingList);
  const isLoading = useSelector(selectIsLoading);
  const hasMore = useSelector(selectHasMore);
  const error = useSelector(selectError);

  const dispatch = useDispatch();
  const observer = useRef();

  const lastMeetingRef = useCallback(
    (meeting) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(createLoadMoreWithSameQueryAction());
        }
      });
      if (meeting) observer.current.observe(meeting);
    },
    [isLoading, dispatch]
  );

  return (
    <MeetingListContainer>
      {meetingList.map((meeting, index) => (
        <Meeting
          meetingListLength={meetingList.length}
          meeting={meeting}
          index={index}
          ref={lastMeetingRef}
          key={meeting._id}
        />
      ))}
      {isLoading && <Loader />}
      {error.isError && <ErrorMessage errorMessage={error.errorMessage} />}
    </MeetingListContainer>
  );
});

export default MeetingList;
