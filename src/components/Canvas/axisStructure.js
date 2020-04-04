import React, { useEffect, useContext, useRef } from "react";
import { select, axisBottom, axisLeft, format } from "d3";

import TimeScaleContext from "../../contexts/timeScaleContext";
import { useRecordsScale } from "../../contexts/recordsScaleContext";
import styled from "styled-components";

const GridWrapper = styled.g`
  * {
    opacity: 0.4;
  }
`;

const GridLines = ({ height, width }) => {
  const { timeScale } = useContext(TimeScaleContext);
  const recordsScale = useRecordsScale();

  const yLinesRef = useRef();
  const xLinesRef = useRef();

  useEffect(() => {
    select(yLinesRef.current).call(
      axisLeft(recordsScale)
        .tickSize(width)
        .tickFormat("")
    );
    select(xLinesRef.current).call(
      axisBottom(timeScale)
        .tickSize(height)
        .tickFormat("")
    );
  }, [recordsScale, timeScale, width, height]);

  return (
    <GridWrapper>
      <g ref={yLinesRef} style={{ transform: `translateX(${width}px)` }} />
      <g ref={xLinesRef} />
    </GridWrapper>
  );
};

const Axes = ({ height, width }) => {
  const { timeScale } = useContext(TimeScaleContext);
  const recordsScale = useRecordsScale();

  const yAxisRef = useRef();
  const xAxisRef = useRef();

  useEffect(() => {
    select(yAxisRef.current).call(
      axisLeft(recordsScale)
        .tickSize(5)
        .tickValues(
          recordsScale.ticks()
          .filter(tick => Number.isInteger(tick))
        )
        .tickFormat(format("~s"))
    );
  }, [height, recordsScale]);

  useEffect(() => {
    select(xAxisRef.current).call(axisBottom(timeScale).tickSize(5));
  }, [width, timeScale]);

  return (
    <g>
      <g ref={xAxisRef} style={{ transform: `translateY(${height}px)` }} />
      <g ref={yAxisRef} />
    </g>
  );
};

export { GridLines, Axes };
