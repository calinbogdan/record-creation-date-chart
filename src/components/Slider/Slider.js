import React, { useState, useRef, useContext, useCallback } from "react";
import TimeScaleContext from "../../timeScaleContext";

import Handle from "./Handle";
import styled from "styled-components";

const Wrapper = styled.g`
  * {
    height: 36px;
  }
`;

const Background = styled.rect`
  fill: #efefef;
`;

const ActiveArea = styled.rect`
  fill: #ddd;
`;

const MouseEventsListenerRect = styled.rect`
  fill: transparent;
  &:hover {
    cursor: pointer;
  }
`;

const Slider = props => {
  const backgroundRef = useRef();
  const [dragging, setDragging] = useState(false);
  const { startX, endX, onStartHandleMoved, onEndHandleMoved } = useContext(
    TimeScaleContext
  );
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
    <Wrapper {...props}>
      <Background ref={backgroundRef} width={props.width} />
      <ActiveArea
        width={endX - startX || 0}
        style={{ transform: `translateX(${startX}px)` }}
      />
      <Handle x={startX} />
      <Handle x={endX} />
      <MouseEventsListenerRect
        width={props.width}
        className="slider-mouse-move-detector"
        onMouseOut={mouseOutListener}
        onMouseUp={mouseUpListener}
        onMouseDown={mouseDownListener}
        onMouseMove={mouseMoveListener}
      />
    </Wrapper>
  );
};

export default Slider;
