import React, { useState, useRef, useContext, useCallback } from "react";
import TimeScaleContext, { useFullTimeScale } from "../../timeScaleContext";

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
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(width);

  const timeScale = useFullTimeScale();
  const { setNewStartDate, setNewEndDate } = useContext(TimeScaleContext);

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
        setStartX(currentPosX);
        setNewStartDate(timeScale.invert(currentPosX));
      } else {
        setEndX(currentPosX);
        setNewEndDate(timeScale.invert(currentPosX));
      }
    },
    [endX, startX, setNewStartDate, timeScale, setNewEndDate]
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
          setStartX(currentPosX);
          setNewStartDate(timeScale.invert(currentPosX));
        } else {
          setEndX(currentPosX);
          setNewEndDate(timeScale.invert(currentPosX));
        }
      }
    },
    [dragging, endX, startX, setNewStartDate, timeScale, setNewEndDate]
  );

  return (
    <g className="slider">
      <rect ref={backgroundRef} className="slider-background" width={width} />
      <rect
        className="slider-active-area"
        width={endX - startX}
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
