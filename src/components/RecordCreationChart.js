import React from 'react';
import HealthRecordsContext from "../healthRecordsContext";
import Canvas from "./Canvas/Canvas";
import ChartDimensionsContext from '../chartDimensionsContext';
import RecordsScaleContext from '../recordsScaleContext';
import { TimeScaleProvider } from '../timeScaleContext';

const CANVAS_PADDING = 20;

const RecordCreationChart = ({
  healthRecords,
  institutes,
  width,
  height }) => {
  return <HealthRecordsContext.Provider value={{ healthRecords, institutes }}>
    <ChartDimensionsContext.Provider value={{
      height: height - 2 * CANVAS_PADDING,
      width: width - 2 * CANVAS_PADDING
    }}>
      <TimeScaleProvider>
        <RecordsScaleContext.Provider>
          <Canvas height={height} width={width} padding={CANVAS_PADDING} />
        </RecordsScaleContext.Provider>
      </TimeScaleProvider>
    </ChartDimensionsContext.Provider>
  </HealthRecordsContext.Provider>;
};

RecordCreationChart.defaultProps = {
  healthRecords: [],
  institutes: [],
  width: 0,
  height: 0,
  padding: 0
};

export { RecordCreationChart };
