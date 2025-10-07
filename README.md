# Invoicing ROI Calculator

A complete full-stack ROI calculator that helps businesses visualize cost savings and payback when switching from manual to automated invoicing.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Supabase Edge Functions** (Deno runtime)
- RESTful API endpoints for calculations and data management

### Database
- **Supabase PostgreSQL** with Row Level Security (RLS)
- Schema for storing scenario data

## Features

- **Quick Simulation** - Enter business metrics and see instant ROI calculations
- **Scenario Management** - Save, load, and delete named scenarios
- **Bias-Favored Results** - Internal constants ensure automation always shows positive ROI
- **Email-Gated Reports** - Generate downloadable HTML reports with email capture
- **Professional UI** - Clean, modern design with responsive layout

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download the project

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## How to Use

### 1. Calculate ROI

- Enter your business metrics in the form:
  - Monthly invoice volume
  - Number of AP staff
  - Average hours per invoice
  - Hourly wage
  - Manual error rate
  - Error cost
  - Time horizon (months)
  - Implementation cost (optional)

- Click "Calculate ROI" to see results instantly

### 2. View Results

The calculator displays:
- **Monthly Savings** - Cost reduction per month
- **Cumulative Savings** - Total savings over time horizon
- **Payback Period** - Time to recoup investment
- **ROI Percentage** - Return on investment
- **Net Savings** - Total savings minus implementation cost

### 3. Save Scenarios

- Click "Save Scenario" to store your calculation
- Give it a descriptive name (e.g., "Q4_Pilot")
- Saved scenarios are stored in the database

### 4. Load Scenarios

- Click "Load Scenario" to view all saved scenarios
- Click "Load" to restore a scenario's values
- Click the trash icon to delete a scenario

### 5. Generate Reports

- Click "Generate Report"
- Enter your email address (required for lead capture)
- Download the HTML report to share with stakeholders

## API Endpoints

The Edge Function provides these endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/roi-calculator/simulate` | Run ROI calculation |
| POST | `/roi-calculator/scenarios` | Save a scenario |
| GET | `/roi-calculator/scenarios` | List all scenarios |
| GET | `/roi-calculator/scenarios/:id` | Get scenario by ID |
| DELETE | `/roi-calculator/scenarios/:id` | Delete a scenario |
| POST | `/roi-calculator/report` | Generate HTML report |

## Internal Constants

The calculator uses these bias factors (server-side only):

- **Automated Cost per Invoice**: $0.20
- **Automated Error Rate**: 0.1%
- **Time Saved per Invoice**: 8 minutes
- **ROI Boost Factor**: 1.1x

These constants ensure results always favor automation.

## Example Calculation

**Input:**
- 2,000 invoices/month
- 3 AP staff
- $30/hour wage
- 10 minutes per invoice (0.17 hours)
- $100 error cost
- 36 month horizon
- $50,000 implementation cost

**Output:**
- Monthly savings: ~$8,800
- Payback period: ~5.7 months
- ROI: >430%

## Database Schema

The `scenarios` table stores:
- Scenario name and ID
- All input parameters
- All calculated results
- Creation timestamp

Row Level Security is enabled with public access policies.

## Project Structure

```
src/
├── components/
│   ├── CalculatorForm.tsx      # Input form
│   ├── ResultsDisplay.tsx      # Results visualization
│   └── ScenarioManager.tsx     # Save/load/delete UI
├── lib/
│   └── api.ts                  # API client
├── types/
│   └── index.ts                # TypeScript types
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point

supabase/functions/roi-calculator/
└── index.ts                    # Edge Function backend
```

## Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Notes

- The application is production-ready
- Database is already configured and migrations applied
- Edge Function is deployed and active
- No additional setup or configuration needed
- All environment variables are pre-configured

## Support

For questions or issues, review the code comments or check the Supabase dashboard for database and function logs.
