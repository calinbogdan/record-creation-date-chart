import React, { useRef, useEffect } from 'react';
import './App.css';
import { results as healthRecords } from "./assets/records";
import { extent, group } from "d3-array";
import {
  axisBottom,
  axisLeft,
  axisRight,
  line,
  scaleTime,
  scaleLinear,
  area,
  utcParse,
  select
} from "d3";



const CHART_HEIGHT = 400;
const CHART_WIDTH = 800;

const parseTime = utcParse("%d %b %Y");

const healthRecordsCreationDates = healthRecords
  .map(healthRecord => parseTime(healthRecord.createdon));

const minMaxDates = extent(healthRecordsCreationDates);

const recordsPerDay = Array.from(group(healthRecords, healthRecord => healthRecord.createdon))
  .sort((firstEntry, secondEntry) => {
    const [firstDateAsString,] = firstEntry;
    const [secondDateAsString,] = secondEntry;

    return parseTime(firstDateAsString).getTime() - parseTime(secondDateAsString).getTime();
  });

const numberOfRecordsPerDay = recordsPerDay
  .map(([day, records]) => ({
    day,
    numberOfRecords: records.length
  }));

console.log(numberOfRecordsPerDay);

const minMaxRecords = extent(numberOfRecordsPerDay.map(({ numberOfRecords }) => numberOfRecords));

const recordsTimeDomain = scaleTime().domain(minMaxDates);
const recordsNumberDomain = scaleLinear().domain(minMaxRecords);

const NUMBER_OF_TICKS = 6;

// CANVAS COMPONENT
const Canvas = ({ height, width, doubleOfPadding }) => {
  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const yGridRef = useRef();
  const xGridRef = useRef();

  const recordsNumberScale = recordsNumberDomain.range([height - doubleOfPadding, 0]);
  const recordsTimeScale = recordsTimeDomain.range([0, width - doubleOfPadding]);

  const areaGen = area()
    .x(recordDay => recordsTimeScale(parseTime(recordDay.day)))
    .y0(height - doubleOfPadding)
    .y1(record => recordsNumberScale(record.numberOfRecords));

  const upperLine = line()
    .x(recordDay => recordsTimeScale(parseTime(recordDay.day)))
    .y(record => recordsNumberScale(record.numberOfRecords));


  useEffect(() => {
    select(yAxisRef.current).call(
      axisLeft(recordsNumberScale)
        .ticks(NUMBER_OF_TICKS)
        .tickSize(5));

    select(xAxisRef.current)
      .call(
        axisBottom(recordsTimeScale)
          .ticks(NUMBER_OF_TICKS)
          .tickSize(5));

    select(yGridRef.current).call(
      axisRight(recordsNumberDomain.range([0, height - doubleOfPadding]))
        .ticks(NUMBER_OF_TICKS)
        .tickFormat("")
        .tickSize(width - doubleOfPadding));

    select(xGridRef.current).call(
      axisBottom(recordsTimeDomain.range([0, width - doubleOfPadding]))
        .ticks(NUMBER_OF_TICKS)
        .tickFormat("")
        .tickSize(height - doubleOfPadding));
  });

  return <svg width={width} height={height}>
    <g style={{ transform: `translate(${doubleOfPadding / 2}px, ${doubleOfPadding / 2}px)` }}>
      <g className="grid" ref={yGridRef} />
      <g className="grid" ref={xGridRef} />
      <g ref={yAxisRef}></g>
      <g style={{ transform: `translateY(${height - doubleOfPadding}px)` }} ref={xAxisRef}></g>
      <svg width={width - doubleOfPadding} height={height - doubleOfPadding}>
        <path className="area-chart" d={areaGen(numberOfRecordsPerDay)} />
        <path className="line-chart" d={upperLine(numberOfRecordsPerDay)} />
      </svg>
    </g>
  </svg>;
}

function App() {
  return (
    <div className="App">
      <Canvas
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        doubleOfPadding={50}
        records={healthRecords} />
    </div>
  );
}

export default App;
