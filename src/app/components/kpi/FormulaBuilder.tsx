import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Save, Play, Plus, Trash2, AlertTriangle, CheckCircle2,
  Calculator, Settings2, ChevronDown, ChevronRight, Info,
  History, Link2, Copy, BookOpen, RefreshCw,
  TrendingUp, Shield, Clock, Database, GitBranch,
  RotateCcw, Undo2, Edit3, Check, Lock, Unlock,
  ShieldCheck, Ban, CheckCircle, Send, FileText,
  MessageSquare, User, UserCheck, Eye,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { KPI } from "./types";
import { toast } from "sonner";

interface Parameter {
  name: string;
  source: string;
  type: "Variable" | "Constant" | "Derived";
  unit: string;
  sampleValue: string;
  refreshRate: string;
  description: string;
}

interface SimScenario {
  label: string;
  gen: number;
  capacity: number;
  hours: number;
  netExport: number;
  tariff: number;
  gridOutage: number;
  forcedOutage: number;
  plannedOutage: number;
}

interface PPAContract {
  id: string;
  name: string;
  counterparty: string;
  type: "FiT" | "PPA" | "Group Captive" | "ToD";
  capacity: number;
  tariff: number;
  contractedCUF: number;
  ldRate: number;
  effectiveFrom: string;
  expiresOn: string;
  status: "active" | "expired" | "draft";
  overrides: Array<{ param: string; masterValue: string; contractValue: string; unit: string }>;
  ldClauses: Array<{ clause: string; condition: string; threshold: string; ldFormula: string; exposureMonthly: string; risk: "high" | "medium" | "none" }>;
  amendments: Array<{ date: string; ref: string; description: string; changedBy: string }>;
}

interface FormulaVersion {
  version: string;
  date: string;
  changedBy: string;
  formula: string;
  reason: string;
  status: "active" | "archived" | "draft";
}

const ALL_PARAMETERS: Parameter[] = [
  { name: "Actual_Generation",   source: "JMR / SCADA",      type: "Variable",  unit: "MWh",    sampleValue: "4,485.2",  refreshRate: "Real-time", description: "Gross energy generated at plant terminal as per SCADA meter" },
  { name: "Installed_Capacity",  source: "Master Data",      type: "Constant",  unit: "MW",     sampleValue: "50",       refreshRate: "Static",    description: "Nameplate DC capacity of the solar plant as per commissioning certificate" },
  { name: "Time_Period",         source: "System / Calendar", type: "Variable",  unit: "Hours",  sampleValue: "672",      refreshRate: "Daily",     description: "Number of hours in the selected period (monthly = days x 24)" },
  { name: "Grid_Outage",         source: "JMR (Manual)",     type: "Variable",  unit: "Hours",  sampleValue: "14.5",     refreshRate: "Monthly",   description: "Hours plant was ready to generate but grid was unavailable (force majeure)" },
  { name: "Forced_Outage",       source: "O&M Logs",         type: "Variable",  unit: "Hours",  sampleValue: "8.0",      refreshRate: "Monthly",   description: "Unplanned equipment downtime hours logged by O&M team" },
  { name: "Planned_Outage",      source: "O&M Logs",         type: "Variable",  unit: "Hours",  sampleValue: "12.0",     refreshRate: "Monthly",   description: "Scheduled maintenance window hours as per approved plan" },
  { name: "Net_Export",           source: "Grid Meter",       type: "Variable",  unit: "MWh",    sampleValue: "4,418.5",  refreshRate: "Real-time", description: "Energy exported to grid at delivery point after auxiliary consumption" },
  { name: "Tariff_Rate",          source: "PPA / Contract",   type: "Constant",  unit: "Rs/kWh", sampleValue: "2.44",     refreshRate: "Static",    description: "Contracted tariff rate per unit exported as per PPA agreement" },
  { name: "Contracted_CUF",       source: "PPA / Contract",   type: "Constant",  unit: "%",      sampleValue: "21.5",     refreshRate: "Static",    description: "Normative CUF guaranteed in PPA; breach triggers LD computation" },
  { name: "Irradiance",           source: "Weather Station",  type: "Variable",  unit: "kWh/m2", sampleValue: "185.4",    refreshRate: "Hourly",    description: "Global Horizontal Irradiance measured at plant met-mast station" },
  { name: "LD_Rate",              source: "PPA / Contract",   type: "Constant",  unit: "Rs/kWh", sampleValue: "0.50",     refreshRate: "Static",    description: "Liquidated damages rate per unit of generation shortfall from contracted CUF" },
  { name: "Degradation_Rate",     source: "Technical Study",  type: "Constant",  unit: "%/yr",   sampleValue: "0.7",      refreshRate: "Annual",    description: "Annual panel degradation rate as per manufacturer datasheet and IV curve analysis" },
  { name: "CUF",                  source: "Derived (KPI)",    type: "Derived",   unit: "%",      sampleValue: "22.4",     refreshRate: "Computed",  description: "Capacity Utilisation Factor — derived from (Actual_Generation / (Installed_Capacity x Time_Period)) x 100" },
  { name: "PR",                   source: "Derived (KPI)",    type: "Derived",   unit: "%",      sampleValue: "78.5",     refreshRate: "Computed",  description: "Performance Ratio — derived from generation normalised against irradiance and capacity" },
];

const FORMULA_TEMPLATES = [
  { id: "cuf",     label: "Capacity Utilisation Factor (CUF)",  category: "Performance", formula: "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100",                                                 note: "CERC definition; Time_Period in hours" },
  { id: "plf",     label: "Plant Load Factor (PLF)",            category: "Performance", formula: "(Net_Export / (Installed_Capacity * Time_Period)) * 100",                                                          note: "Uses net export at delivery point" },
  { id: "pa",      label: "Plant Availability Factor",          category: "Performance", formula: "((Time_Period - Forced_Outage - Planned_Outage) / Time_Period) * 100",                                             note: "Excludes force-majeure grid outage" },
  { id: "ga",      label: "Grid Availability Factor",           category: "Performance", formula: "((Time_Period - Grid_Outage) / Time_Period) * 100",                                                                note: "Normalises for grid curtailment" },
  { id: "tll",     label: "Transmission Line Loss",             category: "Losses",      formula: "((Actual_Generation - Net_Export) / Actual_Generation) * 100",                                                     note: "Step-up + pooling substation combined loss" },
  { id: "ld",      label: "LD Computation (CUF Breach)",        category: "Commercial",  formula: "IF(CUF < Contracted_CUF, (Contracted_CUF - CUF) * Installed_Capacity * Time_Period * LD_Rate, 0)",                note: "Clause 8.2 standard — check PPA specific rate" },
  { id: "revenue", label: "Revenue Realization",                 category: "Commercial",  formula: "Net_Export * Tariff_Rate",                                                                                         note: "Gross before deduction of banking charges" },
  { id: "pr",      label: "Performance Ratio (PR)",             category: "Performance", formula: "(Actual_Generation / (Irradiance * Installed_Capacity)) * 100",                                                    note: "Normalises for irradiance; target PR >= 78%" },
  { id: "forecast",label: "Generation Forecast",                category: "AI/Predict",  formula: "Irradiance * Installed_Capacity * (PR / 100) * (1 - (Degradation_Rate / 100))",                                    note: "Weather-corrected, degradation-adjusted" },
];

const DEFAULT_SCENARIOS: SimScenario[] = [
  { label: "Sep 2025", gen: 4485.2, capacity: 50, hours: 720, netExport: 4418.5, tariff: 2.44, gridOutage: 14.5, forcedOutage: 8.0, plannedOutage: 12.0 },
  { label: "Oct 2025", gen: 4380.0, capacity: 50, hours: 744, netExport: 4315.2, tariff: 2.44, gridOutage: 18.2, forcedOutage: 6.0, plannedOutage: 8.0  },
  { label: "Nov 2025", gen: 4210.5, capacity: 50, hours: 720, netExport: 4142.8, tariff: 2.44, gridOutage: 22.0, forcedOutage: 10.0, plannedOutage: 4.0 },
];

const FORMULA_HISTORY: FormulaVersion[] = [
  { version: "v1.2", date: "2025-06-15", changedBy: "Amit Patel", formula: "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100", reason: "Aligned with CERC 2024 guidelines", status: "active" },
  { version: "v1.1", date: "2024-11-03", changedBy: "Rahul Sharma", formula: "(Net_Export / (Installed_Capacity * Time_Period)) * 100", reason: "Initial formula — used net export (corrected in v1.2)", status: "archived" },
  { version: "v1.0", date: "2023-04-01", changedBy: "System", formula: "(Actual_Generation / (Installed_Capacity * 8760)) * 100", reason: "Default annual CUF formula", status: "archived" },
];

