import { useState } from 'react';
import { Save, Download, Trash2, FolderOpen } from 'lucide-react';
import { SimulationInput, Scenario } from '../types';

interface ScenarioManagerProps {
  currentInput: SimulationInput;
  scenarios: Scenario[];
  onSave: (name: string) => void;
  onLoad: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
  onGenerateReport: (email: string) => void;
  loading: boolean;
}

export function ScenarioManager({
  currentInput,
  scenarios,
  onSave,
  onLoad,
  onDelete,
  onGenerateReport,
  loading,
}: ScenarioManagerProps) {
  const [scenarioName, setScenarioName] = useState('');
  const [email, setEmail] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const handleSave = () => {
    if (scenarioName.trim()) {
      onSave(scenarioName);
      setScenarioName('');
      setShowSaveModal(false);
    }
  };

  const handleGenerateReport = () => {
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onGenerateReport(email);
      setEmail('');
      setShowReportModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Save Scenario
        </button>

        <button
          onClick={() => setShowLoadModal(true)}
          disabled={loading || scenarios.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <FolderOpen className="w-4 h-4" />
          Load Scenario ({scenarios.length})
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          disabled={loading || !currentInput.monthly_invoice_volume}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Save Scenario</h3>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Enter scenario name (e.g., Q4_Pilot)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Generate Report</h3>
            <p className="text-gray-600 mb-4">
              Enter your email to receive and download your ROI report
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleGenerateReport}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                Generate
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Load Scenario</h3>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
                    <p className="text-sm text-gray-600">
                      {scenario.monthly_invoice_volume.toLocaleString()} invoices/mo •
                      ${scenario.monthly_savings.toLocaleString()} savings/mo
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLoad(scenario);
                        setShowLoadModal(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDelete(scenario.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLoadModal(false)}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
