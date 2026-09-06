import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  History, 
  Edit3, 
  MoreHorizontal, 
  ArrowRight,
  BrainCircuit,
  Zap,
  Layers,
  Factory,
  Users
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  ComposedChart,
  Line
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { KPI } from "./types";
import { cn } from "../ui/utils";

interface KPIDetailViewProps {
  kpi: KPI;
  onEditFormula: () => void;
  period?: string;
  clusterFilter?: string;
  fy?: string;
  month?: string;
}

export function KPIDetailView({ kpi, onEditFormula, period = "Monthly", clusterFilter = "all", fy = "FY 2023-24", month = "September" }: KPIDetailViewProps) {
  const [timeRange, setTimeRange] = useState("12m");

  const periodLabel =
    period === "MTD"    ? "MTD Value" :
    period === "YTD"    ? "YTD Cumulative" :
    period === "Annual" ? "Annual Total" : "Monthly Value";

  const getComplianceColor = (status: KPI["complianceStatus"]) => {
    switch (status) {
      case "Compliant": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Warning": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Non-Compliant": return "text-rose-700 bg-rose-50 border-rose-200";
      default: return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const deviation = ((kpi.currentValue - kpi.targetValue) / kpi.targetValue) * 100;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
      
      {/* Active Filter Context Bar */}
      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 flex-wrap">
        <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Viewing:</span>
        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">{fy}</span>
        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">{month}</span>
        <span className="px-2 py-0.5 bg-[#2955A0] text-white rounded font-medium">{period}</span>
        {clusterFilter !== "all" && (
          <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 rounded font-medium">{clusterFilter} Cluster</span>
        )}
        {clusterFilter === "all" && (
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-medium">All Plants</span>
        )}
      </div>

      {/* Header Section */}
      <div className="flex items-start justify-between bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-medium">
              {kpi.category}
            </Badge>
            <Badge variant="outline" className={cn("font-medium", getComplianceColor(kpi.complianceStatus))}>
              {kpi.complianceStatus}
            </Badge>
            <span className="text-xs text-slate-300">|</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">PPA:</span> {kpi.ppaType || "N/A"}
            </div>
             <span className="text-xs text-slate-300">|</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span className="font-semibold text-slate-700">Ver:</span> {kpi.effectiveVersion || "v1.0"}
            </div>
             <span className="text-xs text-slate-300">|</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span className="font-semibold text-slate-700">Impacted:</span> {kpi.impactedPlants || 0} Plants
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{kpi.name}</h1>
          <p className="text-slate-600 max-w-4xl text-sm leading-relaxed">{kpi.description}</p>
        </div>
        <div className="flex gap-2">
           <Button onClick={onEditFormula} className="bg-[#2955A0] text-white hover:bg-[#1E4888] gap-2 shadow-sm h-9">
             <Edit3 className="w-4 h-4" /> Edit Configuration
           </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 h-10 w-fit">
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Performance View</TabsTrigger>
          <TabsTrigger value="breakdown" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Breakdown Analysis</TabsTrigger>
          {kpi.waterfallData && <TabsTrigger value="waterfall" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Waterfall Analysis</TabsTrigger>}
          <TabsTrigger value="versions" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6 animate-in fade-in-50 duration-300">
          {/* KPI Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Current Value */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#2955A0]" />
               <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{periodLabel}</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-bold text-slate-900">{kpi.currentValue}</span>
                     <span className="text-xs font-medium text-slate-500">{kpi.unit}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">{month} · {fy}</p>
               </CardContent>
            </Card>

            {/* Target Benchmark */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#E8A800]" />
               <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Benchmark</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-bold text-slate-900">{kpi.targetValue}</span>
                     <span className="text-xs font-medium text-slate-500">{kpi.unit}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 truncate" title={kpi.benchmarkSource}>
                     Source: {kpi.benchmarkSource}
                  </div>
               </CardContent>
            </Card>

            {/* Deviation */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-slate-400" />
               <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deviation</p>
                  <div className="flex items-baseline gap-1">
                     <span className={cn("text-2xl font-bold", deviation > 0 ? "text-emerald-600" : "text-rose-600")}>
                        {deviation > 0 ? "+" : ""}{deviation.toFixed(1)}%
                     </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                     From Target
                  </div>
               </CardContent>
            </Card>

            {/* Financial Impact */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
               <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rev. Impact</p>
                  <div className="flex items-baseline gap-1">
                     <span className={cn("text-xl font-bold truncate", (kpi.revenueImpact || 0) < 0 ? "text-rose-600" : "text-emerald-600")}>
                        {kpi.revenueImpact ? formatCurrency(kpi.revenueImpact) : "₹ 0"}
                     </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                     Estimated Impact
                  </div>
               </CardContent>
            </Card>

            {/* LD Exposure */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-slate-800" />
               <CardContent className="p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LD Risk</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-xl font-bold text-slate-900 truncate">
                        {kpi.ldRisk ? formatCurrency(kpi.ldRisk) : "₹ 0"}
                     </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                     Penalty Risk
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* AI Insight Section (Conditional) */}
          {kpi.category === "AI/Predictive" && kpi.aiInsight && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-24 h-24 text-indigo-900" />
              </div>
              <div className="relative z-10 flex gap-4 items-start">
                 <div className="p-2 bg-white rounded shadow-sm text-indigo-600">
                   <Zap className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <h3 className="text-sm font-bold text-indigo-900">AI Insight – Based on Historical Monthly Dataset</h3>
                     <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] h-5 px-1.5">
                       {kpi.aiInsight.confidence}% Confidence
                     </Badge>
                   </div>
                   <p className="text-indigo-800 mb-3 text-sm leading-relaxed">
                     {kpi.aiInsight.recommendation}
                   </p>
                   <div className="flex gap-4 border-t border-indigo-200 pt-2">
                     <div className="flex items-center gap-2">
                       <span className="text-xs text-indigo-500 font-medium">Predicted:</span>
                       <span className="text-sm font-bold text-indigo-900">{kpi.aiInsight.predictedValue} {kpi.unit}</span>
                     </div>
                     <div className="w-px bg-indigo-200 h-4" />
                     <div className="flex items-center gap-2">
                       <span className="text-xs text-indigo-500 font-medium">Status:</span>
                       <span className={cn("text-sm font-bold flex items-center gap-1", kpi.aiInsight.anomalyDetected ? "text-rose-600" : "text-emerald-600")}>
                         {kpi.aiInsight.anomalyDetected ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                         {kpi.aiInsight.anomalyDetected ? "Anomaly Detected" : "Normal"}
                       </span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">Performance Trend</CardTitle>
                </div>
                <Tabs defaultValue="12m" className="h-6">
                  <TabsList className="h-6 bg-slate-100 p-0.5">
                    <TabsTrigger value="12m" className="h-5 text-[10px] px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">12M</TabsTrigger>
                    <TabsTrigger value="yoy" className="h-5 text-[10px] px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">YoY</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-4">
                 <div className="h-[280px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={kpi.history || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2955A0" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2955A0" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis 
                         dataKey="month" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 11, fill: '#64748b' }} 
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 11, fill: '#64748b' }} 
                         dx={-10}
                       />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)', padding: '8px' }}
                         itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 600 }}
                         labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke="#2955A0" 
                         strokeWidth={2} 
                         fillOpacity={1} 
                         fill="url(#colorValue)" 
                         activeDot={{ r: 4, strokeWidth: 0, fill: '#2955A0' }}
                       />
                       <Area 
                         type="step" 
                         dataKey="target" 
                         stroke="#E8A800" 
                         strokeWidth={2} 
                         strokeDasharray="4 4" 
                         fill="none" 
                       />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex justify-between mt-2 text-xs text-slate-500 px-2">
                    <span>MoM Change: <span className={cn("font-bold", kpi.momChange > 0 ? "text-emerald-600" : "text-rose-600")}>{kpi.momChange > 0 ? "+" : ""}{kpi.momChange}%</span></span>
                    <span>YoY Change: {(() => {
                      const h = kpi.history || [];
                      if (h.length < 2) return <span className="font-bold text-slate-400">—</span>;
                      const latest = h[h.length - 1].value;
                      const prev = h[0].value;
                      const yoy = prev > 0 ? ((latest - prev) / prev * 100) : 0;
                      return <span className={cn("font-bold", yoy >= 0 ? "text-emerald-600" : "text-rose-600")}>{yoy >= 0 ? "+" : ""}{yoy.toFixed(1)}%</span>;
                    })()}</span>
                 </div>
              </CardContent>
            </Card>

            {/* Impact Analytics Panel (Side) */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-slate-50">
               <CardHeader className="py-3 border-b border-slate-200/50">
                 <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compliance Impact</CardTitle>
               </CardHeader>
               <CardContent className="space-y-5 pt-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Total Revenue at Risk</span>
                      <span className="font-bold text-rose-700">₹ {((kpi.revenueImpact ?? 0) / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, Math.max(5, ((kpi.revenueImpact ?? 0) / 1500000) * 100))}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">LD Exposure</span>
                      <span className="font-bold text-slate-900">₹ {((kpi.ldRisk ?? 0) * kpi.currentValue / 100 / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800" style={{ width: `${Math.min(100, Math.max(3, (kpi.ldRisk ?? 0)))}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Non-Compliant Plants</span>
                      <span className="font-bold text-rose-600">{(kpi.plantBreakdown || []).filter(p => p.status !== "Compliant").length} / {kpi.impactedPlants ?? 45}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, ((kpi.plantBreakdown || []).filter(p => p.status !== "Compliant").length / (kpi.impactedPlants ?? 45)) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 mt-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">ESCALATION STATUS</h4>
                    <div className="flex items-start gap-2 p-2 bg-white rounded border border-slate-200 shadow-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Warning Level 2</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Auto-email sent to Plant Head regarding continued deviation &gt; 5%.</p>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="animate-in fade-in-50 duration-300">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
             <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-800">Detailed Breakdown</CardTitle>
                <Tabs defaultValue="plant" className="h-7">
                  <TabsList className="h-7 bg-slate-100 p-0.5">
                    <TabsTrigger value="plant" className="h-6 text-[10px] px-2 gap-1.5"><Factory className="w-3 h-3" /> Plant</TabsTrigger>
                    <TabsTrigger value="cluster" className="h-6 text-[10px] px-2 gap-1.5"><Layers className="w-3 h-3" /> Cluster</TabsTrigger>
                    <TabsTrigger value="vendor" className="h-6 text-[10px] px-2 gap-1.5"><Users className="w-3 h-3" /> Vendor</TabsTrigger>
                  </TabsList>
                </Tabs>
             </CardHeader>
             <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-slate-50">
                   <TableRow className="h-8 hover:bg-slate-50">
                     <TableHead className="h-8 font-semibold text-slate-600 text-xs">Name</TableHead>
                     <TableHead className="h-8 font-semibold text-slate-600 text-xs text-right">Value</TableHead>
                     <TableHead className="h-8 font-semibold text-slate-600 text-xs">Status</TableHead>
                     <TableHead className="h-8 font-semibold text-slate-600 text-xs text-right">Deviation</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {(kpi.plantBreakdown || []).map((plant, i) => (
                       <TableRow key={i} className="hover:bg-slate-50/50 h-9">
                         <TableCell className="font-medium text-slate-900 text-xs py-1">{plant.plant}</TableCell>
                         <TableCell className="text-right font-mono text-slate-700 text-xs py-1">{plant.value} {kpi.unit}</TableCell>
                         <TableCell className="py-1">
                           <Badge variant="outline" className={cn("text-[10px] h-4 px-1 rounded-sm font-normal", getComplianceColor(plant.status))}>
                             {plant.status}
                           </Badge>
                         </TableCell>
                         <TableCell className={cn("text-right font-medium text-xs py-1", plant.value >= kpi.targetValue ? "text-emerald-600" : "text-rose-600")}>{kpi.targetValue > 0 ? `${((plant.value - kpi.targetValue) / kpi.targetValue * 100).toFixed(1)}%` : "—"}</TableCell>
                       </TableRow>
                     ))
                   }
                   {(kpi.plantBreakdown || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-slate-500 italic text-xs">No data available</TableCell>
                      </TableRow>
                   )}
                 </TableBody>
               </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waterfall" className="animate-in fade-in-50 duration-300">
           <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="py-3 px-4 border-b border-slate-100">
                 <CardTitle className="text-sm font-bold text-slate-800">Waterfall Analysis: Budgeted vs Actual</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                 <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={kpi.waterfallData || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <Tooltip 
                           cursor={{fill: 'transparent'}}
                           contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" barSize={40}>
                          {
                            (kpi.waterfallData || []).map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.type === 'decrease' ? '#ef4444' : entry.type === 'increase' ? '#10b981' : '#2955A0'} 
                              />
                            ))
                          }
                        </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="versions" className="animate-in fade-in-50 duration-300">
           <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
                 <CardTitle className="text-sm font-bold text-slate-800">Version History & Audit Log</CardTitle>
                 <Button variant="outline" size="sm" className="h-7 text-xs">Rollback to Previous</Button>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                   <TableHeader className="bg-slate-50">
                     <TableRow className="h-8">
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs">Version</TableHead>
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs">Effective Date</TableHead>
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs">Formula Snapshot</TableHead>
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs">Approved By</TableHead>
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs">Status</TableHead>
                       <TableHead className="h-8 font-semibold text-slate-600 text-xs text-right">Rev. Impact</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {(kpi.versions || []).map((v, i) => (
                       <TableRow key={i} className="hover:bg-slate-50/50 h-10">
                         <TableCell className="font-bold text-slate-900 text-xs">{v.version}</TableCell>
                         <TableCell className="text-slate-600 text-xs">{v.effectiveDate}</TableCell>
                         <TableCell className="font-mono text-slate-500 text-[10px] truncate max-w-[200px]">{v.snapshot}</TableCell>
                         <TableCell className="text-slate-700 text-xs">{v.approvedBy}</TableCell>
                         <TableCell>
                           <Badge variant={v.status === 'Active' ? 'default' : 'secondary'} className={cn("text-[10px] h-4 px-1.5 font-normal", v.status === 'Active' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500")}>
                             {v.status}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-right font-medium text-xs text-rose-600">
                           {v.revenueImpactChange ? formatCurrency(v.revenueImpactChange) : "-"}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
