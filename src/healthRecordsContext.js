import React, { createContext, useEffect, useState, useContext } from 'react';
import { extent, group } from "d3-array";

import {
  scaleTime,
  utcParse,
  scaleLinear
} from "d3";

const HealthRecordsContext = createContext(null);

const parseTime = utcParse("%d %b %Y");


/*
    Basically, what the following algorithm does is grouping the records by day, then by institute.
    The aim is to have an array like the following: 
    [
      { date: day1, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      { date: day2, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      ...
    ]
*/
function useRecordsGroupedByDay() {
  const { healthRecords, institutesIds } = useContext(HealthRecordsContext);
  const [groupedRecords, setGroupedRecords] = useState([]);

  useEffect(() => {
    setGroupedRecords(
      Array.from(
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
        .sort(({ date: firstDate }, { date: secondDate }) => new Date(firstDate).getTime() - new Date(secondDate).getTime())
    );
  }, [institutesIds, healthRecords]);

  return groupedRecords;
}

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

export {
  useTimeScale,
  useRecordsScale,
  useRecordsGroupedByDay
};
export default HealthRecordsContext;