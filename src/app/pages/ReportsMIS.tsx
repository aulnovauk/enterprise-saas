import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "../components/ui/dialog";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  Save,
  Play,
  Settings,
  Plus,
  Trash2,
  Database,
  BarChart3,
  Filter,
  Clock,
  Users,
  Send,
  FileSpreadsheet,
  Eye,
  Copy,
  Edit3,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Search,
  Star,
  MoreVertical,
  RefreshCw,
  Layers,
  PieChart,
  Activity,
  DollarSign,
  Target,
  BookOpen,
  Sparkles,
  ArrowRight,
  FileBarChart,
  Grid3x3,
  LayoutGrid,
  CalendarDays,
  UserPlus,
  Share2,
  Pencil,
  Maximize2,
  X,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Table2,
  LineChart,
  AreaChart as AreaChartIcon,
  Hash,
  Type,
  Sigma,
  Wand2,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart as RLineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { toast } from "sonner";

// Data fields available for reporting (Power BI style)
const dataFields = [
  // Performance Measures
  { id: "generation", name: "Generation (MWh)", category: "Performance", type: "measure", icon: Zap },
  { id: "availability", name: "Availability (%)", category: "Performance", type: "measure", icon: Activity },
  { id: "cuf", name: "CUF (%)", category: "Performance", type: "measure", icon: TrendingUp },
  { id: "pr", name: "Performance Ratio (%)", category: "Performance", type: "measure", icon: Target },
  { id: "gridAvailability", name: "Grid Availability (%)", category: "Performance", type: "measure", icon: Activity },
  
  // Environmental Measures
  { id: "irradiation", name: "Irradiation (kWh/m²)", category: "Environmental", type: "measure", icon: Sparkles },
  { id: "ambientTemp", name: "Ambient Temperature (°C)", category: "Environmental", type: "measure", icon: Activity },
  { id: "moduleTemp", name: "Module Temperature (°C)", category: "Environmental", type: "measure", icon: Activity },
  
  // Financial Measures
  { id: "revenue", name: "Revenue (₹L)", category: "Financial", type: "measure", icon: DollarSign },
  { id: "ldAmount", name: "LD Amount (₹L)", category: "Financial", type: "measure", icon: AlertCircle },
  { id: "omCost", name: "O&M Cost (₹L)", category: "Financial", type: "measure", icon: DollarSign },
  { id: "energyRevenue", name: "Energy Revenue (₹L)", category: "Financial", type: "measure", icon: DollarSign },
  
  // Loss Analysis Measures
  { id: "energyLoss", name: "Energy Loss (MWh)", category: "Loss Analysis", type: "measure", icon: AlertCircle },
  { id: "downtime", name: "Downtime (Hours)", category: "Loss Analysis", type: "measure", icon: Clock },
  { id: "curtailment", name: "Curtailment Loss (MWh)", category: "Loss Analysis", type: "measure", icon: TrendingUp },
  { id: "transmissionLoss", name: "Transmission Loss (%)", category: "Loss Analysis", type: "measure", icon: Activity },
  
  // Dimensions
  { id: "plant", name: "Plant Name", category: "Location", type: "dimension", icon: Database },
  { id: "state", name: "State", category: "Location", type: "dimension", icon: Database },
  { id: "region", name: "Region", category: "Location", type: "dimension", icon: Database },
  { id: "cluster", name: "Cluster", category: "Location", type: "dimension", icon: Layers },
  
  { id: "vendor", name: "Vendor", category: "Organization", type: "dimension", icon: Users },
  { id: "client", name: "Client", category: "Organization", type: "dimension", icon: Users },
  { id: "owner", name: "Owner", category: "Organization", type: "dimension", icon: Users },
  
  { id: "date", name: "Date", category: "Time", type: "dimension", icon: Calendar },
  { id: "month", name: "Month", category: "Time", type: "dimension", icon: Calendar },
  { id: "quarter", name: "Quarter", category: "Time", type: "dimension", icon: Calendar },
  { id: "year", name: "Year", category: "Time", type: "dimension", icon: Calendar },
];

// Visualization types
const visualizationTypes = [
  { id: "table", name: "Table", icon: Table2, color: "blue" },
  { id: "bar", name: "Bar Chart", icon: BarChart3, color: "emerald" },
  { id: "line", name: "Line Chart", icon: LineChart, color: "purple" },
  { id: "area", name: "Area Chart", icon: AreaChartIcon, color: "amber" },
  { id: "pie", name: "Pie Chart", icon: PieChart, color: "rose" },
  { id: "kpi", name: "KPI Card", icon: Target, color: "blue" },
];

// Sample preview data
const sampleData = [
  { plant: "Sakri Solar Park", state: "Maharashtra", region: "North", generation: 820, availability: 96.2, cuf: 21.8, revenue: 245, ldAmount: 0.36, energyLoss: 12.5, downtime: 8.2 },
  { plant: "Osmanabad Solar Plant", state: "Maharashtra", region: "West", generation: 1980, availability: 93.8, cuf: 22.1, revenue: 592, ldAmount: 1.8, energyLoss: 45.2, downtime: 14.5 },
  { plant: "Latur Solar Station", state: "Maharashtra", region: "Central", generation: 4100, availability: 94.5, cuf: 22.3, revenue: 1225, ldAmount: 1.0, energyLoss: 38.6, downtime: 11.8 },
  { plant: "Beed Solar Park", state: "Maharashtra", region: "Beed", generation: 1920, availability: 98.1, cuf: 24.5, revenue: 574, ldAmount: 0, energyLoss: 12.3, downtime: 4.2 },
  { plant: "Ahmednagar Solar Plant", state: "Maharashtra", region: "Ahmednagar", generation: 1560, availability: 96.4, cuf: 23.2, revenue: 466, ldAmount: 0, energyLoss: 8.1, downtime: 4.2 },
  { plant: "Devdaithan Solar Plant", state: "Maharashtra", region: "Ahmednagar", generation: 1310, availability: 91.2, cuf: 19.5, revenue: 392, ldAmount: 4.86, energyLoss: 28.4, downtime: 9.6 },
  { plant: "Amravati Solar Unit", state: "Maharashtra", region: "Amravati", generation: 1140, availability: 88.3, cuf: 18.5, revenue: 342, ldAmount: 10.8, energyLoss: 62.3, downtime: 18.9 },
];

// Report templates (same as before)
const reportTemplates = [
  {
    id: "monthly-perf",
    name: "Monthly Performance Report",
    description: "Comprehensive monthly generation and performance metrics",
    category: "Operational",
    frequency: "Monthly",
    lastGenerated: "Feb 28, 2026",
    recipients: 15,
    status: "scheduled",
    icon: Activity,
    color: "blue",
    thumbnail: "chart",
    tags: ["CUF", "Generation", "Availability"],
    estimatedTime: "2 min",
  },
  {
    id: "exec-dashboard",
    name: "Executive Dashboard",
    description: "High-level KPIs and insights for leadership",
    category: "Analytics",
    frequency: "Weekly",
    lastGenerated: "Mar 1, 2026",
    recipients: 5,
    status: "active",
    icon: TrendingUp,
    color: "purple",
    thumbnail: "dashboard",
    tags: ["KPI", "Trends", "Summary"],
    estimatedTime: "3 min",
  },
  {
    id: "ld-compliance",
    name: "LD & Compliance Report",
    description: "Contractual obligations and penalty tracking",
    category: "Commercial",
    frequency: "Monthly",
    lastGenerated: "Feb 28, 2026",
    recipients: 8,
    status: "scheduled",
    icon: FileBarChart,
    color: "amber",
    thumbnail: "table",
    tags: ["LD", "Penalties", "Contract"],
    estimatedTime: "4 min",
  },
  {
    id: "vendor-comparison",
    name: "Vendor Performance Comparison",
    description: "Multi-vendor analysis and benchmarking",
    category: "Analytics",
    frequency: "Quarterly",
    lastGenerated: "Jan 31, 2026",
    recipients: 12,
    status: "draft",
    icon: Users,
    color: "emerald",
    thumbnail: "comparison",
    tags: ["Vendors", "Benchmark", "Analysis"],
    estimatedTime: "5 min",
  },
  {
    id: "jmr-summary",
    name: "JMR Data Summary",
    description: "Consolidated Joint Meter Reading data across all plants",
    category: "Compliance",
    frequency: "Monthly",
    lastGenerated: "Feb 28, 2026",
    recipients: 20,
    status: "scheduled",
    icon: Database,
    color: "blue",
    thumbnail: "table",
    tags: ["JMR", "Compliance", "Data"],
    estimatedTime: "3 min",
  },
  {
    id: "revenue-analysis",
    name: "Revenue Analysis Report",
    description: "Financial performance and revenue realization tracking",
    category: "Commercial",
    frequency: "Monthly",
    lastGenerated: "Feb 28, 2026",
    recipients: 10,
    status: "active",
    icon: DollarSign,
    color: "green",
    thumbnail: "chart",
    tags: ["Revenue", "Finance", "Billing"],
    estimatedTime: "3 min",
  },
  {
    id: "outage-analysis",
    name: "Outage & Loss Analysis",
    description: "Detailed breakdown of downtime and energy losses",
    category: "Operational",
    frequency: "Weekly",
    lastGenerated: "Mar 1, 2026",
    recipients: 18,
    status: "active",
    icon: AlertCircle,
    color: "red",
    thumbnail: "chart",
    tags: ["Outage", "Loss", "Downtime"],
    estimatedTime: "4 min",
  },
  {
    id: "forecast-report",
    name: "Generation Forecast Report",
    description: "AI-powered generation predictions and weather analysis",
    category: "Analytics",
    frequency: "Daily",
    lastGenerated: "Today",
    recipients: 25,
    status: "active",
    icon: Sparkles,
    color: "purple",
    thumbnail: "forecast",
    tags: ["AI", "Forecast", "Prediction"],
    estimatedTime: "2 min",
  },
];

