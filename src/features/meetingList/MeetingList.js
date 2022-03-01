import PropTypes from "prop-types";
import React, { useCallback, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import styled from "styled-components";

import useMeetingListSearch from "../../common/hooks/useMeetingListSearch";
import greenDot from "../../images/greenDot.png";
import redDot from "../../images/redDot.png";

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

const Meeting = styled.li`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: 90%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: 1rem;
  text-overflow: ellipsis;
  cursor: pointer;

  .meeting-title {
    font-size: 2rem;
    font-weight: bold;
  }

  .tag-container {
    display: flex;
  }

  .text-container {
    width: 100%;
  }

  .meeting-title {
    width: 340px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tag {
    margin-right: 1rem;
    font-size: 1.2rem;
  }

  .red-dot {
    display: block;
    width: 1.5rem;
    padding: 0.2rem;
  }
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
      {meetingList.map((meeting, index) => {
        if (meetingList.length - 1 === index) {
          return (
            <Meeting key={meeting._id} ref={lastMeetingRef}>
              <div className="text-container">
                <div className="meeting-title">{meeting.title}</div>
                <div className="tag-container">
                  <div className="tag">#{meeting.tag[0]}</div>
                  <div className="tag">#{meeting.tag[1]}</div>
                </div>
              </div>
              <img
                className="red-dot"
                src={meeting.isLive ? greenDot : redDot}
                alt="meeting-not-ready-icon"
              />
            </Meeting>
          );
        }

        return (
          <Meeting key={meeting._id}>
            <div className="text-container">
              <div className="meeting-title">{meeting.title}</div>
              <div className="tag-container">
                <div className="tag">#{meeting.tag[0]}</div>
                <div className="tag">#{meeting.tag[1]}</div>
              </div>
            </div>
            <img
              className="red-dot"
              src={meeting.isLive ? greenDot : redDot}
              alt="meeting-not-ready-icon"
            />
          </Meeting>
        );
      })}
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
