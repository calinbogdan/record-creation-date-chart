import React from "react";
import styled from "styled-components";

const HandleLine = styled.rect`
  width: 2px;
  transform: translateX(-0.5px);
  fill: #aaa;
`;

const HandleButton = styled.g`
  transform: translate(-4px, 9px);

  & > rect {
    width: 9px;
    height: 18px;
    fill: #aaa;
  }
  & > line {
    stroke: white;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Handle = props => {
  return (
    <g style={{ transform: `translateX(${props.x}px)` }} {...props}>
      <HandleLine />
      <HandleButton>
        <rect />
        <line x1="2" x2="7" y1="7" y2="7" />
        <line x1="2" x2="7" y1="11" y2="11" />
      </HandleButton>
    </g>
  );
};

export default Handle;
