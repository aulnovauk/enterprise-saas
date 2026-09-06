import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  BrainCircuit,
  TrendingDown,
  Zap,
  Droplets,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from "recharts";

// Top insight cards data
const topInsights = [
  {
    id: 1,
    type: "alert",
    severity: "high",
    icon: TrendingDown,
    title: "Degradation Trend Alert",
    subtitle: "Amravati Solar Unit",
    metric: "0.82% annual",
    baseline: "vs. 0.50% industry standard",
    insight: "Accelerated degradation detected over the last 12 months. Module inspection recommended.",
    confidence: 94,
    action: "Schedule detailed module testing",
    color: "#EF4444",
  },
  {
    id: 2,
    type: "pattern",
    severity: "medium",
    icon: Zap,
    title: "Curtailment Recurrence Detection",
    subtitle: "Dec-Jan Peak Pattern",
    metric: "Average 195 MWh/month",
    baseline: "vs. 85 MWh/month baseline",
    insight: "Grid curtailment shows recurring pattern during winter months, correlating with regional demand dips.",
    confidence: 91,
    action: "Consider energy storage or offtake adjustment",
    color: "#F59E0B",
  },
  {
    id: 3,
    type: "recommendation",
    severity: "low",
    icon: Droplets,
    title: "Cleaning Cycle Recommendation",
    subtitle: "Portfolio Optimization",
    metric: "+3.2% generation gain",
    baseline: "Annual: 1,850 MWh",
    insight: "AI models suggest optimizing cleaning frequency by 15% across portfolio could improve annual generation significantly.",
    confidence: 89,
    action: "Adjust cleaning schedule for 4 plants",
    color: "#10B981",
  },
  {
    id: 4,
    type: "forecast",
    severity: "info",
    icon: TrendingUp,
    title: "Forecasted Generation Next 3 Months",
    subtitle: "Q2 2026 Outlook",
    metric: "15,450 MWh expected",
    baseline: "+5.2% vs Q1",
    insight: "ML models predict seasonal uptick in Q2 based on 3-year historical patterns and weather forecasts.",
    confidence: 92,
    action: "Update financial projections",
    color: "#3B82F6",
  },
];

// Multi-year generation trend data
const generationTrend = [
  { month: "Jan 24", generation: 4750, forecast: null },
  { month: "Feb 24", generation: 4800, forecast: null },
  { month: "Mar 24", generation: 5100, forecast: null },
  { month: "Apr 24", generation: 5200, forecast: null },
  { month: "May 24", generation: 5400, forecast: null },
  { month: "Jun 24", generation: 4900, forecast: null },
  { month: "Jul 24", generation: 4600, forecast: null },
  { month: "Aug 24", generation: 4820, forecast: null },
  { month: "Sep 24", generation: 4950, forecast: null },
  { month: "Oct 24", generation: 5100, forecast: null },
  { month: "Nov 24", generation: 5050, forecast: null },
  { month: "Dec 24", generation: 4900, forecast: null },
  { month: "Jan 25", generation: 4680, forecast: null },
  { month: "Feb 25", generation: 4720, forecast: null },
  { month: "Mar 25", generation: 5050, forecast: null },
  { month: "Apr 25", generation: 5180, forecast: null },
  { month: "May 25", generation: 5350, forecast: null },
  { month: "Jun 25", generation: 4850, forecast: null },
  { month: "Jul 25", generation: 4550, forecast: null },
  { month: "Aug 25", generation: 4750, forecast: null },
  { month: "Sep 25", generation: 4890, forecast: null },
  { month: "Oct 25", generation: 5020, forecast: null },
  { month: "Nov 25", generation: 4980, forecast: null },
  { month: "Dec 25", generation: 4850, forecast: null },
  { month: "Jan 26", generation: 4620, forecast: null },
  { month: "Feb 26", generation: 4485, forecast: null },
  { month: "Mar 26", generation: 4950, forecast: null },
  { month: "Apr 26", generation: 5210, forecast: null },
  { month: "May 26", generation: null, forecast: 5320 },
];

// Degradation slope data
const degradationData = [
  { year: "Year 1", performance: 100, expected: 100, actual: 100 },
  { year: "Year 2", performance: 99.3, expected: 99.5, actual: 99.3 },
  { year: "Year 3", performance: 98.1, expected: 99.0, actual: 98.1 },
  { year: "Year 4", performance: 97.0, expected: 98.5, actual: 96.8 },
];

