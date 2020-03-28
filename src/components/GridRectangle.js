import { area, axisBottom, axisRight, select, stack } from "d3";
import React, { useContext, useEffect, useRef } from "react";
import HealthRecordsContext, { useRecordsGroupedByDay } from "../healthRecordsContext";
import { useTimeScale } from "../timeScaleContext";
import { useRecordsScale } from "../recordsScaleContext";

const COLORS = ['red', 'yellow', 'orange', 'green', 'blue'];

const GridRectangle = (props) => {
  const { height, width } = props;
  const { institutesIds } = useContext(HealthRecordsContext);

  const yLinesRef = useRef();
  const xLinesRef = useRef();

  const recordsGroupedByDay = useRecordsGroupedByDay();

  const timeScale = useTimeScale(width);
  const recordsScale = useRecordsScale(height);

  useEffect(() => {
    select(yLinesRef.current)
      .call(
        axisRight(recordsScale)
          .tickSize(width),
      );

    select(xLinesRef.current)
      .call(
        axisBottom(timeScale)
          .tickSize(height)
      );
  }, [width, height, recordsScale, timeScale]);

  const stackedData = stack()
    .keys(institutesIds)
    (recordsGroupedByDay);

  return <svg
    height={height}
    width={width}>
    {stackedData.map((data, index) => {
      return <path
        key={index}
        style={{ fill: COLORS[index] }}
        d={area()
          .x(d => timeScale(new Date(d.data.date)))
          .y0(d => recordsScale(d['0']))
          .y1(d => recordsScale(d['1']))
          (data)} />
    })}
    <g className="grid-lines">
      <g ref={yLinesRef} />
      <g ref={xLinesRef} />
    </g>
    <rect
      width={width}
      height={height}
      style={{ fill: 'transparent' }} />
  </svg>
}

export default GridRectangle;