import React, { useContext, useCallback } from 'react';
import InstitutesContext from "./institutesContext";

const Tick = ({ visible }) => (
  <svg className={`tick ${visible ? "" : "hidden"}`}>
    <polygon points="0,5 4,9 11,2 9,0 4,5 2,3" />
  </svg>
);

const InstituteListItem = ({ id, name, abbreviation, selected }) => {
  const { setInstituteSelected } = useContext(InstitutesContext);

  const clickListener = useCallback(() => {
    setInstituteSelected(id, !selected)
  }, [id, selected, setInstituteSelected]);
  return (
    <li className="selector-institute-list-item"
      onClick={clickListener}>
      <span>{`${name} (${abbreviation})`}</span>
      <Tick visible={selected} />
    </li>
  );
};

export default InstituteListItem;