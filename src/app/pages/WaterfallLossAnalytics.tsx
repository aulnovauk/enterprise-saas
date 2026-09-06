import { useRef, useState } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PLANTS } from "../data/plants";
import {
  TrendingDown,
  Zap,
  AlertTriangle,
  Wind,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Line,
  Area,
} from "recharts";

// Waterfall data
const waterfallData = [
  { stage: "Budgeted", value: 5200, cumulative: 5200, type: "base", color: "#3B82F6" },
  { stage: "Irradiation Loss", value: -280, cumulative: 4920, type: "loss", color: "#EF4444" },
  { stage: "Expected", value: 0, cumulative: 4920, type: "intermediate", color: "#10B981" },
  { stage: "Grid Outage", value: -185, cumulative: 4735, type: "loss", color: "#F59E0B" },
  { stage: "Equipment Failure", value: -240, cumulative: 4495, type: "loss", color: "#EF4444" },
  { stage: "Curtailment", value: -195, cumulative: 4300, type: "loss", color: "#F59E0B" },
  { stage: "Force Majeure", value: -90, cumulative: 4210, type: "loss", color: "#8B5CF6" },
  { stage: "Actual", value: 0, cumulative: 4210, type: "intermediate", color: "#10B981" },
  { stage: "Transmission Loss", value: -105, cumulative: 4105, type: "loss", color: "#F59E0B" },
  { stage: "Evacuated", value: 0, cumulative: 4105, type: "final", color: "#059669" },
];

// Loss breakdown data
const lossBreakdown = [
  {
    category: "Grid Outage",
    energy: 185,
    percentage: 3.8,
    revenue: "₹37,00,000",
    incidents: 12,
    avgDuration: "2.5 hrs",
    severity: "medium",
    icon: Zap,
  },
  {
    category: "Equipment Failure",
    energy: 240,
    percentage: 4.9,
    revenue: "₹48,00,000",
    incidents: 8,
    avgDuration: "6.2 hrs",
    severity: "high",
    icon: AlertTriangle,
  },
  {
    category: "Curtailment",
    energy: 195,
    percentage: 4.0,
    revenue: "₹39,00,000",
    incidents: 18,
    avgDuration: "1.8 hrs",
    severity: "medium",
    icon: TrendingDown,
  },
  {
    category: "Force Majeure",
    energy: 90,
    percentage: 1.8,
    revenue: "₹18,00,000",
    incidents: 3,
    avgDuration: "8.5 hrs",
    severity: "low",
    icon: Wind,
  },
];

// Revenue impact overlay data
const revenueImpact = {
  totalLoss: "₹1,42,00,000",
  budgetedRevenue: "₹10,40,00,000",
  actualRevenue: "₹8,98,00,000",
  lossPercentage: 13.7,
  tariff: "₹2.00/kWh",
};

// Pareto chart data (downtime causes)
const paretoData = [
  { cause: "Inverter Fault", incidents: 28, cumulative: 28, percentage: 28 },
  { cause: "Grid Instability", incidents: 22, cumulative: 50, percentage: 50 },
  { cause: "Module Degradation", incidents: 15, cumulative: 65, percentage: 65 },
  { cause: "Weather Event", incidents: 12, cumulative: 77, percentage: 77 },
  { cause: "Cleaning Delay", incidents: 10, cumulative: 87, percentage: 87 },
  { cause: "Others", incidents: 13, cumulative: 100, percentage: 100 },
];

// Month-over-Month comparison
const momComparison = [
  { metric: "Budgeted Generation", jan: "5,100 MWh", feb: "5,200 MWh", change: "+2.0%", trend: "up" },
  { metric: "Actual Generation", jan: "4,180 MWh", feb: "4,210 MWh", change: "+0.7%", trend: "up" },
  { metric: "Total Losses", jan: "920 MWh", feb: "990 MWh", change: "+7.6%", trend: "down" },
  { metric: "Grid Outage Loss", jan: "172 MWh", feb: "185 MWh", change: "+7.6%", trend: "down" },
  { metric: "Equipment Loss", jan: "225 MWh", feb: "240 MWh", change: "+6.7%", trend: "down" },
  { metric: "Revenue Impact", jan: "₹1.32 Cr", feb: "₹1.42 Cr", change: "+7.6%", trend: "down" },
];

