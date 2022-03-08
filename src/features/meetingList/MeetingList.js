import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import ErrorMessage from "../../common/components/ErrorMessage";
import Loader from "../../common/components/Loader";
import useMeetingListSearch from "../../common/hooks/useMeetingListSearch";
import { selectLastId, selectQuery } from "../sidebar/selector";
import { lastIdChanged } from "../sidebar/SidebarSlice";
import Meeting from "./Meeting";

const MeetingListContainer = styled.ul`
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 6rem - 15px);
  list-style: none;
  overflow-y: auto;
  padding: 0;
  margin: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MeetingList = React.memo(function MeetingList() {
  const query = useSelector(selectQuery);
  const lastId = useSelector(selectLastId);
  const { isLoading, error, meetingList, hasMore } = useMeetingListSearch(
    query,
    lastId
  );
  const dispatch = useDispatch();
  const observer = useRef();
  const lastMeetingRef = useCallback(
    (meeting) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(
            lastIdChanged({ lastId: meetingList[meetingList.length - 1]._id })
          );
        }
      });
      if (meeting) observer.current.observe(meeting);
    },
    [isLoading, hasMore, meetingList]
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
