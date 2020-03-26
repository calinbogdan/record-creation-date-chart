import React, { useRef, useEffect } from 'react';
import './App.css';
import { results as healthRecords } from "./assets/records";
import { results as institutes } from "./assets/institutes";
import { extent, group } from "d3-array";
import {
  axisBottom,
  axisLeft,
  axisRight,
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

// STACKOVERFLOW MADNESSSSSSSSSSSS

var getRandomColor = (function () {
  var golden_ratio_conjugate = 0.618033988749895;
  var h = Math.random();

  var hslToRgb = function (h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
  };

  return function () {
    h += golden_ratio_conjugate;
    h %= 1;
    return hslToRgb(h, 0.5, 0.60);
  };
})();

for (let i = 0; i < 15; i++) {
  console.log(getRandomColor());
}

// END OF MADNESSSSSSSSSSSSSS

const minMaxDates = extent(healthRecordsCreationDates);

const recordsPerDay = Array.from(group(healthRecords, healthRecord => healthRecord.createdon))
  .sort(([firstDate], [secondDate]) => parseTime(firstDate).getTime() - parseTime(secondDate).getTime());

const recordsPerDayPerInstitute = Array.from(group(healthRecords, healthRecord => healthRecord.institute_id, healthRecord => healthRecord.createdon))
  .map(([instituteId, recsPerDay]) => ({
    instituteId,
    numOfRecordsPerDay: Array.from(recsPerDay)
      .sort(([firstDate], [secondDate]) => parseTime(firstDate).getTime() - parseTime(secondDate).getTime())
      .map(([day, records]) => ({ day, numberOfRecords: records.length }))
  }));


console.log(recordsPerDayPerInstitute);

const numberOfRecordsPerDay = recordsPerDay
  .map(([day, records]) => ({ day, numberOfRecords: records.length }));

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
        {recordsPerDayPerInstitute.map((institute, index) =>
          <InstituteRecordCreationDateChart
            key={index}
            areaGen={areaGen}
            recordsPerDayArray={institute.numOfRecordsPerDay}
            opacity={1 / institutes.length} />)}
      </svg>
    </g>
  </svg>;
}

const InstituteRecordCreationDateChart = ({ recordsPerDayArray, areaGen, opacity }) => {
  const color = getRandomColor();
  return <g>
    <path
      d={areaGen(recordsPerDayArray)}
      style={{ 
        fill: color,
        opacity
      }} />
    <path
      className="line-chart" 
      d={areaGen.lineY1()(recordsPerDayArray)}
      style={{ stroke: color }} />
  </g>
};

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
