import { useRef, useState } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { VENDORS } from "../data/plants";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Zap,
  Activity,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
  Calendar,
  Filter,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Composite compliance data
const compositeScore = 87.4;
const riskStatus = "amber"; // green, amber, red

// Score composition breakdown
const scoreComposition = [
  {
    metric: "Generation Compliance",
    score: 92.3,
    target: 95.0,
    weight: 30,
    status: "amber",
    trend: "up",
    change: "+1.2%",
  },
  {
    metric: "Availability Compliance",
    score: 94.8,
    target: 96.0,
    weight: 25,
    status: "amber",
    trend: "down",
    change: "-0.5%",
  },
  {
    metric: "LD Exposure Management",
    score: 78.5,
    target: 100.0,
    weight: 20,
    status: "red",
    trend: "down",
    change: "-3.2%",
  },
  {
    metric: "JMR Submission Timeliness",
    score: 96.7,
    target: 100.0,
    weight: 15,
    status: "green",
    trend: "up",
    change: "+2.1%",
  },
  {
    metric: "Reporting Adherence",
    score: 88.2,
    target: 95.0,
    weight: 10,
    status: "amber",
    trend: "stable",
    change: "0%",
  },
];

// Radar chart data
const radarData = [
  { metric: "Generation", score: 92.3, target: 95 },
  { metric: "Availability", score: 94.8, target: 96 },
  { metric: "LD Mgmt", score: 78.5, target: 100 },
  { metric: "JMR Timely", score: 96.7, target: 100 },
  { metric: "Reporting", score: 88.2, target: 95 },
];

// Heat map data (site-wise compliance)
const siteHeatMap = [
  { site: "Sakri Solar Park", generation: 95, availability: 96, ld: 100, jmr: 100, reporting: 95, overall: 96.8 },
  { site: "Osmanabad Solar Plant", generation: 93, availability: 94, ld: 85, jmr: 100, reporting: 90, overall: 91.2 },
  { site: "Latur Solar Station", generation: 88, availability: 92, ld: 65, jmr: 100, reporting: 85, overall: 84.5 },
  { site: "Beed Solar Park", generation: 85, availability: 89, ld: 60, jmr: 90, reporting: 80, overall: 79.8 },
  { site: "Ahmednagar Solar Plant", generation: 96, availability: 97, ld: 95, jmr: 100, reporting: 92, overall: 95.4 },
];

// Vendor-wise risk table
const vendorRiskData = [
  {
    vendor: "SolarCo India",
    sites: 3,
    avgCompliance: 92.5,
    activeLDs: 2,
    riskScore: "Low",
    status: "green",
  },
  {
    vendor: "Green Energy Ltd",
    sites: 1,
    avgCompliance: 87.3,
    activeLDs: 5,
    riskScore: "Medium",
    status: "amber",
  },
  {
    vendor: "SunPower Tech",
    sites: 4,
    avgCompliance: 79.8,
    activeLDs: 8,
    riskScore: "High",
    status: "red",
  },
  {
    vendor: "Mega Solar Inc",
    sites: 3,
    avgCompliance: 94.1,
    activeLDs: 1,
    riskScore: "Low",
    status: "green",
  },
  {
    vendor: "TechSolar Pvt",
    sites: 1,
    avgCompliance: 95.2,
    activeLDs: 0,
    riskScore: "Low",
    status: "green",
  },
];

// Escalation triggers
const escalationTriggers = [
  {
    id: 1,
    trigger: "Amravati Solar Unit - LD Exposure Exceeds ₹5L",
    severity: "critical",
    daysOpen: 8,
    owner: "Compliance Team",
    action: "Immediate escalation to CFO",
  },
  {
    id: 2,
    trigger: "SunPower Tech - 3 Sites Below 80% Compliance",
    severity: "high",
    daysOpen: 5,
    owner: "Vendor Manager",
    action: "Vendor performance review meeting",
  },
  {
    id: 3,
    trigger: "Devdaithan Solar Plant - Availability Declining (3 months)",
    severity: "medium",
    daysOpen: 15,
    owner: "O&M Team",
    action: "Detailed O&M audit scheduled",
  },
  {
    id: 4,
    trigger: "JMR Submission Delay - Beed Solar Park (Apr 2026)",
    severity: "medium",
    daysOpen: 2,
    owner: "Plant Manager",
    action: "Follow-up reminder sent",
  },
];

