/* eslint-disable react/forbid-prop-types */
import PropTypes, { arrayOf } from "prop-types";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";

const ControlPanelContainer = styled.div`
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

    button {
      margin: 0 0.3rem;
      width: 30%;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover {
      opacity: 0.3;
    }
  }

  .paint-request-button {
    background-color: ${COLOR.LEMON};
  }

  .speak-request-button {
    background-color: ${COLOR.CYAN};
  }

  .recruit-request-button {
    background-color: ${COLOR.BRIGHT_GREEN};
  }

  .close-meeting-button {
    width: 30%;
    font-weight: bold;
    background-color: ${COLOR.SALMON};
    border: none;
    cursor: pointer;
    transition: all 0.3s;
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

  ul {
    width: 100%;
  }
`;

function ControlPanel({
  isOwner,
  isDrawing,
  isSpeaking,
  isRecruit,
  painterList,
  speakerList,
  recruitmentList,
}) {
  return (
    <ControlPanelContainer>
      {isOwner && (
        <div className="owner-control">
          <div className="painter-control list-container">
            <div className="control-title painter-control-title">
              그리는 사람
            </div>
            <ul>
              {painterList.map(() => (
                <li>test</li>
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
          <button className="paint-request-button" type="button">
            {isDrawing ? "그리는 중" : "그리고 싶어요"}
          </button>
          <button className="speak-request-button" type="button">
            {isSpeaking ? "말하는 중" : "말하고 싶어요"}
          </button>
          <button className="recruit-request-button" type="button">
            {isRecruit ? "동료가 되었어요!" : "동료가 될게요"}
          </button>
        </div>
      )}
    </ControlPanelContainer>
  );
}

ControlPanel.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  isDrawing: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  isRecruit: PropTypes.bool.isRequired,
  painterList: arrayOf(PropTypes.object),
  speakerList: arrayOf(PropTypes.object),
  recruitmentList: arrayOf(PropTypes.object),
};

ControlPanel.defaultProps = {
  painterList: [],
  speakerList: [],
  recruitmentList: [],
};

export default ControlPanel;
