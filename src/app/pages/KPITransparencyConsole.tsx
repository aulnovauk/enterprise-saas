import { useState, useRef } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { Switch } from "../components/ui/switch";
import {
  Calculator,
  ChevronDown,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  History,
  Eye,
  Edit,
  Save,
} from "lucide-react";

// KPI List Data
const kpiList = [
  {
    id: "CUF",
    name: "Capacity Utilization Factor",
    value: "18.6%",
    status: "compliant",
    target: "≥ 18.0%",
    deviation: "+3.3%",
  },
  {
    id: "GA",
    name: "Grid Availability",
    value: "97.2%",
    status: "compliant",
    target: "≥ 95.0%",
    deviation: "+2.3%",
  },
  {
    id: "PA",
    name: "Plant Availability",
    value: "94.8%",
    status: "deviation",
    target: "≥ 96.0%",
    deviation: "-1.2%",
  },
  {
    id: "PR",
    name: "Performance Ratio",
    value: "78.8%",
    status: "compliant",
    target: "≥ 75.0%",
    deviation: "+5.1%",
  },
  {
    id: "LD",
    name: "LD Exposure",
    value: "₹1,24,500",
    status: "high-risk",
    target: "₹0",
    deviation: "₹1,24,500",
  },
  {
    id: "DEG",
    name: "Degradation Ratio",
    value: "0.72%",
    status: "deviation",
    target: "≤ 0.50%",
    deviation: "+0.22%",
  },
  {
    id: "ROI",
    name: "Return on Investment",
    value: "12.4%",
    status: "compliant",
    target: "≥ 10.0%",
    deviation: "+2.4%",
  },
];

// Formula breakdown for selected KPI (CUF example)
const cufFormulaData = {
  kpi: "CUF",
  name: "Capacity Utilization Factor",
  value: "18.6%",
  unit: "Percentage",
  calculatedOn: "2026-02-28 23:59:59",
  dataSource: "Sakri Solar Park - April 2026 JMR",
  
  formula: "CUF = (Actual Generation / (Installed Capacity × Hours in Period)) × 100",
  
  inputParameters: [
    { param: "Actual Generation", value: "4,105 MWh", source: "JMR Field: GENERATION_ACTUAL", verified: true },
    { param: "Installed Capacity", value: "50 MW", source: "Contract Annex-A", verified: true },
    { param: "Hours in Period", value: "672 hours", source: "February 2026 (28 days × 24h)", verified: true },
  ],
  
  contractLogic: [
    { clause: "Article 5.2.1", description: "CUF calculation methodology", applied: true },
    { clause: "Article 5.2.3", description: "Exclude grid outage hours from capacity", applied: false },
    { clause: "Article 5.2.5", description: "Degradation adjustment for Year 3+", applied: false },
  ],
  
  adjustmentFactors: [
    { factor: "Grid Outage Adjustment", value: "0 hours", impact: "No adjustment", applied: false },
    { factor: "Force Majeure Days", value: "0 days", impact: "No adjustment", applied: false },
    { factor: "Seasonal Normalization", value: "1.00x", impact: "No adjustment", applied: false },
  ],
  
  calculation: {
    step1: { desc: "Capacity-Hours Available", formula: "50 MW × 672 hours", result: "33,600 MWh" },
    step2: { desc: "Generation to Capacity Ratio", formula: "4,105 MWh ÷ 33,600 MWh", result: "0.1222" },
    step3: { desc: "Convert to Percentage", formula: "0.1222 × 100", result: "12.22%" },
    step4: { desc: "Apply Contract Adjustments", formula: "12.22% + 0%", result: "12.22%" },
    step5: { desc: "Final CUF (Actual Calculated)", formula: "Round to 1 decimal", result: "18.6%" },
  },
};

// Contract Clauses
const contractClauses = [
  {
    id: "ART-5.2.1",
    title: "Article 5.2.1 - CUF Calculation Methodology",
    text: "The Capacity Utilization Factor (CUF) shall be calculated as the ratio of actual energy generation to the maximum possible energy generation during the billing period, expressed as a percentage.",
    effectiveDate: "2024-01-01",
    version: "v1.0",
  },
  {
    id: "ART-5.2.3",
    title: "Article 5.2.3 - Grid Outage Exclusion",
    text: "In case of grid outages exceeding 2 hours per incident, the unavailable capacity-hours shall be excluded from the denominator of the CUF calculation.",
    effectiveDate: "2024-01-01",
    version: "v1.0",
  },
];

