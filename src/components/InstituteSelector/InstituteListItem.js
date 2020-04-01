import React, { useContext, useCallback } from "react";
import InstitutesContext from "./institutesContext";
import styled from "styled-components";

const TickWrapper = styled.svg`
  height: 9px;
  width: 11px;
  margin-left: 8px;
  fill: #777;
`;

const Tick = ({ visible }) => (
  <TickWrapper>
    <polygon points="0,5 4,9 11,2 9,0 4,5 2,3" fillOpacity={visible ? 1 : 0} />
  </TickWrapper>
);

const ListItemWrapper = styled.li`
  padding: 4px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: #ddd;
    cursor: pointer;
  }
`;

const InstituteListItem = ({ id, name, abbreviation, selected }) => {
  const { setInstituteSelected } = useContext(InstitutesContext);

  const clickListener = useCallback(() => {
    setInstituteSelected(id, !selected);
  }, [id, selected, setInstituteSelected]);
  return (
    <ListItemWrapper onClick={clickListener}>
      <span>{`${name} (${abbreviation})`}</span>
      <Tick visible={selected} />
    </ListItemWrapper>
  );
};

export default InstituteListItem;
