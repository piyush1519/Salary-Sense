// ── Auth ─────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "developer" | "recruiter" | "admin";
  avatar?: string;
}

// ── Prediction ────────────────────────────────────────────
export interface PredictInput {
  YearsCodePro: number;
  WorkExp: number;
  NumberOfDatabasesKnown: number;
  NumberOfPlatformsKnown: number;
  NumberOfWebFrameworksKnown: number;
  OrgSize: string;
  Remote: 0 | 1;
  Hybrid: 0 | 1;
  In_person: 0 | 1;
  Full_time: 0 | 1;
  Freelancer: 0 | 1;
  Part_time: 0 | 1;
  Bachelors: 0 | 1;
  Masters: 0 | 1;
  Doctorate: 0 | 1;
  Associate: 0 | 1;
  College: 0 | 1;
  Developer: 0 | 1;
  DataTech: 0 | 1;
  Database: 0 | 1;
  Designer: 0 | 1;
  Education_role: 0 | 1;
  Management: 0 | 1;
  Research: 0 | 1;
  Security: 0 | 1;
  SysAdmin: 0 | 1;
  North_America: 0 | 1;
  Europe: 0 | 1;
  Asia: 0 | 1;
  South_America: 0 | 1;
  Africa: 0 | 1;
  Oceania: 0 | 1;
  IT_Software: 0 | 1;
  Finance: 0 | 1;
  Healthcare: 0 | 1;
  Manufacturing: 0 | 1;
}

export interface SalaryRange {
  low: number;
  high: number;
}

export interface PredictionResult {
  success: boolean;
  predictedSalary: number;
  salaryRange: SalaryRange;
  confidenceInterval: SalaryRange;
  marketPercentile: number;
  currency: string;
  modelUsed: string;
  careerScore: number;
  r2Score: number;
}

export interface ModelPrediction {
  model: string;
  prediction: number;
  r2: number;
  rmse: number;
}

// ── Model Pool ────────────────────────────────────────────
export interface ModelMetric {
  model: string;
  r2: number;
  rmse: number;
  mae: number;
  mape: number;
  smape: number;
}

export interface ModelPoolMeta {
  best_model: string;
  pool_results: ModelMetric[];
  test_metrics: {
    r2: number;
    rmse: number;
    mae: number;
    mape: number;
    smape: number;
  };
  training_samples: number;
  feature_count: number;
}

// ── SHAP Explainability ──────────────────────────────────
export interface ShapContribution {
  feature: string;
  shap_value: number;
  impact: "positive" | "negative";
}

export interface ShapResult {
  success: boolean;
  model: string;
  contributions: ShapContribution[];
  base_value: number;
  note?: string;
}

// ── Trend Data ────────────────────────────────────────────
export interface TrendPoint {
  label: string;
  avgSalary: number;
}

export interface DistributionBin {
  bin: string;
  count: number;
}

// ── Skill Gap ─────────────────────────────────────────────
export interface MarketSkill {
  skill: string;
  demandScore: number;
  avgSalaryBoost: number;
  category: string;
}
