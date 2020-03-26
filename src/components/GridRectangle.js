import React, { useRef, useEffect } from "react";
import { useTimeScale, useRecordsScale } from "../healthRecordsContext";
import { select, axisRight, axisBottom } from "d3";

const TICKS_NUMBER = 5;

const GridRectangle = (props) => {
  const { height, width } = props;

  // console.log(`GridRectangle - width: ${width}, height: ${height}`); // FIX STUFF THAT GOES WITH MINUS?
  const yLinesRef = useRef();
  const xLinesRef = useRef();

  const timeScale = useTimeScale(width);
  const recordsScale = useRecordsScale(height);

  useEffect(() => {
    select(yLinesRef.current)
      .call(
        axisRight(recordsScale)
          .ticks(TICKS_NUMBER)
          .tickSize(width),
      );

    select(xLinesRef.current)
      .call(
        axisBottom(timeScale)
          .ticks(TICKS_NUMBER)
          .tickSize(height)
      );
  }, [width, height, recordsScale, timeScale]);

  return <svg
    className="grid-rectangle"
    height={height}
    width={width}>
    <g ref={yLinesRef} />
    <g ref={xLinesRef} />
  </svg>
}

export default GridRectangle;