// Site benchmarking data
const siteBenchmarking = [
  { site: "Sakri Solar Park", efficiency: 88, cuf: 23.5, availability: 97.2, pr: 78.8 },
  { site: "Osmanabad Solar Plant", efficiency: 82, cuf: 24.1, availability: 96.8, pr: 77.5 },
  { site: "Latur Solar Station", efficiency: 84, cuf: 23.8, availability: 97.5, pr: 78.2 },
  { site: "Amravati Solar Unit", efficiency: 78, cuf: 18.5, availability: 88.3, pr: 76.1 },
  { site: "Beed Solar Park", efficiency: 92, cuf: 24.5, availability: 98.1, pr: 80.2 },
  { site: "Portfolio Avg", efficiency: 85, cuf: 22.5, availability: 95.4, pr: 78.1 },
];

// Asset Health Index data
const assetHealthIndex = [
  { component: "Module Performance", score: 87, target: 90, status: "good" },
  { component: "Inverter Efficiency", score: 92, target: 95, status: "excellent" },
  { component: "Grid Stability", score: 78, target: 90, status: "warning" },
  { component: "String Performance", score: 85, target: 88, status: "good" },
  { component: "Tracker Accuracy", score: 91, target: 92, status: "excellent" },
  { component: "Overall Health", score: 86.6, target: 90, status: "good" },
];

// AI model explanation
const modelExplanation = {
  algorithm: "Gradient Boosting Ensemble",
  features: [
    "36-month historical generation data",
    "Weather pattern analysis (temperature, irradiation)",
    "Equipment performance metrics",
    "Seasonal trend decomposition",
    "Grid behavior patterns",
  ],
  accuracy: "92.4%",
  lastTrained: "2026-02-15",
  dataPoints: "124,568",
};

// Recommendation summary
const recommendationSummary = `Based on comprehensive analysis of 36 months of historical data across 12 plants (220 MW capacity), the AI model has identified three priority areas for optimization:

**1. Degradation Management (High Priority)**
Amravati Solar Unit shows accelerated degradation at 0.82% annually vs. industry standard of 0.50%. Root cause analysis suggests potential module quality issues or environmental stress factors. Immediate action: Schedule comprehensive IV curve testing and thermal imaging survey.

**2. Operational Efficiency (Medium Priority)**
Portfolio-wide cleaning optimization could yield 3.2% generation improvement (1,850 MWh annually). Current cleaning schedules are reactive rather than predictive. Recommended: Implement AI-driven cleaning schedule based on soiling rate predictions and weather forecasts.

**3. Grid Management (Medium Priority)**
Recurring curtailment pattern detected during Dec-Jan period (avg 195 MWh/month). This represents ₹39L annual revenue loss. Strategic recommendation: Explore energy storage solutions or negotiate alternative offtake arrangements during peak curtailment months.

**Expected Financial Impact:** Implementation of all three recommendations could improve annual revenue by ₹82-95 lakhs with 89-94% confidence intervals.`;

