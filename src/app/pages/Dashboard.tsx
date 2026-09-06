import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense, lazy } from "react";
const SolarMap = lazy(() => import("../components/SolarMap"));
import { ExportMenu } from "../components/ExportMenu";
import { motion, AnimatePresence } from "motion/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { CustomChartTooltip } from "../components/ChartTooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Sun,
  AlertTriangle,
  DollarSign,
  Activity,
  MapPin,
  Calendar,
  Filter,
  Clock,
  ArrowUp,
  ArrowDown,
  Target,
  Leaf,
  Database,
  BarChart3,
  Users,
  Building2,
  AlertCircle,
  XCircle,
  CheckCircle,
  TrendingUp as TrendUp,
  Gauge,
  Factory,
  GripVertical,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";

// Portfolio Configuration
const PORTFOLIO_CONFIG = {
  totalCapacity: 220, // MW
  totalPlants: 12,
  states: ["Maharashtra"],
};

// Strategic KPI Cards Data
const strategicKPIs = [
  {
    id: "capacity",
    title: "Total Installed Capacity",
    value: "220",
    unit: "MW",
    target: 220,
    actual: 220,
    change: "0%",
    trend: "stable",
    sparkline: [220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220],
    compliance: "green",
    icon: Factory,
  },
  {
    id: "mtd-generation",
    title: "Generation",
    value: "42,580",
    unit: "MWh",
    target: 45000,
    actual: 42580,
    change: "+5.2%",
    trend: "up",
    sparkline: [3200, 3450, 3680, 3920, 4150, 4380, 4620, 4850, 5080, 5320, 5560, 5800],
    compliance: "yellow",
    icon: Zap,
  },
  {
    id: "ytd-generation",
    title: "Cumulative Generation",
    value: "485,240",
    unit: "MWh",
    target: 520000,
    actual: 485240,
    change: "+8.4%",
    trend: "up",
    sparkline: [38500, 41200, 43800, 46500, 48900, 51200, 53800, 56200, 58900, 61500, 64100, 66800],
    compliance: "yellow",
    icon: Zap,
  },
  {
    id: "portfolio-cuf",
    title: "Portfolio CUF",
    value: "22.1",
    unit: "%",
    target: 24,
    actual: 22.1,
    change: "+0.8%",
    trend: "up",
    sparkline: [20.5, 20.8, 21.0, 21.2, 21.4, 21.6, 21.8, 21.9, 22.0, 22.1, 22.1, 22.1],
    compliance: "yellow",
    icon: Target,
  },
  {
    id: "grid-availability",
    title: "Grid Availability",
    value: "97.8",
    unit: "%",
    target: 98,
    actual: 97.8,
    change: "+0.5%",
    trend: "up",
    sparkline: [97.2, 97.3, 97.4, 97.5, 97.6, 97.7, 97.7, 97.8, 97.8, 97.8, 97.8, 97.8],
    compliance: "green",
    icon: Activity,
  },
  {
    id: "revenue-realized",
    title: "Revenue Realized",
    value: "₹28.5",
    unit: "Cr",
    target: 31.2,
    actual: 28.5,
    change: "+6.2%",
    trend: "up",
    sparkline: [2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3],
    compliance: "yellow",
    icon: DollarSign,
  },
  {
    id: "revenue-shortfall",
    title: "Revenue Shortfall",
    value: "₹2.7",
    unit: "Cr",
    target: 0,
    actual: 2.7,
    change: "-0.3Cr",
    trend: "down",
    sparkline: [3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8, 2.8, 2.7, 2.7, 2.7],
    compliance: "red",
    icon: AlertTriangle,
  },
  {
    id: "ld-exposure",
    title: "Total LD Exposure",
    value: "₹1.24",
    unit: "Cr",
    target: 0,
    actual: 1.24,
    change: "-0.08Cr",
    trend: "down",
    sparkline: [1.8, 1.7, 1.6, 1.5, 1.4, 1.35, 1.3, 1.28, 1.26, 1.25, 1.24, 1.24],
    compliance: "red",
    icon: AlertCircle,
  },
  {
    id: "asset-health",
    title: "Asset Health Index",
    value: "82.5",
    unit: "/100",
    target: 90,
    actual: 82.5,
    change: "+1.2",
    trend: "up",
    sparkline: [78, 79, 79.5, 80, 80.5, 81, 81.5, 81.8, 82, 82.2, 82.4, 82.5],
    compliance: "yellow",
    icon: Gauge,
  },
  {
    id: "co2-reduction",
    title: "CO₂ Emission Reduction",
    value: "384,520",
    unit: "Tonnes",
    target: 410000,
    actual: 384520,
    change: "+8.4%",
    trend: "up",
    sparkline: [30500, 32800, 35200, 37600, 40100, 42500, 45000, 47500, 50100, 52600, 55200, 57800],
    compliance: "green",
    icon: Leaf,
  },
];

// Plant Markers for India Map — All Maharashtra EESL Solar Sites
const plantMarkers = [
  { id: 1,  name: "Sakri Solar Park",          state: "Maharashtra", district: "Dhule",        lat: 20.98, lon: 74.15, capacity: 25, status: "compliant",     cuf: 23.5, generation: 2150, target: 2100, availability: 97.2, ldRisk: "none",   vendor: "SolarCo India" },
  { id: 2,  name: "Sangli Solar Farm",          state: "Maharashtra", district: "Sangli",       lat: 16.85, lon: 74.56, capacity: 15, status: "warning",       cuf: 21.2, generation: 1180, target: 1260, availability: 94.5, ldRisk: "low",    vendor: "SunPower Tech" },
  { id: 3,  name: "Osmanabad Solar Plant",      state: "Maharashtra", district: "Osmanabad",    lat: 18.18, lon: 76.04, capacity: 30, status: "compliant",     cuf: 24.1, generation: 2380, target: 2450, availability: 96.8, ldRisk: "none",   vendor: "Green Energy Ltd" },
  { id: 4,  name: "Latur Solar Station",         state: "Maharashtra", district: "Latur",        lat: 18.40, lon: 76.57, capacity: 20, status: "compliant",     cuf: 23.8, generation: 1720, target: 1680, availability: 97.5, ldRisk: "none",   vendor: "TechSolar Pvt" },
  { id: 5,  name: "Beed Solar Park",            state: "Maharashtra", district: "Beed",         lat: 18.99, lon: 75.76, capacity: 30, status: "compliant",     cuf: 24.5, generation: 1920, target: 1850, availability: 98.1, ldRisk: "none",   vendor: "Mega Solar Inc" },
  { id: 6,  name: "Ahmednagar Solar Plant",     state: "Maharashtra", district: "Ahmednagar",   lat: 19.09, lon: 74.74, capacity: 12, status: "compliant",     cuf: 23.2, generation: 1560, target: 1480, availability: 96.4, ldRisk: "none",   vendor: "SolarCo India" },
  { id: 7,  name: "Devdaithan Solar Plant",     state: "Maharashtra", district: "Ahmednagar",   lat: 19.20, lon: 74.28, capacity: 18, status: "curtailment",   cuf: 19.5, generation: 1310, target: 1580, availability: 91.2, ldRisk: "high",   vendor: "Mega Solar Inc" },
  { id: 8,  name: "Amravati Solar Unit",        state: "Maharashtra", district: "Amravati",     lat: 20.93, lon: 77.75, capacity: 14, status: "non-compliant", cuf: 18.5, generation: 1140, target: 1680, availability: 88.3, ldRisk: "high",   vendor: "SolarCo India" },
  { id: 9,  name: "Wardha Solar Park",          state: "Maharashtra", district: "Wardha",       lat: 20.73, lon: 78.60, capacity: 16, status: "warning",       cuf: 20.8, generation: 2120, target: 2350, availability: 93.5, ldRisk: "medium", vendor: "SunPower Tech" },
  { id: 10, name: "Buldhana Solar Farm",        state: "Maharashtra", district: "Buldhana",     lat: 20.53, lon: 76.18, capacity: 10, status: "compliant",     cuf: 22.8, generation:  720, target:  700, availability: 97.0, ldRisk: "none",   vendor: "SunPower Tech" },
  { id: 11, name: "Chandrapur Solar Project",   state: "Maharashtra", district: "Chandrapur",   lat: 19.95, lon: 79.30, capacity: 22, status: "warning",       cuf: 21.5, generation:  580, target:  630, availability: 93.8, ldRisk: "low",    vendor: "SunPower Tech" },
  { id: 12, name: "Bhandara Solar Station",     state: "Maharashtra", district: "Bhandara",     lat: 21.17, lon: 79.65, capacity: 8,  status: "compliant",     cuf: 23.0, generation:  640, target:  620, availability: 96.5, ldRisk: "none",   vendor: "Mega Solar Inc" },
];

// Risk & Alert Data
const riskData = {
  nonCompliantPlants: 8,
  highLDRisk: 5,
  escalationTriggered: 3,
  pendingJMR: 12,
  overdueJMR: 3,
  ldExposureCr: 1.24,
  riskScore: 62,
  topUnderperforming: [
    { plant: "Amravati Solar Unit", state: "Maharashtra", cuf: 18.5, gap: -5.5 },
    { plant: "Devdaithan Solar Plant", state: "Maharashtra", cuf: 19.5, gap: -4.5 },
    { plant: "Wardha Solar Park", state: "Maharashtra", cuf: 20.8, gap: -3.2 },
  ],
  complianceTrend: [
    { month: "Sep", nonCompliant: 10 },
    { month: "Oct", nonCompliant: 9 },
    { month: "Nov", nonCompliant: 11 },
    { month: "Dec", nonCompliant: 9 },
    { month: "Jan", nonCompliant: 9 },
    { month: "Feb", nonCompliant: 8 },
    { month: "Mar", nonCompliant: 7 },
    { month: "Apr", nonCompliant: 6 },
  ],
  recentAlerts: [
    { id: 1, category: "Non-Compliant", plant: "Amravati Solar Unit",      state: "Maharashtra",   daysOpen: 2,  severity: "critical", detail: "CUF 18.5% — 5.5% below target" },
    { id: 2, category: "Curtailment",   plant: "Devdaithan Solar Plant",   state: "Maharashtra",   daysOpen: 5,  severity: "high",     detail: "Grid curtailment — 18.8% generation loss" },
    { id: 3, category: "JMR Overdue",   plant: "Sangli Solar Farm",        state: "Maharashtra",   daysOpen: 9,  severity: "high",     detail: "JMR submission pending — SLA breached" },
    { id: 4, category: "Warning",       plant: "Wardha Solar Park",        state: "Maharashtra",   daysOpen: 1,  severity: "medium",   detail: "CUF trending below threshold for 3 days" },
    { id: 5, category: "JMR Overdue",   plant: "Chandrapur Solar Project", state: "Maharashtra",   daysOpen: 11, severity: "high",     detail: "JMR submission pending — SLA breached" },
  ],
  vendorLDExposure: [
    { vendor: "SunPower Tech", plants: 15, ldCr: 0.54, risk: "high" },
    { vendor: "SolarCo India", plants: 12, ldCr: 0.42, risk: "medium" },
    { vendor: "Green Energy Ltd", plants: 8,  ldCr: 0.28, risk: "low" },
  ],
};

// Generation Analytics Data
const mtdGenerationData = [
  { plant: "Beed Solar Park", target: 1850, actual: 1920 },
  { plant: "Osmanabad Solar Plant", target: 2450, actual: 2380 },
  { plant: "Sakri Solar Park", target: 2100, actual: 2150 },
  { plant: "Wardha Solar Park", target: 2350, actual: 2120 },
  { plant: "Latur Solar Station", target: 1680, actual: 1720 },
  { plant: "Sangli Solar Farm", target: 1260, actual: 1180 },
];

const cufTrendData = [
  { month: "Mar", portfolio: 21.2, target: 24.0 },
  { month: "Apr", portfolio: 21.5, target: 24.0 },
  { month: "May", portfolio: 22.1, target: 24.0 },
  { month: "Jun", portfolio: 21.8, target: 24.0 },
  { month: "Jul", portfolio: 20.9, target: 24.0 },
  { month: "Aug", portfolio: 21.4, target: 24.0 },
  { month: "Sep", portfolio: 21.9, target: 24.0 },
  { month: "Oct", portfolio: 22.3, target: 24.0 },
  { month: "Nov", portfolio: 22.0, target: 24.0 },
  { month: "Dec", portfolio: 21.7, target: 24.0 },
  { month: "Jan", portfolio: 22.2, target: 24.0 },
  { month: "Feb", portfolio: 22.1, target: 24.0 },
];

// Previous year data for comparison mode
const prevYearMtdGenerationData = [
  { plant: "Beed Solar Park", target: 1700, actual: 1680 },
  { plant: "Osmanabad Solar Plant", target: 2250, actual: 2190 },
  { plant: "Sakri Solar Park", target: 1950, actual: 1920 },
  { plant: "Wardha Solar Park", target: 2150, actual: 1980 },
  { plant: "Latur Solar Station", target: 1550, actual: 1530 },
  { plant: "Sangli Solar Farm", target: 1180, actual: 1050 },
];

const prevYearCufTrendData = [
  { month: "Mar", prevPortfolio: 19.8 },
  { month: "Apr", prevPortfolio: 20.1 },
  { month: "May", prevPortfolio: 20.4 },
  { month: "Jun", prevPortfolio: 20.2 },
  { month: "Jul", prevPortfolio: 19.5 },
  { month: "Aug", prevPortfolio: 19.9 },
  { month: "Sep", prevPortfolio: 20.6 },
  { month: "Oct", prevPortfolio: 21.1 },
  { month: "Nov", prevPortfolio: 20.8 },
  { month: "Dec", prevPortfolio: 20.3 },
  { month: "Jan", prevPortfolio: 20.9 },
  { month: "Feb", prevPortfolio: 20.7 },
];

const mergedCufData = cufTrendData.map((d, i) => ({ ...d, prevPortfolio: prevYearCufTrendData[i].prevPortfolio }));

const downtimeData = [
  { name: "Grid Outage", value: 38, color: "#EF4444" },
  { name: "Equipment Failure", value: 25, color: "#F59E0B" },
  { name: "Planned Shutdown", value: 18, color: "#10B981" },
  { name: "Curtailment", value: 12, color: "#E8A800" },
  { name: "Force Majeure", value: 7, color: "#8B5CF6" },
];

// Revenue Waterfall Data
const revenueWaterfallData = [
  { stage: "Budgeted", value: 31.2, delta: 0 },
  { stage: "Expected", value: 29.8, delta: -1.4 },
  { stage: "Actual", value: 29.2, delta: -0.6 },
  { stage: "Realized", value: 28.5, delta: -0.7 },
];

// LD Exposure by Vendor
const ldExposureData = [
  { vendor: "SolarCo India", plants: 12, ldAmount: 0.42, severity: "medium" },
  { vendor: "SunPower Tech", plants: 15, ldAmount: 0.54, severity: "high" },
  { vendor: "Mega Solar Inc", plants: 10, ldAmount: 0.55, severity: "high" },
  { vendor: "Green Energy Ltd", plants: 4, ldAmount: 0.00, severity: "none" },
  { vendor: "TechSolar Pvt", plants: 4, ldAmount: 0.00, severity: "none" },
];

// O&M Deviation Data
const omDeviationData = {
  prBenchmark: 82.0,
  actualPR: 78.6,
  settlementAmount: 1.85,
};

