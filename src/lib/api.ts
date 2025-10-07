import { SimulationInput, SimulationResult, Scenario } from '../types';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roi-calculator`;

export const api = {
  async simulate(input: SimulationInput): Promise<SimulationResult> {
    const response = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to simulate');
    }

    return response.json();
  },

  async saveScenario(data: SimulationInput): Promise<Scenario> {
    const response = await fetch(`${API_URL}/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save scenario');
    }

    return response.json();
  },

  async getScenarios(): Promise<Scenario[]> {
    const response = await fetch(`${API_URL}/scenarios`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scenarios');
    }

    return response.json();
  },

  async getScenario(id: string): Promise<Scenario> {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scenario');
    }

    return response.json();
  },

  async deleteScenario(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete scenario');
    }
  },

  async generateReport(email: string, input: SimulationInput): Promise<Blob> {
    const response = await fetch(`${API_URL}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, ...input }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.blob();
  },
};
