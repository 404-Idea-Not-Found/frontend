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

    @media (max-width: 1440px) {
      font-size: 2.5rem;
    }
  }

  .meeting-time,
  .number-of-recruitment {
    margin: 1rem 0;
    font-size: 3rem;

    @media (max-width: 1440px) {
      font-size: 2.5rem;
    }
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
    border-radius: 7px;
    font-size: 3rem;
    padding: 1rem 1rem 0.7rem 1rem;
    font-weight: bold;
    border: none;
    background-color: ${COLOR.CYAN};
    cursor: pointer;

    @media (max-width: 1440px) {
      font-size: 2rem;
    }
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
  const [ownerChecked, setOwnerChecked] = useState(false);

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
    } else {
      setOwnerChecked(true);
    }
  }, []);

  async function handleMeetingReserveClick() {
    if (!isLoggedIn) {
      setShowModal(true);
      setModalContents(<h2>???????????? ???????????????!</h2>);

      return;
    }

    try {
      await reserveMeeting(meeting._id);

      setShowModal(true);
      setModalContents(
        <>
          <h2>?????? ????????? ??????????????????!</h2>
          <p>?????? ??????????????? ?????? ??????????????? ???????????????.</p>
        </>
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      setShowModal(true);
      setModalContents(
        <>
          <h2>?????? ????????? ?????? ????????????!</h2>
          <p>????????? ?????? ????????? ?????????</p>
          <p>{errorMessage}</p>
        </>
      );
    }
  }

  async function handleReservationCancelClick() {
    if (!isLoggedIn) {
      setShowModal(true);
      setModalContents(<h2>???????????? ???????????????!</h2>);

      return;
    }

    try {
      await cancelMeetingReservation(meeting._id);

      setShowModal(true);
      setModalContents(<h2>?????? ????????? ?????? ????????????...</h2>);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      setShowModal(true);
      setModalContents(
        <>
          <h2>?????? ????????? ?????? ????????????!</h2>
          <p>????????? ?????? ????????? ?????????</p>
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
      {ownerChecked && (
        <MeetingDetailContainer>
          <h1 className="meeting-title">{meeting.title}</h1>
          {!meeting.isLive && !isMeetingWaitingOwner && (
            <h2 className="meeting-time">??????????????????: {formattedStartTime}</h2>
          )}
          {meeting.isLive && (
            <h2 className="meeting-time">
              ??????????????????:{" "}
              <span className="meeting-started">?????? ?????????!</span>
            </h2>
          )}
          {isMeetingWaitingOwner && !meeting.isEnd && (
            <>
              <h2 className="meeting-time">
                ??????????????????:{" "}
                <span className="meeting-waiting">{formattedStartTime}</span>
              </h2>
              <h2 className="meeting-waiting">
                <span className="meeting-waiting">
                  ???????????? ????????? ??????????????? ???????????? ????????????!
                </span>
              </h2>
            </>
          )}
          {meeting.isEnd && (
            <h2 className="meeting-time">
              ??????????????????:{" "}
              <span className="meeting-end">{formattedStartTime}</span>
            </h2>
          )}
          <h2 className="number-of-recruitment">
            ????????????: {meeting.recruitmentNumber}
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
                ?????? ?????? ??????
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
                ?????? ??????
              </button>
            )}
          {meeting.isLive && !meeting.isEnd && (
            <button
              className="enter-meeting-button"
              type="button"
              onClick={handleEnterMeetingClick}
            >
              ????????????
            </button>
          )}
          {isMeetingWaitingOwner && !meeting.isEnd && (
            <button
              className="wait-meeting-button"
              type="button"
              onClick={handleEnterMeetingClick}
            >
              ????????? ????????????
            </button>
          )}
          {meeting.isEnd && (
            <button
              className="terminated-meeting-button"
              type="button"
              disabled={true}
            >
              ????????? ?????? ?????????
            </button>
          )}
        </MeetingDetailContainer>
      )}
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