// Top 5 risk sites
const topRiskSites = [
  { rank: 1, site: "Amravati Solar Unit", score: 79.8, issues: "High LD exposure, Low availability", critical: 2 },
  { rank: 2, site: "Latur Solar Station", score: 84.5, issues: "LD exposure, Reporting gaps", critical: 1 },
  { rank: 3, site: "Buldhana Solar Farm", score: 86.2, issues: "Generation underperformance", critical: 0 },
  { rank: 4, site: "Wardha Solar Park", score: 87.5, issues: "Recurring availability issues", critical: 0 },
  { rank: 5, site: "Osmanabad Solar Plant", score: 91.2, issues: "Minor LD exposure", critical: 0 },
];

// Compliance trend (last 12 months)
const complianceTrend = [
  { month: "Mar 25", score: 84.2, target: 90 },
  { month: "Apr 25", score: 85.8, target: 90 },
  { month: "May 25", score: 86.5, target: 90 },
  { month: "Jun 25", score: 88.1, target: 90 },
  { month: "Jul 25", score: 87.9, target: 90 },
  { month: "Aug 25", score: 89.2, target: 90 },
  { month: "Sep 25", score: 90.5, target: 90 },
  { month: "Oct 25", score: 91.3, target: 90 },
  { month: "Nov 25", score: 89.8, target: 90 },
  { month: "Dec 25", score: 88.6, target: 90 },
  { month: "Jan 26", score: 87.1, target: 90 },
  { month: "Feb 26", score: 87.4, target: 90 },
  { month: "Mar 26", score: 88.9, target: 90 },
  { month: "Apr 26", score: 89.5, target: 90 },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBgColor = (score: number) => {
  if (score >= 90) return "bg-green-100";
  if (score >= 80) return "bg-yellow-100";
  return "bg-red-100";
};

const getCellColor = (score: number) => {
  if (score >= 90) return "bg-green-100 text-green-900";
  if (score >= 80) return "bg-yellow-100 text-yellow-900";
  return "bg-red-100 text-red-900";
};

export function PortfolioComplianceHealth() {
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedPeriod, setSelectedPeriod] = useState("ytd");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const riskColors = {
    green: { bg: "bg-green-500", text: "text-green-600", badge: "bg-green-100 border-green-300" },
    amber: { bg: "bg-yellow-500", text: "text-yellow-600", badge: "bg-yellow-100 border-yellow-300" },
    red: { bg: "bg-red-500", text: "text-red-600", badge: "bg-red-100 border-red-300" },
  };

  const currentRisk = riskColors[riskStatus as keyof typeof riskColors];
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#2955A0] rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Portfolio Compliance Health Dashboard</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Executive-level strategic compliance monitoring and risk management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Clock className="w-3 h-3 mr-1" />
              Last Updated: 07-Apr-2026 23:59
            </Badge>
            <PageExportMenu
              pageTitle="Portfolio Compliance Health"
              contentRef={pageRef}
              label="Export Report"
            />
          </div>
        </div>
        <div className="px-8 pb-2 flex flex-wrap items-center gap-3">
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
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px] h-7 text-xs bg-slate-50 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="q1">Q1 (Apr-Jun)</SelectItem>
              <SelectItem value="q2">Q2 (Jul-Sep)</SelectItem>
              <SelectItem value="q3">Q3 (Oct-Dec)</SelectItem>
              <SelectItem value="q4">Q4 (Jan-Mar)</SelectItem>
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
          {(selectedVendor !== "all" || selectedPeriod !== "ytd") && (
            <button
              onClick={() => { setSelectedVendor("all"); setSelectedPeriod("ytd"); }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100"
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>
      <div className="p-8">

      {/* TOP SECTION - Composite Score & Risk Status */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8">
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-600 mb-1">Portfolio Composite Compliance Score</h2>
                      <div className="flex items-baseline gap-3">
                        <span className={`text-6xl font-bold ${getScoreColor(compositeScore)}`}>
                          {compositeScore}
                        </span>
                        <span className="text-2xl text-gray-500">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Target Score:</span>
                      <span className="ml-2 font-bold text-gray-900">90.0</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                      <span className="text-gray-600">Deviation:</span>
                      <span className="ml-2 font-bold text-red-600">-2.6 points</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                      <span className="text-gray-600">MoM Change:</span>
                      <span className="ml-2 font-bold text-gray-900 flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        +0.3
                      </span>
                    </div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-32 mx-6" />
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Risk Status Indicator</h3>
                  <div className={`w-32 h-32 rounded-full ${currentRisk.bg} flex items-center justify-center mb-3 shadow-lg animate-pulse`}>
                    {riskStatus === "green" && <CheckCircle className="w-16 h-16 text-white" />}
                    {riskStatus === "amber" && <AlertTriangle className="w-16 h-16 text-white" />}
                    {riskStatus === "red" && <AlertCircle className="w-16 h-16 text-white" />}
                  </div>
                  <Badge className={`${currentRisk.badge} border-2 text-base font-bold px-4 py-2`}>
                    {riskStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="border-2 border-orange-300 h-full">
            <CardHeader className="border-b bg-orange-50 pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-600" />
                Active Escalation Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {escalationTriggers.slice(0, 2).map((trigger) => (
                  <div
                    key={trigger.id}
                    className={`p-3 rounded border-2 ${
                      trigger.severity === "critical"
                        ? "bg-red-50 border-red-300"
                        : "bg-yellow-50 border-yellow-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="destructive"
                        className={
                          trigger.severity === "critical"
                            ? ""
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {trigger.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-semibold text-gray-600">{trigger.daysOpen} days</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">{trigger.trigger}</p>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">Owner:</span> {trigger.owner}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                View All Triggers ({escalationTriggers.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT & CENTER - Score Composition & Visuals */}
        <div className="col-span-8 space-y-6">
          {/* Score Composition Panel */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">Score Composition Breakdown</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Weighted contribution to composite compliance score</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {scoreComposition.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{item.metric}</span>
                        <Badge variant="secondary" className="text-xs">
                          Weight: {item.weight}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                            {item.score}%
                          </div>
                          <div className="text-xs text-gray-600">Target: {item.target}%</div>
                        </div>
                        <div className="w-16 text-center">
                          {item.status === "green" && (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Good
                            </Badge>
                          )}
                          {item.status === "amber" && (
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Watch
                            </Badge>
                          )}
                          {item.status === "red" && (
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Risk
                            </Badge>
                          )}
                        </div>
                        <div className="w-16 text-xs font-semibold text-gray-700 flex items-center gap-1">
                          {item.trend === "up" && <ArrowUp className="w-4 h-4 text-green-600" />}
                          {item.trend === "down" && <ArrowDown className="w-4 h-4 text-red-600" />}
                          {item.trend === "stable" && <Minus className="w-4 h-4 text-gray-600" />}
                          {item.change}
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.score >= 90 ? "bg-green-500" : item.score >= 80 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Components */}
          <div className="grid grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-sm font-semibold">Compliance Radar Analysis</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Actual vs. Target comparison</p>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Actual Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Heat Map by Site */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-sm font-semibold">Site-Wise Compliance Heat Map</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Color-coded performance matrix</p>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[280px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-xs font-semibold">Site</TableHead>
                        <TableHead className="text-xs font-semibold text-center">Gen</TableHead>
                        <TableHead className="text-xs font-semibold text-center">Avail</TableHead>
                        <TableHead className="text-xs font-semibold text-center">LD</TableHead>
                        <TableHead className="text-xs font-semibold text-center">JMR</TableHead>
                        <TableHead className="text-xs font-semibold text-center">Rpt</TableHead>
                        <TableHead className="text-xs font-semibold text-center">Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siteHeatMap.map((site, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-semibold text-gray-900 py-2">
                            {site.site}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.generation)}`}>
                            {site.generation}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.availability)}`}>
                            {site.availability}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.ld)}`}>
                            {site.ld}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.jmr)}`}>
                            {site.jmr}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.reporting)}`}>
                            {site.reporting}
                          </TableCell>
                          <TableCell className={`text-xs font-bold text-center py-2 ${getCellColor(site.overall)}`}>
                            {site.overall}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Vendor-Wise Risk Table */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-sm font-semibold">Vendor-Wise Risk Assessment</CardTitle>
              <p className="text-xs text-gray-600 mt-1">Aggregated vendor performance and risk scoring</p>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-semibold text-xs">Vendor Name</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Sites Managed</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Avg Compliance</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Active LDs</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Risk Score</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorRiskData.map((vendor, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="text-xs font-semibold text-gray-900">{vendor.vendor}</TableCell>
                      <TableCell className="text-xs text-center font-semibold text-gray-700">{vendor.sites}</TableCell>
                      <TableCell className={`text-xs text-center font-bold ${getScoreColor(vendor.avgCompliance)}`}>
                        {vendor.avgCompliance}%
                      </TableCell>
                      <TableCell className="text-xs text-center font-bold text-red-600">{vendor.activeLDs}</TableCell>
                      <TableCell className="text-xs text-center font-bold text-gray-900">{vendor.riskScore}</TableCell>
                      <TableCell className="text-center">
                        {vendor.status === "green" && (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">Low Risk</Badge>
                        )}
                        {vendor.status === "amber" && (
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Medium Risk</Badge>
                        )}
                        {vendor.status === "red" && (
                          <Badge variant="destructive">High Risk</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Escalation Trigger List */}
          <Card className="border-2 border-orange-300">
            <CardHeader className="border-b bg-orange-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Escalation Triggers & Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {escalationTriggers.map((trigger) => {
                  const severityColors = {
                    critical: "border-red-300 bg-red-50",
                    high: "border-orange-300 bg-orange-50",
                    medium: "border-yellow-300 bg-yellow-50",
                  };
                  const color = severityColors[trigger.severity as keyof typeof severityColors];

                  return (
                    <div key={trigger.id} className={`p-4 rounded-lg border-2 ${color}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant={trigger.severity === "critical" ? "destructive" : "secondary"}
                              className={
                                trigger.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : trigger.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                            >
                              {trigger.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs font-semibold text-gray-600">Open: {trigger.daysOpen} days</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2">{trigger.trigger}</h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Owner:</span>
                          <div className="font-semibold text-gray-900">{trigger.owner}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Action Required:</span>
                          <div className="font-semibold text-gray-900">{trigger.action}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - Top Risk Sites & Trend */}
        <div className="col-span-4 space-y-6">
          {/* Top 5 Risk Sites */}
          <Card className="border-2 border-red-300 sticky top-6">
            <CardHeader className="border-b bg-red-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Top 5 Risk Sites
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">Prioritized by compliance score and critical issues</p>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {topRiskSites.map((site) => (
                  <div
                    key={site.rank}
                    className={`p-4 rounded-lg border-2 ${
                      site.rank === 1
                        ? "border-red-400 bg-red-50"
                        : site.rank === 2
                        ? "border-orange-300 bg-orange-50"
                        : "border-yellow-300 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full font-bold flex items-center justify-center flex-shrink-0 ${
                          site.rank === 1
                            ? "bg-red-500 text-white"
                            : site.rank === 2
                            ? "bg-orange-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {site.rank}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-gray-900 mb-1">{site.site}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-lg font-bold ${getScoreColor(site.score)}`}>{site.score}</span>
                          <span className="text-xs text-gray-600">/ 100</span>
                        </div>
                        {site.critical > 0 && (
                          <Badge variant="destructive" className="text-xs mb-2">
                            {site.critical} Critical Issue{site.critical > 1 ? "s" : ""}
                          </Badge>
                        )}
                        <p className="text-xs text-gray-700 leading-relaxed">{site.issues}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Trend (Last 12 Months) */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                12-Month Compliance Trend
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">Portfolio composite score vs. target</p>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={complianceTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#colorScore)"
                    name="Compliance Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target (90)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div>
                    <div className="text-gray-600 mb-1">12-Month Avg</div>
                    <div className="text-base font-bold text-gray-900">88.3</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Best Month</div>
                    <div className="text-base font-bold text-green-600">91.3</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Worst Month</div>
                    <div className="text-base font-bold text-red-600">84.2</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