const PPA_CONTRACTS: PPAContract[] = [
  {
    id: "PPA-MH-001", name: "MSEDCL PPA — Maharashtra", counterparty: "MSEDCL", type: "PPA",
    capacity: 50, tariff: 2.44, contractedCUF: 21.5, ldRate: 0.50,
    effectiveFrom: "2018-04-01", expiresOn: "2043-03-31", status: "active",
    overrides: [
      { param: "Contracted_CUF",  masterValue: "24.0%",          contractValue: "21.5%",              unit: "%" },
      { param: "Time_Period",     masterValue: "Calendar Hours",  contractValue: "Grid Available Hours", unit: "Hours" },
      { param: "Tariff_Rate",     masterValue: "Market Rate",     contractValue: "Rs 2.44/kWh",         unit: "Rs/kWh" },
      { param: "LD_Rate",         masterValue: "Rs 0.50/kWh",     contractValue: "Rs 0.50/kWh",         unit: "Rs/kWh" },
    ],
    ldClauses: [
      { clause: "Cl. 8.2 – CUF Shortfall", condition: "Annual CUF < 21.5%", threshold: "21.5", ldFormula: "(Contracted_CUF - Actual_CUF) x Capacity x 8760 x LD_Rate", exposureMonthly: "Rs 0.55 Cr", risk: "high" },
      { clause: "Cl. 9.1 – Availability",  condition: "PA < 95%",           threshold: "95.0", ldFormula: "(0.95 - Actual_PA) x Capacity x Time_Period x 0.25",          exposureMonthly: "Rs 0.12 Cr", risk: "medium" },
      { clause: "Cl. 11 – Force Majeure",  condition: "Grid Outage > 5%",   threshold: "5.0",  ldFormula: "Not applicable — FM waiver applies",                           exposureMonthly: "Rs 0.00 Cr", risk: "none" },
    ],
    amendments: [
      { date: "2022-10-15", ref: "CA-4.2", description: "LD rate revised from Rs 0.40 to Rs 0.50/kWh", changedBy: "EESL Commercial" },
      { date: "2020-07-01", ref: "CA-2.1", description: "Force majeure clause extended to include COVID disruptions", changedBy: "Mutual Agreement" },
    ],
  },
  {
    id: "PPA-MH-002", name: "MSEDCL FiT — Maharashtra", counterparty: "MSEDCL", type: "FiT",
    capacity: 22, tariff: 3.47, contractedCUF: 20.0, ldRate: 0.35,
    effectiveFrom: "2019-09-01", expiresOn: "2044-08-31", status: "active",
    overrides: [
      { param: "Contracted_CUF", masterValue: "24.0%",        contractValue: "20.0%",           unit: "%" },
      { param: "Tariff_Rate",    masterValue: "Market Rate",   contractValue: "Rs 3.47/kWh (FiT)", unit: "Rs/kWh" },
      { param: "LD_Rate",        masterValue: "Rs 0.50/kWh",   contractValue: "Rs 0.35/kWh",      unit: "Rs/kWh" },
    ],
    ldClauses: [
      { clause: "Cl. 7.3 – CUF Target", condition: "Annual CUF < 20.0%", threshold: "20.0", ldFormula: "(20.0 - Actual_CUF) x Capacity x 8760 x 0.35", exposureMonthly: "Rs 0.00 Cr", risk: "none" },
      { clause: "Cl. 10 – Metering",    condition: "Meter error > 2%",   threshold: "2.0",  ldFormula: "Penalty as per CERC Metering Regulation",       exposureMonthly: "Rs 0.00 Cr", risk: "none" },
    ],
    amendments: [
      { date: "2023-04-01", ref: "CA-1.1", description: "Tariff escalation as per TNERC order — increased from Rs 3.15 to Rs 3.47", changedBy: "TNERC Order No. 2023/14" },
    ],
  },
  {
    id: "PPA-MH-003", name: "MSPGCL Group Captive", counterparty: "MSPGCL", type: "Group Captive",
    capacity: 30, tariff: 2.85, contractedCUF: 22.0, ldRate: 0.60,
    effectiveFrom: "2020-03-01", expiresOn: "2045-02-28", status: "active",
    overrides: [
      { param: "Contracted_CUF", masterValue: "24.0%",       contractValue: "22.0%",       unit: "%" },
      { param: "Tariff_Rate",    masterValue: "Market Rate",  contractValue: "Rs 2.85/kWh", unit: "Rs/kWh" },
      { param: "LD_Rate",        masterValue: "Rs 0.50/kWh",  contractValue: "Rs 0.60/kWh", unit: "Rs/kWh" },
    ],
    ldClauses: [
      { clause: "Cl. 8.1 – CUF Breach", condition: "Annual CUF < 22.0%", threshold: "22.0", ldFormula: "(22.0 - Actual_CUF) x Capacity x 8760 x 0.60", exposureMonthly: "Rs 0.69 Cr", risk: "high" },
    ],
    amendments: [],
  },
];

const AVAILABLE_EXTRA_PARAMS = ["Auxiliary_Consumption", "Module_Temp", "Ambient_Temp", "Wind_Speed", "Soiling_Loss", "Inverter_Efficiency"];