// Root cause drill-down data
const rootCauseData = [
  {
    id: 1,
    date: "2026-02-15",
    category: "Equipment Failure",
    rootCause: "Inverter-03 IGBT Module Failure",
    duration: "14.5 hrs",
    energyLoss: "58 MWh",
    revenueLoss: "₹11,60,000",
    status: "Resolved",
    expanded: false,
  },
  {
    id: 2,
    date: "2026-02-18",
    category: "Grid Outage",
    rootCause: "Substation Overload - Peak Demand",
    duration: "3.2 hrs",
    energyLoss: "42 MWh",
    revenueLoss: "₹8,40,000",
    status: "Resolved",
    expanded: false,
  },
  {
    id: 3,
    date: "2026-02-22",
    category: "Curtailment",
    rootCause: "Grid Frequency Above 50.2 Hz",
    duration: "2.8 hrs",
    energyLoss: "38 MWh",
    revenueLoss: "₹7,60,000",
    status: "Recurring",
    expanded: false,
  },
  {
    id: 4,
    date: "2026-02-25",
    category: "Equipment Failure",
    rootCause: "String 12 DC Isolator Burnout",
    duration: "8.7 hrs",
    energyLoss: "35 MWh",
    revenueLoss: "₹7,00,000",
    status: "Under Investigation",
    expanded: false,
  },
  {
    id: 5,
    date: "2026-02-27",
    category: "Force Majeure",
    rootCause: "Dust Storm - Visibility < 50m",
    duration: "6.5 hrs",
    energyLoss: "28 MWh",
    revenueLoss: "₹5,60,000",
    status: "Closed",
    expanded: false,
  },
];