// Formula Version History
const formulaVersionHistory = [
  {
    version: "v3.1",
    date: "2026-01-15",
    modifiedBy: "Priya Sharma (Admin)",
    changes: "Updated seasonal normalization factor for winter months",
    status: "Active",
  },
  {
    version: "v3.0",
    date: "2025-06-01",
    modifiedBy: "System Migration",
    changes: "Migrated to new calculation engine with enhanced precision",
    status: "Superseded",
  },
  {
    version: "v2.4",
    date: "2024-11-10",
    modifiedBy: "Rajesh Kumar (Admin)",
    changes: "Added grid outage adjustment logic as per contract amendment",
    status: "Superseded",
  },
];

// Calculation Trace Table
const calculationTrace = [
  { step: 1, parameter: "Installed Capacity", value: "50.000 MW", source: "Contract Annex-A", timestamp: "2026-02-28 23:59:59" },
  { step: 2, parameter: "Days in Period", value: "28 days", source: "February 2026 Calendar", timestamp: "2026-02-28 23:59:59" },
  { step: 3, parameter: "Hours in Period", value: "672 hours", source: "Calculated (28 × 24)", timestamp: "2026-02-28 23:59:59" },
  { step: 4, parameter: "Capacity-Hours Available", value: "33,600.000 MWh", source: "Calculated (50 × 672)", timestamp: "2026-02-28 23:59:59" },
  { step: 5, parameter: "Actual Generation", value: "4,105.000 MWh", source: "JMR Field: GENERATION_ACTUAL", timestamp: "2026-02-28 23:59:59" },
  { step: 6, parameter: "Grid Outage Hours", value: "0.000 hours", source: "JMR Field: GRID_OUTAGE_HRS", timestamp: "2026-02-28 23:59:59" },
  { step: 7, parameter: "Adjusted Capacity-Hours", value: "33,600.000 MWh", source: "Calculated (33,600 - 0)", timestamp: "2026-02-28 23:59:59" },
  { step: 8, parameter: "CUF (Decimal)", value: "0.122173", source: "Calculated (4,105 ÷ 33,600)", timestamp: "2026-02-28 23:59:59" },
  { step: 9, parameter: "CUF (Percentage)", value: "12.2173%", source: "Calculated (0.122173 × 100)", timestamp: "2026-02-28 23:59:59" },
  { step: 10, parameter: "CUF (Final Rounded)", value: "18.6%", source: "Rounded to 1 decimal place", timestamp: "2026-02-28 23:59:59" },
];

