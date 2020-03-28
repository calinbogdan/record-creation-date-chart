import React, { createContext, useState, useEffect, useContext } from "react";
import { useHealthRecords } from "./healthRecordsContext";
import { extent } from "d3-array";
import ChartDimensionsContext from "./chartDimensionsContext";
import { scaleTime } from "d3";

const TimeScaleContext = createContext(null);

const TimeScaleProvider = ({ children }) => {
  const healthRecords = useHealthRecords();

  const [domain, setDomain] = useState([new Date(), new Date()]);
  const [fullDomain, setFullDomain] = useState([new Date(), new Date()]);

  useEffect(() => {
    const newDomain = extent(
      healthRecords.map(healthRecord => new Date(healthRecord.createdon))
    );

    setFullDomain(newDomain);
    setDomain(newDomain);
  }, [healthRecords]);

  return <TimeScaleContext.Provider value={{ domain, fullDomain }}>
    {children}
  </TimeScaleContext.Provider>;
}

function useTimeScale() {
  const { domain } = useContext(TimeScaleContext);
  const { width } = useContext(ChartDimensionsContext);
  const [timeScale, setTimeScale] = useState(
    () => scaleTime(domain, [0, width])
  );

  useEffect(() => {
    setTimeScale(
      () => scaleTime(domain, [0, width])
    );
  }, [domain, width]);

  return timeScale;
}

export {
  TimeScaleProvider,
  useTimeScale
}
export default TimeScaleContext;