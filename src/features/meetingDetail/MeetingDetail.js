import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import cancelMeetingReservation from "../../common/api/cancelMeetingReservation";
import reserveMeeting from "../../common/api/reserveMeeting";
import Modal from "../../common/components/Modal";
import { COLOR } from "../../common/util/constants";
import getErrorMessage from "../../common/util/getErrorMessage";
import {
  selectIsLoggedIn,
  selectUserEmail,
  selectUserId,
} from "../login/selectors";

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
    animation: 0.7s linear 0s infinite alternate glow;
  }

  .meeting-waiting {
    background-color: ${COLOR.LEMON};
  }

  .meeting-end {
    background-color: ${COLOR.GREY};
  }

  .reserve-button,
  .reserve-cancel-button,
  .enter-meeting-button,
  .terminated-meeting-button,
  .wait-meeting-button {
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

  .wait-meeting-button {
    background-color: ${COLOR.LEMON};
  }

  .terminated-meeting-button {
    background-color: grey;
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
  const userId = useSelector(selectUserId);

  const isReserved = meeting.reservation.includes(userEmail);
  const isOwner = userId === meeting.owner;
  const isMeetingWaitingOwner =
    new Date() - new Date(meeting.startTime) > 0 && !meeting.isLive;
  const formattedStartTime = dayjs(meeting.startTime).format(
    "YYYY-MM-DD HH:mm"
  );

  useEffect(() => {
    if (isOwner && !meeting.isEnd) {
      navigate(`/main/meeting/live/${meeting._id}`);
    }
  }, []);

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

  function handleEnterMeetingClick() {
    navigate(`/main/meeting/live/${meeting._id}`);
  }

  function handleModalCloseClick() {
    setShowModal(false);
    setModalContents(null);
    navigate("/main");
  }

  return (
    <>
      {showModal && (
        <Modal onModalClose={handleModalCloseClick}>{modalContents}</Modal>
      )}
      <MeetingDetailContainer>
        <h1 className="meeting-title">{meeting.title}</h1>
        {!meeting.isLive && !isMeetingWaitingOwner && (
          <h2 className="meeting-time">미팅시작시간: {formattedStartTime}</h2>
        )}
        {meeting.isLive && (
          <h2 className="meeting-time">
            미팅시작시간: <span className="meeting-started">현재 진행중!</span>
          </h2>
        )}
        {isMeetingWaitingOwner && !meeting.isEnd && (
          <>
            <h2 className="meeting-time">
              미팅시작시간:{" "}
              <span className="meeting-waiting">{formattedStartTime}</span>
            </h2>
            <h2 className="meeting-waiting">
              <span className="meeting-waiting">
                주최자가 미팅을 시작하기를 기다리는 중입니다!
              </span>
            </h2>
          </>
        )}
        {meeting.isEnd && (
          <h2 className="meeting-time">
            미팅시작시간:{" "}
            <span className="meeting-end">{formattedStartTime}</span>
          </h2>
        )}
        <h2 className="number-of-recruitment">
          모집인원: {meeting.recruitmentNumber}
        </h2>
        <p className="meeting-description">{meeting.description}</p>
        {!isMeetingWaitingOwner &&
          !isOwner &&
          !isReserved &&
          !meeting.isLive &&
          !meeting.isEnd && (
            <button
              className="reserve-button"
              type="button"
              onClick={handleMeetingReserveClick}
            >
              미팅 참여 예약
            </button>
          )}
        {!isMeetingWaitingOwner &&
          isReserved &&
          !meeting.isLive &&
          !meeting.isEnd && (
            <button
              className="reserve-cancel-button"
              type="button"
              onClick={handleReservationCancelClick}
            >
              예약 취소
            </button>
          )}
        {meeting.isLive && !meeting.isEnd && (
          <button
            className="enter-meeting-button"
            type="button"
            onClick={handleEnterMeetingClick}
          >
            참여하기
          </button>
        )}
        {isMeetingWaitingOwner && !meeting.isEnd && (
          <button
            className="wait-meeting-button"
            type="button"
            onClick={handleEnterMeetingClick}
          >
            방에서 대기하기
          </button>
        )}
        {meeting.isEnd && (
          <button
            className="terminated-meeting-button"
            type="button"
            disabled={true}
          >
            종료된 미팅 입니다
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
    isEnd: PropTypes.bool.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
};

export default MeetingDetail;
