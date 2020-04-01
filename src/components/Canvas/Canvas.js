import React, { useContext } from "react";

import HealthRecordsContext from "../../contexts/healthRecordsContext";

import StackedDataChart from "./StackedDataChart";
import HoverableArea from "./HoverableArea";
import { GridLines, Axes } from "./axisStructure";
import CanvasDimensionsContext from "../../contexts/canvasDimensionsContext";

const Canvas = () => {
  const { width, height } = useContext(CanvasDimensionsContext);
  const { institutes } = useContext(HealthRecordsContext);

  return (
    <svg overflow="visible" height={height} width={width}>
      <Axes height={height} width={width} />
      <svg height={height} width={width}>
        <GridLines height={height} width={width} />
        {institutes.length > 0 && <StackedDataChart />}
      </svg>
      <HoverableArea height={height} width={width} />
    </svg>
  );
};

export default Canvas;
