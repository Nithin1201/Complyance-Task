export interface SimulationInput {
  name?: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost?: number;
}

export interface SimulationResult extends SimulationInput {
  monthly_savings: number;
  cumulative_savings: number;
  net_savings: number;
  payback_months: number;
  roi_percentage: number;
}

export interface Scenario extends SimulationResult {
  id: string;
  created_at: string;
}
