import PropTypes from "prop-types";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import greenDot from "../../images/greenDot.png";
import redDot from "../../images/redDot.png";

const MeetingContainer = styled.li`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: calc(100% - 1rem);
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: 1rem;
  cursor: pointer;
  transition: border 0.4s;
  border-left: ${(props) =>
    props.isMeetingSelected ? "7px solid black" : "none"};

  padding: 0.5rem;

  .meeting-title {
    font-size: 2rem;
    font-weight: bold;
  }

  .tag-container {
    display: flex;
  }

  .text-container {
    width: 100%;
    transition: all 0.6s;
    background-color: ${(props) =>
      props.isMeetingSelected ? COLOR.LIGHT_GREY : "none"};
  }

  .meeting-title {
    width: 330px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tag {
    margin-right: 1rem;
    font-size: 1.2rem;
    white-space: pre;
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMeetingSelected = pathname.split("/")[3] === meeting._id;

  function handleMeetingClick() {
    navigate(`meeting/${meeting._id}`);
  }

  if (meetingListLength - 1 === index) {
    return (
      <MeetingContainer
        ref={ref}
        onClick={handleMeetingClick}
        isMeetingSelected={isMeetingSelected}
      >
        <div className="text-container">
          <div className="meeting-title">{meeting.title}</div>
          <div className="tag-container">
            <div className="tag">
              {meeting.tag[0].length ? "#" + meeting.tag[0] : " "}
            </div>
            <div className="tag">
              {meeting.tag[1].length ? "#" + meeting.tag[1] : " "}
            </div>
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
    <MeetingContainer
      onClick={handleMeetingClick}
      isMeetingSelected={isMeetingSelected}
    >
      <div className="text-container">
        <div className="meeting-title">{meeting.title}</div>
        <div className="tag-container">
          <div className="tag">
            {meeting.tag[0].length ? "#" + meeting.tag[0] : " "}
          </div>
          <div className="tag">
            {meeting.tag[1].length ? "#" + meeting.tag[1] : " "}
          </div>
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
