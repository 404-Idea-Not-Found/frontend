import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { COLOR } from "../util/constants";

const ModalWrapper = styled.div`
  z-index: 3;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 50vh;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 2rem;
    background-color: black;

    .close-button {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      margin-right: 1rem;
      cursor: pointer;
    }
  }

  .modal-body {
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
    text-align: center;
    height: calc(100% - 2rem);
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    overflow: auto;
  }
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${COLOR.GREY};
  z-index: 2;
  cursor: default;
`;

const ModalContentsContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  h2 {
    margin: 0;
  }

  button {
    font-size: 2rem;
    font-weight: bold;
    border: none;
    background-color: ${COLOR.SALMON};
    padding: 0.3rem 1rem;
    cursor: pointer;
  }
`;

const ModalAndBackdropContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

function Modal({ children, onModalClose }) {
  const $rootElement = document.querySelector("#root");

  function handleCloseClick() {
    onModalClose();
  }

  return ReactDOM.createPortal(
    <ModalAndBackdropContainer>
      <Backdrop onClick={handleCloseClick} />
      <ModalWrapper>
        <div className="header">
          <div
            className="close-button"
            onClick={handleCloseClick}
            onKeyDown={handleCloseClick}
            role="button"
            tabIndex={0}
          >
            x
          </div>
        </div>
        <div className="modal-body">
          <ModalContentsContainer>{children}</ModalContentsContainer>
        </div>
      </ModalWrapper>
    </ModalAndBackdropContainer>,
    $rootElement
  );
}

Modal.propTypes = {
  onModalClose: PropTypes.func,
};

export default Modal;
