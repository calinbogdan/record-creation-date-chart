import React, { useRef, useEffect } from 'react';
import './App.css';
import { results as healthRecords } from "./assets/records";
import { extent, group } from "d3-array";
import {
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
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

const recordsPerDay = Array.from(group(healthRecords, healthRecord => healthRecord.createdon));
const numberOfRecordsPerDay = recordsPerDay
  .map(([_, value]) => value.length);

const minMaxRecords = extent(numberOfRecordsPerDay);

const recordsTimeDomain = scaleTime().domain(minMaxDates);
const recordsNumberDomain = scaleLinear().domain(minMaxRecords);

const Canvas = ({ height, width, doubleOfPadding }) => {
  const yAxisRef = useRef();
  const xAxisRef = useRef();

  const yGridRef = useRef();
  const xGridRef = useRef();

  useEffect(() => {
    select(yAxisRef.current).call(
      axisLeft(recordsNumberDomain.range([0, height - doubleOfPadding]))
        .ticks(6)
        .tickSize(5));

    select(xAxisRef.current)
      .call(
        axisBottom(recordsTimeDomain.range([0, width - doubleOfPadding]))
          .ticks(6)
          .tickSize(5));

    select(yGridRef.current).call(
      axisRight(recordsNumberDomain.range([0, height - doubleOfPadding]))
        .ticks(6)
        .tickFormat("")
        .tickSize(width - doubleOfPadding));

    select(xGridRef.current).call(
      axisBottom(recordsTimeDomain.range([0, width - doubleOfPadding]))
        .ticks(6)
        .tickFormat("")
        .tickSize(height - doubleOfPadding));
  });

  return <svg width={width} height={height}>
    <g style={{ transform: `translate(${doubleOfPadding / 2}px, ${doubleOfPadding / 2}px)` }}>
      <g ref={yAxisRef}></g>
      <g style={{ transform: `translateY(${height - doubleOfPadding}px)` }} ref={xAxisRef}></g>
      <g ref={yGridRef} />
      <g ref={xGridRef} />
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