// Vendor Performance Ranking
const vendorRankingData = [
  { rank: 1, vendor: "TechSolar Pvt", plants: 4, avgCuf: 23.8, avgAvailability: 97.5, ldExposure: 0.00, compliance: 98.5 },
  { rank: 2, vendor: "Mega Solar Inc", plants: 10, avgCuf: 23.7, avgAvailability: 97.8, ldExposure: 0.55, compliance: 94.2 },
  { rank: 3, vendor: "SolarCo India", plants: 12, avgCuf: 22.1, avgAvailability: 96.2, ldExposure: 0.42, compliance: 92.8 },
  { rank: 4, vendor: "Green Energy Ltd", plants: 4, avgCuf: 24.1, avgAvailability: 96.8, ldExposure: 0.00, compliance: 95.8 },
  { rank: 5, vendor: "SunPower Tech", plants: 15, avgCuf: 20.8, avgAvailability: 93.5, ldExposure: 0.54, compliance: 88.5 },
];

// Cluster Comparison
const clusterComparisonData = [
  { state: "Western Maharashtra", capacity: 82, generation: 18650, cuf: 22.8, availability: 96.5, ldExposure: 0.32 },
  { state: "Vidarbha Region", capacity: 78, generation: 17240, cuf: 21.5, availability: 94.2, ldExposure: 0.58 },
  { state: "Marathwada Region", capacity: 60, generation: 13580, cuf: 22.6, availability: 96.8, ldExposure: 0.24 },
];

// Lost Production Index
const lpiData = [
  { month: "Apr", lpi: 7.2, gridLoss: 2.8, equipmentLoss: 1.5, plannedLoss: 1.6, curtailmentLoss: 1.3, energyLostMWh: 324, expectedMWh: 4500 },
  { month: "May", lpi: 6.8, gridLoss: 2.5, equipmentLoss: 1.3, plannedLoss: 1.5, curtailmentLoss: 1.5, energyLostMWh: 312, expectedMWh: 4588 },
  { month: "Jun", lpi: 9.1, gridLoss: 3.8, equipmentLoss: 2.4, plannedLoss: 1.4, curtailmentLoss: 1.5, energyLostMWh: 410, expectedMWh: 4505 },
  { month: "Jul", lpi: 12.5, gridLoss: 5.2, equipmentLoss: 3.5, plannedLoss: 2.0, curtailmentLoss: 1.8, energyLostMWh: 575, expectedMWh: 4600 },
  { month: "Aug", lpi: 8.9, gridLoss: 3.5, equipmentLoss: 2.2, plannedLoss: 1.7, curtailmentLoss: 1.5, energyLostMWh: 396, expectedMWh: 4449 },
  { month: "Sep", lpi: 7.5, gridLoss: 2.9, equipmentLoss: 1.8, plannedLoss: 1.5, curtailmentLoss: 1.3, energyLostMWh: 338, expectedMWh: 4507 },
  { month: "Oct", lpi: 6.2, gridLoss: 2.3, equipmentLoss: 1.2, plannedLoss: 1.4, curtailmentLoss: 1.3, energyLostMWh: 279, expectedMWh: 4500 },
  { month: "Nov", lpi: 7.8, gridLoss: 3.1, equipmentLoss: 1.9, plannedLoss: 1.5, curtailmentLoss: 1.3, energyLostMWh: 351, expectedMWh: 4500 },
  { month: "Dec", lpi: 9.5, gridLoss: 4.0, equipmentLoss: 2.5, plannedLoss: 1.6, curtailmentLoss: 1.4, energyLostMWh: 428, expectedMWh: 4505 },
  { month: "Jan", lpi: 7.1, gridLoss: 2.7, equipmentLoss: 1.6, plannedLoss: 1.5, curtailmentLoss: 1.3, energyLostMWh: 320, expectedMWh: 4507 },
  { month: "Feb", lpi: 8.2, gridLoss: 3.3, equipmentLoss: 2.0, plannedLoss: 1.5, curtailmentLoss: 1.4, energyLostMWh: 369, expectedMWh: 4500 },
  { month: "Mar", lpi: 6.5, gridLoss: 2.4, equipmentLoss: 1.4, plannedLoss: 1.4, curtailmentLoss: 1.3, energyLostMWh: 292, expectedMWh: 4490 },
];

// Asset Health Index Breakdown
const assetHealthBreakdown = [
  { component: "PR Score", value: 78.6, target: 82.0, weight: 35 },
  { component: "Availability Score", value: 96.2, target: 98.0, weight: 30 },
  { component: "Downtime Score", value: 85.5, target: 95.0, weight: 20 },
  { component: "Compliance Score", value: 88.5, target: 95.0, weight: 15 },
];

type KpiPreviewEntry = {
    title: string;
    rows: { label: string; value: string; subValue?: string; status?: "green" | "yellow" | "red" }[];
    chart?: { label: string; data: { name: string; value: number }[] };
    footer?: string;
  };


const statusColors: any = {
  compliant: { bg: "#10B981", label: "Compliant" },
  warning: { bg: "#E8A800", label: "Warning" },
  "non-compliant": { bg: "#EF4444", label: "Non-Compliant" },
  shutdown: { bg: "#6B7280", label: "Shutdown" },
  curtailment: { bg: "#F59E0B", label: "Curtailment" },
};

const complianceColors: any = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
  stable: "bg-slate-400",
};

const previewStatusColors: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

