import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import expandButton from "../../images/expandButton.png";
import {
  createCancelMeetingAction,
  createCancelReservationAction,
} from "./myPageSagas";

const MyMeetingCardContainer = styled.div`
  margin: auto;
  width: 93%;
  background-color: ${COLOR.LIGHTER_GREY};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const MyMeetingCardHeader = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLOR.MIDDIUM_GREY};
  border: 1px solid black;

  .meeting-title {
    flex: 2;
    margin-left: 1rem;
    font-weight: bold;
  }

  .expand-button {
    margin: 0.4rem;
    transform: ${(props) => (props.expand ? "rotate(0)" : "rotate(90deg)")};
    transition: all 0.3s;

    img {
      width: 1.2rem;
    }
  }

  .meeting-date {
    display: flex;
    justify-content: center;
    width: 10rem;
    font-weight: bold;
  }

  .meeting-result {
    font-weight: bold;
    margin: 0 0.5rem;
    color: ${(props) => (props.isColleague ? COLOR.BRIGHT_GREEN : "red")};
  }

  .meeting-start-button {
    color: ${COLOR.BRIGHT_GREEN};
  }

  .reserved-meeting-button {
    color: red;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    font-weight: bold;
    margin: 0 0.5rem;
  }
`;

const MyMeetingCardContent = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  list-style-position: inside;
  height: ${(props) => (props.expand ? "12rem" : "0")};
  margin: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  .meeting-sub-title {
    display: inline-block;
    margin-left: 0.3rem;
    font-weight: bold;
    font-size: 1rem;
  }

  .meeting-description {
    display: flex;
    width: 85%;
    margin-top: 0.4rem;
    margin: 0.4rem 0 0.6rem 3rem;
  }

  .meeting-recruit-number {
    font-weight: bold;
  }

  .meeting-cancel-button {
    display: block;
    background-color: ${COLOR.GREY};
    border: none;
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    margin-left: auto;
    cursor: pointer;
  }

  .recruit-list {
    padding: 0;
    margin: 0.4rem 0 0.6rem 3rem;
  }

  li > div {
    margin: 0.4rem 0 0.6rem 3rem;
  }
`;

function MyMeetingCard({ meetingType, meeting }) {
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startDate = dayjs(meeting.startTime).format("YYYY-MM-DD HH:mm");
  const isColleague = !!meeting.colleague.length;
  const isMeetingStartTimeOver = new Date() - new Date(meeting.startTime) > 0;

  function expandClickHandler() {
    setExpand((state) => !state);
  }

  function handleMeetingStartButtonClick() {
    navigate(`/main/meeting/live/${meeting._id}`);
  }

  function handleMeetingCancelClick() {
    dispatch(createCancelMeetingAction(meeting._id));
  }

  function handleReservationCancelClick() {
    dispatch(createCancelReservationAction(meeting._id));
  }

  return (
    <MyMeetingCardContainer key={meeting._id}>
      <MyMeetingCardHeader
        expand={expand}
        isColleague={isColleague}
        isMeetingStartTimeOver={isMeetingStartTimeOver}
        isLive={meeting.isLive}
      >
        <div className="meeting-title">{meeting.title}</div>
        <div className="meeting-date">{startDate}</div>
        {meetingType === "진행 예정 미팅" && (
          <button
            className="meeting-start-button"
            type="button"
            onClick={handleMeetingStartButtonClick}
          >
            미팅시작
          </button>
        )}
        {meetingType === "지난 미팅" && (
          <div className="meeting-result">
            {isColleague ? "모집 성공" : "모집 실패"}
          </div>
        )}
        {meetingType === "예약한 미팅" && (
          <button
            type="button"
            className="reserved-meeting-button"
            onClick={handleReservationCancelClick}
          >
            예약취소
          </button>
        )}
        <button
          type="button"
          className="expand-button"
          onClick={expandClickHandler}
        >
          <img src={expandButton} alt="expand button" />
        </button>
      </MyMeetingCardHeader>
      <MyMeetingCardContent expand={expand}>
        <li>
          <span className="meeting-sub-title">미팅설명</span>
          <div className="meeting-description">{meeting.description}</div>
        </li>
        <li>
          <span className="meeting-sub-title">모집인원</span>
          <div className="meeting-recruit-number">
            {meeting.recruitmentNumber}
          </div>
        </li>
        {((meetingType === "지난 미팅" && !!meeting.colleague.length) ||
          meetingType === "참여중인 프로젝트") && (
          <li>
            <span className="meeting-sub-title">동료 연락처</span>
            <ul className="recruit-list">
              {meeting.colleague.map((colleague) => (
                <li
                  key={colleague.email}
                >{`${colleague.username}: ${colleague.email}`}</li>
              ))}
            </ul>
          </li>
        )}
        {meetingType === "진행 예정 미팅" && (
          <button
            className="meeting-cancel-button"
            type="button"
            onClick={handleMeetingCancelClick}
          >
            미팅 취소
          </button>
        )}
      </MyMeetingCardContent>
    </MyMeetingCardContainer>
  );
}

MyMeetingCard.propTypes = {
  meetingType: PropTypes.string.isRequired,
  meeting: PropTypes.shape({
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
  }).isRequired,
};

export default MyMeetingCard;
