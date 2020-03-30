import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import { select, axisBottom, axisLeft, format, timeFormat } from "d3";
import Slider from "./Slider/Slider";

import TimeScaleContext from "../timeScaleContext";
import { useRecordsScale } from "../recordsScaleContext";
import StackedDataChart from "./StackedDataChart";
import HealthRecordsContext, { useRecordsGroupedByDay, useHealthRecords } from "../healthRecordsContext";

const recordsNumberFormat = format("~s");

const timeFormatter = timeFormat("%d-%b-%Y");

const HoverLine = ({ y, width }) => (
  <line x1="0" x2={width} y1={y} y2={y} stroke="gray" strokeDasharray="2" />
);

const Legend = ({ day }) => {
  const records = useRecordsGroupedByDay();
  

  return <g>
    <foreignObject>
      <span>{day}</span>
      
    </foreignObject>
  </g>;
}

const Canvas = ({ height, width, padding }) => {
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const recordsScale = useRecordsScale();
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);

  const [hoverVisible, setHoverVisible] = useState(false);
  const [pointerY, setPointerY] = useState(0);
  const [pointerX, setPointerX] = useState(0);

  useEffect(() => {
    // Y-AXIS
    select(yAxisRef.current).call(
      axisLeft(recordsScale)
        .tickSize(5)
        .tickFormat(recordsNumberFormat)
    );
  }, [innerHeight, recordsScale]);

  useEffect(() => {
    // X-AXIS
    select(xAxisRef.current).call(axisBottom(timeScale).tickSize(5));
  }, [innerWidth, timeScale]);

  const ref = useRef();

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
      setPointerY(e.clientY - ref.current.getBoundingClientRect().y);
      setPointerX(e.clientX - ref.current.getBoundingClientRect().x);
    },
    [setPointerY]
  );

  // GRID LINES
  const yLinesRef = useRef();
  const xLinesRef = useRef();

  useEffect(() => {
    select(yLinesRef.current).call(
      axisLeft(recordsScale)
        .tickSize(innerWidth)
        .tickFormat("")
    );
    select(xLinesRef.current).call(
      axisBottom(timeScale)
        .tickSize(innerHeight)
        .tickFormat("")
    );
  }, [recordsScale, timeScale, innerWidth, innerHeight]);
  // END OF GRID LINES

  return (
    <div className="axis-container">
      <span className="axis-title">Number of records</span>
      <svg className="canvas" overflow="visible" height={height} width={width}>
        <g
          ref={xAxisRef}
          style={{ transform: `translateY(${innerHeight}px)` }}
        />
        <g ref={yAxisRef} />
        <svg height={innerHeight} width={innerWidth}>
          <Legend/>
          <g className="grid-lines">
            <g
              ref={yLinesRef}
              style={{ transform: `translateX(${innerWidth}px)` }}
            />
            <g ref={xLinesRef} />
          </g>
          <StackedDataChart />
          {hoverVisible && <HoverLine y={pointerY} width={innerWidth} />}
          <rect
            ref={ref}
            onMouseMove={mouseMoveListener}
            onMouseOut={mouseOutListener}
            onMouseOver={mouseOverListener}
            width={innerWidth}
            height={innerHeight}
            style={{ fill: "transparent" }}
          />
        </svg>
        {hoverVisible && (
          <foreignObject className="indicator-container" y={pointerY} height={50} width={5}>
            <span className="records indicator">
              {Math.floor(recordsScale.invert(pointerY))}
            </span>
          </foreignObject>
        )}
        {hoverVisible && (
          <foreignObject className="indicator-container" y={innerHeight} x={pointerX} height={50} width={100}>
            <span className="time indicator">
              {timeFormatter(timeScale.invert(pointerX))}
            </span>
          </foreignObject>
        )}
        <Slider
          style={{ transform: `translateY(${height}px)` }}
          width={innerWidth}
        />
      </svg>
    </div>
  );
};

export default Canvas;
