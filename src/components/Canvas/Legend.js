import React, { useContext } from "react";
import TimeScaleContext from "../../contexts/timeScaleContext";
import HealthRecordsContext, {
  useRecordsGroupedByDay
} from "../../contexts/healthRecordsContext";
import { timeFormat } from "d3";
import styled from "styled-components";

const formatTimeForLegend = timeFormat("%d %b %Y");

const Circle = ({ radius, color }) => (
  <svg height={radius * 2} width={radius * 2}>
    <circle fill={color} cx={radius} cy={radius} r={radius} />
  </svg>
);

const LegendWrapper = styled.g`
  font-size: 0.75em;
  overflow: visible;
`;

const LegendContent = styled.div`
  display: inline-block;
  padding: 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  * {
    color: white;
  }
`;

const LegendCurrentDate = styled.div`
  margin: 2px;
`;

const InstituteRecordsAmount = styled.span`
  margin: 0px 4px;
`;

const Legend = ({ x, y, scale }) => {
  const { timeScale } = useContext(TimeScaleContext);
  const { institutes } = useContext(HealthRecordsContext);

  const records = useRecordsGroupedByDay();
  const dayData = records[scale(x)];

  return (
    <LegendWrapper transform={`translate(${x}, ${y})`}>
      <foreignObject transform="translate(10, 10)" height={200} width={150}>
        <LegendContent>
          <LegendCurrentDate>
            {formatTimeForLegend(timeScale.invert(x))}
          </LegendCurrentDate>
          {institutes.map((institute, index) => {
            return (
              <div key={index} className="legend-institute">
                <Circle radius={4.5} color={institute.color} />
                <InstituteRecordsAmount>
                  {`${institute.abbreviation}: ${dayData?.[institute.id] ?? 0}`}
                </InstituteRecordsAmount>
              </div>
            );
          })}
        </LegendContent>
      </foreignObject>
    </LegendWrapper>
  );
};

export default Legend;
