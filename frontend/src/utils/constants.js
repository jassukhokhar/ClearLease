export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const RISK_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const RISK_LABELS = {
  SAFE: 'SAFE',
  MODERATE: 'MODERATE RISK',
  HIGH: 'HIGH RISK',
};

// Tailwind class maps for each risk level.
export const RISK_STYLES = {
  HIGH: {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    ring: 'ring-rose-500',
  },
  MEDIUM: {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500',
  },
  LOW: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500',
  },
};

export const RISK_LABEL_STYLES = {
  'SAFE': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'MODERATE RISK': 'text-amber-700 bg-amber-50 border-amber-200',
  'HIGH RISK': 'text-rose-700 bg-rose-50 border-rose-200',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ANALYSIS_STEPS = [
  { key: 'upload', label: 'Upload Complete' },
  { key: 'extract', label: 'Extracting PDF Text' },
  { key: 'analyze', label: 'Analyzing Legal Clauses' },
  { key: 'detect', label: 'Detecting Risks' },
  { key: 'report', label: 'Generating Report' },
  { key: 'done', label: 'Report Ready' },
];

// Quick-start prompts shown in the AI Lease Assistant.
export const SUGGESTED_QUESTIONS = [
  'What are the biggest risks?',
  'Explain all penalties.',
  'Can I negotiate anything?',
  'What should I ask the landlord?',
  'What happens if I terminate early?',
  'Would you sign this lease?',
];

// Negotiation letter tones offered in the generator.
export const NEGOTIATION_TONES = [
  { key: 'email', label: 'Email', hint: 'Concise email to the landlord' },
  { key: 'formal', label: 'Formal Letter', hint: 'Professional written letter' },
  { key: 'friendly', label: 'Friendly', hint: 'Warm, cooperative tone' },
  { key: 'strong', label: 'Strong', hint: 'Firm, assertive negotiation' },
];

// Dimensions compared in the lease comparison tool.
export const COMPARISON_DIMENSIONS = [
  { key: 'securityDeposit', label: 'Security Deposit Terms' },
  { key: 'maintenance', label: 'Maintenance Responsibilities' },
  { key: 'termination', label: 'Termination Clauses' },
  { key: 'hiddenFees', label: 'Hidden Fees' },
  { key: 'renewal', label: 'Renewal Clauses' },
  { key: 'penalties', label: 'Penalties' },
  { key: 'tenantObligations', label: 'Tenant Obligations' },
];
