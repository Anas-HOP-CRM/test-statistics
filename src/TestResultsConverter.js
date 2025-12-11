import React, { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function TestResultsConverter({ onDataParsed }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const parseTestResults = (content) => {
    const lines = content.split("\n");
    const testSuites = [];
    let currentSuite = null;
    let currentTests = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect test suite header (FAIL or PASS followed by test class name)
      if (line.match(/^(FAIL|PASS)\s+/)) {
        // Save previous suite if exists
        if (currentSuite) {
          testSuites.push({
            ...currentSuite,
            tests: currentTests,
          });
        }

        // Extract suite name
        const match = line.match(
          /^(?:FAIL|PASS)\s+(.+?)(?:\s+-\s+\d+\s+todos?)?$/
        );
        if (match) {
          currentSuite = {
            name: match[1].trim(),
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
          };
          currentTests = [];
        }
      }

      // Detect test cases
      if (line.match(/^[✓⨯↓-]/)) {
        let status = "unknown";
        let testName = "";

        if (line.startsWith("✓")) {
          status = "passed";
          testName = line
            .substring(1)
            .split(/\s+\d+\.\d+s$/)[0]
            .trim();
        } else if (line.startsWith("⨯")) {
          status = "failed";
          testName = line
            .substring(1)
            .split(/\s+\d+\.\d+s$/)[0]
            .trim();
        } else if (line.startsWith("↓") || line.startsWith("-")) {
          status = "skipped";
          testName = line
            .substring(1)
            .split(/\s+\d+\.\d+s$/)[0]
            .trim();
        }

        if (testName && currentSuite) {
          currentTests.push({
            name: testName,
            status: status,
          });

          currentSuite.total++;
          if (status === "passed") currentSuite.passed++;
          if (status === "failed") currentSuite.failed++;
          if (status === "skipped") currentSuite.skipped++;
        }
      }
    }

    // Add last suite
    if (currentSuite) {
      testSuites.push({
        ...currentSuite,
        tests: currentTests,
      });
    }

    return testSuites;
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setProcessing(true);

    try {
      const text = await uploadedFile.text();
      const data = parseTestResults(text);

      if (data.length === 0) {
        setError("No test suites found in the file. Please check the format.");
        setParsedData(null);
      } else {
        setParsedData(data);
        // Notify parent component of parsed data
        onDataParsed(data);
      }
    } catch (err) {
      setError(`Error reading file: ${err.message}`);
      setParsedData(null);
    } finally {
      setProcessing(false);
    }
  };

  const downloadDataJs = () => {
    if (!parsedData) return;

    const jsContent = `export const data = ${JSON.stringify(
      parsedData,
      null,
      4
    )};`;
    const blob = new Blob([jsContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalStats = () => {
    if (!parsedData) return { total: 0, passed: 0, failed: 0, skipped: 0 };

    return parsedData.reduce(
      (acc, suite) => ({
        total: acc.total + suite.total,
        passed: acc.passed + suite.passed,
        failed: acc.failed + suite.failed,
        skipped: acc.skipped + suite.skipped,
      }),
      { total: 0, passed: 0, failed: 0, skipped: 0 }
    );
  };

  const stats = getTotalStats();

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Test Results Converter
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        Upload your PHP Artisan test results file to convert it into a data.js
        format
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          id="file-upload"
          accept=".txt,.log"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-lg font-medium text-gray-700 mb-2">
            {file ? file.name : "Choose a file or drag it here"}
          </span>
          <span className="text-sm text-gray-500">
            Supported formats: .txt, .log
          </span>
        </label>
      </div>

      {processing && (
        <div className="mt-4 text-center text-blue-600">Processing file...</div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {parsedData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Passed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.passed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failed}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Skipped</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.skipped}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Parsed Test Suites ({parsedData.length})
            </h2>
            <button
              onClick={downloadDataJs}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download data.js
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {parsedData.map((suite, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">{suite.name}</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ {suite.passed}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      ⨯ {suite.failed}
                    </span>
                    {suite.skipped > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        ↓ {suite.skipped}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {suite.tests.length} test{suite.tests.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
