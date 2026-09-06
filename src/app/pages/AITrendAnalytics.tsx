import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PLANTS, VENDORS } from "../data/plants";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertCircle,
  Sparkles,
  Activity,
  Droplets,
  Target,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
  Cell,
} from "recharts";
import { CustomChartTooltip } from "../components/ChartTooltip";

// Multi-year generation trend (3 years of monthly data)
const generationTrend = [
  { month: "Jan 24", generation: 4750, year: 2024 },
  { month: "Feb 24", generation: 4800, year: 2024 },
  { month: "Mar 24", generation: 5100, year: 2024 },
  { month: "Apr 24", generation: 5200, year: 2024 },
  { month: "May 24", generation: 5400, year: 2024 },
  { month: "Jun 24", generation: 4900, year: 2024 },
  { month: "Jul 24", generation: 4600, year: 2024 },
  { month: "Aug 24", generation: 4820, year: 2024 },
  { month: "Sep 24", generation: 4950, year: 2024 },
  { month: "Oct 24", generation: 5100, year: 2024 },
  { month: "Nov 24", generation: 5050, year: 2024 },
  { month: "Dec 24", generation: 4900, year: 2024 },
  { month: "Jan 25", generation: 4680, year: 2025 },
  { month: "Feb 25", generation: 4720, year: 2025 },
  { month: "Mar 25", generation: 5050, year: 2025 },
  { month: "Apr 25", generation: 5180, year: 2025 },
  { month: "May 25", generation: 5350, year: 2025 },
  { month: "Jun 25", generation: 4850, year: 2025 },
  { month: "Jul 25", generation: 4550, year: 2025 },
  { month: "Aug 25", generation: 4750, year: 2025 },
  { month: "Sep 25", generation: 4890, year: 2025 },
  { month: "Oct 25", generation: 5020, year: 2025 },
  { month: "Nov 25", generation: 4980, year: 2025 },
  { month: "Dec 25", generation: 4850, year: 2025 },
  { month: "Jan 26", generation: 4620, year: 2026 },
  { month: "Feb 26", generation: 4485, year: 2026 },
  { month: "Mar 26", generation: 4950, year: 2026 },
  { month: "Apr 26", generation: 5210, year: 2026 },
];

// Degradation analysis
const degradationData = [
  { year: "Year 1", performance: 100, degradation: 0 },
  { year: "Year 2", performance: 99.3, degradation: 0.7 },
  { year: "Year 3", performance: 98.1, degradation: 1.9 },
  { year: "Year 4 (Projected)", performance: 97.0, degradation: 3.0 },
];

// Curtailment pattern detection
const curtailmentPatterns = [
  { month: "Aug 25", curtailment: 120, pattern: "High" },
  { month: "Sep 25", curtailment: 95, pattern: "Medium" },
  { month: "Oct 25", curtailment: 180, pattern: "High" },
  { month: "Nov 25", curtailment: 145, pattern: "High" },
  { month: "Dec 25", curtailment: 210, pattern: "Critical" },
  { month: "Jan 26", curtailment: 195, pattern: "Critical" },
  { month: "Feb 26", curtailment: 180, pattern: "High" },
  { month: "Mar 26", curtailment: 155, pattern: "High" },
  { month: "Apr 26", curtailment: 110, pattern: "Medium" },
];

// Forecasted generation (next 6 months)
const forecastData = [
  { month: "Feb 26", actual: 4485, forecast: null, lower: null, upper: null },
  { month: "Mar 26", actual: 4950, forecast: null, lower: null, upper: null },
  { month: "Apr 26", actual: 5210, forecast: null, lower: null, upper: null },
  { month: "May 26", actual: null, forecast: 5320, lower: 5050, upper: 5600 },
  { month: "Jun 26", actual: null, forecast: 4850, lower: 4600, upper: 5100 },
  { month: "Jul 26", actual: null, forecast: 4580, lower: 4350, upper: 4800 },
  { month: "Aug 26", actual: null, forecast: 4720, lower: 4500, upper: 4950 },
];

