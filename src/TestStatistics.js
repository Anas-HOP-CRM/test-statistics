import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { data as defaultData } from "./Data";

const TestStatistics = ({ data }) => {
  const [expandedSuites, setExpandedSuites] = useState({});
  const testSuites = data || defaultData;

  const toggleSuite = (index) => {
    setExpandedSuites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.total, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0);
  const totalSkipped = testSuites.reduce(
    (sum, suite) => sum + (suite.skipped || 0),
    0
  );
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "skipped":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "skipped":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Only show if data is provided
  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Statistiques des Tests Laravel
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Total Tests
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalTests}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Réussis</div>
          <div className="text-3xl font-bold text-green-600">{totalPassed}</div>
          <div className="text-sm text-gray-500 mt-1">
            {successRate}% de réussite
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Échoués</div>
          <div className="text-3xl font-bold text-red-600">{totalFailed}</div>
          <div className="text-sm text-gray-500 mt-1">
            {((totalFailed / totalTests) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Ignorés</div>
          <div className="text-3xl font-bold text-yellow-600">
            {totalSkipped}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((totalSkipped / totalTests) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Progression Globale
          </h2>
          <span className="text-sm font-medium text-gray-600">
            {successRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{totalPassed} réussis</span>
          <span>{totalFailed} échoués</span>
          <span>{totalSkipped} ignorés</span>
        </div>
      </div>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite, index) => {
          const suiteSuccessRate = ((suite.passed / suite.total) * 100).toFixed(
            1
          );
          const isExpanded = expandedSuites[index];

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSuite(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {suite.name.split("\\").pop()}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {suite.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {suite.passed}/{suite.total}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suiteSuccessRate}%
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        {suite.passed}
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" />
                        {suite.failed}
                      </span>
                      {suite.skipped > 0 && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="w-4 h-4" />
                          {suite.skipped}
                        </span>
                      )}
                    </div>

                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${suiteSuccessRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && suite.tests && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-4 space-y-2">
                    {suite.tests.map((test, testIndex) => (
                      <div
                        key={testIndex}
                        className="flex items-center justify-between py-2 px-3 bg-white rounded hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className={getStatusColor(test.status)}>
                            {getStatusIcon(test.status)}
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {test.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestStatistics;
