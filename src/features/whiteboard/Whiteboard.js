/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { COLOR } from "../../common/util/constants";
import debounce from "../../common/util/debounce";
import throttle from "../../common/util/throttle";
import {
  createAttachSocketEventListenerAction,
  createEmitSocketEventAction,
  createRemoveSocketEventListenerAction,
} from "../LiveMeeting/liveMeetingSagas";
import { selectIsWhiteboardAllowed } from "../LiveMeeting/selector";

const StyledCanvas = styled.canvas`
  margin: 0 auto;
  width: ${window.innerWidth * 0.5};
  height: ${window.innerHeight * 0.5};
  display: block;
  background-color: ${COLOR.LIGHT_GREY};
  pointer-events: ${(props) => (props.isWhiteboardAllowed ? "auto" : "none")};
`;

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${(props) => (props.isWhiteboardAllowed ? "default" : "not-allowed")};

  .button-container {
    display: flex;
    align-items: center;
  }

  button {
    border: none;
    display: block;
    width: 2rem;
    height: 2rem;
    margin: 0.5rem;
    background-color: black;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover {
    opacity: 0.3;
  }

  .erase-button {
    width: 4rem;
    display: block;
    background-color: white;
    border: 1px solid black;
    transition: all 0.3s;
  }

  .color-select-red {
    background-color: red;
  }

  .color-select-blue {
    background-color: blue;
  }

  .color-select-yellow {
    background-color: yellow;
  }
`;
function Whiteboard({ isOwner }) {
  const canvasRef = useRef();
  const drawingRef = useRef(false);
  const colorRef = useRef("black");
  const contextRef = useRef();
  const canvasPositionRef = useRef({});
  const xyRef = useRef({});
  const dispatch = useDispatch();
  const { meetingId } = useParams();
  const isWhiteboardAllowed = useSelector(selectIsWhiteboardAllowed);

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");

    setTimeout(() => {
      const { top, left } = canvasRef.current.getBoundingClientRect();

      canvasPositionRef.current.top = top;
      canvasPositionRef.current.left = left;

      dispatch(
        createAttachSocketEventListenerAction("drawing", onDrawingEvent)
      );
      dispatch(
        createAttachSocketEventListenerAction("clearCanvas", clearCanvas)
      );
    }, 1000);

    const debouncedResizeHandler = debounce(onResize, 150);

    window.addEventListener("resize", debouncedResizeHandler);
    window.addEventListener("scroll", debouncedResizeHandler);

    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
      window.removeEventListener("scroll", debouncedResizeHandler);
      dispatch(createRemoveSocketEventListenerAction("drawing"));
      dispatch(createRemoveSocketEventListenerAction("clearCanvas"));
    };
  }, []);

  function onMouseDown(event) {
    drawingRef.current = true;
    xyRef.current.x = event.clientX || event.touches.clientX;
    xyRef.current.y = event.clientY || event.touches.clientY;
  }

  function onMouseUp(event) {
    if (!drawingRef.current) {
      return;
    }
    drawingRef.current = false;
    drawLine(
      xyRef.current.x,
      xyRef.current.y,
      event.clientX || event.touches.clientX,
      event.clientY || event.touches.clientY,
      colorRef.current,
      true
    );
  }

  function onMouseMove(event) {
    if (!drawingRef.current) {
      return;
    }
    drawLine(
      xyRef.current.x,
      xyRef.current.y,
      event[0].clientX || event[0].touches[0].clientX,
      event[0].clientY || event[0].touches[0].clientY,
      colorRef.current,
      true
    );
    xyRef.current.x = event[0].clientX || event[0].touches[0].clientX;
    xyRef.current.y = event[0].clientY || event[0].touches[0].clientY;
  }

  function drawLine(
    x0,
    y0,
    x1,
    y1,
    color,
    emit,
    top = canvasPositionRef.current.top,
    left = canvasPositionRef.current.left
  ) {
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x0 - left, y0 - top);
    contextRef.current.lineTo(x1 - left, y1 - top);
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = 2;
    contextRef.current.stroke();
    contextRef.current.closePath();

    if (!emit) {
      return;
    }

    const pathData = {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color,
    };

    dispatch(
      createEmitSocketEventAction("drawing", { pathData, room: meetingId })
    );
  }

  function onDrawingEvent(pathData) {
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    drawLine(
      pathData.x0 * w,
      pathData.y0 * h,
      pathData.x1 * w,
      pathData.y1 * h,
      pathData.color,
      pathData.lineWidth
    );
  }

  function clearCanvas() {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }

  function handleClearCanvasEvent() {
    clearCanvas();
    dispatch(createEmitSocketEventAction("clearCanvas", { room: meetingId }));
  }

  function onResize() {
    const { top, left } = canvasRef.current.getBoundingClientRect();

    canvasPositionRef.current.top = top;
    canvasPositionRef.current.left = left;
  }

  return (
    <CanvasContainer isWhiteboardAllowed={isWhiteboardAllowed}>
      <div className="button-container">
        {isOwner && (
          <button
            className="erase-button"
            type="button"
            onClick={handleClearCanvasEvent}
          >
            지우기
          </button>
        )}
        <button
          className="color-select-black"
          type="button"
          onClick={() => {
            colorRef.current = "black";
          }}
        />
        <button
          className="color-select-red"
          type="button"
          onClick={() => {
            colorRef.current = "red";
          }}
        />
        <button
          className="color-select-blue"
          type="button"
          onClick={() => {
            colorRef.current = "blue";
          }}
        />
        <button
          className="color-select-yellow"
          type="button"
          onClick={() => {
            colorRef.current = "yellow";
          }}
        />
      </div>
      <div>
        <StyledCanvas
          width={window.innerWidth * 0.5 > 990 ? window.innerWidth * 0.5 : 990}
          height={window.innerHeight * 0.7}
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={throttle(onMouseMove, 10)}
          onMouseOut={onMouseUp}
          isWhiteboardAllowed={isWhiteboardAllowed}
        >
          drawings
        </StyledCanvas>
      </div>
    </CanvasContainer>
  );
}

Whiteboard.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default Whiteboard;