export function KPITransparencyConsole() {
  const [selectedKPI, setSelectedKPI] = useState("CUF");
  const [expandedSections, setExpandedSections] = useState({
    formula: true,
    inputs: true,
    contract: true,
    adjustments: true,
    calculation: true,
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEditingFormula, setIsEditingFormula] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  const selectedKPIData = kpiList.find((k) => k.id === selectedKPI);

  return (
    <div ref={pageRef} className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-base font-bold text-gray-900">KPI Transparency Console</h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Full calculation transparency for all KPIs derived from monthly JMR data with contract traceability
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded">
              <Lock className={`w-3.5 h-3.5 ${isAdminMode ? "text-gray-400" : "text-red-600"}`} />
              <span className="text-xs font-medium text-gray-700">Admin Mode</span>
              <Switch checked={isAdminMode} onCheckedChange={setIsAdminMode} />
              <Unlock className={`w-3.5 h-3.5 ${isAdminMode ? "text-green-600" : "text-gray-400"}`} />
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              Data Source: Sakri Solar Park - Apr 2026
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-8">

      {/* Three-Panel Layout */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* LEFT PANEL - KPI List */}
        <div className="col-span-3">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50 pb-4">
              <CardTitle className="text-sm font-semibold">KPI Selection</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Select a KPI to view calculation details</p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  {kpiList.map((kpi) => {
                    const isSelected = selectedKPI === kpi.id;
                    const statusColors = {
                      compliant: "border-green-300 bg-green-50",
                      deviation: "border-yellow-300 bg-yellow-50",
                      "high-risk": "border-red-300 bg-red-50",
                    };
                    const statusBadge = {
                      compliant: <Badge className="bg-green-100 text-green-800 border border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Compliant</Badge>,
                      deviation: <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300"><AlertTriangle className="w-3 h-3 mr-1" />Deviation</Badge>,
                      "high-risk": <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />High Risk</Badge>,
                    };

                    return (
                      <div
                        key={kpi.id}
                        onClick={() => setSelectedKPI(kpi.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? "border-blue-500 bg-blue-50 shadow-md" 
                            : `${statusColors[kpi.status as keyof typeof statusColors]} hover:shadow-sm`
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-xs font-mono font-bold text-gray-900 mb-1">{kpi.id}</div>
                            <div className="text-xs font-semibold text-gray-900">{kpi.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                          {statusBadge[kpi.status as keyof typeof statusBadge]}
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Target:</span>
                            <div className="font-semibold text-gray-900">{kpi.target}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Deviation:</span>
                            <div className={`font-semibold ${
                              kpi.status === "compliant" ? "text-green-600" : 
                              kpi.status === "deviation" ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {kpi.deviation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* CENTER PANEL - Selected KPI Formula Breakdown */}
        <div className="col-span-6">
          <Card className="border-2 border-blue-300">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base font-semibold">{cufFormulaData.name}</CardTitle>
                    <Badge variant="secondary" className="font-mono">{cufFormulaData.kpi}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Data Source:</span>
                      <div className="font-semibold text-gray-900">{cufFormulaData.dataSource}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Calculated On:</span>
                      <div className="font-semibold font-mono text-gray-900">{cufFormulaData.calculatedOn}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">{cufFormulaData.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{cufFormulaData.unit}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-4">
                  {/* Formula Section */}
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSection("formula")}
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.formula ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-gray-900">Formula Definition</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Master Formula</Badge>
                    </div>
                    {expandedSections.formula && (
                      <div className="p-4 bg-gray-50">
                        <div className="p-4 bg-blue-950 rounded border border-blue-800">
                          <code className="text-sm font-mono text-blue-100">{cufFormulaData.formula}</code>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Parameters Section */}
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSection("inputs")}
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.inputs ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-gray-900">Input Parameters</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {cufFormulaData.inputParameters.length} Parameters
                      </Badge>
                    </div>
                    {expandedSections.inputs && (
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {cufFormulaData.inputParameters.map((input, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-xs font-semibold text-gray-900">{input.param}</div>
                                {input.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                              </div>
                              <div className="text-base font-mono font-bold text-blue-600 mb-2">{input.value}</div>
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Source:</span> {input.source}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contract Logic Section */}
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSection("contract")}
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.contract ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-gray-900">Applied Contract Logic</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cufFormulaData.contractLogic.filter(c => c.applied).length} Applied
                      </Badge>
                    </div>
                    {expandedSections.contract && (
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {cufFormulaData.contractLogic.map((logic, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border-2 ${
                                logic.applied 
                                  ? "bg-blue-50 border-blue-300" 
                                  : "bg-gray-50 border-gray-300 opacity-60"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-xs font-mono font-semibold text-gray-900">{logic.clause}</div>
                                {logic.applied ? (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">Applied</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Not Applied</Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-700">{logic.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Adjustment Factors Section */}
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSection("adjustments")}
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.adjustments ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-gray-900">Adjustment Factors</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800 text-xs">
                        {cufFormulaData.adjustmentFactors.filter(a => a.applied).length} Active
                      </Badge>
                    </div>
                    {expandedSections.adjustments && (
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {cufFormulaData.adjustmentFactors.map((adj, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-xs font-semibold text-gray-900">{adj.factor}</div>
                                <Badge variant="secondary" className="text-xs">{adj.applied ? "Applied" : "N/A"}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">Value:</span>
                                  <div className="font-mono font-semibold text-gray-900">{adj.value}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Impact:</span>
                                  <div className="font-semibold text-gray-900">{adj.impact}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculation Steps Section */}
                  <div className="border-2 border-green-300 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 bg-green-50 cursor-pointer hover:bg-green-100"
                      onClick={() => toggleSection("calculation")}
                    >
                      <div className="flex items-center gap-2">
                        {expandedSections.calculation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-gray-900">Step-by-Step Calculation</span>
                      </div>
                      <Badge className="bg-green-600 text-white text-xs">Final Output</Badge>
                    </div>
                    {expandedSections.calculation && (
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {Object.entries(cufFormulaData.calculation).map(([key, step], idx) => (
                            <div key={key} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-gray-900 mb-2">{step.desc}</div>
                                  <div className="p-2 bg-blue-950 rounded mb-2">
                                    <code className="text-xs font-mono text-blue-100">{step.formula}</code>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Result:</span>
                                    <span className="text-base font-mono font-bold text-green-600">{step.result}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - Contract Reference & Configuration */}
        <div className="col-span-3">
          <div className="space-y-6">
            {/* Contract Clause Reference */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Contract Clause Reference</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3">
                    {contractClauses.map((clause) => (
                      <div key={clause.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-xs font-mono font-bold text-blue-600">{clause.id}</div>
                          <Badge variant="secondary" className="text-xs">{clause.version}</Badge>
                        </div>
                        <div className="text-xs font-semibold text-gray-900 mb-2">{clause.title}</div>
                        <div className="text-xs text-gray-700 leading-relaxed mb-2">{clause.text}</div>
                        <div className="text-xs text-gray-600">
                          <span className="font-semibold">Effective:</span> {clause.effectiveDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Editable Formula Configuration */}
            <Card className={`border-2 ${isAdminMode ? "border-orange-300" : "border-gray-300"}`}>
              <CardHeader className={`border-b pb-4 ${isAdminMode ? "bg-orange-50" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAdminMode ? <Unlock className="w-4 h-4 text-orange-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                    <CardTitle className="text-sm font-semibold">Formula Configuration</CardTitle>
                  </div>
                  {!isAdminMode && (
                    <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {!isAdminMode ? (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xs text-gray-600 mb-2">Formula editing is restricted</p>
                    <p className="text-xs text-gray-500">Enable Admin Mode to edit formulas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isEditingFormula ? (
                      <>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Formula Expression</label>
                          <Input
                            defaultValue={cufFormulaData.formula}
                            className="font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-1 block">Modification Reason</label>
                          <Input placeholder="Required for audit trail" className="text-xs" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Save className="w-3 h-3 mr-1" />
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditingFormula(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsEditingFormula(true)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit Formula
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Version History */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-600" />
                  <CardTitle className="text-sm font-semibold">Formula Version History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {formulaVersionHistory.map((version) => (
                      <div
                        key={version.version}
                        className={`p-3 rounded-lg border ${
                          version.status === "Active" 
                            ? "bg-green-50 border-green-300" 
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-xs font-mono font-bold text-gray-900">{version.version}</div>
                          <Badge
                            className={
                              version.status === "Active"
                                ? "bg-green-100 text-green-800 text-xs"
                                : "bg-gray-100 text-gray-800 text-xs"
                            }
                          >
                            {version.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">{version.changes}</div>
                        <div className="text-xs text-gray-600">
                          <div className="font-semibold">{version.modifiedBy}</div>
                          <div className="font-mono">{version.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Calculation Trace Table */}
      <Card className="border-2">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle className="text-base font-semibold">Calculation Trace Table</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Step-by-step calculation audit trail with actual values used</p>
              </div>
            </div>
            <PageExportMenu
              pageTitle="KPI Transparency Console"
              contentRef={pageRef}
              label="Export Calculation Sheet"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-semibold text-xs w-16">Step</TableHead>
                  <TableHead className="font-semibold text-xs">Parameter</TableHead>
                  <TableHead className="font-semibold text-xs">Value</TableHead>
                  <TableHead className="font-semibold text-xs">Source</TableHead>
                  <TableHead className="font-semibold text-xs">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationTrace.map((trace) => (
                  <TableRow key={trace.step} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                        {trace.step}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-900">{trace.parameter}</TableCell>
                    <TableCell className="font-mono text-sm font-bold text-blue-600">{trace.value}</TableCell>
                    <TableCell className="text-xs text-gray-700">{trace.source}</TableCell>
                    <TableCell className="font-mono text-xs text-gray-600">{trace.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
