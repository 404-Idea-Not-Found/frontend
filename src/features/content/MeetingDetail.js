import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import { selectUserId } from "../login/selectors";

const MeetingDetailContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;

  .meeting-title {
    margin: 1rem 0;
    font-size: 3rem;
  }

  .meeting-time,
  .number-of-recruitment {
    margin: 1rem 0;
    font-size: 3rem;
  }

  .meeting-description {
    padding: 1rem 5rem;
    font-size: 1.5rem;
  }

  .meeting-started {
    animation: 1s linear 0s infinite alternate glow;
  }

  .reserve-button,
  .reserve-cancel-button,
  .enter-meeting-button {
    font-size: 3rem;
    padding: 1rem 1rem 0.7rem 1rem;
    font-weight: bold;
    border: none;
    background-color: ${COLOR.CYAN};
    cursor: pointer;
    transition: all 0.3s;
  }

  .reserve-cancel-button {
    background-color: ${COLOR.SALMON};
  }

  .enter-meeting-button {
    background-color: ${COLOR.BRIGHT_GREEN};
  }

  button:hover {
    opacity: 0.3;
  }

  @keyframes glow {
    from {
      color: ${COLOR.BRIGHT_GREEN};
    }
    to {
      color: white;
    }
  }
`;

function MeetingDetail({ meeting }) {
  const formattedStartTime = dayjs(meeting.startTime).format(
    "YYYY-MM-DD HH:mm"
  );
  const userId = useSelector(selectUserId);
  const isReserved = meeting.reservation.includes(userId);

  return (
    <MeetingDetailContainer>
      <h1 className="meeting-title">{meeting.title}</h1>
      {!meeting.isLive && (
        <h2 className="meeting-time">미팅시작시간: {formattedStartTime}</h2>
      )}
      {meeting.isLive && (
        <h2 className="meeting-time">
          미팅시작시간: <span className="meeting-started">현재 진행중!</span>
        </h2>
      )}
      <h2 className="number-of-recruitment">
        모집인원: {meeting.recruitmentNumber}
      </h2>
      <p className="meeting-description">{meeting.description}</p>
      {!isReserved && !meeting.isLive && (
        <button className="reserve-button" type="button">
          미팅 참여 예약
        </button>
      )}
      {isReserved && !meeting.isLive && (
        <button className="reserve-cancel-button" type="button">
          예약 취소
        </button>
      )}
      {meeting.isLive && (
        <button className="enter-meeting-button" type="button">
          참여하기
        </button>
      )}
    </MeetingDetailContainer>
  );
}

MeetingDetail.propTypes = {
  meeting: PropTypes.shape({
    title: PropTypes.string,
    startTime: PropTypes.string,
    recruitmentNumber: PropTypes.number,
    description: PropTypes.string,
    reservation: PropTypes.arrayOf(PropTypes.string),
    isLive: PropTypes.bool.isRequired,
  }).isRequired,
};

export default MeetingDetail;
