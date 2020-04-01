import React, { useState, useCallback } from "react";
import "./App.css";
import { results as healthRecords } from "./assets/records";
import { results as institutes } from "./assets/institutes";
import { RecordCreationChart } from "./components/RecordCreationChart";
import InstituteSelector from "./components/InstituteSelector/InstituteSelector";

const CHART_HEIGHT = 400;
const CHART_WIDTH = 1200;

function App() {
  const [selectedInstitutes, setSelectedInstitutes] = useState(institutes);

  const selectionChangedListener = useCallback(selectedIds => {
    setSelectedInstitutes(selectedIds);
  }, [setSelectedInstitutes]);

  return (
    <React.Fragment>
      <InstituteSelector
        institutes={institutes}
        onSelectionChanged={selectionChangedListener}
      />
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
