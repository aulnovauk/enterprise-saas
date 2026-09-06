import { useState, useRef, useMemo } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { VENDORS, PLANTS } from "../data/plants";
import {
  IndianRupee,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  CloudRain,
  Wrench,
  BarChart2,
  PieChart as PieChartIcon,
  FileText,
  Building2,
  ArrowRight,
  Info,
  Target,
  Wallet,
  Receipt,
  Scale,
  ShieldAlert,
  CircleDollarSign,
  Filter,
  BarChart3,
  Table2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Factory,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const monthlyRevenueData = [
  { month: "Apr 25", budgeted: 2.60, expected: 2.52, actual: 2.48, realized: 2.42, collection: 93.1, genMWh: 12400, gridLoss: 0.04, eqLoss: 0.03, weatherLoss: 0.05, curtailmentLoss: 0.02, otherLoss: 0.01 },
  { month: "May 25", budgeted: 2.75, expected: 2.68, actual: 2.62, realized: 2.55, collection: 92.4, genMWh: 13100, gridLoss: 0.03, eqLoss: 0.04, weatherLoss: 0.04, curtailmentLoss: 0.01, otherLoss: 0.01 },
  { month: "Jun 25", budgeted: 2.45, expected: 2.30, actual: 2.18, realized: 2.10, collection: 85.7, genMWh: 10900, gridLoss: 0.06, eqLoss: 0.03, weatherLoss: 0.08, curtailmentLoss: 0.03, otherLoss: 0.02 },
  { month: "Jul 25", budgeted: 2.35, expected: 2.15, actual: 2.02, realized: 1.95, collection: 83.0, genMWh: 10100, gridLoss: 0.08, eqLoss: 0.05, weatherLoss: 0.10, curtailmentLoss: 0.04, otherLoss: 0.02 },
  { month: "Aug 25", budgeted: 2.50, expected: 2.38, actual: 2.30, realized: 2.22, collection: 88.8, genMWh: 11500, gridLoss: 0.05, eqLoss: 0.04, weatherLoss: 0.06, curtailmentLoss: 0.02, otherLoss: 0.01 },
  { month: "Sep 25", budgeted: 2.55, expected: 2.48, actual: 2.42, realized: 2.36, collection: 92.5, genMWh: 12100, gridLoss: 0.04, eqLoss: 0.03, weatherLoss: 0.04, curtailmentLoss: 0.02, otherLoss: 0.01 },
  { month: "Oct 25", budgeted: 2.70, expected: 2.65, actual: 2.60, realized: 2.54, collection: 94.1, genMWh: 13000, gridLoss: 0.03, eqLoss: 0.02, weatherLoss: 0.03, curtailmentLoss: 0.01, otherLoss: 0.01 },
  { month: "Nov 25", budgeted: 2.65, expected: 2.58, actual: 2.50, realized: 2.44, collection: 92.1, genMWh: 12500, gridLoss: 0.04, eqLoss: 0.04, weatherLoss: 0.05, curtailmentLoss: 0.02, otherLoss: 0.01 },
  { month: "Dec 25", budgeted: 2.55, expected: 2.45, actual: 2.38, realized: 2.30, collection: 90.2, genMWh: 11900, gridLoss: 0.05, eqLoss: 0.05, weatherLoss: 0.04, curtailmentLoss: 0.03, otherLoss: 0.02 },
  { month: "Jan 26", budgeted: 2.60, expected: 2.55, actual: 2.48, realized: 2.42, collection: 93.1, genMWh: 12400, gridLoss: 0.04, eqLoss: 0.03, weatherLoss: 0.04, curtailmentLoss: 0.02, otherLoss: 0.01 },
  { month: "Feb 26", budgeted: 2.50, expected: 2.42, actual: 2.35, realized: 2.28, collection: 91.2, genMWh: 11750, gridLoss: 0.04, eqLoss: 0.04, weatherLoss: 0.05, curtailmentLoss: 0.02, otherLoss: 0.02 },
  { month: "Mar 26", budgeted: 2.72, expected: 2.66, actual: 2.58, realized: 2.52, collection: 92.6, genMWh: 12900, gridLoss: 0.04, eqLoss: 0.03, weatherLoss: 0.05, curtailmentLoss: 0.02, otherLoss: 0.01 },
];

const vendorRevenueData = [
  { vendor: "SolarCo India", plants: "Sakri, Ahmednagar, Amravati", plantCount: 3, capacity: 51.0, budgeted: 10.20, actual: 9.42, realized: 9.05, collection: 88.7, ldExposure: 0.42, shortfall: 1.15, status: "warning" },
  { vendor: "SunPower Tech", plants: "Sangli, Wardha, Buldhana, Chandrapur", plantCount: 4, capacity: 63.0, budgeted: 12.65, actual: 11.45, realized: 10.92, collection: 86.3, ldExposure: 0.54, shortfall: 1.73, status: "critical" },
  { vendor: "Mega Solar Inc", plants: "Beed, Devdaithan, Bhandara", plantCount: 3, capacity: 56.0, budgeted: 11.52, actual: 10.88, realized: 10.45, collection: 90.7, ldExposure: 0.55, shortfall: 1.07, status: "warning" },
  { vendor: "Green Energy Ltd", plants: "Osmanabad", plantCount: 1, capacity: 30.0, budgeted: 4.44, actual: 4.38, realized: 4.30, collection: 96.8, ldExposure: 0.00, shortfall: 0.14, status: "healthy" },
  { vendor: "TechSolar Pvt", plants: "Latur", plantCount: 1, capacity: 20.0, budgeted: 3.60, actual: 3.52, realized: 3.45, collection: 95.8, ldExposure: 0.00, shortfall: 0.15, status: "healthy" },
];

const vendorInvoiceData = [
  {
    vendor: "SolarCo India", color: "#2955A0",
    plants: [
      { name: "Sakri Solar Park", district: "Dhule", capacity: 25.0, invoices: 5, paid: 3, partiallyPaid: 1, pending: 1, overdue: 0, disputed: 0, amount: 1.62, collected: 1.38 },
      { name: "Ahmednagar Solar Plant", district: "Ahmednagar", capacity: 12.0, invoices: 4, paid: 2, partiallyPaid: 1, pending: 1, overdue: 0, disputed: 0, amount: 1.24, collected: 1.02 },
      { name: "Amravati Solar Unit", district: "Amravati", capacity: 14.0, invoices: 3, paid: 1, partiallyPaid: 1, pending: 1, overdue: 0, disputed: 0, amount: 0.88, collected: 0.58 },
    ],
  },
  {
    vendor: "SunPower Tech", color: "#ef4444",
    plants: [
      { name: "Sangli Solar Farm", district: "Sangli", capacity: 15.0, invoices: 5, paid: 2, partiallyPaid: 1, pending: 1, overdue: 1, disputed: 0, amount: 1.52, collected: 1.08 },
      { name: "Wardha Solar Park", district: "Wardha", capacity: 16.0, invoices: 4, paid: 2, partiallyPaid: 0, pending: 1, overdue: 1, disputed: 0, amount: 1.18, collected: 0.82 },
      { name: "Buldhana Solar Farm", district: "Buldhana", capacity: 10.0, invoices: 4, paid: 2, partiallyPaid: 1, pending: 0, overdue: 0, disputed: 1, amount: 1.15, collected: 0.88 },
      { name: "Chandrapur Solar Project", district: "Chandrapur", capacity: 22.0, invoices: 4, paid: 2, partiallyPaid: 0, pending: 1, overdue: 1, disputed: 0, amount: 0.98, collected: 0.68 },
    ],
  },
  {
    vendor: "Mega Solar Inc", color: "#f59e0b",
    plants: [
      { name: "Beed Solar Park", district: "Beed", capacity: 30.0, invoices: 5, paid: 3, partiallyPaid: 1, pending: 1, overdue: 0, disputed: 0, amount: 1.72, collected: 1.45 },
      { name: "Devdaithan Solar Plant", district: "Ahmednagar", capacity: 18.0, invoices: 5, paid: 3, partiallyPaid: 0, pending: 1, overdue: 1, disputed: 0, amount: 1.48, collected: 1.18 },
      { name: "Bhandara Solar Station", district: "Bhandara", capacity: 8.0, invoices: 4, paid: 2, partiallyPaid: 1, pending: 0, overdue: 0, disputed: 1, amount: 1.25, collected: 0.92 },
    ],
  },
  {
    vendor: "Green Energy Ltd", color: "#10b981",
    plants: [
      { name: "Osmanabad Solar Plant", district: "Osmanabad", capacity: 30.0, invoices: 5, paid: 4, partiallyPaid: 0, pending: 1, overdue: 0, disputed: 0, amount: 1.55, collected: 1.42 },
    ],
  },
  {
    vendor: "TechSolar Pvt", color: "#8b5cf6",
    plants: [
      { name: "Latur Solar Station", district: "Latur", capacity: 20.0, invoices: 6, paid: 4, partiallyPaid: 1, pending: 1, overdue: 0, disputed: 0, amount: 1.78, collected: 1.58 },
    ],
  },
];

const invoiceStatusColors = { paid: "#10b981", partiallyPaid: "#f59e0b", pending: "#6366f1", overdue: "#ef4444", disputed: "#8b5cf6" };

const quarterlyData = [
  { quarter: "Q1 (Apr–Jun 25)", budgeted: 7.80, actual: 7.28, realized: 7.07, shortfall: 0.73, collection: 90.4 },
  { quarter: "Q2 (Jul–Sep 25)", budgeted: 7.40, actual: 6.74, realized: 6.53, shortfall: 0.87, collection: 88.1 },
  { quarter: "Q3 (Oct–Dec 25)", budgeted: 7.90, actual: 7.48, realized: 7.28, shortfall: 0.62, collection: 92.1 },
  { quarter: "Q4 (Jan–Mar 26)", budgeted: 7.82, actual: 7.41, realized: 7.22, shortfall: 0.60, collection: 92.3 },
];

const FY_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const MONTH_OPTIONS = [
  { value: "all", label: "All Months (YTD)" },
  ...FY_MONTHS.map((m, i) => {
    const yr = i < 9 ? "25" : "26";
    return { value: `${m} ${yr}`, label: `${m} ${yr}` };
  }),
];

export function FinancialReports() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState("all");
  const [activeTab, setActiveTab] = useState("revenue-impact");
  const [revenueView, setRevenueView] = useState<"table" | "chart">("chart");
  const [expandedVendors, setExpandedVendors] = useState<string[]>([]);

  const plantOptions = useMemo(() => {
    if (selectedVendor === "all") return PLANTS;
    return PLANTS.filter(p => p.vendor === selectedVendor);
  }, [selectedVendor]);

  const handleVendorChange = (v: string) => {
    setSelectedVendor(v);
    if (v !== "all" && selectedPlant !== "all") {
      const plant = PLANTS.find(p => p.name === selectedPlant);
      if (plant && plant.vendor !== v) setSelectedPlant("all");
    }
  };

  const handlePlantChange = (p: string) => {
    setSelectedPlant(p);
    if (p !== "all" && selectedVendor === "all") {
      const plant = PLANTS.find(pl => pl.name === p);
      if (plant) setSelectedVendor(plant.vendor);
    }
  };

  const resetFilters = () => {
    setSelectedVendor("all");
    setSelectedMonth("all");
    setSelectedPlant("all");
  };

  const hasActiveFilter = selectedVendor !== "all" || selectedMonth !== "all" || selectedPlant !== "all";

  const capacityShare = useMemo(() => {
    const totalCap = PLANTS.reduce((s, p) => s + p.capacity, 0);
    if (selectedPlant !== "all") {
      const plant = PLANTS.find(p => p.name === selectedPlant);
      return plant ? plant.capacity / totalCap : 1;
    }
    if (selectedVendor !== "all") {
      const vendorCap = PLANTS.filter(p => p.vendor === selectedVendor).reduce((s, p) => s + p.capacity, 0);
      return vendorCap / totalCap;
    }
    return 1;
  }, [selectedVendor, selectedPlant]);

  const toggleVendor = (vendor: string) => {
    setExpandedVendors(prev => prev.includes(vendor) ? prev.filter(v => v !== vendor) : [...prev, vendor]);
  };

  const filteredMonthlyData = useMemo(() => {
    let data = monthlyRevenueData;
    if (selectedMonth !== "all") {
      data = data.filter(m => m.month === selectedMonth);
    }
    if (capacityShare < 1) {
      data = data.map(m => ({
        ...m,
        budgeted: +(m.budgeted * capacityShare).toFixed(3),
        expected: +(m.expected * capacityShare).toFixed(3),
        actual: +(m.actual * capacityShare).toFixed(3),
        realized: +(m.realized * capacityShare).toFixed(3),
        genMWh: Math.round(m.genMWh * capacityShare),
        gridLoss: +(m.gridLoss * capacityShare).toFixed(3),
        eqLoss: +(m.eqLoss * capacityShare).toFixed(3),
        weatherLoss: +(m.weatherLoss * capacityShare).toFixed(3),
        curtailmentLoss: +(m.curtailmentLoss * capacityShare).toFixed(3),
        otherLoss: +(m.otherLoss * capacityShare).toFixed(3),
        collection: m.collection,
      }));
    }
    return data;
  }, [selectedMonth, capacityShare]);

  const filteredVendorInvoice = useMemo(() => {
    let data = vendorInvoiceData;
    if (selectedVendor !== "all") {
      data = data.filter(v => v.vendor === selectedVendor);
    }
    if (selectedPlant !== "all") {
      data = data.map(v => ({
        ...v,
        plants: v.plants.filter(p => p.name === selectedPlant),
      })).filter(v => v.plants.length > 0);
    }
    return data;
  }, [selectedVendor, selectedPlant]);

  const filteredVendorRevenue = useMemo(() => {
    let data = vendorRevenueData;
    if (selectedVendor !== "all") {
      data = data.filter(v => v.vendor === selectedVendor);
    }
    return data;
  }, [selectedVendor]);

  const invoiceAggregates = useMemo(() => {
    const allPlants = filteredVendorInvoice.flatMap(v => v.plants);
    const totals = {
      invoices: allPlants.reduce((s, p) => s + p.invoices, 0),
      paid: allPlants.reduce((s, p) => s + p.paid, 0),
      partiallyPaid: allPlants.reduce((s, p) => s + p.partiallyPaid, 0),
      pending: allPlants.reduce((s, p) => s + p.pending, 0),
      overdue: allPlants.reduce((s, p) => s + p.overdue, 0),
      disputed: allPlants.reduce((s, p) => s + p.disputed, 0),
      amount: allPlants.reduce((s, p) => s + p.amount, 0),
      collected: allPlants.reduce((s, p) => s + p.collected, 0),
    };
    const paidAmt = +(totals.collected).toFixed(2);
    const totalUnpaid = +(totals.amount - totals.collected).toFixed(2);
    const partialAmt = +(totalUnpaid * (totals.partiallyPaid / Math.max(1, totals.partiallyPaid + totals.pending + totals.overdue + totals.disputed)) * 0.6).toFixed(2);
    const pendingAmt = +(totalUnpaid * (totals.pending / Math.max(1, totals.partiallyPaid + totals.pending + totals.overdue + totals.disputed))).toFixed(2);
    const overdueAmt = +(totalUnpaid * (totals.overdue / Math.max(1, totals.partiallyPaid + totals.pending + totals.overdue + totals.disputed))).toFixed(2);
    const disputedAmt = +(totalUnpaid - partialAmt - pendingAmt - overdueAmt).toFixed(2);
    const statusBreakdown = [
      { status: "Paid", count: totals.paid, amount: paidAmt, color: invoiceStatusColors.paid },
      { status: "Partially Paid", count: totals.partiallyPaid, amount: partialAmt, color: invoiceStatusColors.partiallyPaid },
      { status: "Pending", count: totals.pending, amount: pendingAmt, color: invoiceStatusColors.pending },
      { status: "Overdue", count: totals.overdue, amount: overdueAmt, color: invoiceStatusColors.overdue },
      { status: "Disputed", count: totals.disputed, amount: disputedAmt, color: invoiceStatusColors.disputed },
    ];
    return { ...totals, statusBreakdown };
  }, [filteredVendorInvoice]);

  const vendorSummaries = useMemo(() => {
    return filteredVendorInvoice.map(v => {
      const totals = v.plants.reduce((acc, p) => ({
        invoices: acc.invoices + p.invoices,
        paid: acc.paid + p.paid,
        partiallyPaid: acc.partiallyPaid + p.partiallyPaid,
        pending: acc.pending + p.pending,
        overdue: acc.overdue + p.overdue,
        disputed: acc.disputed + p.disputed,
        amount: acc.amount + p.amount,
        collected: acc.collected + p.collected,
      }), { invoices: 0, paid: 0, partiallyPaid: 0, pending: 0, overdue: 0, disputed: 0, amount: 0, collected: 0 });
      return { ...v, ...totals, collectionPct: totals.amount > 0 ? (totals.collected / totals.amount) * 100 : 0 };
    });
  }, [filteredVendorInvoice]);

  const ytdTotals = useMemo(() => {
    const data = filteredMonthlyData;
    return {
      budgeted: data.reduce((s, d) => s + d.budgeted, 0),
      expected: data.reduce((s, d) => s + d.expected, 0),
      actual: data.reduce((s, d) => s + d.actual, 0),
      realized: data.reduce((s, d) => s + d.realized, 0),
      totalGen: data.reduce((s, d) => s + d.genMWh, 0),
      avgCollection: data.length > 0 ? data.reduce((s, d) => s + d.collection, 0) / data.length : 0,
      gridLoss: data.reduce((s, d) => s + d.gridLoss, 0),
      eqLoss: data.reduce((s, d) => s + d.eqLoss, 0),
      weatherLoss: data.reduce((s, d) => s + d.weatherLoss, 0),
      curtailmentLoss: data.reduce((s, d) => s + d.curtailmentLoss, 0),
      otherLoss: data.reduce((s, d) => s + d.otherLoss, 0),
    };
  }, [filteredMonthlyData]);

  const totalShortfall = ytdTotals.budgeted - ytdTotals.realized;
  const totalLossBreakdown = [
    { category: "Grid Unavailability", value: ytdTotals.gridLoss, color: "#ef4444", icon: Zap },
    { category: "Equipment Downtime", value: ytdTotals.eqLoss, color: "#f59e0b", icon: Wrench },
    { category: "Weather / Irradiance", value: ytdTotals.weatherLoss, color: "#6366f1", icon: CloudRain },
    { category: "Curtailment", value: ytdTotals.curtailmentLoss, color: "#0ea5e9", icon: ShieldAlert },
    { category: "Other Losses", value: ytdTotals.otherLoss, color: "#84cc16", icon: Info },
  ];
  const totalLoss = totalLossBreakdown.reduce((s, d) => s + d.value, 0);

  const revenueWaterfallSteps = [
    { name: "Budgeted", value: ytdTotals.budgeted, fill: "#94a3b8", type: "total" },
    { name: "Grid Loss", value: -ytdTotals.gridLoss, fill: "#ef4444", type: "loss" },
    { name: "Equip. Loss", value: -ytdTotals.eqLoss, fill: "#f59e0b", type: "loss" },
    { name: "Weather", value: -ytdTotals.weatherLoss, fill: "#6366f1", type: "loss" },
    { name: "Curtailment", value: -ytdTotals.curtailmentLoss, fill: "#0ea5e9", type: "loss" },
    { name: "Other", value: -ytdTotals.otherLoss, fill: "#84cc16", type: "loss" },
    { name: "Collection Gap", value: -(ytdTotals.actual - ytdTotals.realized), fill: "#8b5cf6", type: "loss" },
    { name: "Realized", value: ytdTotals.realized, fill: "#2955A0", type: "total" },
  ];

  const invoiceTotal = invoiceAggregates.amount;
  const filterScopeLabel = selectedPlant !== "all" ? selectedPlant : selectedVendor !== "all" ? selectedVendor : "All Plants";

  return (
    <div ref={pageRef} className="flex-1 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Financial Reports</h1>
                <p className="text-xs text-slate-600 mt-0.5">Revenue tracking, loss attribution, invoicing & collection analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                Last Updated: 07-Apr-2026
              </Badge>
              <PageExportMenu pageTitle="Financial Reports" contentRef={pageRef} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Filters:</span>
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
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[155px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVendor} onValueChange={handleVendorChange}>
              <SelectTrigger className="w-[160px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {VENDORS.map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPlant} onValueChange={handlePlantChange}>
              <SelectTrigger className="w-[195px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants ({plantOptions.length})</SelectItem>
                {plantOptions.map(p => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} · {p.capacity} MW
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100"
              >
                ✕ Reset
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[
            { label: "YTD Budgeted Revenue", value: `₹${ytdTotals.budgeted.toFixed(2)} Cr`, sub: `${filteredMonthlyData.length} months`, icon: Target, color: "bg-slate-100 text-slate-600" },
            { label: "YTD Realized Revenue", value: `₹${ytdTotals.realized.toFixed(2)} Cr`, sub: `${ytdTotals.budgeted > 0 ? ((ytdTotals.realized / ytdTotals.budgeted) * 100).toFixed(1) : "0.0"}% of budget`, icon: Wallet, color: "bg-[#2955A0]/10 text-[#2955A0]" },
            { label: "Revenue Shortfall", value: `₹${totalShortfall.toFixed(2)} Cr`, sub: `${ytdTotals.budgeted > 0 ? ((totalShortfall / ytdTotals.budgeted) * 100).toFixed(1) : "0.0"}% gap`, icon: TrendingDown, color: "bg-rose-50 text-rose-600" },
            { label: "Avg Collection Rate", value: `${ytdTotals.avgCollection.toFixed(1)}%`, sub: ytdTotals.avgCollection >= 92 ? "On Track" : "Below Target", icon: Receipt, color: ytdTotals.avgCollection >= 92 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600" },
            { label: "Revenue per MW", value: `₹${((PLANTS.reduce((s, p) => s + p.capacity, 0) * capacityShare) > 0 ? (ytdTotals.realized / (PLANTS.reduce((s, p) => s + p.capacity, 0) * capacityShare / 1000)).toFixed(1) : "0.0")} L`, sub: selectedPlant !== "all" ? selectedPlant : "Portfolio average", icon: CircleDollarSign, color: "bg-violet-50 text-violet-600" },
            { label: "Total LD Exposure", value: `₹${filteredVendorRevenue.reduce((s, v) => s + v.ldExposure, 0).toFixed(2)} Cr`, sub: `${filteredVendorRevenue.filter(v => v.ldExposure > 0).length} vendors at risk`, icon: Scale, color: "bg-orange-50 text-orange-600" },
          ].map((kpi) => (
            <Card key={kpi.label} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${kpi.color}`}>
                    <kpi.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border-2 border-slate-200 p-1 shadow-sm">
            <TabsTrigger value="revenue-impact" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" /> Revenue Impact MoM
            </TabsTrigger>
            <TabsTrigger value="loss-attribution" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <PieChartIcon className="w-3.5 h-3.5" /> Loss Attribution
            </TabsTrigger>
            <TabsTrigger value="vendor-revenue" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Vendor Revenue
            </TabsTrigger>
            <TabsTrigger value="invoicing" className="data-[state=active]:bg-[#2955A0] data-[state=active]:text-white text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Invoicing & Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue-impact" className="mt-4 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-8 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#2955A0]" />
                    Monthly Revenue Impact — Budgeted vs Realized (₹ Cr)
                  </CardTitle>
                  <CardDescription>Month-wise revenue tracking with budget variance — {selectedFY}{hasActiveFilter ? ` · ${filterScopeLabel}` : ""}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={340}>
                    <ComposedChart data={filteredMonthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
                              <p className="font-bold text-slate-800 mb-2">{label}</p>
                              {payload.map((p) => (
                                <div key={p.name} className="flex justify-between gap-4 py-0.5">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                                    {p.name}
                                  </span>
                                  <span className="font-semibold">₹{Number(p.value).toFixed(2)} Cr</span>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="budgeted" name="Budgeted" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="realized" name="Realized" fill="#2955A0" radius={[4, 4, 0, 0]} barSize={20} />
                      <Line type="monotone" dataKey="actual" name="Actual" stroke="#E8A800" strokeWidth={2} dot={{ r: 3, fill: "#E8A800" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-4 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                    Revenue Shortfall Analysis
                  </CardTitle>
                  <CardDescription>Where budget vs realization gap occurs</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {filteredMonthlyData.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">No data matches current filters</div>
                  ) : filteredMonthlyData.slice(-5).reverse().map((m) => {
                    const gap = m.budgeted - m.realized;
                    const gapPct = m.budgeted > 0 ? (gap / m.budgeted) * 100 : 0;
                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <div className="w-14 text-xs font-semibold text-slate-700">{m.month}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-500">₹{m.realized.toFixed(2)} / ₹{m.budgeted.toFixed(2)} Cr</span>
                            <span className={`font-bold ${gapPct > 8 ? "text-rose-600" : gapPct > 5 ? "text-amber-600" : "text-emerald-600"}`}>
                              -{gapPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#2955A0]"
                              style={{ width: `${m.budgeted > 0 ? (m.realized / m.budgeted) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      YTD Shortfall Summary
                    </div>
                    <p className="text-xl font-bold text-amber-900">₹{totalShortfall.toFixed(2)} Cr</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      {ytdTotals.budgeted > 0 ? ((totalShortfall / ytdTotals.budgeted) * 100).toFixed(1) : "0.0"}% below annual budget · Projected annual gap: ₹{(filteredMonthlyData.length > 0 ? totalShortfall * (12 / filteredMonthlyData.length) : 0).toFixed(2)} Cr
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-[#2955A0]" />
                      Month-wise Revenue Detail
                    </CardTitle>
                    <CardDescription>Complete financial breakdown for each month — {selectedFY}{hasActiveFilter ? ` · ${filterScopeLabel}` : ""}</CardDescription>
                  </div>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setRevenueView("chart")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${revenueView === "chart" ? "bg-[#2955A0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" /> Chart
                    </button>
                    <button
                      onClick={() => setRevenueView("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${revenueView === "table" ? "bg-[#2955A0] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <Table2 className="w-3.5 h-3.5" /> Table
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={revenueView === "table" ? "p-0" : "pt-4"}>
                {revenueView === "chart" ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Revenue Pipeline — Budget → Expected → Actual → Realized (₹Cr)</p>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={filteredMonthlyData.map((m, idx) => {
                          const prev = idx > 0 ? filteredMonthlyData[idx - 1].realized : m.realized;
                          return { ...m, shortfall: +(m.budgeted - m.realized).toFixed(2), momChange: prev > 0 ? +((m.realized - prev) / prev * 100).toFixed(1) : 0, shortfallPct: m.budgeted > 0 ? +((m.budgeted - m.realized) / m.budgeted * 100).toFixed(1) : 0 };
                        })} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="revenue" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                          <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[75, 100]} />
                          <RechartsTooltip content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0]?.payload;
                            return (
                              <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[200px]">
                                <p className="font-bold text-slate-800 mb-2 pb-1.5 border-b border-slate-100">{label}</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between"><span className="text-slate-400">Generation</span><span className="font-semibold">{d?.genMWh?.toLocaleString("en-IN")} MWh</span></div>
                                  <div className="flex justify-between"><span className="text-slate-400">Budgeted</span><span className="font-semibold text-slate-600">₹{d?.budgeted?.toFixed(2)} Cr</span></div>
                                  <div className="flex justify-between"><span className="text-slate-400">Expected</span><span className="font-semibold text-violet-600">₹{d?.expected?.toFixed(2)} Cr</span></div>
                                  <div className="flex justify-between"><span className="text-slate-400">Actual</span><span className="font-bold text-[#E8A800]">₹{d?.actual?.toFixed(2)} Cr</span></div>
                                  <div className="flex justify-between"><span className="text-slate-400">Realized</span><span className="font-bold text-[#2955A0]">₹{d?.realized?.toFixed(2)} Cr</span></div>
                                  <div className="flex justify-between pt-1 border-t border-slate-100"><span className="text-slate-400">Shortfall</span><span className="font-bold text-rose-600">₹{d?.shortfall?.toFixed(2)} Cr ({d?.shortfallPct}%)</span></div>
                                  <div className="flex justify-between"><span className="text-slate-400">Collection</span><span className={`font-bold ${d?.collection >= 93 ? "text-emerald-600" : d?.collection >= 88 ? "text-amber-600" : "text-rose-600"}`}>{d?.collection?.toFixed(1)}%</span></div>
                                  {d?.momChange !== undefined && (
                                    <div className="flex justify-between"><span className="text-slate-400">MoM Change</span><span className={`font-bold ${d.momChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{d.momChange >= 0 ? "+" : ""}{d.momChange}%</span></div>
                                  )}
                                </div>
                              </div>
                            );
                          }} />
                          <Bar yAxisId="revenue" dataKey="budgeted" name="Budgeted" fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={14} />
                          <Bar yAxisId="revenue" dataKey="expected" name="Expected" fill="#c4b5fd" radius={[3, 3, 0, 0]} barSize={14} />
                          <Bar yAxisId="revenue" dataKey="actual" name="Actual" fill="#E8A800" radius={[3, 3, 0, 0]} barSize={14} opacity={0.8} />
                          <Bar yAxisId="revenue" dataKey="realized" name="Realized" fill="#2955A0" radius={[3, 3, 0, 0]} barSize={14} />
                          <Line yAxisId="pct" type="monotone" dataKey="collection" name="Collection %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
                          <Legend wrapperStyle={{ fontSize: "10px" }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Shortfall Trend (₹Cr) & Shortfall % of Budget</p>
                        <ResponsiveContainer width="100%" height={200}>
                          <ComposedChart data={filteredMonthlyData.map(m => ({
                            month: m.month,
                            shortfall: +(m.budgeted - m.realized).toFixed(2),
                            shortfallPct: +((m.budgeted - m.realized) / m.budgeted * 100).toFixed(1),
                          }))} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="val" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                            <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <RechartsTooltip content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0]?.payload;
                              return (
                                <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 text-xs">
                                  <p className="font-bold text-slate-800 mb-1">{label}</p>
                                  <p className="text-slate-500">Shortfall: <span className="font-bold text-rose-600">₹{d?.shortfall} Cr</span></p>
                                  <p className="text-slate-500">% of Budget: <span className="font-bold text-orange-600">{d?.shortfallPct}%</span></p>
                                </div>
                              );
                            }} />
                            <Bar yAxisId="val" dataKey="shortfall" name="Shortfall (₹Cr)" radius={[3, 3, 0, 0]} barSize={20}>
                              {filteredMonthlyData.map((m, i) => {
                                const pct = m.budgeted > 0 ? (m.budgeted - m.realized) / m.budgeted * 100 : 0;
                                return <Cell key={i} fill={pct > 12 ? "#ef4444" : pct > 8 ? "#f59e0b" : "#10b981"} opacity={0.75} />;
                              })}
                            </Bar>
                            <Line yAxisId="pct" type="monotone" dataKey="shortfallPct" name="Shortfall %" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#ef4444", stroke: "#fff", strokeWidth: 1.5 }} />
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Generation (MWh) & MoM Realized Change (%)</p>
                        <ResponsiveContainer width="100%" height={200}>
                          <ComposedChart data={filteredMonthlyData.map((m, idx) => {
                            const prev = idx > 0 ? filteredMonthlyData[idx - 1].realized : m.realized;
                            return { month: m.month, genMWh: m.genMWh, momChange: idx === 0 || prev === 0 ? 0 : +((m.realized - prev) / prev * 100).toFixed(1) };
                          })} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="gen" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                            <YAxis yAxisId="mom" orientation="right" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <RechartsTooltip content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0]?.payload;
                              return (
                                <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 text-xs">
                                  <p className="font-bold text-slate-800 mb-1">{label}</p>
                                  <p className="text-slate-500">Generation: <span className="font-bold text-[#2955A0]">{d?.genMWh?.toLocaleString("en-IN")} MWh</span></p>
                                  <p className="text-slate-500">MoM Change: <span className={`font-bold ${d?.momChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{d?.momChange >= 0 ? "+" : ""}{d?.momChange}%</span></p>
                                </div>
                              );
                            }} />
                            <Area yAxisId="gen" type="monotone" dataKey="genMWh" name="Generation (MWh)" fill="#2955A0" fillOpacity={0.1} stroke="#2955A0" strokeWidth={2} />
                            <Bar yAxisId="mom" dataKey="momChange" name="MoM Change %" radius={[3, 3, 0, 0]} barSize={16}>
                              {filteredMonthlyData.map((_, i) => {
                                const prev = i > 0 ? filteredMonthlyData[i - 1].realized : filteredMonthlyData[i].realized;
                                const ch = i === 0 || prev === 0 ? 0 : (filteredMonthlyData[i].realized - prev) / prev * 100;
                                return <Cell key={i} fill={ch >= 0 ? "#10b981" : "#ef4444"} opacity={0.6} />;
                              })}
                            </Bar>
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className={`grid gap-1 px-1 ${filteredMonthlyData.length <= 1 ? "grid-cols-1" : filteredMonthlyData.length <= 4 ? "grid-cols-4" : filteredMonthlyData.length <= 6 ? "grid-cols-6" : "grid-cols-12"}`}>
                      {filteredMonthlyData.map((m) => {
                        const shortfall = m.budgeted - m.realized;
                        const shortfallPct = m.budgeted > 0 ? (shortfall / m.budgeted) * 100 : 0;
                        const realizePct = m.budgeted > 0 ? (m.realized / m.budgeted) * 100 : 0;
                        return (
                          <div key={m.month} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-700 mb-1">{m.month.split(" ")[0]}</p>
                            <p className="text-[8px] text-slate-400">{(m.genMWh / 1000).toFixed(1)}k MWh</p>
                            <div className="mt-1.5 space-y-0.5">
                              <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                                <div className="h-full rounded-full bg-[#2955A0]" style={{ width: `${realizePct}%` }} />
                              </div>
                            </div>
                            <p className={`text-[8px] font-bold mt-1 ${shortfallPct > 10 ? "text-rose-600" : shortfallPct > 6 ? "text-amber-600" : "text-emerald-600"}`}>{realizePct.toFixed(0)}%</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between bg-[#2955A0]/5 rounded-lg p-3 border border-[#2955A0]/10">
                      <div className="flex items-center gap-6">
                        <div><p className="text-[9px] text-slate-400 uppercase">YTD Generation</p><p className="text-sm font-bold text-slate-800">{ytdTotals.totalGen.toLocaleString("en-IN")} MWh</p></div>
                        <div><p className="text-[9px] text-slate-400 uppercase">YTD Budgeted</p><p className="text-sm font-bold text-slate-600">₹{ytdTotals.budgeted.toFixed(2)} Cr</p></div>
                        <div><p className="text-[9px] text-slate-400 uppercase">YTD Realized</p><p className="text-sm font-bold text-[#2955A0]">₹{ytdTotals.realized.toFixed(2)} Cr</p></div>
                        <div><p className="text-[9px] text-slate-400 uppercase">YTD Shortfall</p><p className="text-sm font-bold text-rose-600">₹{totalShortfall.toFixed(2)} Cr</p></div>
                        <div><p className="text-[9px] text-slate-400 uppercase">Avg Collection</p><p className="text-sm font-bold text-emerald-600">{ytdTotals.avgCollection.toFixed(1)}%</p></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-3 font-semibold text-slate-700 text-xs">Month</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Gen (MWh)</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Budgeted (₹Cr)</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Expected (₹Cr)</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Actual (₹Cr)</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Realized (₹Cr)</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Shortfall</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-700 text-xs">Collection %</th>
                          <th className="text-center px-4 py-3 font-semibold text-slate-700 text-xs">MoM Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMonthlyData.map((m, idx) => {
                          const shortfall = m.budgeted - m.realized;
                          const shortfallPct = m.budgeted > 0 ? (shortfall / m.budgeted) * 100 : 0;
                          const prevRealized = idx > 0 ? filteredMonthlyData[idx - 1].realized : m.realized;
                          const momChange = prevRealized > 0 ? ((m.realized - prevRealized) / prevRealized) * 100 : 0;
                          return (
                            <tr key={m.month} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                              <td className="px-4 py-2.5 font-semibold text-slate-800 text-xs">{m.month}</td>
                              <td className="px-4 py-2.5 text-right text-xs text-slate-600">{m.genMWh.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-2.5 text-right text-xs text-slate-500">₹{m.budgeted.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-xs text-slate-500">₹{m.expected.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-xs font-semibold text-[#E8A800]">₹{m.actual.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-xs font-bold text-[#2955A0]">₹{m.realized.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right">
                                <span className={`text-xs font-bold ${shortfallPct > 8 ? "text-rose-600" : shortfallPct > 5 ? "text-amber-600" : "text-emerald-600"}`}>
                                  ₹{shortfall.toFixed(2)} ({shortfallPct.toFixed(1)}%)
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <Badge className={`text-[10px] ${m.collection >= 93 ? "bg-emerald-100 text-emerald-700" : m.collection >= 88 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                                  {m.collection.toFixed(1)}%
                                </Badge>
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                {idx === 0 ? (
                                  <span className="text-slate-300 text-xs">—</span>
                                ) : momChange >= 0 ? (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                                    <ArrowUpRight className="w-3 h-3" />+{momChange.toFixed(1)}%
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                                    <ArrowDownRight className="w-3 h-3" />{momChange.toFixed(1)}%
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#2955A0]/5 border-t-2 border-[#2955A0]/20 font-bold">
                          <td className="px-4 py-3 text-xs text-slate-800">YTD Total</td>
                          <td className="px-4 py-3 text-right text-xs text-slate-800">{ytdTotals.totalGen.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-right text-xs text-slate-700">₹{ytdTotals.budgeted.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-xs text-slate-700">₹{ytdTotals.expected.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-xs text-[#E8A800]">₹{ytdTotals.actual.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-xs text-[#2955A0]">₹{ytdTotals.realized.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-xs text-rose-600">₹{totalShortfall.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-xs">{ytdTotals.avgCollection.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-center text-xs text-slate-400">—</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2955A0]" />
                  Quarterly Revenue Summary
                </CardTitle>
                <CardDescription>Quarter-wise aggregated revenue performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-4 gap-4">
                  {quarterlyData.map((q) => {
                    const scaledBudgeted = q.budgeted * capacityShare;
                    const scaledRealized = q.realized * capacityShare;
                    const gapPct = scaledBudgeted > 0 ? ((scaledBudgeted - scaledRealized) / scaledBudgeted) * 100 : 0;
                    return (
                      <div key={q.quarter} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-bold text-slate-800 mb-3">{q.quarter}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Budgeted</span>
                            <span className="font-semibold text-slate-700">₹{scaledBudgeted.toFixed(2)} Cr</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Realized</span>
                            <span className="font-bold text-[#2955A0]">₹{scaledRealized.toFixed(2)} Cr</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#2955A0]" style={{ width: `${scaledBudgeted > 0 ? (scaledRealized / scaledBudgeted) * 100 : 0}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className={`font-bold ${gapPct > 8 ? "text-rose-600" : "text-amber-600"}`}>-{gapPct.toFixed(1)}% gap</span>
                            <Badge className={`text-[9px] ${q.collection >= 92 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{q.collection.toFixed(1)}% coll.</Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loss-attribution" className="mt-4 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-7 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#2955A0]" />
                    Revenue Waterfall — Budget to Realization
                  </CardTitle>
                  <CardDescription>Step-by-step flow showing where revenue was lost — {selectedFY}{hasActiveFilter ? ` · ${filterScopeLabel}` : ""}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={revenueWaterfallSteps} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0]?.payload;
                          return (
                            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                              <p className="font-bold text-slate-800 mb-1">{d?.name}</p>
                              <p className="text-slate-600">
                                {d?.type === "total" ? "Total: " : "Loss: "}₹{Math.abs(Number(d?.value)).toFixed(2)} Cr
                              </p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {revenueWaterfallSteps.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-5 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-[#2955A0]" />
                    Revenue Loss Breakdown
                  </CardTitle>
                  <CardDescription>₹{totalLoss.toFixed(2)} Cr total losses by category</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {totalLossBreakdown.map((item) => {
                      const pct = totalLoss > 0 ? (item.value / totalLoss) * 100 : 0;
                      return (
                        <div key={item.category} className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg" style={{ backgroundColor: item.color + "15" }}>
                            <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-700">{item.category}</span>
                              <span className="font-bold text-slate-900">₹{item.value.toFixed(2)} Cr ({pct.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 mb-1">
                      <Info className="w-3.5 h-3.5" />
                      Key Insight
                    </div>
                    <p className="text-[11px] text-blue-700">
                      {(() => {
                        const sorted = [...totalLossBreakdown].sort((a, b) => b.value - a.value);
                        const top = sorted[0];
                        return totalLoss > 0
                          ? `${top.category} accounts for the largest revenue impact at ₹${top.value.toFixed(2)} Cr (${((top.value / totalLoss) * 100).toFixed(0)}%). ${top.category === "Weather / Irradiance" ? "Monsoon months (Jun-Aug) show 2.5x higher weather losses vs dry season." : `Focus on ${top.category.toLowerCase()} mitigation to reduce shortfall.`}`
                          : "No losses recorded for the current filter selection.";
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#2955A0]" />
                  Month-wise Revenue Loss Stacked View
                </CardTitle>
                <CardDescription>How each loss category impacts monthly revenue — {selectedFY}{hasActiveFilter ? ` · ${filterScopeLabel}` : ""}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredMonthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
                            <p className="font-bold text-slate-800 mb-2">{label}</p>
                            {payload.map((p) => (
                              <div key={p.name} className="flex justify-between gap-4 py-0.5">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                                  {p.name}
                                </span>
                                <span className="font-semibold">₹{Number(p.value).toFixed(2)} Cr</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="gridLoss" name="Grid Loss" stackId="loss" fill="#ef4444" />
                    <Bar dataKey="eqLoss" name="Equipment" stackId="loss" fill="#f59e0b" />
                    <Bar dataKey="weatherLoss" name="Weather" stackId="loss" fill="#6366f1" />
                    <Bar dataKey="curtailmentLoss" name="Curtailment" stackId="loss" fill="#0ea5e9" />
                    <Bar dataKey="otherLoss" name="Other" stackId="loss" fill="#84cc16" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendor-revenue" className="mt-4 space-y-6">

            {(() => {
              const vendorColors: Record<string, string> = {
                "SolarCo India": "#2955A0",
                "SunPower Tech": "#ef4444",
                "Mega Solar Inc": "#f59e0b",
                "Green Energy Ltd": "#10b981",
                "TechSolar Pvt": "#8b5cf6",
              };
              const vendorBarData = filteredVendorRevenue.map(v => ({
                name: v.vendor.split(" ").slice(0, 2).join(" "),
                fullName: v.vendor,
                budgeted: v.budgeted,
                realized: v.realized,
                shortfall: v.shortfall,
                collection: v.collection,
                ldExposure: v.ldExposure,
              }));

              return (
                <>
                  <Card className="border-2 border-slate-200">
                    <CardHeader className="border-b border-slate-100 pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-[#2955A0]" />
                        Vendor Revenue — Budgeted vs Realized
                      </CardTitle>
                      <CardDescription>Side-by-side comparison with shortfall gap — {selectedFY}{hasActiveFilter ? ` · ${filterScopeLabel}` : ""}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={vendorBarData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                          <RechartsTooltip content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0]?.payload;
                            return (
                              <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                                <p className="font-bold text-slate-800 mb-1">{d?.fullName}</p>
                                <p className="text-slate-500">Budgeted: <span className="font-bold text-slate-800">₹{d?.budgeted?.toFixed(2)} Cr</span></p>
                                <p className="text-slate-500">Realized: <span className="font-bold text-[#2955A0]">₹{d?.realized?.toFixed(2)} Cr</span></p>
                                <p className="text-slate-500">Shortfall: <span className="font-bold text-rose-600">₹{d?.shortfall?.toFixed(2)} Cr</span></p>
                                <p className="text-slate-500">Collection: <span className="font-bold">{d?.collection?.toFixed(1)}%</span></p>
                              </div>
                            );
                          }} />
                          <Bar dataKey="budgeted" name="Budgeted" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={36} />
                          <Bar dataKey="realized" name="Realized" radius={[4, 4, 0, 0]} barSize={36}>
                            {vendorBarData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={vendorColors[filteredVendorRevenue[index].vendor] || "#2955A0"} />
                            ))}
                          </Bar>
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className={`grid gap-4 ${filteredVendorRevenue.length <= 2 ? "grid-cols-2" : filteredVendorRevenue.length <= 3 ? "grid-cols-3" : "grid-cols-5"}`}>
                    {filteredVendorRevenue.map((v) => {
                      const realizePct = v.budgeted > 0 ? (v.realized / v.budgeted * 100) : 0;
                      const color = vendorColors[v.vendor] || "#94a3b8";
                      return (
                        <Card key={v.vendor} className="border border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                              <span className="text-xs font-bold text-slate-800 truncate">{v.vendor}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Budgeted</span>
                                <span className="font-semibold text-slate-700">₹{v.budgeted.toFixed(2)} Cr</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Realized</span>
                                <span className="font-bold" style={{ color }}>₹{v.realized.toFixed(2)} Cr</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Shortfall</span>
                                <span className={`font-bold ${v.shortfall > 1 ? "text-rose-600" : "text-amber-600"}`}>₹{v.shortfall.toFixed(2)} Cr</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Collection</span>
                                <span className={`font-bold ${v.collection >= 93 ? "text-emerald-600" : v.collection >= 88 ? "text-amber-600" : "text-rose-600"}`}>{v.collection}%</span>
                              </div>
                              {v.ldExposure > 0 && (
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">LD Exposure</span>
                                  <span className="font-bold text-orange-600">₹{v.ldExposure.toFixed(2)} Cr</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100">
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${realizePct}%`, backgroundColor: color }} />
                              </div>
                              <div className="text-[9px] text-slate-400 mt-1 text-center">{realizePct.toFixed(1)}% realized</div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Info className="w-4 h-4 text-[#2955A0] flex-shrink-0" />
                    <p className="text-[11px] text-slate-600">
                      For detailed vendor performance analytics (radar comparison, plant PR% vs CUF% quadrant, and plant ranking), visit <span className="font-bold text-[#2955A0]">Site & Portfolio Management → Performance Analytics</span>.
                    </p>
                  </div>
                </>
              );
            })()}

          </TabsContent>

          <TabsContent value="invoicing" className="mt-4 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="border-2 border-slate-200">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Invoices</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{invoiceAggregates.invoices}</p>
                  <p className="text-[10px] text-slate-500">₹{invoiceAggregates.amount.toFixed(2)} Cr raised</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-200 bg-emerald-50/30">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold">Paid Invoices</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{invoiceAggregates.paid}</p>
                  <p className="text-[10px] text-emerald-500">of {invoiceAggregates.invoices} total invoices</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-amber-200 bg-amber-50/30">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold">Partial + Pending</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">{invoiceAggregates.partiallyPaid + invoiceAggregates.pending}</p>
                  <p className="text-[10px] text-amber-500">{invoiceAggregates.partiallyPaid} partial, {invoiceAggregates.pending} pending</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-rose-200 bg-rose-50/30">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] text-rose-600 uppercase tracking-wider font-semibold">Overdue + Disputed</p>
                  <p className="text-2xl font-bold text-rose-700 mt-1">{invoiceAggregates.overdue + invoiceAggregates.disputed}</p>
                  <p className="text-[10px] text-rose-500">{invoiceAggregates.overdue} overdue, {invoiceAggregates.disputed} disputed</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200 bg-blue-50/30">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold">Invoice Collection</p>
                  <p className={`text-2xl font-bold mt-1 ${(invoiceAggregates.amount > 0 ? (invoiceAggregates.collected / invoiceAggregates.amount * 100) : 0) >= 92 ? "text-emerald-700" : "text-amber-700"}`}>
                    {invoiceAggregates.amount > 0 ? (invoiceAggregates.collected / invoiceAggregates.amount * 100).toFixed(1) : "0.0"}%
                  </p>
                  <p className="text-[10px] text-blue-500">₹{invoiceAggregates.collected.toFixed(2)} / ₹{invoiceAggregates.amount.toFixed(2)} Cr</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-5 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#2955A0]" />
                    YTD Invoice Status
                  </CardTitle>
                  <CardDescription>{invoiceAggregates.invoices} invoices · ₹{invoiceAggregates.amount.toFixed(2)} Cr total</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={invoiceAggregates.statusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {invoiceAggregates.statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0]?.payload;
                          return (
                            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                              <p className="font-bold text-slate-800">{d?.status}</p>
                              <p className="text-slate-600">{d?.count} invoices · ₹{d?.amount?.toFixed(2)} Cr</p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-1">
                    {invoiceAggregates.statusBreakdown.map((item) => (
                      <div key={item.status} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-600">{item.status}</span>
                        </span>
                        <span className="font-semibold text-slate-700">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-7 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#2955A0]" />
                    Vendor Invoice Comparison
                  </CardTitle>
                  <CardDescription>Stacked invoice status by vendor — click vendor below for plant details</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={vendorSummaries.map(v => ({
                      name: v.vendor.split(" ")[0],
                      vendor: v.vendor,
                      Paid: v.paid,
                      "Partial": v.partiallyPaid,
                      Pending: v.pending,
                      Overdue: v.overdue,
                      Disputed: v.disputed,
                      total: v.invoices,
                      collPct: v.collectionPct,
                    }))} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <RechartsTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        return (
                          <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[180px]">
                            <p className="font-bold text-slate-800 mb-2 pb-1.5 border-b border-slate-100">{d?.vendor}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between"><span className="text-slate-400">Total</span><span className="font-bold">{d?.total} invoices</span></div>
                              <div className="flex justify-between"><span style={{ color: invoiceStatusColors.paid }}>Paid</span><span className="font-semibold">{d?.Paid}</span></div>
                              <div className="flex justify-between"><span style={{ color: invoiceStatusColors.partiallyPaid }}>Partial</span><span className="font-semibold">{d?.Partial}</span></div>
                              <div className="flex justify-between"><span style={{ color: invoiceStatusColors.pending }}>Pending</span><span className="font-semibold">{d?.Pending}</span></div>
                              <div className="flex justify-between"><span style={{ color: invoiceStatusColors.overdue }}>Overdue</span><span className="font-semibold">{d?.Overdue}</span></div>
                              <div className="flex justify-between"><span style={{ color: invoiceStatusColors.disputed }}>Disputed</span><span className="font-semibold">{d?.Disputed}</span></div>
                              <div className="flex justify-between pt-1 border-t border-slate-100"><span className="text-slate-400">Collection</span><span className={`font-bold ${d?.collPct >= 92 ? "text-emerald-600" : d?.collPct >= 85 ? "text-amber-600" : "text-rose-600"}`}>{d?.collPct?.toFixed(1)}%</span></div>
                            </div>
                          </div>
                        );
                      }} />
                      <Bar dataKey="Paid" stackId="inv" fill={invoiceStatusColors.paid} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Partial" stackId="inv" fill={invoiceStatusColors.partiallyPaid} />
                      <Bar dataKey="Pending" stackId="inv" fill={invoiceStatusColors.pending} />
                      <Bar dataKey="Overdue" stackId="inv" fill={invoiceStatusColors.overdue} />
                      <Bar dataKey="Disputed" stackId="inv" fill={invoiceStatusColors.disputed} radius={[3, 3, 0, 0]} />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Factory className="w-4 h-4 text-[#2955A0]" />
                      Vendor & Plant-wise Invoice Tracker
                    </CardTitle>
                    <CardDescription>Expand each vendor to view plant-level invoice breakdown with district details</CardDescription>
                  </div>
                  <button
                    onClick={() => setExpandedVendors(expandedVendors.length === filteredVendorInvoice.length ? [] : filteredVendorInvoice.map(v => v.vendor))}
                    className="text-xs text-[#2955A0] hover:underline font-medium"
                  >
                    {expandedVendors.length === filteredVendorInvoice.length ? "Collapse All" : "Expand All"}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {vendorSummaries.map((v, vIdx) => {
                  const isExpanded = expandedVendors.includes(v.vendor);
                  const hasIssues = v.overdue > 0 || v.disputed > 0;
                  return (
                    <div key={v.vendor} className={vIdx < vendorSummaries.length - 1 ? "border-b border-slate-100" : ""}>
                      <button
                        onClick={() => toggleVendor(v.vendor)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-1 h-10 rounded-full" style={{ backgroundColor: v.color }} />
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-800">{v.vendor}</span>
                            {hasIssues && <Badge className="bg-rose-100 text-rose-700 text-[9px] px-1.5 py-0">{v.overdue + v.disputed} action needed</Badge>}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-slate-400">{v.plants.length} {v.plants.length === 1 ? "plant" : "plants"}</span>
                            <span className="text-[10px] text-slate-400">{v.invoices} invoices</span>
                            <span className="text-[10px] text-slate-400">₹{v.amount.toFixed(2)} Cr</span>
                          </div>
                        </div>
                        <div className="w-48 shrink-0">
                          <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100">
                            {v.paid > 0 && <div style={{ width: `${(v.paid / v.invoices) * 100}%`, backgroundColor: invoiceStatusColors.paid }} />}
                            {v.partiallyPaid > 0 && <div style={{ width: `${(v.partiallyPaid / v.invoices) * 100}%`, backgroundColor: invoiceStatusColors.partiallyPaid }} />}
                            {v.pending > 0 && <div style={{ width: `${(v.pending / v.invoices) * 100}%`, backgroundColor: invoiceStatusColors.pending }} />}
                            {v.overdue > 0 && <div style={{ width: `${(v.overdue / v.invoices) * 100}%`, backgroundColor: invoiceStatusColors.overdue }} />}
                            {v.disputed > 0 && <div style={{ width: `${(v.disputed / v.invoices) * 100}%`, backgroundColor: invoiceStatusColors.disputed }} />}
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[9px] text-emerald-600 font-medium">{v.paid} paid</span>
                            <span className="text-[9px] text-slate-400">{v.pending + v.partiallyPaid} in progress</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 w-20">
                          <p className={`text-sm font-bold ${v.collectionPct >= 92 ? "text-emerald-600" : v.collectionPct >= 85 ? "text-amber-600" : "text-rose-600"}`}>
                            {v.collectionPct.toFixed(1)}%
                          </p>
                          <p className="text-[9px] text-slate-400">collected</p>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-4 ml-6">
                          <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">Plant</th>
                                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">District</th>
                                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600">State</th>
                                  <th className="text-right px-3 py-2.5 font-semibold text-slate-600">Cap (MW)</th>
                                  <th className="text-right px-3 py-2.5 font-semibold text-slate-600"># Inv</th>
                                  <th className="text-center px-3 py-2.5 font-semibold text-emerald-600">Paid</th>
                                  <th className="text-center px-3 py-2.5 font-semibold text-amber-600">Partial</th>
                                  <th className="text-center px-3 py-2.5 font-semibold text-indigo-600">Pending</th>
                                  <th className="text-center px-3 py-2.5 font-semibold text-rose-600">Overdue</th>
                                  <th className="text-center px-3 py-2.5 font-semibold text-purple-600">Disputed</th>
                                  <th className="text-right px-3 py-2.5 font-semibold text-slate-600">Amt (₹Cr)</th>
                                  <th className="text-right px-3 py-2.5 font-semibold text-slate-600">Collected</th>
                                  <th className="text-right px-3 py-2.5 font-semibold text-slate-600">Coll %</th>
                                </tr>
                              </thead>
                              <tbody>
                                {v.plants.map((p, pIdx) => {
                                  const collPct = p.amount > 0 ? (p.collected / p.amount) * 100 : 0;
                                  return (
                                    <tr key={p.name} className={`border-b border-slate-50 hover:bg-slate-50/80 ${pIdx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                                      <td className="px-3 py-2 font-semibold text-slate-800 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.color }} />
                                        {p.name}
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">
                                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-300" />{p.district}</span>
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">Maharashtra</td>
                                      <td className="px-3 py-2 text-right text-slate-500">{p.capacity.toFixed(1)}</td>
                                      <td className="px-3 py-2 text-right font-semibold text-slate-700">{p.invoices}</td>
                                      <td className="px-3 py-2 text-center">
                                        {p.paid > 0 ? <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5">{p.paid}</Badge> : <span className="text-slate-300">—</span>}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {p.partiallyPaid > 0 ? <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5">{p.partiallyPaid}</Badge> : <span className="text-slate-300">—</span>}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {p.pending > 0 ? <Badge className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5">{p.pending}</Badge> : <span className="text-slate-300">—</span>}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {p.overdue > 0 ? <Badge className="bg-rose-100 text-rose-700 text-[10px] px-1.5">{p.overdue}</Badge> : <span className="text-slate-300">—</span>}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {p.disputed > 0 ? <Badge className="bg-purple-100 text-purple-700 text-[10px] px-1.5">{p.disputed}</Badge> : <span className="text-slate-300">—</span>}
                                      </td>
                                      <td className="px-3 py-2 text-right text-slate-600">₹{p.amount.toFixed(2)}</td>
                                      <td className="px-3 py-2 text-right font-semibold text-[#2955A0]">₹{p.collected.toFixed(2)}</td>
                                      <td className="px-3 py-2 text-right">
                                        <Badge className={`text-[10px] ${collPct >= 92 ? "bg-emerald-100 text-emerald-700" : collPct >= 85 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                                          {collPct.toFixed(1)}%
                                        </Badge>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="bg-slate-50/80 font-semibold border-t border-slate-200">
                                  <td className="px-3 py-2 text-slate-700" colSpan={3}>Vendor Total</td>
                                  <td className="px-3 py-2 text-right text-slate-500">{v.plants.reduce((s, p) => s + p.capacity, 0).toFixed(1)}</td>
                                  <td className="px-3 py-2 text-right text-slate-700">{v.invoices}</td>
                                  <td className="px-3 py-2 text-center text-emerald-700">{v.paid}</td>
                                  <td className="px-3 py-2 text-center text-amber-700">{v.partiallyPaid}</td>
                                  <td className="px-3 py-2 text-center text-indigo-700">{v.pending}</td>
                                  <td className="px-3 py-2 text-center text-rose-700">{v.overdue}</td>
                                  <td className="px-3 py-2 text-center text-purple-700">{v.disputed}</td>
                                  <td className="px-3 py-2 text-right text-slate-600">₹{v.amount.toFixed(2)}</td>
                                  <td className="px-3 py-2 text-right text-[#2955A0]">₹{v.collected.toFixed(2)}</td>
                                  <td className="px-3 py-2 text-right">
                                    <Badge className={`text-[10px] ${v.collectionPct >= 92 ? "bg-emerald-100 text-emerald-700" : v.collectionPct >= 85 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                                      {v.collectionPct.toFixed(1)}%
                                    </Badge>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid grid-cols-12 gap-6">
              <Card className="col-span-7 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#2955A0]" />
                    Collection Efficiency Trend
                  </CardTitle>
                  <CardDescription>Monthly revenue collection % (realized ÷ budgeted) vs 92% target</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={filteredMonthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[78, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                              <p className="font-bold text-slate-800 mb-1">{label}</p>
                              <p className="text-[#2955A0] font-semibold">Collection: {Number(payload[0]?.value).toFixed(1)}%</p>
                              <p className="text-slate-400 text-[10px]">Target: 92%</p>
                            </div>
                          );
                        }}
                      />
                      <defs>
                        <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2955A0" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2955A0" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="collection" stroke="#2955A0" strokeWidth={2.5} fill="url(#collGrad)" dot={{ r: 3, fill: "#2955A0", stroke: "#fff", strokeWidth: 2 }} />
                      <Line type="monotone" dataKey={() => 92} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="Target 92%" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-5 border-2 border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#2955A0]" />
                    Vendor Collection Scorecard
                  </CardTitle>
                  <CardDescription>Collection % vs 92% target by vendor</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {vendorSummaries.map((v) => (
                    <div key={v.vendor} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                          <span className="text-xs font-medium text-slate-700">{v.vendor}</span>
                        </div>
                        <span className={`text-xs font-bold ${v.collectionPct >= 92 ? "text-emerald-600" : v.collectionPct >= 85 ? "text-amber-600" : "text-rose-600"}`}>
                          {v.collectionPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${Math.min(v.collectionPct, 100)}%`,
                          backgroundColor: v.collectionPct >= 92 ? "#10b981" : v.collectionPct >= 85 ? "#f59e0b" : "#ef4444",
                        }} />
                        <div className="absolute top-0 bottom-0 w-px bg-rose-400" style={{ left: "92%" }} title="92% target" />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>₹{v.collected.toFixed(2)} / ₹{v.amount.toFixed(2)} Cr</span>
                        <span>{v.invoices} inv · {v.plants.length} {v.plants.length === 1 ? "plant" : "plants"}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800">Revenue Collection Policy</p>
                    <p className="text-sm mt-0.5 text-blue-700">
                      Invoices are raised monthly per JMR approval. Standard payment terms are <strong>Net 30 days</strong> from invoice date.
                      Invoices unpaid beyond 45 days are flagged as overdue. Disputed invoices require resolution within 60 days per PPA terms.
                      Collection targets: <strong>92% within 30 days</strong>, <strong>98% within 60 days</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
