import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import { select, axisBottom, axisLeft, axisRight, format } from "d3";
import Slider from "./Slider/Slider";

import TimeScaleContext from "../timeScaleContext";
import { useRecordsScale } from "../recordsScaleContext";
import StackedDataChart from "./StackedDataChart";

const recordsNumberFormat = format("~s");

const HoverLine = ({ y, width }) => (
  <line x1="0" x2={width} y1={y} y2={y} stroke="gray" strokeDasharray="2" />
);

const Canvas = ({ height, width, padding }) => {
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const recordsScale = useRecordsScale();
  const { timeScale } = useContext(TimeScaleContext);

  const [lineVisible, setLineVisible] = useState(false);
  const [lineY, setLineY] = useState(0);

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
    setLineVisible(false);
  }, [setLineVisible]);

  const mouseOverListener = useCallback(() => {
    setLineVisible(true);
  }, [setLineVisible]);

  const mouseMoveListener = useCallback(
    e => {
      // kill this if mouse is out
      setLineY(e.clientY - ref.current.getBoundingClientRect().y);
    },
    [setLineY]
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
    <div>
      <div className="axis-container">
        <span className="axis-title">
          Number of records
        </span>
        <svg className="canvas" overflow="visible" height={height} width={width}>
          <g ref={xAxisRef} style={{ transform: `translateY(${innerHeight}px)` }} />
          <g ref={yAxisRef}/>
          <svg height={innerHeight} width={innerWidth}>
            <g className="grid-lines">
              <g ref={yLinesRef} style={{ transform: `translateX(${innerWidth}px)` }}/>
              <g ref={xLinesRef} />
            </g>
            <StackedDataChart />
            {lineVisible && <HoverLine y={lineY} width={innerWidth} />}
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
          <Slider style={{ transform: `translateY(${height}px)`}} width={innerWidth} />
        </svg>
      </div>
      <svg width={innerWidth}>
      </svg>
    </div>
  );
};

export default Canvas;
