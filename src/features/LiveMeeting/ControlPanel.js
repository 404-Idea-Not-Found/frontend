/* eslint-disable react/forbid-prop-types */
import PropTypes, { arrayOf } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import { selectUsername } from "../login/selectors";
import { createEmitSocketEventAction } from "./liveMeetingSagas";
import { painterAllowed, painterRemoved } from "./LiveMeetingSlice";
import { selectIsWhiteboardAllowed, selectPainterList } from "./selector";

const ControlPanelContainer = styled.div`
  flex: 1;
  display: flex;

  .owner-control {
    width: 80%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    margin: 2rem auto;
  }

  .participant-control {
    width: 80%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    margin: 2rem auto;
  }

  .paint-request-button {
    height: 30%;
    background-color: ${COLOR.LEMON};
  }

  .speak-request-button {
    height: 30%;
    background-color: ${COLOR.CYAN};
  }

  .recruit-request-button {
    height: 30%;
    background-color: ${COLOR.BRIGHT_GREEN};
  }

  .close-meeting-button {
    font-size: 1.2rem;
    width: 30%;
    height: 30%;
    font-weight: bold;
    background-color: ${COLOR.SALMON};
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    align-self: center;
  }

  .close-meeting-button:hover {
    opacity: 0.3;
  }

  .list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0.3rem;
    width: 100%;
  }

  .control-title {
    font-size: 1.2rem;
    text-align: center;
    width: 100%;
  }

  .painter-control-title {
    background-color: ${COLOR.LEMON};
  }

  .speaker-control-title {
    background-color: ${COLOR.CYAN};
  }

  .recruit-control-title {
    background-color: ${COLOR.BRIGHT_GREEN};
  }

  .painter-list {
    .list-wrapper {
      display: flex;
      justify-content: space-around;
    }
  }

  ul {
    height: 14vh;
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    overflow: auto;
  }
`;

const AllowButton = styled.button`
  font-weight: bold;
  border: none;
  background-color: ${(props) =>
    props.isAllowed ? "red" : COLOR.BRIGHT_GREEN};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.3;
  }
`;

const RequestButton = styled.button`
  margin: 0 0.3rem;
  width: 30%;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  cursor: ${(props) => (props.isWhiteBoardAllowed ? "auto" : "pointer")};
  transition: all 0.3s;
  animation: ${(props) =>
    props.isWhiteBoardAllowed ? "glow 0.5s linear alternate infinite" : "none"};
  box-shadow: ${(props) =>
    props.isWhiteBoardAllowed ? "4px 4px 5px black" : "none"};

  &:hover {
    opacity: 0.3;
  }

  @keyframes glow {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

function ControlPanel({
  meetingId,
  isOwner,
  isSpeaking,
  isRecruit,
  speakerList,
  recruitmentList,
}) {
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const painterList = useSelector(selectPainterList);
  const isWhiteBoardAllowed = useSelector(selectIsWhiteboardAllowed);

  function handlePaintRequest() {
    dispatch(
      createEmitSocketEventAction("paintRequest", {
        meetingId,
        username: username || "stranger",
      })
    );
  }

  function handlePaintAllowClick(socketId) {
    dispatch(createEmitSocketEventAction("allowPainter", { socketId }));
    dispatch(painterAllowed(socketId));
  }

  function handlePaintDisallowClick(socketId) {
    dispatch(createEmitSocketEventAction("disallowPainter", { socketId }));
    dispatch(painterRemoved(socketId));
  }

  return (
    <ControlPanelContainer>
      {isOwner && (
        <div className="owner-control">
          <div className="painter-control list-container">
            <div className="control-title painter-control-title">
              그리는 사람
            </div>
            <ul className="painter-list">
              {Object.entries(painterList).map(([socketId, painter]) => (
                <div className="list-wrapper" key={socketId}>
                  <li>
                    <div>{painter.username}</div>
                  </li>
                  <AllowButton
                    type="button"
                    className="allow-button"
                    isAllowed={painter.allowed}
                    onClick={() => {
                      if (!painter.allowed) handlePaintAllowClick(socketId);
                      if (painter.allowed) handlePaintDisallowClick(socketId);
                    }}
                  >
                    {painter.allowed ? "그만 그려!" : "허락하기"}
                  </AllowButton>
                </div>
              ))}
            </ul>
          </div>
          <div className="speaker-control list-container">
            <div className="control-title speaker-control-title">
              말하는 사람
            </div>
            <ul>
              {speakerList.map(() => (
                <li>test</li>
              ))}
            </ul>
          </div>
          <div className="recruit-control list-container">
            <div className="control-title recruit-control-title">모인 동료</div>
            <ul>
              {recruitmentList.map(() => (
                <li>test</li>
              ))}
            </ul>
          </div>
          <button className="close-meeting-button" type="button">
            미팅종료
          </button>
        </div>
      )}
      {!isOwner && (
        <div className="participant-control">
          <RequestButton
            className="paint-request-button"
            type="button"
            onClick={handlePaintRequest}
            isWhiteBoardAllowed={isWhiteBoardAllowed}
            disabled={isWhiteBoardAllowed}
          >
            {isWhiteBoardAllowed ? "그리는 중" : "그리고 싶어요"}
          </RequestButton>
          <RequestButton className="speak-request-button" type="button">
            {isSpeaking ? "말하는 중" : "말하고 싶어요"}
          </RequestButton>
          <RequestButton className="recruit-request-button" type="button">
            {isRecruit ? "동료가 되었어요!" : "동료가 될게요"}
          </RequestButton>
        </div>
      )}
    </ControlPanelContainer>
  );
}

ControlPanel.propTypes = {
  meetingId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  isRecruit: PropTypes.bool.isRequired,
  speakerList: arrayOf(PropTypes.object),
  recruitmentList: arrayOf(PropTypes.object),
};

ControlPanel.defaultProps = {
  speakerList: [],
  recruitmentList: [],
};

export default ControlPanel;
