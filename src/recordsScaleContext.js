import { createContext, useContext, useState, useEffect } from "react";
import ChartDimensionsContext from "./chartDimensionsContext";
import { useRecordsGroupedByDay } from "./healthRecordsContext";
import { max } from "d3-array";
import { scaleLinear } from "d3";


const RecordsScaleContext = createContext(null);

function useRecordsScale() {
  const { height } = useContext(ChartDimensionsContext);
  const recordsPerDay = useRecordsGroupedByDay();
  const [recordsScale, setRecordsScale] = useState(() =>
    scaleLinear()
      .domain([0, max(recordsPerDay, recordsDay => recordsDay.totalRecords)])
      .range([height, 0])
  );

  useEffect(() => {
    setRecordsScale(() =>
      scaleLinear()
        .domain([0, max(recordsPerDay, recordsDay => recordsDay.totalRecords)])
        .range([height, 0])
    );
  }, [recordsPerDay, height])

  return recordsScale;
}

export { useRecordsScale };
export default RecordsScaleContext;