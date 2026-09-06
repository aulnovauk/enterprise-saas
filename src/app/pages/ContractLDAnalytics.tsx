import { useState, useRef, useMemo } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PLANTS, VENDORS } from "../data/plants";
import {
  FileText,
  DollarSign,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calculator,
  Bell,
  TrendingUp,
  Shield,
  Users,
  Building2,
  Sliders,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
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

// Site-wise LD exposure
const sitewiseLD = [
  {
    siteId: "EESL-MH-001",
    siteName: "Sakri Solar Park",
    capacity: 25,
    vendor: "SolarCo India",
    contractedGen: 2100,
    actualGen: 2150,
    shortfall: -50,
    ldRate: 0.012,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 97.2,
    targetAvailability: 95.0,
    cuf: 23.5,
    targetCuf: 23.0,
    pr: 79.8,
    targetPr: 78.0,
    responseTime: 3.5,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-002",
    siteName: "Sangli Solar Farm",
    capacity: 15,
    vendor: "SunPower Tech",
    contractedGen: 1260,
    actualGen: 1180,
    shortfall: 80,
    ldRate: 0.012,
    ldAmount: 0.96,
    complianceStatus: "amber",
    availability: 94.5,
    targetAvailability: 95.0,
    cuf: 21.2,
    targetCuf: 23.0,
    pr: 76.5,
    targetPr: 78.0,
    responseTime: 4.2,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-003",
    siteName: "Osmanabad Solar Plant",
    capacity: 30,
    vendor: "Green Energy Ltd",
    contractedGen: 2450,
    actualGen: 2380,
    shortfall: 70,
    ldRate: 0.015,
    ldAmount: 1.05,
    complianceStatus: "amber",
    availability: 96.8,
    targetAvailability: 95.0,
    cuf: 24.1,
    targetCuf: 23.0,
    pr: 80.2,
    targetPr: 78.0,
    responseTime: 3.6,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-004",
    siteName: "Latur Solar Station",
    capacity: 20,
    vendor: "TechSolar Pvt",
    contractedGen: 1680,
    actualGen: 1720,
    shortfall: -40,
    ldRate: 0.010,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 97.5,
    targetAvailability: 95.0,
    cuf: 23.8,
    targetCuf: 23.0,
    pr: 81.0,
    targetPr: 78.0,
    responseTime: 3.2,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-005",
    siteName: "Beed Solar Park",
    capacity: 30,
    vendor: "Mega Solar Inc",
    contractedGen: 1850,
    actualGen: 1920,
    shortfall: -70,
    ldRate: 0.012,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 98.1,
    targetAvailability: 95.0,
    cuf: 24.5,
    targetCuf: 23.0,
    pr: 79.5,
    targetPr: 78.0,
    responseTime: 3.4,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-006",
    siteName: "Ahmednagar Solar Plant",
    capacity: 12,
    vendor: "SolarCo India",
    contractedGen: 1480,
    actualGen: 1560,
    shortfall: -80,
    ldRate: 0.012,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 96.4,
    targetAvailability: 95.0,
    cuf: 23.2,
    targetCuf: 23.0,
    pr: 78.8,
    targetPr: 78.0,
    responseTime: 3.8,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-007",
    siteName: "Devdaithan Solar Plant",
    capacity: 18,
    vendor: "Mega Solar Inc",
    contractedGen: 1580,
    actualGen: 1310,
    shortfall: 270,
    ldRate: 0.018,
    ldAmount: 4.86,
    complianceStatus: "red",
    availability: 91.2,
    targetAvailability: 95.0,
    cuf: 19.5,
    targetCuf: 23.0,
    pr: 74.2,
    targetPr: 78.0,
    responseTime: 4.8,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-008",
    siteName: "Amravati Solar Unit",
    capacity: 14,
    vendor: "SolarCo India",
    contractedGen: 1680,
    actualGen: 1140,
    shortfall: 540,
    ldRate: 0.020,
    ldAmount: 10.8,
    complianceStatus: "red",
    availability: 88.3,
    targetAvailability: 95.0,
    cuf: 18.5,
    targetCuf: 23.0,
    pr: 72.5,
    targetPr: 78.0,
    responseTime: 5.2,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-009",
    siteName: "Wardha Solar Park",
    capacity: 16,
    vendor: "SunPower Tech",
    contractedGen: 2350,
    actualGen: 2120,
    shortfall: 230,
    ldRate: 0.015,
    ldAmount: 3.45,
    complianceStatus: "red",
    availability: 93.5,
    targetAvailability: 95.0,
    cuf: 20.8,
    targetCuf: 23.0,
    pr: 76.8,
    targetPr: 78.0,
    responseTime: 4.5,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-010",
    siteName: "Buldhana Solar Farm",
    capacity: 10,
    vendor: "SunPower Tech",
    contractedGen: 700,
    actualGen: 720,
    shortfall: -20,
    ldRate: 0.012,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 97.0,
    targetAvailability: 95.0,
    cuf: 22.8,
    targetCuf: 23.0,
    pr: 79.0,
    targetPr: 78.0,
    responseTime: 3.6,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-011",
    siteName: "Chandrapur Solar Project",
    capacity: 22,
    vendor: "SunPower Tech",
    contractedGen: 630,
    actualGen: 580,
    shortfall: 50,
    ldRate: 0.012,
    ldAmount: 0.60,
    complianceStatus: "amber",
    availability: 93.8,
    targetAvailability: 95.0,
    cuf: 21.5,
    targetCuf: 23.0,
    pr: 77.2,
    targetPr: 78.0,
    responseTime: 4.1,
    targetResponseTime: 4.0,
  },
  {
    siteId: "EESL-MH-012",
    siteName: "Bhandara Solar Station",
    capacity: 8,
    vendor: "Mega Solar Inc",
    contractedGen: 620,
    actualGen: 640,
    shortfall: -20,
    ldRate: 0.012,
    ldAmount: 0,
    complianceStatus: "green",
    availability: 96.5,
    targetAvailability: 95.0,
    cuf: 23.0,
    targetCuf: 23.0,
    pr: 78.5,
    targetPr: 78.0,
    responseTime: 3.7,
    targetResponseTime: 4.0,
  },
];

// Client / Procurer-wise LD data
const clientwiseLD = [
  {
    clientName: "SECI",
    clientType: "Central PSU",
    procurerType: "Central Agency",
    sites: 2,
    totalContractedMWh: 3350,
    totalActualMWh: 3100,
    totalShortfall: 250,
    ldExposure: 3.75,
    complianceRate: 40,
    contractValue: "₹6.7 Cr",
    tariff: "₹2.00/kWh",
    status: "critical",
  },
  {
    clientName: "NTPC",
    clientType: "Central PSU",
    procurerType: "Central Agency",
    sites: 1,
    totalContractedMWh: 2500,
    totalActualMWh: 2300,
    totalShortfall: 200,
    ldExposure: 3.60,
    complianceRate: 0,
    contractValue: "₹5.0 Cr",
    tariff: "₹2.00/kWh",
    status: "critical",
  },
  {
    clientName: "MP DISCOM",
    clientType: "State Utility",
    procurerType: "State Agency",
    sites: 1,
    totalContractedMWh: 4200,
    totalActualMWh: 4100,
    totalShortfall: 100,
    ldExposure: 1.00,
    complianceRate: 100,
    contractValue: "₹8.4 Cr",
    tariff: "₹2.00/kWh",
    status: "warning",
  },
  {
    clientName: "Maharashtra Urja Vikas",
    clientType: "State Utility",
    procurerType: "State Agency",
    sites: 1,
    totalContractedMWh: 1250,
    totalActualMWh: 1280,
    totalShortfall: -30,
    ldExposure: 0,
    complianceRate: 100,
    contractValue: "₹2.5 Cr",
    tariff: "₹2.00/kWh",
    status: "good",
  },
];

// Escalation alerts
const escalationAlerts = [
  {
    id: "ESC-2026-008",
    site: "Amravati Solar Unit",
    vendor: "SolarCo India",
    severity: "critical",
    issue: "Consistent availability below 93% for 3 consecutive months",
    ldExposure: 3.6,
    daysOpen: 15,
    status: "open",
  },
  {
    id: "ESC-2026-007",
    site: "Devdaithan Solar Plant",
    vendor: "Mega Solar Inc",
    severity: "high",
    issue: "Generation shortfall exceeds 5% threshold",
    ldExposure: 1.8,
    daysOpen: 8,
    status: "open",
  },
  {
    id: "ESC-2026-006",
    site: "Wardha Solar Park",
    vendor: "SunPower Tech",
    severity: "medium",
    issue: "CUF below guaranteed for 2 months",
    ldExposure: 1.0,
    daysOpen: 3,
    status: "acknowledged",
  },
];

// Monthly LD trend
const monthlyLDTrend = [
  { month: "Aug", ldAmount: 8.5, complianceRate: 60 },
  { month: "Sep", ldAmount: 6.3, complianceRate: 60 },
  { month: "Oct", ldAmount: 4.2, complianceRate: 80 },
  { month: "Nov", ldAmount: 7.8, complianceRate: 60 },
  { month: "Dec", ldAmount: 9.2, complianceRate: 40 },
  { month: "Jan", ldAmount: 5.5, complianceRate: 60 },
  { month: "Feb", ldAmount: 14.2, complianceRate: 40 },
  { month: "Mar", ldAmount: 6.8, complianceRate: 80 },
  { month: "Apr", ldAmount: 4.5, complianceRate: 80 },
];

export function ContractLDAnalytics() {
  const [selectedSite, setSelectedSite] = useState<typeof sitewiseLD[0] | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedFY, setSelectedFY] = useState("FY 2025-26");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedPlant, setSelectedPlant] = useState("all");
  const [durationToggle, setDurationToggle] = useState("MTD");

  const currentFYMonth = useMemo(() => {
    const today = new Date();
    const fyParts = selectedFY.replace("FY ", "").split("-");
    const fyStartYear = parseInt(fyParts[0]);
    const fyStart = new Date(fyStartYear, 3, 1);
    const fyEnd = new Date(fyStartYear + 1, 2, 31);
    if (today >= fyEnd) return 12;
    if (today < fyStart) return 12;
    const monthDiff = (today.getFullYear() - fyStart.getFullYear()) * 12 + (today.getMonth() - fyStart.getMonth());
    return Math.max(1, Math.min(12, monthDiff + 1));
  }, [selectedFY]);
  const periodMultiplier = durationToggle === "MTD" ? 1 : durationToggle === "YTD" ? currentFYMonth : 12;
  const periodLabel = durationToggle === "MTD" ? "Current Month" : durationToggle === "YTD" ? `Year-to-Date (${currentFYMonth} mo)` : "Annual (Full FY)";

  // ── Filtered site data — recomputes whenever filters change ────────
  const filteredSites = useMemo(() => {
    return sitewiseLD.filter(s => {
      if (selectedVendor !== "all" && s.vendor !== selectedVendor) return false;
      if (selectedPlant !== "all" && s.siteName !== selectedPlant) return false;
      return true;
    });
  }, [selectedVendor, selectedPlant]);

  const filteredPortfolioSummary = useMemo(() => {
    const sites = filteredSites;
    const totalCapacity = sites.reduce((s, p) => s + p.capacity, 0);
    const monthlyLD = sites.reduce((s, p) => s + p.ldAmount, 0);
    const totalLDExposure = parseFloat((monthlyLD * periodMultiplier).toFixed(1));
    const compliant = sites.filter(p => p.complianceStatus === "green").length;
    const nonCompliant = sites.filter(p => p.complianceStatus === "red").length;
    const criticalEscalations = escalationAlerts.filter(e =>
      sites.some(s => s.siteName === e.site) && (e.severity === "critical" || e.severity === "high")
    ).length;
    const complianceRate = sites.length > 0 ? Math.round((compliant / sites.length) * 100) : 0;
    const ytdLDExposure = parseFloat((monthlyLD * currentFYMonth).toFixed(1));
    return {
      totalCapacity,
      totalSites: sites.length,
      compliantSites: compliant,
      nonCompliantSites: nonCompliant,
      totalLDExposure,
      ytdLDExposure,
      criticalEscalations,
      complianceRate,
    };
  }, [filteredSites, periodMultiplier]);

  const filteredGuaranteedVsActual = useMemo(() => {
    const sites = filteredSites;
    if (sites.length === 0) return [];
    const totalContracted = sites.reduce((s, p) => s + p.contractedGen, 0) * periodMultiplier;
    const totalActual = sites.reduce((s, p) => s + p.actualGen, 0) * periodMultiplier;
    const totalCap = sites.reduce((s, p) => s + p.capacity, 0);
    const wAvail = totalCap > 0 ? sites.reduce((s, p) => s + p.availability * p.capacity, 0) / totalCap : 0;
    const wTargetAvail = totalCap > 0 ? sites.reduce((s, p) => s + p.targetAvailability * p.capacity, 0) / totalCap : 0;
    const wCuf = totalCap > 0 ? sites.reduce((s, p) => s + p.cuf * p.capacity, 0) / totalCap : 0;
    const wTargetCuf = totalCap > 0 ? sites.reduce((s, p) => s + p.targetCuf * p.capacity, 0) / totalCap : 0;
    const genVar = totalActual - totalContracted;
    const genVarPct = totalContracted > 0 ? (genVar / totalContracted) * 100 : 0;
    const availVar = wAvail - wTargetAvail;
    const availVarPct = wTargetAvail > 0 ? (availVar / wTargetAvail) * 100 : 0;
    const cufVar = wCuf - wTargetCuf;
    const cufVarPct = wTargetCuf > 0 ? (cufVar / wTargetCuf) * 100 : 0;
    return [
      { parameter: "Generation (MWh)", guaranteed: totalContracted, actual: totalActual, variance: genVar, variancePct: parseFloat(genVarPct.toFixed(2)), status: genVar >= 0 ? "green" : "red" },
      { parameter: "Availability (%)", guaranteed: parseFloat(wTargetAvail.toFixed(1)), actual: parseFloat(wAvail.toFixed(1)), variance: parseFloat(availVar.toFixed(1)), variancePct: parseFloat(availVarPct.toFixed(2)), status: availVar >= 0 ? "green" : "red" },
      { parameter: "CUF (%)", guaranteed: parseFloat(wTargetCuf.toFixed(1)), actual: parseFloat(wCuf.toFixed(1)), variance: parseFloat(cufVar.toFixed(1)), variancePct: parseFloat(cufVarPct.toFixed(2)), status: cufVar >= 0 ? "green" : "red" },
      (() => {
        const wPr = totalCap > 0 ? sites.reduce((s, p) => s + p.pr * p.capacity, 0) / totalCap : 0;
        const wTargetPr = totalCap > 0 ? sites.reduce((s, p) => s + p.targetPr * p.capacity, 0) / totalCap : 0;
        const prVar = wPr - wTargetPr;
        const prVarPct = wTargetPr > 0 ? (prVar / wTargetPr) * 100 : 0;
        return { parameter: "PR (%)", guaranteed: parseFloat(wTargetPr.toFixed(1)), actual: parseFloat(wPr.toFixed(1)), variance: parseFloat(prVar.toFixed(1)), variancePct: parseFloat(prVarPct.toFixed(2)), status: prVar >= 0 ? "green" as const : "red" as const };
      })(),
      (() => {
        const wResp = totalCap > 0 ? sites.reduce((s, p) => s + p.responseTime * p.capacity, 0) / totalCap : 0;
        const wTargetResp = totalCap > 0 ? sites.reduce((s, p) => s + p.targetResponseTime * p.capacity, 0) / totalCap : 0;
        const respVar = wResp - wTargetResp;
        const respVarPct = wTargetResp > 0 ? (respVar / wTargetResp) * 100 : 0;
        return { parameter: "Response Time (hrs)", guaranteed: parseFloat(wTargetResp.toFixed(1)), actual: parseFloat(wResp.toFixed(1)), variance: parseFloat(respVar.toFixed(1)), variancePct: parseFloat(respVarPct.toFixed(2)), status: respVar <= 0 ? "green" as const : "red" as const };
      })(),
    ];
  }, [filteredSites, periodMultiplier]);

  const filteredVendorLD = useMemo(() => {
    const sites = filteredSites;
    const vendorMap: Record<string, typeof sites> = {};
    for (const s of sites) {
      if (!vendorMap[s.vendor]) vendorMap[s.vendor] = [];
      vendorMap[s.vendor].push(s);
    }
    return Object.entries(vendorMap).map(([vendor, plants]) => {
      const totalCap = plants.reduce((s, p) => s + p.capacity, 0);
      const monthlyLD = plants.reduce((s, p) => s + p.ldAmount, 0);
      const totalLD = parseFloat((monthlyLD * periodMultiplier).toFixed(2));
      const compliant = plants.filter(p => p.complianceStatus === "green").length;
      const avgAvail = totalCap > 0 ? parseFloat((plants.reduce((s, p) => s + p.availability * p.capacity, 0) / totalCap).toFixed(2)) : 0;
      return {
        vendorName: vendor,
        sites: plants.length,
        totalCapacity: totalCap,
        totalLDAmount: totalLD,
        complianceRate: plants.length > 0 ? Math.round((compliant / plants.length) * 100) : 0,
        avgAvailability: avgAvail,
        status: totalLD > 5 ? "critical" : totalLD > 1 ? "warning" : "healthy",
      };
    });
  }, [filteredSites, periodMultiplier]);

  const filteredEscalations = useMemo(() => {
    return escalationAlerts.filter(e =>
      filteredSites.some(s => s.siteName === e.site)
    );
  }, [filteredSites]);

  const filteredPlantOptions = useMemo(() => {
    if (selectedVendor === "all") return PLANTS;
    return PLANTS.filter(p => p.vendor === selectedVendor);
  }, [selectedVendor]);

  const filterScopeLabel = useMemo(() => {
    if (selectedPlant !== "all") {
      const p = filteredSites[0];
      return p ? `${p.siteName} (${p.vendor})` : selectedPlant;
    }
    if (selectedVendor !== "all") return `${selectedVendor} — ${filteredSites.length} plants`;
    return "Portfolio-wide metrics";
  }, [selectedVendor, selectedPlant, filteredSites]);

  // ── Configurable LD formula state ──────────────────────────────────
  type FormulaType = "flat-rate" | "pct-contract" | "tiered";
  const [formulaType, setFormulaType] = useState<FormulaType>("flat-rate");
  const [ldRateInput, setLdRateInput] = useState("0.018");
  const [ldCapPct, setLdCapPct] = useState("10");
  const [ldThresholdPct, setLdThresholdPct] = useState("2");
  const [examplePlantIdx, setExamplePlantIdx] = useState(6); // Devdaithan Solar Plant default

  // ── Live calculation derived values ────────────────────────────────
  const exPlant = sitewiseLD[examplePlantIdx];
  const exRate = parseFloat(ldRateInput) || 0;
  const exCap = parseFloat(ldCapPct) || 10;
  const exThreshold = parseFloat(ldThresholdPct) || 0;
  const exShortfall = Math.max(0, exPlant.contractedGen - exPlant.actualGen);
  const exShortfallPct = exPlant.contractedGen > 0 ? ((exPlant.contractedGen - exPlant.actualGen) / exPlant.contractedGen) * 100 : 0;
  const exAboveThreshold = exShortfallPct > exThreshold && exShortfall > 0;
  const TARIFF = 2.0; // ₹/kWh assumed
  const exContractValue = exPlant.contractedGen * 1000 * TARIFF; // ₹
  const exCapAmount = (exContractValue * exCap) / 100; // ₹

  let exComputedLD = 0;
  type LDStep = { label: string; value: string };
  const exLDSteps: LDStep[] = [];

  if (formulaType === "flat-rate") {
    exComputedLD = exShortfall * 1000 * exRate;
    exLDSteps.push({ label: "Shortfall (kWh)", value: `${exShortfall} × 1,000 = ${(exShortfall * 1000).toLocaleString()} kWh` });
    exLDSteps.push({ label: "Apply Rate", value: `${(exShortfall * 1000).toLocaleString()} × ₹${exRate}/kWh = ₹${exComputedLD.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
  } else if (formulaType === "pct-contract") {
    exComputedLD = (exShortfallPct / 100) * exContractValue * (exRate / 100);
    exLDSteps.push({ label: "Shortfall %", value: `(${exShortfall} / ${exPlant.contractedGen}) × 100 = ${exShortfallPct.toFixed(2)}%` });
    exLDSteps.push({ label: "Contract Value", value: `${exPlant.contractedGen} MWh × 1,000 × ₹${TARIFF} = ₹${(exContractValue / 100000).toFixed(2)}L` });
    exLDSteps.push({ label: "Apply Rate", value: `${exShortfallPct.toFixed(2)}% × ₹${(exContractValue / 100000).toFixed(2)}L × ${exRate}% = ₹${(exComputedLD / 100000).toFixed(4)}L` });
  } else {
    const s1Limit = exPlant.contractedGen * 0.02;
    const s2Limit = exPlant.contractedGen * 0.05;
    if (exShortfall <= s1Limit) {
      exComputedLD = exShortfall * 1000 * 0.010;
      exLDSteps.push({ label: "Slab 1 only (0–2%)", value: `${exShortfall} × 1,000 × ₹0.010 = ₹${exComputedLD.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
    } else if (exShortfall <= s2Limit) {
      const s1 = s1Limit * 1000 * 0.010;
      const s2 = (exShortfall - s1Limit) * 1000 * 0.015;
      exComputedLD = s1 + s2;
      exLDSteps.push({ label: "Slab 1 (0–2%)", value: `₹${s1.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
      exLDSteps.push({ label: "Slab 2 (2–5%)", value: `₹${s2.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
    } else {
      const s1 = s1Limit * 1000 * 0.010;
      const s2 = (s2Limit - s1Limit) * 1000 * 0.015;
      const s3 = (exShortfall - s2Limit) * 1000 * 0.020;
      exComputedLD = s1 + s2 + s3;
      exLDSteps.push({ label: "Slab 1 (0–2%)", value: `₹${s1.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
      exLDSteps.push({ label: "Slab 2 (2–5%)", value: `₹${s2.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
      exLDSteps.push({ label: "Slab 3 (>5%)", value: `₹${s3.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
    }
    exLDSteps.push({ label: "Combined LD", value: `₹${exComputedLD.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` });
  }

  const exFinalLD = exAboveThreshold ? Math.min(exComputedLD, exCapAmount) : 0;
  const exIsCapped = exAboveThreshold && exComputedLD > exCapAmount;
  const exFinalLDLakhs = exFinalLD / 100000;

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Contract & LD Analytics</h1>
                <p className="text-xs text-slate-600 mt-0.5">Contractual obligations, liquidated damages tracking, and vendor compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PageExportMenu
                pageTitle="Contract & LD Analytics"
                contentRef={pageRef}
                label="Export LD Report"
              />
              <Button size="sm" style={{ backgroundColor: "#2955A0" }} className="text-white h-7 px-3 text-xs">
                <Bell className="w-4 h-4 mr-2" />
                Configure Alerts
              </Button>
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
            <Select value={selectedVendor} onValueChange={(v) => { setSelectedVendor(v); setSelectedPlant("all"); }}>
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
                <SelectItem value="all">All Plants ({filteredPlantOptions.length})</SelectItem>
                {filteredPlantOptions.map(p => (
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
      {/* Portfolio-level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
              <Badge variant="destructive" className="text-[10px] font-semibold px-1.5 py-0.5">{periodLabel}</Badge>
            </div>
            <h3 className="text-[11px] font-medium text-gray-600 mb-1">Total LD Exposure</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-red-600">₹{filteredPortfolioSummary.totalLDExposure}L</span>
            </div>
            {durationToggle === "MTD" && (
              <p className="text-[11px] text-gray-600 mt-1">
                YTD: <span className="font-semibold text-gray-900">₹{filteredPortfolioSummary.ytdLDExposure}L</span>
              </p>
            )}
            {durationToggle !== "MTD" && (
              <p className="text-[11px] text-gray-600 mt-1">
                Monthly avg: <span className="font-semibold text-gray-900">₹{(filteredPortfolioSummary.totalLDExposure / periodMultiplier).toFixed(1)}L</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-800 text-[10px] font-semibold px-1.5 py-0.5">Compliance</Badge>
            </div>
            <h3 className="text-[11px] font-medium text-gray-600 mb-1">Portfolio Compliance Rate</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-orange-600">{filteredPortfolioSummary.complianceRate}%</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              {filteredPortfolioSummary.compliantSites} of {filteredPortfolioSummary.totalSites} sites compliant
            </p>
          </CardContent>
        </Card>

        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <Badge variant="destructive" className="text-[10px] font-semibold px-1.5 py-0.5">Active</Badge>
            </div>
            <h3 className="text-[11px] font-medium text-gray-600 mb-1">Critical Escalations</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-red-600">{filteredPortfolioSummary.criticalEscalations}</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.5">Portfolio</Badge>
            </div>
            <h3 className="text-[11px] font-medium text-gray-600 mb-1">Total Portfolio Capacity</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{filteredPortfolioSummary.totalCapacity}</span>
              <span className="text-xs text-gray-600">MW</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Across {filteredPortfolioSummary.totalSites} sites
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guaranteed vs Actual Generation Comparison */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-gray-50 py-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Guaranteed vs Actual Performance Comparison</CardTitle>
              <p className="text-[11px] text-gray-600 mt-0.5">{filterScopeLabel} — {periodLabel}</p>
            </div>
            <Badge className={`text-[10px] ${filteredGuaranteedVsActual.filter(g => g.status === "red").length > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {filteredGuaranteedVsActual.filter(g => g.status === "red").length} of {filteredGuaranteedVsActual.length} parameters non-compliant
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Parameter</TableHead>
                <TableHead className="text-right font-semibold">Guaranteed</TableHead>
                <TableHead className="text-right font-semibold">Actual</TableHead>
                <TableHead className="text-right font-semibold">Variance</TableHead>
                <TableHead className="text-right font-semibold">Variance %</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuaranteedVsActual.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No data for selected filters</TableCell></TableRow>
              ) : filteredGuaranteedVsActual.map((item, idx) => {
                const isNegative = item.variance < 0;
                const bgColor = item.status === "red" ? "bg-red-50" : "bg-green-50";
                
                return (
                  <TableRow key={idx} className={bgColor}>
                    <TableCell className="font-semibold text-gray-900">{item.parameter}</TableCell>
                    <TableCell className="text-right font-mono text-gray-700">{item.guaranteed.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-gray-900">{item.actual.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={isNegative ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                        {item.variance > 0 ? "+" : ""}{item.variance.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={isNegative ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                        {item.variancePct > 0 ? "+" : ""}{item.variancePct.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.status === "green" ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Compliant
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Non-Compliant
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Configurable LD Formula Panel ───────────────────────────────── */}
      <Card className="mb-6 border-2 border-blue-200">
        <CardHeader className="border-b bg-gradient-to-r from-blue-700 to-blue-600 py-3 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-white" />
            <div>
              <CardTitle className="text-sm font-semibold text-white">Configurable LD Formula Engine</CardTitle>
              <p className="text-[11px] text-blue-100 mt-0.5">Select formula type and adjust parameters — live calculation updates instantly</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">

          {/* ── Config bar ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Formula Type</Label>
              <Select value={formulaType} onValueChange={(v) => {
                setFormulaType(v as FormulaType);
                if (v === "flat-rate") setLdRateInput("0.018");
                if (v === "pct-contract") setLdRateInput("5");
              }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat-rate">Flat Rate (₹/kWh)</SelectItem>
                  <SelectItem value="pct-contract">% of Contract Value</SelectItem>
                  <SelectItem value="tiered">Tiered / Slab-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                {formulaType === "flat-rate" ? "LD Rate (₹/kWh)" : formulaType === "pct-contract" ? "LD Rate (% of value)" : "Slabs (fixed)"}
              </Label>
              <Input
                type="number"
                value={ldRateInput}
                onChange={(e) => setLdRateInput(e.target.value)}
                disabled={formulaType === "tiered"}
                className="h-8 text-xs disabled:opacity-50"
                step={formulaType === "pct-contract" ? "0.5" : "0.001"}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Annual Cap (%)</Label>
              <Input
                type="number"
                value={ldCapPct}
                onChange={(e) => setLdCapPct(e.target.value)}
                className="h-8 text-xs"
                min="0" max="100"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Trigger Threshold (%)</Label>
              <Input
                type="number"
                value={ldThresholdPct}
                onChange={(e) => setLdThresholdPct(e.target.value)}
                className="h-8 text-xs"
                step="0.5" min="0"
              />
            </div>
          </div>

          {/* ── Formula expression display ── */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
            {formulaType === "flat-rate" && (
              <p className="font-mono text-sm text-emerald-400 font-bold">
                LD Amount = (Contracted − Actual) × 1,000 × ₹{ldRateInput}/kWh
                <span className="text-slate-400 font-normal ml-2">· if shortfall &gt; {ldThresholdPct}% · cap: {ldCapPct}% of contract value</span>
              </p>
            )}
            {formulaType === "pct-contract" && (
              <p className="font-mono text-sm text-emerald-400 font-bold">
                LD Amount = (Shortfall% / 100) × Contract Value × {ldRateInput}%
                <span className="text-slate-400 font-normal ml-2">· if shortfall &gt; {ldThresholdPct}% · cap: {ldCapPct}% of contract value</span>
              </p>
            )}
            {formulaType === "tiered" && (
              <div className="space-y-1">
                <p className="font-mono text-xs text-emerald-400 font-bold">Tiered Slab Formula:</p>
                <p className="font-mono text-xs text-yellow-300">· Slab 1 (shortfall 0–2%)  → ₹0.010/kWh</p>
                <p className="font-mono text-xs text-orange-300">· Slab 2 (shortfall 2–5%)  → ₹0.015/kWh</p>
                <p className="font-mono text-xs text-red-300">· Slab 3 (shortfall  &gt;5%) → ₹0.020/kWh</p>
                <p className="font-mono text-xs text-slate-400">· Trigger threshold: {ldThresholdPct}%  &nbsp;·  Cap: {ldCapPct}% of contract value</p>
              </div>
            )}
          </div>

          {/* ── Live Calculation Preview ── */}
          <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" /> Live Calculation Preview
              </span>
              <Select value={String(examplePlantIdx)} onValueChange={(v) => setExamplePlantIdx(Number(v))}>
                <SelectTrigger className="h-7 text-xs w-52 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sitewiseLD.map((s, i) => (
                    <SelectItem key={i} value={String(i)}>{s.siteName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Plant info + steps */}
              <div className="space-y-3">
                {/* Plant summary */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Contracted", value: `${exPlant.contractedGen.toLocaleString()} MWh`, color: "blue" },
                    { label: "Actual", value: `${exPlant.actualGen.toLocaleString()} MWh`, color: "slate" },
                    { label: "Shortfall", value: exShortfall > 0 ? `${exShortfall.toLocaleString()} MWh` : "Surplus", color: exShortfall > 0 ? "red" : "green" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`p-2 rounded-lg text-center border ${
                      color === "blue" ? "bg-blue-50 border-blue-200" :
                      color === "red" ? "bg-red-50 border-red-200" :
                      color === "green" ? "bg-emerald-50 border-emerald-200" :
                      "bg-slate-50 border-slate-200"
                    }`}>
                      <div className={`text-sm font-bold ${
                        color === "blue" ? "text-blue-900" :
                        color === "red" ? "text-red-700" :
                        color === "green" ? "text-emerald-700" :
                        "text-slate-900"
                      }`}>{value}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Threshold check */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${
                  !exAboveThreshold
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  {exAboveThreshold
                    ? <AlertCircle className="w-3.5 h-3.5" />
                    : <CheckCircle className="w-3.5 h-3.5" />
                  }
                  Shortfall {exShortfallPct.toFixed(2)}%
                  {exShortfall <= 0 ? " — Plant in surplus, no LD" :
                    exAboveThreshold
                    ? ` > ${ldThresholdPct}% threshold → LD applicable`
                    : ` ≤ ${ldThresholdPct}% threshold → LD not triggered`}
                </div>

                {/* Calculation steps */}
                {exAboveThreshold && (
                  <div className="space-y-1.5">
                    {exLDSteps.map((step, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <span className="text-slate-600 font-medium shrink-0">Step {i + 1}: {step.label}</span>
                        <span className="font-mono font-semibold text-slate-900 text-right">{step.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Cap check + final result */}
              <div className="space-y-3">
                {exAboveThreshold && (
                  <>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                      <p className="font-bold text-slate-700 mb-2">Cap Check</p>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Computed LD:</span>
                        <span className="font-mono font-semibold">₹{(exComputedLD / 100000).toFixed(3)} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cap ({ldCapPct}% of contract):</span>
                        <span className="font-mono font-semibold">₹{(exCapAmount / 100000).toFixed(2)} L</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-700">Applied:</span>
                        <span className={`font-mono font-bold ${exIsCapped ? "text-amber-700" : "text-slate-900"}`}>
                          {exIsCapped ? `Cap applied ← ₹${(exCapAmount / 100000).toFixed(2)} L` : "Within cap"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-center">
                      <p className="text-[11px] text-slate-600 mb-1">Final LD Amount</p>
                      <p className="text-3xl font-bold text-red-600">₹{exFinalLDLakhs.toFixed(3)} L</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        ₹{exFinalLD.toLocaleString("en-IN", { maximumFractionDigits: 0 })} total
                        {exIsCapped && <span className="ml-1 text-amber-600 font-semibold">(capped)</span>}
                      </p>
                    </div>
                  </>
                )}

                {!exAboveThreshold && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-emerald-800">No LD Applicable</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {exShortfall <= 0 ? "Plant generated surplus over contracted target." : `Shortfall below ${ldThresholdPct}% trigger threshold.`}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-blue-800">
                    Change the formula type, rate, cap, or threshold above to instantly see how the LD amount changes for this site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site-wise LD Exposure Table */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-gray-50 py-3">
          <CardTitle className="text-sm font-semibold">Site-wise LD Exposure & Compliance Status — {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-semibold">Site ID</TableHead>
                  <TableHead className="font-semibold">Site Name</TableHead>
                  <TableHead className="font-semibold">Vendor</TableHead>
                  <TableHead className="text-right font-semibold">Capacity (MW)</TableHead>
                  <TableHead className="text-right font-semibold">Contracted (MWh)</TableHead>
                  <TableHead className="text-right font-semibold">Actual (MWh)</TableHead>
                  <TableHead className="text-right font-semibold">Shortfall (MWh)</TableHead>
                  <TableHead className="text-right font-semibold">LD Rate (₹/kWh)</TableHead>
                  <TableHead className="text-right font-semibold">LD Amount (₹L)</TableHead>
                  <TableHead className="text-center font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-slate-400">No sites match the selected filters</TableCell></TableRow>
                ) : filteredSites.map((site, idx) => {
                  const bgColor = site.complianceStatus === "green" ? "bg-green-50" : site.complianceStatus === "amber" ? "bg-amber-50" : "bg-red-50";
                  
                  return (
                    <TableRow key={idx} className={bgColor}>
                      <TableCell className="font-mono text-xs font-semibold">{site.siteId}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{site.siteName}</TableCell>
                      <TableCell className="text-gray-700">{site.vendor}</TableCell>
                      <TableCell className="text-right font-mono">{site.capacity}</TableCell>
                      <TableCell className="text-right font-mono text-gray-700">{(site.contractedGen * periodMultiplier).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{(site.actualGen * periodMultiplier).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={site.shortfall > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                          {site.shortfall > 0 ? "-" : "+"}{Math.abs(site.shortfall * periodMultiplier).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-700">{site.ldRate.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={(site.ldAmount * periodMultiplier) > 0 ? "text-red-600 font-bold text-base" : "text-green-600 font-semibold"}>
                          {(site.ldAmount * periodMultiplier) > 0 ? `₹${(site.ldAmount * periodMultiplier).toFixed(2)}` : "₹0.00"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {site.complianceStatus === "green" ? (
                          <Badge className="bg-green-100 text-green-800 border-2 border-green-300 font-semibold">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Compliant
                          </Badge>
                        ) : site.complianceStatus === "amber" ? (
                          <Badge className="bg-amber-100 text-amber-800 border-2 border-amber-300 font-semibold">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Below Target
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="border-2 border-red-300 font-semibold">
                            <XCircle className="w-3 h-3 mr-1" />
                            LD Applied
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor-wise LD Dashboard */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-gray-50 py-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-700" />
            <CardTitle className="text-sm font-semibold">Vendor-wise LD Dashboard — {periodLabel}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {filteredVendorLD.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-slate-400">No vendor data for selected filters</div>
            ) : filteredVendorLD.map((vendor, idx) => (
              <Card key={idx} className={`border ${vendor.status === "critical" ? "border-red-300 bg-red-50" : vendor.status === "warning" ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{vendor.vendorName}</h3>
                    <Badge className={vendor.status === "critical" ? "bg-red-100 text-red-800" : vendor.status === "warning" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                      {vendor.status === "critical" ? "Critical" : vendor.status === "warning" ? "Warning" : "Healthy"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sites:</span>
                      <span className="font-semibold text-gray-900">{vendor.sites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold text-gray-900">{vendor.totalCapacity} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliance Rate:</span>
                      <span className={`font-bold ${vendor.complianceRate === 100 ? "text-green-600" : vendor.complianceRate === 0 ? "text-red-600" : "text-orange-600"}`}>
                        {vendor.complianceRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Availability:</span>
                      <span className="font-semibold text-gray-900">{vendor.avgAvailability.toFixed(1)}%</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-700 font-medium">Total LD Exposure:</span>
                      <span className="font-bold text-red-600 text-sm">₹{vendor.totalLDAmount.toFixed(2)}L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vendor comparison chart */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredVendorLD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="vendorName" tick={{ fontSize: 10 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
              <Tooltip content={<CustomChartTooltip unit="₹ Lakhs" />} />
              <Bar dataKey="totalLDAmount" name="LD Amount (₹ Lakhs)">
                {filteredVendorLD.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === "critical" ? "#DC2626" : entry.status === "warning" ? "#F59E0B" : "#16A34A"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Client / Procurer-wise LD Dashboard ─────────────────────────── */}
      <Card className="mb-6 border-2 border-slate-200">
        <CardHeader className="border-b bg-gradient-to-r from-[#2955A0] to-[#2955A0]/80 py-3 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-white" />
            <div>
              <CardTitle className="text-sm font-semibold text-white">Client / Procurer-wise LD Dashboard — {periodLabel}</CardTitle>
              <p className="text-[11px] text-blue-100 mt-0.5">LD exposure grouped by energy procurer — Central PSUs & State Utilities</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">

          {/* Client cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {clientwiseLD.map((client, idx) => {
              const statusColors = {
                critical: { border: "border-red-300", bg: "bg-red-50", badge: "bg-red-100 text-red-800", dot: "bg-red-500" },
                warning:  { border: "border-amber-300", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
                good:     { border: "border-emerald-300", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
              }[client.status] ?? { border: "border-slate-200", bg: "bg-slate-50", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };

              return (
                <Card key={idx} className={`border-2 ${statusColors.border} ${statusColors.bg}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                          <span className="font-bold text-slate-900 text-sm">{client.clientName}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColors.badge}`}>
                          {client.procurerType}
                        </span>
                      </div>
                      <Badge className={`text-[10px] font-bold ${statusColors.badge}`}>
                        {client.status === "critical" ? "Critical" : client.status === "good" ? "Compliant" : "Warning"}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sites:</span>
                        <span className="font-semibold text-slate-900">{client.sites}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contracted:</span>
                        <span className="font-mono font-semibold text-slate-900">{(client.totalContractedMWh * periodMultiplier).toLocaleString()} MWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual:</span>
                        <span className="font-mono font-semibold text-slate-900">{(client.totalActualMWh * periodMultiplier).toLocaleString()} MWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Shortfall:</span>
                        <span className={`font-mono font-bold ${client.totalShortfall > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          {client.totalShortfall > 0 ? `-${(client.totalShortfall * periodMultiplier).toLocaleString()}` : `+${(Math.abs(client.totalShortfall) * periodMultiplier).toLocaleString()}`} MWh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contract Value:</span>
                        <span className="font-semibold text-slate-700">{client.contractValue}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">LD Exposure:</span>
                        <span className={`font-bold text-base ${client.ldExposure > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          {(client.ldExposure * periodMultiplier) > 0 ? `₹${(client.ldExposure * periodMultiplier).toFixed(2)}L` : "₹0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Compliance:</span>
                        <div className="flex items-center gap-1">
                          {client.complianceRate === 100
                            ? <CheckCircle className="w-3 h-3 text-emerald-600" />
                            : client.complianceRate === 0
                            ? <XCircle className="w-3 h-3 text-red-600" />
                            : <AlertTriangle className="w-3 h-3 text-amber-600" />
                          }
                          <span className={`font-bold text-xs ${
                            client.complianceRate === 100 ? "text-emerald-700" :
                            client.complianceRate === 0 ? "text-red-700" : "text-amber-700"
                          }`}>{client.complianceRate}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Client comparison bar chart */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">LD Exposure vs Shortfall by Client</h4>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={clientwiseLD.map(c => ({ ...c, totalShortfall: c.totalShortfall * periodMultiplier, ldExposure: c.ldExposure * periodMultiplier }))} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="clientName" tick={{ fontSize: 10 }} stroke="#6B7280" />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#6B7280" label={{ value: 'Shortfall (MWh)', angle: -90, position: 'insideLeft', style: { fontSize: 9 } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="#6B7280" label={{ value: 'LD (₹ Lakhs)', angle: 90, position: 'insideRight', style: { fontSize: 9 } }} />
                <Tooltip content={<CustomChartTooltip unit="" />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="totalShortfall" name="Shortfall (MWh)" radius={[3, 3, 0, 0]}>
                  {clientwiseLD.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.totalShortfall > 0 ? "#EF4444" : "#10B981"} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="ldExposure" name="LD Exposure (₹L)" stroke="#2955A0" strokeWidth={2.5} dot={{ r: 5, fill: "#2955A0" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Client-wise summary table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold text-xs">Client / Procurer</TableHead>
                  <TableHead className="font-bold text-xs">Type</TableHead>
                  <TableHead className="font-bold text-xs text-right">Sites</TableHead>
                  <TableHead className="font-bold text-xs text-right">Contracted (MWh)</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actual (MWh)</TableHead>
                  <TableHead className="font-bold text-xs text-right">Shortfall</TableHead>
                  <TableHead className="font-bold text-xs text-right">LD Exposure</TableHead>
                  <TableHead className="font-bold text-xs text-right">Contract Value</TableHead>
                  <TableHead className="font-bold text-xs text-center">Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientwiseLD.map((client, idx) => (
                  <TableRow key={idx} className={
                    client.status === "critical" ? "bg-red-50" :
                    client.status === "good" ? "bg-emerald-50" : "hover:bg-slate-50"
                  }>
                    <TableCell className="font-bold text-slate-900">{client.clientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{client.clientType}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{client.sites}</TableCell>
                    <TableCell className="text-right font-mono text-slate-600">{(client.totalContractedMWh * periodMultiplier).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{(client.totalActualMWh * periodMultiplier).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={`font-bold ${client.totalShortfall > 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {client.totalShortfall > 0 ? `-${(client.totalShortfall * periodMultiplier).toLocaleString()}` : `+${(Math.abs(client.totalShortfall) * periodMultiplier).toLocaleString()}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={`font-bold ${client.ldExposure > 0 ? "text-red-600 text-base" : "text-emerald-600"}`}>
                        {(client.ldExposure * periodMultiplier) > 0 ? `₹${(client.ldExposure * periodMultiplier).toFixed(2)}L` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-600 font-semibold">{client.contractValue}</TableCell>
                    <TableCell className="text-center">
                      {client.complianceRate === 100 ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px]">
                          <CheckCircle className="w-3 h-3 mr-1" />Compliant
                        </Badge>
                      ) : client.complianceRate === 0 ? (
                        <Badge variant="destructive" className="text-[10px]">
                          <XCircle className="w-3 h-3 mr-1" />Non-Compliant
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">
                          <AlertTriangle className="w-3 h-3 mr-1" />{client.complianceRate}%
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals — computed dynamically */}
                {(() => {
                  const totSites = clientwiseLD.reduce((s, c) => s + c.sites, 0);
                  const totContracted = clientwiseLD.reduce((s, c) => s + c.totalContractedMWh, 0) * periodMultiplier;
                  const totActual = clientwiseLD.reduce((s, c) => s + c.totalActualMWh, 0) * periodMultiplier;
                  const totShortfall = clientwiseLD.reduce((s, c) => s + c.totalShortfall, 0) * periodMultiplier;
                  const totLD = clientwiseLD.reduce((s, c) => s + c.ldExposure, 0) * periodMultiplier;
                  const avgCompliance = clientwiseLD.length > 0 ? Math.round(clientwiseLD.reduce((s, c) => s + c.complianceRate, 0) / clientwiseLD.length) : 0;
                  return (
                    <TableRow className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                      <TableCell className="font-bold text-slate-900">Portfolio Total</TableCell>
                      <TableCell />
                      <TableCell className="text-right font-mono font-bold">{totSites}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{totContracted.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-bold">{totActual.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-red-600">{totShortfall > 0 ? `-${totShortfall.toLocaleString()}` : `+${Math.abs(totShortfall).toLocaleString()}`}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-red-600 text-base">₹{totLD.toFixed(2)}L</TableCell>
                      <TableCell className="text-right font-semibold text-slate-700">—</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">{avgCompliance}% avg</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Trigger Alerts */}
      <Card className="mb-6">
        <CardHeader className="border-b bg-red-50 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <div>
                <CardTitle className="text-sm font-semibold">Escalation Trigger Alerts — {periodLabel}</CardTitle>
                <p className="text-[11px] text-gray-600 mt-0.5">Critical compliance issues requiring immediate action</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-xs font-semibold">
              {filteredEscalations.filter(a => a.status === "open").length} Open Alerts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Escalation ID</TableHead>
                <TableHead className="font-semibold">Site</TableHead>
                <TableHead className="font-semibold">Vendor</TableHead>
                <TableHead className="font-semibold">Issue Description</TableHead>
                <TableHead className="text-right font-semibold">LD Exposure (₹L)</TableHead>
                <TableHead className="text-center font-semibold">Severity</TableHead>
                <TableHead className="text-center font-semibold">Days Open</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscalations.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-slate-400">No escalations for the selected filters</TableCell></TableRow>
              ) : filteredEscalations.map((alert, idx) => {
                const bgColor = alert.severity === "critical" ? "bg-red-50" : alert.severity === "high" ? "bg-orange-50" : "bg-yellow-50";
                
                return (
                  <TableRow key={idx} className={bgColor}>
                    <TableCell className="font-mono text-xs font-semibold">{alert.id}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{alert.site}</TableCell>
                    <TableCell className="text-gray-700">{alert.vendor}</TableCell>
                    <TableCell className="text-sm max-w-xs">{alert.issue}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-red-600">₹{(alert.ldExposure * periodMultiplier).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          alert.severity === "critical" 
                            ? "bg-red-100 text-red-800 border border-red-300" 
                            : alert.severity === "high"
                            ? "bg-orange-100 text-orange-800 border border-orange-300"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        }
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">{alert.daysOpen}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          alert.status === "open" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {alert.status === "open" ? "Open" : "Acknowledged"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly LD Trend */}
      <Card>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm font-semibold">Monthly LD Trend & Portfolio Compliance</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={monthlyLDTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#6B7280" label={{ value: 'LD Amount (₹ Lakhs)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#6B7280" label={{ value: 'Compliance Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
              <Tooltip content={<CustomChartTooltip unit="₹ Lakhs" />} />
              <Legend />
              <Bar yAxisId="left" dataKey="ldAmount" fill="#EF4444" name="LD Amount (₹ Lakhs)" />
              <Line yAxisId="right" type="monotone" dataKey="complianceRate" stroke="#2955A0" strokeWidth={3} name="Compliance Rate (%)" dot={{ fill: "#2955A0", r: 5 }} />
              <ReferenceLine yAxisId="right" y={80} stroke="#F59E0B" strokeDasharray="5 5" label="Target: 80%" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
