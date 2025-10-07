import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SimulationInput } from '../types';

interface CalculatorFormProps {
  onCalculate: (input: SimulationInput) => void;
  loading: boolean;
  initialValues?: Partial<SimulationInput>;
}

export function CalculatorForm({ onCalculate, loading, initialValues }: CalculatorFormProps) {
  const [formData, setFormData] = useState<SimulationInput>({
    monthly_invoice_volume: initialValues?.monthly_invoice_volume || 2000,
    num_ap_staff: initialValues?.num_ap_staff || 3,
    avg_hours_per_invoice: initialValues?.avg_hours_per_invoice || 0.17,
    hourly_wage: initialValues?.hourly_wage || 30,
    error_rate_manual: initialValues?.error_rate_manual || 0.5,
    error_cost: initialValues?.error_cost || 100,
    time_horizon_months: initialValues?.time_horizon_months || 36,
    one_time_implementation_cost: initialValues?.one_time_implementation_cost || 50000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof SimulationInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Invoice Volume
          </label>
          <input
            type="number"
            value={formData.monthly_invoice_volume}
            onChange={(e) => handleChange('monthly_invoice_volume', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of AP Staff
          </label>
          <input
            type="number"
            value={formData.num_ap_staff}
            onChange={(e) => handleChange('num_ap_staff', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avg Hours per Invoice
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.avg_hours_per_invoice}
            onChange={(e) => handleChange('avg_hours_per_invoice', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">0.17 = 10 minutes</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Wage ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.hourly_wage}
            onChange={(e) => handleChange('hourly_wage', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manual Error Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.error_rate_manual}
            onChange={(e) => handleChange('error_rate_manual', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Cost ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.error_cost}
            onChange={(e) => handleChange('error_cost', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Horizon (Months)
          </label>
          <input
            type="number"
            value={formData.time_horizon_months}
            onChange={(e) => handleChange('time_horizon_months', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Implementation Cost ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.one_time_implementation_cost || 0}
            onChange={(e) => handleChange('one_time_implementation_cost', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        {loading ? 'Calculating...' : 'Calculate ROI'}
      </button>
    </form>
  );
}
