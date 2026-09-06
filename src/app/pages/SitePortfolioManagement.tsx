import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Building2, MapPin, Zap, Calendar, Edit, Eye, Target, CircleDollarSign, BarChart2, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";

const vendorColors: Record<string, string> = {
  "SolarCo India": "#2955A0",
  "SunPower Tech": "#ef4444",
  "Mega Solar Inc": "#f59e0b",
  "Green Energy Ltd": "#10b981",
  "TechSolar Pvt": "#8b5cf6",
};

const vendorRevenueData = [
  { vendor: "SolarCo India", plants: "Sakri, Ahmednagar, Amravati", plantCount: 3, capacity: 51, budgeted: 12.17, actual: 10.94, realized: 10.55, collection: 89.9, ldExposure: 0.42, shortfall: 1.23, status: "warning" },
  { vendor: "SunPower Tech", plants: "Sangli, Wardha, Buldhana, Chandrapur", plantCount: 4, capacity: 63, budgeted: 12.61, actual: 10.89, realized: 10.42, collection: 86.3, ldExposure: 0.54, shortfall: 1.72, status: "critical" },
  { vendor: "Mega Solar Inc", plants: "Beed, Devdaithan, Bhandara", plantCount: 3, capacity: 56, budgeted: 13.44, actual: 12.19, realized: 11.65, collection: 90.7, ldExposure: 0.55, shortfall: 1.25, status: "warning" },
  { vendor: "Green Energy Ltd", plants: "Osmanabad", plantCount: 1, capacity: 30, budgeted: 7.20, actual: 6.97, realized: 6.80, collection: 96.8, ldExposure: 0.00, shortfall: 0.23, status: "healthy" },
  { vendor: "TechSolar Pvt", plants: "Latur", plantCount: 1, capacity: 20, budgeted: 4.80, actual: 4.60, realized: 4.48, collection: 95.8, ldExposure: 0.00, shortfall: 0.20, status: "healthy" },
];

