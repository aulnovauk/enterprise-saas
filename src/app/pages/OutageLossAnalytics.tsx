import { useState, useRef, useMemo } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  AlertTriangle,
  Power,
  Wrench,
  Cloud,
  Filter,
  TrendingDown,
  TrendingUp,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TableIcon,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { CustomChartTooltip } from "../components/ChartTooltip";
import { initialJmrRecords } from "./JMRDataManagement";
import { PLANTS, VENDORS, TOTAL_CAPACITY } from "../data/plants";

// Downtime categorization data
const downtimeCategories = [
  { 
    id: "grid-outage",
    name: "Grid Outage", 
    incidents: 42, 
    hours: 156.5, 
    energyLoss: 1250, 
    color: "#EF4444",
    icon: Power,
  },
  { 
    id: "equipment-failure",
    name: "Equipment Failure", 
    incidents: 28, 
    hours: 98.3, 
    energyLoss: 890, 
    color: "#F59E0B",
    icon: AlertTriangle,
  },
  { 
    id: "planned-shutdown",
    name: "Planned Shutdown", 
    incidents: 15, 
    hours: 45.2, 
    energyLoss: 420, 
    color: "#10B981",
    icon: CheckCircle,
  },
  { 
    id: "force-majeure",
    name: "Force Majeure", 
    incidents: 8, 
    hours: 28.4, 
    energyLoss: 280, 
    color: "#6366F1",
    icon: Cloud,
  },
];

// Waterfall chart data: Budgeted → Expected → Actual → Evacuated
const waterfallData = [
  { name: "Budgeted Generation", value: 5200, cumulative: 5200, fill: "#2955A0" },
  { name: "Grid Curtailment", value: -180, cumulative: 5020, fill: "#EF4444" },
  { name: "Equipment Loss", value: -245, cumulative: 4775, fill: "#F59E0B" },
  { name: "Planned Shutdown", value: -125, cumulative: 4650, fill: "#10B981" },
  { name: "Force Majeure", value: -95, cumulative: 4555, fill: "#6366F1" },
  { name: "Expected Generation", value: 4555, cumulative: 4555, fill: "#2955A0" },
  { name: "Additional Loss", value: -70, cumulative: 4485, fill: "#DC2626" },
  { name: "Actual Generation", value: 4485, cumulative: 4485, fill: "#059669" },
  { name: "Auxiliary Consumption", value: -35, cumulative: 4450, fill: "#9333EA" },
  { name: "Net Evacuated", value: 4450, cumulative: 4450, fill: "#2955A0" },
];

// Loss bucketing table
const lossBuckets = [
  { 
    category: "Grid Outage Loss",
    budgeted: 150,
    actual: 180,
    variance: 30,
    variancePct: 20.0,
    impact: "high",
  },
  { 
    category: "Equipment Loss",
    budgeted: 200,
    actual: 245,
    variance: 45,
    variancePct: 22.5,
    impact: "high",
  },
  { 
    category: "Planned Shutdown",
    budgeted: 120,
    actual: 125,
    variance: 5,
    variancePct: 4.2,
    impact: "low",
  },
  { 
    category: "Force Majeure",
    budgeted: 80,
    actual: 95,
    variance: 15,
    variancePct: 18.8,
    impact: "medium",
  },
  { 
    category: "Auxiliary Consumption",
    budgeted: 40,
    actual: 35,
    variance: -5,
    variancePct: -12.5,
    impact: "positive",
  },
];

// MoM comparison data
const momData = [
  { month: "Aug", budgeted: 5100, actual: 4820, loss: 280 },
  { month: "Sep", budgeted: 5150, actual: 4890, loss: 260 },
  { month: "Oct", budgeted: 5200, actual: 4950, loss: 250 },
  { month: "Nov", budgeted: 5180, actual: 4910, loss: 270 },
  { month: "Dec", budgeted: 5220, actual: 4880, loss: 340 },
  { month: "Jan", budgeted: 5200, actual: 4920, loss: 280 },
  { month: "Feb", budgeted: 5200, actual: 4485, loss: 715 },
  { month: "Mar", budgeted: 5300, actual: 4950, loss: 350 },
];

// YoY comparison data
const yoyData = [
  { month: "Apr 2024", actual: 5050 },
  { month: "Apr 2025", actual: 5180 },
  { month: "Apr 2026", actual: 5210 },
];

// YTD monthly loss by category (Apr → Feb, FY 2025-26)
const ytdMonthlyLossData = [
  { month: "Apr", gridOutage: 95,  equipFailure: 68,  plannedShutdown: 35, forceMajeure: 15, spylTotal: 195 },
  { month: "May", gridOutage: 110, equipFailure: 72,  plannedShutdown: 42, forceMajeure: 18, spylTotal: 228 },
  { month: "Jun", gridOutage: 130, equipFailure: 85,  plannedShutdown: 38, forceMajeure: 22, spylTotal: 262 },
  { month: "Jul", gridOutage: 155, equipFailure: 92,  plannedShutdown: 45, forceMajeure: 28, spylTotal: 305 },
  { month: "Aug", gridOutage: 180, equipFailure: 98,  plannedShutdown: 50, forceMajeure: 32, spylTotal: 340 },
  { month: "Sep", gridOutage: 165, equipFailure: 88,  plannedShutdown: 38, forceMajeure: 25, spylTotal: 310 },
  { month: "Oct", gridOutage: 120, equipFailure: 75,  plannedShutdown: 45, forceMajeure: 20, spylTotal: 255 },
  { month: "Nov", gridOutage: 140, equipFailure: 82,  plannedShutdown: 38, forceMajeure: 22, spylTotal: 270 },
  { month: "Dec", gridOutage: 160, equipFailure: 95,  plannedShutdown: 55, forceMajeure: 30, spylTotal: 328 },
  { month: "Jan", gridOutage: 135, equipFailure: 78,  plannedShutdown: 40, forceMajeure: 22, spylTotal: 262 },
  { month: "Feb", gridOutage: 180, equipFailure: 110, plannedShutdown: 48, forceMajeure: 35, spylTotal: 310 },
  { month: "Mar", gridOutage: 145, equipFailure: 88,  plannedShutdown: 42, forceMajeure: 20, spylTotal: 282 },
];

