/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

import { COLOR, PAST_MEETING_FILTER_TYPE } from "../../common/util/constants";
import MyMeetingCard from "./MyMeetingCard";

const { ALL, SUCCESS, FAIL } = PAST_MEETING_FILTER_TYPE;

const MeetingCardListContainer = styled.div`
  min-width: 1000px;
  min-height: 13%;
  overflow-y: auto;
  width: 70%;
  margin: 0 auto;
  margin-bottom: 2rem;

  .meeting-type {
    margin-left: 0.5rem;
    width: fit-content;
    font-size: 1.6rem;
    font-weight: bold;
  }

  .card-list-header {
    display: flex;
    justify-content: space-between;
  }

  .past-meeting-filter {
    display: inline;

    .all-filter {
      text-decoration: ${(props) =>
        props.pastMeetingFilter === "ALL" ? "underline" : "none"};
      text-decoration-color: black;
    }

    .success-filter {
      text-decoration: ${(props) =>
        props.pastMeetingFilter === "SUCCESS" ? "underline" : "none"};
      text-decoration-color: black;
      color: ${COLOR.BRIGHT_GREEN};
    }

    .fail-filter {
      text-decoration: ${(props) =>
        props.pastMeetingFilter === "FAIL" ? "underline" : "none"};
      text-decoration-color: black;
      color: red;
    }

    span {
      display: inline-block;
      margin-bottom: 2spx;
    }
  }

  .card-list-wrapper {
    height: 18rem;
    overflow-y: auto;
  }

  .empty-list {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 5rem;
  }
`;

const MyMeetingCardList = React.memo(function MyMeetingCardList({
  meetingType,
  meetingList,
}) {
  const [pastMeetingFilter, setPastMeetingFilter] = useState(ALL);
  const filteredMeetingList = meetingList.filter((meeting) => {
    const isColleague = !!meeting.colleague.length;

    if (pastMeetingFilter === ALL) {
      return true;
    }

    if (pastMeetingFilter === SUCCESS) {
      return !!isColleague;
    }

    if (pastMeetingFilter === FAIL) {
      return !isColleague;
    }
  });

  return (
    <MeetingCardListContainer pastMeetingFilter={pastMeetingFilter}>
      <div className="card-list-header">
        <div className="meeting-type">{meetingType}</div>
        {meetingType === "지난 미팅" && (
          <div className="past-meeting-filter">
            <button
              type="button"
              className="all-filter"
              onClick={() => setPastMeetingFilter(PAST_MEETING_FILTER_TYPE.ALL)}
            >
              ALL
            </button>
            <button
              type="button"
              className="success-filter"
              onClick={() =>
                setPastMeetingFilter(PAST_MEETING_FILTER_TYPE.SUCCESS)
              }
            >
              모집 성공
            </button>
            <button
              type="button"
              className="fail-filter"
              onClick={() =>
                setPastMeetingFilter(PAST_MEETING_FILTER_TYPE.FAIL)
              }
            >
              모집 실패
            </button>
          </div>
        )}
      </div>
      <hr />
      {!filteredMeetingList.length && <div className="empty-list">텅~</div>}
      {!!filteredMeetingList.length && (
        <div className="card-list-wrapper">
          {filteredMeetingList.map((meeting) => (
            <MyMeetingCard
              key={meeting._id}
              pastMeetingFilter={pastMeetingFilter}
              meetingType={meetingType}
              meeting={meeting}
            />
          ))}
        </div>
      )}
    </MeetingCardListContainer>
  );
});

MyMeetingCardList.propTypes = {
  meetingType: PropTypes.string.isRequired,
  meetingList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      owner: PropTypes.string,
      reservation: PropTypes.arrayOf(PropTypes.string),
      colleague: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string,
          currentSocketId: PropTypes.string,
          email: PropTypes.string,
          profilePicture: PropTypes.string,
        })
      ),
      recruitmentNumber: PropTypes.number,
      startTime: PropTypes.string,
      isLive: PropTypes.bool,
      isEnd: PropTypes.bool,
    })
  ).isRequired,
};

export default MyMeetingCardList;