function smartEvaluate(formula: string, sc: SimScenario): string | null {
  const f = formula.replace(/\s+/g, " ").trim();
  const cuf = (sc.gen / (sc.capacity * sc.hours)) * 100;
  const plf = (sc.netExport / (sc.capacity * sc.hours)) * 100;
  if (f.includes("Actual_Generation") && f.includes("Installed_Capacity") && f.includes("Time_Period") && !f.includes("Net_Export") && !f.includes("Irradiance")) return cuf.toFixed(2) + "%";
  if (f.includes("Net_Export") && f.includes("Installed_Capacity") && f.includes("Time_Period") && !f.includes("Actual_Generation")) return plf.toFixed(2) + "%";
  if (f.includes("Forced_Outage") && f.includes("Planned_Outage")) { const pa = ((sc.hours - sc.forcedOutage - sc.plannedOutage) / sc.hours) * 100; return pa.toFixed(2) + "%"; }
  if (f.includes("Grid_Outage") && !f.includes("Forced_Outage")) { const ga = ((sc.hours - sc.gridOutage) / sc.hours) * 100; return ga.toFixed(2) + "%"; }
  if (f.includes("Actual_Generation") && f.includes("Net_Export") && f.includes("Actual_Generation")) { const tll = ((sc.gen - sc.netExport) / sc.gen) * 100; return tll.toFixed(2) + "%"; }
  if (f.includes("Net_Export") && f.includes("Tariff_Rate") && !f.includes("Installed_Capacity")) { const rev = sc.netExport * sc.tariff; return "Rs " + rev.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  if (f.includes("Irradiance") && f.includes("Installed_Capacity") && f.includes("Actual_Generation")) { const pr = (sc.gen / (185.4 * sc.capacity)) * 100; return pr.toFixed(2) + "%"; }
  if (f.includes("IF") && f.includes("Contracted_CUF")) {
    if (cuf < 21.5) { const ld = (21.5 - cuf) * sc.capacity * sc.hours * 0.50; return "Rs " + ld.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    return "Rs 0 (compliant)";
  }
  return cuf.toFixed(2) + "%";
}

function tokenizeFormula(formula: string, paramNames: string[]): Array<{ text: string; type: "param" | "operator" | "number" | "function" | "paren" | "plain" }> {
  const tokens: Array<{ text: string; type: "param" | "operator" | "number" | "function" | "paren" | "plain" }> = [];
  const parts = formula.split(/(\s+|[+\-*/()<>,])/);
  for (const part of parts) {
    if (!part) continue;
    const t = part.trim();
    if (paramNames.includes(t)) tokens.push({ text: part, type: "param" });
    else if (/^[+\-*/]$/.test(t)) tokens.push({ text: part, type: "operator" });
    else if (/^[()<>,]$/.test(t)) tokens.push({ text: part, type: "paren" });
    else if (/^\d+(\.\d+)?$/.test(t)) tokens.push({ text: part, type: "number" });
    else if (/^(IF|ELSE|AND|OR|MIN|MAX|ABS|ROUND|SUM|AVG|SQRT)$/.test(t)) tokens.push({ text: part, type: "function" });
    else tokens.push({ text: part, type: "plain" });
  }
  return tokens;
}

function validateFormula(formula: string, paramNames: string[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  let depth = 0;
  for (const ch of formula) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth < 0) { errors.push("Unmatched closing parenthesis ')'"); break; }
  }
  if (depth > 0) errors.push(`${depth} unclosed parenthesis — add ${depth} closing ')'`);
  const wordTokens = formula.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  const keywords = new Set(["IF", "ELSE", "AND", "OR", "MIN", "MAX", "ABS", "ROUND", "SUM", "AVG", "SQRT"]);
  const unknowns = new Set<string>();
  for (const tok of wordTokens) {
    if (!paramNames.includes(tok) && !keywords.has(tok)) unknowns.add(tok);
  }
  if (unknowns.size > 0) errors.push(`Unknown token(s): ${[...unknowns].map(t => `"${t}"`).join(", ")} — not a recognised parameter or function`);
  if (/\/\s*0\b/.test(formula)) errors.push("Division by zero detected");
  if (!formula.includes("Time_Period") && formula.includes("Actual_Generation") && !formula.includes("Tariff_Rate") && !formula.includes("Irradiance")) warnings.push("Formula uses generation but not Time_Period — verify period normalisation");
  if (formula.length < 5) warnings.push("Formula seems very short — please verify");
  return { valid: errors.length === 0, errors, warnings };
}

const TOKEN_COLOR: Record<string, string> = {
  param: "text-blue-400 font-semibold", operator: "text-purple-300",
  number: "text-amber-300", function: "text-emerald-400 font-semibold",
  paren: "text-slate-300 font-bold", plain: "text-slate-300",
};

interface FormulaBuilderProps { isOpen: boolean; onClose: () => void; kpi: KPI; }

export function FormulaBuilder({ isOpen, onClose, kpi }: FormulaBuilderProps) {
  const KPI_DEFAULT_FORMULAS: Record<string, string> = useMemo(() => ({
    "cuf":          "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100",
    "ga":           "((Time_Period - Grid_Outage) / Time_Period) * 100",
    "pa":           "((Time_Period - Forced_Outage - Planned_Outage) / Time_Period) * 100",
    "paf":          "((Time_Period - Forced_Outage - Planned_Outage) / Time_Period) * 100",
    "tll":          "((Actual_Generation - Net_Export) / Actual_Generation) * 100",
    "curtailment":  "((Time_Period - Grid_Outage) / Time_Period) * 100",
    "rev-shortfall":"Net_Export * Tariff_Rate",
    "om-deviation": "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100",
    "rpw":          "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100",
    "degradation":  "(Actual_Generation / (Irradiance * Installed_Capacity)) * 100",
    "forecasted-gen":"Irradiance * Installed_Capacity * (PR / 100) * (1 - (Degradation_Rate / 100))",
    "curtailment-pattern":"((Time_Period - Grid_Outage) / Time_Period) * 100",
    "lpi":          "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100",
  }), []);

  const getDefaultFormula = useCallback((kpiId: string) => {
    return KPI_DEFAULT_FORMULAS[kpiId] ?? "(Actual_Generation / (Installed_Capacity * Time_Period)) * 100";
  }, [KPI_DEFAULT_FORMULAS]);

  const [formula, setFormula] = useState(() => getDefaultFormula(kpi.id));
  const [formulaHistory, setFormulaHistory] = useState<string[]>([]);
  const [syntaxResult, setSyntaxResult] = useState<ReturnType<typeof validateFormula> | null>(null);
  const [simDone, setSimDone] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hoveredParam, setHoveredParam] = useState<Parameter | null>(null);
  const [selectedNewParam, setSelectedNewParam] = useState("");
  const [showAddParam, setShowAddParam] = useState(false);
  const [customParams, setCustomParams] = useState<Parameter[]>([]);
  const [tolerance, setTolerance] = useState("5");
  const [warnThreshold, setWarnThreshold] = useState("95");
  const [critThreshold, setCritThreshold] = useState("90");
  const [changeReason, setChangeReason] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [version, setVersion] = useState("v1.3 (Draft)");
  const [scenarios, setScenarios] = useState<SimScenario[]>(DEFAULT_SCENARIOS);
  const [editingScenario, setEditingScenario] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [activePPA, setActivePPA] = useState(PPA_CONTRACTS[0].id);
  const [expandedClauses, setExpandedClauses] = useState(true);
  const [expandedAmendments, setExpandedAmendments] = useState(false);
  const [expandedOverrides, setExpandedOverrides] = useState(true);
  const [ppaContracts, setPpaContracts] = useState(PPA_CONTRACTS);
  const [editingOverride, setEditingOverride] = useState<number | null>(null);

  const [approvalStage, setApprovalStage] = useState<"draft" | "submitted" | "under_review" | "approved" | "rejected" | "locked">("draft");
  const [checkerComment, setCheckerComment] = useState("");
  const [approverComment, setApproverComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittedFormula, setSubmittedFormula] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const isFormulaLocked = approvalStage === "approved" || approvalStage === "locked";

  const approvalHistory = useMemo(() => [
    { action: "Created", by: "Current User", date: "Mar 5, 2026 09:15", comment: "Initial formula draft", stage: "draft" as const },
    ...(approvalStage !== "draft" ? [{ action: "Submitted for Review", by: "Current User", date: submittedAt || "Mar 5, 2026 10:30", comment: changeReason || "Formula update", stage: "submitted" as const }] : []),
    ...(approvalStage === "under_review" || approvalStage === "approved" || approvalStage === "locked" ? [{ action: "Checker Approved", by: "Priya Nair (Technical Lead)", date: "Mar 5, 2026 11:15", comment: checkerComment || "Formula logic verified", stage: "under_review" as const }] : []),
    ...(approvalStage === "approved" || approvalStage === "locked" ? [{ action: "Approver Approved", by: "Rahul Sharma (Head - Analytics)", date: "Mar 5, 2026 12:00", comment: approverComment || "Approved for production", stage: "approved" as const }] : []),
    ...(approvalStage === "locked" ? [{ action: "Locked", by: "System", date: "Mar 5, 2026 12:01", comment: "Formula locked for billing cycle", stage: "locked" as const }] : []),
    ...(approvalStage === "rejected" ? [{ action: "Rejected", by: rejectionReason.includes("Approver") ? "Rahul Sharma" : "Priya Nair", date: "Mar 5, 2026 11:30", comment: rejectionReason, stage: "rejected" as const }] : []),
  ], [approvalStage, submittedAt, changeReason, checkerComment, approverComment, rejectionReason]);

  useEffect(() => {
    setFormula(getDefaultFormula(kpi.id));
    setSyntaxResult(null);
    setSimDone(false);
    setFormulaHistory([]);
    setApprovalStage("draft");
    setCheckerComment("");
    setApproverComment("");
    setRejectionReason("");
    setSubmittedFormula("");
    setSubmittedAt("");
    setChangeReason("");
    setEffectiveFrom("");
    setVersion("v1.3 (Draft)");
  }, [kpi.id, getDefaultFormula]);

  const paramNames = [...ALL_PARAMETERS.map(p => p.name), ...customParams.map(p => p.name)];
  const allParams = [...ALL_PARAMETERS, ...customParams];
  const tokens = tokenizeFormula(formula, paramNames);

  const insertAtCursor = useCallback((text: string) => {
    setFormulaHistory(prev => [...prev.slice(-19), formula]);
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? formula.length;
      const end = el.selectionEnd ?? formula.length;
      const before = formula.slice(0, start);
      const after = formula.slice(end);
      const newFormula = before + (before && !before.endsWith(" ") ? " " : "") + text + " " + after;
      setFormula(newFormula);
      setSyntaxResult(null);
      setSimDone(false);
      requestAnimationFrame(() => { el.focus(); const pos = before.length + text.length + 2; el.setSelectionRange(pos, pos); });
    } else {
      setFormula(prev => prev + " " + text + " ");
    }
  }, [formula]);

  const handleFormulaChange = (val: string) => {
    setFormulaHistory(prev => [...prev.slice(-19), formula]);
    setFormula(val);
    setSyntaxResult(null);
    setSimDone(false);
  };

  const handleUndo = () => {
    if (formulaHistory.length === 0) return;
    const prev = formulaHistory[formulaHistory.length - 1];
    setFormulaHistory(h => h.slice(0, -1));
    setFormula(prev);
    setSyntaxResult(null);
    setSimDone(false);
  };

  const handleClear = () => {
    setFormulaHistory(prev => [...prev.slice(-19), formula]);
    setFormula("");
    setSyntaxResult(null);
    setSimDone(false);
  };

  const runSyntaxCheck = () => {
    const result = validateFormula(formula, paramNames);
    setSyntaxResult(result);
    if (result.valid) toast.success("Syntax valid — formula parsed successfully");
    else toast.error(`${result.errors.length} error(s) found`);
  };

  const runSimulation = () => {
    const result = validateFormula(formula, paramNames);
    if (!result.valid) { toast.error("Fix syntax errors before running simulation"); return; }
    setSimRunning(true);
    setTimeout(() => { setSimDone(true); setSimRunning(false); }, 1100);
  };

  const applyTemplate = (tpl: typeof FORMULA_TEMPLATES[0]) => {
    setFormulaHistory(prev => [...prev.slice(-19), formula]);
    setFormula(tpl.formula);
    setSyntaxResult(null);
    setSimDone(false);
    setShowTemplates(false);
    toast.success(`Template applied: ${tpl.label}`);
  };

  const handleSaveSubmit = () => {
    if (!changeReason.trim()) { toast.error("Please enter a change reason before submitting"); return; }
    const result = validateFormula(formula, paramNames);
    if (!result.valid) { toast.error("Cannot submit — formula has syntax errors"); return; }
    setSubmittedFormula(formula);
    setSubmittedAt(new Date().toLocaleString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    setApprovalStage("submitted");
    setVersion(v => v.replace(/v(\d+)\.(\d+).*/, (_, maj: string, min: string) => `v${maj}.${parseInt(min) + 1} (Pending Review)`));
    toast.success(`Formula submitted for review — awaiting Checker approval`);
  };

  const handleResetToDraft = () => {
    setApprovalStage("draft");
    setRejectionReason("");
    setCheckerComment("");
    setApproverComment("");
    setVersion(v => v.replace(/\(.*\)/, "(Draft)"));
    toast.info("Formula reset to draft — you can edit and resubmit");
  };

  const selectedContract = ppaContracts.find(c => c.id === activePPA) ?? ppaContracts[0];

  const currentCUF = kpi.currentValue;
  const liveLDExposure = useMemo(() => {
    const c = selectedContract;
    if (currentCUF >= c.contractedCUF) return { amount: 0, status: "compliant" as const };
    const shortfall = c.contractedCUF - currentCUF;
    const annual = shortfall * c.capacity * 8760 * c.ldRate / 10000000;
    return { amount: parseFloat(annual.toFixed(2)), status: "breach" as const };
  }, [selectedContract, currentCUF]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-40" />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[680px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-gradient-to-r from-[#2955A0] to-[#0089C9] text-white shrink-0">
              <div>
                <h2 className="text-base font-bold">Formula Configuration</h2>
                <p className="text-xs text-blue-200 mt-0.5">Editing logic for <span className="font-semibold text-white">{kpi.name}</span></p>
              </div>
              <div className="flex items-center gap-2">
                {approvalStage === "locked" && <Badge className="bg-amber-500 text-amber-950 border-amber-400 text-[10px] font-bold gap-1"><Lock className="w-2.5 h-2.5" /> LOCKED</Badge>}
                {approvalStage === "approved" && <Badge className="bg-emerald-500 text-white border-emerald-400 text-[10px] font-bold gap-1"><CheckCircle className="w-2.5 h-2.5" /> APPROVED</Badge>}
                {approvalStage === "submitted" && <Badge className="bg-amber-600 text-white border-amber-500 text-[10px] font-bold gap-1"><Clock className="w-2.5 h-2.5" /> PENDING</Badge>}
                {approvalStage === "under_review" && <Badge className="bg-purple-600 text-white border-purple-500 text-[10px] font-bold gap-1"><Eye className="w-2.5 h-2.5" /> IN REVIEW</Badge>}
                {approvalStage === "rejected" && <Badge className="bg-rose-600 text-white border-rose-500 text-[10px] font-bold gap-1"><Ban className="w-2.5 h-2.5" /> REJECTED</Badge>}
                <Badge className="bg-blue-700 text-blue-100 border-blue-600 text-[10px] font-mono">{version}</Badge>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/20 text-white"><X className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <Tabs defaultValue="builder" className="flex-1 min-h-0 flex flex-col">
                <div className="px-6 pt-3 pb-0 border-b border-slate-100 shrink-0">
                  <TabsList className="w-full grid grid-cols-3 h-9 bg-slate-100">
                    <TabsTrigger value="builder" className="gap-1.5 text-xs"><Calculator className="w-3.5 h-3.5" /> Formula Builder</TabsTrigger>
                    <TabsTrigger value="ppa" className="gap-1.5 text-xs"><Settings2 className="w-3.5 h-3.5" /> PPA Mapping</TabsTrigger>
                    <TabsTrigger value="approval" className="gap-1.5 text-xs relative">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approval
                      {approvalStage !== "draft" && approvalStage !== "locked" && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ── FORMULA BUILDER TAB ────────────────────────────────────────── */}
                <TabsContent value="builder" className="flex-1 min-h-0 overflow-hidden m-0">
                  <div className="h-full overflow-y-auto">
                    <div className="p-5 pb-6 space-y-5">

                      {isFormulaLocked && (
                        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-2 border-amber-400 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-amber-900">This formula is {approvalStage === "locked" ? "locked" : "approved"}.</p>
                              <p className="text-xs text-amber-700">Changes require a new version — request unlock to create a new draft.</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1.5 border-amber-400 text-amber-700 hover:bg-amber-100 text-xs shrink-0" onClick={() => { setApprovalStage("draft"); setVersion(v => v.replace(/\(.*\)/, "(Draft)")); toast.info("Formula unlocked — new draft created"); }}>
                            <Unlock className="w-3 h-3" /> Request Unlock
                          </Button>
                        </div>
                      )}

                      {approvalStage === "rejected" && (
                        <div className="flex items-center justify-between px-4 py-3 bg-rose-50 border-2 border-rose-300 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Ban className="w-5 h-5 text-rose-600 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-rose-800">Formula rejected by reviewer.</p>
                              <p className="text-xs text-rose-600">Reason: {rejectionReason}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1.5 border-rose-300 text-rose-600 hover:bg-rose-100 text-xs shrink-0" onClick={handleResetToDraft}>
                            <Edit3 className="w-3 h-3" /> Edit & Resubmit
                          </Button>
                        </div>
                      )}

                      {approvalStage === "submitted" && (
                        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600 shrink-0 animate-pulse" />
                            <div>
                              <p className="text-sm font-bold text-blue-800">Formula pending Checker review.</p>
                              <p className="text-xs text-blue-600">Submitted {submittedAt} — go to Approval tab to view status.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Template Library */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <button onClick={() => setShowTemplates(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                            <BookOpen className="w-3.5 h-3.5 text-[#2955A0]" /> Formula Template Library
                            <Badge className="bg-[#2955A0] text-white text-[9px] ml-1">{FORMULA_TEMPLATES.length}</Badge>
                          </span>
                          {showTemplates ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {showTemplates && (
                          <div className="divide-y divide-slate-100">
                            {["Performance", "Losses", "Commercial", "AI/Predict"].map(cat => (
                              <div key={cat}>
                                <p className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">{cat}</p>
                                {FORMULA_TEMPLATES.filter(t => t.category === cat).map(tpl => (
                                  <div key={tpl.id} className="px-4 py-2.5 hover:bg-blue-50 group flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-slate-800">{tpl.label}</p>
                                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">{tpl.formula}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Info className="w-2.5 h-2.5" />{tpl.note}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => applyTemplate(tpl)}>Use</Button>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Parameter Palette */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Available Parameters</Label>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] border-dashed gap-1" onClick={() => setShowAddParam(v => !v)}>
                            <Plus className="w-2.5 h-2.5" /> Add Parameter
                          </Button>
                        </div>

                        {showAddParam && (
                          <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Select value={selectedNewParam} onValueChange={setSelectedNewParam}>
                              <SelectTrigger className="flex-1 h-7 text-xs"><SelectValue placeholder="Select data source parameter…" /></SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_EXTRA_PARAMS.filter(p => !allParams.find(ap => ap.name === p)).map(p => (
                                  <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button size="sm" className="h-7 text-xs bg-[#2955A0]" onClick={() => {
                              if (!selectedNewParam) { toast.error("Select a parameter first"); return; }
                              setCustomParams(prev => [...prev, { name: selectedNewParam, source: "Derived / Custom", type: "Derived", unit: "—", sampleValue: "—", refreshRate: "On Demand", description: "Custom parameter added for this KPI formula" }]);
                              insertAtCursor(selectedNewParam);
                              setShowAddParam(false);
                              setSelectedNewParam("");
                              toast.success(`${selectedNewParam} added to parameter palette`);
                            }}>Add</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAddParam(false)}>Cancel</Button>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[72px]">
                          {allParams.map(param => (
                            <div
                              key={param.name}
                              onClick={() => insertAtCursor(param.name)}
                              onMouseEnter={() => setHoveredParam(param)}
                              onMouseLeave={() => setHoveredParam(null)}
                              className="relative flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-95 group"
                            >
                              <span className="text-[11px] font-medium text-slate-700">{param.name}</span>
                              <Badge variant="secondary" className={`text-[8px] px-1 h-3.5 ${param.type === "Constant" ? "bg-amber-50 text-amber-700 border-amber-200" : param.type === "Derived" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                                {param.source.split(" ")[0]}
                              </Badge>
                              {customParams.find(c => c.name === param.name) && (
                                <button
                                  onClick={e => { e.stopPropagation(); setCustomParams(prev => prev.filter(p => p.name !== param.name)); toast.info(`${param.name} removed`); }}
                                  className="hidden group-hover:flex w-3.5 h-3.5 items-center justify-center rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 ml-0.5"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {hoveredParam && (
                          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-[#2955A0] text-white rounded-xl text-xs space-y-1.5 shadow-xl border border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm">{hoveredParam.name}</span>
                              <Badge className={`text-[9px] ${hoveredParam.type === "Constant" ? "bg-amber-600" : hoveredParam.type === "Derived" ? "bg-purple-600" : "bg-blue-600"}`}>{hoveredParam.type}</Badge>
                            </div>
                            <p className="text-blue-200 leading-relaxed">{hoveredParam.description}</p>
                            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700">
                              <div><p className="text-[9px] text-slate-400 uppercase">Source</p><p className="font-semibold text-[11px]">{hoveredParam.source}</p></div>
                              <div><p className="text-[9px] text-slate-400 uppercase">Unit</p><p className="font-semibold text-[11px]">{hoveredParam.unit}</p></div>
                              <div><p className="text-[9px] text-slate-400 uppercase">Sample</p><p className="font-semibold text-[11px] text-emerald-400">{hoveredParam.sampleValue}</p></div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400"><Clock className="w-2.5 h-2.5" /> Refresh: {hoveredParam.refreshRate}</div>
                          </motion.div>
                        )}
                      </div>

                      {/* Operators */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Operators & Functions</Label>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { display: "+", real: "+" }, { display: "\u2212", real: "-" }, { display: "\u00D7", real: "*" }, { display: "\u00F7", real: "/" },
                            { display: "(", real: "(" }, { display: ")", real: ")" }, { display: ">", real: ">" }, { display: "<", real: "<" },
                            { display: "IF", real: "IF" }, { display: "ELSE", real: "ELSE" }, { display: "AND", real: "AND" }, { display: "OR", real: "OR" },
                            { display: "MIN", real: "MIN" }, { display: "MAX", real: "MAX" }, { display: "ABS", real: "ABS" }, { display: "ROUND", real: "ROUND" },
                          ].map(op => (
                            <Button
                              key={op.display}
                              variant="outline"
                              size="sm"
                              className={`h-7 min-w-[36px] px-2 text-xs font-mono ${["IF","ELSE","AND","OR","MIN","MAX","ABS","ROUND"].includes(op.real) ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100" : "bg-slate-50"}`}
                              onClick={() => insertAtCursor(op.real)}
                            >{op.display}</Button>
                          ))}
                        </div>
                      </div>

                      {/* Formula Editor */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Calculation Logic</Label>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-slate-400" onClick={handleUndo} disabled={formulaHistory.length === 0}>
                              <Undo2 className="w-2.5 h-2.5" /> Undo
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-slate-400" onClick={handleClear} disabled={!formula}>
                              <RotateCcw className="w-2.5 h-2.5" /> Clear
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-slate-500" onClick={() => { navigator.clipboard.writeText(formula); toast.success("Formula copied"); }}>
                              <Copy className="w-2.5 h-2.5" /> Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`h-6 text-[10px] gap-1 ${syntaxResult === null ? "" : syntaxResult.valid ? "border-emerald-400 text-emerald-700" : "border-rose-400 text-rose-700"}`}
                              onClick={runSyntaxCheck}
                            >
                              {syntaxResult === null ? "Check Syntax" : syntaxResult.valid ? <><CheckCircle2 className="w-2.5 h-2.5" /> Valid</> : <><AlertTriangle className="w-2.5 h-2.5" /> {syntaxResult.errors.length} Error(s)</>}
                            </Button>
                          </div>
                        </div>

                        <div className="bg-slate-900 rounded-t-lg px-4 py-2 font-mono text-sm leading-relaxed min-h-[44px] flex flex-wrap items-start gap-x-0.5 border border-slate-700 border-b-0">
                          {tokens.length > 0 ? tokens.map((tok, i) => (
                            <span key={i} className={TOKEN_COLOR[tok.type]}>{tok.text}</span>
                          )) : <span className="text-slate-600 italic">Highlighted preview appears here…</span>}
                        </div>
                        <textarea
                          ref={textareaRef}
                          value={formula}
                          onChange={e => handleFormulaChange(e.target.value)}
                          disabled={isFormulaLocked || approvalStage === "submitted" || approvalStage === "under_review"}
                          className={`w-full h-20 px-4 py-2 font-mono text-sm text-slate-700 bg-white border border-slate-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none leading-relaxed border-t-0 ${isFormulaLocked || approvalStage === "submitted" || approvalStage === "under_review" ? "opacity-60 cursor-not-allowed" : ""}`}
                          placeholder="Type formula here — click parameters / operators above to insert…"
                          spellCheck={false}
                        />

                        {syntaxResult && !syntaxResult.valid && (
                          <div className="space-y-1">
                            {syntaxResult.errors.map((err, i) => (
                              <div key={i} className="flex items-start gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>{err}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {syntaxResult?.valid && syntaxResult.warnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>{w}</span>
                          </div>
                        ))}
                      </div>

                      {/* Thresholds */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Compliance Thresholds</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1"><Label className="text-[10px] text-slate-500">Tolerance %</Label><Input value={tolerance} onChange={e => setTolerance(e.target.value)} className="h-8 text-xs font-mono" /></div>
                          <div className="space-y-1"><Label className="text-[10px] text-amber-600 font-semibold">Warning below</Label><Input value={warnThreshold} onChange={e => setWarnThreshold(e.target.value)} className="h-8 text-xs font-mono border-amber-200 focus:border-amber-400 focus:ring-amber-200" /></div>
                          <div className="space-y-1"><Label className="text-[10px] text-rose-600 font-semibold">Critical below</Label><Input value={critThreshold} onChange={e => setCritThreshold(e.target.value)} className="h-8 text-xs font-mono border-rose-200 focus:border-rose-400 focus:ring-rose-200" /></div>
                        </div>
                      </div>

                      {/* Multi-Scenario Simulation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Multi-Scenario Simulation</Label>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-slate-400" onClick={() => setEditingScenario(editingScenario !== null ? null : 0)}>
                              <Edit3 className="w-2.5 h-2.5" /> {editingScenario !== null ? "Done" : "Edit Values"}
                            </Button>
                            <Button size="sm" className="h-6 text-[10px] bg-[#2955A0] hover:bg-[#1E4888] gap-1" onClick={runSimulation} disabled={simRunning}>
                              {simRunning ? <><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Running…</> : <><Play className="w-2.5 h-2.5" /> Run Simulation</>}
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                          <div className="grid grid-cols-5 bg-slate-800 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide gap-2">
                            <span>Scenario</span><span>Generation</span><span>Capacity</span><span>Hours</span><span className="text-right">Result</span>
                          </div>
                          {scenarios.map((sc, idx) => {
                            const result = simDone ? smartEvaluate(formula, sc) : null;
                            const numResult = result ? parseFloat(result.replace(/[^0-9.]/g, "")) : 0;
                            const isPercent = result?.endsWith("%");
                            const resultColor = result
                              ? (isPercent && numResult >= parseFloat(warnThreshold)) ? "text-emerald-400"
                              : (isPercent && numResult >= parseFloat(critThreshold)) ? "text-amber-400"
                              : isPercent ? "text-rose-400"
                              : "text-blue-300"
                              : "text-slate-500";
                            return (
                              <div key={idx} className="grid grid-cols-5 px-4 py-2.5 text-xs font-mono gap-2 border-t border-slate-800 items-center">
                                <span className="text-blue-300 font-semibold">{sc.label}</span>
                                {editingScenario !== null ? (
                                  <>
                                    <input className="bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-[11px] text-slate-200 w-full" value={sc.gen} onChange={e => { const v = parseFloat(e.target.value) || 0; setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, gen: v } : s)); }} />
                                    <input className="bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-[11px] text-slate-200 w-full" value={sc.capacity} onChange={e => { const v = parseFloat(e.target.value) || 0; setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, capacity: v } : s)); }} />
                                    <input className="bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-[11px] text-slate-200 w-full" value={sc.hours} onChange={e => { const v = parseFloat(e.target.value) || 0; setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, hours: v } : s)); }} />
                                  </>
                                ) : (
                                  <>
                                    <span className="text-slate-300">{sc.gen.toLocaleString()}</span>
                                    <span className="text-amber-300">{sc.capacity} MW</span>
                                    <span className="text-slate-400">{sc.hours} h</span>
                                  </>
                                )}
                                <span className={`text-right font-bold ${resultColor}`}>{result ?? "—"}</span>
                              </div>
                            );
                          })}
                          {simDone && (
                            <div className="px-4 py-2 border-t border-slate-700 bg-slate-800 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">Avg across scenarios</span>
                              <span className="text-emerald-400 font-bold font-mono text-sm">
                                {(() => {
                                  const results = scenarios.map(sc => smartEvaluate(formula, sc)).filter(Boolean).map(r => parseFloat(r!.replace(/[^0-9.]/g, "")));
                                  return results.length > 0 ? (results.reduce((a, b) => a + b, 0) / results.length).toFixed(2) : "—";
                                })()}
                                {formula.includes("Tariff_Rate") && !formula.includes("Installed_Capacity") ? "" : "%"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Formula Version History */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <button onClick={() => setShowHistory(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                            <History className="w-3.5 h-3.5 text-blue-600" /> Version History
                            <Badge className="bg-blue-600 text-white text-[9px]">{FORMULA_HISTORY.length}</Badge>
                          </span>
                          {showHistory ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {showHistory && (
                          <div className="divide-y divide-slate-100">
                            {FORMULA_HISTORY.map((fv, i) => (
                              <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 group">
                                <div className="text-center shrink-0 w-12">
                                  <Badge className={`text-[9px] font-mono ${fv.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{fv.version}</Badge>
                                  <p className="text-[8px] text-slate-400 mt-0.5">{fv.date}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-[10px] text-slate-600 truncate">{fv.formula}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{fv.reason} — by {fv.changedBy}</p>
                                </div>
                                <Button
                                  size="sm" variant="ghost"
                                  className="h-5 text-[9px] opacity-0 group-hover:opacity-100 text-blue-600 shrink-0"
                                  onClick={() => { setFormula(fv.formula); setSyntaxResult(null); setSimDone(false); toast.success(`Restored ${fv.version} formula`); }}
                                >Restore</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dependent KPIs */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" /> Dependent KPIs</Label>
                        <div className="flex flex-wrap gap-2">
                          {["LD Computation", "Revenue Analysis", "Curtailment Pattern", "Generation Forecast"].map(dep => (
                            <div key={dep} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 font-medium">
                              <Link2 className="w-3 h-3" /> {dep}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400">Changing this formula will trigger recalculation for all 4 dependent KPIs and linked LD clauses.</p>
                      </div>

                      {/* Impact Analysis */}
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-800">Impact Analysis</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            This formula is active in <span className="font-bold">3 PPA contracts</span> and drives LD computation for FY 2023-24 onward.
                            Estimated revenue impact of formula change: <span className="font-mono font-bold">- Rs 12.4 L</span>.
                            All changes require Approver sign-off and will be versioned.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </TabsContent>

                {/* ── PPA MAPPING TAB ──────────────────────────────────────────── */}
                <TabsContent value="ppa" className="flex-1 min-h-0 overflow-hidden flex flex-col m-0">
                  <div className="px-5 pt-3 pb-2 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Active Contracts — {ppaContracts.length} PPAs linked</p>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => toast.info("PPA onboarding form coming soon")}><Plus className="w-2.5 h-2.5" /> Link Contract</Button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {ppaContracts.map(c => (
                        <button key={c.id} onClick={() => setActivePPA(c.id)} className={`shrink-0 flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-all ${activePPA === c.id ? "border-[#2955A0] bg-[#2955A0] text-white shadow-md" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                          <span className="text-[10px] font-bold">{c.id}</span>
                          <span className={`text-[11px] font-semibold ${activePPA === c.id ? "text-blue-200" : "text-slate-700"}`}>{c.counterparty}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`text-[9px] px-1 rounded font-bold ${c.type === "FiT" ? "bg-purple-100 text-purple-700" : c.type === "Group Captive" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"} ${activePPA === c.id ? "!bg-white/20 !text-white" : ""}`}>{c.type}</span>
                            <span className={`text-[9px] ${activePPA === c.id ? "text-blue-300" : "text-slate-400"}`}>{c.capacity} MW</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="p-5 pb-6 space-y-4">

                      {/* Contract Metadata */}
                      <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                        <div className="px-4 py-2.5 bg-slate-800 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold">{selectedContract.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{selectedContract.id} . {selectedContract.counterparty}</p>
                            </div>
                            <Badge className={selectedContract.status === "active" ? "bg-emerald-600 text-white" : "bg-slate-600"}>{selectedContract.status.toUpperCase()}</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-slate-100">
                          {[
                            { label: "Contract Type", value: selectedContract.type },
                            { label: "Capacity", value: `${selectedContract.capacity} MW` },
                            { label: "Tariff", value: `Rs ${selectedContract.tariff}/kWh` },
                            { label: "Contracted CUF", value: `${selectedContract.contractedCUF}%` },
                            { label: "LD Rate", value: `Rs ${selectedContract.ldRate}/kWh` },
                            { label: "Expiry", value: selectedContract.expiresOn },
                          ].map(f => (
                            <div key={f.label} className="px-4 py-2.5">
                              <p className="text-[9px] text-slate-400 uppercase tracking-wide">{f.label}</p>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">{f.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live LD Exposure Preview */}
                      <div className={`rounded-xl border-2 p-4 flex items-center justify-between ${liveLDExposure.status === "breach" ? "border-rose-300 bg-rose-50" : "border-emerald-300 bg-emerald-50"}`}>
                        <div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live LD Exposure Preview</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Current {kpi.name}: <span className="font-bold text-slate-700">{currentCUF}%</span> vs Contracted: <span className="font-bold">{selectedContract.contractedCUF}%</span>
                          </p>
                        </div>
                        <div className="text-right">
                          {liveLDExposure.status === "breach" ? (
                            <>
                              <p className="text-2xl font-black text-rose-600">Rs {liveLDExposure.amount} Cr</p>
                              <p className="text-[10px] text-rose-500 font-semibold">Annualised LD Exposure</p>
                            </>
                          ) : (
                            <>
                              <p className="text-2xl font-black text-emerald-600">Rs 0</p>
                              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end"><CheckCircle2 className="w-3 h-3" /> No LD exposure</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* KPI-to-Clause Banner */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <Link2 className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="text-xs text-blue-800">
                          <span className="font-bold">KPI Linkage:</span> <span className="font-semibold text-blue-700">{kpi.name}</span> drives LD computation under <span className="font-semibold">{selectedContract.ldClauses.length} clause(s)</span>. Formula override applies from <span className="font-mono">{selectedContract.effectiveFrom}</span>.
                        </div>
                      </div>

                      {/* Parameter Overrides */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <button onClick={() => setExpandedOverrides(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                            <Database className="w-3.5 h-3.5 text-purple-600" /> Parameter Overrides
                            <Badge className="bg-purple-600 text-white text-[9px]">{selectedContract.overrides.length}</Badge>
                          </span>
                          {expandedOverrides ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {expandedOverrides && (
                          <div>
                            <div className="grid grid-cols-[1fr_1fr_1fr_60px_32px] bg-slate-100 px-4 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide gap-2">
                              <span>Parameter</span><span>Master Data</span><span>Contract Override</span><span>Unit</span><span></span>
                            </div>
                            {selectedContract.overrides.map((ov, i) => (
                              <div key={i} className={`grid grid-cols-[1fr_1fr_1fr_60px_32px] px-4 py-2 gap-2 items-center border-t border-slate-100 text-xs ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                                {editingOverride === i ? (
                                  <>
                                    <Input className="h-6 text-[11px] font-mono" value={ov.param} onChange={e => { const val = e.target.value; setPpaContracts(prev => prev.map(c => c.id === activePPA ? { ...c, overrides: c.overrides.map((o, j) => j === i ? { ...o, param: val } : o) } : c)); }} />
                                    <span className="text-slate-400 line-through text-[11px]">{ov.masterValue}</span>
                                    <Input className="h-6 text-[11px] font-bold" value={ov.contractValue} onChange={e => { const val = e.target.value; setPpaContracts(prev => prev.map(c => c.id === activePPA ? { ...c, overrides: c.overrides.map((o, j) => j === i ? { ...o, contractValue: val } : o) } : c)); }} />
                                    <span className="text-slate-400 text-[10px]">{ov.unit}</span>
                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => setEditingOverride(null)}><Check className="w-3 h-3 text-emerald-600" /></Button>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-mono font-semibold text-slate-700">{ov.param}</span>
                                    <span className="text-slate-400 line-through text-[11px]">{ov.masterValue}</span>
                                    <span className="font-bold text-[#2955A0]">{ov.contractValue}</span>
                                    <span className="text-slate-400 text-[10px]">{ov.unit}</span>
                                    <div className="flex gap-0.5">
                                      <button onClick={() => setEditingOverride(i)} className="text-slate-400 hover:text-blue-600"><Edit3 className="w-3 h-3" /></button>
                                      <button onClick={() => { setPpaContracts(prev => prev.map(c => c.id === activePPA ? { ...c, overrides: c.overrides.filter((_, j) => j !== i) } : c)); toast.info("Override removed"); }} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                              <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 border-dashed" onClick={() => {
                                setPpaContracts(prev => prev.map(c => c.id === activePPA ? { ...c, overrides: [...c.overrides, { param: "New_Parameter", masterValue: "Global Default", contractValue: "—", unit: "—" }] } : c));
                                setEditingOverride(selectedContract.overrides.length);
                                toast.success("Override added — editing inline");
                              }}><Plus className="w-2.5 h-2.5" /> Add Override</Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* LD Clauses */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <button onClick={() => setExpandedClauses(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                            <Shield className="w-3.5 h-3.5 text-rose-600" /> LD Clauses & Exposure
                            <Badge className="bg-rose-600 text-white text-[9px]">{selectedContract.ldClauses.length}</Badge>
                          </span>
                          {expandedClauses ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {expandedClauses && (
                          <div className="divide-y divide-slate-100">
                            {selectedContract.ldClauses.map((cl, i) => (
                              <div key={i} className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{cl.clause}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Trigger: <span className="font-semibold text-slate-700">{cl.condition}</span></p>
                                  </div>
                                  <Badge className={`text-[9px] ${cl.risk === "high" ? "bg-rose-100 text-rose-700 border-rose-300" : cl.risk === "medium" ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"}`}>
                                    {cl.risk === "high" ? "High Risk" : cl.risk === "medium" ? "Medium" : "No Risk"}
                                  </Badge>
                                </div>
                                <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] px-3 py-2 rounded-lg leading-relaxed">{cl.ldFormula}</div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-500">Threshold: <span className="font-bold text-slate-700">{cl.threshold}{cl.condition.includes("%") ? "%" : ""}</span></span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">Est. Monthly:</span>
                                    <span className={`font-bold text-sm ${cl.risk === "high" ? "text-rose-600" : cl.risk === "medium" ? "text-amber-600" : "text-emerald-600"}`}>{cl.exposureMonthly}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-semibold">Total LD Exposure (Monthly):</span>
                                <span className="font-bold text-rose-600 text-base">
                                  {(() => { const t = selectedContract.ldClauses.reduce((s, cl) => s + (parseFloat(cl.exposureMonthly.replace(/[^0-9.]/g, "")) || 0), 0); return `Rs ${t.toFixed(2)} Cr`; })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Amendment Log */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <button onClick={() => setExpandedAmendments(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                            <History className="w-3.5 h-3.5 text-blue-600" /> Amendment Log
                            <Badge className="bg-blue-600 text-white text-[9px]">{selectedContract.amendments.length}</Badge>
                          </span>
                          {expandedAmendments ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {expandedAmendments && (
                          <div>
                            {selectedContract.amendments.length === 0 ? (
                              <p className="px-4 py-4 text-xs text-slate-400 italic">No amendments recorded for this contract.</p>
                            ) : (
                              <div className="divide-y divide-slate-100">
                                {selectedContract.amendments.map((am, i) => (
                                  <div key={i} className="px-4 py-3 flex items-start gap-3">
                                    <div className="w-16 shrink-0 text-center">
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[9px] font-mono">{am.ref}</Badge>
                                      <p className="text-[9px] text-slate-400 mt-1">{am.date}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-slate-800">{am.description}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">by {am.changedBy}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                              <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 border-dashed" onClick={() => toast.info("Amendment form — coming soon")}><Plus className="w-2.5 h-2.5" /> Record Amendment</Button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </TabsContent>

                {/* ── APPROVAL WORKFLOW TAB ─────────────────────────────────────── */}
                <TabsContent value="approval" className="flex-1 min-h-0 overflow-hidden m-0">
                  <div className="h-full overflow-y-auto">
                    <div className="p-5 pb-6 space-y-5">

                      {approvalStage === "locked" && (
                        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-400 rounded-xl flex items-center gap-3">
                          <div className="p-2 bg-amber-200 rounded-lg"><Lock className="w-5 h-5 text-amber-800" /></div>
                          <div>
                            <p className="text-sm font-bold text-amber-900">Formula Locked for Billing Cycle</p>
                            <p className="text-xs text-amber-700">Approved formula is now active in production. Changes require a new version.</p>
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-[#2955A0] to-[#0089C9] flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Approval Workflow</h3>
                          <Badge className={`text-[10px] font-bold gap-1 ${
                            approvalStage === "draft" ? "bg-slate-600 text-white" :
                            approvalStage === "submitted" ? "bg-amber-500 text-white" :
                            approvalStage === "under_review" ? "bg-purple-500 text-white" :
                            approvalStage === "approved" ? "bg-emerald-500 text-white" :
                            approvalStage === "locked" ? "bg-amber-600 text-white" :
                            "bg-rose-500 text-white"
                          }`}>{approvalStage === "draft" ? "Draft" : approvalStage === "submitted" ? "Pending Checker" : approvalStage === "under_review" ? "Pending Approver" : approvalStage === "approved" ? "Approved" : approvalStage === "locked" ? "Locked" : "Rejected"}</Badge>
                        </div>

                        <div className="p-4 space-y-0">
                          {/* ── MAKER STAGE ── */}
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                approvalStage === "draft" ? "bg-blue-100 ring-2 ring-blue-400" :
                                "bg-emerald-100"
                              }`}>
                                {approvalStage === "draft" ? <User className="w-4 h-4 text-blue-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
                              </div>
                              <div className={`w-0.5 flex-1 min-h-[24px] ${approvalStage !== "draft" ? "bg-emerald-300" : "bg-slate-200"}`} />
                            </div>
                            <div className="pb-5 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xs font-bold text-slate-600 uppercase">Maker</h4>
                                <span className="text-[10px] text-slate-400">Formula Author</span>
                                {approvalStage !== "draft" && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] ml-auto">Submitted ✓</Badge>}
                              </div>
                              <p className="text-sm font-semibold text-slate-900">Current User</p>
                              <p className="text-xs text-slate-500 mt-0.5">Role: KPI Analyst · EESL Analytics</p>
                              {approvalStage === "draft" && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs text-slate-500 italic">Fill in Change Reason and click "Save & Submit" in the footer to begin the review process.</p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => toast.success("Draft saved locally")}>
                                      <Save className="w-3 h-3" /> Save Draft
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {approvalStage !== "draft" && (
                                <div className="mt-2 text-xs text-slate-500 space-y-1">
                                  <p><span className="text-slate-400">Submitted:</span> <span className="font-medium text-slate-700">{submittedAt}</span></p>
                                  <p><span className="text-slate-400">Reason:</span> <span className="font-medium text-slate-700">{changeReason}</span></p>
                                  <div className="mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Submitted Formula</p>
                                    <code className="text-[10px] font-mono text-blue-700 break-all">{submittedFormula}</code>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ── CHECKER STAGE ── */}
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                approvalStage === "submitted" ? "bg-amber-100 ring-2 ring-amber-400" :
                                approvalStage === "under_review" || approvalStage === "approved" || approvalStage === "locked" ? "bg-emerald-100" :
                                approvalStage === "rejected" && !rejectionReason.includes("Approver") ? "bg-rose-100" :
                                "bg-slate-100"
                              }`}>
                                {approvalStage === "submitted" ? <UserCheck className="w-4 h-4 text-amber-600" /> :
                                 approvalStage === "under_review" || approvalStage === "approved" || approvalStage === "locked" ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                                 approvalStage === "rejected" && !rejectionReason.includes("Approver") ? <Ban className="w-4 h-4 text-rose-600" /> :
                                 <UserCheck className="w-4 h-4 text-slate-400" />}
                              </div>
                              <div className={`w-0.5 flex-1 min-h-[24px] ${
                                approvalStage === "under_review" || approvalStage === "approved" || approvalStage === "locked" ? "bg-emerald-300" :
                                approvalStage === "submitted" ? "bg-amber-200" : "bg-slate-200"
                              }`} />
                            </div>
                            <div className="pb-5 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xs font-bold text-slate-600 uppercase">Checker</h4>
                                <span className="text-[10px] text-slate-400">Technical Reviewer</span>
                                {(approvalStage === "under_review" || approvalStage === "approved" || approvalStage === "locked") && (
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] ml-auto">Verified ✓</Badge>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-slate-900">Priya Nair</p>
                              <p className="text-xs text-slate-500 mt-0.5">Role: Technical Lead · Formula Governance</p>

                              {approvalStage === "submitted" && (
                                <div className="mt-3 space-y-3">
                                  <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Review Comment</Label>
                                    <Textarea
                                      placeholder="Add technical review notes…"
                                      value={checkerComment}
                                      onChange={e => setCheckerComment(e.target.value)}
                                      className="h-16 text-xs resize-none"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                                      setApprovalStage("under_review");
                                      setVersion(v => v.replace(/\(.*\)/, "(Under Review)"));
                                      toast.success("Checker verified — forwarded to Approver");
                                    }}>
                                      <CheckCircle className="w-3 h-3" /> Approve & Forward
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => {
                                      setApprovalStage("draft");
                                      setVersion(v => v.replace(/\(.*\)/, "(Draft)"));
                                      toast.info("Sent back to Maker for revision");
                                    }}>
                                      <RotateCcw className="w-3 h-3" /> Send Back
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-rose-300 text-rose-600 hover:bg-rose-50" onClick={() => {
                                      setApprovalStage("rejected");
                                      setRejectionReason(checkerComment || "Rejected by Checker — formula logic needs revision");
                                      setVersion(v => v.replace(/\(.*\)/, "(Rejected)"));
                                      toast.error("Formula rejected by Checker");
                                    }}>
                                      <Ban className="w-3 h-3" /> Reject
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {approvalStage !== "draft" && approvalStage !== "submitted" && approvalStage !== "rejected" && (
                                <div className="mt-2 text-xs text-slate-500">
                                  <p><span className="text-slate-400">Reviewed:</span> <span className="font-medium text-slate-700">Mar 5, 2026 11:15</span></p>
                                  {checkerComment && <p><span className="text-slate-400">Comment:</span> <span className="font-medium text-slate-700">{checkerComment}</span></p>}
                                </div>
                              )}

                              {approvalStage === "rejected" && !rejectionReason.includes("Approver") && (
                                <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                                  <p className="text-xs font-bold text-rose-700">Rejected</p>
                                  <p className="text-xs text-rose-600 mt-0.5">{rejectionReason}</p>
                                  <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 mt-2 border-rose-300 text-rose-600" onClick={handleResetToDraft}>
                                    <Edit3 className="w-2.5 h-2.5" /> Revise & Resubmit
                                  </Button>
                                </div>
                              )}

                              {(approvalStage === "draft") && (
                                <p className="mt-2 text-[10px] text-slate-400 italic">Awaiting submission</p>
                              )}
                            </div>
                          </div>

                          {/* ── APPROVER STAGE ── */}
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                approvalStage === "under_review" ? "bg-purple-100 ring-2 ring-purple-400" :
                                approvalStage === "approved" || approvalStage === "locked" ? "bg-emerald-100" :
                                approvalStage === "rejected" && rejectionReason.includes("Approver") ? "bg-rose-100" :
                                "bg-slate-100"
                              }`}>
                                {approvalStage === "under_review" ? <ShieldCheck className="w-4 h-4 text-purple-600" /> :
                                 approvalStage === "approved" || approvalStage === "locked" ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                                 approvalStage === "rejected" && rejectionReason.includes("Approver") ? <Ban className="w-4 h-4 text-rose-600" /> :
                                 <ShieldCheck className="w-4 h-4 text-slate-400" />}
                              </div>
                            </div>
                            <div className="pb-2 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xs font-bold text-slate-600 uppercase">Approver</h4>
                                <span className="text-[10px] text-slate-400">Final Sign-off</span>
                                {approvalStage === "approved" && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] ml-auto">Approved ✓</Badge>}
                                {approvalStage === "locked" && <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] ml-auto">Locked ✓</Badge>}
                              </div>
                              <p className="text-sm font-semibold text-slate-900">Rahul Sharma</p>
                              <p className="text-xs text-slate-500 mt-0.5">Role: Head — Analytics & Governance</p>

                              {approvalStage === "under_review" && (
                                <div className="mt-3 space-y-3">
                                  <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Approval Comment</Label>
                                    <Textarea
                                      placeholder="Add approval notes or conditions…"
                                      value={approverComment}
                                      onChange={e => setApproverComment(e.target.value)}
                                      className="h-16 text-xs resize-none"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => {
                                      setApprovalStage("approved");
                                      setVersion(v => v.replace(/\(.*\)/, "(Approved)"));
                                      toast.success("Formula approved by Approver");
                                    }}>
                                      <CheckCircle className="w-3 h-3" /> Approve
                                    </Button>
                                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2955A0] hover:bg-[#1E4888] text-white" onClick={() => {
                                      setApprovalStage("locked");
                                      setVersion(v => v.replace(/\(.*\)/, "(Locked)"));
                                      toast.success("Formula approved and locked for billing cycle");
                                    }}>
                                      <Lock className="w-3 h-3" /> Approve & Lock
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-rose-300 text-rose-600 hover:bg-rose-50" onClick={() => {
                                      setApprovalStage("rejected");
                                      setRejectionReason(approverComment || "Rejected by Approver — formula needs business justification");
                                      setVersion(v => v.replace(/\(.*\)/, "(Rejected)"));
                                      toast.error("Formula rejected by Approver");
                                    }}>
                                      <Ban className="w-3 h-3" /> Reject
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {approvalStage === "approved" && (
                                <div className="mt-3 space-y-2">
                                  <div className="text-xs text-slate-500">
                                    <p><span className="text-slate-400">Approved:</span> <span className="font-medium text-slate-700">Mar 5, 2026 12:00</span></p>
                                    {approverComment && <p><span className="text-slate-400">Comment:</span> <span className="font-medium text-slate-700">{approverComment}</span></p>}
                                  </div>
                                  <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2955A0] hover:bg-[#1E4888] text-white" onClick={() => {
                                    setApprovalStage("locked");
                                    setVersion(v => v.replace(/\(.*\)/, "(Locked)"));
                                    toast.success("Formula locked for billing cycle");
                                  }}>
                                    <Lock className="w-3 h-3" /> Lock for Billing
                                  </Button>
                                </div>
                              )}

                              {approvalStage === "locked" && (
                                <div className="mt-2 text-xs text-slate-500">
                                  <p><span className="text-slate-400">Approved & Locked:</span> <span className="font-medium text-slate-700">Mar 5, 2026 12:01</span></p>
                                  {approverComment && <p><span className="text-slate-400">Comment:</span> <span className="font-medium text-slate-700">{approverComment}</span></p>}
                                </div>
                              )}

                              {approvalStage === "rejected" && rejectionReason.includes("Approver") && (
                                <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                                  <p className="text-xs font-bold text-rose-700">Rejected</p>
                                  <p className="text-xs text-rose-600 mt-0.5">{rejectionReason}</p>
                                  <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 mt-2 border-rose-300 text-rose-600" onClick={handleResetToDraft}>
                                    <Edit3 className="w-2.5 h-2.5" /> Revise & Resubmit
                                  </Button>
                                </div>
                              )}

                              {(approvalStage === "draft" || approvalStage === "submitted") && (
                                <p className="mt-2 text-[10px] text-slate-400 italic">{approvalStage === "submitted" ? "Awaiting Checker verification" : "Awaiting submission"}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── AUDIT TRAIL ── */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                          <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2"><History className="w-3.5 h-3.5 text-[#2955A0]" /> Approval Audit Trail</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {approvalHistory.map((entry, i) => (
                            <div key={i} className="px-4 py-2.5 flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                entry.stage === "draft" ? "bg-slate-100" :
                                entry.stage === "submitted" ? "bg-blue-100" :
                                entry.stage === "under_review" ? "bg-emerald-100" :
                                entry.stage === "approved" ? "bg-emerald-100" :
                                entry.stage === "locked" ? "bg-amber-100" :
                                "bg-rose-100"
                              }`}>
                                {entry.stage === "draft" ? <FileText className="w-3 h-3 text-slate-500" /> :
                                 entry.stage === "submitted" ? <Send className="w-3 h-3 text-blue-600" /> :
                                 entry.stage === "under_review" ? <CheckCircle className="w-3 h-3 text-emerald-600" /> :
                                 entry.stage === "approved" ? <ShieldCheck className="w-3 h-3 text-emerald-600" /> :
                                 entry.stage === "locked" ? <Lock className="w-3 h-3 text-amber-600" /> :
                                 <Ban className="w-3 h-3 text-rose-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-slate-800">{entry.action}</span>
                                  <span className="text-[10px] text-slate-400">{entry.date}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-0.5">by {entry.by}</p>
                                {entry.comment && <p className="text-[10px] text-slate-500 mt-0.5 italic">"{entry.comment}"</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── GOVERNANCE INFO ── */}
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-2"><Shield className="w-3.5 h-3.5" /> Formula Governance Policy</h4>
                        <ul className="text-[11px] text-blue-700 space-y-1.5 list-disc list-inside">
                          <li>All formula changes require Checker verification and Approver sign-off</li>
                          <li>Locked formulas cannot be modified until the billing cycle ends</li>
                          <li>Version history is maintained for audit compliance (CERC/SEBI)</li>
                          <li>Revenue-impacting changes require documented business justification</li>
                          <li>Rejected formulas must be revised and resubmitted for fresh review</li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
              {approvalStage === "draft" && (
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Change Reason <span className="text-rose-500">*</span></Label>
                    <Input placeholder="e.g. Contract Amendment C4.2 — LD rate revision" value={changeReason} onChange={e => setChangeReason(e.target.value)} className="h-8 text-xs bg-white" />
                  </div>
                  <div className="space-y-1 shrink-0">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Effective From</Label>
                    <Input type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} className="h-8 w-36 bg-white text-xs" />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Version:</span>
                  <Badge variant="outline" className="font-mono bg-white text-[10px]">{version}</Badge>
                  {approvalStage === "draft" && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-400">Requires Approver sign-off</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
                    {isFormulaLocked ? "Close" : "Cancel"}
                  </Button>
                  {approvalStage === "draft" && (
                    <Button size="sm" className="bg-[#2955A0] text-white hover:bg-[#1E4888] gap-2 text-xs h-8" onClick={handleSaveSubmit}>
                      <Send className="w-3.5 h-3.5" /> Save & Submit
                    </Button>
                  )}
                  {approvalStage === "rejected" && (
                    <Button size="sm" className="bg-[#2955A0] text-white hover:bg-[#1E4888] gap-2 text-xs h-8" onClick={handleResetToDraft}>
                      <Edit3 className="w-3.5 h-3.5" /> Edit & Resubmit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