// YTD summary vs Same Period Last Year (SPYL)
const ytdSummaryRows = [
  { category: "Grid Outage",       color: "#EF4444", ytdHours: 156.5, ytdMWh: 1250, revenue: "₹2.50 Cr", spylMWh: 1130, changePct: +10.6 },
  { category: "Equipment Failure", color: "#F59E0B", ytdHours:  98.3, ytdMWh:  890, revenue: "₹1.78 Cr", spylMWh:  798, changePct: +11.5 },
  { category: "Planned Shutdown",  color: "#10B981", ytdHours:  45.2, ytdMWh:  420, revenue: "₹0.84 Cr", spylMWh:  480, changePct: -12.5 },
  { category: "Force Majeure",     color: "#6366F1", ytdHours:  28.4, ytdMWh:  280, revenue: "₹0.56 Cr", spylMWh:  195, changePct: +43.6 },
];

// Pareto analysis (80/20 rule)
const paretoData = [
  { cause: "Grid Instability", incidents: 42, energyLoss: 1250, cumPct: 43.2 },
  { cause: "Inverter Failure", incidents: 18, energyLoss: 580, cumPct: 63.3 },
  { cause: "Transformer Issue", incidents: 10, energyLoss: 310, cumPct: 74.0 },
  { cause: "String Fault", incidents: 8, energyLoss: 245, cumPct: 82.5 },
  { cause: "Communication Loss", incidents: 6, energyLoss: 180, cumPct: 88.7 },
  { cause: "Weather", incidents: 8, energyLoss: 280, cumPct: 98.4 },
  { cause: "Others", incidents: 5, energyLoss: 45, cumPct: 100.0 },
];

// Gantt timeline data (last 7 days)
const ganttData = [
  { 
    date: "2026-02-22",
    events: [
      { id: 1, type: "Grid Outage", start: 8, duration: 3, plant: "Sakri Solar Park" },
      { id: 2, type: "Equipment Failure", start: 14, duration: 2, plant: "Osmanabad Solar Plant" },
    ]
  },
  { 
    date: "2026-02-23",
    events: [
      { id: 3, type: "Planned Shutdown", start: 10, duration: 6, plant: "Sangli Solar Farm" },
    ]
  },
  { 
    date: "2026-02-24",
    events: [
      { id: 4, type: "Force Majeure", start: 16, duration: 2, plant: "Latur Solar Station" },
      { id: 5, type: "Grid Outage", start: 6, duration: 4, plant: "Amravati Solar Unit" },
    ]
  },
  { 
    date: "2026-02-25",
    events: [
      { id: 6, type: "Equipment Failure", start: 12, duration: 5, plant: "Devdaithan Solar Plant" },
    ]
  },
  { 
    date: "2026-02-26",
    events: [
      { id: 7, type: "Grid Outage", start: 8, duration: 2, plant: "Wardha Solar Park" },
      { id: 8, type: "Equipment Failure", start: 14, duration: 4, plant: "Chandrapur Solar Project" },
    ]
  },
  { 
    date: "2026-02-27",
    events: []
  },
  { 
    date: "2026-02-28",
    events: [
      { id: 9, type: "Planned Shutdown", start: 9, duration: 8, plant: "Beed Solar Park" },
    ]
  },
];

const getEventColor = (type: string) => {
  switch (type) {
    case "Grid Outage": return "#EF4444";
    case "Equipment Failure": return "#F59E0B";
    case "Planned Shutdown": return "#10B981";
    case "Force Majeure": return "#6366F1";
    default: return "#6B7280";
  }
};

const CATEGORY_ID_MAP: Record<string, string> = {
  "grid": "grid-outage",
  "equipment": "equipment-failure",
  "planned": "planned-shutdown",
  "force-majeure": "force-majeure",
};

const CATEGORY_LOSS_KEY_MAP: Record<string, string> = {
  "grid-outage": "Grid Outage Loss",
  "equipment-failure": "Equipment Loss",
  "planned-shutdown": "Planned Shutdown",
  "force-majeure": "Force Majeure",
};

const CATEGORY_GANTT_MAP: Record<string, string> = {
  "grid-outage": "Grid Outage",
  "equipment-failure": "Equipment Failure",
  "planned-shutdown": "Planned Shutdown",
  "force-majeure": "Force Majeure",
};

const CATEGORY_YTD_FIELD_MAP: Record<string, string> = {
  "grid-outage": "Grid Outage",
  "equipment-failure": "Equipment Failure",
  "planned-shutdown": "Planned Shutdown",
  "force-majeure": "Force Majeure",
};

const CATEGORY_WATERFALL_MAP: Record<string, string> = {
  "grid-outage": "Grid Curtailment",
  "equipment-failure": "Equipment Loss",
  "planned-shutdown": "Planned Shutdown",
  "force-majeure": "Force Majeure",
};

const MONTH_ABBR: Record<string, string> = {
  January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun",
  July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec",
};

function computeCurrentFYMonth(selectedFY: string): number {
  const today = new Date();
  const fyParts = selectedFY.replace("FY ", "").split("-");
  const fyStartYear = parseInt(fyParts[0]);
  const fyEndYear = fyStartYear + 1;
  const fyStart = new Date(fyStartYear, 3, 1);
  const fyEnd = new Date(fyEndYear, 2, 31);
  if (today >= fyEnd) return 12;
  if (today < fyStart) return 12;
  const monthDiff = (today.getFullYear() - fyStart.getFullYear()) * 12 + (today.getMonth() - fyStart.getMonth());
  return Math.max(1, Math.min(12, monthDiff + 1));
}

function getFYDateRange(selectedFY: string): string {
  const fyParts = selectedFY.replace("FY ", "").split("-");
  const startYear = parseInt(fyParts[0]);
  return `Apr ${startYear} – Mar ${startYear + 1}`;
}