const plantRevenueData = [
  { plant: "Sakri Solar Park", district: "Dhule", vendor: "SolarCo India", capacity: 25, tariff: 2.00, budgetedGen: 5520, actualGen: 5180, revenue: 1.04, budgetedRev: 1.10, shortfall: 0.06, collectionPct: 94.2, invoiced: 1.10, collected: 1.04, pending: 0.06, overdue: 0.02, pr: 78.2, cuf: 23.5 },
  { plant: "Sangli Solar Farm", district: "Sangli", vendor: "SunPower Tech", capacity: 15, tariff: 2.00, budgetedGen: 3250, actualGen: 2840, revenue: 0.57, budgetedRev: 0.65, shortfall: 0.08, collectionPct: 88.5, invoiced: 0.65, collected: 0.57, pending: 0.08, overdue: 0.02, pr: 74.8, cuf: 21.2 },
  { plant: "Osmanabad Solar Plant", district: "Osmanabad", vendor: "Green Energy Ltd", capacity: 30, tariff: 2.00, budgetedGen: 6510, actualGen: 6360, revenue: 1.27, budgetedRev: 1.30, shortfall: 0.03, collectionPct: 97.5, invoiced: 1.30, collected: 1.27, pending: 0.03, overdue: 0.00, pr: 82.5, cuf: 24.1 },
  { plant: "Latur Solar Station", district: "Latur", vendor: "TechSolar Pvt", capacity: 20, tariff: 2.00, budgetedGen: 4340, actualGen: 4240, revenue: 0.85, budgetedRev: 0.87, shortfall: 0.02, collectionPct: 98.0, invoiced: 0.87, collected: 0.85, pending: 0.02, overdue: 0.00, pr: 83.1, cuf: 23.8 },
  { plant: "Beed Solar Park", district: "Beed", vendor: "Mega Solar Inc", capacity: 30, tariff: 2.00, budgetedGen: 6510, actualGen: 6180, revenue: 1.24, budgetedRev: 1.30, shortfall: 0.06, collectionPct: 94.8, invoiced: 1.30, collected: 1.24, pending: 0.06, overdue: 0.02, pr: 80.2, cuf: 24.5 },
  { plant: "Ahmednagar Solar Plant", district: "Ahmednagar", vendor: "SolarCo India", capacity: 12, tariff: 2.00, budgetedGen: 2600, actualGen: 2450, revenue: 0.49, budgetedRev: 0.52, shortfall: 0.03, collectionPct: 94.0, invoiced: 0.52, collected: 0.49, pending: 0.03, overdue: 0.01, pr: 79.0, cuf: 23.2 },
  { plant: "Devdaithan Solar Plant", district: "Ahmednagar", vendor: "Mega Solar Inc", capacity: 18, tariff: 2.00, budgetedGen: 3905, actualGen: 3690, revenue: 0.74, budgetedRev: 0.78, shortfall: 0.04, collectionPct: 95.0, invoiced: 0.78, collected: 0.74, pending: 0.04, overdue: 0.01, pr: 79.8, cuf: 19.5 },
  { plant: "Amravati Solar Unit", district: "Amravati", vendor: "SolarCo India", capacity: 14, tariff: 2.00, budgetedGen: 3040, actualGen: 2740, revenue: 0.55, budgetedRev: 0.61, shortfall: 0.06, collectionPct: 89.8, invoiced: 0.61, collected: 0.55, pending: 0.06, overdue: 0.02, pr: 75.8, cuf: 18.5 },
  { plant: "Wardha Solar Park", district: "Wardha", vendor: "SunPower Tech", capacity: 16, tariff: 2.00, budgetedGen: 3470, actualGen: 3180, revenue: 0.64, budgetedRev: 0.69, shortfall: 0.05, collectionPct: 91.5, invoiced: 0.69, collected: 0.64, pending: 0.05, overdue: 0.02, pr: 76.5, cuf: 20.8 },
  { plant: "Buldhana Solar Farm", district: "Buldhana", vendor: "SunPower Tech", capacity: 10, tariff: 2.00, budgetedGen: 2170, actualGen: 1990, revenue: 0.40, budgetedRev: 0.43, shortfall: 0.03, collectionPct: 91.8, invoiced: 0.43, collected: 0.40, pending: 0.03, overdue: 0.01, pr: 77.0, cuf: 22.8 },
  { plant: "Chandrapur Solar Project", district: "Chandrapur", vendor: "SunPower Tech", capacity: 22, tariff: 2.00, budgetedGen: 4770, actualGen: 4360, revenue: 0.87, budgetedRev: 0.95, shortfall: 0.08, collectionPct: 91.5, invoiced: 0.95, collected: 0.87, pending: 0.08, overdue: 0.02, pr: 77.2, cuf: 21.5 },
  { plant: "Bhandara Solar Station", district: "Bhandara", vendor: "Mega Solar Inc", capacity: 8, tariff: 2.00, budgetedGen: 1740, actualGen: 1640, revenue: 0.33, budgetedRev: 0.35, shortfall: 0.02, collectionPct: 94.2, invoiced: 0.35, collected: 0.33, pending: 0.02, overdue: 0.01, pr: 79.5, cuf: 23.0 },
];

const portfolioStats = {
  totalPlants: 12,
  totalCapacity: 220,
  activeAssets: 1245,
  locations: 10,
};

