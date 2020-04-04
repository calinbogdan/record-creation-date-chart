import React, {
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from "react";
import { timeFormat, scaleQuantize, scaleThreshold } from "d3";

import Legend from "./Legend";
import { TimeIndicator, RecordsCountIndicator } from "./indicators";
import { HorizontalHoverLine, VerticalHoverLine } from "./hoverLines";

import TimeScaleContext from "../../contexts/timeScaleContext";
import HealthRecordsContext, {
  useDaysWithRecords,
} from "../../contexts/healthRecordsContext";
import { useRecordsScale } from "../../contexts/recordsScaleContext";

const formatTime = timeFormat("%d-%m-%Y");

const HoverableArea = ({ height, width }) => {
  const recordsScale = useRecordsScale();
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);
  const daysWithRecords = useDaysWithRecords();

  const [thresholdScale, setThresholdScale] = useState(() =>
    scaleThreshold([0], [new Date().getTime(), new Date().getTime()])
  );

  useEffect(() => {
    // so what I should have here is 
    // domain: [firstDateX, secondDateX, ..., lastDateX]
    // range: []

    const domain = daysWithRecords.map(day => new Date(day))
      .map(unixDay => timeScale(unixDay));

    setThresholdScale(() => 
      scaleThreshold(domain.slice(1), daysWithRecords)
    );

  }, [timeScale, setThresholdScale, width, daysWithRecords]);

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
    (e) => {
      // kill this if mouse is out
      setPointerY(e.clientY - hoverRectRef.current.getBoundingClientRect().y);
      setPointerX(e.clientX - hoverRectRef.current.getBoundingClientRect().x);
    },
    [setPointerY]
  );

  return (
    <svg overflow="visible" height={height + 20} width={width + 20}>
      {hoverVisible && (
        <Legend x={pointerX} y={pointerY} scale={thresholdScale} />
      )}
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