// Cleaning cycle recommendations
const cleaningRecommendations = [
  {
    site: "Sakri Solar Park",
    lastCleaning: "2026-02-10",
    nextRecommended: "2026-03-15",
    daysUntil: 15,
    priority: "medium",
    expectedGain: "+2.8%",
    soilingRate: "0.15%/day",
  },
  {
    site: "Osmanabad Solar Plant",
    lastCleaning: "2026-01-28",
    nextRecommended: "2026-03-05",
    daysUntil: 5,
    priority: "high",
    expectedGain: "+4.2%",
    soilingRate: "0.22%/day",
  },
  {
    site: "Latur Solar Station",
    lastCleaning: "2026-02-18",
    nextRecommended: "2026-03-25",
    daysUntil: 25,
    priority: "low",
    expectedGain: "+1.9%",
    soilingRate: "0.08%/day",
  },
  {
    site: "Amravati Solar Unit",
    lastCleaning: "2026-01-20",
    nextRecommended: "2026-03-01",
    daysUntil: 1,
    priority: "critical",
    expectedGain: "+5.5%",
    soilingRate: "0.28%/day",
  },
];

// Site benchmarking — axes = metrics, series = plants
const siteBenchmarking = [
  { metric: "CUF",          beedBest: 98, portfolioAvg: 85, amravatLow: 72 },
  { metric: "Availability", beedBest: 97, portfolioAvg: 88, amravatLow: 79 },
  { metric: "PR Score",     beedBest: 95, portfolioAvg: 83, amravatLow: 75 },
  { metric: "Efficiency",   beedBest: 92, portfolioAvg: 85, amravatLow: 78 },
  { metric: "Compliance",   beedBest: 96, portfolioAvg: 80, amravatLow: 65 },
  { metric: "LD Safety",    beedBest: 99, portfolioAvg: 82, amravatLow: 60 },
];

// Asset Health Index components
const assetHealthComponents = [
  { component: "Module Performance", score: 87, target: 90 },
  { component: "Inverter Efficiency", score: 92, target: 95 },
  { component: "Grid Stability", score: 78, target: 90 },
  { component: "String Performance", score: 85, target: 88 },
  { component: "Tracker Accuracy", score: 91, target: 92 },
];

// AI Insights
const aiInsights = [
  {
    id: 1,
    type: "Critical",
    icon: AlertCircle,
    color: "#EF4444",
    title: "Accelerated Degradation Detected",
    description: "Amravati Solar Unit shows 0.8% annual degradation vs industry standard 0.5%. Recommend immediate module inspection.",
    confidence: 94,
    impact: "High",
    actionable: true,
  },
  {
    id: 2,
    type: "Opportunity",
    icon: TrendingUp,
    color: "#10B981",
    title: "Cleaning Optimization Potential",
    description: "Optimizing cleaning cycles across portfolio could increase generation by 3.2% (annual: +1,850 MWh).",
    confidence: 89,
    impact: "Medium",
    actionable: true,
  },
  {
    id: 3,
    type: "Pattern",
    icon: Sparkles,
    color: "#E8A800",
    title: "Curtailment Pattern Identified",
    description: "Grid curtailment peaks during Dec-Jan (avg 200 MWh/month). Correlates with regional demand dips.",
    confidence: 96,
    impact: "Medium",
    actionable: false,
  },
  {
    id: 4,
    type: "Prediction",
    icon: Activity,
    color: "#6366F1",
    title: "Q2 Performance Forecast",
    description: "ML models predict 5.2% increase in Q2 generation vs Q1. High confidence based on 3-year seasonal patterns.",
    confidence: 91,
    impact: "Low",
    actionable: false,
  },
];

