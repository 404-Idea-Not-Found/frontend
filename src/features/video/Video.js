/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
import Peer from "simple-peer";
import io from "socket.io-client";
import styled from "styled-components";

import sleep from "../../common/util/sleep";
// import {
//   createAttachSocketEventListenerAction,
//   createEmitSocketEventAction,
//   createRemoveSocketEventListenerAction,
// } from "../LiveMeeting/liveMeetingSagas";

const StyledVideo = styled.video`
  position: absolute;
  z-index: 3;
  border: 1px solid black;
  background-color: white;
  width: 250px;
  height: 250px;
`;

function TestVideo({ isOwner, meetingId }) {
  const [stream, setStream] = useState();
  const [isCallincomming, setIsCallincomming] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [caller, setCaller] = useState();

  const userVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(
      process.env.REACT_APP_SERVER_URL +
        `/video?isOwner=${isOwner}&room=${meetingId}`
    );

    socket.current.on("requestVideo", ({ from, signal }) => {
      setCallerSignal(signal);
      setCaller(from);
      setIsCallincomming(true);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    async function apiWrapper() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(stream);

      if (isOwner) {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      }
    }

    apiWrapper();
  }, []);

  useEffect(() => {
    if (isCallincomming) {
      sleep(3000);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.current.emit("acceptCall", { signal, caller });
      });

      peer.signal(callerSignal);

      return () => {
        peer.destroy();
        stream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [caller, callerSignal, isCallincomming, stream]);

  useEffect(() => {
    if (!isOwner && socket.current?.connected && stream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "turn:numb.viagenie.ca",
              credential: "muazkh",
              username: "webrtc@live.com",
            },
          ],
        },
        stream,
      });

      peer.on("signal", (signal) => {
        socket.current.emit("requestVideo", signal);
      });

      peer.on("stream", (stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

      socket.current.on("callAccepted", (signal) => {
        peer.signal(signal);
      });

      return () => {
        peer.destroy();
        stream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [isOwner, socket.current?.connected, stream]);

  return <StyledVideo playsInline autoPlay muted ref={userVideo} />;
}

TestVideo.propTypes = {
  meetingId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default TestVideo;
