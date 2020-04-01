import React, { useContext } from 'react';
import TimeScaleContext from "../../timeScaleContext";
import HealthRecordsContext, { useRecordsGroupedByDay } from "../../healthRecordsContext";
import { timeFormat } from "d3";


const formatTimeForLegend = timeFormat("%d %b %Y");

const COLORS = ["red", "yellow", "orange", "green", "blue"];

const Circle = ({ radius, color }) => (
  <svg height={radius * 2} width={radius * 2}>
    <circle fill={color} cx={radius} cy={radius} r={radius} />
  </svg>
);

const Legend = ({ x, y }) => {
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);

  const records = useRecordsGroupedByDay();

  const day = formatTimeForLegend(timeScale.invert(x));
  const dayData = records[day];  

  return (
    <g className="legend" transform={`translate(${x}, ${y})`}>
      <foreignObject transform="translate(10, 10)" height={200} width={150}>
        <div className="legend-content">
          <div className="legend-current-date">
            {formatTimeForLegend(timeScale.invert(x))}
          </div>
          {institutes.map((institute, index) => {
            return (
              <div key={index} className="legend-institute">
                <Circle radius={4.5} color={COLORS[index]}/>
                <span>{`${institute.abbreviation}: ${dayData?.[institute.id] ?? 0}`}</span>
              </div>
            );
          })}
        </div>
      </foreignObject>
    </g>
  );
};

export default Legend;