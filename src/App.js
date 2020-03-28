import React, { useState } from "react";
import "./App.css";
import { results as healthRecords } from "./assets/records";
import { results as institutes } from "./assets/institutes";
import { RecordCreationChart } from "./components/RecordCreationChart";
import InstituteSelector from "./components/InstituteSelector/InstituteSelector";

const CHART_HEIGHT = 600;
const CHART_WIDTH = 1024;

const institutesIds = institutes.map(({ instituteId }) => instituteId);

function App() {
  const [selectedInstitutesIds, setSelectedInstitutes] = useState(institutesIds);

  return (
    <React.Fragment>
      <InstituteSelector
        institutes={institutes}
        onSelectionChanged={selectedIds => setSelectedInstitutes(selectedIds)}
      />
      <RecordCreationChart
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        padding={25}
        healthRecords={healthRecords}
        institutesIds={selectedInstitutesIds}
        selectedIds={selectedInstitutesIds}
      />
    </React.Fragment>
  );
}

export default App;