export function AIInsightSummary() {
  const overallConfidence = 91.5;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#2955A0] rounded-lg">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">AI Insight Summary Dashboard</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Machine learning insights and predictive analytics based on 36 months of historical data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 h-7 px-3 text-xs font-semibold">
              <Activity className="w-3 h-3 mr-1.5" />
              ML Model v2.4.1
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 h-7 px-3 text-xs font-semibold">
              Data through Apr 2026
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      {/* TOP INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {topInsights.map((insight) => {
          const Icon = insight.icon;
          const severityStyles = {
            high: "border-2 border-red-200 bg-white",
            medium: "border-2 border-yellow-200 bg-white",
            low: "border-2 border-green-200 bg-white",
            info: "border-2 border-blue-200 bg-white",
          };
          const style = severityStyles[insight.severity as keyof typeof severityStyles];

          return (
            <Card key={insight.id} className={`${style}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${insight.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: insight.color }} />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold border"
                    style={{
                      backgroundColor: '#F9FAFB',
                      color: insight.color,
                      borderColor: `${insight.color}40`,
                    }}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-xs text-gray-600 mb-4">{insight.subtitle}</p>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="text-2xl font-bold" style={{ color: insight.color }}>
                    {insight.metric}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{insight.baseline}</div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">{insight.insight}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Confidence: <span className="font-bold text-gray-900">{insight.confidence}%</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-300">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Action
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT & CENTER - Charts */}
        <div className="col-span-8 space-y-6">
          {/* Multi-Year Generation Trend */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">Multi-Year Generation Trend & Forecast</CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                36-month historical pattern with 3-month ML forecast (shaded area indicates confidence interval)
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={generationTrend}>
                  <defs>
                    <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#6B7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[4000, 6000]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="generation"
                    stroke="none"
                    fill="url(#colorGeneration)"
                  />
                  <Line
                    type="monotone"
                    dataKey="generation"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", r: 3 }}
                    name="Historical Generation"
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#10B981"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: "#10B981", r: 5 }}
                    name="AI Forecast"
                    connectNulls
                  />
                  <ReferenceLine y={4900} stroke="#F59E0B" strokeDasharray="3 3" label="3-Year Avg: 4,900 MWh" />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center text-xs">
                  <div>
                    <div className="text-gray-600 mb-1">3-Year Average</div>
                    <div className="text-base font-bold text-gray-900">4,898 MWh</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Peak Month</div>
                    <div className="text-base font-bold text-green-600">5,400 MWh</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Q2 2026 Forecast</div>
                    <div className="text-base font-bold text-blue-600">15,450 MWh</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Forecast Accuracy</div>
                    <div className="text-base font-bold text-purple-600">92.4%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Degradation Slope & Site Benchmarking */}
          <div className="grid grid-cols-2 gap-6">
            {/* Degradation Slope */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-sm font-semibold">Degradation Slope Analysis</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Expected vs. actual performance degradation</p>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={degradationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#6B7280" />
                    <YAxis domain={[96, 101]} tick={{ fontSize: 11 }} stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#10B981", r: 4 }}
                      name="Expected (0.5%/yr)"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", r: 5 }}
                      name="Actual (0.82%/yr)"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong>AI Alert:</strong> Performance degradation 64% faster than expected. 
                      Projected Year 4 performance: 96.8% vs. expected 98.5%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Site Benchmarking */}
            <Card className="border-2">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-sm font-semibold">Site Benchmarking Comparison</CardTitle>
                <p className="text-xs text-gray-600 mt-1">Overall efficiency score radar chart</p>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={siteBenchmarking}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="site" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Efficiency Score"
                      dataKey="efficiency"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <div className="text-gray-600 mb-1">Top Performer</div>
                      <div className="text-sm font-bold text-green-600">Beed Solar Park (92)</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Portfolio Avg</div>
                      <div className="text-sm font-bold text-gray-900">85</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Needs Focus</div>
                      <div className="text-sm font-bold text-red-600">Amravati Solar Unit (78)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Health Index Scorecard */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="border-b bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Asset Health Index Scorecard</CardTitle>
                  <p className="text-xs text-gray-600 mt-1">
                    Comprehensive health assessment across 6 key components
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">86.6</div>
                  <div className="text-xs text-gray-600">Overall Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {assetHealthIndex.map((item, idx) => {
                  const percentage = (item.score / item.target) * 100;
                  const isGood = item.score >= item.target * 0.95;
                  const isWarning = item.score >= item.target * 0.85 && item.score < item.target * 0.95;

                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{item.component}</span>
                          {item.status === "excellent" && (
                            <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
                              Excellent
                            </Badge>
                          )}
                          {item.status === "good" && (
                            <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                              Good
                            </Badge>
                          )}
                          {item.status === "warning" && (
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs">
                              Needs Attention
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {item.score} / {item.target}
                          </span>
                          {isGood ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : isWarning ? (
                            <Info className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isGood ? "bg-green-500" : isWarning ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - AI Explanation & Recommendations */}
        <div className="col-span-4 space-y-6">
          {/* AI Confidence Indicator */}
          <Card className="border-2 sticky top-6">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" style={{ color: '#2955A0' }} />
                AI Confidence Indicator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2" style={{ color: '#2955A0' }}>{overallConfidence}%</div>
                <div className="text-xs text-gray-600 mb-4">Overall Model Confidence</div>
                <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${overallConfidence}%`, backgroundColor: '#2955A0' }}
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Degradation Alert</span>
                  <span className="font-bold text-gray-900">94%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Curtailment Pattern</span>
                  <span className="font-bold text-gray-900">91%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Cleaning Optimization</span>
                  <span className="font-bold text-gray-900">89%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Generation Forecast</span>
                  <span className="font-bold text-gray-900">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Logic Explanation */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: '#2955A0' }} />
                Model Logic Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">Algorithm</div>
                  <div className="text-xs text-gray-900 font-mono bg-gray-100 p-2 rounded">
                    {modelExplanation.algorithm}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-2">Key Features Analyzed</div>
                  <ul className="space-y-1">
                    {modelExplanation.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-600 mb-1">Prediction Accuracy</div>
                    <div className="text-sm font-bold text-green-600">{modelExplanation.accuracy}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Last Trained</div>
                    <div className="text-sm font-mono text-gray-900">{modelExplanation.lastTrained}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-600 mb-1">Training Data Points</div>
                    <div className="text-sm font-bold" style={{ color: '#2955A0' }}>{modelExplanation.dataPoints}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation Summary */}
          <Card className="border-2 border-green-200">
            <CardHeader className="border-b bg-green-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-700" />
                AI Recommendation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <ScrollArea className="h-[500px]">
                <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {recommendationSummary}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button className="w-full hover:bg-opacity-90" style={{ backgroundColor: '#2955A0' }} size="lg">
            <BrainCircuit className="w-5 h-5 mr-2" />
            Generate Detailed AI Report
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}