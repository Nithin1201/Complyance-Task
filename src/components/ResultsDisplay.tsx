import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { SimulationResult } from '../types';

interface ResultsDisplayProps {
  results: SimulationResult;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">ROI Analysis Results</h3>
        <p className="text-gray-600">
          Based on your inputs, here's what automation can deliver
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Savings</p>
              <p className="text-2xl font-bold text-green-600">
                ${results.monthly_savings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cumulative Savings ({results.time_horizon_months}mo)</p>
              <p className="text-2xl font-bold text-blue-600">
                ${results.cumulative_savings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold text-orange-600">
                {results.payback_months} months
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ROI Percentage</p>
              <p className="text-2xl font-bold text-purple-600">
                {results.roi_percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">Net Savings After Implementation</h4>
        <p className="text-3xl font-bold text-green-600">
          ${results.net_savings.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Total savings minus one-time implementation cost
        </p>
      </div>
    </div>
  );
}
