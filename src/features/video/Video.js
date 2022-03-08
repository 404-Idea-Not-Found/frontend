/* eslint-disable no-inner-declarations */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import styled from "styled-components";

import Loader from "../../common/components/Loader";
import Modal from "../../common/components/Modal";
import ICE_SERVERS from "../../common/config/webRTC";
import getErrorMessage from "../../common/util/getErrorMessage";
import {
  createAttachSocketEventListenerAction,
  createDisconnectSocketAction,
  createEmitSocketEventAction,
  createRemoveSocketEventListenerAction,
} from "../LiveMeeting/liveMeetingSagas";
import { selectIsLoading } from "../LiveMeeting/selectors";
import { sidebarRefreshed } from "../sidebar/SidebarSlice";

const StyledVideo = styled.video`
  background-color: white;
  width: 250px;
  height: 250px;
`;

const VideoContainer = styled.div`
  position: absolute;
  border: 1px solid black;
  background-color: white;
  width: 250px;
  height: 250px;

  .loader-container {
    display: flex;
    align-items: center;
    width: 250px;
    height: 250px;
    position: absolute;
    font-size: 2rem;
    font-weight: bold;
  }
`;

function Video({ isOwner }) {
  const [isCallincomming, setIsCallincomming] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSocketLoading = useSelector(selectIsLoading);
  const userVideo = useRef();
  const peerListRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    dispatch(sidebarRefreshed());
  }, []);

  useEffect(
    () => () => {
      dispatch(createRemoveSocketEventListenerAction("acceptCall"));
      peerListRef.current.forEach((peer) => {
        peer.destroy();
      });
      streamRef.current.getTracks().forEach((track) => track.stop());
    },
    []
  );

  useEffect(() => {
    if (!isSocketLoading) {
      dispatch(
        createAttachSocketEventListenerAction(
          "requestVideo",
          ({ from, signal }) => {
            setCallerSignal(signal);
            setCaller(from);
            setIsCallincomming(true);
          }
        )
      );

      return () => {
        dispatch(createRemoveSocketEventListenerAction("requestVideo"));
      };
    }
  }, [dispatch, isSocketLoading]);

  useEffect(() => {
    if (!isSocketLoading) {
      async function apiWrapper() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          streamRef.current = stream;

          if (isOwner) {
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
              setIsVideoLoading(false);
            }
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          setShowModal(true);
          setModalContent(
            <>
              <h2>카메라와 마이크에 접근할 수 없습니다. ⛔️</h2>
              <p>카메라와 마이크를 허용해주셔야 입장할 수 있습니다.</p>
              <p>{errorMessage}</p>
              <button type="button" onClick={modalCloseHandler}>
                메인으로
              </button>
            </>
          );
        }
      }
      apiWrapper();
    }
  }, [isOwner, isSocketLoading]);

  useEffect(() => {
    if (isCallincomming) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: streamRef.current,
      });

      peer.on("signal", (signal) => {
        dispatch(createEmitSocketEventAction("acceptCall", { signal, caller }));
      });

      peer.on("connect", () => {
        setIsCallincomming(false);
        setCallerSignal(null);
        setCaller(null);
        peerListRef.current = [...peerListRef.current, peer];
      });

      peer.signal(callerSignal);

      peer.on("error", (error) => {
        const errorMessage = getErrorMessage(error);
        setShowModal(true);
        setModalContent(
          <>
            <h2>알수없는 에러발생 🤪</h2>
            <p>아래의 메세지를 참조 해주세요</p>
            <p>{errorMessage}</p>
            <button type="button" onClick={modalCloseHandler}>
              메인으로
            </button>
          </>
        );
      });
    }
  }, [caller, callerSignal, dispatch, isCallincomming, streamRef.current]);

  useEffect(() => {
    if (!isOwner && !isSocketLoading && streamRef.current) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: ICE_SERVERS,
        stream: streamRef.current,
      });

      peer.on("signal", (signal) => {
        dispatch(createEmitSocketEventAction("requestVideo", signal));
      });

      peer.on("stream", (stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          setIsVideoLoading(false);
        }
      });

      peer.on("connect", () => {
        peerListRef.current = [...peerListRef.current, peer];
      });

      peer.on("error", (error) => {
        const errorMessage = getErrorMessage(error);
        setShowModal(true);
        setModalContent(
          <>
            <h2>알수없는 에러발생 🤪</h2>
            <p>아래의 메세지를 참조 해주세요</p>
            <p>{errorMessage}</p>
            <button type="button" onClick={modalCloseHandler}>
              메인으로
            </button>
          </>
        );
      });

      dispatch(
        createAttachSocketEventListenerAction("callAccepted", (signal) => {
          peer.signal(signal);
        })
      );

      return () => {
        dispatch(createRemoveSocketEventListenerAction("callAccepted"));
      };
    }
  }, [dispatch, isOwner, isSocketLoading, streamRef.current]);

  function modalCloseHandler() {
    navigate("/main");
    dispatch(createDisconnectSocketAction());
    dispatch(sidebarRefreshed());
  }

  return (
    <VideoContainer>
      {showModal && (
        <Modal onModalClose={modalCloseHandler}>{modalContent}</Modal>
      )}
      {isVideoLoading && (
        <div className="loader-container">
          <Loader />
        </div>
      )}
      <StyledVideo playsInline autoPlay muted ref={userVideo} />
    </VideoContainer>
  );
}

Video.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default Video;
