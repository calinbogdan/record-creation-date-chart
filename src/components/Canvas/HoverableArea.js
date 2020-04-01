import React, { useState, useCallback, useContext, useRef } from "react";
import { timeFormat } from "d3";

import Legend from "./Legend";
import { TimeIndicator, RecordsCountIndicator } from "./indicators";
import { HorizontalHoverLine, VerticalHoverLine } from "./hoverLines";

import TimeScaleContext from "../../timeScaleContext";
import HealthRecordsContext from "../../healthRecordsContext";
import { useRecordsScale } from "../../recordsScaleContext";

const formatTime = timeFormat("%d-%m-%Y");

const HoverableArea = ({ height, width }) => {
  const recordsScale = useRecordsScale();
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);

  const [hoverVisible, setHoverVisible] = useState(false);
  const [pointerY, setPointerY] = useState(0);
  const [pointerX, setPointerX] = useState(0);

  const hoverRectRef = useRef();

  const mouseOutListener = useCallback(() => {
    setHoverVisible(false);
  }, [setHoverVisible]);

  const mouseOverListener = useCallback(() => {
    if (institutes.length > 0) {
      setHoverVisible(true);
    }
  }, [institutes.length]);

  const mouseMoveListener = useCallback(
    e => {
      // kill this if mouse is out
      setPointerY(e.clientY - hoverRectRef.current.getBoundingClientRect().y);
      setPointerX(e.clientX - hoverRectRef.current.getBoundingClientRect().x);
    },
    [setPointerY]
  );

  return (
    <svg overflow="visible" height={height + 20} width={width + 20}>
      {hoverVisible && <Legend x={pointerX} y={pointerY} />}
      <svg height={height} width={width}>
        {hoverVisible && <HorizontalHoverLine y={pointerY} width={width} />}
        {hoverVisible && <VerticalHoverLine x={pointerX} height={height} />}
        <rect
          ref={hoverRectRef}
          onMouseMove={mouseMoveListener}
          onMouseOut={mouseOutListener}
          onMouseOver={mouseOverListener}
          width={width}
          height={height}
          style={{ fill: "transparent" }}
        />
      </svg>
      {hoverVisible && (
        <RecordsCountIndicator y={pointerY}>
          {Math.floor(recordsScale.invert(pointerY))}
        </RecordsCountIndicator>
      )}
      {hoverVisible && (
        <TimeIndicator x={pointerX} y={height}>
          {formatTime(timeScale.invert(pointerX))}
        </TimeIndicator>
      )}
    </svg>
  );
};

export default HoverableArea;
