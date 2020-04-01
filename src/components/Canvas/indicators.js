import React from 'react';
import styled from "styled-components";

const IndicatorText = styled.span`
  font: 12px sans-serif;
  background: black;
  color: white;
  padding: 2px 5px;
  position: absolute;
`;

const IndicatorContainer = styled.foreignObject`
  overflow: visible;
`;

const RecordsCountIndicator = ({ y, children }) => {
  return (
    <IndicatorContainer y={y} height={50} width={5}>
      <IndicatorText
        style={{
          transform: "translateX(-100%) translateX(-7px) translateY(-50%)"
        }}
      >
        {children}
      </IndicatorText>
    </IndicatorContainer>
  );
};

const TimeIndicator = ({ x, y, children }) => (
  <IndicatorContainer x={x} y={y} height={30} width={100}>
    <IndicatorText
      style={{
        transform: "translateX(-50%)",
        marginTop: "7px"
      }}
    >
      {children}
    </IndicatorText>
  </IndicatorContainer>
);

export { TimeIndicator, RecordsCountIndicator };