const plants = [
  { id: "PLT-001", name: "Sakri Solar Park", location: "Dhule, Maharashtra", capacity: "25 MW", commissionDate: "2020-04-15", technology: "Mono-crystalline", inverters: 10, modules: 73440, status: "operational", contractor: "SolarCo India" },
  { id: "PLT-002", name: "Sangli Solar Farm", location: "Sangli, Maharashtra", capacity: "15 MW", commissionDate: "2019-11-20", technology: "Poly-crystalline", inverters: 6, modules: 43200, status: "operational", contractor: "SunPower Tech" },
  { id: "PLT-003", name: "Osmanabad Solar Plant", location: "Osmanabad, Maharashtra", capacity: "30 MW", commissionDate: "2021-06-10", technology: "Mono-crystalline", inverters: 12, modules: 86400, status: "operational", contractor: "Green Energy Ltd" },
  { id: "PLT-004", name: "Latur Solar Station", location: "Latur, Maharashtra", capacity: "20 MW", commissionDate: "2020-09-05", technology: "Bifacial", inverters: 8, modules: 57600, status: "operational", contractor: "TechSolar Pvt" },
  { id: "PLT-005", name: "Beed Solar Park", location: "Beed, Maharashtra", capacity: "30 MW", commissionDate: "2020-03-12", technology: "Mono-crystalline", inverters: 12, modules: 86400, status: "operational", contractor: "Mega Solar Inc" },
  { id: "PLT-006", name: "Ahmednagar Solar Plant", location: "Ahmednagar, Maharashtra", capacity: "12 MW", commissionDate: "2021-04-10", technology: "Mono-crystalline", inverters: 5, modules: 34560, status: "operational", contractor: "SolarCo India" },
  { id: "PLT-007", name: "Devdaithan Solar Plant", location: "Ahmednagar, Maharashtra", capacity: "18 MW", commissionDate: "2020-08-22", technology: "Mono-crystalline", inverters: 7, modules: 51840, status: "operational", contractor: "Mega Solar Inc" },
  { id: "PLT-008", name: "Amravati Solar Unit", location: "Amravati, Maharashtra", capacity: "14 MW", commissionDate: "2020-11-10", technology: "Poly-crystalline", inverters: 6, modules: 40320, status: "maintenance", contractor: "SolarCo India" },
  { id: "PLT-009", name: "Wardha Solar Park", location: "Wardha, Maharashtra", capacity: "16 MW", commissionDate: "2021-01-18", technology: "Poly-crystalline", inverters: 6, modules: 46080, status: "maintenance", contractor: "SunPower Tech" },
  { id: "PLT-010", name: "Buldhana Solar Farm", location: "Buldhana, Maharashtra", capacity: "10 MW", commissionDate: "2019-12-05", technology: "Poly-crystalline", inverters: 4, modules: 28800, status: "operational", contractor: "SunPower Tech" },
  { id: "PLT-011", name: "Chandrapur Solar Project", location: "Chandrapur, Maharashtra", capacity: "22 MW", commissionDate: "2020-06-15", technology: "Mono-crystalline", inverters: 9, modules: 63360, status: "operational", contractor: "SunPower Tech" },
  { id: "PLT-012", name: "Bhandara Solar Station", location: "Bhandara, Maharashtra", capacity: "8 MW", commissionDate: "2021-02-28", technology: "Bifacial", inverters: 3, modules: 23040, status: "operational", contractor: "Mega Solar Inc" },
];

const radarData = [
  { metric: "Collection %", fullMetric: "Collection Rate" },
  { metric: "Realization", fullMetric: "Revenue Realization %" },
  { metric: "LD Score", fullMetric: "LD Compliance (inverse)" },
  { metric: "Capacity Util.", fullMetric: "Capacity Utilization" },
  { metric: "Plant Health", fullMetric: "Portfolio Health Score" },
].map(m => {
  const entry: Record<string, string | number> = { metric: m.metric, fullMetric: m.fullMetric };
  vendorRevenueData.forEach(v => {
    const key = v.vendor;
    if (m.metric === "Collection %") entry[key] = v.collection;
    else if (m.metric === "Realization") entry[key] = (v.realized / v.budgeted) * 100;
    else if (m.metric === "LD Score") entry[key] = Math.max(0, 100 - (v.ldExposure / v.budgeted) * 500);
    else if (m.metric === "Capacity Util.") entry[key] = (v.realized / v.capacity) * 30 + 60;
    else entry[key] = v.status === "healthy" ? 95 : v.status === "warning" ? 75 : 55;
  });
  return entry;
});

const plantScatterData = plantRevenueData.map(p => ({
  x: p.pr,
  y: p.cuf,
  z: p.revenue * 100,
  name: p.plant.split(" ").slice(0, 2).join(" "),
  fullName: p.plant,
  vendor: p.vendor,
  revenue: p.revenue,
  collectionPct: p.collectionPct,
  capacity: p.capacity,
  fill: vendorColors[p.vendor] || "#94a3b8",
}));

const sortedPlants = [...plantRevenueData].sort((a, b) => b.revenue - a.revenue);