export function AITrendAnalytics() {
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState("all");
  const overallHealthScore = 86.6;
  const totalInsights = aiInsights.length;
  const criticalInsights = aiInsights.filter((i) => i.type === "Critical").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">AI & Trend Analytics</h1>
                <p className="text-xs text-slate-600 mt-0.5">AI-powered insights, forecasting, and optimization recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Model v2.4.1
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                Last Updated: Apr 07, 2026
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Scope:</span>
            </div>
            <Select value={selectedFY} onValueChange={setSelectedFY}>
              <SelectTrigger className="w-[130px] h-7 text-xs bg-slate-50 border-slate-200">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY 2025-26">FY 2025-26</SelectItem>
                <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
                <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-[175px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {VENDORS.map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger className="w-[200px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants (12)</SelectItem>
                {PLANTS.map(p => (
                  <SelectItem key={p.id} value={p.name}>{p.name} ({p.capacity} MW)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedVendor !== "all" || selectedPlant !== "all") && (
              <button
                onClick={() => { setSelectedVendor("all"); setSelectedPlant("all"); }}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100"
              >
                ✕ Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      {/* AI-Generated Insights Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Active</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">AI Insights Generated</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-600">{totalInsights}</span>
              <span className="text-xs text-gray-500">this month</span>
            </div>
            <p className="text-xs text-purple-700 mt-2 font-medium">{criticalInsights} require action</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">Score</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">Asset Health Index</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{overallHealthScore}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
            <p className="text-xs text-blue-700 mt-2 font-medium">Good condition</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800">92% Accuracy</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">6-Month Forecast</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">5,180</span>
              <span className="text-xs text-gray-500">MWh (Apr)</span>
            </div>
            <p className="text-xs text-green-700 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5.2% from Q1
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-800">Monitored</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">Annual Degradation</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-600">0.72%</span>
              <span className="text-xs text-gray-500">per year</span>
            </div>
            <p className="text-xs text-orange-700 mt-2 font-medium">Within acceptable range</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Cards */}
      <Card className="mb-8 border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-base font-semibold">AI-Generated Insights & Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <Card key={insight.id} className="border-2" style={{ borderColor: `${insight.color}40` }}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${insight.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: insight.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            style={{
                              backgroundColor: `${insight.color}20`,
                              color: insight.color,
                              border: `1px solid ${insight.color}40`,
                            }}
                          >
                            {insight.type}
                          </Badge>
                          {insight.actionable && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Action Required</Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{insight.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mb-3 leading-relaxed">{insight.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <span className="ml-1 font-semibold text-gray-900">{insight.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Impact:</span>
                          <span className="ml-1 font-semibold text-gray-900">{insight.impact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generation Trend Analysis (Multi-Year) */}
      <Card className="mb-8">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-base font-semibold">Multi-Year Generation Trend Analysis</CardTitle>
          <p className="text-xs text-gray-600 mt-1">3-year historical data with trend line and seasonal patterns</p>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={generationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
                stroke="#6B7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" label={{ value: 'Generation (MWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomChartTooltip unit="MWh" />} />
              <Legend />
              <Area type="monotone" dataKey="generation" fill="#2955A020" stroke="none" />
              <Line
                type="monotone"
                dataKey="generation"
                stroke="#2955A0"
                strokeWidth={2}
                dot={{ fill: "#2955A0", r: 3 }}
                name="Monthly Generation"
              />
              <ReferenceLine y={4900} stroke="#F59E0B" strokeDasharray="5 5" label="Avg: 4,900 MWh" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-600 mb-1">Peak Month</div>
                <div className="text-sm font-bold text-gray-900">May 2024</div>
                <div className="text-xs text-gray-500">5,400 MWh</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Lowest Month</div>
                <div className="text-sm font-bold text-gray-900">Feb 2026</div>
                <div className="text-xs text-gray-500">4,485 MWh</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">3-Year Avg</div>
                <div className="text-sm font-bold text-gray-900">4,898 MWh</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Trend</div>
                <div className="text-sm font-bold text-orange-600 flex items-center justify-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -2.8%
                </div>
                <div className="text-xs text-gray-500">YoY decline</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Degradation & Curtailment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Degradation Ratio Chart */}
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-base font-semibold">Module Degradation Analysis</CardTitle>
            <p className="text-xs text-gray-600 mt-1">Annual performance decline with projected trajectory</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={degradationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis
                  yAxisId="left"
                  domain={[95, 101]}
                  tick={{ fontSize: 11 }}
                  stroke="#6B7280"
                  label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 4]}
                  tick={{ fontSize: 11 }}
                  stroke="#6B7280"
                  label={{ value: 'Degradation (%)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                />
                <Tooltip content={<CustomChartTooltip unit="%" />} />
                <Legend />
                <Bar yAxisId="right" dataKey="degradation" fill="#F59E0B" name="Cumulative Degradation (%)" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="performance"
                  stroke="#2955A0"
                  strokeWidth={3}
                  dot={{ fill: "#2955A0", r: 5 }}
                  name="Performance (%)"
                />
                <ReferenceLine yAxisId="left" y={98} stroke="#EF4444" strokeDasharray="5 5" label="Warning: 98%" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-gray-600 mb-1">Current Rate</div>
                <div className="text-base font-bold text-orange-600">0.72% / year</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Industry Avg</div>
                <div className="text-base font-bold text-gray-700">0.50% / year</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Year 4 Projected</div>
                <div className="text-base font-bold text-gray-900">97.0%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curtailment Pattern Detection */}
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-base font-semibold">Grid Curtailment Pattern Detection</CardTitle>
            <p className="text-xs text-gray-600 mt-1">AI-identified patterns in grid curtailment over 7 months</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={curtailmentPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" label={{ value: 'Curtailment (MWh)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip content={<CustomChartTooltip unit="MWh" />} />
                <Bar dataKey="curtailment" name="Curtailment (MWh)" radius={[8, 8, 0, 0]}>
                  {curtailmentPatterns.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.pattern === "Critical"
                          ? "#EF4444"
                          : entry.pattern === "High"
                          ? "#F59E0B"
                          : "#10B981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-gray-700">Critical (&gt;180 MWh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-gray-700">High (120-180 MWh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-gray-700">Medium (&lt;120 MWh)</span>
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-3 bg-yellow-50 p-3 rounded border border-yellow-200">
                <strong>Pattern Detected:</strong> Curtailment peaks during Dec-Jan due to regional demand reduction. 
                Consider energy storage or alternative offtake agreements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasted Generation */}
      <Card className="mb-8">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                6-Month Generation Forecast (ML-Powered)
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Based on 3-year historical patterns, seasonal trends, and degradation models
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              92% Accuracy
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[4000, 6000]} />
              <Tooltip content={<CustomChartTooltip unit="MWh" />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                stackId="1"
                stroke="none"
                fill="#93C5FD"
                fillOpacity={0.3}
                name="Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stackId="2"
                stroke="none"
                fill="#93C5FD"
                fillOpacity={0.3}
                name="Lower Bound"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2955A0"
                strokeWidth={3}
                dot={{ fill: "#2955A0", r: 5 }}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10B981"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: "#10B981", r: 5 }}
                name="Forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-6 gap-3 text-center text-xs">
              {forecastData.slice(1).map((month, idx) => (
                <div key={idx} className="p-3 bg-green-50 rounded">
                  <div className="text-gray-600 mb-1 font-medium">{month.month}</div>
                  <div className="text-base font-bold text-green-600">{month.forecast}</div>
                  <div className="text-gray-500">MWh</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cleaning Cycle Recommendations */}
      <Card className="mb-8">
        <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <div>
              <CardTitle className="text-base font-semibold">AI-Optimized Cleaning Cycle Recommendations</CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Based on soiling rates, weather patterns, and generation impact analysis
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {cleaningRecommendations.map((rec, idx) => {
              const priorityColors = {
                critical: { bg: "bg-red-50", border: "border-red-300", text: "text-red-800", badge: "bg-red-100" },
                high: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-800", badge: "bg-orange-100" },
                medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800", badge: "bg-yellow-100" },
                low: { bg: "bg-green-50", border: "border-green-300", text: "text-green-800", badge: "bg-green-100" },
              };
              const colors = priorityColors[rec.priority as keyof typeof priorityColors];

              return (
                <div key={idx} className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{rec.site}</h4>
                        <Badge className={`${colors.badge} ${colors.text} text-xs font-semibold`}>
                          {rec.priority.toUpperCase()} Priority
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Last Cleaned:</span>
                          <div className="font-semibold text-gray-900 mt-0.5">{rec.lastCleaning}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Next Recommended:</span>
                          <div className="font-semibold text-gray-900 mt-0.5">{rec.nextRecommended}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Soiling Rate:</span>
                          <div className="font-semibold text-gray-900 mt-0.5">{rec.soilingRate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected Gain:</span>
                          <div className="font-semibold text-green-600 mt-0.5">{rec.expectedGain}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900">{rec.daysUntil}</div>
                      <div className="text-xs text-gray-600">days until</div>
                    </div>
                  </div>
                  {rec.priority === "critical" && (
                    <div className="pt-3 border-t border-red-200">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule Cleaning Now
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Site Benchmarking & Asset Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Benchmarking */}
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Site Benchmarking Comparison</CardTitle>
                <p className="text-xs text-gray-600 mt-1">6-dimension performance comparison across portfolio sites</p>
              </div>
              {/* Inline legend */}
              <div className="flex flex-col gap-1 text-right">
                {[
                  { label: "Beed Solar Park (Best)", color: "#10B981" },
                  { label: "Portfolio Avg", color: "#3B82F6" },
                  { label: "Amravati Solar Unit (Lowest)", color: "#EF4444" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] text-gray-600 font-medium">{s.label}</span>
                    <span style={{ display: "inline-block", width: 22, height: 3, borderRadius: 2, background: s.color }} />
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-2">
            <ResponsiveContainer width="100%" height={310}>
              <RadarChart data={siteBenchmarking} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[50, 100]}
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  tickCount={4}
                  axisLine={false}
                />
                {/* Beed Solar Park — top performer */}
                <Radar
                  name="Beed Solar Park (Best)"
                  dataKey="beedBest"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.12}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                />
                {/* Portfolio Average */}
                <Radar
                  name="Portfolio Avg"
                  dataKey="portfolioAvg"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.10}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: "#3B82F6", strokeWidth: 0 }}
                />
                {/* Amravati Solar Unit — needs attention */}
                <Radar
                  name="Amravati Solar Unit (Lowest)"
                  dataKey="amravatLow"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.08}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }}
                />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px", color: "#f1f5f9", padding: "8px 12px" }}
                  formatter={(value: number, name: string) => [`${value}/100`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] text-emerald-600 font-semibold uppercase mb-0.5">Top Performer</div>
                <div className="text-sm font-bold text-emerald-700">Beed Solar Park</div>
                <div className="text-xs text-emerald-600">Avg score 96</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-[10px] text-blue-600 font-semibold uppercase mb-0.5">Portfolio Avg</div>
                <div className="text-sm font-bold text-blue-700">Score 84</div>
                <div className="text-xs text-blue-600">Across 6 metrics</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-[10px] text-rose-600 font-semibold uppercase mb-0.5">Needs Attention</div>
                <div className="text-sm font-bold text-rose-700">Amravati Solar Unit</div>
                <div className="text-xs text-rose-600">Avg score 72</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Health Index */}
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Asset Health Index
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">Comprehensive health score across all components</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{overallHealthScore}</div>
                <div className="text-xs text-gray-600">Overall Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {assetHealthComponents.map((comp, idx) => {
                const percentage = (comp.score / comp.target) * 100;
                const isGood = comp.score >= comp.target * 0.95;
                const isWarning = comp.score >= comp.target * 0.85 && comp.score < comp.target * 0.95;

                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">{comp.component}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">
                          {comp.score} / {comp.target}
                        </span>
                        {isGood ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : isWarning ? (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isGood ? "bg-green-500" : isWarning ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Overall Health Status:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  Good - Minor optimizations needed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}