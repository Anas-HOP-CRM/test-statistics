import "./App.css";
import { useState } from "react";
import TestResultsConverter from "./TestResultsConverter";
import TestStatistics from "./TestStatistics";

function App() {
  const [testData, setTestData] = useState(null);

  const handleDataParsed = (data) => {
    setTestData(data);
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <TestResultsConverter onDataParsed={handleDataParsed} />
          <TestStatistics data={testData} />
        </div>
      </div>
    </div>
  );
}

export default App;
