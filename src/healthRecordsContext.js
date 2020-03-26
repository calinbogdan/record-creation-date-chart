import React, { createContext, useEffect, useState, useContext } from 'react';
import { extent, group } from "d3-array";

import {
  scaleTime,
  utcParse,
  scaleLinear,
  area
} from "d3";

const HealthRecordsContext = createContext(null);

const parseTime = utcParse("%d %b %Y");

// Public
function useFilteredHealthRecords() {
  const { healthRecords, institutesIds } = useContext(HealthRecordsContext);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const filteredHealthRecords = healthRecords.filter(healthRecord => institutesIds.includes(healthRecord.institute_id));
    setFilteredRecords(filteredHealthRecords);
  }, [healthRecords, institutesIds]);
  return filteredRecords;
}

// Public
function useTimeScale(width) {
  const healthRecords = useFilteredHealthRecords();
  const [timeDomain, setTimeScale] = useState(() =>
    scaleTime()
      .domain([new Date(), new Date()])
      .range([0, width]));

  useEffect(() => {
    const recordsCreationDatesBoundaries = extent(healthRecords.map(record => parseTime(record.createdon)));
    setTimeScale(() =>
      scaleTime()
        .domain(recordsCreationDatesBoundaries)
        .range([0, width]));
  }, [healthRecords, width]);

  return timeDomain;
};


// Public
function useRecordsScale(height) {
  const healthRecords = useFilteredHealthRecords();
  const [recordsScale, setRecordsScale] = useState(() =>
    scaleLinear()
      .domain([0, 0])
      .range([height, 0]));

  useEffect(() => {
    const recordsPerDay = Array.from(group(healthRecords, healthRecord => healthRecord.createdon))
      .sort(([firstDate], [secondDate]) => parseTime(firstDate).getTime() - parseTime(secondDate).getTime());

    const leastAndMostRecords = extent(recordsPerDay, ([_, records]) => records.length);
    setRecordsScale(() =>
      scaleLinear()
        .domain(leastAndMostRecords)
        .range([height, 0]));
  }, [healthRecords, height]);

  return recordsScale;
};

// Public
function useChartGenerator(height, width) {
  const recordsScale = useRecordsScale(height);
  const timeScale = useTimeScale(width);
  const [chartGenerator, setChartGenerator] = useState(null);

  useEffect(() => {
    setChartGenerator(() => area()
      .x(({ day }) => timeScale(new Date(day)))
      .y0(height)
      .y1(({ recordsCount }) => recordsScale(recordsCount))
    );
  }, [timeScale, recordsScale, height]);

  return chartGenerator;
}

export {
  useTimeScale,
  useRecordsScale,
  useChartGenerator,
  useFilteredHealthRecords
};
export default HealthRecordsContext;