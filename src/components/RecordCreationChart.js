import React from 'react';
import HealthRecordsContext from "../healthRecordsContext";
import Canvas from "./Canvas";


const RecordCreationChart = ({
  healthRecords,
  institutesIds,
  width,
  height,
  padding }) => {
  return <HealthRecordsContext.Provider value={{ healthRecords, institutesIds }}>
    <Canvas height={height} width={width} padding={padding} />
  </HealthRecordsContext.Provider>;
};

RecordCreationChart.defaultProps = {
  healthRecords: [],
  institutesIds: [],
  width: 0, 
  height: 0,
  padding: 0
};

export { RecordCreationChart };
