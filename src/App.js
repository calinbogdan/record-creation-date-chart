import React, { useState, useCallback } from "react";
import { results as healthRecords } from "./assets/records";
import { results as institutes } from "./assets/institutes";
import { RecordCreationChart } from "./components/RecordCreationChart";
import InstituteSelector from "./components/InstituteSelector/InstituteSelector";

const CHART_HEIGHT = 400;
const CHART_WIDTH = 1300;

function mapInstituteArray(institutes) {
  return institutes.map(institute => ({
    id: institute.instituteId,
    name: institute.instituteName,
    abbreviation: institute.instituteAbbreviation,
    selected: false,
    color: institute.color
  }));
}

function App() {
  const [selectedInstitutes, setSelectedInstitutes] = useState(mapInstituteArray(institutes));

  const selectionChangedListener = useCallback(selectedIds => {
    setSelectedInstitutes(selectedIds);
  }, [setSelectedInstitutes]);

  return (
    <React.Fragment>
      {/* <InstituteSelector
        institutes={institutes}
        onSelectionChanged={selectionChangedListener}
      /> */}
      <RecordCreationChart
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        healthRecords={healthRecords}
        institutes={selectedInstitutes}
      />
    </React.Fragment>
  );
}

export default App;
