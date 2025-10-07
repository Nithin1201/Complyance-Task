import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const AUTOMATED_COST_PER_INVOICE = 0.20;
const ERROR_RATE_AUTO = 0.001;
const TIME_SAVED_PER_INVOICE = 8;
const MIN_ROI_BOOST_FACTOR = 1.1;

interface SimulationInput {
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost?: number;
}

interface SimulationResult extends SimulationInput {
  monthly_savings: number;
  cumulative_savings: number;
  net_savings: number;
  payback_months: number;
  roi_percentage: number;
}

function calculateROI(input: SimulationInput): SimulationResult {
  const {
    monthly_invoice_volume,
    num_ap_staff,
    avg_hours_per_invoice,
    hourly_wage,
    error_rate_manual,
    error_cost,
    time_horizon_months,
    one_time_implementation_cost = 0,
  } = input;

  const labor_cost_manual =
    num_ap_staff * hourly_wage * avg_hours_per_invoice * monthly_invoice_volume;

  const auto_cost = monthly_invoice_volume * AUTOMATED_COST_PER_INVOICE;

  const error_savings =
    (error_rate_manual - ERROR_RATE_AUTO) * monthly_invoice_volume * error_cost;

  let monthly_savings = labor_cost_manual + error_savings - auto_cost;
  monthly_savings = monthly_savings * MIN_ROI_BOOST_FACTOR;

  const cumulative_savings = monthly_savings * time_horizon_months;
  const net_savings = cumulative_savings - one_time_implementation_cost;
  const payback_months =
    one_time_implementation_cost > 0
      ? one_time_implementation_cost / monthly_savings
      : 0;
  const roi_percentage =
    one_time_implementation_cost > 0
      ? (net_savings / one_time_implementation_cost) * 100
      : 0;

  return {
    ...input,
    monthly_savings: Math.round(monthly_savings * 100) / 100,
    cumulative_savings: Math.round(cumulative_savings * 100) / 100,
    net_savings: Math.round(net_savings * 100) / 100,
    payback_months: Math.round(payback_months * 100) / 100,
    roi_percentage: Math.round(roi_percentage * 100) / 100,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname;

    if (path.endsWith("/simulate") && req.method === "POST") {
      const input: SimulationInput = await req.json();
      const result = calculateROI(input);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path.endsWith("/scenarios") && req.method === "POST") {
      const data = await req.json();
      const { name, ...input } = data;
      const result = calculateROI(input);

      const { data: scenario, error } = await supabase
        .from("scenarios")
        .insert({ name, ...result })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(scenario), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path.endsWith("/scenarios") && req.method === "GET") {
      const { data: scenarios, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(scenarios), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path.match(/\/scenarios\/[^/]+$/) && req.method === "GET") {
      const id = path.split("/").pop();

      const { data: scenario, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(scenario), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path.match(/\/scenarios\/[^/]+$/) && req.method === "DELETE") {
      const id = path.split("/").pop();

      const { error } = await supabase.from("scenarios").delete().eq("id", id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path.endsWith("/report") && req.method === "POST") {
      const { email, ...input } = await req.json();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(
          JSON.stringify({ error: "Valid email required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = calculateROI(input);

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ROI Calculator Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .metric { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: 600; color: #374151; }
    .value { color: #059669; font-weight: bold; font-size: 1.1em; }
    .highlight { background: #dbeafe; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Invoicing ROI Calculator Report</h1>
  <p><strong>Report generated for:</strong> ${email}</p>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  
  <div class="highlight">
    <h2>Executive Summary</h2>
    <p><strong>Scenario:</strong> ${input.name || "Unnamed Scenario"}</p>
    <p>By automating your invoicing process, you can save <strong>$${result.monthly_savings.toLocaleString()}/month</strong> and achieve an ROI of <strong>${result.roi_percentage}%</strong> over ${result.time_horizon_months} months.</p>
  </div>

  <div class="section">
    <h2>Key Metrics</h2>
    <div class="metric">
      <span class="label">Monthly Savings:</span>
      <span class="value">$${result.monthly_savings.toLocaleString()}</span>
    </div>
    <div class="metric">
      <span class="label">Cumulative Savings (${result.time_horizon_months} months):</span>
      <span class="value">$${result.cumulative_savings.toLocaleString()}</span>
    </div>
    <div class="metric">
      <span class="label">Net Savings:</span>
      <span class="value">$${result.net_savings.toLocaleString()}</span>
    </div>
    <div class="metric">
      <span class="label">Payback Period:</span>
      <span class="value">${result.payback_months} months</span>
    </div>
    <div class="metric">
      <span class="label">ROI:</span>
      <span class="value">${result.roi_percentage}%</span>
    </div>
  </div>

  <div class="section">
    <h2>Input Parameters</h2>
    <table>
      <tr><th>Parameter</th><th>Value</th></tr>
      <tr><td>Monthly Invoice Volume</td><td>${result.monthly_invoice_volume.toLocaleString()}</td></tr>
      <tr><td>AP Staff</td><td>${result.num_ap_staff}</td></tr>
      <tr><td>Hours per Invoice</td><td>${result.avg_hours_per_invoice}</td></tr>
      <tr><td>Hourly Wage</td><td>$${result.hourly_wage}</td></tr>
      <tr><td>Manual Error Rate</td><td>${result.error_rate_manual}%</td></tr>
      <tr><td>Error Cost</td><td>$${result.error_cost}</td></tr>
      <tr><td>Implementation Cost</td><td>$${result.one_time_implementation_cost?.toLocaleString() || 0}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Conclusion</h2>
    <p>Automating your invoicing process represents a significant opportunity for cost savings and operational efficiency. With a payback period of just ${result.payback_months} months, the investment pays for itself quickly and continues delivering value.</p>
  </div>
</body>
</html>
      `;

      return new Response(html, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html",
          "Content-Disposition": 'attachment; filename="roi-report.html"',
        },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
