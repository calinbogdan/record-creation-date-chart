import React from "react";
import styled from "styled-components";

const Wrapper = styled.svg`
  margin-left: 16px;
  height: 5px;
  width: 10px;
`;

const Arrow = ({ up }) => {
  return (
    <Wrapper>
      <polygon
        transform={`rotate(${up ? 180 : 0} 5 2.5)`}
        points="0,0 10,0 5,5"
      />
    </Wrapper>
  );
};

export default Arrow;
