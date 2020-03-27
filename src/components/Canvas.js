import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft } from 'd3';
import { useTimeScale, useRecordsScale } from '../healthRecordsContext';
import GridRectangle from "./GridRectangle";
import Slider from './Slider/Slider';

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
        .tickSize(5)
    );
  }, [innerHeight, recordsScale]);

  useEffect(() => {
    select(xAxisRef.current).call(
      axisBottom(timeScale)
        .tickSize(5)
    );
  }, [innerWidth, timeScale]);

  return <svg height={height + 200} width={width}>
    <g style={{ transform: `translate(${padding}px,${padding}px)` }}>
      <GridRectangle
        height={innerHeight}
        width={innerWidth} />
      <g
        style={{ transform: `translateY(${innerHeight}px)` }}
        ref={xAxisRef} />
      <g ref={yAxisRef} />
      <g style={{ transform: `translateY(${innerHeight + 30}px)` }}>
        <Slider width={innerWidth} />
      </g>
    </g>
  </svg>
};

export default Canvas;