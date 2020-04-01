import React, { useContext, useMemo } from "react";
import { useStackedData } from "../../healthRecordsContext";
import TimeScaleContext from "../../timeScaleContext";
import { useRecordsScale } from "../../recordsScaleContext";
import { area } from "d3";

const COLORS = ["red", "yellow", "orange", "green", "blue"];

const StackedDataChart = () => {
  const { timeScale } = useContext(TimeScaleContext);
  const recordsScale = useRecordsScale();
  const data = useStackedData();

  const areaFrom = area()
    .x(d => timeScale(new Date(d.data.date)))
    .y0(d => recordsScale(d["0"]))
    .y1(d => recordsScale(d["1"]));

  // const stackedGraphsPath = useMemo(() => areaFrom(data));
  // const stackedGraphsLinesPath = useMemo(() => areaFrom.lineY1()(data));

  return (
    <g className="graphs">
      {data.map((data, index) => {
        return (
          <g key={index}>
            <path
              style={{
                fill: COLORS[index],
                opacity: 0.5
              }}
              // d={stackedGraphsPath}
              d={areaFrom(data)}
            />
            <path
              style={{
                fill: "none",
                strokeWidth: 1.5,
                stroke: COLORS[index]
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
