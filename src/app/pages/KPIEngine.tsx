import { useState, useMemo } from "react";
import { GlobalFilterBar } from "../components/kpi/GlobalFilterBar";
import { KPISidebar } from "../components/kpi/KPISidebar";
import { KPIDetailView } from "../components/kpi/KPIDetailView";
import { FormulaBuilder } from "../components/kpi/FormulaBuilder";
import { kpiData } from "../components/kpi/mockData";
import { KPI } from "../components/kpi/types";

// ── Filter Engine constants ────────────────────────────────────────────────
const MONTH_ABBR: Record<string, string> = {
  January: "Jan", February: "Feb", March: "Mar", April: "Apr",
  May: "May", June: "Jun", July: "Jul", August: "Aug",
  September: "Sep", October: "Oct", November: "Nov", December: "Dec",
};

const MONTH_ORDER = [
  "April","May","June","July","August","September",
  "October","November","December","January","February","March",
];

// Seasonal CUF/generation factors (higher in summer, lower in winter)
const MONTH_FACTOR: Record<string, number> = {
  April: 1.10, May: 1.15, June: 0.95, July: 0.85, August: 0.88,
  September: 0.90, October: 0.92, November: 0.85, December: 0.80,
  January: 0.82, February: 0.85, March: 1.00,
};

// FY growth factors — baseline is FY 2023-24
const FY_FACTOR: Record<string, number> = {
  "FY 2023-24": 1.00,
  "FY 2024-25": 1.03,
  "FY 2025-26": 1.06,
};

// Period multipliers for absolute (₹ / cumulative) metrics
const PERIOD_FACTOR: Record<string, number> = {
  Monthly: 1.0,
  MTD: 0.65,    // ~20 of 31 days elapsed
  YTD: 1.0,     // computed separately using month index
  Annual: 12.0, // full year equivalent
};

// KPIs whose values are percentages/rates (don't scale by period)
const RATE_KPI_IDS = new Set(["cuf","ga","pa","paf","tll","rpw","curtailment","lpi","om-deviation","degradation","forecasted-gen","curtailment-pattern"]);

function deriveCompliance(value: number, target: number, kpiId: string): KPI["complianceStatus"] {
  // For "lower-is-better" KPIs: TLL, curtailment, LPI, revenue shortfall, O&M deviation
  const lowerBetter = new Set(["tll","curtailment","lpi","rev-shortfall","om-deviation"]);
  if (lowerBetter.has(kpiId)) {
    if (value <= target) return "Compliant";
    if (value <= target * 1.15) return "Warning";
    return "Non-Compliant";
  }
  // Higher-is-better
  if (value >= target) return "Compliant";
  if (value >= target * 0.95) return "Warning";
  return "Non-Compliant";
}

