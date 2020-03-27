import { area, axisBottom, axisRight, select, stack } from "d3";
import { group } from "d3-array";
import React, { useContext, useEffect, useRef } from "react";
import HealthRecordsContext, { useFilteredHealthRecords, useRecordsScale, useTimeScale } from "../healthRecordsContext";
import getRandomColor from "../randomColor";

const GridRectangle = (props) => {
  const { height, width } = props;
  const { institutesIds } = useContext(HealthRecordsContext);

  const yLinesRef = useRef();
  const xLinesRef = useRef();

  const healthRecords = useFilteredHealthRecords();

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

  /*
    Basically, what the following algorithm does is grouping the records by day, then by institute.
    The aim is to have an array like the following: 
    [
      { date: day1, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      { date: day2, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      ...
    ]
  */
  const recordsGroupedByDay = Array.from(
    group(
      healthRecords,
      healthRecord => healthRecord.createdon,
      healthRecord => healthRecord.institute_id), ([date, institutes]) => ({ date, institutes: institutes }))
    .map(({ date, institutes }) => {
      return {
        date,
        ...institutesIds.map(instituteId => [instituteId, institutes.get(instituteId)?.length ?? 0]) // if there's no record for the given institute in that day, we're 'defaulting' it to 0
          .reduce((base, [instituteId, recordsCount]) => ({
            ...base,
            [instituteId]: recordsCount
          }), {})
      }
    })
    .sort(({ date: firstDate }, { date: secondDate }) => new Date(firstDate).getTime() - new Date(secondDate).getTime());

  const stackedData = stack()
    .keys(institutesIds)
    (recordsGroupedByDay);
  console.log(stackedData);

  console.log(`Records scale: ${recordsScale(5)}`);

  return <svg
    height={height}
    width={width}>
    {stackedData.map((data, index) => {
      return <path
        key={index}
        style={{ fill: getRandomColor() }}
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
      style={{ fill: 'transparent' }}
      onMouseEnter={() => console.log('Mouse entered grid rectangle!')}
      onMouseLeave={() => console.log('Mouse left grid rectangle!')}
      onMouseMove={() => console.log('Mouse is moving inside the rectangle.')} />
  </svg>
}

export default GridRectangle;