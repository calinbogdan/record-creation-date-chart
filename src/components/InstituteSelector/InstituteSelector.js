import React, { useState, useEffect } from "react";
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

function instituteArrayToMap(institutes) {
  return institutes.reduce(
    (map, institute) => ({
      ...map,
      [institute.instituteId]: {
        id: institute.instituteId,
        name: institute.instituteName,
        abbreviation: institute.instituteAbbreviation,
        selected: false
      }
    }),
    {}
  );
}

const InstituteSelector = ({ institutes: institutesArray, onSelectionChanged }) => {
  const [open, setOpen] = useState(true);
  const [institutes, setInstitutes] = useState(
    instituteArrayToMap(institutesArray)
  );

  useEffect(() => {
    setInstitutes(instituteArrayToMap(institutesArray));
  }, [institutesArray]);

  return (
    <div className="selector">
      <InstitutesContext.Provider
        value={{
          institutes,
          setInstituteSelected: (instituteId, isSelected) => {
            const institute = institutes[instituteId];
            setInstitutes({
              ...institutes,
              [instituteId]: {
                ...institute,
                selected: isSelected
              }
            });

            onSelectionChanged(
              Object.values(institutes)
                .filter(({ selected }) => selected)
                .map(({ id }) => id)
            );
          }
        }}>
        <p>Institute(s)</p>
        <div className="selector-bar" onClick={() => setOpen(value => !value)}>
          <span>6 institutes selected</span>
          <Arrow up={open} />
        </div>
        <div className={`menu ${!open && "hidden"}`}>
          <div className="selector-button-group">
            <button>Select all</button>
            <button>Deselect all</button>
          </div>
          <ul className="selector-institute-list">
            {Object.values(institutes).map(
              ({ id, name, abbreviation, selected }, index) => (
                <InstituteListItem
                  key={index}
                  id={id}
                  name={name}
                  abbreviation={abbreviation}
                  selected={selected}
                />
              )
            )}
          </ul>
        </div>
      </InstitutesContext.Provider>
    </div>
  );
};

export default InstituteSelector;
