import React, { useState, useRef, useContext, useCallback } from "react";
import TimeScaleContext from "../../timeScaleContext";

const Handle = props => {
  return (
    <g
      style={{ transform: `translateX(${props.x}px)` }}
      className="slider-handle"
      {...props}
    >
      <rect className="slider-handle-line" />
      <rect className="slider-handle-button" />
    </g>
  );
};
const Slider = ({ width }) => {
  const backgroundRef = useRef();
  const [dragging, setDragging] = useState(false);
  const { startX, endX, onStartHandleMoved, onEndHandleMoved } = useContext(TimeScaleContext);
  const mouseOutListener = useCallback(() => {
    setDragging(false);
  }, []);

  const mouseUpListener = useCallback(() => {
    setDragging(false);
  }, []);

  const mouseDownListener = useCallback(
    e => {
      setDragging(true);
      // get the closest handle to the current position
      const {
        x: sliderClientX
      } = backgroundRef.current.getBoundingClientRect();
      const currentPosX = e.clientX - sliderClientX;
      if (endX - currentPosX > currentPosX - startX) {
        onStartHandleMoved(currentPosX);
      } else {
        onEndHandleMoved(currentPosX);
      }
    },
    [endX, onEndHandleMoved, onStartHandleMoved, startX]
  );

  const mouseMoveListener = useCallback(
    e => {
      if (dragging) {
        // get the closest handle to the current position
        const {
          x: sliderClientX
        } = backgroundRef.current.getBoundingClientRect();
        const currentPosX = e.clientX - sliderClientX;
        if (endX - currentPosX > currentPosX - startX) {
          onStartHandleMoved(currentPosX);
        } else {
          onEndHandleMoved(currentPosX);
        }
      }
    },
    [dragging, endX, startX, onStartHandleMoved, onEndHandleMoved]
  );

  return (
    <g className="slider">
      <rect ref={backgroundRef} className="slider-background" width={width} />
      <rect
        className="slider-active-area"
        width={(endX - startX) || 0}
        style={{ transform: `translateX(${startX}px)` }}
      />
      <Handle x={startX} />
      <Handle x={endX} />
      <rect
        width={width}
        className="slider-mouse-move-detector"
        onMouseOut={mouseOutListener}
        onMouseUp={mouseUpListener}
        onMouseDown={mouseDownListener}
        onMouseMove={mouseMoveListener}
      />
    </g>
  );
};

export default Slider;
