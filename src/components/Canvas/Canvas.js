import React, {
  useEffect,
  useRef,
  useContext
} from "react";
import { select, axisBottom, axisLeft, format } from "d3";

import TimeScaleContext from "../../timeScaleContext";
import HealthRecordsContext from "../../healthRecordsContext";
import { useRecordsScale } from "../../recordsScaleContext";

import StackedDataChart from "./StackedDataChart";
import Slider from "../Slider/Slider";
import HoverableArea from "./HoverableArea";

const recordsNumberFormat = format("~s");

const Canvas = ({ height, width, padding }) => {
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const recordsScale = useRecordsScale();
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);

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
          <g className="grid-lines">
            <g
              ref={yLinesRef}
              style={{ transform: `translateX(${innerWidth}px)` }}
            />
            <g ref={xLinesRef} />
          </g>
          {institutes.length > 0 && <StackedDataChart />}
        </svg>
        <HoverableArea height={innerHeight} width={innerWidth} />
        <Slider
          style={{ transform: `translateY(${height}px)` }}
          width={innerWidth}
        />
      </svg>
    </div>
  );
};

export default Canvas;
