import PropTypes from "prop-types";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import greenDot from "../../images/greenDot.png";
import redDot from "../../images/redDot.png";
import yellowDot from "../../images/yellowDot.png";

const MeetingContainer = styled.li`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  padding-left: 1rem;
  cursor: pointer;
  border-left: ${(props) =>
    props.isMeetingSelected ? "7px solid black" : "none"};
  transition: all 0.4s;

  .meeting-title {
    font-size: 2rem;
    font-weight: bold;

    @media (max-width: 1440px) {
      font-size: 1.7rem;
    }
  }

  .tag-container {
    display: flex;
    align-items: center;
  }

  .text-container {
    border-radius: 7px;
    box-sizing: border-box;
    width: 93%;
    height: 100%;
    transition: all 0.6s;
    padding: 0.3rem;
    background-color: ${(props) =>
      props.isMeetingSelected ? COLOR.LIGHT_GREY : "none"};
  }

  .meeting-title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tag {
    max-width: 8rem;
    margin-right: 1rem;
    font-size: 1.2rem;
    white-space: pre;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media (max-width: 1440px) {
      font-size: 1.1rem;
    }
  }

  .image-container {
    margin-left: auto;
  }

  .dot {
    display: block;
    width: 1.5rem;
    padding: 0.2rem;
  }

  &:hover {
    opacity: 0.3;
  }

  @media (max-width: 1440px) {
    font-size: 1.7rem;
    margin-bottom: 1.5rem;
  }
`;

const Meeting = React.forwardRef(function Meeting(
  { meetingListLength, meeting, index },
  ref
) {
  let signalImage = redDot;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMeetingSelected = pathname.split("/")[4] === meeting._id;
  const isMeetingWaitingOwner = new Date() - new Date(meeting.startTime) > 0;

  if (isMeetingWaitingOwner) {
    signalImage = yellowDot;
  }

  if (meeting.isLive) {
    signalImage = greenDot;
  }

  function handleMeetingClick() {
    navigate(`meeting/detail/${meeting._id}`);
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
            <div className="image-container">
              <img
                className="dot"
                src={meeting.isLive ? greenDot : redDot}
                alt="meeting not ready icon"
              />
            </div>
          </div>
        </div>
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
          <div className="image-container">
            <img className="dot" src={signalImage} alt="meeting-ready-icon" />
          </div>
        </div>
      </div>
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
    startTime: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Meeting;
