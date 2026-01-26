import "./App.css";
import { useState } from "react";
import TestResultsConverter from "./TestResultsConverter";
import TestStatistics from "./TestStatistics";
import BugReportGenerator from "./BugReportGenerator";

function App() {
  const [testData, setTestData] = useState(null);
  const [view, setView] = useState("main"); // 'main' or 'report'

  const handleDataParsed = (data) => {
    setTestData(data);
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6 gap-3">
            {view === "main" ? (
              <button
                onClick={() => setView("report")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
              >
                Ouvrir Bug Report
              </button>
            ) : (
              <button
                onClick={() => setView("main")}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-md font-semibold"
              >
                Retour
              </button>
            )}
          </div>

          {view === "main" ? (
            <>
              <TestResultsConverter onDataParsed={handleDataParsed} />
              <TestStatistics data={testData} />
            </>
          ) : (
            <BugReportGenerator />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
