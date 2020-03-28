import React, { useState, useRef, useContext } from 'react';
import TimeScaleContext, { useFullTimeScale } from '../../timeScaleContext';

const Handle = props => {
  // const [dragging, setDragging] = useState(false);
  return <g style={{ transform: `translateX(${props.x}px)` }} // bad practice
    className="slider-handle"
    {...props}>
    <rect className="slider-handle-line" />
    <rect className="slider-handle-button" />
  </g>;
}
const Slider = ({ width }) => {
  const backgroundRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(width);

  const timeScale = useFullTimeScale();
  const { setNewStartDate, setNewEndDate } = useContext(TimeScaleContext);

  return <g className="slider">
    <rect
      ref={backgroundRef}
      className="slider-background"
      width={width} />
    <rect
      className="slider-active-area"
      width={endX - startX}
      style={{ transform: `translateX(${startX}px)` }} />
    <Handle x={startX} />
    <Handle x={endX} />
    <rect
      width={width}
      className="slider-mouse-move-detector"
      onMouseOut={() => setDragging(false)}
      onMouseUp={() => setDragging(false)}
      onMouseDown={e => {
        setDragging(true);

        // get the closest handle to the current position
        moveHandle(backgroundRef, e, endX, startX, setStartX, setNewStartDate, timeScale, setEndX, setNewEndDate);
      }}
      onMouseMove={e => {
        if (dragging) {
          moveHandle(backgroundRef, e, endX, startX, setStartX, setNewStartDate, timeScale, setEndX, setNewEndDate);
        }
      }} />
  </g>
};

export default Slider;

function moveHandle(backgroundRef, e, endX, startX, setStartX, setNewStartDate, timeScale, setEndX, setNewEndDate) {
  const { x: sliderClientX } = backgroundRef.current.getBoundingClientRect();
  const currentPosX = e.clientX - sliderClientX;
  if (endX - currentPosX > currentPosX - startX) {
    setStartX(currentPosX);
    setNewStartDate(timeScale.invert(currentPosX));
  }
  else {
    setEndX(currentPosX);
    setNewEndDate(timeScale.invert(currentPosX));
  }
}
