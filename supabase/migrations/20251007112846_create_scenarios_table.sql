/*
  # Create ROI Calculator Scenarios Table

  1. New Tables
    - `scenarios`
      - `id` (uuid, primary key) - Unique identifier for each scenario
      - `name` (text) - User-friendly name for the scenario
      - `monthly_invoice_volume` (integer) - Number of invoices per month
      - `num_ap_staff` (integer) - Number of AP staff
      - `avg_hours_per_invoice` (decimal) - Average hours spent per invoice
      - `hourly_wage` (decimal) - Average hourly wage
      - `error_rate_manual` (decimal) - Manual error rate percentage
      - `error_cost` (decimal) - Cost to fix each error
      - `time_horizon_months` (integer) - Projection period in months
      - `one_time_implementation_cost` (decimal) - Setup cost
      - `monthly_savings` (decimal) - Calculated monthly savings
      - `cumulative_savings` (decimal) - Total savings over time horizon
      - `net_savings` (decimal) - Savings minus implementation cost
      - `payback_months` (decimal) - Time to recoup investment
      - `roi_percentage` (decimal) - Return on investment percentage
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `scenarios` table
    - Add policy for public access to all operations (since no auth required per PRD)
*/

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  monthly_invoice_volume integer NOT NULL,
  num_ap_staff integer NOT NULL,
  avg_hours_per_invoice decimal NOT NULL,
  hourly_wage decimal NOT NULL,
  error_rate_manual decimal NOT NULL,
  error_cost decimal NOT NULL,
  time_horizon_months integer NOT NULL,
  one_time_implementation_cost decimal DEFAULT 0,
  monthly_savings decimal NOT NULL,
  cumulative_savings decimal NOT NULL,
  net_savings decimal NOT NULL,
  payback_months decimal NOT NULL,
  roi_percentage decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to scenarios"
  ON scenarios
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);