export function WaterfallLossAnalytics() {
  const [selectedPlant, setSelectedPlant] = useState("Latur Solar Station");
  const [selectedMonth, setSelectedMonth] = useState("feb2026");
  const totalLosses = waterfallData
    .filter((d) => d.type === "loss")
    .reduce((sum, d) => sum + Math.abs(d.value), 0);
  const pageRef = useRef<HTMLDivElement>(null);
  const currentPlant = PLANTS.find(p => p.name === selectedPlant);

  return (
    <div ref={pageRef} className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Waterfall & Loss Intelligence Analytics</h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Generation flow analysis with financial impact assessment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PageExportMenu
                pageTitle="Waterfall & Loss Intelligence"
                contentRef={pageRef}
                label="Export Report"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Filters:</span>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feb2026">February 2026</SelectItem>
                <SelectItem value="jan2026">January 2026</SelectItem>
                <SelectItem value="dec2025">December 2025</SelectItem>
                <SelectItem value="nov2025">November 2025</SelectItem>
                <SelectItem value="oct2025">October 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger className="w-[230px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANTS.map(p => (
                  <SelectItem key={p.id} value={p.name}>{p.name} ({p.capacity} MW)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentPlant && (
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px]">
                {currentPlant.vendor} · {currentPlant.district}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="p-8">

      {/* Main Section - Waterfall Chart */}
      <Card className="border-2 mb-6">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Generation Waterfall Analysis</CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Budgeted → Expected → Actual → Evacuated flow with loss attribution
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600 mb-1">Total Energy Losses</div>
              <div className="text-2xl font-bold text-red-600">{totalLosses} MWh</div>
              <div className="text-xs text-gray-600">({((totalLosses / 5200) * 100).toFixed(1)}% of budgeted)</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={80}
                stroke="#6B7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[0, 5500]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border-2 border-gray-300 rounded shadow-lg">
                        <p className="text-sm font-bold text-gray-900 mb-1">{data.stage}</p>
                        {data.type === "loss" && (
                          <p className="text-sm text-red-600 font-bold">Loss: {Math.abs(data.value)} MWh</p>
                        )}
                        <p className="text-sm text-gray-700">Cumulative: {data.cumulative} MWh</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              {waterfallData.map((entry, index) => {
                if (entry.type === "loss") {
                  return (
                    <text
                      key={`label-${index}`}
                      x={(index / waterfallData.length) * 100 + "%"}
                      y={entry.cumulative - 50}
                      fill="#EF4444"
                      fontSize={11}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      -{Math.abs(entry.value)}
                    </text>
                  );
                }
                return null;
              })}
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-600 mb-1">Budgeted</div>
                <div className="text-lg font-bold text-blue-600">5,200 MWh</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Expected (Post Irradiation)</div>
                <div className="text-lg font-bold text-green-600">4,920 MWh</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Actual Generated</div>
                <div className="text-lg font-bold text-gray-900">4,210 MWh</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Evacuated to Grid</div>
                <div className="text-lg font-bold text-green-600">4,105 MWh</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Loss Breakdown Panel */}
        <div className="col-span-7">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">Loss Category Breakdown</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Detailed attribution of generation losses by category</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {lossBreakdown.map((loss, idx) => {
                  const Icon = loss.icon;
                  const severityColors = {
                    high: "border-red-300 bg-red-50",
                    medium: "border-yellow-300 bg-yellow-50",
                    low: "border-blue-300 bg-blue-50",
                  };
                  const color = severityColors[loss.severity as keyof typeof severityColors];

                  return (
                    <div key={idx} className={`p-4 rounded-lg border-2 ${color}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              loss.severity === "high"
                                ? "bg-red-100"
                                : loss.severity === "medium"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                loss.severity === "high"
                                  ? "text-red-600"
                                  : loss.severity === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{loss.category}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span>{loss.incidents} incidents</span>
                              <span>•</span>
                              <span>Avg duration: {loss.avgDuration}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={loss.severity === "high" ? "destructive" : "secondary"}
                          className={
                            loss.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : loss.severity === "low"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }
                        >
                          {loss.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <Separator className="mb-3" />
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Energy Loss</div>
                          <div className="text-base font-bold text-red-600">{loss.energy} MWh</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">% of Budgeted</div>
                          <div className="text-base font-bold text-gray-900">{loss.percentage}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Revenue Impact</div>
                          <div className="text-base font-bold text-red-600">{loss.revenue}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Section - Revenue Impact & Pareto */}
        <div className="col-span-5 space-y-6">
          {/* Revenue Impact Overlay */}
          <Card className="border-2 border-red-300">
            <CardHeader className="border-b bg-red-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Financial Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center pb-4 border-b border-red-200">
                  <div className="text-xs text-gray-600 mb-2">Total Revenue Loss</div>
                  <div className="text-3xl font-bold text-red-600 mb-1">{revenueImpact.totalLoss}</div>
                  <div className="text-xs text-gray-600">
                    ({revenueImpact.lossPercentage}% of budgeted revenue)
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">Budgeted Revenue</div>
                    <div className="text-sm font-bold text-gray-900">{revenueImpact.budgetedRevenue}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">Actual Revenue</div>
                    <div className="text-sm font-bold text-green-600">{revenueImpact.actualRevenue}</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-red-200">
                  <div className="text-xs text-gray-600 mb-2">Loss Breakdown by Category</div>
                  <div className="space-y-2">
                    {lossBreakdown.map((loss, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{loss.category}</span>
                        <span className="font-bold text-red-600">{loss.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-red-200 text-center">
                  <div className="text-xs text-gray-600 mb-1">Average Tariff</div>
                  <div className="text-base font-bold text-blue-600">{revenueImpact.tariff}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pareto Chart */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-sm font-semibold">Pareto Analysis - Downtime Causes</CardTitle>
              <p className="text-xs text-gray-600 mt-1">80/20 rule applied to incident frequency</p>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={paretoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="cause" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Incidents" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: "#EF4444", r: 5 }}
                    name="Cumulative %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                <p className="leading-relaxed">
                  <strong>Analysis:</strong> Top 3 causes (Inverter Fault, Grid Instability, Module Degradation) account
                  for 65% of all incidents. Focus corrective actions on these areas for maximum impact.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lower Panel - MoM Comparison */}
      <Card className="border-2 mb-6">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-base font-semibold">Month-over-Month Comparison</CardTitle>
          <p className="text-xs text-gray-600 mt-1">January 2026 vs. February 2026 performance analysis</p>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-xs">Performance Metric</TableHead>
                <TableHead className="font-semibold text-xs text-right">January 2026</TableHead>
                <TableHead className="font-semibold text-xs text-right">February 2026</TableHead>
                <TableHead className="font-semibold text-xs text-center">Change</TableHead>
                <TableHead className="font-semibold text-xs text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {momComparison.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50">
                  <TableCell className="text-xs font-semibold text-gray-900">{row.metric}</TableCell>
                  <TableCell className="text-xs font-mono text-right text-gray-700">{row.jan}</TableCell>
                  <TableCell className="text-xs font-mono text-right font-bold text-gray-900">{row.feb}</TableCell>
                  <TableCell className="text-xs font-mono text-center font-bold">
                    <span
                      className={
                        row.trend === "up" && !row.metric.includes("Loss")
                          ? "text-green-600"
                          : row.trend === "down" || row.metric.includes("Loss")
                          ? "text-red-600"
                          : "text-gray-700"
                      }
                    >
                      {row.change}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {row.trend === "up" && !row.metric.includes("Loss") && (
                      <Badge className="bg-green-100 text-green-800 border border-green-300">Improved</Badge>
                    )}
                    {(row.trend === "down" || row.metric.includes("Loss")) && row.change !== "0%" && (
                      <Badge variant="destructive">Deteriorated</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Root Cause Drill-Down Table */}
      <Card className="border-2">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Root Cause Drill-Down Analysis</CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Detailed investigation of top 5 loss events with financial impact
              </p>
            </div>
            <PageExportMenu
              pageTitle="Waterfall Loss Analytics"
              contentRef={pageRef}
              variant="blue"
              label="Export Analysis"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-xs">Date</TableHead>
                <TableHead className="font-semibold text-xs">Loss Category</TableHead>
                <TableHead className="font-semibold text-xs">Root Cause</TableHead>
                <TableHead className="font-semibold text-xs text-right">Duration</TableHead>
                <TableHead className="font-semibold text-xs text-right">Energy Loss</TableHead>
                <TableHead className="font-semibold text-xs text-right">Revenue Loss</TableHead>
                <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rootCauseData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="text-xs font-mono text-gray-700">{row.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        row.category === "Equipment Failure"
                          ? "bg-red-100 text-red-800"
                          : row.category === "Grid Outage"
                          ? "bg-yellow-100 text-yellow-800"
                          : row.category === "Curtailment"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-purple-100 text-purple-800"
                      }
                    >
                      {row.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-gray-900">{row.rootCause}</TableCell>
                  <TableCell className="text-xs font-mono text-right text-gray-700">{row.duration}</TableCell>
                  <TableCell className="text-xs font-mono text-right font-bold text-red-600">
                    {row.energyLoss}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-right font-bold text-red-600">
                    {row.revenueLoss}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        row.status === "Resolved"
                          ? "default"
                          : row.status === "Recurring"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        row.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : row.status === "Under Investigation"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <ChevronRight className="w-4 h-4" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
