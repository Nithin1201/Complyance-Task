import { useState, useEffect } from 'react';
import { Calculator as CalcIcon } from 'lucide-react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ScenarioManager } from './components/ScenarioManager';
import { SimulationInput, SimulationResult, Scenario } from './types';
import { api } from './lib/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentInput, setCurrentInput] = useState<SimulationInput>({
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  });

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const data = await api.getScenarios();
      setScenarios(data);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const handleCalculate = async (input: SimulationInput) => {
    setLoading(true);
    setCurrentInput(input);
    try {
      const result = await api.simulate(input);
      setResults(result);
    } catch (error) {
      console.error('Failed to calculate:', error);
      alert('Failed to calculate ROI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (name: string) => {
    if (!results) return;

    setLoading(true);
    try {
      await api.saveScenario({ ...currentInput, name });
      await loadScenarios();
      alert('Scenario saved successfully!');
    } catch (error) {
      console.error('Failed to save scenario:', error);
      alert('Failed to save scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (scenario: Scenario) => {
    setCurrentInput(scenario);
    setResults(scenario);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scenario?')) return;

    setLoading(true);
    try {
      await api.deleteScenario(id);
      await loadScenarios();
    } catch (error) {
      console.error('Failed to delete scenario:', error);
      alert('Failed to delete scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (email: string) => {
    if (!results) return;

    setLoading(true);
    try {
      const blob = await api.generateReport(email, currentInput);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roi-report.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-3 rounded-xl">
              <CalcIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Invoicing ROI Calculator
              </h1>
              <p className="text-gray-600">
                Calculate your cost savings by automating invoice processing
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Business Metrics
            </h2>
            <CalculatorForm
              onCalculate={handleCalculate}
              loading={loading}
              initialValues={currentInput}
            />
          </div>

          <div className="space-y-6">
            {results && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ResultsDisplay results={results} />
              </div>
            )}

            {results && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Scenario Management
                </h3>
                <ScenarioManager
                  currentInput={currentInput}
                  scenarios={scenarios}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                  onGenerateReport={handleGenerateReport}
                  loading={loading}
                />
              </div>
            )}

            {!results && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <CalcIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter your business metrics and click Calculate ROI to see results
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Enter your current invoicing metrics in the form</li>
            <li>• View instant ROI calculations showing automation benefits</li>
            <li>• Save scenarios to compare different configurations</li>
            <li>• Generate downloadable reports to share with stakeholders</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
