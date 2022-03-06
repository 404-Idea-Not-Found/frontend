/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Peer from "simple-peer";
import styled from "styled-components";

import {
  createAttachSocketEventListenerAction,
  createEmitSocketEventAction,
  createRemoveSocketEventListenerAction,
} from "../LiveMeeting/liveMeetingSagas";

const StyledVideo = styled.video`
  position: absolute;
  z-index: 3;
  border: 1px solid black;
  background-color: white;
  width: 250px;
  height: 250px;
`;

function Video({ isOwner }) {
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const dispatch = useDispatch();
  // const [peer, setPeer] = useState();

  useEffect(() => {
    if (isOwner) {
      let ownerStream;
      const apiWrapper = async () => {
        try {
          ownerStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
            frameRate: { max: 30 },
          });
          setStream(ownerStream);
          console.log(ownerStream);
          if (videoRef.current) videoRef.current.srcObject = ownerStream;
        } catch (error) {
          console.dir(error, "error...");
        }
      };

      apiWrapper();

      return () => {
        ownerStream.getTracks().forEach((track) => track.stop());
      };
    }
  }, []);

  useEffect(() => {
    if (isOwner && stream) {
      let peer;

      dispatch(
        createAttachSocketEventListenerAction(
          "ownerVideoRequested",
          ({ requestorSignal, requestorSocketId }) => {
            console.log(
              "ownerVideoRequested",
              requestorSignal,
              requestorSocketId
            );
            console.log(stream, "stream in OVR");
            peer = new Peer({
              initiator: false,
              trickle: false,
              stream,
            });

            peer.on("signal", (signal) => {
              dispatch(
                createEmitSocketEventAction("acceptOwnerVideoRequest", {
                  signal,
                  requestorSocketId,
                })
              );
            });

            peer.on("stream", (stream) => {
              console.log(stream, "participant's stream!");
            });

            peer.on("error", (error) => {
              console.dir(error);
            });

            peer.signal(requestorSignal);
          }
        )
      );

      return () => {
        dispatch(
          createRemoveSocketEventListenerAction("ownerVideoRequestAccepted")
        );
        peer.destroy();
      };
    }
  }, [stream]);

  // request owner's video stream
  useEffect(() => {
    if (!isOwner) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "stun:stun.stunprotocol.org",
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "404IdeaNotFound404@gmail.com",
              credential: "404turn404",
            },
          ],
        },
      });

      peer.on("signal", (signal) => {
        console.log("test!");
        dispatch(createEmitSocketEventAction("requestOwnerVideo", signal));
      });

      peer.on("stream", (stream) => {
        console.log("stream from owner!", stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

      peer.on("error", (error) => {
        console.dir(error);
      });

      dispatch(
        createAttachSocketEventListenerAction(
          "ownerVideoRequestAccepted",
          (signal) => {
            console.log("ownerVideoRequestAccepted", signal);
            peer.signal(signal);
          }
        )
      );

      return () => {
        dispatch(
          createRemoveSocketEventListenerAction("ownerVideoRequestAccepted")
        );
        peer.destroy();
      };
    }
  }, []);

  return <StyledVideo autoPlay playsInline ref={videoRef} />;
}

Video.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default Video;
