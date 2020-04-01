import React, { useContext } from "react";
import { useStackedData } from "../../contexts/healthRecordsContext";
import TimeScaleContext from "../../contexts/timeScaleContext";
import { useRecordsScale } from "../../contexts/recordsScaleContext";
import { area } from "d3";

const StackedDataChart = () => {
  const { timeScale } = useContext(TimeScaleContext);
  const recordsScale = useRecordsScale();
  const data = useStackedData();

  console.log(data);

  const areaFrom = area()
    .x(d => timeScale(new Date(d.data.date)))
    .y0(d => recordsScale(d["0"]))
    .y1(d => recordsScale(d["1"]));

  return (
    <g className="graphs">
      {data.map((data, index) => {
        return (
          <g key={index}>
            <path
              style={{
                fill: data.instituteData.color,
                opacity: 0.8
              }}
              // d={stackedGraphsPath}
              d={areaFrom(data)}
            />
            <path
              style={{
                fill: "none",
                strokeWidth: 1,
                stroke: data.instituteData.color
              }}
              // d={stackedGraphsLinesPath}
              d={areaFrom.lineY1()(data)}
            />
          </g>
        );
      })}
    </g>
  );
};

export default StackedDataChart;
