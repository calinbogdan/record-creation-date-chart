import React, { useState, useEffect, useCallback, useRef } from "react";
import InstituteListItem from "./InstituteListItem";
import InstitutesContext from "./institutesContext";

import Arrow from "./Arrow";
import InstituteSelectorTitle from "./InstituteSelectorTitle";
import styled from "styled-components";

function mapInstituteArray(institutes) {
  return institutes.map(institute => ({
    id: institute.instituteId,
    name: institute.instituteName,
    abbreviation: institute.instituteAbbreviation,
    selected: false,
    color: institute.color
  }));
}

function onlySelected(institutes) {
  return institutes.filter(({ selected }) => selected);
}

function mapSelected(institutes, selected) {
  return institutes.map(institute => ({
    ...institute,
    selected: selected
  }));
}

const SelectorButtonGroup = styled.div`
  display: flex;
  border-radius: 4px;
  border: 1px solid #ccc;
  & > button {
    flex-grow: 0.5;
    background: #eee;
    border: none;
    padding: 8px;
  }
  & > button:hover {
    cursor: pointer;
    background: #ddd;
  }
  & > button:focus {
    outline: 0;
  }
`;

const SelectorMenu = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;

  & > ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const SelectorBar = styled.div`
  width: 300px;
  display: inline-flex;
  align-items: center;
  background: #ddd;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #bbb;

  &:hover {
    cursor: pointer;
    background: #ccc;
  }
`;

const Wrapper = styled.div`
  margin: 8px 16px;
  display: inline-block;
`;

const InstituteSelector = ({
  institutes: institutesArray,
  onSelectionChanged
}) => {
  const selectorRef = useRef();
  const [open, setOpen] = useState(false);
  const [institutes, setInstitutes] = useState(
    mapInstituteArray(institutesArray)
  );

  useEffect(() => {
    setInstitutes(mapInstituteArray(institutesArray));
  }, [institutesArray]);

  const selectAllListener = useCallback(() => {
    setInstitutes(mapSelected(institutes, true));
  }, [institutes]);

  const deselectAllListener = useCallback(() => {
    setInstitutes(mapSelected(institutes, false));
  }, [institutes]);

  useEffect(() => {
    onSelectionChanged(onlySelected(institutes));
  }, [institutes, onSelectionChanged]);

  return (
    <Wrapper ref={selectorRef}>
      <InstitutesContext.Provider
        value={{
          institutes,
          setInstituteSelected: (instituteId, isSelected) => {
            const newInstitutesArray = institutes.map(institute => {
              if (institute.id === instituteId) {
                return {
                  ...institute,
                  selected: isSelected
                };
              }
              return institute;
            });
            setInstitutes(newInstitutesArray);
          }
        }}
      >
        <SelectorBar onClick={() => setOpen(value => !value)}>
          <InstituteSelectorTitle
            count={institutes.filter(({ selected }) => selected).length}
          />
          <Arrow up={open} />
        </SelectorBar>
        {open && (
          <SelectorMenu>
            <SelectorButtonGroup>
              <button onClick={selectAllListener}>Select all</button>
              <button onClick={deselectAllListener}>Deselect all</button>
            </SelectorButtonGroup>
            <ul>
              {institutes.map(({ id, name, abbreviation, selected }, index) => (
                <InstituteListItem
                  key={index}
                  id={id}
                  name={name}
                  abbreviation={abbreviation}
                  selected={selected}
                />
              ))}
            </ul>
          </SelectorMenu>
        )}
      </InstitutesContext.Provider>
    </Wrapper>
  );
};

export default InstituteSelector;
