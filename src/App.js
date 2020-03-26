import React from 'react';
import './App.css';
import { results as healthRecords } from "./assets/records";
import { results as institutes } from "./assets/institutes";
import { RecordCreationChart } from './components/RecordCreationChart';

const CHART_HEIGHT = 600;
const CHART_WIDTH = 800;

function App() {
  return <div>
    <RecordCreationChart 
      height={CHART_HEIGHT}
      width={CHART_WIDTH}
      padding={25}
      healthRecords={healthRecords}
      institutesIds={institutes.map(i => i.instituteId)}/>
  </div>
}

export default App;