export function KPIEngine() {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [fy, setFy] = useState("FY 2023-24");
  const [month, setMonth] = useState("September");
  const [plantCluster, setPlantCluster] = useState("all");
  const [contract, setContract] = useState("all-ppa");
  const [category, setCategory] = useState("all-categories");
  const [period, setPeriod] = useState("Monthly");

  const [selectedKPI, setSelectedKPI] = useState<KPI>(kpiData[0]);
  const [isFormulaBuilderOpen, setIsFormulaBuilderOpen] = useState(false);

  // ── Derived KPI list from filters ─────────────────────────────────────────
  const filteredKPIs = useMemo<KPI[]>(() => {
    const fyFactor  = FY_FACTOR[fy] ?? 1.0;
    const mFactor   = MONTH_FACTOR[month] ?? 1.0;
    const baseFactor = MONTH_FACTOR["September"]; // baseline month for mock data
    const monthScalar = mFactor / baseFactor;

    const monthIdx   = Math.max(0, MONTH_ORDER.indexOf(month));
    const ytdMonths  = monthIdx + 1;

    const abbr = MONTH_ABBR[month];

    return kpiData
      .filter(kpi => {
        if (category !== "all-categories" && kpi.category !== category) return false;
        if (contract !== "all-ppa" && kpi.ppaType !== contract) return false;
        return true;
      })
      .map(kpi => {
        const isRate = RATE_KPI_IDS.has(kpi.id);

        // 1. Month selection: look up history entry matching selected month
        const historyEntry = (kpi.history ?? []).find(h => h.month === abbr);
        let baseValue = historyEntry ? historyEntry.value : kpi.currentValue;

        // 2. Apply FY factor
        if (isRate) {
          // For % / rate KPIs, FY factor causes a small ±% shift
          baseValue = parseFloat((baseValue * (1 + (fyFactor - 1) * 0.3)).toFixed(2));
        } else {
          baseValue = parseFloat((baseValue * fyFactor).toFixed(2));
        }

        // 3. Apply month seasonality (only to rate KPIs; absolute ones use history)
        if (isRate && !historyEntry) {
          baseValue = parseFloat((baseValue * monthScalar).toFixed(2));
        }

        // 4. Apply period scaling for absolute financial KPIs
        let scaledValue = baseValue;
        if (!isRate) {
          if (period === "MTD") {
            scaledValue = parseFloat((baseValue * 0.65).toFixed(2));
          } else if (period === "YTD") {
            scaledValue = parseFloat((baseValue * ytdMonths).toFixed(2));
          } else if (period === "Annual") {
            scaledValue = parseFloat((baseValue * 12).toFixed(2));
          }
        }

        // 5. Plant cluster filter: recompute currentValue as cluster average
        let filteredBreakdown = kpi.plantBreakdown ?? [];
        if (plantCluster !== "all" && filteredBreakdown.length > 0) {
          const clusterPlants = filteredBreakdown.filter(p => p.cluster === plantCluster);
          if (clusterPlants.length > 0) {
            filteredBreakdown = clusterPlants;
            const avg = clusterPlants.reduce((s, p) => s + p.value, 0) / clusterPlants.length;
            scaledValue = parseFloat(avg.toFixed(2));
          }
        }

        // 6. Scale history data for display
        const scaledHistory = (kpi.history ?? []).map(h => ({
          ...h,
          value: isRate
            ? parseFloat((h.value * (1 + (fyFactor - 1) * 0.3)).toFixed(2))
            : parseFloat((h.value * fyFactor).toFixed(2)),
        }));

        // 7. Re-derive compliance
        const newCompliance = deriveCompliance(scaledValue, kpi.targetValue, kpi.id);

        // 8. Scale financial impact fields
        const impactScale = fyFactor * (isRate ? 1 : PERIOD_FACTOR[period] ?? 1);

        return {
          ...kpi,
          currentValue: scaledValue,
          complianceStatus: newCompliance,
          plantBreakdown: filteredBreakdown,
          history: scaledHistory,
          revenueImpact: kpi.revenueImpact
            ? parseFloat((kpi.revenueImpact * impactScale).toFixed(0))
            : kpi.revenueImpact,
          ldRisk: kpi.ldRisk
            ? parseFloat((kpi.ldRisk * impactScale).toFixed(0))
            : kpi.ldRisk,
          impactedPlants:
            plantCluster !== "all"
              ? (kpi.plantBreakdown ?? []).filter(p => p.cluster === plantCluster).length
              : kpi.impactedPlants,
        } satisfies KPI;
      });
  }, [fy, month, plantCluster, contract, category, period]);

  // Keep selectedKPI in sync when filters remove it from the list
  const resolvedKPI = useMemo(() => {
    const found = filteredKPIs.find(k => k.id === selectedKPI.id);
    return found ?? filteredKPIs[0] ?? kpiData[0];
  }, [filteredKPIs, selectedKPI.id]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* 1. Global Filter Bar (Top) */}
      <GlobalFilterBar
        fy={fy}            setFy={setFy}
        month={month}      setMonth={setMonth}
        plantCluster={plantCluster} setPlantCluster={setPlantCluster}
        contract={contract} setContract={setContract}
        category={category} setCategory={setCategory}
        period={period}    setPeriod={setPeriod}
        filteredCount={filteredKPIs.length}
        totalCount={kpiData.length}
      />

      <div className="flex flex-1 overflow-hidden">

        {/* 2. Left Panel - KPI List */}
        <KPISidebar
          kpis={filteredKPIs}
          selectedKPIId={resolvedKPI.id}
          onSelectKPI={setSelectedKPI}
        />

        {/* 3. Main Content - Detail View */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none z-0" />
          <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
            <KPIDetailView
              kpi={resolvedKPI}
              onEditFormula={() => setIsFormulaBuilderOpen(true)}
              period={period}
              clusterFilter={plantCluster}
              fy={fy}
              month={month}
            />
          </div>
        </main>
      </div>

      {/* 4. Formula Builder Drawer */}
      <FormulaBuilder
        isOpen={isFormulaBuilderOpen}
        onClose={() => setIsFormulaBuilderOpen(false)}
        kpi={resolvedKPI}
      />
    </div>
  );
}
