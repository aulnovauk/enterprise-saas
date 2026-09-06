import { ArrowUp, ArrowDown } from "lucide-react";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
  payload?: Record<string, any>;
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  unit?: string;
  formatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string) => string;
  targetKey?: string;
}

function formatNumber(value: number, unit?: string): string {
  if (unit === "₹ Cr" || unit === "₹ Lakhs") {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ${unit === "₹ Cr" ? "Cr" : "L"}`;
  }
  if (unit === "%") {
    return `${value.toFixed(1)}%`;
  }
  if (typeof value === "number" && !isNaN(value)) {
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString("en-IN", { maximumFractionDigits: 1 });
    }
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }
  return String(value);
}

function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}

export function CustomChartTooltip({
  active,
  payload,
  label,
  unit,
  formatter,
  labelFormatter,
  targetKey,
}: CustomChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const displayLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden min-w-[180px] max-w-[280px]">
      <div className="h-[3px] bg-gradient-to-r from-[#2955A0] to-[#0089C9]" />

      {displayLabel && (
        <div className="px-3 pt-2.5 pb-1.5 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-800">{displayLabel}</p>
        </div>
      )}

      <div className="px-3 py-2 space-y-1.5">
        {payload.map((entry, index) => {
          const displayValue = formatter
            ? formatter(entry.value, entry.name)
            : `${formatNumber(entry.value, unit)}${unit && unit !== "%" && unit !== "₹ Cr" && unit !== "₹ Lakhs" ? ` ${unit}` : ""}`;

          const targetValue = targetKey && entry.payload ? entry.payload[targetKey] : null;
          const delta = targetValue != null ? entry.value - targetValue : null;
          const deltaPercent = targetValue != null && targetValue !== 0
            ? ((entry.value - targetValue) / targetValue) * 100
            : null;

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white shadow-sm"
                  style={{ backgroundColor: entry.color || "#2955A0" }}
                />
                <span className="text-[11px] text-slate-600 truncate">
                  {formatLabel(entry.name)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[12px] font-bold text-slate-900">{displayValue}</span>
                {delta != null && deltaPercent != null && (
                  <span
                    className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                      delta >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {delta >= 0 ? (
                      <ArrowUp className="w-2.5 h-2.5" />
                    ) : (
                      <ArrowDown className="w-2.5 h-2.5" />
                    )}
                    {Math.abs(deltaPercent).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {targetKey && payload[0]?.payload?.[targetKey] != null && (
        <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-500">
            Target: {formatNumber(payload[0].payload[targetKey], unit)}
            {unit && unit !== "%" && unit !== "₹ Cr" && unit !== "₹ Lakhs" ? ` ${unit}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
