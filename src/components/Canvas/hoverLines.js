import React from 'react';

const HorizontalHoverLine = ({ y, width }) => (
  <line x1={0} x2={width} y1={y} y2={y} stroke="gray" strokeDasharray="6" />
);

const VerticalHoverLine = ({ x, height }) => (
  <line
    x1={x}
    x2={x}
    y1={0}
    y2={height}
    stroke="gray"
    strokeDasharray="6"
    strokeWidth={0.2}
  />
);

export { HorizontalHoverLine, VerticalHoverLine };