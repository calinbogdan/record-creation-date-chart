import { area, axisBottom, axisRight, select, stack } from "d3";
import React, { useContext, useEffect, useRef } from "react";
import HealthRecordsContext, {
  useRecordsGroupedByDay
} from "../healthRecordsContext";
import { useRecordsScale } from "../recordsScaleContext";
import TimeScaleContext from "../timeScaleContext";

const COLORS = ["red", "yellow", "orange", "green", "blue"];

const GridRectangle = props => {
  const { height, width } = props;
  const { institutesIds } = useContext(HealthRecordsContext);
  const { timeScale } = useContext(TimeScaleContext);

  const yLinesRef = useRef();
  const xLinesRef = useRef();

  const recordsGroupedByDay = useRecordsGroupedByDay();

  const recordsScale = useRecordsScale();

  useEffect(() => {
    select(yLinesRef.current).call(axisRight(recordsScale).tickSize(width));
    select(xLinesRef.current).call(axisBottom(timeScale).tickSize(height));
  }, [width, height, recordsScale, timeScale]);

  const stackedData = stack().keys(institutesIds)(recordsGroupedByDay);

  return (
    <svg height={height} width={width}>
      {stackedData.map((data, index) => {
        return (
          <path
            key={index}
            style={{ fill: COLORS[index] }}
            d={area()
              .x(d => timeScale(new Date(d.data.date)))
              .y0(d => recordsScale(d["0"]))
              .y1(d => recordsScale(d["1"]))(data)}
          />
        );
      })}
      <g className="grid-lines">
        <g ref={yLinesRef} />
        <g ref={xLinesRef} />
      </g>
      <rect width={width} height={height} style={{ fill: "transparent" }} />
      <line x1="0" x2={width} y1={400} y2={400} stroke="gray" strokeDasharray="3"/>
    </svg>
  );
};

export default GridRectangle;
