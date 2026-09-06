import { useState } from "react";
import { Search, ChevronDown, ChevronRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";
import { KPI } from "./types";
import { kpiCategories } from "./mockData";
import { Sparkline } from "./Sparkline";

interface KPISidebarProps {
  kpis: KPI[];
  selectedKPIId: string;
  onSelectKPI: (kpi: KPI) => void;
}

export function KPISidebar({ kpis, selectedKPIId, onSelectKPI }: KPISidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Operational: true,
    Commercial: true,
    "AI/Predictive": true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredKPIs = kpis.filter(kpi => 
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: KPI["complianceStatus"]) => {
    switch (status) {
      case "Compliant": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "Warning": return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case "Non-Compliant": return <AlertCircle className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  const getStatusColor = (status: KPI["complianceStatus"]) => {
    switch (status) {
      case "Compliant": return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "Warning": return "bg-amber-50 border-amber-200 text-amber-700";
      case "Non-Compliant": return "bg-rose-50 border-rose-200 text-rose-700";
    }
  };

  // Group filtered KPIs by category based on the defined categories order
  const groupedKPIs = Object.keys(kpiCategories).reduce((acc, category) => {
    const categoryKPIs = filteredKPIs.filter(kpi => kpi.category === category);
    if (categoryKPIs.length > 0) {
      acc[category] = categoryKPIs;
    }
    return acc;
  }, {} as Record<string, KPI[]>);

  return (
    <div className="w-[320px] flex flex-col border-r border-slate-200 bg-white h-full shadow-lg z-10 shrink-0 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-white shrink-0">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 px-1">KPI Governance</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search KPIs..." 
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus:ring-1 focus:ring-ring transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-3 space-y-4 pb-6">
          {Object.entries(groupedKPIs).map(([category, items]) => (
            <div key={category} className="space-y-1">
              <button 
                onClick={() => toggleCategory(category)}
                className="flex items-center w-full text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-100"
              >
                {expandedCategories[category] ? <ChevronDown className="w-3 h-3 mr-1" /> : <ChevronRight className="w-3 h-3 mr-1" />}
                {category}
              </button>
              
              {expandedCategories[category] && (
                <div className="space-y-1 pl-1">
                  {items.map(kpi => (
                    <div
                      key={kpi.id}
                      onClick={() => onSelectKPI(kpi)}
                      className={cn(
                        "group relative flex flex-col p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
                        selectedKPIId === kpi.id 
                          ? "bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-500/20" 
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {/* Selection Indicator */}
                      {selectedKPIId === kpi.id && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />
                      )}

                      <div className="flex justify-between items-start mb-2 pl-2">
                        <span className={cn(
                          "text-sm font-semibold truncate pr-2",
                          selectedKPIId === kpi.id ? "text-blue-900" : "text-slate-700"
                        )}>
                          {kpi.name}
                        </span>
                        {getStatusIcon(kpi.complianceStatus)}
                      </div>

                      <div className="flex justify-between items-end pl-2">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-900">{kpi.currentValue}</span>
                            <span className="text-xs text-slate-500 font-medium">{kpi.unit}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-slate-400">Target: {kpi.targetValue}</span>
                          </div>
                          {kpi.ldRisk && kpi.ldRisk > 0 ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 w-fit">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              LD Risk
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                           <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", getStatusColor(kpi.complianceStatus))}>
                             {kpi.complianceStatus}
                           </Badge>
                           <div className="w-16 h-6">
                             <Sparkline data={kpi.trend} color={kpi.momChange > 0 ? "#059669" : "#e11d48"} />
                           </div>
                           <div className={cn(
                             "flex items-center text-[10px] font-medium",
                             kpi.momChange > 0 ? "text-emerald-600" : "text-rose-600"
                           )}>
                             {kpi.momChange > 0 ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                             {Math.abs(kpi.momChange)}%
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {Object.keys(groupedKPIs).length === 0 && (
             <div className="text-center py-10 text-slate-400 text-sm">
               No KPIs found matching "{searchTerm}"
             </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}