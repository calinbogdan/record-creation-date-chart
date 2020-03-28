import { createContext, useEffect, useState, useContext } from 'react';
import { group, sum } from "d3-array";

const HealthRecordsContext = createContext(null);

function useHealthRecords() {
  const { healthRecords, institutesIds } = useContext(HealthRecordsContext);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    setFilteredRecords(healthRecords
      .filter(healthRecord => institutesIds.includes(healthRecord.institute_id))
      .sort((firstRecord, secondRecord) => new Date(firstRecord.createdon).getTime() - new Date(secondRecord.createdon).getTime())
    );
  }, [healthRecords, institutesIds]);

  return filteredRecords;
}

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
  const [groupedRecords, setGroupedRecords] = useState([]);
  const healthRecords = useHealthRecords();
  const { institutesIds } = useContext(HealthRecordsContext);

  useEffect(() => {
    setGroupedRecords(
      Array.from(
        group(
          healthRecords,
          healthRecord => healthRecord.createdon,
          healthRecord => healthRecord.institute_id), ([date, institutes]) => ({ date, institutes: institutes }))
        .map(({ date, institutes }) => {
          const totalRecords = sum(Array.from(institutes, ([_, records]) => records.length));
          return {
            date,
            totalRecords,
            ...institutesIds.map(instituteId => [instituteId, institutes.get(instituteId)?.length ?? 0]) // if there's no record for the given institute in that day, we're 'defaulting' it to 0
              .reduce((base, [instituteId, recordsCount]) => ({
                ...base,
                [instituteId]: recordsCount
              }), {})
          }
        })
    );
  }, [healthRecords, institutesIds]);

  return groupedRecords;
}

export {
  useRecordsGroupedByDay,
  useHealthRecords
};
export default HealthRecordsContext;