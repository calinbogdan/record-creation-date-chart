import React, { useState, useRef } from 'react';

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
        const { x: sliderClientX } = backgroundRef.current.getBoundingClientRect();
        const currentPosX = e.clientX - sliderClientX;
        if (endX - currentPosX > currentPosX - startX) {
          setStartX(currentPosX);
        } else {
          setEndX(currentPosX);
        }
      }}
      onMouseMove={e => {
        if (dragging) {
          // get the closest handle to the current position
          const { x: sliderClientX } = backgroundRef.current.getBoundingClientRect();
          const currentPosX = e.clientX - sliderClientX;
          if (endX - currentPosX > currentPosX - startX) {
            setStartX(currentPosX);
          } else {
            setEndX(currentPosX);
          }
        }
      }} />
  </g>
};

export default Slider;