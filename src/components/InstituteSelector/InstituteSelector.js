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
  useEffect(() => {
    const mouseDownListener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onClickOutside();
    };

    document.addEventListener("mousedown", mouseDownListener);
    return () => {
      document.removeEventListener("mousedown", mouseDownListener);
    };
  });
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

const SelectedInstitutesTitle = ({ count }) => (
  <span>{getInstitutesSelectedTitle(count)}</span>
);

const InstituteSelector = ({
  institutes: institutesArray,
  onSelectionChanged
}) => {
  const menuRef = useRef();
  const [open, setOpen] = useState(true);
  const [institutes, setInstitutes] = useState(
    mapInstituteArray(institutesArray)
  );

  useOnClickOutside(menuRef, () => setOpen(false));

  useEffect(() => {
    setInstitutes(mapInstituteArray(institutesArray));
  }, [institutesArray]);

  const selectAllListener = useCallback(() => {
    setInstitutes(institutes =>
      institutes.map(institute => ({
        ...institute,
        selected: true
      }))
    );
  }, [setInstitutes]);

  const deselectAllListener = useCallback(() => {
    setInstitutes(institutes =>
      institutes.map(institute => ({
        ...institute,
        selected: false
      }))
    );
  }, [setInstitutes]);

  return (
    <div className="selector">
      <InstitutesContext.Provider
        value={{
          institutes,
          setInstituteSelected: (instituteId, isSelected) => {
            setInstitutes(institutes =>
              institutes.map(institute => {
                if (institute.id === instituteId) {
                  return {
                    ...institute,
                    selected: isSelected
                  };
                }
                return institute;
              })
            );
            onSelectionChanged(institutes.map(({ id }) => id));
          }
        }}
      >
        <div className="selector-bar" onClick={() => setOpen(value => !value)}>
          <SelectedInstitutesTitle
            count={institutes.filter(({ selected }) => selected).length}
          />
          <Arrow up={open} />
        </div>
        <div ref={menuRef} className={`menu ${!open && "hidden"}`}>
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
      </InstitutesContext.Provider>
    </div>
  );
};

export default InstituteSelector;
