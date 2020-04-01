import React from "react";
import HealthRecordsContext from "../contexts/healthRecordsContext";
import Canvas from "./Canvas/Canvas";
import CanvasDimensionsContext from "../contexts/canvasDimensionsContext";
import RecordsScaleContext from "../contexts/recordsScaleContext";
import { TimeScaleProvider } from "../contexts/timeScaleContext";

import Slider from "../components/Slider/Slider";
import styled from "styled-components";

const TEXT_WIDTH = 50;
const PADDING_RIGHT = 8;
const PADDING_VERTICAL = 8;
const SLIDER_SIZE = 36;
const CHART_TO_SLIDER = 32;

const Wrapper = styled.div`
  display: inline-flex;
`;

const ChartWrapper = styled.div`
  padding: 4px 0;
  padding-right: 8px;
`;

const CanvasWrapper = styled.div`
  padding-bottom: 32px;
  display: flex;
`;

const TextWrapper = styled.span`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
  width: ${TEXT_WIDTH}px;
  height: ${props => props.height}px;
  font-size: 0.75em;
`;

const RecordCreationChart = ({ healthRecords, institutes, width, height }) => {
  const actualCanvasWidth = width - PADDING_RIGHT - TEXT_WIDTH;
  const actualCanvasHeight =
    height - SLIDER_SIZE - CHART_TO_SLIDER - PADDING_VERTICAL;
  return (
    <HealthRecordsContext.Provider value={{ healthRecords, institutes }}>
      <CanvasDimensionsContext.Provider
        value={{
          height: actualCanvasHeight,
          width: actualCanvasWidth
        }}
      >
        <TimeScaleProvider>
          <RecordsScaleContext.Provider>
            <Wrapper>
              <div>
                <TextWrapper height={actualCanvasHeight}>
                  Number of records
                </TextWrapper>
              </div>
              <ChartWrapper>
                <CanvasWrapper>
                  <Canvas />
                </CanvasWrapper>
                <Slider width={actualCanvasWidth} />
              </ChartWrapper>
            </Wrapper>
          </RecordsScaleContext.Provider>
        </TimeScaleProvider>
      </CanvasDimensionsContext.Provider>
    </HealthRecordsContext.Provider>
  );
};

RecordCreationChart.defaultProps = {
  healthRecords: [],
  institutes: [],
  width: 0,
  height: 0,
  padding: 0
};

export { RecordCreationChart };