export function OutageLossAnalytics() {
  const [rootCauseFilter, setRootCauseFilter] = useState("all");
  const [plantFilter, setPlantFilter] = useState("all");
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [durationToggle, setDurationToggle] = useState("MTD");
  const [outageViewMode, setOutageViewMode] = useState<"table" | "bar" | "pie">("table");
  const pageRef = useRef<HTMLDivElement>(null);

  const currentFYMonth = useMemo(() => computeCurrentFYMonth(selectedFY), [selectedFY]);
  const periodMultiplier = durationToggle === "MTD" ? 1 : durationToggle === "YTD" ? currentFYMonth : 12;
  const periodLabel = durationToggle === "MTD" ? "Current Month" : durationToggle === "YTD" ? `Year-to-Date (${currentFYMonth} mo)` : "Annual (Full FY)";

  const filteredPlantOptions = useMemo(() => {
    if (selectedVendor === "all") return PLANTS;
    return PLANTS.filter(p => p.vendor === selectedVendor);
  }, [selectedVendor]);

  const outageSummaryData = useMemo(() => {
    return initialJmrRecords
      .filter(rec => {
        if (rec.fy !== selectedFY) return false;
        if (selectedVendor !== "all" && rec.vendor !== selectedVendor) return false;
        if (plantFilter !== "all" && rec.plant !== plantFilter) return false;
        return true;
      })
      .map(rec => {
        const fyParts = rec.fy.replace("FY ", "").split("-");
        const startYear = parseInt(fyParts[0]);
        const monthNum = Object.keys(MONTH_ABBR).indexOf(rec.month);
        const year = monthNum >= 3 ? startYear : startYear + 1;
        const jmrMonth = `${MONTH_ABBR[rec.month] || rec.month.substring(0, 3)}-${year}`;
        const outageStr = rec.outage || "00:00";
        const [h, m] = outageStr.split(":").map(Number);
        const outageMinutes = (h || 0) * 60 + (m || 0);
        return {
          site: rec.plant,
          district: rec.district,
          vendor: rec.vendor,
          capacityKWp: rec.capacityKWp,
          jmrMonth,
          energyExport: rec.energyExportKWh,
          energyImport: rec.energyImportKWh,
          outage: outageStr,
          outageMinutes,
        };
      });
  }, [selectedFY, selectedVendor, plantFilter]);

  const computePlantFactor = useMemo(() => {
    if (plantFilter === "all" && selectedVendor === "all") return 1.0;
    if (plantFilter !== "all") {
      const plant = PLANTS.find(p => p.name === plantFilter);
      return plant ? plant.capacity / TOTAL_CAPACITY : 1.0;
    }
    const vendorCap = PLANTS.filter(p => p.vendor === selectedVendor).reduce((s, p) => s + p.capacity, 0);
    return vendorCap / TOTAL_CAPACITY;
  }, [plantFilter, selectedVendor]);

  const plantFactor = computePlantFactor;
  const scale = (v: number) => Math.round(v * plantFactor * 10) / 10;

  const filteredCategories = useMemo(() => {
    let cats = downtimeCategories;
    if (rootCauseFilter !== "all") {
      const targetId = CATEGORY_ID_MAP[rootCauseFilter];
      if (targetId) cats = cats.filter(c => c.id === targetId);
    }
    const combinedFactor = plantFactor * periodMultiplier;
    cats = cats.map(c => ({
      ...c,
      incidents: Math.round(c.incidents * combinedFactor),
      hours: Math.round(c.hours * combinedFactor * 10) / 10,
      energyLoss: Math.round(c.energyLoss * combinedFactor),
    }));
    return cats;
  }, [rootCauseFilter, plantFactor, periodMultiplier]);

  const totalLoss = filteredCategories.reduce((sum, cat) => sum + cat.energyLoss, 0);

  const filteredLossBuckets = useMemo(() => {
    let buckets = lossBuckets;
    if (rootCauseFilter !== "all") {
      const targetId = CATEGORY_ID_MAP[rootCauseFilter];
      const targetCat = targetId ? CATEGORY_LOSS_KEY_MAP[targetId] : null;
      if (targetCat) buckets = buckets.filter(b => b.category === targetCat);
    }
    const combinedFactor = plantFactor * periodMultiplier;
    buckets = buckets.map(b => {
      const budgeted = Math.round(b.budgeted * combinedFactor * 10) / 10;
      const actual = Math.round(b.actual * combinedFactor * 10) / 10;
      const variance = Math.round((actual - budgeted) * 10) / 10;
      const variancePct = budgeted > 0 ? Math.round((variance / budgeted) * 1000) / 10 : 0;
      return { ...b, budgeted, actual, variance, variancePct };
    });
    return buckets;
  }, [rootCauseFilter, plantFactor, periodMultiplier]);

  const filteredWaterfallData = useMemo(() => {
    let data = [...waterfallData];
    if (rootCauseFilter !== "all") {
      const targetId = CATEGORY_ID_MAP[rootCauseFilter];
      const waterfallName = targetId ? CATEGORY_WATERFALL_MAP[targetId] : null;
      if (waterfallName) {
        data = data.filter(d =>
          d.name === "Budgeted Generation" ||
          d.name === waterfallName ||
          d.name === "Actual Generation" ||
          d.name === "Net Evacuated"
        );
      }
    }
    data = data.map(d => ({
      ...d,
      value: d.value < 0 
        ? -Math.round(Math.abs(d.value) * plantFactor * periodMultiplier) 
        : Math.round(d.value * plantFactor * periodMultiplier),
    }));
    let running = 0;
    data = data.map((d, i) => {
      if (i === 0 || d.value >= 0) {
        running = d.value;
      } else {
        running = running + d.value;
      }
      return { ...d, cumulative: running };
    });
    return data;
  }, [rootCauseFilter, plantFactor, periodMultiplier]);

  const filteredMomData = useMemo(() => {
    return momData.map(d => ({
      ...d,
      budgeted: Math.round(scale(d.budgeted) * periodMultiplier),
      actual: Math.round(scale(d.actual) * periodMultiplier),
      loss: Math.round(scale(d.loss) * periodMultiplier),
    }));
  }, [plantFactor, periodMultiplier]);

  const filteredYoyData = useMemo(() => {
    return yoyData.map(d => ({ ...d, actual: Math.round(scale(d.actual) * periodMultiplier) }));
  }, [plantFactor, periodMultiplier]);

  const filteredYtdMonthlyLossData = useMemo(() => {
    return ytdMonthlyLossData.map(d => ({
      ...d,
      gridOutage: Math.round(scale(d.gridOutage) * periodMultiplier),
      equipFailure: Math.round(scale(d.equipFailure) * periodMultiplier),
      plannedShutdown: Math.round(scale(d.plannedShutdown) * periodMultiplier),
      forceMajeure: Math.round(scale(d.forceMajeure) * periodMultiplier),
      spylTotal: Math.round(scale(d.spylTotal) * periodMultiplier),
    }));
  }, [plantFactor, periodMultiplier]);

  const filteredYtdSummaryRows = useMemo(() => {
    let rows = ytdSummaryRows;
    if (rootCauseFilter !== "all") {
      const targetId = CATEGORY_ID_MAP[rootCauseFilter];
      const targetCat = targetId ? CATEGORY_YTD_FIELD_MAP[targetId] : null;
      if (targetCat) rows = rows.filter(r => r.category === targetCat);
    }
    rows = rows.map(r => ({
      ...r,
      ytdHours: Math.round(r.ytdHours * plantFactor * periodMultiplier * 10) / 10,
      ytdMWh: Math.round(r.ytdMWh * plantFactor * periodMultiplier),
      spylMWh: Math.round(r.spylMWh * plantFactor * periodMultiplier),
      revenue: `₹${(parseFloat(r.revenue.replace(/[₹ Cr]/g, "")) * plantFactor * periodMultiplier).toFixed(2)} Cr`,
    }));
    return rows;
  }, [rootCauseFilter, plantFactor, periodMultiplier]);

  const filteredParetoData = useMemo(() => {
    let data = paretoData;
    if (rootCauseFilter !== "all") {
      const targetId = CATEGORY_ID_MAP[rootCauseFilter];
      const ganttName = targetId ? CATEGORY_GANTT_MAP[targetId] : null;
      if (ganttName) {
        data = data.filter(d => {
          if (ganttName === "Grid Outage") return d.cause === "Grid Instability";
          if (ganttName === "Equipment Failure") return d.cause === "Inverter Failure" || d.cause === "Transformer Issue" || d.cause === "String Fault";
          if (ganttName === "Planned Shutdown") return d.cause === "Communication Loss";
          if (ganttName === "Force Majeure") return d.cause === "Weather";
          return true;
        });
        let cum = 0;
        const totalE = data.reduce((s, d) => s + d.energyLoss, 0);
        data = data.map(d => {
          cum += d.energyLoss;
          return { ...d, cumPct: totalE > 0 ? Math.round((cum / totalE) * 1000) / 10 : 0 };
        });
      }
    }
    data = data.map(d => ({
      ...d,
      incidents: Math.round(d.incidents * plantFactor * periodMultiplier),
      energyLoss: Math.round(d.energyLoss * plantFactor * periodMultiplier),
    }));
    let cum = 0;
    const totalE = data.reduce((s, d) => s + d.energyLoss, 0);
    data = data.map(d => {
      cum += d.energyLoss;
      return { ...d, cumPct: totalE > 0 ? Math.round((cum / totalE) * 1000) / 10 : 0 };
    });
    return data;
  }, [rootCauseFilter, plantFactor, periodMultiplier]);

  const filteredGanttData = useMemo(() => {
    let data = ganttData;
    const ganttCatName = rootCauseFilter !== "all" ? CATEGORY_GANTT_MAP[CATEGORY_ID_MAP[rootCauseFilter]] : null;

    const allowedPlantNames = new Set<string>();
    if (plantFilter !== "all") {
      allowedPlantNames.add(plantFilter);
    } else if (selectedVendor !== "all") {
      PLANTS.filter(p => p.vendor === selectedVendor).forEach(p => allowedPlantNames.add(p.name));
    }

    return data.map(day => ({
      ...day,
      events: day.events.filter(e => {
        if (ganttCatName && e.type !== ganttCatName) return false;
        if (allowedPlantNames.size > 0 && !allowedPlantNames.has(e.plant)) return false;
        return true;
      }),
    }));
  }, [rootCauseFilter, plantFilter, selectedVendor]);

  const ytdTotalHours = useMemo(() => filteredYtdSummaryRows.reduce((s, r) => s + r.ytdHours, 0), [filteredYtdSummaryRows]);
  const ytdTotalMWh = useMemo(() => filteredYtdSummaryRows.reduce((s, r) => s + r.ytdMWh, 0), [filteredYtdSummaryRows]);
  const ytdTotalSpyl = useMemo(() => filteredYtdSummaryRows.reduce((s, r) => s + r.spylMWh, 0), [filteredYtdSummaryRows]);
  const ytdTotalRevenue = useMemo(() => filteredYtdSummaryRows.reduce((s, r) => s + parseFloat(r.revenue.replace(/[₹ Cr]/g, "")), 0), [filteredYtdSummaryRows]);
  const ytdOverallChange = useMemo(() => ytdTotalSpyl > 0 ? Math.round(((ytdTotalMWh - ytdTotalSpyl) / ytdTotalSpyl) * 1000) / 10 : 0, [ytdTotalMWh, ytdTotalSpyl]);

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Outage & Loss Analytics</h1>
                <p className="text-xs text-slate-600 mt-0.5">Comprehensive loss analysis with root cause classification and deviation tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PageExportMenu
                pageTitle="Outage & Loss Analytics"
                contentRef={pageRef}
                variant="navy"
                label="Export Report"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
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
            <Select value={rootCauseFilter} onValueChange={setRootCauseFilter}>
              <SelectTrigger className="w-[165px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="grid">Grid Outage</SelectItem>
                <SelectItem value="equipment">Equipment Failure</SelectItem>
                <SelectItem value="planned">Planned Shutdown</SelectItem>
                <SelectItem value="force-majeure">Force Majeure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedVendor} onValueChange={(v) => { setSelectedVendor(v); setPlantFilter("all"); }}>
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
            <Select value={plantFilter} onValueChange={setPlantFilter}>
              <SelectTrigger className="w-[200px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants ({filteredPlantOptions.length})</SelectItem>
                {filteredPlantOptions.map(p => (
                  <SelectItem key={p.id} value={p.name}>{p.name} ({p.capacity} MW)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(rootCauseFilter !== "all" || selectedVendor !== "all" || plantFilter !== "all") && (
              <button
                onClick={() => { setRootCauseFilter("all"); setSelectedVendor("all"); setPlantFilter("all"); }}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100"
              >
                ✕ Reset
              </button>
            )}
            <div className="ml-auto flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              {["MTD", "YTD", "Annual"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setDurationToggle(duration)}
                  className={`px-4 py-1 text-xs font-semibold rounded transition-all ${
                    durationToggle === duration
                      ? "bg-[#2955A0] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      {(rootCauseFilter !== "all" || selectedVendor !== "all" || plantFilter !== "all") && (
        <div className="mb-4 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-blue-800">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Active Filters:</span>
            {rootCauseFilter !== "all" && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                Category: {rootCauseFilter === "grid" ? "Grid Outage" : rootCauseFilter === "equipment" ? "Equipment Failure" : rootCauseFilter === "planned" ? "Planned Shutdown" : "Force Majeure"}
              </Badge>
            )}
            {selectedVendor !== "all" && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                Vendor: {selectedVendor}
              </Badge>
            )}
            {plantFilter !== "all" && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                Plant: {plantFilter}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-700 hover:bg-blue-100" onClick={() => { setRootCauseFilter("all"); setSelectedVendor("all"); setPlantFilter("all"); }}>
            Clear All
          </Button>
        </div>
      )}

      {/* Downtime Categorization Cards */}
      <div className={`grid grid-cols-1 gap-6 mb-8 ${filteredCategories.length === 1 ? "md:grid-cols-1 max-w-sm" : filteredCategories.length === 2 ? "md:grid-cols-2" : filteredCategories.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const percentage = ((category.energyLoss / totalLoss) * 100).toFixed(1);
          
          return (
            <Card key={category.id} className="border-2 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <Badge 
                    className="text-xs font-semibold"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {percentage}%
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.name}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Incidents:</span>
                    <span className="font-bold text-gray-900">{category.incidents.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-bold text-gray-900">{category.hours.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Energy Loss:</span>
                    <span className="font-bold" style={{ color: category.color }}>
                      {category.energyLoss.toLocaleString()} MWh
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Waterfall Chart: Budgeted → Expected → Actual → Evacuated */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle className="text-base font-semibold">Energy Loss Waterfall Analysis — {periodLabel}</CardTitle>
          <p className="text-xs text-gray-600 mt-1">
            Budgeted Generation → Expected → Actual → Net Evacuated (MWh)
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={filteredWaterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                angle={-15} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }} 
                stroke="#6B7280" 
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip content={<CustomChartTooltip unit="MWh" />} />
              <Bar dataKey="value" stackId="a">
                {filteredWaterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Line 
                type="stepAfter" 
                dataKey="cumulative" 
                stroke="#2955A0" 
                strokeWidth={2}
                dot={{ fill: "#2955A0", r: 4 }}
                name="Cumulative"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-center">
              {(() => {
                const budgeted = filteredWaterfallData.find(d => d.name === "Budgeted Generation")?.value ?? 0;
                const losses = filteredWaterfallData.filter(d => d.value < 0).reduce((s, d) => s + d.value, 0);
                const actual = filteredWaterfallData.find(d => d.name === "Actual Generation")?.value ?? 0;
                const evacuated = filteredWaterfallData.find(d => d.name === "Net Evacuated")?.value ?? actual;
                const expected = budgeted + filteredWaterfallData.filter(d => d.value < 0 && d.name !== "Additional Loss" && d.name !== "Auxiliary Consumption").reduce((s, d) => s + d.value, 0);
                return (
                  <>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Budgeted</div>
                      <div className="text-xl font-bold text-gray-900">{Math.round(budgeted).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Loss</div>
                      <div className="text-xl font-bold text-red-600">{Math.round(losses).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Expected</div>
                      <div className="text-xl font-bold text-gray-900">{Math.round(expected).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Actual</div>
                      <div className="text-xl font-bold text-green-600">{Math.round(actual).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Net Evacuated</div>
                      <div className="text-xl font-bold" style={{ color: "#2955A0" }}>{Math.round(evacuated).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loss Bucketing Table */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle className="text-base font-semibold">Loss Bucketing & Variance Analysis — {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Loss Category</TableHead>
                <TableHead className="text-right font-semibold">Budgeted (MWh)</TableHead>
                <TableHead className="text-right font-semibold">Actual (MWh)</TableHead>
                <TableHead className="text-right font-semibold">Variance (MWh)</TableHead>
                <TableHead className="text-right font-semibold">Variance %</TableHead>
                <TableHead className="font-semibold">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLossBuckets.map((bucket, idx) => {
                const isNegative = bucket.variance > 0;
                const isPositive = bucket.variance < 0;
                
                return (
                  <TableRow 
                    key={idx}
                    className={
                      bucket.impact === "high" 
                        ? "bg-red-50" 
                        : bucket.impact === "medium"
                        ? "bg-yellow-50"
                        : bucket.impact === "positive"
                        ? "bg-green-50"
                        : ""
                    }
                  >
                    <TableCell className="font-semibold text-gray-900">{bucket.category}</TableCell>
                    <TableCell className="text-right font-mono">{bucket.budgeted.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{bucket.actual.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={isNegative ? "text-red-600" : isPositive ? "text-green-600" : "text-gray-900"}>
                        {bucket.variance > 0 ? "+" : ""}{bucket.variance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={isNegative ? "text-red-600" : isPositive ? "text-green-600" : "text-gray-900"}>
                        {bucket.variancePct > 0 ? "+" : ""}{bucket.variancePct.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          bucket.impact === "high"
                            ? "bg-red-100 text-red-800"
                            : bucket.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : bucket.impact === "positive"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {bucket.impact === "positive" ? "Favorable" : bucket.impact.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MoM and YoY Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* MoM Comparison */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">Month-over-Month (MoM) Comparison — {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={filteredMomData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip content={<CustomChartTooltip unit="MWh" />} />
                <Legend />
                <Bar dataKey="budgeted" fill="#2955A0" name="Budgeted (MWh)" />
                <Bar dataKey="actual" fill="#10B981" name="Actual (MWh)" />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  name="Loss (MWh)"
                  yAxisId={0}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* YoY Comparison */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">Year-over-Year (YoY) Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredYoyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={["auto", "auto"]} />
                <Tooltip content={<CustomChartTooltip unit="MWh" />} />
                <Bar dataKey="actual" name="Actual Generation (MWh)">
                  {filteredYoyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "#6366F1" : index === 1 ? "#F59E0B" : "#EF4444"} 
                    />
                  ))}
                </Bar>
                <ReferenceLine y={Math.round(scale(4750) * periodMultiplier)} stroke="#2955A0" strokeDasharray="3 3" label="Baseline" />
              </BarChart>
            </ResponsiveContainer>
            {(() => {
              const vals = filteredYoyData.map(d => d.actual);
              const yoyChange = vals.length >= 2 ? ((vals[vals.length - 1] - vals[vals.length - 2]) / vals[vals.length - 2] * 100) : 0;
              const twoYearDecline = vals.length >= 3 ? vals[vals.length - 1] - vals[0] : vals.length >= 2 ? vals[vals.length - 1] - vals[0] : 0;
              return (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">YoY Change</div>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1 mt-1 ${yoyChange < 0 ? "text-red-600" : "text-green-600"}`}>
                      {yoyChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      {yoyChange > 0 ? "+" : ""}{yoyChange.toFixed(1)}%
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <div className="text-xs text-gray-600">{vals.length >= 3 ? "2-Year" : "Period"} Decline</div>
                    <div className={`text-lg font-bold flex items-center justify-center gap-1 mt-1 ${twoYearDecline < 0 ? "text-red-600" : "text-green-600"}`}>
                      {twoYearDecline < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      {twoYearDecline > 0 ? "+" : ""}{Math.round(twoYearDecline).toLocaleString()} MWh
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* ── YTD Loss Comparison ─────────────────────────────────────────── */}
      <Card className="mb-8 border-2 border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#2955A0] to-[#2955A0]/80 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-white" />
              <CardTitle className="text-base font-semibold text-white">
                Year-to-Date (YTD) Loss Comparison — {selectedFY}
              </CardTitle>
            </div>
            <span className="text-xs text-blue-200 font-medium">{getFYDateRange(selectedFY)} &nbsp;·&nbsp; {currentFYMonth} months</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          {/* ── KPI summary strip ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const spylHours = Math.round(ytdTotalHours / (1 + ytdOverallChange / 100) * 10) / 10;
              const worstCat = filteredYtdSummaryRows.length > 0
                ? [...filteredYtdSummaryRows].sort((a, b) => b.ytdMWh - a.ytdMWh)[0]
                : null;
              const worstPct = worstCat && ytdTotalMWh > 0 ? Math.round((worstCat.ytdMWh / ytdTotalMWh) * 100) : 0;
              return [
                { label: "YTD Total Hours Lost", value: `${ytdTotalHours.toFixed(1)} hrs`, sub: `vs ${spylHours.toFixed(1)} SPYL`, delta: ytdOverallChange, icon: Calendar },
                { label: "YTD Energy Loss",       value: `${ytdTotalMWh.toLocaleString()} MWh`, sub: `vs ${ytdTotalSpyl.toLocaleString()} SPYL`, delta: ytdOverallChange, icon: Zap },
                { label: "YTD Revenue Impact",    value: `₹${ytdTotalRevenue.toFixed(2)} Cr`, sub: "lost generation", delta: null, icon: TrendingDown },
                { label: "Worst Category YTD",    value: worstCat?.category ?? "—", sub: `${worstPct}% of total loss`, delta: null, icon: AlertCircle },
              ];
            })().map(({ label, value, sub, delta, icon: Icon }) => (
              <div key={label} className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{value}</span>
                <div className="flex items-center gap-1">
                  {delta !== null ? (
                    delta > 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
                    )
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={`text-xs font-semibold ${
                    delta === null ? "text-slate-500"
                    : delta > 0   ? "text-rose-600"
                    : "text-emerald-600"
                  }`}>
                    {delta !== null ? `${delta > 0 ? "+" : ""}${delta}% vs SPYL` : sub}
                  </span>
                  {delta !== null && (
                    <span className="text-xs text-slate-400 ml-0.5">&nbsp;· {sub}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Stacked bar + SPYL line chart ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">Monthly Loss by Category (MWh) vs Same Period Last Year</h4>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#EF4444]" />Grid Outage</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#F59E0B]" />Equipment Failure</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#10B981]" />Planned Shutdown</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#6366F1]" />Force Majeure</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-8 h-0.5 bg-[#2955A0] border-dashed border-t-2 border-[#2955A0]" />SPYL Total</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredYtdMonthlyLossData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" unit=" MWh" width={60} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const total = payload.filter(p => p.dataKey !== "spylTotal").reduce((s, p) => s + (Number(p.value) || 0), 0);
                    return (
                      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[160px]">
                        <p className="font-bold text-slate-900 mb-2">{label}</p>
                        {payload.map((p: any) => p.dataKey !== "spylTotal" && (
                          <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
                            <span style={{ color: p.fill }} className="font-medium">{p.name}</span>
                            <span className="font-mono font-semibold">{p.value} MWh</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-100 mt-1 pt-1 flex justify-between">
                          <span className="font-bold text-slate-700">YTD Total</span>
                          <span className="font-mono font-bold text-slate-900">{total} MWh</span>
                        </div>
                        {payload.find((p: any) => p.dataKey === "spylTotal") && (
                          <div className="flex justify-between mt-1 text-slate-500">
                            <span>SPYL Total</span>
                            <span className="font-mono">{payload.find((p: any) => p.dataKey === "spylTotal")?.value} MWh</span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="gridOutage"      name="Grid Outage"       stackId="a" fill="#EF4444" radius={[0,0,0,0]} />
                <Bar dataKey="equipFailure"    name="Equipment Failure" stackId="a" fill="#F59E0B" />
                <Bar dataKey="plannedShutdown" name="Planned Shutdown"  stackId="a" fill="#10B981" />
                <Bar dataKey="forceMajeure"    name="Force Majeure"     stackId="a" fill="#6366F1" radius={[3,3,0,0]} />
                <Line
                  type="monotone"
                  dataKey="spylTotal"
                  name="SPYL Total"
                  stroke="#2955A0"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: "#2955A0" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* ── YTD vs SPYL summary table ── */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">YTD vs Same Period Last Year — Category Breakdown</h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-bold text-xs">Category</TableHead>
                    <TableHead className="font-bold text-xs text-right">YTD Hours</TableHead>
                    <TableHead className="font-bold text-xs text-right">YTD Loss (MWh)</TableHead>
                    <TableHead className="font-bold text-xs text-right">SPYL (MWh)</TableHead>
                    <TableHead className="font-bold text-xs text-right">Δ vs SPYL</TableHead>
                    <TableHead className="font-bold text-xs text-right">Revenue Impact</TableHead>
                    <TableHead className="font-bold text-xs text-center">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredYtdSummaryRows.map((row) => (
                    <TableRow key={row.category} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                          <span className="font-semibold text-slate-900 text-sm">{row.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{row.ytdHours.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-sm">{row.ytdMWh.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-slate-500 text-sm">{row.spylMWh.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center gap-0.5 font-semibold text-sm ${
                          row.changePct < 0 ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {row.changePct < 0
                            ? <ArrowDownRight className="w-3.5 h-3.5" />
                            : <ArrowUpRight className="w-3.5 h-3.5" />
                          }
                          {row.changePct > 0 ? "+" : ""}{row.changePct.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-700 text-sm">{row.revenue}</TableCell>
                      <TableCell className="text-center">
                        {row.changePct > 20 ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Critical</span>
                        ) : row.changePct > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Elevated</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Improved</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredYtdSummaryRows.length > 1 && (
                  <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <TableCell className="font-bold text-slate-900">Total</TableCell>
                    <TableCell className="text-right font-mono font-bold">{ytdTotalHours.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{ytdTotalMWh.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-slate-600">{ytdTotalSpyl.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center gap-0.5 font-bold ${ytdOverallChange > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {ytdOverallChange > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {ytdOverallChange > 0 ? "+" : ""}{ytdOverallChange}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">₹{ytdTotalRevenue.toFixed(2)} Cr</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ytdOverallChange > 20 ? "bg-rose-100 text-rose-700" : ytdOverallChange > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {ytdOverallChange > 20 ? "Critical" : ytdOverallChange > 0 ? "Elevated" : "Improved"}
                      </span>
                    </TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Pareto Analysis */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle className="text-base font-semibold">Pareto Analysis - Root Cause Classification — {periodLabel}</CardTitle>
          <p className="text-xs text-gray-600 mt-1">
            80/20 Rule: Identify top causes contributing to 80% of energy losses
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={filteredParetoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="cause" 
                angle={-20} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 11 }} 
                stroke="#6B7280" 
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fontSize: 12 }} 
                stroke="#6B7280"
                label={{ value: 'Energy Loss (MWh)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }} 
                stroke="#6B7280"
                label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              />
              <Tooltip content={<CustomChartTooltip unit="MWh" />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="energyLoss" 
                fill="#2955A0" 
                name="Energy Loss (MWh)"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="cumPct" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: "#EF4444", r: 5 }}
                name="Cumulative %"
              />
              <ReferenceLine yAxisId="right" y={80} stroke="#F59E0B" strokeDasharray="5 5" label="80%" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            {(() => {
              const top4 = filteredParetoData.slice(0, Math.min(4, filteredParetoData.length));
              const totalE = filteredParetoData.reduce((s, d) => s + d.energyLoss, 0);
              const top4E = top4.reduce((s, d) => s + d.energyLoss, 0);
              const pct = totalE > 0 ? (top4E / totalE * 100).toFixed(1) : "0.0";
              return (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-900">Key Insight:</span>
                  <span className="text-gray-700">
                    Top {top4.length} causes account for <strong className="text-orange-600">{pct}%</strong> of total energy losses
                  </span>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Gantt-style Downtime Timeline */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base font-semibold">Downtime Timeline - Last 7 Days</CardTitle>
          <p className="text-xs text-gray-600 mt-1">
            Gantt-style visualization of outage events across time
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredGanttData.map((day, dayIdx) => (
              <div key={dayIdx}>
                <div className="flex items-center gap-4">
                  {/* Date Label */}
                  <div className="w-28 flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  {/* Timeline (24 hours) */}
                  <div className="flex-1 relative h-10 bg-gray-100 rounded border border-gray-200">
                    {/* Hour markers */}
                    {[0, 6, 12, 18, 24].map((hour) => (
                      <div
                        key={hour}
                        className="absolute top-0 bottom-0 border-l border-gray-300"
                        style={{ left: `${(hour / 24) * 100}%` }}
                      >
                        <span className="absolute -top-5 -ml-2 text-xs text-gray-500">{hour}</span>
                      </div>
                    ))}
                    
                    {/* Events */}
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="absolute top-1 bottom-1 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        style={{
                          left: `${(event.start / 24) * 100}%`,
                          width: `${(event.duration / 24) * 100}%`,
                          backgroundColor: getEventColor(event.type),
                        }}
                        title={`${event.type} - ${event.plant} - ${event.duration}h`}
                      >
                        <div className="h-full flex items-center justify-center px-2">
                          <span className="text-xs font-medium text-white truncate">
                            {event.plant}
                          </span>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                          <div className="font-semibold">{event.type}</div>
                          <div>{event.plant}</div>
                          <div>{event.start}:00 - {event.start + event.duration}:00 ({event.duration}h)</div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty state */}
                    {day.events.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No outages</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-xs font-semibold text-gray-700">Legend:</span>
              {downtimeCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-gray-700">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Site-wise Monthly Outage Summary</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Per-site outage duration from JMR repository — {outageSummaryData.length} records</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={outageViewMode === "table" ? "default" : "ghost"}
                className={`gap-1 text-xs h-7 px-2 ${outageViewMode === "table" ? "bg-[#2955A0]" : ""}`}
                onClick={() => setOutageViewMode("table")}
              >
                <TableIcon className="w-3 h-3" /> Table
              </Button>
              <Button
                size="sm"
                variant={outageViewMode === "bar" ? "default" : "ghost"}
                className={`gap-1 text-xs h-7 px-2 ${outageViewMode === "bar" ? "bg-[#2955A0]" : ""}`}
                onClick={() => setOutageViewMode("bar")}
              >
                <BarChart3 className="w-3 h-3" /> Bar Chart
              </Button>
              <Button
                size="sm"
                variant={outageViewMode === "pie" ? "default" : "ghost"}
                className={`gap-1 text-xs h-7 px-2 ${outageViewMode === "pie" ? "bg-[#2955A0]" : ""}`}
                onClick={() => setOutageViewMode("pie")}
              >
                <PieChartIcon className="w-3 h-3" /> Pie Chart
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {outageViewMode === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-bold">Site Name</TableHead>
                    <TableHead className="font-bold">District</TableHead>
                    <TableHead className="font-bold">Vendor</TableHead>
                    <TableHead className="font-bold text-right">Capacity (KWp)</TableHead>
                    <TableHead className="font-bold text-center">JMR Month</TableHead>
                    <TableHead className="font-bold text-right">Energy Export (KWh)</TableHead>
                    <TableHead className="font-bold text-right">Energy Import (KWh)</TableHead>
                    <TableHead className="font-bold text-center">Outage (HH:MM)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outageSummaryData.map((row, idx) => {
                    const outageSeverity = row.outageMinutes === 0 ? "text-emerald-600" : row.outageMinutes <= 120 ? "text-amber-600" : "text-rose-600";
                    return (
                      <TableRow key={idx} className="hover:bg-slate-50">
                        <TableCell className="font-semibold text-sm">{row.site}</TableCell>
                        <TableCell className="text-sm">{row.district}</TableCell>
                        <TableCell className="text-sm">{row.vendor}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{row.capacityKWp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-center text-sm">
                          <Badge variant="outline" className="text-xs">{row.jmrMonth}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">{row.energyExport.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right text-sm font-medium">{row.energyImport.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className={`text-center font-mono text-sm font-bold ${outageSeverity}`}>{row.outage}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {outageViewMode === "bar" && (
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-4">Outage duration (minutes) per site — color coded by severity</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={outageSummaryData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="site"
                    tick={{ fontSize: 10 }}
                    angle={-35}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: "Minutes", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
                          <p className="font-bold text-sm mb-1">{d.site}</p>
                          <p className="text-slate-600">{d.district} • {d.vendor}</p>
                          <p className="text-slate-600">Month: {d.jmrMonth}</p>
                          <Separator className="my-1.5" />
                          <p className="font-semibold">Outage: <span className="font-mono">{d.outage}</span> ({d.outageMinutes} min)</p>
                          <p>Capacity: {d.capacityKWp.toLocaleString()} KWp</p>
                          <p>Export: {d.energyExport.toLocaleString()} KWh</p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "2 hr threshold", position: "right", fontSize: 10, fill: "#f59e0b" }} />
                  <Bar dataKey="outageMinutes" name="Outage (min)" radius={[4, 4, 0, 0]}>
                    {outageSummaryData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.outageMinutes === 0 ? "#10b981" : entry.outageMinutes <= 120 ? "#f59e0b" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-xs text-slate-600">No Outage</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-500" /><span className="text-xs text-slate-600">≤ 2 hrs</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-500" /><span className="text-xs text-slate-600">&gt; 2 hrs</span></div>
              </div>
            </div>
          )}

          {outageViewMode === "pie" && (
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-4">Outage distribution by severity category</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          const noOutage = outageSummaryData.filter(d => d.outageMinutes === 0).length;
                          const low = outageSummaryData.filter(d => d.outageMinutes > 0 && d.outageMinutes <= 120).length;
                          const high = outageSummaryData.filter(d => d.outageMinutes > 120).length;
                          return [
                            { name: "No Outage", value: noOutage, fill: "#10b981" },
                            { name: "Low (≤2 hrs)", value: low, fill: "#f59e0b" },
                            { name: "High (>2 hrs)", value: high, fill: "#ef4444" },
                          ].filter(d => d.value > 0);
                        })()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine
                      >
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-xs font-semibold text-slate-700 mt-2">Sites by Severity</p>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          const noOutage = outageSummaryData.filter(d => d.outageMinutes === 0).reduce((s, d) => s + d.outageMinutes, 0);
                          const low = outageSummaryData.filter(d => d.outageMinutes > 0 && d.outageMinutes <= 120).reduce((s, d) => s + d.outageMinutes, 0);
                          const high = outageSummaryData.filter(d => d.outageMinutes > 120).reduce((s, d) => s + d.outageMinutes, 0);
                          return [
                            { name: "No Outage", value: noOutage, fill: "#10b981" },
                            { name: "Low (≤2 hrs)", value: low, fill: "#f59e0b" },
                            { name: "High (>2 hrs)", value: high, fill: "#ef4444" },
                          ].filter(d => d.value > 0);
                        })()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}m`}
                        labelLine
                      >
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} minutes`, "Total Outage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-xs font-semibold text-slate-700 mt-2">Total Minutes by Severity</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