export function SitePortfolioManagement() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Site & Portfolio Management</h1>
                <p className="text-xs text-slate-600 mt-0.5">Manage plant details, assets, and performance analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button style={{ backgroundColor: "#2955A0" }} className="text-white h-7 px-3 text-xs">
                <Building2 className="w-4 h-4 mr-2" />
                Add New Plant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#2955A0]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Plants</p>
                  <p className="text-xl font-bold text-slate-900">{portfolioStats.totalPlants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8A80020" }}>
                  <Zap className="w-5 h-5" style={{ color: "#E8A800" }} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Capacity</p>
                  <p className="text-xl font-bold text-slate-900">{portfolioStats.totalCapacity} MW</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Active Assets</p>
                  <p className="text-xl font-bold text-slate-900">{portfolioStats.activeAssets.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Locations</p>
                  <p className="text-xl font-bold text-slate-900">{portfolioStats.locations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 mb-4">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Plant Inventory
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" /> Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-0 space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base font-semibold">Plant Inventory</CardTitle>
                <CardDescription>All solar plants across Maharashtra — {plants.length} plants</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Plant ID</TableHead>
                      <TableHead className="text-xs">Plant Name</TableHead>
                      <TableHead className="text-xs">Location</TableHead>
                      <TableHead className="text-xs">Capacity</TableHead>
                      <TableHead className="text-xs">Technology</TableHead>
                      <TableHead className="text-xs">Commission Date</TableHead>
                      <TableHead className="text-xs">Vendor</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plants.map((plant) => (
                      <TableRow key={plant.id}>
                        <TableCell className="font-medium text-xs">{plant.id}</TableCell>
                        <TableCell className="text-xs font-semibold">{plant.name}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {plant.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{plant.capacity}</TableCell>
                        <TableCell className="text-xs">{plant.technology}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {plant.commissionDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: vendorColors[plant.contractor] || "#94a3b8" }} />
                            {plant.contractor}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={plant.status === "operational" ? "default" : "secondary"}
                            className={`text-[10px] ${
                              plant.status === "operational"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }`}
                          >
                            {plant.status === "operational" ? "Operational" : "Maintenance"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-0 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-5 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#2955A0]" />
                    Vendor Performance Radar
                  </CardTitle>
                  <CardDescription>Multi-dimensional vendor health comparison — FY 2025-26</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#64748b" }} />
                      <PolarRadiusAxis angle={90} domain={[50, 100]} tick={{ fontSize: 8 }} axisLine={false} />
                      {vendorRevenueData.map((v) => (
                        <Radar
                          key={v.vendor}
                          name={v.vendor}
                          dataKey={v.vendor}
                          stroke={vendorColors[v.vendor]}
                          fill={vendorColors[v.vendor]}
                          fillOpacity={0.08}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <RechartsTooltip content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 text-xs">
                            <p className="font-bold text-slate-800 mb-1">{label}</p>
                            {payload.map((p: { name?: string; value?: number; color?: string }) => (
                              <p key={p.name} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-slate-600">{p.name}: <span className="font-bold">{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span></span>
                              </p>
                            ))}
                          </div>
                        );
                      }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-7 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CircleDollarSign className="w-4 h-4 text-[#2955A0]" />
                    Plant Performance Quadrant — PR% vs CUF%
                  </CardTitle>
                  <CardDescription>Bubble size = revenue (₹Cr), color = vendor — identify top and underperforming plants</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" dataKey="x" name="PR%" domain={[72, 86]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} label={{ value: "Performance Ratio (%)", position: "bottom", offset: 8, fontSize: 11, fill: "#94a3b8" }} />
                      <YAxis type="number" dataKey="y" name="CUF%" domain={[19, 26]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} label={{ value: "CUF (%)", angle: -90, position: "insideLeft", offset: 8, fontSize: 11, fill: "#94a3b8" }} />
                      <ZAxis type="number" dataKey="z" range={[120, 600]} />
                      <ReferenceLine x={78} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "PR Threshold", position: "top", fontSize: 9, fill: "#f59e0b" }} />
                      <ReferenceLine y={22} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "CUF Target", position: "right", fontSize: 9, fill: "#f59e0b" }} />
                      <RechartsTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs">
                            <p className="font-bold text-slate-800">{d?.fullName}</p>
                            <p className="text-slate-500 mb-1">{d?.vendor} · {d?.capacity} MW</p>
                            <div className="space-y-0.5">
                              <p>PR: <span className="font-bold">{d?.x}%</span></p>
                              <p>CUF: <span className="font-bold">{d?.y}%</span></p>
                              <p>Revenue: <span className="font-bold text-[#2955A0]">₹{d?.revenue?.toFixed(2)} Cr</span></p>
                              <p>Collection: <span className="font-bold">{d?.collectionPct}%</span></p>
                            </div>
                          </div>
                        );
                      }} />
                      <Scatter data={plantScatterData}>
                        {plantScatterData.map((entry, index) => (
                          <Cell key={`scatter-${index}`} fill={entry.fill} fillOpacity={0.7} stroke={entry.fill} strokeWidth={1.5} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pb-1">
                    {Object.entries(vendorColors).map(([vendor, color]) => (
                      <span key={vendor} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.7 }} />
                        {vendor}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2955A0]" />
                  Plant Performance Ranking
                </CardTitle>
                <CardDescription>All 12 plants ranked by realized revenue with budget baseline and collection breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {sortedPlants.map((p, idx) => {
                    const maxRev = Math.max(...plantRevenueData.map(pp => pp.budgetedRev));
                    const budgetWidth = (p.budgetedRev / maxRev) * 100;
                    const revenueWidth = (p.revenue / maxRev) * 100;
                    const realizePct = (p.revenue / p.budgetedRev * 100);
                    const color = vendorColors[p.vendor] || "#94a3b8";
                    const collTotal = p.collected + (p.pending - p.overdue) + p.overdue;
                    const collPct = collTotal > 0 ? (p.collected / collTotal) * 100 : 0;
                    const pendPct = collTotal > 0 ? ((p.pending - p.overdue) / collTotal) * 100 : 0;
                    const overdPct = collTotal > 0 ? (p.overdue / collTotal) * 100 : 0;
                    return (
                      <div key={p.plant} className="group">
                        <div className="flex items-center gap-3">
                          <div className="w-5 text-right">
                            <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                          </div>
                          <div className="w-[180px] flex-shrink-0">
                            <div className="text-xs font-semibold text-slate-800 leading-tight">{p.plant}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                              <span className="text-[9px] text-slate-400">{p.vendor} · {p.capacity} MW</span>
                            </div>
                          </div>
                          <div className="flex-1 relative">
                            <div className="relative h-6">
                              <div className="absolute top-0 h-2.5 rounded-sm bg-slate-200 transition-all" style={{ width: `${budgetWidth}%` }} />
                              <div className="absolute top-[14px] h-2.5 rounded-sm transition-all" style={{ width: `${revenueWidth}%`, backgroundColor: color }} />
                              <div
                                className="absolute top-0 h-full border-r-2 border-dashed"
                                style={{ left: `${budgetWidth}%`, borderColor: "#94a3b8" }}
                              />
                            </div>
                          </div>
                          <div className="w-[60px] text-right flex-shrink-0">
                            <div className="text-xs font-bold text-[#2955A0]">₹{p.revenue.toFixed(2)}</div>
                            <div className="text-[9px] text-slate-400">/ ₹{p.budgetedRev.toFixed(2)}</div>
                          </div>
                          <div className="w-[50px] text-right flex-shrink-0">
                            <span className={`text-[10px] font-bold ${realizePct >= 95 ? "text-emerald-600" : realizePct >= 88 ? "text-amber-600" : "text-rose-600"}`}>
                              {realizePct.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-[100px] flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex">
                                  <div className="h-3 rounded-l-sm bg-emerald-400 transition-all" style={{ width: `${collPct}%` }} title={`Collected: ₹${p.collected}`} />
                                  <div className="h-3 bg-amber-400 transition-all" style={{ width: `${Math.max(pendPct, 0)}%` }} title={`Pending: ₹${(p.pending - p.overdue).toFixed(2)}`} />
                                  <div className="h-3 rounded-r-sm bg-rose-400 transition-all" style={{ width: `${overdPct}%` }} title={`Overdue: ₹${p.overdue}`} />
                                </div>
                              </div>
                            </div>
                            <div className="text-[8px] text-slate-400 mt-0.5 text-center">
                              {p.collectionPct}% collected
                            </div>
                          </div>
                          <div className="w-[60px] flex-shrink-0 text-right">
                            <div className="text-[9px] text-slate-500">PR {p.pr}%</div>
                            <div className="text-[9px] text-slate-500">CUF {p.cuf}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-4 h-2 rounded-sm bg-slate-200" /> Budgeted
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-4 h-2 rounded-sm bg-[#2955A0]" /> Realized
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-4 h-2 rounded-sm bg-emerald-400" /> Collected
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-4 h-2 rounded-sm bg-amber-400" /> Pending
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="w-4 h-2 rounded-sm bg-rose-400" /> Overdue
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
