import React, { createContext, useState, useEffect, useContext } from "react";
import { useHealthRecords } from "./healthRecordsContext";
import { extent } from "d3-array";
import ChartDimensionsContext from "./chartDimensionsContext";
import { scaleTime } from "d3";

const TimeScaleContext = createContext(null);

const TimeScaleProvider = ({ children }) => {
  const healthRecords = useHealthRecords();
  const { width } = useContext(ChartDimensionsContext);  

  const [domain, setDomain] = useState([new Date(), new Date()]);
  const [fullDomain, setFullDomain] = useState([new Date(), new Date()]);
  const [range, setRange] = useState([0, 0]);
  
  const [timeScale, setTimeScale] = useState(
    () => scaleTime(domain, range)
  );

  const [fullTimeScale, setFullTimeScale] = useState(
    () => scaleTime(fullDomain, range)
  );

  useEffect(() => {
    setTimeScale(
      () => scaleTime(domain, range)
    );
  }, [domain, range, width]);

  useEffect(() => {
    const newDomain = extent(
      healthRecords.map(healthRecord => new Date(healthRecord.createdon))
    );

    setFullTimeScale(
      () => scaleTime(newDomain, range)
    );
    setFullDomain(newDomain);
    setDomain(newDomain);
  }, [range, healthRecords]);

  useEffect(() => {
    setRange([0, width]);
  }, [width])

  return <TimeScaleContext.Provider value={{
    fullRange: range, 
    domain,
    timeScale,
    startX: fullTimeScale(domain[0]),
    endX: fullTimeScale(domain[1]),
    onStartHandleMoved: newPosX => {
      setDomain(([_, endDate]) => [fullTimeScale.invert(newPosX), endDate]);
    },
    onEndHandleMoved: newPosX => {
      setDomain(([startDate, _]) => [startDate, fullTimeScale.invert(newPosX)]);
    }
  }}>
    {children}
  </TimeScaleContext.Provider>;
}

function useTimeScale() {
  const { timeScale } = useContext(TimeScaleContext);
  return timeScale;
}

export {
  TimeScaleProvider,
  useTimeScale
}
export default TimeScaleContext;