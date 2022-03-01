import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import greenDot from "../../images/greenDot.png";
import redDot from "../../images/redDot.png";

const MeetingContainer = styled.li`
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

  .dot {
    display: block;
    width: 1.5rem;
    padding: 0.2rem;
  }
`;

const Meeting = React.forwardRef(function Meeting(
  { meetingListLength, meeting, index },
  ref
) {
  if (meetingListLength - 1 === index) {
    return (
      <MeetingContainer ref={ref}>
        <div className="text-container">
          <div className="meeting-title">{meeting.title}</div>
          <div className="tag-container">
            <div className="tag">#{meeting.tag[0]}</div>
            <div className="tag">#{meeting.tag[1]}</div>
          </div>
        </div>
        <img
          className="dot"
          src={meeting.isLive ? greenDot : redDot}
          alt="meeting-not-ready-icon"
        />
      </MeetingContainer>
    );
  }

  return (
    <MeetingContainer>
      <div className="text-container">
        <div className="meeting-title">{meeting.title}</div>
        <div className="tag-container">
          <div className="tag">#{meeting.tag[0]}</div>
          <div className="tag">#{meeting.tag[1]}</div>
        </div>
      </div>
      <img
        className="dot"
        src={meeting.isLive ? greenDot : redDot}
        alt="meeting-not-ready-icon"
      />
    </MeetingContainer>
  );
});

Meeting.propTypes = {
  meetingListLength: PropTypes.number.isRequired,
  meeting: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    tag: PropTypes.arrayOf(PropTypes.string),
    isLive: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Meeting;
