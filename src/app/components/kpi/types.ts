import { LucideIcon } from "lucide-react";

export type KPICategory = "Operational" | "Commercial" | "AI/Predictive";
export type ComplianceStatus = "Compliant" | "Warning" | "Non-Compliant";
export type TrendDirection = "up" | "down" | "neutral";

export interface KPI {
  id: string;
  name: string;
  category: KPICategory;
  currentValue: number;
  targetValue: number;
  unit: string;
  complianceStatus: ComplianceStatus;
  momChange: number;
  trend: number[]; // Simple array for sparkline
  ldRisk?: number; // Liquidated Damages Risk
  description?: string;
  ppaType?: string;
  effectiveVersion?: string;
  impactedPlants?: number;
  revenueImpact?: number;
  benchmarkSource?: string;
  history?: { month: string; value: number; target: number }[];
  plantBreakdown?: { plant: string; cluster: string; vendor: string; value: number; status: ComplianceStatus }[];
  waterfallData?: { step: string; value: number; type: "increase" | "decrease" | "total" }[];
  versions?: KPIVersion[];
  aiInsight?: {
    confidence: number;
    predictedValue: number;
    anomalyDetected: boolean;
    recommendation: string;
  };
}

export interface KPIFormula {
  id: string;
  kpiId: string;
  expression: string;
  inputs: { name: string; source: string; value: string }[];
  version: string;
  effectiveDate: string;
  status: "Active" | "Draft" | "Archived";
  approvedBy?: string;
}

export interface KPIVersion {
  version: string;
  effectiveDate: string;
  snapshot: string;
  approvedBy: string;
  status: "Active" | "Archived";
  revenueImpactChange: number;
  ldExposureChange: number;
  complianceChange: number;
}
