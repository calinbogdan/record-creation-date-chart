import React from 'react';
import HealthRecordsContext from "../healthRecordsContext";
import Canvas from "./Canvas";
import ChartDimensionsContext from '../chartDimensionsContext';
import RecordsScaleContext from '../recordsScaleContext';
import { TimeScaleProvider } from '../timeScaleContext';


const RecordCreationChart = ({
  healthRecords,
  institutesIds,
  width,
  height,
  padding }) => {
  return <HealthRecordsContext.Provider value={{ healthRecords, institutesIds }}>
    <ChartDimensionsContext.Provider value={{
      height: height - 2 * padding,
      width: width - 2 * padding
    }}>
      <TimeScaleProvider>
        <RecordsScaleContext.Provider>
          <Canvas height={height} width={width} padding={padding} />
        </RecordsScaleContext.Provider>
      </TimeScaleProvider>
    </ChartDimensionsContext.Provider>
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
