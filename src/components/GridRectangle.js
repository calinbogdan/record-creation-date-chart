import React, { useRef, useEffect } from "react";
import { useTimeScale, useRecordsScale, useFilteredHealthRecords, useChartGenerator } from "../healthRecordsContext";
import { select, axisRight, axisBottom } from "d3";
import { group } from "d3-array";
import getRandomColor from "../randomColor";

const TICKS_NUMBER = 5;

const GridRectangle = (props) => {
  const { height, width } = props;

  const yLinesRef = useRef();
  const xLinesRef = useRef();

  const healthRecords = useFilteredHealthRecords();
  const chartGenerator = useChartGenerator(height, width);

  const timeScale = useTimeScale(width);
  const recordsScale = useRecordsScale(height);

  useEffect(() => {
    select(yLinesRef.current)
      .call(
        axisRight(recordsScale)
          // .ticks(TICKS_NUMBER)
          .tickSize(width),
      );

    select(xLinesRef.current)
      .call(
        axisBottom(timeScale)
          // .ticks(TICKS_NUMBER)
          .tickSize(height)
      );
  }, [width, height, recordsScale, timeScale]);

  const mappedRecords = Array.from(group(healthRecords, healthRecord => healthRecord.institute_id, healthRecord => healthRecord.createdon))
    .map(([instituteId, recsPerDay]) => ({
      instituteId,
      recordsCountByDay: Array.from(recsPerDay)
        .sort(([firstDate], [secondDate]) => new Date(firstDate).getTime() - new Date(secondDate).getTime())
        .map(([day, records]) => ({ day, recordsCount: records.length }))
    }));

  console.log(mappedRecords);

  return <svg
    height={height}
    width={width}>
    {mappedRecords.map((institute, index) => {
      const color = getRandomColor();
      return <g key={index}>
        <path
          style={{ fill: color }}
          className="area-chart"
          d={chartGenerator(institute.recordsCountByDay)} />
        <path
          style={{ stroke: color }}
          className="line-chart"
          d={chartGenerator.lineY1()(institute.recordsCountByDay)} />
      </g>
    })}
    <g className="grid-lines">
      <g ref={yLinesRef} />
      <g ref={xLinesRef} />
    </g>
  </svg>
}

export default GridRectangle;