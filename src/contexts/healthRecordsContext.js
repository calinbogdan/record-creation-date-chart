import { createContext, useEffect, useState, useContext } from "react";
import { group, sum } from "d3-array";
import { stack } from "d3";

const HealthRecordsContext = createContext(null);

function useStackedData() {
  const { institutes } = useContext(HealthRecordsContext);
  const groupedRecords = useRecordsGroupedByDay();
  const [stackedData, setStackedData] = useState([]);

  useEffect(() => {
    setStackedData(
      stack()
        .keys(institutes.map(({ id }) => id))(Object.values(groupedRecords))
        .map((array, index) => {
          array.instituteData = institutes[index];
          return array;
        })
    );
  }, [groupedRecords, institutes]);

  return stackedData;
}

function useHealthRecords() {
  const { healthRecords, institutes } = useContext(HealthRecordsContext);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    setFilteredRecords(
      healthRecords
        .filter((healthRecord) =>
          institutes.map(({ id }) => id).includes(healthRecord.institute_id)
        )
        .sort(
          (firstRecord, secondRecord) =>
            new Date(firstRecord.createdon).getTime() -
            new Date(secondRecord.createdon).getTime()
        )
    );
  }, [healthRecords, institutes]);

  return filteredRecords;
}


function useRecordsGroupedByDay() {
  const [groupedRecords, setGroupedRecords] = useState([]);
  const healthRecords = useHealthRecords();
  const { institutes } = useContext(HealthRecordsContext);

  useEffect(() => {
    setGroupedRecords(
      getCumulativeByDay(healthRecords, institutes)
    );
  }, [healthRecords, institutes]);

  return groupedRecords;
}

export { useRecordsGroupedByDay, useHealthRecords, useStackedData };
export default HealthRecordsContext;

/*
    Basically, what the following algorithm does is grouping the records by day, then by institute.
    The aim is to have an array like the following: 
    [
      { date: day1, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      { date: day2, institute1: institute1NumberOfRecordsInThatDay, institute2: institute2NumberOfRecordsInThatDay },
      ...
    ]
*/
function getCumulativeByDay(healthRecords, institutes) {
  return Array.from(
    group(
      healthRecords,
      (healthRecord) => healthRecord.createdon,
      (healthRecord) => healthRecord.institute_id
    ),
    ([date, recordsByInstitutes]) => ({ date, recordsByInstitutes })
  )
    .map(({ date, recordsByInstitutes }) => {
      const totalRecords = sum(
        Array.from(recordsByInstitutes, ([_, records]) => records.length)
      );
      return {
        date,
        totalRecords,
        ...institutes
          .map(({ id }) => [id, recordsByInstitutes.get(id)?.length ?? 0]) // if there's no record for the given institute in that day, we're 'defaulting' it to 0
          .reduce(
            (base, [instituteId, recordsCount]) => ({
              ...base,
              [instituteId]: recordsCount,
            }),
            {}
          ),
      };
    })
    .reduce((base, current) => {
      const keysSoFar = Object.keys(base);

      if (keysSoFar.length === 0) {
        base[current.date] = current;
        return base;
      }

      const lastKey = keysSoFar[keysSoFar.length - 1];
      const lastRecord = base[lastKey];

      const nextRecord = {};
      Object.keys(lastRecord).forEach((key) => {
        if (key !== "date") {
          nextRecord[key] = lastRecord[key] + current[key];
        } else {
          nextRecord[key] = current[key];
        }
      });

      return {
        ...base,
        [current.date]: nextRecord,
      };
    }, {});
}