function KpiCardWithPreview({ 
  children, 
  kpi, 
  preview 
}: { 
  children: React.ReactNode; 
  kpi: typeof strategicKPIs[0]; 
  preview?: KpiPreviewEntry;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"right" | "left">("right");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEnter = () => {
    hoveringRef.current = true;
    timerRef.current = setTimeout(() => {
      if (hoveringRef.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setPosition(window.innerWidth - rect.right >= 380 ? "right" : "left");
        setIsOpen(true);
      }
    }, 1500);
  };

  const handleLeave = () => {
    hoveringRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => {
      if (!hoveringRef.current) setIsOpen(false);
    }, 200);
  };

  const handlePreviewEnter = () => { hoveringRef.current = true; };
  const handlePreviewLeave = () => {
    hoveringRef.current = false;
    setTimeout(() => { if (!hoveringRef.current) setIsOpen(false); }, 200);
  };

  if (!preview) return <>{children}</>;

  return (
    <div ref={cardRef} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-50 top-0"
              style={position === "right" ? { left: "100%", marginLeft: 10 } : { right: "100%", marginRight: 10 }}
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
            >
              <div className="w-[360px] max-h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-200 ring-1 ring-black/5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#2955A0] to-[#0089C9] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Quick Preview</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                    <span className="text-white/60 text-xs">✕</span>
                  </button>
                </div>

                <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h3 className="text-xs font-bold text-slate-800">{preview.title}</h3>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
                  <div className="divide-y divide-slate-100">
                    {preview.rows.map((row, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${previewStatusColors[row.status || "green"]}`} />
                          <span className="text-[11px] font-medium text-slate-700 truncate">{row.label}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className="text-[11px] font-bold text-slate-900">{row.value}</span>
                          {row.subValue && (
                            <p className={`text-[9px] mt-0.5 ${
                              row.status === "red" ? "text-rose-600" : 
                              row.status === "yellow" ? "text-amber-600" : "text-slate-500"
                            }`}>{row.subValue}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {preview.chart && (
                    <div className="px-3 pt-2 pb-1 border-t border-slate-100">
                      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{preview.chart.label}</p>
                      <div className="h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={preview.chart.data} barSize={20}>
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                            <Bar dataKey="value" fill="#2955A0" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {preview.footer && (
                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 shrink-0">
                    <p className="text-[9px] text-slate-500 leading-relaxed">{preview.footer}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function VendorCardWithPreview({ children, vendor }: { children: React.ReactNode; vendor: typeof vendorHealthData[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ horizontal: "right" | "left"; vertical: "below" | "above" }>(
    { horizontal: "right", vertical: "below" }
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const plants = vendorPlantDetails[vendor.vendor] || [];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => { if (!hoveringRef.current) setIsOpen(false); }, 200);
  };

  const handleEnter = () => {
    hoveringRef.current = true;
    cancelClose();
    timerRef.current = setTimeout(() => {
      if (hoveringRef.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setPosition({
          horizontal: spaceRight >= 420 ? "right" : spaceLeft >= 420 ? "left" : "right",
          vertical: spaceBelow >= 380 ? "below" : spaceAbove >= 380 ? "above" : "below",
        });
        setIsOpen(true);
      }
    }, 2000);
  };

  const handleLeave = () => {
    hoveringRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    scheduleClose();
  };

  const handlePreviewEnter = () => { hoveringRef.current = true; cancelClose(); };
  const handlePreviewLeave = () => {
    hoveringRef.current = false;
    scheduleClose();
  };

  const posStyle: React.CSSProperties = {};
  if (position.horizontal === "right") { posStyle.left = "100%"; posStyle.marginLeft = 10; }
  else { posStyle.right = "100%"; posStyle.marginRight = 10; }
  if (position.vertical === "below") { posStyle.top = 0; }
  else { posStyle.bottom = 0; }

  return (
    <div ref={cardRef} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: position.vertical === "below" ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: position.vertical === "below" ? 6 : -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-50"
              style={posStyle}
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
            >
              <div className="w-[400px] max-h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-200 ring-1 ring-black/5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 shrink-0" style={{ background: `linear-gradient(135deg, ${vendor.color}, ${vendor.color}cc)` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Plant Revenue Details</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                    <span className="text-white/60 text-xs">✕</span>
                  </button>
                </div>

                <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h3 className="text-xs font-bold text-slate-800">{vendor.vendor}</h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">{vendor.plantCount} plants · {vendor.capacity} MW · Collection {vendor.collection}%</p>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
                  <div className="p-3 space-y-2.5">
                    {plants.map((p) => {
                      const realPct = p.budgeted > 0 ? (p.realized / p.budgeted) * 100 : 0;
                      return (
                        <div key={p.name} className={`rounded-lg border p-2.5 ${p.status === "red" ? "border-rose-200 bg-rose-50/30" : p.status === "yellow" ? "border-amber-200 bg-amber-50/30" : "border-emerald-200 bg-emerald-50/30"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vendor.color }} />
                              <span className="text-[11px] font-bold text-slate-800">{p.name}</span>
                              <span className="text-[9px] text-slate-400">· {p.district}, MH</span>
                            </div>
                            <Badge className={`text-[8px] px-1.5 py-0 ${p.status === "green" ? "bg-emerald-100 text-emerald-700" : p.status === "yellow" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                              {p.capacity} MW
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 mb-2">
                            <div>
                              <p className="text-[8px] text-slate-400 uppercase">Budgeted</p>
                              <p className="text-[10px] font-semibold text-slate-600">₹{p.budgeted.toFixed(2)} Cr</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-400 uppercase">Realized</p>
                              <p className="text-[10px] font-bold" style={{ color: vendor.color }}>₹{p.realized.toFixed(2)} Cr</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-400 uppercase">Shortfall</p>
                              <p className={`text-[10px] font-bold ${p.shortfall > 0.3 ? "text-rose-600" : "text-amber-600"}`}>₹{p.shortfall.toFixed(2)} Cr</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-400 uppercase">Collection</p>
                              <p className={`text-[10px] font-bold ${p.collection >= 93 ? "text-emerald-600" : p.collection >= 88 ? "text-amber-600" : "text-rose-600"}`}>{p.collection}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(realPct, 100)}%`, backgroundColor: realPct >= 93 ? "#10b981" : realPct >= 88 ? "#f59e0b" : "#ef4444" }} />
                            </div>
                            <span className="text-[8px] font-bold text-slate-500">{realPct.toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[8px] text-slate-400">PR: <span className="font-semibold text-slate-600">{p.pr}%</span></span>
                            <span className="text-[8px] text-slate-400">CUF: <span className="font-semibold text-slate-600">{p.cuf}%</span></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 shrink-0">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-400">Vendor Total: ₹{vendor.budgeted.toFixed(2)} Cr budgeted → ₹{vendor.realized.toFixed(2)} Cr realized</span>
                    <span className={`font-bold ${vendor.collection >= 93 ? "text-emerald-600" : vendor.collection >= 88 ? "text-amber-600" : "text-rose-600"}`}>
                      {((vendor.realized / vendor.budgeted) * 100).toFixed(1)}% realization
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlantCardWithPreview({ children, plant }: { children: React.ReactNode; plant: PlantHealthEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ horizontal: "right" | "left"; vertical: "below" | "above" }>(
    { horizontal: "right", vertical: "below" }
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => { if (!hoveringRef.current) setIsOpen(false); }, 200);
  };
  const handleEnter = () => {
    hoveringRef.current = true;
    cancelClose();
    timerRef.current = setTimeout(() => {
      if (hoveringRef.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
          horizontal: (window.innerWidth - rect.right) >= 380 ? "right" : rect.left >= 380 ? "left" : "right",
          vertical: (window.innerHeight - rect.bottom) >= 320 ? "below" : rect.top >= 320 ? "above" : "below",
        });
        setIsOpen(true);
      }
    }, 1500);
  };
  const handleLeave = () => { hoveringRef.current = false; if (timerRef.current) clearTimeout(timerRef.current); scheduleClose(); };
  const handlePreviewEnter = () => { hoveringRef.current = true; cancelClose(); };
  const handlePreviewLeave = () => { hoveringRef.current = false; scheduleClose(); };

  const posStyle: React.CSSProperties = {};
  if (position.horizontal === "right") { posStyle.left = "100%"; posStyle.marginLeft = 10; }
  else { posStyle.right = "100%"; posStyle.marginRight = 10; }
  if (position.vertical === "below") { posStyle.top = 0; }
  else { posStyle.bottom = 0; }

  const realizationPct = plant.budgeted > 0 ? (plant.realized / plant.budgeted) * 100 : 0;
  const genPct = plant.target > 0 ? (plant.generation / plant.target) * 100 : 0;

  return (
    <div ref={cardRef} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: position.vertical === "below" ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: position.vertical === "below" ? 6 : -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-50"
              style={posStyle}
              onMouseEnter={handlePreviewEnter}
              onMouseLeave={handlePreviewLeave}
            >
              <div className="w-[360px] bg-white rounded-xl shadow-2xl border border-slate-200 ring-1 ring-black/5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 shrink-0" style={{ background: `linear-gradient(135deg, ${plant.color}, ${plant.color}cc)` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">Plant Detail View</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                    <span className="text-white/60 text-xs">✕</span>
                  </button>
                </div>

                <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h3 className="text-xs font-bold text-slate-800">{plant.name}</h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">{plant.district}, Maharashtra · {plant.vendor} · {plant.capacity} MW</p>
                </div>

                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Revenue Performance</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Budgeted", value: `₹${plant.budgeted.toFixed(2)} Cr`, cls: "text-slate-700" },
                        { label: "Realized", value: `₹${plant.realized.toFixed(2)} Cr`, cls: "" },
                        { label: "Shortfall", value: `₹${plant.shortfall.toFixed(2)} Cr`, cls: plant.shortfall > 0.3 ? "text-rose-600" : "text-amber-600" },
                        { label: "Collection", value: `${plant.collection}%`, cls: plant.collection >= 93 ? "text-emerald-600" : plant.collection >= 88 ? "text-amber-600" : "text-rose-600" },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-[8px] text-slate-400 uppercase">{m.label}</p>
                          <p className={`text-[10px] font-bold ${m.cls}`} style={m.label === "Realized" ? { color: plant.color } : undefined}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(realizationPct, 100)}%`, backgroundColor: realizationPct >= 93 ? "#10b981" : realizationPct >= 88 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span className="text-[8px] font-bold text-slate-500">{realizationPct.toFixed(0)}% realized</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Technical Performance</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "CUF", value: `${plant.cuf}%`, cls: plant.cuf >= 22 ? "text-emerald-600" : plant.cuf >= 20 ? "text-amber-600" : "text-rose-600" },
                        { label: "PR", value: `${plant.pr}%`, cls: plant.pr >= 78 ? "text-emerald-600" : plant.pr >= 75 ? "text-amber-600" : "text-rose-600" },
                        { label: "Availability", value: `${plant.availability}%`, cls: plant.availability >= 95 ? "text-emerald-600" : plant.availability >= 90 ? "text-amber-600" : "text-rose-600" },
                        { label: "LD Risk", value: plant.ldRisk === "none" ? "None" : plant.ldRisk.charAt(0).toUpperCase() + plant.ldRisk.slice(1), cls: plant.ldRisk === "none" ? "text-emerald-600" : plant.ldRisk === "high" ? "text-rose-600" : "text-amber-600" },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-[8px] text-slate-400 uppercase">{m.label}</p>
                          <p className={`text-[10px] font-bold ${m.cls}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Generation (MWh)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Target</p>
                        <p className="text-[10px] font-bold text-slate-700">{plant.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Actual</p>
                        <p className="text-[10px] font-bold" style={{ color: plant.color }}>{plant.generation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Achievement</p>
                        <p className={`text-[10px] font-bold ${genPct >= 95 ? "text-emerald-600" : genPct >= 85 ? "text-amber-600" : "text-rose-600"}`}>{genPct.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {plant.ldExposure > 0 && (
                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">LD Exposure</span>
                      <span className="text-[10px] font-bold text-orange-600">₹{plant.ldExposure.toFixed(2)} Cr</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Filter Engine: month seasonal generation factors (India solar profile) ────
const MONTH_ORDER = [
  "April","May","June","July","August","September",
  "October","November","December","January","February","March",
];
const MONTH_FACTORS: Record<string, number> = {
  April: 1.10, May: 1.15, June: 0.95, July: 0.85, August: 0.88,
  September: 0.90, October: 0.92, November: 0.85, December: 0.80,
  January: 0.82, February: 0.85, March: 1.00,
};
const FY_FACTORS: Record<string, number> = {
  "FY 2025-26": 1.00, "FY 2024-25": 0.95, "FY 2023-24": 0.88,
};
const BASE_SEASON = 0.85; // existing data is calibrated for February
// Baseline portfolio-level KPI values (all plants, FY 2025-26, Feb, MTD)
const BASE_KPI = {
  mtdGen: 42580, mtdTarget: 45000,
  plantsCap: plantMarkers.reduce((s, p) => s + p.capacity, 0), // 208 MW from sample
};

const vendorPlantDetails: Record<string, { name: string; district: string; capacity: number; budgeted: number; realized: number; shortfall: number; collection: number; pr: number; cuf: number; status: "green" | "yellow" | "red" }[]> = {
  "SolarCo India": [
    { name: "Sakri Solar Park", district: "Dhule", capacity: 25.0, budgeted: 4.80, realized: 4.38, shortfall: 0.42, collection: 91.3, pr: 78.2, cuf: 22.1, status: "yellow" },
    { name: "Ahmednagar Solar Plant", district: "Ahmednagar", capacity: 12.0, budgeted: 3.60, realized: 3.17, shortfall: 0.43, collection: 88.1, pr: 76.5, cuf: 21.4, status: "yellow" },
    { name: "Amravati Solar Unit", district: "Amravati", capacity: 14.0, budgeted: 2.45, realized: 2.16, shortfall: 0.29, collection: 88.2, pr: 76.8, cuf: 21.2, status: "yellow" },
  ],
  "SunPower Tech": [
    { name: "Sangli Solar Farm", district: "Sangli", capacity: 15.0, budgeted: 2.90, realized: 2.48, shortfall: 0.42, collection: 85.5, pr: 74.8, cuf: 20.2, status: "red" },
    { name: "Wardha Solar Park", district: "Wardha", capacity: 16.0, budgeted: 2.56, realized: 2.18, shortfall: 0.38, collection: 85.2, pr: 75.1, cuf: 20.5, status: "red" },
    { name: "Buldhana Solar Farm", district: "Buldhana", capacity: 10.0, budgeted: 2.64, realized: 2.32, shortfall: 0.32, collection: 87.9, pr: 76.0, cuf: 21.0, status: "yellow" },
    { name: "Chandrapur Solar Project", district: "Chandrapur", capacity: 22.0, budgeted: 2.10, realized: 1.78, shortfall: 0.32, collection: 84.8, pr: 73.5, cuf: 19.8, status: "red" },
  ],
  "Mega Solar Inc": [
    { name: "Beed Solar Park", district: "Beed", capacity: 30.0, budgeted: 4.32, realized: 3.95, shortfall: 0.37, collection: 91.4, pr: 78.5, cuf: 22.3, status: "yellow" },
    { name: "Devdaithan Solar Plant", district: "Ahmednagar", capacity: 18.0, budgeted: 3.60, realized: 3.22, shortfall: 0.38, collection: 89.4, pr: 77.2, cuf: 21.6, status: "yellow" },
    { name: "Bhandara Solar Station", district: "Bhandara", capacity: 8.0, budgeted: 3.60, realized: 3.28, shortfall: 0.32, collection: 91.1, pr: 78.0, cuf: 22.0, status: "yellow" },
  ],
  "Green Energy Ltd": [
    { name: "Osmanabad Solar Plant", district: "Osmanabad", capacity: 30.0, budgeted: 4.44, realized: 4.30, shortfall: 0.14, collection: 96.8, pr: 82.4, cuf: 24.1, status: "green" },
  ],
  "TechSolar Pvt": [
    { name: "Latur Solar Station", district: "Latur", capacity: 20.0, budgeted: 3.60, realized: 3.45, shortfall: 0.15, collection: 95.8, pr: 81.2, cuf: 23.5, status: "green" },
  ],
};

type PlantHealthEntry = {
  name: string;
  district: string;
  capacity: number;
  vendor: string;
  budgeted: number;
  realized: number;
  shortfall: number;
  collection: number;
  pr: number;
  cuf: number;
  availability: number;
  generation: number;
  target: number;
  ldRisk: string;
  ldExposure: number;
  status: "healthy" | "warning" | "critical";
  color: string;
};

const PLANT_STATUS_COLORS: Record<string, string> = {
  "Sakri Solar Park": "#2563eb",
  "Sangli Solar Farm": "#f59e0b",
  "Osmanabad Solar Plant": "#10b981",
  "Latur Solar Station": "#8b5cf6",
  "Beed Solar Park": "#ef4444",
  "Ahmednagar Solar Plant": "#0ea5e9",
  "Devdaithan Solar Plant": "#f97316",
  "Amravati Solar Unit": "#6366f1",
  "Wardha Solar Park": "#14b8a6",
  "Buldhana Solar Farm": "#a855f7",
  "Chandrapur Solar Project": "#e11d48",
  "Bhandara Solar Station": "#84cc16",
};

const vendorHealthData = [
  { vendor: "SolarCo India", plantCount: 2, capacity: 35.2, budgeted: 8.40, realized: 7.55, shortfall: 0.85, collection: 89.9, ldExposure: 0.42, status: "warning", color: "#2955A0" },
  { vendor: "SunPower Tech", plantCount: 5, capacity: 63.2, budgeted: 12.65, realized: 10.92, shortfall: 1.73, collection: 86.3, ldExposure: 0.54, status: "critical", color: "#ef4444" },
  { vendor: "Mega Solar Inc", plantCount: 3, capacity: 48.0, budgeted: 11.52, realized: 10.45, shortfall: 1.07, collection: 90.7, ldExposure: 0.55, status: "warning", color: "#f59e0b" },
  { vendor: "Green Energy Ltd", plantCount: 1, capacity: 18.5, budgeted: 4.44, realized: 4.30, shortfall: 0.14, collection: 96.8, ldExposure: 0.00, status: "healthy", color: "#10b981" },
  { vendor: "TechSolar Pvt", plantCount: 1, capacity: 15.0, budgeted: 3.60, realized: 3.45, shortfall: 0.15, collection: 95.8, ldExposure: 0.00, status: "healthy", color: "#8b5cf6" },
];

const WIDGET_ORDER_KEY = "dashboard-widget-order";
const DEFAULT_WIDGET_ORDER = ["kpi-cards", "vendor-health", "plant-health", "geo-risk", "generation", "commercial", "benchmarking", "advanced"];
const WIDGET_TYPE = "DASHBOARD_WIDGET";

function DraggableWidget({
  id,
  index,
  title,
  customizeMode,
  moveWidget,
  children,
}: {
  id: string;
  index: number;
  title: string;
  customizeMode: boolean;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: WIDGET_TYPE,
    item: () => ({ id, index }),
    canDrag: customizeMode,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: WIDGET_TYPE,
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  preview(drop(ref));

  return (
    <motion.div
      ref={ref}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative group/widget ${isDragging ? "opacity-40" : ""} ${
        customizeMode ? "ring-2 ring-dashed ring-slate-300 rounded-xl" : ""
      } ${isOver && customizeMode ? "ring-[#2955A0] ring-2" : ""}`}
    >
      {customizeMode && (
        <div
          ref={drag}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1 px-1.5 py-2 bg-white border-2 border-slate-300 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:border-[#2955A0] hover:shadow-lg transition-all"
        >
          <GripVertical className="w-4 h-4 text-slate-400" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider [writing-mode:vertical-lr] rotate-180">{title}</span>
        </div>
      )}
      <div className={customizeMode ? "ml-6" : ""}>{children}</div>
    </motion.div>
  );
}

export function Dashboard() {
  const [financialYear, setFinancialYear] = useState("FY 2025-26");
  const [month] = useState(() => {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[now.getMonth()];
  });
  const [stateFilter, setStateFilter] = useState("All States");
  const [vendorFilter, setVendorFilter] = useState("All Vendors");
  const [plantFilter, setPlantFilter] = useState("All Plants");
  const [durationToggle, setDurationToggle] = useState("MTD");
  const [showComparison, setShowComparison] = useState(false);
  const [customizeMode, setCustomizeMode] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WIDGET_ORDER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === DEFAULT_WIDGET_ORDER.length &&
          DEFAULT_WIDGET_ORDER.every((id) => parsed.includes(id)) &&
          new Set(parsed).size === parsed.length
        ) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_WIDGET_ORDER;
  });
  const dashboardRef = useRef<HTMLDivElement>(null);

  const isDefaultOrder = widgetOrder.every((id, i) => id === DEFAULT_WIDGET_ORDER[i]);

  useEffect(() => {
    if (isDefaultOrder) {
      localStorage.removeItem(WIDGET_ORDER_KEY);
    } else {
      localStorage.setItem(WIDGET_ORDER_KEY, JSON.stringify(widgetOrder));
    }
  }, [widgetOrder, isDefaultOrder]);

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    setWidgetOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed);
      return next;
    });
  }, []);

  const resetLayout = useCallback(() => {
    setWidgetOrder(DEFAULT_WIDGET_ORDER);
  }, []);

  // ── Derived filtered data from all 5 top-level filters ───────────────────
  const dashboardData = useMemo(() => {
    const fyFactor = FY_FACTORS[financialYear] ?? 1.00;
    const mFactor  = MONTH_FACTORS[month] ?? 1.00;
    const monthScalar = mFactor / BASE_SEASON; // relative to Feb baseline

    // Plant-level filtering
    const filtered = plantMarkers.filter(p =>
      (stateFilter === "All States" || p.state === stateFilter) &&
      (vendorFilter === "All Vendors" || p.vendor === vendorFilter) &&
      (plantFilter === "All Plants" || String(p.id) === plantFilter)
    );

    const filteredCap = filtered.reduce((s, p) => s + p.capacity, 0);
    const capRatio    = BASE_KPI.plantsCap > 0 ? filteredCap / BASE_KPI.plantsCap : 0;

    // Scaled portfolio metadata
    const filteredPortfolioCap   = filteredCap;
    const filteredPlantCount     = filtered.length;
    const uniqueStates           = [...new Set(filtered.map(p => p.state))];

    // MTD
    const mtdGen    = Math.round(BASE_KPI.mtdGen    * capRatio * fyFactor * monthScalar);
    const mtdTarget = Math.round(BASE_KPI.mtdTarget * capRatio * fyFactor * monthScalar);

    // YTD: cumulative Apr → selected month
    const monthIdx  = Math.max(0, MONTH_ORDER.indexOf(month));
    const ytdSum    = MONTH_ORDER.slice(0, monthIdx + 1).reduce((s, m) => s + (MONTH_FACTORS[m] ?? 1), 0);
    const ytdGen    = Math.round(BASE_KPI.mtdGen    * capRatio * fyFactor * ytdSum / BASE_SEASON);
    const ytdTarget = Math.round(BASE_KPI.mtdTarget * capRatio * fyFactor * ytdSum / BASE_SEASON);

    // Annual: full 12-month
    const allSum      = Object.values(MONTH_FACTORS).reduce((s, v) => s + v, 0);
    const annualGen    = Math.round(BASE_KPI.mtdGen    * capRatio * fyFactor * allSum / BASE_SEASON);
    const annualTarget = Math.round(BASE_KPI.mtdTarget * capRatio * fyFactor * allSum / BASE_SEASON);

    // Period-selected generation
    const periodGen    = durationToggle === "MTD" ? mtdGen    : durationToggle === "YTD" ? ytdGen    : annualGen;
    const periodTarget = durationToggle === "MTD" ? mtdTarget : durationToggle === "YTD" ? ytdTarget : annualTarget;
    const genPct       = periodTarget > 0 ? Math.round((periodGen / periodTarget) * 100) : 0;

    // Weighted CUF & availability (from plant-level data)
    const portfolioCuf     = filteredCap > 0
      ? parseFloat((filtered.reduce((s, p) => s + p.cuf * p.capacity, 0) / filteredCap).toFixed(1)) : 0;
    const gridAvailability = filteredCap > 0
      ? parseFloat((filtered.reduce((s, p) => s + p.availability * p.capacity, 0) / filteredCap).toFixed(1)) : 0;

    // Revenue (₹2/kWh tariff, 91% collection rate)
    const TARIFF = 0.0002; // ₹ Cr per MWh
    const revenueRealized  = parseFloat((periodGen * TARIFF * 0.91).toFixed(1));
    const revenueTarget    = parseFloat((periodTarget * TARIFF).toFixed(1));
    const revenueShortfall = parseFloat(Math.max(0, revenueTarget - revenueRealized).toFixed(2));

    // LD exposure (calibrated: 2 high-risk × 0.55 + 1 medium × 0.14 = 1.24 Cr for all plants)
    const highRisk  = filtered.filter(p => p.ldRisk === "high").length;
    const medRisk   = filtered.filter(p => p.ldRisk === "medium").length;
    const ldExposure = parseFloat((highRisk * 0.55 + medRisk * 0.14).toFixed(2));

    // CO₂ (0.82 tCO₂/MWh emission factor)
    const co2 = Math.round(periodGen * 0.82);

    // Asset Health Index (per-plant scoring)
    const assetHealth = filtered.length > 0
      ? parseFloat((filtered.reduce((s, p) => {
          const score =
            (p.availability - 85) * 0.8
            + (p.cuf / 25 * 100 - 70) * 0.35
            + (p.status === "compliant" ? 12 : p.status === "warning" ? 5 : -5)
            + (p.ldRisk === "none" ? 8 : p.ldRisk === "low" ? 4 : p.ldRisk === "medium" ? 0 : -8)
            + 70;
          return s + Math.min(100, Math.max(50, score));
        }, 0) / filtered.length).toFixed(1))
      : 0;

    // Period change label
    const genChange = fyFactor < 1.0
      ? `-${Math.round((1 - fyFactor) * 100)}% vs FY 2025-26`
      : durationToggle === "MTD" ? "+5.2%" : durationToggle === "YTD" ? "+8.4%" : "+6.1%";

    return {
      filtered, filteredCap, filteredPortfolioCap, filteredPlantCount, uniqueStates,
      mtdGen, mtdTarget, ytdGen, ytdTarget, annualGen, annualTarget,
      periodGen, periodTarget, genPct,
      portfolioCuf, gridAvailability,
      revenueRealized, revenueTarget, revenueShortfall,
      ldExposure, co2, assetHealth, genChange,
    };
  }, [financialYear, month, stateFilter, vendorFilter, plantFilter, durationToggle]);

  // ── Build computed KPI cards from dashboardData ───────────────────────────
  const computedKPIs = useMemo(() => {
    const {
      periodGen, periodTarget, ytdGen, ytdTarget, annualGen, annualTarget,
      portfolioCuf, gridAvailability, revenueRealized, revenueTarget,
      revenueShortfall, ldExposure, co2, assetHealth, filteredPortfolioCap, genChange,
    } = dashboardData;

    const periodLabel = "Generation";

    const ytdLabel = durationToggle === "Annual" ? "Annual Projection" : "Cumulative Generation";
    const ytdVal   = durationToggle === "Annual" ? annualGen   : ytdGen;
    const ytdTgt   = durationToggle === "Annual" ? annualTarget : ytdTarget;

    return strategicKPIs.map(kpi => {
      switch (kpi.id) {
        case "capacity":
          return { ...kpi, value: String(filteredPortfolioCap), actual: filteredPortfolioCap, target: PORTFOLIO_CONFIG.totalCapacity };
        case "mtd-generation":
          return { ...kpi, title: periodLabel, value: periodGen.toLocaleString(), actual: periodGen, target: periodTarget, change: genChange };
        case "ytd-generation":
          return { ...kpi, title: ytdLabel, value: ytdVal.toLocaleString(), actual: ytdVal, target: ytdTgt };
        case "portfolio-cuf":
          return { ...kpi, value: String(portfolioCuf), actual: portfolioCuf,
            compliance: portfolioCuf >= 23 ? "green" : portfolioCuf >= 21 ? "yellow" : "red" };
        case "grid-availability":
          return { ...kpi, value: String(gridAvailability), actual: gridAvailability,
            compliance: gridAvailability >= 98 ? "green" : gridAvailability >= 95 ? "yellow" : "red" };
        case "revenue-realized":
          return { ...kpi, value: `₹${revenueRealized}`, actual: revenueRealized, target: revenueTarget };
        case "revenue-shortfall":
          return { ...kpi, value: `₹${revenueShortfall}`, actual: revenueShortfall,
            compliance: revenueShortfall > 3 ? "red" : revenueShortfall > 1 ? "yellow" : "green" };
        case "ld-exposure":
          return { ...kpi, value: `₹${ldExposure}`, actual: ldExposure,
            compliance: ldExposure > 1 ? "red" : ldExposure > 0.5 ? "yellow" : "green" };
        case "asset-health":
          return { ...kpi, value: String(assetHealth), actual: assetHealth,
            compliance: assetHealth >= 85 ? "green" : assetHealth >= 75 ? "yellow" : "red" };
        case "co2-reduction":
          return { ...kpi, value: co2.toLocaleString(), actual: co2 };
        default:
          return kpi;
      }
    });
  }, [dashboardData, durationToggle]);

  // ── Reactive preview data — recomputes whenever filters change ────────────
  const kpiPreviewData = useMemo<Record<string, KpiPreviewEntry>>(() => {
    const {
      filtered, filteredPortfolioCap, periodGen, periodTarget,
      ytdGen, ytdTarget, portfolioCuf, gridAvailability,
      revenueRealized, revenueTarget, revenueShortfall,
      ldExposure, co2, assetHealth,
    } = dashboardData;

    // Helper: group plants by a key and sum/count
    const groupBy = (key: "state" | "vendor") => {
      const map: Record<string, { cap: number; count: number; cuf: number; avail: number; gen: number; ldHigh: number; ldMed: number }> = {};
      for (const p of filtered) {
        const k = p[key];
        if (!map[k]) map[k] = { cap: 0, count: 0, cuf: 0, avail: 0, gen: 0, ldHigh: 0, ldMed: 0 };
        map[k].cap   += p.capacity;
        map[k].count += 1;
        map[k].cuf   += p.cuf * p.capacity;
        map[k].avail += p.availability * p.capacity;
        map[k].gen   += p.generation;
        if (p.ldRisk === "high")   map[k].ldHigh += 1;
        if (p.ldRisk === "medium") map[k].ldMed  += 1;
      }
      return map;
    };

    const byState  = groupBy("state");
    const byVendor = groupBy("vendor");
    const pctFmt   = (v: number) => `${v.toFixed(1)}%`;

    // --- capacity ---
    const stateCapRows = Object.entries(byState)
      .sort((a, b) => b[1].cap - a[1].cap)
      .map(([state, d]) => ({
        label: state,
        value: `${d.cap} MW`,
        subValue: `${d.count} Plant${d.count !== 1 ? "s" : ""}`,
        status: (d.cap > 30 ? "green" : d.cap > 15 ? "yellow" : "green") as "green"|"yellow"|"red",
      }));
    const stateChartData = Object.entries(byState)
      .sort((a, b) => b[1].cap - a[1].cap)
      .map(([state, d]) => ({ name: state.length > 6 ? state.slice(0, 3) : state, value: d.cap }));

    // --- generation (top 5 plants by generation) ---
    const topPlants = [...filtered].sort((a, b) => b.generation - a.generation).slice(0, 5);
    const genRows = topPlants.map(p => {
      const pct = p.target > 0 ? ((p.generation - p.target) / p.target * 100) : 0;
      return {
        label: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name,
        value: `${p.generation.toLocaleString()} MWh`,
        subValue: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs target`,
        status: (pct >= 0 ? "green" : pct >= -5 ? "yellow" : "red") as "green"|"yellow"|"red",
      };
    });

    // --- ytd quarterly breakdown (scale from ytdGen) ---
    const qFactor = ytdTarget > 0 ? ytdGen / ytdTarget : 1;
    const ytdRows = [
      { label: "Q1 (Apr-Jun)", value: `${Math.round(ytdGen * 0.26).toLocaleString()} MWh`, subValue: `${Math.round(qFactor * 93)}% of target`, status: (qFactor > 0.92 ? "green" : "yellow") as "green"|"yellow"|"red" },
      { label: "Q2 (Jul-Sep)", value: `${Math.round(ytdGen * 0.25).toLocaleString()} MWh`, subValue: `${Math.round(qFactor * 91)}% of target`, status: "yellow" as const },
      { label: "Q3 (Oct-Dec)", value: `${Math.round(ytdGen * 0.27).toLocaleString()} MWh`, subValue: `${Math.round(qFactor * 95)}% of target`, status: "green" as const },
      { label: "Q4 (Jan-Feb)", value: `${Math.round(ytdGen * 0.22).toLocaleString()} MWh`, subValue: "On track", status: "green" as const },
    ];

    // --- CUF by state ---
    const cufRows = Object.entries(byState)
      .sort((a, b) => (b[1].cap > 0 ? b[1].cuf / b[1].cap : 0) - (a[1].cap > 0 ? a[1].cuf / a[1].cap : 0))
      .map(([state, d]) => {
        const wCuf = d.cap > 0 ? +(d.cuf / d.cap).toFixed(1) : 0;
        return {
          label: `${state} Cluster`,
          value: pctFmt(wCuf),
          subValue: "Target: 24%",
          status: (wCuf >= 23 ? "green" : wCuf >= 21 ? "yellow" : "red") as "green"|"yellow"|"red",
        };
      });
    const bestPlant  = [...filtered].sort((a, b) => b.cuf - a.cuf)[0];
    const worstPlant = [...filtered].sort((a, b) => a.cuf - b.cuf)[0];
    if (bestPlant)  cufRows.push({ label: `Best: ${bestPlant.name.split(" ")[0]}`,  value: pctFmt(bestPlant.cuf),  subValue: "Above target", status: "green"  });
    if (worstPlant) cufRows.push({ label: `Worst: ${worstPlant.name.split(" ")[0]}`, value: pctFmt(worstPlant.cuf), subValue: "Below target", status: (worstPlant.cuf < 20 ? "red" : "yellow") });

    // --- Grid availability by state ---
    const gaRows = Object.entries(byState)
      .sort((a, b) => (b[1].cap > 0 ? b[1].avail / b[1].cap : 0) - (a[1].cap > 0 ? a[1].avail / a[1].cap : 0))
      .map(([state, d]) => {
        const wAvail = d.cap > 0 ? +(d.avail / d.cap).toFixed(1) : 0;
        const downHrs = Math.round((100 - wAvail) / 100 * 720);
        return {
          label: `${state} Grid`,
          value: pctFmt(wAvail),
          subValue: `${downHrs} hrs downtime`,
          status: (wAvail >= 97 ? "green" : wAvail >= 95 ? "yellow" : "red") as "green"|"yellow"|"red",
        };
      });
    gaRows.push({ label: "Scheduled Outage", value: "1.2%", subValue: "8.6 hrs", status: "yellow" });
    gaRows.push({ label: "Unscheduled Outage", value: `${Math.max(0, 100 - gridAvailability - 1.2).toFixed(1)}%`, subValue: "Unplanned", status: "red" });

    // --- Revenue ---
    const revenueRows = [
      { label: "Energy Sale",        value: `₹${(revenueRealized * 0.87).toFixed(1)} Cr`, subValue: "87% of total", status: "green" as const },
      { label: "REC Income",         value: `₹${(revenueRealized * 0.074).toFixed(1)} Cr`, subValue: "7.4% of total", status: "green" as const },
      { label: "Incentives & Bonus", value: `₹${(revenueRealized * 0.056).toFixed(1)} Cr`, subValue: "5.6% of total", status: "yellow" as const },
      { label: "Pending Collection", value: `₹${(revenueTarget - revenueRealized + 0.5).toFixed(1)} Cr`, subValue: `Overdue: ₹${(revenueShortfall * 0.3).toFixed(2)} Cr`, status: (revenueShortfall > 2 ? "red" : "yellow") as "green"|"yellow"|"red" },
    ];

    // --- Shortfall breakdown ---
    const shortfallRows = [
      { label: "Generation Shortfall", value: `₹${(revenueShortfall * 0.52).toFixed(2)} Cr`, subValue: "52% of gap", status: "red" as const },
      { label: "Grid Curtailment",     value: `₹${(revenueShortfall * 0.22).toFixed(2)} Cr`, subValue: "22% of gap", status: "yellow" as const },
      { label: "Equipment Downtime",   value: `₹${(revenueShortfall * 0.19).toFixed(2)} Cr`, subValue: "19% of gap", status: "yellow" as const },
      { label: "Force Majeure",        value: `₹${(revenueShortfall * 0.07).toFixed(2)} Cr`, subValue: "7% of gap",  status: "green" as const },
    ];

    // --- LD exposure by vendor ---
    const ldRows = Object.entries(byVendor)
      .sort((a, b) => (b[1].ldHigh * 0.55 + b[1].ldMed * 0.14) - (a[1].ldHigh * 0.55 + a[1].ldMed * 0.14))
      .map(([vendor, d]) => {
        const exp = +(d.ldHigh * 0.55 + d.ldMed * 0.14).toFixed(2);
        return {
          label: vendor,
          value: `₹${exp} Cr`,
          subValue: `${d.count} plant${d.count !== 1 ? "s" : ""} · ${exp > 0.4 ? "High" : exp > 0 ? "Medium" : "None"} risk`,
          status: (exp > 0.4 ? "red" : exp > 0 ? "yellow" : "green") as "green"|"yellow"|"red",
        };
      });

    // --- Asset health components (derived) ---
    const prScore = Math.min(100, Math.round(portfolioCuf / 25 * 100));
    const avScore = Math.min(100, Math.round(gridAvailability));
    const downScore = Math.min(100, Math.round(85 + (gridAvailability - 95)));
    const compScore = Math.round(filtered.filter(p => p.status === "compliant").length / Math.max(1, filtered.length) * 100);
    const healthRows = [
      { label: "Performance Ratio", value: `${prScore} / 100`, subValue: "Weight: 35%", status: (prScore >= 80 ? "green" : "yellow") as "green"|"yellow"|"red" },
      { label: "Availability Score", value: `${avScore} / 100`, subValue: "Weight: 30%", status: (avScore >= 95 ? "green" : "yellow") as "green"|"yellow"|"red" },
      { label: "Downtime Score",     value: `${downScore} / 100`, subValue: "Weight: 20%", status: (downScore >= 85 ? "yellow" : "red") as "green"|"yellow"|"red" },
      { label: "Compliance Score",   value: `${compScore} / 100`, subValue: "Weight: 15%", status: (compScore >= 80 ? "green" : "yellow") as "green"|"yellow"|"red" },
    ];

    // --- CO2 by state ---
    const co2Rows = Object.entries(byState)
      .sort((a, b) => b[1].gen - a[1].gen)
      .map(([state, d]) => {
        const stateCo2 = Math.round(d.gen * 0.82);
        const share = co2 > 0 ? (stateCo2 / co2 * 100).toFixed(1) : "0";
        return {
          label: `${state} Plants`,
          value: `${stateCo2.toLocaleString()} T`,
          subValue: `${share}% share`,
          status: "green" as const,
        };
      });
    const treesEquiv = Math.round(co2 / 22);
    co2Rows.push({ label: "Equivalent Trees", value: `${(treesEquiv / 1000).toFixed(1)}K`, subValue: "Trees planted equiv.", status: "green" });

    const periodLabel = durationToggle === "MTD" ? "Monthly" : durationToggle === "YTD" ? "Year-to-Date" : "Annual";

    return {
      capacity: {
        title: "Installed Capacity Breakdown",
        rows: stateCapRows,
        chart: { label: "State-wise Capacity (MW)", data: stateChartData },
        footer: `Total filtered: ${filteredPortfolioCap} MW · ${filtered.length} plant${filtered.length !== 1 ? "s" : ""}`,
      },
      "mtd-generation": {
        title: `${periodLabel} Generation Details`,
        rows: genRows.length > 0 ? genRows : [{ label: "No plants in filter", value: "—", status: "yellow" }],
        chart: {
          label: "Weekly Generation (MWh)",
          data: [
            { name: "W1", value: Math.round(periodGen * 0.23) },
            { name: "W2", value: Math.round(periodGen * 0.26) },
            { name: "W3", value: Math.round(periodGen * 0.28) },
            { name: "W4", value: Math.round(periodGen * 0.23) },
          ],
        },
        footer: `${periodLabel} total: ${periodGen.toLocaleString()} MWh · Target: ${periodTarget.toLocaleString()} MWh`,
      },
      "ytd-generation": {
        title: "Cumulative Generation Summary",
        rows: ytdRows,
        chart: {
          label: "Quarterly Generation (GWh)",
          data: [
            { name: "Q1", value: +(ytdGen * 0.26 / 1000).toFixed(1) },
            { name: "Q2", value: +(ytdGen * 0.25 / 1000).toFixed(1) },
            { name: "Q3", value: +(ytdGen * 0.27 / 1000).toFixed(1) },
            { name: "Q4", value: +(ytdGen * 0.22 / 1000).toFixed(1) },
          ],
        },
        footer: `Cumulative pace: ${ytdTarget > 0 ? Math.round(ytdGen / ytdTarget * 100) : 0}% of annual plan`,
      },
      "portfolio-cuf": {
        title: "CUF Analysis by Cluster",
        rows: cufRows,
        footer: `Portfolio weighted CUF: ${portfolioCuf}% · Gap to target: ${(portfolioCuf - 24).toFixed(1)}%`,
      },
      "grid-availability": {
        title: "Grid Availability Breakdown",
        rows: gaRows,
        footer: `Weighted portfolio GA: ${gridAvailability}% · Target: 98%`,
      },
      "revenue-realized": {
        title: "Revenue Breakdown (₹ Cr)",
        rows: revenueRows,
        footer: `Collection efficiency: 91.4% · Target: ₹${revenueTarget} Cr`,
      },
      "revenue-shortfall": {
        title: "Revenue Shortfall Analysis",
        rows: shortfallRows,
        footer: `Total shortfall: ₹${revenueShortfall} Cr · Net exposure: ₹${(revenueShortfall * 1.2).toFixed(2)} Cr`,
      },
      "ld-exposure": {
        title: "LD Exposure by Vendor",
        rows: ldRows.length > 0 ? ldRows : [{ label: "No LD exposure in filter", value: "₹0 Cr", status: "green" }],
        footer: `Total LD exposure: ₹${ldExposure} Cr · ${filtered.filter(p => p.ldRisk === "high").length} high-risk plant${filtered.filter(p => p.ldRisk === "high").length !== 1 ? "s" : ""}`,
      },
      "asset-health": {
        title: "Asset Health Components",
        rows: healthRows,
        footer: `Weighted Index: ${assetHealth} · Target: 90.0 · Gap: ${(+assetHealth - 90).toFixed(1)}`,
      },
      "co2-reduction": {
        title: "CO₂ Reduction Breakdown",
        rows: co2Rows,
        chart: {
          label: "Monthly CO₂ Saved (kT)",
          data: [
            { name: "Oct", value: +(co2 * 0.21 / 1000).toFixed(1) },
            { name: "Nov", value: +(co2 * 0.20 / 1000).toFixed(1) },
            { name: "Dec", value: +(co2 * 0.22 / 1000).toFixed(1) },
            { name: "Jan", value: +(co2 * 0.19 / 1000).toFixed(1) },
            { name: "Feb", value: +(co2 * 0.18 / 1000).toFixed(1) },
          ],
        },
        footer: `Grid emission factor: 0.82 tCO₂/MWh · ${periodLabel} CO₂ saved: ${(co2 / 1000).toFixed(1)} kT`,
      },
    };
  }, [dashboardData, durationToggle]);

  const filteredMtdData = useMemo(() => {
    const filtered = dashboardData.filtered;
    return filtered
      .map((p: any) => ({
        plant: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
        target: p.target,
        actual: p.generation,
      }))
      .sort((a: any, b: any) => b.actual - a.actual)
      .slice(0, 6);
  }, [dashboardData]);

  const mergedMtdData = filteredMtdData.map((d: any) => ({
    ...d,
    prevActual: Math.round(d.actual * 0.92),
    prevTarget: Math.round(d.target * 0.93),
  }));

  const filteredVendorHealthData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const vendorMap: Record<string, { plants: any[]; cap: number }> = {};
    for (const p of filtered) {
      if (!vendorMap[p.vendor]) vendorMap[p.vendor] = { plants: [], cap: 0 };
      vendorMap[p.vendor].plants.push(p);
      vendorMap[p.vendor].cap += p.capacity;
    }
    const colors: Record<string, string> = {
      "SolarCo India": "#2955A0",
      "SunPower Tech": "#ef4444",
      "Mega Solar Inc": "#f59e0b",
      "Green Energy Ltd": "#10b981",
      "TechSolar Pvt": "#8b5cf6",
    };
    return Object.entries(vendorMap).map(([vendor, data]) => {
      const plants = data.plants;
      const cap = data.cap;
      const origVendor = vendorHealthData.find(v => v.vendor === vendor);
      const origCap = origVendor ? origVendor.capacity : cap;
      const capScale = origCap > 0 ? cap / origCap : 1;
      const budgeted = origVendor ? parseFloat((origVendor.budgeted * capScale).toFixed(2)) : parseFloat((cap * 0.24).toFixed(2));
      const realized = origVendor ? parseFloat((origVendor.realized * capScale).toFixed(2)) : parseFloat((budgeted * 0.9).toFixed(2));
      const shortfall = parseFloat(Math.max(0, budgeted - realized).toFixed(2));
      const collection = origVendor ? origVendor.collection : 90;
      const ldExp = parseFloat((plants.filter((p: any) => p.ldRisk === "high").length * 0.55 + plants.filter((p: any) => p.ldRisk === "medium").length * 0.14).toFixed(2));
      const pct = budgeted > 0 ? realized / budgeted : 0;
      const origStatus = origVendor ? origVendor.status : "healthy";
      const status = plants.length === (origVendor?.plantCount ?? 0) ? origStatus : (pct < 0.88 ? "critical" : pct < 0.93 ? "warning" : "healthy");
      return {
        vendor,
        plantCount: plants.length,
        capacity: cap,
        budgeted,
        realized,
        shortfall,
        collection,
        ldExposure: ldExp,
        status,
        color: colors[vendor] || "#64748b",
      };
    });
  }, [dashboardData]);

  const filteredPlantHealthData = useMemo((): PlantHealthEntry[] => {
    const filtered = dashboardData.filtered;
    const allPlantDetails = Object.entries(vendorPlantDetails).flatMap(([vendor, plants]) =>
      plants.map(p => ({ ...p, vendor }))
    );
    return filtered.map((pm: any) => {
      const detail = allPlantDetails.find(d => d.name === pm.name);
      const realizationPct = detail && detail.budgeted > 0 ? (detail.realized / detail.budgeted) * 100 : 0;
      const ldExposure = pm.ldRisk === "high" ? 0.55 : pm.ldRisk === "medium" ? 0.14 : pm.ldRisk === "low" ? 0.06 : 0;
      const status: "healthy" | "warning" | "critical" =
        realizationPct >= 95 || (realizationPct === 0 && pm.status === "compliant") ? "healthy"
        : realizationPct >= 88 ? "warning" : "critical";
      return {
        name: pm.name,
        district: pm.district,
        capacity: pm.capacity,
        vendor: pm.vendor,
        budgeted: detail?.budgeted ?? 0,
        realized: detail?.realized ?? 0,
        shortfall: detail?.shortfall ?? 0,
        collection: detail?.collection ?? 0,
        pr: detail?.pr ?? 0,
        cuf: pm.cuf,
        availability: pm.availability,
        generation: pm.generation,
        target: pm.target,
        ldRisk: pm.ldRisk,
        ldExposure,
        status,
        color: PLANT_STATUS_COLORS[pm.name] || "#64748b",
      };
    }).sort((a, b) => b.capacity - a.capacity);
  }, [dashboardData]);

  const filteredRiskData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const nonCompliantPlants = filtered.filter((p: any) => p.status === "non-compliant" || p.status === "curtailment").length;
    const highLDRisk = filtered.filter((p: any) => p.ldRisk === "high").length;
    const escalationTriggered = Math.min(nonCompliantPlants, Math.ceil(nonCompliantPlants * 0.4));
    const pendingJMR = filtered.length > 0 ? Math.max(1, Math.round(filtered.length * 0.27)) : 0;
    const overdueJMR = Math.max(0, Math.round(pendingJMR * 0.25));
    const ldExposureCr = parseFloat((highLDRisk * 0.55 + filtered.filter((p: any) => p.ldRisk === "medium").length * 0.14).toFixed(2));
    const complianceRatio = filtered.length > 0 ? filtered.filter((p: any) => p.status === "compliant").length / filtered.length : 1;
    const riskScore = Math.round(100 - complianceRatio * 50 - (1 - highLDRisk / Math.max(1, filtered.length)) * 20);

    const topUnderperforming = [...filtered]
      .sort((a: any, b: any) => a.cuf - b.cuf)
      .slice(0, 3)
      .map((p: any) => ({ plant: p.name, state: p.state, cuf: p.cuf, gap: parseFloat((p.cuf - 24).toFixed(1)) }));

    const recentAlerts = filtered
      .filter((p: any) => p.status !== "compliant")
      .slice(0, 5)
      .map((p: any, i: number) => {
        const catMap: Record<string, string> = { "non-compliant": "Non-Compliant", curtailment: "Curtailment", warning: "Warning" };
        const sevMap: Record<string, string> = { "non-compliant": "critical", curtailment: "high", warning: "medium" };
        return {
          id: i + 1,
          category: catMap[p.status] || "Warning",
          plant: p.name,
          state: p.state,
          daysOpen: Math.round(Math.random() * 10) + 1,
          severity: sevMap[p.status] || "medium",
          detail: p.status === "non-compliant"
            ? `CUF ${p.cuf}% — ${(24 - p.cuf).toFixed(1)}% below target`
            : p.status === "curtailment"
            ? `Grid curtailment — ${(100 - p.availability).toFixed(1)}% generation loss`
            : `CUF trending below threshold`,
        };
      });

    const vendorLDMap: Record<string, { plants: number; ldCr: number; risk: string }> = {};
    for (const p of filtered) {
      if (!vendorLDMap[p.vendor]) vendorLDMap[p.vendor] = { plants: 0, ldCr: 0, risk: "low" };
      vendorLDMap[p.vendor].plants++;
      if (p.ldRisk === "high") vendorLDMap[p.vendor].ldCr += 0.55;
      if (p.ldRisk === "medium") vendorLDMap[p.vendor].ldCr += 0.14;
    }
    const vendorLDExposure = Object.entries(vendorLDMap)
      .filter(([, d]) => d.ldCr > 0)
      .sort((a, b) => b[1].ldCr - a[1].ldCr)
      .map(([vendor, d]) => ({
        vendor,
        plants: d.plants,
        ldCr: parseFloat(d.ldCr.toFixed(2)),
        risk: d.ldCr > 0.4 ? "high" : d.ldCr > 0 ? "medium" : "low",
      }));

    return {
      nonCompliantPlants,
      highLDRisk,
      escalationTriggered,
      pendingJMR,
      overdueJMR,
      ldExposureCr,
      riskScore: Math.max(0, Math.min(100, riskScore)),
      topUnderperforming,
      complianceTrend: riskData.complianceTrend,
      recentAlerts: recentAlerts.length > 0 ? recentAlerts : [{ id: 1, category: "None", plant: "No alerts", state: "", daysOpen: 0, severity: "medium", detail: "All plants operating normally" }],
      vendorLDExposure,
    };
  }, [dashboardData]);

  const filteredLdExposureData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const vendorMap: Record<string, { plants: number; ldAmount: number }> = {};
    for (const p of filtered) {
      if (!vendorMap[p.vendor]) vendorMap[p.vendor] = { plants: 0, ldAmount: 0 };
      vendorMap[p.vendor].plants++;
      if (p.ldRisk === "high") vendorMap[p.vendor].ldAmount += 0.55;
      if (p.ldRisk === "medium") vendorMap[p.vendor].ldAmount += 0.14;
    }
    return Object.entries(vendorMap)
      .map(([vendor, d]) => ({
        vendor,
        plants: d.plants,
        ldAmount: parseFloat(d.ldAmount.toFixed(2)),
        severity: d.ldAmount > 0.4 ? "high" : d.ldAmount > 0 ? "medium" : "none",
      }))
      .sort((a, b) => b.ldAmount - a.ldAmount);
  }, [dashboardData]);

  const filteredVendorRankingData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const vendorMap: Record<string, { plants: any[] }> = {};
    for (const p of filtered) {
      if (!vendorMap[p.vendor]) vendorMap[p.vendor] = { plants: [] };
      vendorMap[p.vendor].plants.push(p);
    }
    return Object.entries(vendorMap)
      .map(([vendor, data]) => {
        const plants = data.plants;
        const avgCuf = parseFloat((plants.reduce((s: number, p: any) => s + p.cuf, 0) / plants.length).toFixed(1));
        const avgAvail = parseFloat((plants.reduce((s: number, p: any) => s + p.availability, 0) / plants.length).toFixed(1));
        const ldExp = parseFloat((plants.filter((p: any) => p.ldRisk === "high").length * 0.55 + plants.filter((p: any) => p.ldRisk === "medium").length * 0.14).toFixed(2));
        const compliance = parseFloat((plants.filter((p: any) => p.status === "compliant").length / plants.length * 100).toFixed(1));
        return { rank: 0, vendor, plants: plants.length, avgCuf, avgAvailability: avgAvail, ldExposure: ldExp, compliance };
      })
      .sort((a, b) => b.avgCuf - a.avgCuf || a.ldExposure - b.ldExposure)
      .map((v, i) => ({ ...v, rank: i + 1 }));
  }, [dashboardData]);

  const filteredClusterData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const stateMap: Record<string, { plants: any[] }> = {};
    for (const p of filtered) {
      if (!stateMap[p.state]) stateMap[p.state] = { plants: [] };
      stateMap[p.state].plants.push(p);
    }
    return Object.entries(stateMap).map(([state, data]) => {
      const plants = data.plants;
      const cap = plants.reduce((s: number, p: any) => s + p.capacity, 0);
      const gen = plants.reduce((s: number, p: any) => s + p.generation, 0);
      const avgCuf = parseFloat((plants.reduce((s: number, p: any) => s + p.cuf, 0) / plants.length).toFixed(1));
      const avgAvail = parseFloat((plants.reduce((s: number, p: any) => s + p.availability, 0) / plants.length).toFixed(1));
      const ldExp = parseFloat((plants.filter((p: any) => p.ldRisk === "high").length * 0.55 + plants.filter((p: any) => p.ldRisk === "medium").length * 0.14).toFixed(2));
      return { state, capacity: cap, generation: gen, cuf: avgCuf, availability: avgAvail, ldExposure: ldExp };
    });
  }, [dashboardData]);

  const filteredRevenueWaterfall = useMemo(() => {
    const { revenueTarget, revenueRealized } = dashboardData;
    const budgeted = parseFloat((revenueTarget * 1.08).toFixed(1));
    const expected = parseFloat((revenueTarget * 1.02).toFixed(1));
    return [
      { stage: "Budgeted", value: budgeted, delta: 0 },
      { stage: "Expected", value: expected, delta: parseFloat((expected - budgeted).toFixed(1)) },
      { stage: "Actual", value: revenueTarget, delta: parseFloat((revenueTarget - expected).toFixed(1)) },
      { stage: "Realized", value: revenueRealized, delta: parseFloat((revenueRealized - revenueTarget).toFixed(1)) },
    ];
  }, [dashboardData]);

  const filteredOmDeviation = useMemo(() => {
    const filtered = dashboardData.filtered;
    const avgCuf = filtered.length > 0 ? filtered.reduce((s: number, p: any) => s + p.cuf, 0) / filtered.length : 0;
    const actualPR = parseFloat((avgCuf / 25 * 100 * 0.95).toFixed(1));
    const prBenchmark = 82.0;
    const gap = Math.max(0, prBenchmark - actualPR);
    const settlement = parseFloat((gap * 0.55).toFixed(2));
    return { prBenchmark, actualPR, settlementAmount: settlement };
  }, [dashboardData]);

  const filteredCufTrend = useMemo(() => {
    const { portfolioCuf } = dashboardData;
    const baseVariance = [-0.9, -0.6, 0.0, -0.3, -1.2, -0.7, -0.2, 0.2, -0.1, -0.4, 0.1, 0.0];
    const allData = cufTrendData.map((d, i) => ({
      ...d,
      portfolio: parseFloat((portfolioCuf + baseVariance[i]).toFixed(1)),
      prevPortfolio: prevYearCufTrendData[i].prevPortfolio,
    }));

    const cufMonthShort = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
    const monthShort = month.substring(0, 3);
    const currentIdx = cufMonthShort.indexOf(monthShort);

    if (durationToggle === "MTD") {
      return currentIdx >= 0 ? [allData[currentIdx]] : [allData[allData.length - 1]];
    }
    if (durationToggle === "YTD") {
      const aprIdx = 1;
      const endIdx = currentIdx >= aprIdx ? currentIdx : allData.length - 1;
      return allData.slice(aprIdx, endIdx + 1);
    }
    return allData;
  }, [dashboardData, durationToggle, month]);

  const filteredDowntimeData = useMemo(() => {
    const filtered = dashboardData.filtered;
    const hasCurtailment = filtered.some((p: any) => p.status === "curtailment");
    const hasNonCompliant = filtered.some((p: any) => p.status === "non-compliant");
    const base = [
      { name: "Grid Outage", value: hasNonCompliant ? 38 : 30, color: "#EF4444" },
      { name: "Equipment Failure", value: hasNonCompliant ? 25 : 20, color: "#F59E0B" },
      { name: "Planned Shutdown", value: 18, color: "#10B981" },
      { name: "Curtailment", value: hasCurtailment ? 12 : 5, color: "#E8A800" },
      { name: "Force Majeure", value: 7, color: "#8B5CF6" },
    ];
    const total = base.reduce((s, d) => s + d.value, 0);
    return base.map(d => ({ ...d, value: Math.round(d.value / total * 100) }));
  }, [dashboardData]);

  const filteredLpiData = useMemo(() => {
    const { filteredCap } = dashboardData;
    const ratio = BASE_KPI.plantsCap > 0 ? filteredCap / BASE_KPI.plantsCap : 1;
    return lpiData.map(d => ({
      ...d,
      energyLostMWh: Math.round(d.energyLostMWh * ratio),
      expectedMWh: Math.round(d.expectedMWh * ratio),
    }));
  }, [dashboardData]);

  const widgetRegistry: Record<string, { title: string; render: () => React.ReactNode }> = {
    "kpi-cards": {
      title: "KPI Cards",
      render: () => (
          <div className="grid grid-cols-5 gap-3">
            {computedKPIs.map((kpi) => {
              const Icon = kpi.icon;
              const progressPercent = kpi.target > 0 ? Math.min(100, (kpi.actual / kpi.target) * 100) : 100;
              const preview = kpiPreviewData[kpi.id];
              return (
                <KpiCardWithPreview key={kpi.id} kpi={kpi} preview={preview}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="cursor-pointer"
                  >
                    {(() => {
                      const accentColor =
                        kpi.compliance === "green"  ? { bar: "#10B981", border: "border-l-emerald-500", bg: "kpi-card-green" } :
                        kpi.compliance === "yellow" ? { bar: "#E8A800", border: "border-l-amber-500",   bg: "kpi-card-yellow" } :
                        kpi.compliance === "red"    ? { bar: "#EF4444", border: "border-l-rose-500",    bg: "kpi-card-red" } :
                                                      { bar: "#94a3b8", border: "border-l-slate-400",   bg: "kpi-card-stable" };
                      return (
                        <Card className={`border border-slate-200 border-l-4 ${accentColor.border} shadow-sm hover:shadow-md transition-all overflow-hidden ${accentColor.bg}`}>
                          <div style={{ height: 2, background: `linear-gradient(90deg, ${accentColor.bar}, ${accentColor.bar}88)`, flexShrink: 0 }} />
                          <CardContent className="px-3 py-2">
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wide mb-0.5 truncate">
                                  {kpi.title}
                                </p>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-xl font-bold text-slate-900 leading-tight">{kpi.value}</span>
                                  <span className="text-[10px] font-medium text-slate-600">{kpi.unit}</span>
                                </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full shadow-sm shrink-0 mt-0.5 ${complianceColors[kpi.compliance]}`} style={{ boxShadow: `0 0 4px ${accentColor.bar}99` }} />
                            </div>
                            <div className="mb-1.5">
                              <div className="flex items-center justify-between text-[9px] mb-0.5">
                                <span className="text-slate-600 truncate">Target: {kpi.target} {kpi.unit}</span>
                                <span className="font-bold text-slate-900 shrink-0 ml-1">{progressPercent.toFixed(0)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-0.5" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {kpi.trend === "up" ? (
                                  <ArrowUp className="w-2.5 h-2.5 text-emerald-600" />
                                ) : kpi.trend === "down" ? (
                                  <ArrowDown className="w-2.5 h-2.5 text-rose-600" />
                                ) : (
                                  <div className="w-2.5 h-2.5" />
                                )}
                                <span className={`text-[9px] font-bold ${
                                  kpi.trend === "up" ? "text-emerald-600" : 
                                  kpi.trend === "down" ? "text-rose-600" : "text-slate-600"
                                }`}>
                                  {kpi.change}
                                </span>
                                <span className="text-[9px] text-slate-500">
                                  {durationToggle === "MTD" ? "MoM" : durationToggle === "YTD" ? "YoY" : "YoY"}
                                </span>
                              </div>
                              <div className="h-5 w-14">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={kpi.sparkline.map((val) => ({ value: val }))}>
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke={kpi.compliance === "green" ? "#10B981" : kpi.compliance === "yellow" ? "#E8A800" : "#EF4444"}
                                      strokeWidth={1.5}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </motion.div>
                </KpiCardWithPreview>
              );
            })}
          </div>
      ),
    },
    "vendor-health": {
      title: "Vendor Health",
      render: () => (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2955A0]" />
                Vendor Revenue Health
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Realization performance by vendor — FY 2025-26</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: "Critical", count: filteredVendorHealthData.filter(v => v.status === "critical").length, cls: "bg-rose-100 text-rose-700" },
                { label: "At Risk", count: filteredVendorHealthData.filter(v => v.status === "warning").length, cls: "bg-amber-100 text-amber-700" },
                { label: "Healthy", count: filteredVendorHealthData.filter(v => v.status === "healthy").length, cls: "bg-emerald-100 text-emerald-700" },
              ].filter(s => s.count > 0).map(s => (
                <Badge key={s.label} className={`text-[9px] ${s.cls}`}>{s.count} {s.label}</Badge>
              ))}
            </div>
          </div>
          <div className={`grid gap-3 ${filteredVendorHealthData.length >= 5 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : filteredVendorHealthData.length >= 3 ? "grid-cols-2 md:grid-cols-3" : filteredVendorHealthData.length === 2 ? "grid-cols-2" : "grid-cols-1 max-w-xs"}`}>
            {filteredVendorHealthData.map((v) => {
              const pct = (v.realized / v.budgeted) * 100;
              const circumference = 2 * Math.PI * 36;
              const offset = circumference - (circumference * Math.min(pct, 100)) / 100;
              return (
                <VendorCardWithPreview key={v.vendor} vendor={v}>
                  <Card className={`border-2 ${v.status === "critical" ? "border-rose-200 bg-rose-50/30" : v.status === "warning" ? "border-amber-200 bg-amber-50/30" : "border-emerald-200 bg-emerald-50/30"} relative overflow-hidden cursor-pointer`}>
                    <CardContent className="p-4 flex flex-col items-center">
                      <Badge className={`absolute top-2 right-2 text-[8px] ${v.status === "healthy" ? "bg-emerald-100 text-emerald-700" : v.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                        {v.status === "healthy" ? "Healthy" : v.status === "warning" ? "At Risk" : "Critical"}
                      </Badge>
                      <div className="relative w-20 h-20 mb-2">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                          <circle cx="40" cy="40" r="36" fill="none" stroke={v.color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold" style={{ color: v.color }}>{pct.toFixed(0)}%</span>
                          <span className="text-[7px] text-slate-400">realized</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-800 text-center leading-tight">{v.vendor}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{v.plantCount} plants · {v.capacity} MW</div>
                      <div className="w-full mt-3 space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Budgeted</span>
                          <span className="font-semibold text-slate-600">₹{v.budgeted.toFixed(2)} Cr</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Realized</span>
                          <span className="font-bold" style={{ color: v.color }}>₹{v.realized.toFixed(2)} Cr</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Shortfall</span>
                          <span className={`font-bold ${v.shortfall > 1 ? "text-rose-600" : "text-amber-600"}`}>₹{v.shortfall.toFixed(2)} Cr</span>
                        </div>
                        {v.ldExposure > 0 && (
                          <div className="flex justify-between text-[9px]">
                            <span className="text-slate-400">LD Exposure</span>
                            <span className="font-bold text-orange-600">₹{v.ldExposure.toFixed(2)} Cr</span>
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-400">Collection</span>
                          <Badge className={`text-[8px] px-1.5 ${v.collection >= 93 ? "bg-emerald-100 text-emerald-700" : v.collection >= 88 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                            {v.collection}%
                          </Badge>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${v.collection}%`, backgroundColor: v.collection >= 93 ? "#10b981" : v.collection >= 88 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </VendorCardWithPreview>
              );
            })}
          </div>
        </div>
      ),
    },
    "plant-health": {
      title: "Plant Health",
      render: () => (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Factory className="w-4 h-4 text-[#2955A0]" />
                Plant Revenue Health
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Revenue realization by plant — hover for detailed breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: "Critical", count: filteredPlantHealthData.filter(p => p.status === "critical").length, cls: "bg-rose-100 text-rose-700" },
                { label: "At Risk", count: filteredPlantHealthData.filter(p => p.status === "warning").length, cls: "bg-amber-100 text-amber-700" },
                { label: "Healthy", count: filteredPlantHealthData.filter(p => p.status === "healthy").length, cls: "bg-emerald-100 text-emerald-700" },
              ].filter(s => s.count > 0).map(s => (
                <Badge key={s.label} className={`text-[9px] ${s.cls}`}>{s.count} {s.label}</Badge>
              ))}
            </div>
          </div>
          <div className={`grid gap-3 ${filteredPlantHealthData.length >= 8 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : filteredPlantHealthData.length >= 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : filteredPlantHealthData.length >= 2 ? "grid-cols-2" : "grid-cols-1 max-w-xs"}`}>
            {filteredPlantHealthData.map((plant) => {
              const pct = plant.budgeted > 0 ? (plant.realized / plant.budgeted) * 100 : 0;
              const circumference = 2 * Math.PI * 36;
              const offset = circumference - (circumference * Math.min(pct, 100)) / 100;
              return (
                <PlantCardWithPreview key={plant.name} plant={plant}>
                  <Card className={`border-2 ${plant.status === "critical" ? "border-rose-200 bg-rose-50/30" : plant.status === "warning" ? "border-amber-200 bg-amber-50/30" : "border-emerald-200 bg-emerald-50/30"} relative overflow-hidden cursor-pointer`}>
                    <CardContent className="p-4 flex flex-col items-center">
                      <Badge className={`absolute top-2 right-2 text-[8px] ${plant.status === "healthy" ? "bg-emerald-100 text-emerald-700" : plant.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                        {plant.status === "healthy" ? "Healthy" : plant.status === "warning" ? "At Risk" : "Critical"}
                      </Badge>
                      <div className="relative w-20 h-20 mb-2">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                          <circle cx="40" cy="40" r="36" fill="none" stroke={plant.color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold" style={{ color: plant.color }}>{pct.toFixed(0)}%</span>
                          <span className="text-[7px] text-slate-400">realized</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-800 text-center leading-tight">{plant.name}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{plant.district}, MH · {plant.vendor}</div>
                      <div className="text-[9px] text-slate-400">{plant.capacity} MW · CUF {plant.cuf}%</div>
                      <div className="w-full mt-3 space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Budgeted</span>
                          <span className="font-semibold text-slate-600">₹{plant.budgeted.toFixed(2)} Cr</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Realized</span>
                          <span className="font-bold" style={{ color: plant.color }}>₹{plant.realized.toFixed(2)} Cr</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">Shortfall</span>
                          <span className={`font-bold ${plant.shortfall > 0.3 ? "text-rose-600" : "text-amber-600"}`}>₹{plant.shortfall.toFixed(2)} Cr</span>
                        </div>
                        {plant.ldExposure > 0 && (
                          <div className="flex justify-between text-[9px]">
                            <span className="text-slate-400">LD Exposure</span>
                            <span className="font-bold text-orange-600">₹{plant.ldExposure.toFixed(2)} Cr</span>
                          </div>
                        )}
                      </div>
                      <div className="w-full mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-400">Collection</span>
                          <Badge className={`text-[8px] px-1.5 ${plant.collection >= 93 ? "bg-emerald-100 text-emerald-700" : plant.collection >= 88 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                            {plant.collection}%
                          </Badge>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${plant.collection}%`, backgroundColor: plant.collection >= 93 ? "#10b981" : plant.collection >= 88 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </PlantCardWithPreview>
              );
            })}
          </div>
        </div>
      ),
    },
    "geo-risk": {
      title: "Geo & Risk",
      render: () => (
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-7 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="rounded-xl overflow-hidden h-96 border border-slate-200 shadow-inner">
                  <Suspense fallback={
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-xl">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm text-slate-400">Loading map...</p>
                      </div>
                    </div>
                  }>
                    <SolarMap plantMarkers={dashboardData.filtered} statusColors={statusColors} />
                  </Suspense>
                </div>
                <div className={`grid gap-2 mt-3 ${dashboardData.uniqueStates.length === 1 ? "grid-cols-1" : dashboardData.uniqueStates.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {(stateFilter === "All States" ? PORTFOLIO_CONFIG.states : [stateFilter]).map((state) => {
                    const statePlants = dashboardData.filtered.filter((p: any) => p.state === state);
                    const stateCapacity = statePlants.reduce((sum: number, p: any) => sum + p.capacity, 0);
                    const compliant = statePlants.filter((p: any) => p.status === "compliant").length;
                    const avgCuf = statePlants.length ? (statePlants.reduce((s: number, p: any) => s + p.cuf, 0) / statePlants.length) : 0;
                    const stateGen = statePlants.reduce((s: number, p: any) => s + p.generation, 0);
                    const stateTgt = statePlants.reduce((s: number, p: any) => s + p.target, 0);
                    const achieve = stateTgt > 0 ? Math.round((stateGen / stateTgt) * 100) : 0;
                    const highRisk = statePlants.filter((p: any) => p.ldRisk === "high").length;
                    const cufPct = Math.min((avgCuf / 25) * 100, 100);
                    const cufCol = avgCuf >= 23 ? "#10B981" : avgCuf >= 21 ? "#F59E0B" : "#F97316";
                    const achCol = achieve >= 100 ? "#10B981" : achieve >= 95 ? "#F59E0B" : "#EF4444";
                    return (
                      <div key={state} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{state}</div>
                            <div className="text-sm font-bold text-slate-900 leading-tight">{stateCapacity} MW</div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="text-[10px] text-slate-500">{statePlants.length} sites</div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span className="text-[10px] font-semibold text-emerald-600">{compliant}/{statePlants.length}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1.5">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[9px] text-slate-500">Avg CUF</span>
                            <span className="text-[9px] font-bold" style={{ color: cufCol }}>{avgCuf.toFixed(1)}%</span>
                          </div>
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${cufPct}%`, background: cufCol }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">Achievement</span>
                          <span className="text-[9px] font-bold" style={{ color: achCol }}>{achieve}%</span>
                        </div>
                        {highRisk > 0 && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5">⚠ {highRisk} LD Risk</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">All Plants — Ranked by CUF</span>
                    <span className="text-[9px] text-slate-400">Click marker on map for details</span>
                  </div>
                  <div className="space-y-1">
                    {[...dashboardData.filtered].sort((a: any, b: any) => b.cuf - a.cuf).map((plant: any, idx: number) => {
                      const pct = plant.target > 0 ? Math.round((plant.generation / plant.target) * 100) : 0;
                      const cufCol = plant.cuf >= 23 ? "#10B981" : plant.cuf >= 21 ? "#F59E0B" : plant.cuf >= 19 ? "#F97316" : "#EF4444";
                      const sttCol: Record<string, string> = { compliant: "#10B981", warning: "#F59E0B", "non-compliant": "#EF4444", curtailment: "#F97316", shutdown: "#6B7280" };
                      const dotCol = sttCol[plant.status] ?? "#6B7280";
                      const achCol = pct >= 100 ? "#10B981" : pct >= 95 ? "#F59E0B" : "#EF4444";
                      const ldBg: Record<string, string> = { high: "bg-rose-50 text-rose-700 border-rose-200", medium: "bg-amber-50 text-amber-700 border-amber-200", low: "bg-yellow-50 text-yellow-700 border-yellow-200", none: "bg-emerald-50 text-emerald-700 border-emerald-200" };
                      return (
                        <div key={plant.id} className="flex items-center gap-2 px-2 py-1 rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                          <span className="text-[9px] font-bold text-slate-400 w-4 text-right shrink-0">#{idx + 1}</span>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotCol, boxShadow: `0 0 4px ${dotCol}80` }} />
                          <span className="text-[10px] font-semibold text-slate-800 flex-1 min-w-0 truncate">{plant.name}</span>
                          <span className="text-[9px] text-slate-500 shrink-0 hidden sm:inline">{plant.district}</span>
                          <span className="text-[9px] font-bold shrink-0" style={{ color: cufCol }}>{plant.cuf}%</span>
                          <span className="text-[9px] font-bold shrink-0 w-9 text-right" style={{ color: achCol }}>{pct}%</span>
                          {plant.ldRisk !== "none" && (
                            <span className={`text-[8px] font-semibold border rounded px-1 shrink-0 ${ldBg[plant.ldRisk]}`}>{plant.ldRisk.toUpperCase()}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1 px-2">
                    <span className="text-[8px] text-slate-400"># = CUF rank · Color dot = status · CUF% · Achieve%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-5 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Risk & Alert Dashboard
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Risk Score</div>
                      <div className="text-xs font-bold text-orange-600">{filteredRiskData.riskScore}/100</div>
                    </div>
                    <div className="px-2 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-300 uppercase tracking-wide">
                      Elevated
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-rose-50 rounded-lg border-2 border-rose-200">
                      <div className="text-[10px] font-semibold text-rose-700 mb-0.5">Non-Compliant Plants</div>
                      <div className="text-2xl font-bold text-rose-900 leading-none">{filteredRiskData.nonCompliantPlants}</div>
                      <div className="text-[9px] text-rose-500 mt-1">↑ 1 vs last month</div>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-lg border-2 border-amber-200">
                      <div className="text-[10px] font-semibold text-amber-700 mb-0.5">High LD Risk</div>
                      <div className="text-2xl font-bold text-amber-900 leading-none">{filteredRiskData.highLDRisk}</div>
                      <div className="text-[9px] text-amber-600 mt-1">₹{filteredRiskData.ldExposureCr} Cr exposure</div>
                    </div>
                    <div className="p-2.5 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <div className="text-[10px] font-semibold text-purple-700 mb-0.5">Escalations</div>
                      <div className="text-2xl font-bold text-purple-900 leading-none">{filteredRiskData.escalationTriggered}</div>
                      <div className="text-[9px] text-purple-500 mt-1">{filteredRiskData.escalationTriggered > 0 ? `${Math.ceil(filteredRiskData.escalationTriggered * 0.67)} awaiting response` : "None pending"}</div>
                    </div>
                    <div className="p-2.5 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="text-[10px] font-semibold text-blue-700 mb-0.5">Pending JMR</div>
                      <div className="text-2xl font-bold text-blue-900 leading-none">{filteredRiskData.pendingJMR}</div>
                      <div className="text-[9px] text-rose-600 mt-1 font-semibold">{filteredRiskData.overdueJMR > 0 ? `⚠ ${filteredRiskData.overdueJMR} overdue >7 days` : "All on time"}</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-bold text-orange-600 uppercase tracking-wide mb-0.5">Total LD Financial Exposure</div>
                      <div className="text-lg font-bold text-orange-800">₹{filteredRiskData.ldExposureCr} Cr at risk</div>
                      <div className="text-[9px] text-orange-600">Across {filteredRiskData.highLDRisk} plants{filteredRiskData.vendorLDExposure.length > 0 ? ` · ${filteredRiskData.vendorLDExposure[0].vendor} highest` : ""}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-orange-500 mb-1">vs Budget</div>
                      <div className="text-base font-bold text-orange-700">4.0%</div>
                      <div className="text-[9px] text-orange-500">of revenue</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">Active Alerts</h4>
                    <div className="space-y-1.5">
                      {filteredRiskData.recentAlerts.map((alert: any) => {
                        const sevStyle: Record<string, { dot: string; bg: string; badge: string; text: string }> = {
                          critical: { dot: "bg-rose-500",   bg: "bg-rose-50 border-rose-200",     badge: "bg-rose-100 text-rose-700 border-rose-300",     text: "text-rose-700" },
                          high:     { dot: "bg-orange-500", bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700 border-orange-300", text: "text-orange-600" },
                          medium:   { dot: "bg-amber-400",  bg: "bg-amber-50 border-amber-200",   badge: "bg-amber-100 text-amber-700 border-amber-200",    text: "text-amber-600" },
                        };
                        const s = sevStyle[alert.severity] ?? sevStyle.medium;
                        return (
                          <div key={alert.id} className={`px-2.5 py-2 rounded-lg border ${s.bg}`}>
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${s.dot} shrink-0`} />
                                <span className="text-[10px] font-bold text-slate-800 truncate">{alert.plant}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[9px] border rounded px-1.5 py-0.5 font-semibold ${s.badge}`}>{alert.category}</span>
                                <span className={`text-[9px] font-bold ${s.text}`}>{alert.daysOpen}d</span>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-500 pl-3.5">{alert.detail}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Non-Compliant Trend (6M)</h4>
                      <span className="text-[9px] text-emerald-600 font-semibold">↓ Improving</span>
                    </div>
                    <div style={{ overflow: "visible", position: "relative" }}>
                    <ResponsiveContainer width="100%" height={70}>
                      <BarChart data={riskData.complianceTrend} barSize={14} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                        <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 14]} />
                        <Bar dataKey="nonCompliant" radius={[3, 3, 0, 0]}>
                          {riskData.complianceTrend.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.nonCompliant >= 10 ? "#EF4444" : entry.nonCompliant >= 9 ? "#F97316" : "#F59E0B"}
                            />
                          ))}
                        </Bar>
                        <Tooltip
                          wrapperStyle={{ zIndex: 50 }}
                          content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const val = payload[0].value as number;
                            return (
                              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", fontSize: "11px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
                                <div style={{ fontWeight: 700, marginBottom: "2px" }}>{label}</div>
                                <div>Non-Compliant: <span style={{ color: "#f87171", fontWeight: 700 }}>{val} plants</span></div>
                              </div>
                            );
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">Vendor LD Exposure</h4>
                    <div className="space-y-2">
                      {filteredRiskData.vendorLDExposure.map((v: any) => {
                        const maxLd = Math.max(...filteredRiskData.vendorLDExposure.map((x: any) => x.ldCr), 0.01);
                        const pct = Math.round((v.ldCr / maxLd) * 100);
                        const col = v.risk === "high" ? "#EF4444" : v.risk === "medium" ? "#F97316" : "#F59E0B";
                        const bgBadge = v.risk === "high" ? "bg-rose-100 text-rose-700 border-rose-200" : v.risk === "medium" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-amber-100 text-amber-700 border-amber-200";
                        return (
                          <div key={v.vendor}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold text-slate-700">{v.vendor}</span>
                                <span className="text-[9px] text-slate-400">{v.plants} plants</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-800">₹{v.ldCr} Cr</span>
                                <span className={`text-[8px] font-bold border rounded px-1 ${bgBadge}`}>{v.risk.toUpperCase()}</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: col }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      ),
    },
    "generation": {
      title: "Generation",
      render: () => (
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-4 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Actual vs Target Generation</CardTitle>
                    <CardDescription className="text-xs">Top 6 plants by capacity</CardDescription>
                  </div>
                  <button
                    onClick={() => setShowComparison((v) => !v)}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                      showComparison
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    vs PY
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mergedMtdData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke="#64748b" />
                      <YAxis dataKey="plant" type="category" tick={{ fontSize: 10 }} stroke="#64748b" width={100} />
                      <Tooltip content={<CustomChartTooltip unit="MWh" />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showComparison && <Bar dataKey="prevActual" fill="#CBD5E1" name="PY Actual (MWh)" opacity={0.7} />}
                      <Bar dataKey="target" fill="#94A3B8" name="Target (MWh)" />
                      <Bar dataKey="actual" fill="#2955A0" name="Actual (MWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-5 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {durationToggle === "MTD" ? `Portfolio CUF — ${month}` : durationToggle === "YTD" ? "Portfolio CUF Trend" : "Portfolio CUF Trend (12 Months)"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {durationToggle === "MTD" ? "Current month performance vs target" : durationToggle === "YTD" ? `Apr to ${month.substring(0, 3)} performance vs target` : "Monthly performance vs target"}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setShowComparison((v) => !v)}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                      showComparison
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    vs PY
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-72">
                  {filteredCufTrend.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">No CUF data for selected filters</div>
                  ) : filteredCufTrend.length === 1 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="relative w-36 h-36">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                          <circle cx="60" cy="60" r="52" fill="none" stroke="#2955A0" strokeWidth="10"
                            strokeDasharray={`${Math.min(1, filteredCufTrend[0].target > 0 ? filteredCufTrend[0].portfolio / filteredCufTrend[0].target : 0) * 326.7} 326.7`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-[#2955A0]">{filteredCufTrend[0].portfolio}%</span>
                          <span className="text-[10px] text-slate-400">CUF</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <div className="text-center">
                          <p className="font-bold text-[#2955A0]">{filteredCufTrend[0].portfolio}%</p>
                          <p className="text-slate-400 text-[10px]">Actual</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-emerald-600">{filteredCufTrend[0].target}%</p>
                          <p className="text-slate-400 text-[10px]">Target</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-bold ${filteredCufTrend[0].portfolio >= filteredCufTrend[0].target ? "text-emerald-600" : "text-rose-600"}`}>
                            {(filteredCufTrend[0].portfolio - filteredCufTrend[0].target).toFixed(1)}%
                          </p>
                          <p className="text-slate-400 text-[10px]">Gap</p>
                        </div>
                        {showComparison && (
                          <div className="text-center">
                            <p className="font-bold text-slate-500">{filteredCufTrend[0].prevPortfolio}%</p>
                            <p className="text-slate-400 text-[10px]">PY CUF</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredCufTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#64748b" />
                      <YAxis domain={[18, 25]} tick={{ fontSize: 10 }} stroke="#64748b" />
                      <Tooltip content={<CustomChartTooltip unit="%" />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showComparison && (
                        <Line
                          type="monotone"
                          dataKey="prevPortfolio"
                          stroke="#94A3B8"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          name="PY CUF (%)"
                          dot={{ fill: "#94A3B8", r: 3 }}
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="portfolio" 
                        stroke="#2955A0" 
                        strokeWidth={3}
                        name="Portfolio CUF (%)"
                        dot={{ fill: '#2955A0', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Downtime Classification</CardTitle>
                <CardDescription className="text-xs">Distribution by cause</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredDowntimeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={(entry) => `${entry.value}%`}
                        labelLine={false}
                      >
                        {filteredDowntimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip unit="%" />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {filteredDowntimeData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
      ),
    },
    "commercial": {
      title: "Commercial",
      render: () => (
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-4 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Revenue Waterfall (₹ Cr)</CardTitle>
                <CardDescription className="text-xs">Budget to realization flow</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredRevenueWaterfall}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#64748b" />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#64748b" />
                      <Tooltip content={<CustomChartTooltip unit="₹ Cr" />} />
                      <Bar dataKey="value" fill="#2955A0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <div className="text-xs font-semibold text-amber-700 mb-1">Total Shortfall</div>
                  <div className="text-xl font-bold text-amber-900">₹{Math.max(0, filteredRevenueWaterfall[0].value - filteredRevenueWaterfall[3].value).toFixed(1)} Cr</div>
                  <div className="text-xs text-amber-600 mt-1">{filteredRevenueWaterfall[0].value > 0 ? ((1 - filteredRevenueWaterfall[3].value / filteredRevenueWaterfall[0].value) * 100).toFixed(1) : "0"}% below budget</div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">LD Exposure by Vendor</CardTitle>
                <CardDescription className="text-xs">Liquidated damages summary</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-bold">Vendor</TableHead>
                      <TableHead className="text-xs font-bold text-center">Plants</TableHead>
                      <TableHead className="text-xs font-bold text-right">LD (₹ Cr)</TableHead>
                      <TableHead className="text-xs font-bold text-right">Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLdExposureData.map((vendor) => (
                      <TableRow key={vendor.vendor} className="hover:bg-slate-50">
                        <TableCell className="text-xs font-semibold">{vendor.vendor}</TableCell>
                        <TableCell className="text-xs text-center">{vendor.plants}</TableCell>
                        <TableCell className="text-xs text-right font-bold">₹{vendor.ldAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              vendor.severity === "high" ? "bg-rose-50 text-rose-700 border-rose-200" :
                              vendor.severity === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              vendor.severity === "low" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {vendor.severity === "none" ? "Clean" : vendor.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-3 bg-rose-50 rounded-lg border-2 border-rose-200">
                  <div className="text-xs font-semibold text-rose-700 mb-1">Total Portfolio LD</div>
                  <div className="text-xl font-bold text-rose-900">₹{dashboardData.ldExposure} Cr</div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">O&M Deviation Settlement</CardTitle>
                <CardDescription className="text-xs">Performance vs benchmark</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-600 mb-2">PR Benchmark</div>
                        <div className="text-3xl font-bold text-slate-900">{filteredOmDeviation.prBenchmark}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 mb-2">Actual PR</div>
                        <div className="text-3xl font-bold text-rose-600">{filteredOmDeviation.actualPR}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                    <div className="text-xs font-semibold text-amber-700 mb-2">PR Gap</div>
                    <div className="text-2xl font-bold text-amber-900">
                      -{(filteredOmDeviation.prBenchmark - filteredOmDeviation.actualPR).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 mb-2">Settlement Amount</div>
                    <div className="text-2xl font-bold text-blue-900">₹{filteredOmDeviation.settlementAmount} Cr</div>
                    <div className="text-xs text-blue-600 mt-1">Payable to EESL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      ),
    },
    "benchmarking": {
      title: "Benchmarking",
      render: () => (
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-7 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Vendor Performance Ranking</CardTitle>
                <CardDescription className="text-xs">Comparative analysis across vendors</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-bold w-12">Rank</TableHead>
                      <TableHead className="text-xs font-bold">Vendor</TableHead>
                      <TableHead className="text-xs font-bold text-center">Plants</TableHead>
                      <TableHead className="text-xs font-bold text-right">Avg CUF</TableHead>
                      <TableHead className="text-xs font-bold text-right">Availability</TableHead>
                      <TableHead className="text-xs font-bold text-right">LD (₹ Cr)</TableHead>
                      <TableHead className="text-xs font-bold text-right">Compliance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendorRankingData.map((vendor) => (
                      <TableRow key={vendor.rank} className="hover:bg-slate-50 cursor-pointer">
                        <TableCell>
                          <div className="w-7 h-7 rounded-lg bg-[#2955A0] text-white flex items-center justify-center font-bold text-xs">
                            {vendor.rank}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold">{vendor.vendor}</TableCell>
                        <TableCell className="text-xs text-center">{vendor.plants}</TableCell>
                        <TableCell className="text-xs text-right font-semibold">{vendor.avgCuf}%</TableCell>
                        <TableCell className="text-xs text-right font-semibold">{vendor.avgAvailability}%</TableCell>
                        <TableCell className="text-xs text-right font-semibold">₹{vendor.ldExposure.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline"
                            className={`text-[10px] ${
                              vendor.compliance >= 95 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              vendor.compliance >= 90 ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {vendor.compliance}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-5 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">State-wise Cluster Comparison</CardTitle>
                <CardDescription className="text-xs">Regional performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {filteredClusterData.map((cluster) => (
                    <div key={cluster.state} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-[#2955A0] transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-900">{cluster.state}</h4>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {cluster.capacity} MW
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        <div>
                          <div className="text-slate-600 mb-1">Generation</div>
                          <div className="font-bold text-slate-900">{cluster.generation.toLocaleString()} MWh</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">CUF</div>
                          <div className="font-bold text-slate-900">{cluster.cuf}%</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">Availability</div>
                          <div className="font-bold text-slate-900">{cluster.availability}%</div>
                        </div>
                        <div>
                          <div className="text-slate-600 mb-1">LD</div>
                          <div className="font-bold text-rose-600">₹{cluster.ldExposure}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
      ),
    },
    "advanced": {
      title: "Analytics",
      render: () => (
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-6 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Lost Production Index (LPI)</CardTitle>
                <CardDescription className="text-xs">Monthly energy loss breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filteredLpiData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                      <defs>
                        <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorEquip" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.6}/><stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCurtail" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#64748b" />
                      <YAxis domain={[0, 15]} tick={{ fontSize: 10 }} stroke="#64748b" unit="%" />
                      <Tooltip
                        wrapperStyle={{ zIndex: 50 }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0]?.payload;
                          return (
                            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 14px", fontSize: "11px", color: "#f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", minWidth: "180px" }}>
                              <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "6px", borderBottom: "1px solid #475569", paddingBottom: "4px" }}>{label}</div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span style={{ color: "#fca5a5" }}>Grid Outage</span><span style={{ fontWeight: 700 }}>{d.gridLoss}%</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span style={{ color: "#fdba74" }}>Equipment</span><span style={{ fontWeight: 700 }}>{d.equipmentLoss}%</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span style={{ color: "#93c5fd" }}>Planned</span><span style={{ fontWeight: 700 }}>{d.plannedLoss}%</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span style={{ color: "#c4b5fd" }}>Curtailment</span><span style={{ fontWeight: 700 }}>{d.curtailmentLoss}%</span></div>
                              <div style={{ borderTop: "1px solid #475569", paddingTop: "4px", marginTop: "4px", display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>Total LPI</span><span style={{ fontWeight: 700, color: "#f87171" }}>{d.lpi}%</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px", color: "#94a3b8", fontSize: "10px" }}><span>Energy Lost</span><span>{d.energyLostMWh} MWh</span></div>
                            </div>
                          );
                        }}
                      />
                      <ReferenceLine y={5} stroke="#10b981" strokeDasharray="6 3" strokeWidth={2} label={{ value: "Target <5%", position: "right", fontSize: 9, fill: "#10b981" }} />
                      <Area type="monotone" dataKey="gridLoss" stackId="1" stroke="#EF4444" strokeWidth={0} fill="url(#colorGrid)" name="Grid Outage" />
                      <Area type="monotone" dataKey="equipmentLoss" stackId="1" stroke="#F97316" strokeWidth={0} fill="url(#colorEquip)" name="Equipment" />
                      <Area type="monotone" dataKey="plannedLoss" stackId="1" stroke="#3B82F6" strokeWidth={0} fill="url(#colorPlanned)" name="Planned" />
                      <Area type="monotone" dataKey="curtailmentLoss" stackId="1" stroke="#8B5CF6" strokeWidth={0} fill="url(#colorCurtail)" name="Curtailment" />
                      <Line type="monotone" dataKey="lpi" stroke="#1e293b" strokeWidth={2} dot={{ r: 3, fill: "#1e293b" }} name="Total LPI" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ background: "#EF4444" }} /><span className="text-[10px] text-slate-600">Grid Outage</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ background: "#F97316" }} /><span className="text-[10px] text-slate-600">Equipment</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ background: "#3B82F6" }} /><span className="text-[10px] text-slate-600">Planned</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ background: "#8B5CF6" }} /><span className="text-[10px] text-slate-600">Curtailment</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-6 border-t-2 border-slate-900" /><span className="text-[10px] text-slate-600">Total LPI</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-6 border-t-2 border-dashed border-emerald-500" /><span className="text-[10px] text-slate-600">Target</span></div>
                </div>
                {(() => {
                  const avgLPI = filteredLpiData.reduce((s: number, d: any) => s + d.lpi, 0) / filteredLpiData.length;
                  const totalLostMWh = filteredLpiData.reduce((s: number, d: any) => s + d.energyLostMWh, 0);
                  const totalExpectedMWh = filteredLpiData.reduce((s: number, d: any) => s + d.expectedMWh, 0);
                  const worstMonth = filteredLpiData.reduce((w: any, d: any) => d.lpi > w.lpi ? d : w, filteredLpiData[0]);
                  const bestMonth = filteredLpiData.reduce((b: any, d: any) => d.lpi < b.lpi ? d : b, filteredLpiData[0]);
                  const categories = [
                    { name: "Grid Outage", avg: filteredLpiData.reduce((s: number, d: any) => s + d.gridLoss, 0) / filteredLpiData.length },
                    { name: "Equipment", avg: filteredLpiData.reduce((s: number, d: any) => s + d.equipmentLoss, 0) / filteredLpiData.length },
                    { name: "Planned", avg: filteredLpiData.reduce((s: number, d: any) => s + d.plannedLoss, 0) / filteredLpiData.length },
                    { name: "Curtailment", avg: filteredLpiData.reduce((s: number, d: any) => s + d.curtailmentLoss, 0) / filteredLpiData.length },
                  ];
                  const topCat = categories.reduce((a, b) => b.avg > a.avg ? b : a, categories[0]);
                  const topContributor = topCat.name;
                  const topContribPct = topCat.avg;
                  return (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                        <div className="text-[10px] font-semibold text-rose-700 uppercase">Avg LPI (12M)</div>
                        <div className="text-lg font-bold text-rose-900">{avgLPI.toFixed(1)}%</div>
                        <div className="text-[10px] text-rose-600">Target: &lt;5%</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-semibold text-slate-700 uppercase">Energy Lost</div>
                        <div className="text-lg font-bold text-slate-900">{(totalLostMWh / 1000).toFixed(1)}K</div>
                        <div className="text-[10px] text-slate-600">MWh of {(totalExpectedMWh / 1000).toFixed(1)}K exp.</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-[10px] font-semibold text-amber-700 uppercase">Top Loss Driver</div>
                        <div className="text-sm font-bold text-amber-900">{topContributor}</div>
                        <div className="text-[10px] text-amber-600">Avg {topContribPct.toFixed(1)}% / month</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-[10px] font-semibold text-blue-700 uppercase">Peak vs Best</div>
                        <div className="text-sm font-bold text-blue-900">{worstMonth.month}: {worstMonth.lpi}%</div>
                        <div className="text-[10px] text-blue-600">Best: {bestMonth.month} ({bestMonth.lpi}%)</div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            <Card className="col-span-6 border-2 border-slate-200 shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base">Asset Health Index Breakdown</CardTitle>
                <CardDescription className="text-xs">Weighted component scores</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {(() => {
                    const filtered = dashboardData.filtered;
                    const avgCuf = filtered.length > 0 ? filtered.reduce((s: number, p: any) => s + p.cuf, 0) / filtered.length : 0;
                    const avgAvail = filtered.length > 0 ? filtered.reduce((s: number, p: any) => s + p.availability, 0) / filtered.length : 0;
                    const actualPR = parseFloat((avgCuf / 25 * 100 * 0.95).toFixed(1));
                    const compliancePct = filtered.length > 0 ? parseFloat((filtered.filter((p: any) => p.status === "compliant").length / filtered.length * 100).toFixed(1)) : 0;
                    const computedBreakdown = [
                      { component: "PR Score", value: actualPR, target: 82.0, weight: 35 },
                      { component: "Availability Score", value: parseFloat(avgAvail.toFixed(1)), target: 98.0, weight: 30 },
                      { component: "Downtime Score", value: parseFloat(Math.min(100, 85 + (avgAvail - 95)).toFixed(1)), target: 95.0, weight: 20 },
                      { component: "Compliance Score", value: parseFloat(compliancePct.toFixed(1)), target: 95.0, weight: 15 },
                    ];
                    const compositeScore = computedBreakdown.reduce((s, c) => s + (c.value / c.target * 100) * (c.weight / 100), 0);
                    return computedBreakdown.map((component) => {
                      const score = (component.value / component.target) * 100;
                      return (
                        <div key={component.component}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{component.component}</span>
                              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700">
                                {component.weight}%
                              </Badge>
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-slate-900">{component.value}</span>
                              <span className="text-slate-600"> / {component.target}</span>
                            </div>
                          </div>
                          <div className="relative">
                            <Progress value={Math.min(100, score)} className="h-3" />
                            <div className="absolute top-0 left-0 h-3 flex items-center px-2">
                              <span className="text-[10px] font-bold text-white">{score.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                {(() => {
                  const filtered = dashboardData.filtered;
                  const avgCuf = filtered.length > 0 ? filtered.reduce((s: number, p: any) => s + p.cuf, 0) / filtered.length : 0;
                  const avgAvail = filtered.length > 0 ? filtered.reduce((s: number, p: any) => s + p.availability, 0) / filtered.length : 0;
                  const actualPR = avgCuf / 25 * 100 * 0.95;
                  const compliancePct = filtered.length > 0 ? filtered.filter((p: any) => p.status === "compliant").length / filtered.length * 100 : 0;
                  const breakdown = [
                    { value: actualPR, target: 82.0, weight: 35 },
                    { value: avgAvail, target: 98.0, weight: 30 },
                    { value: Math.min(100, 85 + (avgAvail - 95)), target: 95.0, weight: 20 },
                    { value: compliancePct, target: 95.0, weight: 15 },
                  ];
                  const compositeScore = parseFloat(breakdown.reduce((s, c) => s + Math.min(100, (c.value / c.target * 100)) * (c.weight / 100), 0).toFixed(1));
                  return (
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#2955A0] to-[#2955A0]/80 rounded-lg text-white">
                      <div className="text-xs font-semibold mb-2">Composite Asset Health Index</div>
                      <div className="text-4xl font-bold">{compositeScore} <span className="text-xl">/100</span></div>
                      <div className="text-xs mt-2 flex items-center gap-1">
                        {compositeScore >= 80 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {compositeScore >= 80 ? "Above" : "Below"} target threshold
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
      ),
    },
  };

  return (
    <div ref={dashboardRef} data-dashboard-content className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* GLOBAL TOP FILTER BAR */}
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          {/* Row 1: Title & Meta Info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Portfolio Dashboard</h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  {dashboardData.filteredPortfolioCap} MW · {dashboardData.filteredPlantCount} Plants · {dashboardData.uniqueStates.length} {dashboardData.uniqueStates.length === 1 ? "State" : "States"}
                  {(stateFilter !== "All States" || vendorFilter !== "All Vendors" || plantFilter !== "All Plants") && (
                    <>
                      <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded text-[10px] font-bold">Filtered View</span>
                      <button
                        onClick={() => { setStateFilter("All States"); setVendorFilter("All Vendors"); setPlantFilter("All Plants"); }}
                        className="ml-1.5 px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 rounded text-[10px] font-medium transition-colors"
                      >
                        ✕ Reset
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {customizeMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetLayout}
                  className="h-7 text-xs gap-1.5 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Layout
                </Button>
              )}
              <Button
                variant={customizeMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomizeMode((v) => !v)}
                className={`h-7 text-xs gap-1.5 ${
                  customizeMode
                    ? "bg-[#2955A0] text-white hover:bg-[#2955A0]/90"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                {customizeMode ? "Done" : "Customize"}
              </Button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-600">Updated 2 min ago</span>
              </div>
              <ExportMenu
                kpis={computedKPIs.map(k => ({ title: k.title, value: k.value, unit: k.unit, change: k.change }))}
                plants={dashboardData.filtered}
                dashboardRef={dashboardRef}
              />
            </div>
          </div>

          {/* Row 2: Filters & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={financialYear} onValueChange={setFinancialYear}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FY 2025-26">FY 2025-26</SelectItem>
                  <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
                  <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setPlantFilter("All Plants"); }}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All States">All States</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Vidarbha">Vidarbha Region</SelectItem>
                  <SelectItem value="Marathwada">Marathwada Region</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vendorFilter} onValueChange={(v) => { setVendorFilter(v); setPlantFilter("All Plants"); }}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Vendors">All Vendors</SelectItem>
                  <SelectItem value="SolarCo India">SolarCo India</SelectItem>
                  <SelectItem value="SunPower Tech">SunPower Tech</SelectItem>
                  <SelectItem value="Mega Solar Inc">Mega Solar Inc</SelectItem>
                  <SelectItem value="Green Energy Ltd">Green Energy Ltd</SelectItem>
                  <SelectItem value="TechSolar Pvt">TechSolar Pvt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={plantFilter} onValueChange={setPlantFilter}>
                <SelectTrigger className="w-44 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Plants">All Plants</SelectItem>
                  {plantMarkers
                    .filter(p =>
                      (stateFilter === "All States" || p.state === stateFilter) &&
                      (vendorFilter === "All Vendors" || p.vendor === vendorFilter)
                    )
                    .map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
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

      {/* MAIN CONTENT */}
      <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 max-w-[1920px] mx-auto pb-16">

          {/* ALL DASHBOARD SECTIONS — rendered from widget order */}
          <AnimatePresence mode="sync">
          {widgetOrder.map((widgetId, idx) => {
            const widget = widgetRegistry[widgetId];
            if (!widget) return null;
            return (
              <DraggableWidget
                key={widgetId}
                id={widgetId}
                index={idx}
                title={widget.title}
                customizeMode={customizeMode}
                moveWidget={moveWidget}
              >
                {widget.render()}
              </DraggableWidget>
            );
          })}
          </AnimatePresence>

        </div>
      </div>
      </DndProvider>
    </div>
  );
}
