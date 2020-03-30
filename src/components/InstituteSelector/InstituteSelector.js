import React, { useState, useEffect, useCallback, useRef } from "react";
import InstituteListItem from "./InstituteListItem";
import InstitutesContext from "./institutesContext";

const Arrow = ({ up }) => {
  return (
    <svg className="arrow" height={5} width={10}>
      <polygon
        transform={`rotate(${up ? 180 : 0} 5 2.5)`}
        points="0,0 10,0 5,5"
      />
    </svg>
  );
};

function useOnClickOutside(ref, onClickOutside) {
  const mouseMoveListener = useCallback(event => {
    console.log("mouse is moving");
    if (!ref.current || ref.current.contains(event.target)) {
      return;
    }
    onClickOutside();
  }, [onClickOutside, ref])

  useEffect(() => {
    document.addEventListener("mousemove", mouseMoveListener);
    return () => {
      console.log("Effect clear was triggered");
      document.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [mouseMoveListener, onClickOutside, ref]);
}

function mapInstituteArray(institutes) {
  return institutes.map(institute => ({
    id: institute.instituteId,
    name: institute.instituteName,
    abbreviation: institute.instituteAbbreviation,
    selected: false
  }));
}

function getInstitutesSelectedTitle(length) {
  if (length === 0) {
    return "no institute selected";
  } else if (length === 1) {
    return "1 institute selected";
  }
  return `${length} institutes selected`;
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

const SelectedInstitutesTitle = ({ count }) => (
  <span>{getInstitutesSelectedTitle(count)}</span>
);

const InstituteSelector = ({
  institutes: institutesArray,
  onSelectionChanged
}) => {
  const menuRef = useRef();
  const [open, setOpen] = useState(false);
  const [institutes, setInstitutes] = useState(
    mapInstituteArray(institutesArray)
  );

  // useOnClickOutside(menuRef, () => setOpen(false));

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
    <div className="selector" ref={menuRef}>
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
        <div className="selector-bar" onClick={() => setOpen(value => !value)}>
          <SelectedInstitutesTitle
            count={institutes.filter(({ selected }) => selected).length}
          />
          <Arrow up={open} />
        </div>
        {open && (
          <div className="menu">
            <div className="selector-button-group">
              <button onClick={selectAllListener}>Select all</button>
              <button onClick={deselectAllListener}>Deselect all</button>
            </div>
            <ul className="selector-institute-list">
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
          </div>
        )}
      </InstitutesContext.Provider>
    </div>
  );
};

export default InstituteSelector;
