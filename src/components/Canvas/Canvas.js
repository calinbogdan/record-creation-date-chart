import React, { useContext } from "react";

import HealthRecordsContext from "../../healthRecordsContext";

import StackedDataChart from "./StackedDataChart";
import Slider from "../Slider/Slider";
import HoverableArea from "./HoverableArea";
import { GridLines, Axes } from "./axisStructure";

const Canvas = ({ height, width, padding }) => {
  const innerHeight = height - 2 * padding;
  const innerWidth = width - 2 * padding;

  const { institutes } = useContext(HealthRecordsContext);

  return (
    <div>
      <span className="axis-title">Number of records</span> {/* To be moved */}
      <svg className="canvas" overflow="visible" height={height} width={width}>
        <Axes height={innerHeight} width={innerWidth} />
        <svg height={innerHeight} width={innerWidth}>
          <GridLines height={innerHeight} width={innerWidth} />
          {institutes.length > 0 && <StackedDataChart />}
        </svg>
        <HoverableArea height={innerHeight} width={innerWidth} />
      </svg>
      <Slider
        width={innerWidth}
      />
    </div>
  );
};

export default Canvas;