// Scheduled reports
const scheduledReports = [
  {
    id: "SCH-001",
    name: "Daily Generation Summary",
    schedule: "Daily at 6:00 AM",
    nextRun: "Tomorrow, 6:00 AM",
    recipients: ["ops@eesl.in", "management@eesl.in"],
    status: "active",
    lastRun: "Today, 6:00 AM",
  },
  {
    id: "SCH-002",
    name: "Weekly Performance Report",
    schedule: "Every Monday at 8:00 AM",
    nextRun: "Mon, Mar 3, 8:00 AM",
    recipients: ["executive@eesl.in"],
    status: "active",
    lastRun: "Mon, Feb 24, 8:00 AM",
  },
  {
    id: "SCH-003",
    name: "Monthly Financial Report",
    schedule: "1st of every month at 9:00 AM",
    nextRun: "Apr 1, 9:00 AM",
    recipients: ["finance@eesl.in", "cfo@eesl.in"],
    status: "active",
    lastRun: "Mar 1, 9:00 AM",
  },
  {
    id: "SCH-004",
    name: "Quarterly Board Report",
    schedule: "Quarterly - 5th of Q end month",
    nextRun: "Apr 5, 10:00 AM",
    recipients: ["board@eesl.in"],
    status: "paused",
    lastRun: "Jan 5, 10:00 AM",
  },
];

// Recent reports
const recentReports = [
  {
    id: "RPT-2026-0301",
    name: "Executive Dashboard",
    generatedAt: "Mar 1, 2026 9:00 AM",
    generatedBy: "System Scheduler",
    format: "PDF",
    size: "2.4 MB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "RPT-2026-0228",
    name: "Monthly Performance Report - April",
    generatedAt: "Apr 30, 2026 8:00 AM",
    generatedBy: "Rajesh Kumar",
    format: "Excel",
    size: "5.8 MB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "RPT-2026-0228B",
    name: "JMR Data Summary - April",
    generatedAt: "Apr 30, 2026 10:30 AM",
    generatedBy: "System Scheduler",
    format: "PDF",
    size: "1.2 MB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "RPT-2026-0227",
    name: "Vendor Performance Comparison",
    generatedAt: "Feb 27, 2026 3:00 PM",
    generatedBy: "Priya Sharma",
    format: "Excel",
    size: "3.6 MB",
    status: "failed",
    downloadUrl: "#",
  },
];

// Report usage analytics data
const usageAnalytics = [
  { month: "Oct", reports: 45, downloads: 120 },
  { month: "Nov", reports: 52, downloads: 135 },
  { month: "Dec", reports: 48, downloads: 128 },
  { month: "Jan", reports: 58, downloads: 155 },
  { month: "Feb", reports: 62, downloads: 168 },
  { month: "Mar", reports: 55, downloads: 148 },
  { month: "Apr", reports: 68, downloads: 182 },
];

const categoryColors: any = {
  Operational: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  Commercial: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Compliance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  Analytics: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
};

const statusConfig: any = {
  active: { label: "Active", color: "bg-emerald-600 text-white", dot: "bg-emerald-500" },
  scheduled: { label: "Scheduled", color: "bg-blue-600 text-white", dot: "bg-blue-500" },
  draft: { label: "Draft", color: "bg-slate-400 text-white", dot: "bg-slate-400" },
  paused: { label: "Paused", color: "bg-amber-600 text-white", dot: "bg-amber-500" },
  completed: { label: "Completed", color: "bg-emerald-600 text-white", dot: "bg-emerald-500" },
  failed: { label: "Failed", color: "bg-rose-600 text-white", dot: "bg-rose-500" },
};

