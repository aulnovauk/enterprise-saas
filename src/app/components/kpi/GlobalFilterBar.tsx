import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Activity, Calendar, Download, Filter, X } from "lucide-react";

export interface GlobalFilterBarProps {
  fy: string;
  setFy: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  plantCluster: string;
  setPlantCluster: (v: string) => void;
  contract: string;
  setContract: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  period: string;
  setPeriod: (v: string) => void;
  filteredCount: number;
  totalCount: number;
}

const MONTHS = [
  "April","May","June","July","August","September",
  "October","November","December","January","February","March",
];

const FYS = ["FY 2023-24", "FY 2024-25", "FY 2025-26"];

const PERIODS = ["Monthly", "MTD", "YTD", "Annual"] as const;

export function GlobalFilterBar({
  fy, setFy,
  month, setMonth,
  plantCluster, setPlantCluster,
  contract, setContract,
  category, setCategory,
  period, setPeriod,
  filteredCount, totalCount,
}: GlobalFilterBarProps) {

  const isFiltered =
    plantCluster !== "all" ||
    contract !== "all-ppa" ||
    category !== "all-categories" ||
    fy !== "FY 2023-24";

  const resetFilters = () => {
    setFy("FY 2023-24");
    setMonth("September");
    setPlantCluster("all");
    setContract("all-ppa");
    setCategory("all-categories");
    setPeriod("Monthly");
  };

  return (
    <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 sticky top-0 z-20">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#2955A0] rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">KPI Engine</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                KPI Governance · Performance Benchmarking
                {isFiltered && (
                  <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded text-[10px] font-bold">
                    {filteredCount} / {totalCount} KPIs shown
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs gap-1.5 text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100"
                onClick={resetFilters}
              >
                <X className="w-3 h-3" />
                Reset Filters
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs gap-2 text-slate-600 border-slate-200">
              <Filter className="w-3.5 h-3.5" />
              More Filters
            </Button>
            <Button size="sm" className="h-7 px-3 text-xs gap-2 bg-[#2955A0] hover:bg-[#1E4888] text-white">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FY */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FY</span>
            <Select value={fy} onValueChange={setFy}>
              <SelectTrigger className="w-[120px] h-7 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="FY" />
              </SelectTrigger>
              <SelectContent>
                {FYS.map(f => (
                  <SelectItem key={f} value={f}>{f.replace("FY ", "")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month */}
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[130px] h-7 text-xs bg-slate-50 border-slate-200">
              <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Plant Cluster */}
          <Select value={plantCluster} onValueChange={setPlantCluster}>
            <SelectTrigger className="w-[185px] h-7 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Portfolio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plants (12)</SelectItem>
              <SelectItem value="SolarCo India">SolarCo India (3 plants)</SelectItem>
              <SelectItem value="SunPower Tech">SunPower Tech (4 plants)</SelectItem>
              <SelectItem value="Green Energy Ltd">Green Energy Ltd (1 plant)</SelectItem>
              <SelectItem value="TechSolar Pvt">TechSolar Pvt (1 plant)</SelectItem>
              <SelectItem value="Mega Solar Inc">Mega Solar Inc (3 plants)</SelectItem>
            </SelectContent>
          </Select>

          {/* Contract / PPA */}
          <Select value={contract} onValueChange={setContract}>
            <SelectTrigger className="w-[165px] h-7 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="PPA Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-ppa">All Contracts</SelectItem>
              <SelectItem value="PPA-Solar-2018">PPA Solar 2018</SelectItem>
              <SelectItem value="PPA-Standard-2019">PPA Standard 2019</SelectItem>
              <SelectItem value="Internal Budget-2024">Internal Budget 2024</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[165px] h-7 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="AI/Predictive">AI / Predictive</SelectItem>
            </SelectContent>
          </Select>

          {/* Period Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  period === p
                    ? "bg-[#2955A0] text-white shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
