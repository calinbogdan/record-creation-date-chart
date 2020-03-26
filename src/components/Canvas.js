import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft } from 'd3';
import { useTimeScale, useRecordsScale } from '../healthRecordsContext';
import GridRectangle from "./GridRectangle";

const TICKS_NUMBER = 5; // default value

const Canvas = ({ height, width, padding }) => {
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const recordsScale = useRecordsScale(innerHeight);
  const timeScale = useTimeScale(innerWidth);

  useEffect(() => {
    select(yAxisRef.current).call(
      axisLeft(recordsScale)
        // .ticks(TICKS_NUMBER)
        .tickSize(5)
    );
  }, [innerHeight, recordsScale]);

  useEffect(() => {
    select(xAxisRef.current).call(
      axisBottom(timeScale)
        // .ticks(TICKS_NUMBER)
        .tickSize(5)
    );
  }, [innerWidth, timeScale]);

  return <svg height={height} width={width}>
    <g style={{ transform: `translate(${padding}px,${padding}px)` }}>
      <GridRectangle
        height={innerHeight}
        width={innerWidth} />
      <g
        style={{ transform: `translateY(${innerHeight}px)` }}
        ref={xAxisRef} />
      <g ref={yAxisRef} />
    </g>
  </svg>
};

export default Canvas;