// Draggable Field Component (Power BI Style)
function DraggableField({ field }: { field: typeof dataFields[0] }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: { field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = field.icon;

  return (
    <div
      ref={drag}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all cursor-move
        ${isDragging 
          ? "opacity-40 border-[#2955A0] bg-blue-50" 
          : "border-slate-200 bg-white hover:border-[#2955A0] hover:bg-blue-50 hover:shadow-sm"
        }`}
    >
      <GripVertical className="w-3 h-3 text-slate-400 group-hover:text-[#2955A0]" />
      <Icon className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs font-medium text-slate-700 flex-1">{field.name}</span>
      <Badge 
        variant="outline" 
        className={`text-[10px] px-1.5 py-0 ${
          field.type === "measure" 
            ? "bg-blue-50 text-blue-700 border-blue-200" 
            : "bg-purple-50 text-purple-700 border-purple-200"
        }`}
      >
        {field.type === "measure" ? <Hash className="w-3 h-3" /> : <Type className="w-3 h-3" />}
      </Badge>
    </div>
  );
}

// Drop Zone Component (Power BI Style Field Well)
function FieldWell({ 
  title, 
  icon: Icon, 
  fields, 
  onDrop, 
  onRemove,
  acceptType 
}: any) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "FIELD",
    drop: (item: any) => onDrop(item.field),
    canDrop: (item: any) => acceptType === "all" || item.field.type === acceptType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`rounded-xl border-2 transition-all min-h-[100px] p-4
        ${isOver && canDrop
          ? "border-[#2955A0] bg-blue-50 shadow-lg" 
          : canDrop
          ? "border-dashed border-slate-300 bg-slate-50"
          : "border-dashed border-slate-200 bg-white"
        }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-slate-600" />
        <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{title}</Label>
        {fields.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs bg-[#2955A0] text-white">
            {fields.length}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {fields.length === 0 ? (
          <div className="text-center py-6">
            <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Drag fields here</p>
          </div>
        ) : (
          fields.map((field: any, idx: number) => {
            const FieldIcon = field.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 p-2 bg-white rounded-lg border-2 border-slate-200 group hover:border-rose-300"
              >
                <FieldIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-700 flex-1">{field.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(idx)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

type ViewMode = "gallery" | "builder" | "scheduled" | "history" | "analytics";

// ── Per-template preview mock data ────────────────────────────────────────
const PREVIEW_MONTHLY_PLANTS = [
  { plant: "Sakri Solar Park",     gen: 2150, target: 2100, cuf: 23.5, avail: 97.2, status: "Compliant" },
  { plant: "Osmanabad Solar Plant",  gen: 2380, target: 2450, cuf: 24.1, avail: 96.8, status: "Warning" },
  { plant: "Latur Solar Station",         gen: 1720, target: 1680, cuf: 23.8, avail: 97.5, status: "Compliant" },
  { plant: "Beed Solar Park",     gen: 1920, target: 1850, cuf: 24.5, avail: 98.1, status: "Compliant" },
  { plant: "Wardha Solar Park",    gen: 2120, target: 2350, cuf: 20.8, avail: 93.5, status: "Non-Compliant" },
  { plant: "Devdaithan Solar Plant",        gen: 1310, target: 1580, cuf: 19.5, avail: 91.2, status: "Non-Compliant" },
];
const PREVIEW_MONTHLY_CHART = [
  { month: "Sep", gen: 38200, target: 40000 },
  { month: "Oct", gen: 39500, target: 40000 },
  { month: "Nov", gen: 37800, target: 40000 },
  { month: "Dec", gen: 36200, target: 40000 },
  { month: "Jan", gen: 38900, target: 42000 },
  { month: "Feb", gen: 42580, target: 45000 },
  { month: "Mar", gen: 44850, target: 46000 },
  { month: "Apr", gen: 45730, target: 47000 },
];
const PREVIEW_REVENUE_CHART = [
  { month: "Sep", realized: 7.1, target: 8.0 },
  { month: "Oct", realized: 7.4, target: 8.0 },
  { month: "Nov", realized: 7.0, target: 8.0 },
  { month: "Dec", realized: 6.8, target: 8.0 },
  { month: "Jan", realized: 7.3, target: 9.0 },
  { month: "Feb", realized: 7.7, target: 9.0 },
  { month: "Mar", realized: 8.2, target: 9.2 },
  { month: "Apr", realized: 8.5, target: 9.4 },
];
const PREVIEW_VENDOR_DATA = [
  { vendor: "SolarCo India", cuf: 22.1, avail: 96.2, ld: 0.42, plants: 3 },
  { vendor: "SunPower Tech", cuf: 20.8, avail: 93.5, ld: 0.48, plants: 4 },
  { vendor: "Mega Solar Inc", cuf: 23.7, avail: 97.8, ld: 0.55, plants: 3 },
  { vendor: "Green Energy Ltd", cuf: 24.1, avail: 96.8, ld: 0.00, plants: 1 },
  { vendor: "TechSolar Pvt", cuf: 23.8, avail: 97.5, ld: 0.00, plants: 1 },
];
const PREVIEW_OUTAGE_LOG = [
  { date: "Feb 18", plant: "Devdaithan Solar Plant",    type: "Grid Curtailment",   duration: "6.2 hrs", loss: "184 MWh", severity: "high" },
  { date: "Feb 14", plant: "Amravati Solar Unit",   type: "Equipment Fault",    duration: "4.0 hrs", loss: "95 MWh",  severity: "high" },
  { date: "Feb 11", plant: "Wardha Solar Park",      type: "Scheduled Maint.",   duration: "3.5 hrs", loss: "72 MWh",  severity: "medium" },
  { date: "Feb 07", plant: "Sangli Solar Farm",   type: "Transmission Loss",  duration: "2.0 hrs", loss: "48 MWh",  severity: "medium" },
  { date: "Feb 03", plant: "Osmanabad Solar Plant",      type: "Force Majeure",      duration: "1.5 hrs", loss: "38 MWh",  severity: "low" },
];
const PREVIEW_FORECAST_DATA = [
  { day: "Mar 6",  actual: null,  forecast: 1540, upper: 1620, lower: 1460 },
  { day: "Mar 7",  actual: null,  forecast: 1610, upper: 1700, lower: 1520 },
  { day: "Mar 8",  actual: null,  forecast: 1490, upper: 1580, lower: 1400 },
  { day: "Mar 9",  actual: null,  forecast: 1580, upper: 1660, lower: 1490 },
  { day: "Mar 10", actual: null,  forecast: 1650, upper: 1740, lower: 1550 },
  { day: "Mar 11", actual: null,  forecast: 1720, upper: 1810, lower: 1620 },
  { day: "Mar 12", actual: null,  forecast: 1680, upper: 1770, lower: 1580 },
];
const PREVIEW_JMR_RECORDS = [
  { id: "JMR-2026-02-001", plant: "Sakri Solar Park",  gross: 4520, net: 4418, avail: 97.2, status: "approved" },
  { id: "JMR-2026-02-002", plant: "Beed Solar Park",     gross: 1920, net: 1882, avail: 98.1, status: "approved" },
  { id: "JMR-2026-02-003", plant: "Devdaithan Solar Plant",        gross: 1310, net: 1274, avail: 91.2, status: "pending" },
  { id: "JMR-2026-02-004", plant: "Wardha Solar Park",    gross: 2120, net: 2066, avail: 93.5, status: "review" },
  { id: "JMR-2026-02-005", plant: "Sakri Solar Park",     gross: 2150, net: 2107, avail: 97.2, status: "approved" },
];
const PREVIEW_LD_DATA = [
  { vendor: "Mega Solar Inc", plant: "Devdaithan Solar Plant",     clause: "Cl. 8.2 – CUF",    breach: "4.5%", penalty: "₹0.55 Cr", risk: "high" },
  { vendor: "SolarCo India", plant: "Amravati Solar Unit",    clause: "Cl. 8.2 – CUF",    breach: "5.5%", penalty: "₹0.69 Cr", risk: "high" },
  { vendor: "SunPower Tech", plant: "Sangli Solar Farm",    clause: "Cl. 9.1 – Avail",  breach: "3.5%", penalty: "₹0.28 Cr", risk: "medium" },
  { vendor: "SunPower Tech", plant: "Wardha Solar Park", clause: "Cl. 8.2 – CUF",    breach: "3.2%", penalty: "₹0.20 Cr", risk: "medium" },
  { vendor: "SolarCo India", plant: "Sakri Solar Park",  clause: "—",                 breach: "—",    penalty: "₹0.00 Cr", risk: "none" },
];

function ReportPreviewContent({ template }: { template: typeof reportTemplates[0] | null }) {
  if (!template) return null;

  const KpiMini = ({ label, value, sub, color = "blue" }: { label: string; value: string; sub?: string; color?: string }) => {
    const border = color === "green" ? "border-emerald-400" : color === "red" ? "border-rose-400" : color === "amber" ? "border-amber-400" : "border-blue-400";
    return (
      <div className={`bg-white border-l-4 ${border} rounded-lg p-3 shadow-sm`}>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
    );
  };

  const SectionHeader = ({ title, icon }: { title: string; icon?: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
      {icon}
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
    </div>
  );

  const complianceBadge = (s: string) => {
    if (s === "approved" || s === "Compliant") return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-emerald-100 text-emerald-700">✓ {s === "approved" ? "Approved" : "Compliant"}</span>;
    if (s === "pending" || s === "Warning")    return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-amber-100 text-amber-700">⚠ {s === "pending" ? "Pending" : "Warning"}</span>;
    if (s === "review")                        return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-blue-100 text-blue-700">↻ Under Review</span>;
    return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-rose-100 text-rose-700">✗ Non-Compliant</span>;
  };
  const riskBadge = (r: string) => {
    if (r === "none")   return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-emerald-100 text-emerald-700">None</span>;
    if (r === "medium") return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-amber-100 text-amber-700">Medium</span>;
    if (r === "high")   return <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-rose-100 text-rose-700">High</span>;
    return null;
  };

  switch (template.id) {
    // ── Monthly Performance ──────────────────────────────────────────────
    case "monthly-perf":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="MTD Generation" value="42,580 MWh" sub="95% of target" color="blue" />
            <KpiMini label="Portfolio CUF"  value="22.3 %"     sub="Target: 24%" color="amber" />
            <KpiMini label="Grid Availability" value="95.1 %" sub="Target: 98%" color="amber" />
            <KpiMini label="Revenue Realized"  value="₹7.7 Cr" sub="86% of target" color="green" />
          </div>
          <div>
            <SectionHeader title="Monthly Generation vs Target (MWh)" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PREVIEW_MONTHLY_CHART} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="gen" name="Actual (MWh)" fill="#2955A0" radius={[3,3,0,0]} />
                  <Bar dataKey="target" name="Target (MWh)" fill="#E8A800" opacity={0.6} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <SectionHeader title="Plant-wise Performance" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["Plant","Generation","vs Target","CUF","Availability","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {PREVIEW_MONTHLY_PLANTS.map((r, i) => {
                  const pct = ((r.gen - r.target) / r.target * 100);
                  return (
                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-800">{r.plant}</td>
                      <td className="px-3 py-2 font-mono">{r.gen.toLocaleString()} MWh</td>
                      <td className={`px-3 py-2 font-bold ${pct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{pct >= 0 ? "+" : ""}{pct.toFixed(1)}%</td>
                      <td className="px-3 py-2">{r.cuf}%</td>
                      <td className="px-3 py-2">{r.avail}%</td>
                      <td className="px-3 py-2">{complianceBadge(r.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );

    // ── Executive Dashboard ──────────────────────────────────────────────
    case "exec-dashboard":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="Total Revenue"   value="₹7.7 Cr"  sub="MTD realized" color="green" />
            <KpiMini label="Portfolio CUF"   value="22.3 %"   sub="⚠ Below 24% target" color="amber" />
            <KpiMini label="LD Exposure"     value="₹1.24 Cr" sub="2 high-risk plants" color="red" />
            <KpiMini label="Asset Health"    value="90.5 / 100" sub="Good" color="blue" />
          </div>
          <div>
            <SectionHeader title="6-Month KPI Trend" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={PREVIEW_MONTHLY_CHART} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="gen" name="Generation (MWh)" stroke="#2955A0" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="target" name="Target (MWh)" stroke="#E8A800" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </RLineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { label: "✗ Non-Compliant Plants", value: "2 plants", color: "bg-rose-50 border-rose-200" },
              { label: "⚠ Pending JMR Submissions", value: "3 plants", color: "bg-amber-50 border-amber-200" },
              { label: "✓ On-track for Annual Target", value: "7 of 11 plants", color: "bg-emerald-50 border-emerald-200" },
            ].map(item => (
              <div key={item.label} className={`${item.color} border rounded-lg p-3`}>
                <p className="font-semibold text-slate-700">{item.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      );

    // ── LD & Compliance ──────────────────────────────────────────────────
    case "ld-compliance":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="Total LD Exposure" value="₹1.24 Cr" sub="Current month" color="red" />
            <KpiMini label="YTD LD Paid"       value="₹3.85 Cr" sub="+18% vs last FY" color="red" />
            <KpiMini label="Non-Compliant"     value="2 plants"  sub="High risk" color="red" />
            <KpiMini label="Compliant Plants"  value="7 / 11"    sub="63.6%" color="green" />
          </div>
          <div>
            <SectionHeader title="LD Breach Log — February 2026" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["Vendor","Plant","PPA Clause","Breach","Penalty","Risk"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {PREVIEW_LD_DATA.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{r.vendor}</td>
                    <td className="px-3 py-2 text-slate-700">{r.plant}</td>
                    <td className="px-3 py-2 text-slate-500">{r.clause}</td>
                    <td className={`px-3 py-2 font-bold ${r.breach !== "—" ? "text-rose-600" : "text-slate-400"}`}>{r.breach}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{r.penalty}</td>
                    <td className="px-3 py-2">{riskBadge(r.risk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <SectionHeader title="LD Exposure by Vendor (₹ Cr)" />
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PREVIEW_VENDOR_DATA} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="vendor" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={60} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Bar dataKey="ld" name="LD Exposure (₹ Cr)" fill="#ef4444" radius={[0,3,3,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );

    // ── Vendor Comparison ────────────────────────────────────────────────
    case "vendor-comparison":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="Best CUF"     value="Mega Solar Inc" sub="23.7% avg CUF" color="green" />
            <KpiMini label="Best Avail."  value="Mega Solar Inc" sub="97.8% avg" color="green" />
            <KpiMini label="Most LD"      value="SunPower Tech" sub="₹1.24 Cr exposure" color="red" />
            <KpiMini label="Total Plants" value="11 plants" sub="Across 4 vendors" color="blue" />
          </div>
          <div>
            <SectionHeader title="Vendor Performance Scorecard" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PREVIEW_VENDOR_DATA} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="vendor" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="cuf" name="CUF %" fill="#2955A0" radius={[3,3,0,0]} />
                  <Bar dataKey="avail" name="Availability %" fill="#10B981" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <SectionHeader title="Detailed Comparison" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["Vendor","Plants","CUF","Availability","LD Exposure","Ranking"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {[...PREVIEW_VENDOR_DATA].sort((a,b) => b.cuf - a.cuf).map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{r.vendor}</td>
                    <td className="px-3 py-2">{r.plants}</td>
                    <td className={`px-3 py-2 font-bold ${r.cuf >= 23 ? "text-emerald-600" : r.cuf >= 21 ? "text-amber-600" : "text-rose-600"}`}>{r.cuf}%</td>
                    <td className={`px-3 py-2 font-bold ${r.avail >= 97 ? "text-emerald-600" : r.avail >= 95 ? "text-amber-600" : "text-rose-600"}`}>{r.avail}%</td>
                    <td className={`px-3 py-2 font-bold ${r.ld > 0.5 ? "text-rose-600" : r.ld > 0 ? "text-amber-600" : "text-emerald-600"}`}>₹{r.ld} Cr</td>
                    <td className="px-3 py-2 font-bold">#{i + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    // ── JMR Summary ──────────────────────────────────────────────────────
    case "jmr-summary":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="Total Submissions" value="11 plants"  sub="February 2026" color="blue" />
            <KpiMini label="Approved"          value="3 records"  sub="27.3%" color="green" />
            <KpiMini label="Pending / Review"  value="2 records"  sub="Awaiting checker" color="amber" />
            <KpiMini label="Data Coverage"     value="100%"       sub="All plants submitted" color="green" />
          </div>
          <div>
            <SectionHeader title="JMR Records — February 2026" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["JMR ID","Plant","Gross Gen (MWh)","Net Export (MWh)","Availability","Status"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {PREVIEW_JMR_RECORDS.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-slate-500">{r.id}</td>
                    <td className="px-3 py-2 font-medium">{r.plant}</td>
                    <td className="px-3 py-2 font-mono">{r.gross.toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono">{r.net.toLocaleString()}</td>
                    <td className="px-3 py-2">{r.avail}%</td>
                    <td className="px-3 py-2">{complianceBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
            <p className="font-semibold text-slate-800 mb-1">Data Quality Summary</p>
            <div className="grid grid-cols-3 gap-4">
              <span>Total Gross Generation: <strong>11,900 MWh</strong></span>
              <span>Total Net Export: <strong>11,647 MWh</strong></span>
              <span>Portfolio Availability: <strong>95.1%</strong></span>
            </div>
          </div>
        </div>
      );

    // ── Revenue Analysis ─────────────────────────────────────────────────
    case "revenue-analysis":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="MTD Revenue"   value="₹7.7 Cr"  sub="86% of target" color="amber" />
            <KpiMini label="YTD Revenue"   value="₹48.2 Cr" sub="On track" color="green" />
            <KpiMini label="Shortfall"     value="₹1.3 Cr"  sub="Current month" color="red" />
            <KpiMini label="Collection %"  value="91.4%"    sub="DSO: 42 days" color="blue" />
          </div>
          <div>
            <SectionHeader title="Revenue vs Target — 6 Months (₹ Cr)" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PREVIEW_REVENUE_CHART} margin={{ left: 0, right: 10 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={40} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} formatter={(v: number) => [`₹${v} Cr`]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="realized" name="Realized (₹ Cr)" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" />
                  <Line type="monotone" dataKey="target" name="Target (₹ Cr)" stroke="#E8A800" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { label: "Energy Sale", pct: "87%", value: "₹6.7 Cr" },
              { label: "REC Income", pct: "7.4%", value: "₹0.57 Cr" },
              { label: "Incentives & Bonus", pct: "5.6%", value: "₹0.43 Cr" },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-slate-500">{item.label}</p>
                <p className="text-xl font-bold text-slate-900">{item.value}</p>
                <p className="text-slate-400">{item.pct} of total</p>
              </div>
            ))}
          </div>
        </div>
      );

    // ── Outage & Loss Analysis ───────────────────────────────────────────
    case "outage-analysis":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="Total Outage Events" value="5"         sub="February 2026" color="red" />
            <KpiMini label="Energy Lost"         value="437 MWh"  sub="1.02% of potential" color="red" />
            <KpiMini label="Revenue Impact"      value="₹0.52 Cr" sub="Unrecovered" color="amber" />
            <KpiMini label="Grid Availability"   value="95.1%"    sub="Target: 98%" color="amber" />
          </div>
          <div>
            <SectionHeader title="Outage Event Log — February 2026" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["Date","Plant","Type","Duration","Energy Lost","Severity"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {PREVIEW_OUTAGE_LOG.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-500">{r.date}</td>
                    <td className="px-3 py-2 font-medium">{r.plant}</td>
                    <td className="px-3 py-2 text-slate-700">{r.type}</td>
                    <td className="px-3 py-2 font-mono">{r.duration}</td>
                    <td className="px-3 py-2 font-bold text-rose-600">{r.loss}</td>
                    <td className="px-3 py-2">{riskBadge(r.severity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <SectionHeader title="Loss Breakdown by Type (MWh)" />
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { type: "Grid Curtailment", loss: 184 },
                  { type: "Equipment Fault", loss: 95 },
                  { type: "Sched. Maintenance", loss: 72 },
                  { type: "Transmission", loss: 48 },
                  { type: "Force Majeure", loss: 38 },
                ]} layout="vertical" margin={{ left: 120, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Bar dataKey="loss" name="Energy Lost (MWh)" fill="#ef4444" radius={[0,3,3,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );

    // ── Generation Forecast ──────────────────────────────────────────────
    case "forecast-report":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            <KpiMini label="7-Day Forecast"   value="11,270 MWh" sub="Avg 1,610 MWh/day" color="blue" />
            <KpiMini label="AI Confidence"    value="87.4%"      sub="High confidence" color="green" />
            <KpiMini label="Weather Risk"     value="Low"        sub="Clear skies forecast" color="green" />
            <KpiMini label="Expected Revenue" value="₹1.35 Cr"   sub="Next 7 days" color="blue" />
          </div>
          <div>
            <SectionHeader title="7-Day Generation Forecast (MWh/day)" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PREVIEW_FORECAST_DATA} margin={{ left: 0, right: 10 }}>
                  <defs>
                    <linearGradient id="fcstGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={50} domain={[1300, 1900]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="upper" name="Upper Bound" stroke="transparent" fill="url(#fcstGrad)" legendType="none" />
                  <Area type="monotone" dataKey="lower" name="Lower Bound" stroke="transparent" fill="#fff" legendType="none" />
                  <Line type="monotone" dataKey="forecast" name="Forecast (MWh)" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <SectionHeader title="Daily Forecast Breakdown" />
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>{["Date","Forecast (MWh)","Lower","Upper","Confidence","Revenue Est."].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600">{h}</th>)}</tr>
              </thead>
              <tbody>
                {PREVIEW_FORECAST_DATA.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-700 font-medium">{r.day}</td>
                    <td className="px-3 py-2 font-mono font-bold text-blue-700">{r.forecast.toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-slate-400">{r.lower.toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-slate-400">{r.upper.toLocaleString()}</td>
                    <td className="px-3 py-2 text-emerald-600 font-bold">87%</td>
                    <td className="px-3 py-2 text-emerald-700 font-bold">₹{(r.forecast * 0.00012).toFixed(2)} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{template.name}</h3>
          <p className="text-slate-500 text-sm">{template.description}</p>
        </div>
      );
  }
}

// ── HTML report generator for download ────────────────────────────────────
function buildReportHTML(template: typeof reportTemplates[0]): string {
  const now = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${template.name} — E-SAMMP</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:40px;color:#1e293b;background:#f8fafc;}
  h1{color:#2955A0;font-size:24px;margin-bottom:4px;}
  .sub{color:#64748b;font-size:13px;margin-bottom:24px;}
  .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#e0f2fe;color:#0369a1;}
  .kpi-row{display:flex;gap:16px;margin-bottom:28px;}
  .kpi{flex:1;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;border-left:4px solid #2955A0;}
  .kpi label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#64748b;}
  .kpi .val{font-size:22px;font-weight:800;color:#0f172a;margin-top:4px;}
  table{width:100%;border-collapse:collapse;font-size:12px;background:#fff;border-radius:8px;overflow:hidden;margin-bottom:24px;}
  th{background:#f1f5f9;text-align:left;padding:9px 12px;font-weight:700;color:#475569;border-bottom:2px solid #e2e8f0;}
  td{padding:8px 12px;border-bottom:1px solid #f1f5f9;}
  .footer{margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;}
  @media print{body{padding:20px;}button{display:none;}}
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
  <div>
    <h1>${template.name}</h1>
    <p class="sub">${template.description} &nbsp;|&nbsp; <span class="badge">${template.category}</span></p>
  </div>
  <div style="text-align:right;font-size:12px;color:#64748b;">
    <div style="font-weight:700;color:#2955A0;font-size:15px;">E-SAMMP</div>
    <div>EESL Solar Asset Management</div>
    <div>Generated: ${now}</div>
    <button onclick="window.print()" style="margin-top:8px;padding:5px 12px;background:#2955A0;color:#fff;border:none;border-radius:5px;cursor:pointer;">Print / Save PDF</button>
  </div>
</div>

<div class="kpi-row">
  <div class="kpi"><label>Report Period</label><div class="val">Apr 2026</div></div>
  <div class="kpi"><label>Plants Covered</label><div class="val">11</div></div>
  <div class="kpi"><label>Frequency</label><div class="val">${template.frequency}</div></div>
  <div class="kpi"><label>Estimated Pages</label><div class="val">~12 pg</div></div>
</div>

<h2 style="font-size:15px;color:#2955A0;border-bottom:2px solid #e2e8f0;padding-bottom:8px;margin-bottom:16px;">${template.name} — Summary Data</h2>

<table>
  <tr><th>Metric</th><th>Current</th><th>Target</th><th>Status</th></tr>
  <tr><td>MTD Generation</td><td>42,580 MWh</td><td>45,000 MWh</td><td>⚠ 94.6%</td></tr>
  <tr><td>Portfolio CUF</td><td>22.3%</td><td>24.0%</td><td>⚠ Warning</td></tr>
  <tr><td>Grid Availability</td><td>95.1%</td><td>98.0%</td><td>⚠ Warning</td></tr>
  <tr><td>Revenue Realized</td><td>₹7.7 Cr</td><td>₹9.0 Cr</td><td>⚠ 85.6%</td></tr>
  <tr><td>LD Exposure</td><td>₹1.24 Cr</td><td>₹0 Cr</td><td>✗ Alert</td></tr>
  <tr><td>Asset Health Index</td><td>90.5 / 100</td><td>90.0 / 100</td><td>✓ On Target</td></tr>
</table>

<h2 style="font-size:15px;color:#2955A0;border-bottom:2px solid #e2e8f0;padding-bottom:8px;margin-bottom:16px;">Plant-wise Breakdown</h2>
<table>
  <tr><th>Plant</th><th>State</th><th>Capacity (MW)</th><th>Generation (MWh)</th><th>CUF (%)</th><th>Availability (%)</th></tr>
  <tr><td>Sakri Solar Park</td><td>Maharashtra</td><td>25</td><td>2,150</td><td>23.5</td><td>97.2</td></tr>
  <tr><td>Sangli Solar Farm</td><td>Maharashtra</td><td>15</td><td>1,180</td><td>21.2</td><td>94.5</td></tr>
  <tr><td>Osmanabad Solar Plant</td><td>Maharashtra</td><td>30</td><td>2,380</td><td>24.1</td><td>96.8</td></tr>
  <tr><td>Latur Solar Station</td><td>Maharashtra</td><td>20</td><td>1,720</td><td>23.8</td><td>97.5</td></tr>
  <tr><td>Devdaithan Solar Plant</td><td>Maharashtra</td><td>18</td><td>1,310</td><td>19.5</td><td>91.2</td></tr>
  <tr><td>Beed Solar Park</td><td>Maharashtra</td><td>22</td><td>1,920</td><td>24.5</td><td>98.1</td></tr>
  <tr><td>Wardha Solar Park</td><td>Maharashtra</td><td>28</td><td>2,120</td><td>20.8</td><td>93.5</td></tr>
</table>

<p class="footer">
  Report generated by E-SAMMP · EESL Solar Asset Management &amp; Monitoring Platform ·
  This report contains confidential data intended for authorized recipients only. ·
  Tags: ${template.tags.join(", ")} · Recipients: ${template.recipients} · Last generated: ${template.lastGenerated}
</p>
</body>
</html>`;
}

export function ReportsMIS() {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);

  // Generate state (T: Reports Generate)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [generateStep, setGenerateStep] = useState("");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generatingName, setGeneratingName] = useState("");
  const [templateLastGenerated, setTemplateLastGenerated] = useState<Record<string, string>>({});

  const handleGenerate = (template: typeof reportTemplates[0]) => {
    setGeneratingName(template.name);
    setGenerateProgress(0);
    setGenerateStep("Fetching data…");
    setIsGenerating(true);
    setGenerateDialogOpen(true);

    const steps: Array<[number, string]> = [
      [15, "Fetching data…"],
      [35, "Processing plant records…"],
      [55, "Applying filters & aggregations…"],
      [75, "Rendering report layout…"],
      [90, "Packaging document…"],
      [100, "Complete!"],
    ];

    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        const [pct, label] = steps[i];
        setGenerateProgress(pct);
        setGenerateStep(label);
        i++;
        setTimeout(tick, i === steps.length ? 600 : 520);
      } else {
        setIsGenerating(false);
        const html = buildReportHTML(template);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
        setTemplateLastGenerated(prev => ({ ...prev, [template.id]: "Just now" }));
        toast.success(`${template.name} downloaded successfully`);
      }
    };
    setTimeout(tick, 300);
  };

  // Report Builder State
  const [rowFields, setRowFields] = useState<any[]>([]);
  const [columnFields, setColumnFields] = useState<any[]>([]);
  const [filterFields, setFilterFields] = useState<any[]>([]);
  const [visualizationType, setVisualizationType] = useState("table");
  const [aggregationType, setAggregationType] = useState("sum");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Performance", "Location", "Time"]);
  const [reportName, setReportName] = useState("Untitled Report");

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(reportTemplates.map(t => t.category)));
  const fieldCategories = Array.from(new Set(dataFields.map(f => f.category)));

  // Statistics
  const stats = {
    totalTemplates: reportTemplates.length,
    activeSchedules: scheduledReports.filter(r => r.status === "active").length,
    reportsThisMonth: 62,
    avgGenerationTime: "3.2 min",
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleFieldDrop = (field: any, zone: "row" | "column" | "filter") => {
    const setter = zone === "row" ? setRowFields : zone === "column" ? setColumnFields : setFilterFields;
    const current = zone === "row" ? rowFields : zone === "column" ? columnFields : filterFields;
    
    if (!current.some(f => f.id === field.id)) {
      setter([...current, field]);
      toast.success(`${field.name} added to ${zone}s`);
    }
  };

  const handleFieldRemove = (index: number, zone: "row" | "column" | "filter") => {
    const setter = zone === "row" ? setRowFields : zone === "column" ? setColumnFields : setFilterFields;
    const current = zone === "row" ? rowFields : zone === "column" ? columnFields : filterFields;
    
    setter(current.filter((_, idx) => idx !== index));
  };

  const clearAllFields = () => {
    setRowFields([]);
    setColumnFields([]);
    setFilterFields([]);
    toast.success("All fields cleared");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
        
        {/* Enhanced Header */}
        <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 sticky top-0 z-20">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#2955A0] rounded-lg">
                  <FileBarChart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 leading-none">Reports & MIS</h1>
                  <p className="text-xs text-slate-600 mt-0.5">Management Information System · Power BI-Style Reporting</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2 border-slate-300 h-7 px-3 text-xs"
                  onClick={() => setScheduleDialogOpen(true)}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Report
                </Button>
                
                <Button 
                  size="sm"
                  className="gap-2 bg-[#2955A0] hover:bg-[#1E4888] text-white shadow-md h-7 px-3 text-xs"
                  onClick={() => setViewMode("builder")}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Report Builder
                </Button>

                <Button variant="outline" size="sm" className="border-slate-300 h-7 w-7 p-0">
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Report Templates</span>
                    <LayoutGrid className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stats.totalTemplates}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Active Schedules</span>
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stats.activeSchedules}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Reports This Month</span>
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stats.reportsThisMonth}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Avg Gen Time</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stats.avgGenerationTime}</div>
                </CardContent>
              </Card>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-auto">
                <TabsList className="bg-slate-100 border border-slate-200 p-1 h-11">
                  <TabsTrigger value="gallery" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3">
                    <Grid3x3 className="w-4 h-4" />
                    Template Gallery
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3">
                    <Wand2 className="w-4 h-4" />
                    Report Builder
                  </TabsTrigger>
                  <TabsTrigger value="scheduled" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3">
                    <CalendarDays className="w-4 h-4" />
                    Scheduled
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3">
                    <Clock className="w-4 h-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search & Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48 h-10 bg-slate-50 border-slate-200"
                  />
                </div>

                {viewMode === "gallery" && (
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-36 h-10 bg-slate-50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          
          {/* Template Gallery View */}
          {viewMode === "gallery" && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-[1600px] mx-auto pb-12">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map((template) => {
                    const Icon = template.icon;
                    const categoryStyle = categoryColors[template.category];
                    const statusStyle = statusConfig[template.status];
                    
                    return (
                      <motion.div
                        key={template.id}
                        whileHover={{ y: -4 }}
                        className="group"
                      >
                        <Card className="border-2 border-slate-200 hover:border-[#2955A0] hover:shadow-xl transition-all cursor-pointer h-full">
                          <CardHeader className="pb-3">
                            {/* Thumbnail Preview */}
                            <div className={`h-32 rounded-lg mb-4 ${categoryStyle.bg} ${categoryStyle.border} border-2 flex items-center justify-center relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                              <Icon className={`w-12 h-12 ${categoryStyle.text} relative z-10`} />
                              
                              {/* Hover Actions */}
                              <div className="absolute inset-0 bg-[#2955A0]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="gap-2 bg-white hover:bg-slate-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTemplate(template);
                                    setPreviewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerate(template);
                                  }}
                                >
                                  <Play className="w-4 h-4" />
                                  Generate
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{template.name}</h3>
                                <Badge variant="outline" className={`text-xs ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                                  {template.category}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>

                            <p className="text-xs text-slate-600 line-clamp-2 mb-3">{template.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 bg-slate-100 text-slate-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardHeader>

                          <Separator />

                          <CardContent className="pt-3 pb-3">
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Status:</span>
                                <Badge className={`${statusStyle.color} text-xs px-2 py-0`}>
                                  {statusStyle.label}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Frequency:</span>
                                <span className="font-semibold text-slate-900">{template.frequency}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Recipients:</span>
                                <span className="font-semibold text-slate-900 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {template.recipients}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Last Generated:</span>
                                <span className={`font-medium ${templateLastGenerated[template.id] ? "text-emerald-600" : "text-slate-700"}`}>
                                  {templateLastGenerated[template.id] || template.lastGenerated}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Est. Time:</span>
                                <span className="font-medium text-slate-700 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {template.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-24">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No reports found</h3>
                    <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* POWER BI-STYLE REPORT BUILDER VIEW */}
          {viewMode === "builder" && (
            <div className="flex h-full overflow-hidden">
              
              {/* LEFT PANEL - Fields Palette */}
              <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-[#2955A0] to-[#2955A0]/90 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-white" />
                    <h2 className="text-sm font-bold text-white">Data Fields</h2>
                  </div>
                  <p className="text-xs text-blue-100">Drag fields to build your report</p>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-3">
                    {fieldCategories.map((category) => (
                      <div key={category} className="space-y-2">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{category}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {dataFields.filter(f => f.category === category).length}
                            </Badge>
                            {expandedCategories.includes(category) ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedCategories.includes(category) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-1.5 pl-2"
                            >
                              {dataFields
                                .filter(f => f.category === category)
                                .map((field) => (
                                  <DraggableField key={field.id} field={field} />
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-xs"
                    onClick={clearAllFields}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear All Fields
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-xs"
                  >
                    <Wand2 className="w-4 h-4" />
                    Auto-Generate Report
                  </Button>
                </div>
              </div>

              {/* CENTER PANEL - Report Canvas */}
              <div className="flex-1 flex flex-col bg-slate-50 min-h-0">
                
                {/* Canvas Toolbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <Input
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="font-semibold text-sm border-none shadow-none focus-visible:ring-0 px-0 w-64"
                    />
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">Unsaved</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Load Template
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button size="sm" className="gap-2 bg-[#2955A0]">
                      <Play className="w-4 h-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6 pb-12">
                    
                    {/* Field Wells (Power BI Style) */}
                    <Card className="border-2 border-slate-200 shadow-lg">
                      <CardHeader className="border-b bg-slate-50 pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Field Wells
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Drag and drop fields to configure your report structure
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                          <FieldWell
                            title="Rows / Dimensions"
                            icon={Database}
                            fields={rowFields}
                            onDrop={(field: any) => handleFieldDrop(field, "row")}
                            onRemove={(idx: number) => handleFieldRemove(idx, "row")}
                            acceptType="dimension"
                          />
                          
                          <FieldWell
                            title="Columns / Values"
                            icon={Sigma}
                            fields={columnFields}
                            onDrop={(field: any) => handleFieldDrop(field, "column")}
                            onRemove={(idx: number) => handleFieldRemove(idx, "column")}
                            acceptType="measure"
                          />
                          
                          <FieldWell
                            title="Filters"
                            icon={Filter}
                            fields={filterFields}
                            onDrop={(field: any) => handleFieldDrop(field, "filter")}
                            onRemove={(idx: number) => handleFieldRemove(idx, "filter")}
                            acceptType="all"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Live Preview */}
                    <Card className="border-2 border-slate-200 shadow-lg">
                      <CardHeader className="border-b bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Live Preview
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Real-time visualization of your report
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Visualization Type Selector */}
                            <Select value={visualizationType} onValueChange={setVisualizationType}>
                              <SelectTrigger className="w-40 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {visualizationTypes.map((viz) => {
                                  const VizIcon = viz.icon;
                                  return (
                                    <SelectItem key={viz.id} value={viz.id}>
                                      <div className="flex items-center gap-2">
                                        <VizIcon className="w-4 h-4" />
                                        {viz.name}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>

                            <Select value={aggregationType} onValueChange={setAggregationType}>
                              <SelectTrigger className="w-32 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sum">Sum</SelectItem>
                                <SelectItem value="avg">Average</SelectItem>
                                <SelectItem value="count">Count</SelectItem>
                                <SelectItem value="min">Minimum</SelectItem>
                                <SelectItem value="max">Maximum</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        {rowFields.length === 0 && columnFields.length === 0 ? (
                          <div className="text-center py-20">
                            <Wand2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your Report</h3>
                            <p className="text-sm text-slate-600 mb-6">
                              Drag fields from the left panel into the field wells above
                            </p>
                            <div className="flex gap-2 justify-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Hash className="w-3 h-3 mr-1" />
                                Measures = Values
                              </Badge>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                <Type className="w-3 h-3 mr-1" />
                                Dimensions = Rows
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="min-h-[400px]">
                            {visualizationType === "table" && (
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50">
                                      {rowFields.map((field) => (
                                        <TableHead key={field.id} className="font-bold text-xs">
                                          {field.name}
                                        </TableHead>
                                      ))}
                                      {columnFields.map((field) => (
                                        <TableHead key={field.id} className="font-bold text-xs text-right">
                                          {field.name}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {sampleData.slice(0, 7).map((row, idx) => (
                                      <TableRow key={idx}>
                                        {rowFields.map((field) => (
                                          <TableCell key={field.id} className="text-xs font-medium">
                                            {(row as any)[field.id] ?? "-"}
                                          </TableCell>
                                        ))}
                                        {columnFields.map((field) => (
                                          <TableCell key={field.id} className="text-xs text-right font-semibold">
                                            {(row as any)[field.id]?.toLocaleString() ?? "-"}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {visualizationType === "bar" && columnFields.length > 0 && (
                              <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={sampleData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                      dataKey={rowFields[0]?.id || "plant"} 
                                      tick={{ fontSize: 11 }} 
                                      stroke="#64748b" 
                                    />
                                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                                    <Tooltip 
                                      contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                      }}
                                    />
                                    <Legend />
                                    {columnFields.map((field, idx) => (
                                      <Bar 
                                        key={field.id} 
                                        dataKey={field.id} 
                                        fill={idx === 0 ? "#2955A0" : idx === 1 ? "#10B981" : "#E8A800"} 
                                        name={field.name}
                                      />
                                    ))}
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {visualizationType === "line" && columnFields.length > 0 && (
                              <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RLineChart data={sampleData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                      dataKey={rowFields[0]?.id || "plant"} 
                                      tick={{ fontSize: 11 }} 
                                      stroke="#64748b" 
                                    />
                                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                                    <Tooltip 
                                      contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                      }}
                                    />
                                    <Legend />
                                    {columnFields.map((field, idx) => (
                                      <Line 
                                        key={field.id} 
                                        type="monotone"
                                        dataKey={field.id} 
                                        stroke={idx === 0 ? "#2955A0" : idx === 1 ? "#10B981" : "#E8A800"} 
                                        strokeWidth={2}
                                        name={field.name}
                                      />
                                    ))}
                                  </RLineChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {visualizationType === "area" && columnFields.length > 0 && (
                              <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={sampleData}>
                                    <defs>
                                      <linearGradient id="colorField1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2955A0" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2955A0" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorField2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                      dataKey={rowFields[0]?.id || "plant"} 
                                      tick={{ fontSize: 11 }} 
                                      stroke="#64748b" 
                                    />
                                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                                    <Tooltip 
                                      contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                      }}
                                    />
                                    <Legend />
                                    {columnFields.map((field, idx) => (
                                      <Area 
                                        key={field.id} 
                                        type="monotone"
                                        dataKey={field.id} 
                                        stroke={idx === 0 ? "#2955A0" : "#10B981"} 
                                        strokeWidth={2}
                                        fill={idx === 0 ? "url(#colorField1)" : "url(#colorField2)"}
                                        name={field.name}
                                      />
                                    ))}
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {visualizationType === "pie" && columnFields.length > 0 && rowFields.length > 0 && (
                              <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RPieChart>
                                    <Pie
                                      data={sampleData.slice(0, 5)}
                                      dataKey={columnFields[0].id}
                                      nameKey={rowFields[0].id}
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={120}
                                      label
                                    >
                                      {sampleData.slice(0, 5).map((entry, index) => (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill={['#2955A0', '#10B981', '#E8A800', '#8B5CF6', '#EF4444'][index]}
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                  </RPieChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {visualizationType === "kpi" && columnFields.length > 0 && (
                              <div className="grid grid-cols-4 gap-6">
                                {columnFields.map((field, idx) => {
                                  const value = sampleData.reduce((sum, row) => sum + ((row as any)[field.id] || 0), 0);
                                  const avg = value / sampleData.length;
                                  
                                  return (
                                    <Card key={field.id} className="border-2 border-slate-200">
                                      <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                          <span className="text-sm font-medium text-slate-600">{field.name}</span>
                                          <Target className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-slate-900 mb-2">
                                          {aggregationType === "sum" ? value.toLocaleString() : avg.toFixed(1)}
                                        </div>
                                        <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                                          <TrendingUp className="w-4 h-4" />
                                          +12% vs last period
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                  </div>
                </div>
              </div>

              {/* RIGHT PANEL - Settings & Export */}
              <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-sm min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-[#2955A0] to-[#2955A0]/90 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-white" />
                    <h2 className="text-sm font-bold text-white">Settings & Export</h2>
                  </div>
                  <p className="text-xs text-blue-100">Configure report options</p>
                </div>

                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-6">
                    
                    {/* Aggregation Settings */}
                    <div>
                      <Label className="text-xs font-bold text-slate-700 mb-3 block uppercase tracking-wide">
                        Aggregation Method
                      </Label>
                      <Select value={aggregationType} onValueChange={setAggregationType}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sum">Sum (Total)</SelectItem>
                          <SelectItem value="avg">Average</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="min">Minimum</SelectItem>
                          <SelectItem value="max">Maximum</SelectItem>
                          <SelectItem value="weighted">Weighted Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Export Options */}
                    <div>
                      <Label className="text-xs font-bold text-slate-700 mb-3 block uppercase tracking-wide">
                        Export Format
                      </Label>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                          <FileText className="w-4 h-4 text-red-600" />
                          Export as PDF
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          Export as Excel (.xlsx)
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                          <Table2 className="w-4 h-4 text-blue-600" />
                          Export as CSV
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
                          <Database className="w-4 h-4 text-indigo-600" />
                          Export as JSON
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Report Info */}
                    <div>
                      <Label className="text-xs font-bold text-slate-700 mb-3 block uppercase tracking-wide">
                        Report Summary
                      </Label>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Dimensions:</span>
                          <Badge variant="secondary">{rowFields.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Measures:</span>
                          <Badge variant="secondary">{columnFields.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Filters:</span>
                          <Badge variant="secondary">{filterFields.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Visualization:</span>
                          <Badge variant="secondary">{visualizationTypes.find(v => v.id === visualizationType)?.name}</Badge>
                        </div>
                      </div>
                    </div>

                  </div>
                </ScrollArea>

                {/* Save Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
                  <Button className="w-full gap-2 bg-[#2955A0]">
                    <Save className="w-4 h-4" />
                    Save as Template
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Report
                  </Button>
                </div>
              </div>

            </div>
          )}

          {/* Scheduled Reports View (same as before) */}
          {viewMode === "scheduled" && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-[1400px] mx-auto pb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Scheduled Reports</h2>
                    <p className="text-slate-600 mt-1">Automated report generation and distribution</p>
                  </div>
                  <Button 
                    className="gap-2 bg-[#2955A0]"
                    onClick={() => setScheduleDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    New Schedule
                  </Button>
                </div>

                <div className="grid gap-4">
                  {scheduledReports.map((schedule) => {
                    const statusStyle = statusConfig[schedule.status];
                    
                    return (
                      <Card key={schedule.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-bold text-slate-900">{schedule.name}</h3>
                                <Badge className={`${statusStyle.color} px-3 py-1`}>
                                  {statusStyle.label}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-4 gap-6 text-sm">
                                <div>
                                  <div className="text-slate-600 mb-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Schedule
                                  </div>
                                  <div className="font-semibold text-slate-900">{schedule.schedule}</div>
                                </div>

                                <div>
                                  <div className="text-slate-600 mb-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Next Run
                                  </div>
                                  <div className="font-semibold text-slate-900">{schedule.nextRun}</div>
                                </div>

                                <div>
                                  <div className="text-slate-600 mb-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Recipients
                                  </div>
                                  <div className="font-semibold text-slate-900">{schedule.recipients.length} addresses</div>
                                </div>

                                <div>
                                  <div className="text-slate-600 mb-1 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Last Run
                                  </div>
                                  <div className="font-semibold text-slate-900">{schedule.lastRun}</div>
                                </div>
                              </div>

                              {/* Recipients List */}
                              <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex flex-wrap gap-2">
                                  {schedule.recipients.map((email) => (
                                    <Badge key={email} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {email}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 ml-6">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Pencil className="w-4 h-4" />
                                Edit
                              </Button>
                              {schedule.status === "active" ? (
                                <Button variant="outline" size="sm" className="gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Pause
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300">
                                  <Play className="w-4 h-4" />
                                  Activate
                                </Button>
                              )}
                              <Button variant="outline" size="sm" className="gap-2 text-rose-600 border-rose-300">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Report History View (same as before) */}
          {viewMode === "history" && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-[1400px] mx-auto pb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Report History</h2>
                    <p className="text-slate-600 mt-1">Previously generated reports and downloads</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export List
                    </Button>
                  </div>
                </div>

                <Card className="border-slate-200 shadow-md">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-bold">Report Name</TableHead>
                          <TableHead className="font-bold">Generated At</TableHead>
                          <TableHead className="font-bold">Generated By</TableHead>
                          <TableHead className="font-bold">Format</TableHead>
                          <TableHead className="font-bold">Size</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentReports.map((report) => {
                          const statusStyle = statusConfig[report.status];
                          
                          return (
                            <TableRow key={report.id} className="hover:bg-slate-50">
                              <TableCell>
                                <div>
                                  <div className="font-semibold text-slate-900">{report.name}</div>
                                  <div className="text-xs text-slate-500">{report.id}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-slate-700">{report.generatedAt}</TableCell>
                              <TableCell className="text-sm text-slate-700">{report.generatedBy}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {report.format}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium text-slate-700">{report.size}</TableCell>
                              <TableCell>
                                <Badge className={`${statusStyle.color} text-xs`}>
                                  {statusStyle.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    View
                                  </Button>
                                  {report.status === "completed" && (
                                    <Button variant="outline" size="sm" className="gap-2">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  )}
                                  {report.status === "failed" && (
                                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-300">
                                      <RefreshCw className="w-4 h-4" />
                                      Retry
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}

          {/* Analytics View (same as before) */}
          {viewMode === "analytics" && (
            <ScrollArea className="h-full">
              <div className="p-8 max-w-[1400px] mx-auto pb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Report Analytics</h2>
                  <p className="text-slate-600 mt-1">Usage statistics and performance metrics</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                  <Card className="border-slate-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600">Total Reports Generated</span>
                        <FileBarChart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-4xl font-bold text-slate-900 mb-1">284</div>
                      <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +12% vs last month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600">Total Downloads</span>
                        <Download className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-4xl font-bold text-slate-900 mb-1">756</div>
                      <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +18% vs last month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600">Active Schedules</span>
                        <CalendarDays className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-4xl font-bold text-slate-900 mb-1">{stats.activeSchedules}</div>
                      <div className="text-sm text-slate-600">Running smoothly</div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600">Avg Generation Time</span>
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-4xl font-bold text-slate-900 mb-1">{stats.avgGenerationTime}</div>
                      <div className="text-sm text-slate-600">System performance</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage Trends Chart */}
                <Card className="border-slate-200 shadow-md mb-6">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-base">Report Generation & Download Trends</CardTitle>
                    <CardDescription>Last 5 months activity</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={usageAnalytics}>
                          <defs>
                            <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2955A0" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2955A0" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="reports" 
                            stroke="#2955A0" 
                            strokeWidth={2}
                            fill="url(#colorReports)" 
                            name="Reports Generated"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="downloads" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            fill="url(#colorDownloads)" 
                            name="Downloads"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Reports */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="border-slate-200 shadow-md">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="text-base">Most Popular Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {reportTemplates.slice(0, 5).map((template, idx) => (
                          <div key={template.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-slate-900">{template.name}</div>
                                <div className="text-xs text-slate-600">{template.category}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">{145 - idx * 20}</div>
                              <div className="text-xs text-slate-600">generations</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="text-base">Reports by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {categories.map((category) => {
                          const count = reportTemplates.filter(t => t.category === category).length;
                          const percentage = (count / reportTemplates.length) * 100;
                          const style = categoryColors[category];
                          
                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-900">{category}</span>
                                <span className="text-sm font-bold text-slate-900">{count} reports</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Schedule Dialog */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Schedule Report Generation</DialogTitle>
              <DialogDescription>
                Configure automated report generation and email distribution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Select Report Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Time</Label>
                  <Input type="time" defaultValue="08:00" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Email Recipients</Label>
                <Input placeholder="Enter email addresses separated by commas" />
                <p className="text-xs text-slate-600 mt-1">e.g., ops@eesl.in, finance@eesl.in</p>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Export Format</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" className="justify-start gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    PDF
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Excel
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    CSV
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    DOCX
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setScheduleDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#2955A0]"
                  onClick={() => {
                    toast.success("Report schedule created successfully");
                    setScheduleDialogOpen(false);
                  }}
                >
                  Create Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-5xl h-[88vh] flex flex-col">
            <DialogHeader className="shrink-0 border-b border-slate-100 pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl text-[#2955A0]">{selectedTemplate?.name}</DialogTitle>
                  <DialogDescription className="mt-0.5">{selectedTemplate?.description}</DialogDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      if (selectedTemplate) handleGenerate(selectedTemplate);
                      setPreviewDialogOpen(false);
                    }}
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                    Generate & Download
                  </Button>
                </div>
              </div>
              {selectedTemplate && (
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Period: Apr 2026</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Frequency: {selectedTemplate.frequency}</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. {selectedTemplate.estimatedTime}</span>
                  {selectedTemplate.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">{t}</span>
                  ))}
                </div>
              )}
            </DialogHeader>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6">
                <ReportPreviewContent template={selectedTemplate} />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Generate Progress Dialog */}
        <Dialog open={generateDialogOpen} onOpenChange={(open) => { if (!isGenerating) setGenerateDialogOpen(open); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#2955A0]">
                {generateProgress < 100 ? (
                  <><div className="w-5 h-5 border-2 border-[#2955A0] border-t-transparent rounded-full animate-spin" /> Generating Report…</>
                ) : (
                  <><CheckCircle className="w-5 h-5 text-emerald-600" /> Report Ready</>
                )}
              </DialogTitle>
              <DialogDescription>{generatingName}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Progress value={generateProgress} className="h-2.5" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{generateStep}</span>
                <span className="font-bold text-[#2955A0]">{generateProgress}%</span>
              </div>
              {generateProgress === 100 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 flex items-center gap-2">
                  <Download className="w-4 h-4 shrink-0" />
                  Report downloaded to your device. Check your Downloads folder.
                </div>
              )}
            </div>
            {generateProgress === 100 && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>Close</Button>
                <Button className="bg-[#2955A0] gap-2" onClick={() => { setGenerateDialogOpen(false); setPreviewDialogOpen(true); }}>
                  <Eye className="w-4 h-4" /> View Preview
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}
