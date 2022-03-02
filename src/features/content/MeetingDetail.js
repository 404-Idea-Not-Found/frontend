import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import cancelMeetingReservation from "../../common/api/cancelMeetingReservation";
import reserveMeeting from "../../common/api/reserveMeeting";
import Modal from "../../common/components/Modal";
import { COLOR } from "../../common/util/constants";
import getErrorMessage from "../../common/util/getErrorMessage";
import { selectIsLoggedIn, selectUserEmail } from "../login/selectors";

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
      color: ${COLOR.GREEN};
    }
    to {
      color: white;
    }
  }
`;

function MeetingDetail({ meeting }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContents, setModalContents] = useState(null);

  const navigate = useNavigate();
  const userEmail = useSelector(selectUserEmail);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isReserved = meeting.reservation.includes(userEmail);
  const formattedStartTime = dayjs(meeting.startTime).format(
    "YYYY-MM-DD HH:mm"
  );

  async function handleMeetingReserveClick() {
    if (!isLoggedIn) {
      setShowModal(true);
      setModalContents(<h2>로그인이 필요합니다!</h2>);
    }

    try {
      await reserveMeeting(meeting._id);

      setShowModal(true);
      setModalContents(
        <>
          <h2>미팅 예약에 성공했습니다!</h2>
          <p>미팅 시작시간이 되면 알림메일이 발송됩니다.</p>
        </>
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      setShowModal(true);
      setModalContents(
        <>
          <h2>미팅 예약에 실패 했습니다!</h2>
          <p>잠시후 다시 시도해 주세요</p>
          <p>{errorMessage}</p>
        </>
      );
    }
  }

  async function handleReservationCancelClick() {
    if (!isLoggedIn) {
      setShowModal(true);
      setModalContents(<h2>로그인이 필요합니다!</h2>);
    }

    try {
      await cancelMeetingReservation(meeting._id);

      setShowModal(true);
      setModalContents(<h2>미팅 예약을 취소 했습니다...</h2>);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      setShowModal(true);
      setModalContents(
        <>
          <h2>미팅 예약에 실패 했습니다!</h2>
          <p>잠시후 다시 시도해 주세요</p>
          <p>{errorMessage}</p>
        </>
      );
    }
  }

  function handleModalCloseClick() {
    setShowModal(false);
    setModalContents(null);
    navigate("/main");
  }

  return (
    <>
      {showModal && (
        <Modal onModalCloseClick={handleModalCloseClick}>{modalContents}</Modal>
      )}
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
          <button
            className="reserve-button"
            type="button"
            onClick={handleMeetingReserveClick}
          >
            미팅 참여 예약
          </button>
        )}
        {isReserved && !meeting.isLive && (
          <button
            className="reserve-cancel-button"
            type="button"
            onClick={handleReservationCancelClick}
          >
            예약 취소
          </button>
        )}
        {meeting.isLive && (
          <button className="enter-meeting-button" type="button">
            참여하기
          </button>
        )}
      </MeetingDetailContainer>
    </>
  );
}

MeetingDetail.propTypes = {
  meeting: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    startTime: PropTypes.string,
    recruitmentNumber: PropTypes.number,
    description: PropTypes.string,
    reservation: PropTypes.arrayOf(PropTypes.string),
    isLive: PropTypes.bool.isRequired,
  }).isRequired,
};

export default MeetingDetail;
