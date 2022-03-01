import PropTypes from "prop-types";
import React, { useCallback, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import styled from "styled-components";

import useMeetingListSearch from "../../common/hooks/useMeetingListSearch";
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const MeetingList = React.memo(function MeetingList({
  query,
  lastId,
  onBottomScroll,
}) {
  const { isLoading, error, meetingList, hasMore } = useMeetingListSearch(
    query,
    lastId
  );
  const observer = useRef();
  const lastMeetingRef = useCallback(
    (meeting) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onBottomScroll(meetingList[meetingList.length - 1]._id);
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
      {isLoading && (
        <LoaderContainer>
          <RotatingLines width="100" strokeColor="black" />
        </LoaderContainer>
      )}
      {error.isError && (
        <div>{`현재 데이터를 불러올 수 없습니다 \n ${error.errorMessage}`}</div>
      )}
    </MeetingListContainer>
  );
});

MeetingList.propTypes = {
  query: PropTypes.string,
  lastId: PropTypes.string,
  onBottomScroll: PropTypes.func.isRequired,
};

MeetingList.defaultProps = {
  query: "",
  lastId: null,
};

export default MeetingList;
