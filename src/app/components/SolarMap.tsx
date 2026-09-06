import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface PlantMarker {
  id: number;
  name: string;
  state: string;
  lat: number;
  lon: number;
  capacity: number;
  status: string;
  cuf: number;
  generation: number;
  target: number;
  availability: number;
  ldRisk: "high" | "medium" | "low" | "none";
  vendor: string;
}

interface SolarMapProps {
  plantMarkers: PlantMarker[];
  statusColors?: Record<string, { bg: string; label: string }>;
}

const statusConfig: Record<string, { color: string; fillColor: string; label: string }> = {
  compliant:       { color: "#059669", fillColor: "#10B981", label: "Compliant" },
  warning:         { color: "#B45309", fillColor: "#F59E0B", label: "Warning" },
  "non-compliant": { color: "#B91C1C", fillColor: "#EF4444", label: "Non-Compliant" },
  shutdown:        { color: "#374151", fillColor: "#6B7280", label: "Shutdown" },
  curtailment:     { color: "#C2410C", fillColor: "#F97316", label: "Curtailment" },
};

const ldRiskConfig: Record<string, { color: string; label: string }> = {
  high:   { color: "#EF4444", label: "High" },
  medium: { color: "#F97316", label: "Med" },
  low:    { color: "#F59E0B", label: "Low" },
  none:   { color: "#10B981", label: "None" },
};

function achievementColor(pct: number) {
  if (pct >= 100) return "#10B981";
  if (pct >= 95)  return "#34D399";
  if (pct >= 90)  return "#F59E0B";
  if (pct >= 85)  return "#F97316";
  return "#EF4444";
}

function cufColor(cuf: number) {
  if (cuf >= 23) return "#10B981";
  if (cuf >= 21) return "#F59E0B";
  if (cuf >= 19) return "#F97316";
  return "#EF4444";
}

function isAlertPlant(p: PlantMarker) {
  return p.status === "non-compliant" || p.status === "curtailment" || p.ldRisk === "high";
}

function FitBounds({ markers }: { markers: PlantMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds: [number, number][] = markers.map((m) => [m.lat, m.lon]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, markers]);
  return null;
}

type ViewMode = "markers" | "heatmap" | "performance" | "risk";

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "markers",     label: "Status" },
  { id: "performance", label: "Perf." },
  { id: "heatmap",     label: "CUF" },
  { id: "risk",        label: "Risk" },
];

export default function SolarMap({ plantMarkers }: SolarMapProps) {
  const [viewMode, setViewMode]       = useState<ViewMode>("markers");
  const [legendOpen, setLegendOpen]   = useState(false);
  const [hoveredId, setHoveredId]     = useState<number | null>(null);

  const totalMW    = plantMarkers.reduce((s, p) => s + p.capacity, 0);
  const totalGen   = plantMarkers.reduce((s, p) => s + p.generation, 0);
  const totalTgt   = plantMarkers.reduce((s, p) => s + p.target, 0);
  const portfolioAchievement = totalTgt > 0 ? Math.round((totalGen / totalTgt) * 100) : 0;
  const avgCuf     = plantMarkers.length
    ? (plantMarkers.reduce((s, p) => s + p.cuf, 0) / plantMarkers.length).toFixed(1)
    : "—";
  const avgAvail   = plantMarkers.length
    ? Math.round(plantMarkers.reduce((s, p) => s + p.availability, 0) / plantMarkers.length)
    : 0;

  const alertPlants = plantMarkers.filter(isAlertPlant);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={[19.5, 76.5]}
        zoom={7}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", background: "#f8fafc" }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Zoom controls — bottom-right, clear of alert ticker thanks to ticker's right:56px gap */}
        <ZoomControl position="bottomright" />
        <FitBounds markers={plantMarkers} />

        {/* ── STATUS MARKERS ── */}
        {viewMode === "markers" && plantMarkers.map((plant) => {
          const cfg    = statusConfig[plant.status] ?? statusConfig["warning"];
          const radius = 6 + (plant.capacity / 30) * 10;
          const alert  = isAlertPlant(plant);
          return (
            <React.Fragment key={plant.id}>
              {alert && <>
                <CircleMarker center={[plant.lat, plant.lon]} radius={radius * 2.2} pathOptions={{ color: "transparent", fillColor: cfg.fillColor, fillOpacity: 0.08, weight: 0 }} interactive={false} />
                <CircleMarker center={[plant.lat, plant.lon]} radius={radius * 1.5} pathOptions={{ color: "transparent", fillColor: cfg.fillColor, fillOpacity: 0.18, weight: 0 }} interactive={false} />
              </>}
              <CircleMarker
                center={[plant.lat, plant.lon]}
                radius={radius}
                pathOptions={{ color: cfg.color, fillColor: cfg.fillColor, fillOpacity: 0.88, weight: hoveredId === plant.id ? 3 : 2 }}
                eventHandlers={{ mouseover: () => setHoveredId(plant.id), mouseout: () => setHoveredId(null) }}
              >
                <Popup closeButton={false} maxWidth={195}><PlantPopup plant={plant} cfg={cfg} /></Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* ── PERFORMANCE MARKERS ── */}
        {viewMode === "performance" && plantMarkers.map((plant) => {
          const pct    = plant.target > 0 ? (plant.generation / plant.target) * 100 : 0;
          const col    = achievementColor(pct);
          const radius = 6 + (plant.generation / 2200) * 14;
          return (
            <React.Fragment key={plant.id}>
              <CircleMarker center={[plant.lat, plant.lon]} radius={radius * 1.8} pathOptions={{ color: "transparent", fillColor: col, fillOpacity: 0.1, weight: 0 }} interactive={false} />
              <CircleMarker
                center={[plant.lat, plant.lon]} radius={radius}
                pathOptions={{ color: col, fillColor: col, fillOpacity: 0.85, weight: 2 }}
                eventHandlers={{ mouseover: () => setHoveredId(plant.id), mouseout: () => setHoveredId(null) }}
              >
                <Popup closeButton={false} maxWidth={195}><PlantPopup plant={plant} cfg={statusConfig[plant.status] ?? statusConfig["warning"]} extraMode="performance" /></Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* ── CUF HEATMAP ── */}
        {viewMode === "heatmap" && plantMarkers.map((plant) => {
          const col  = cufColor(plant.cuf);
          const base = 18 + (plant.capacity / 30) * 22;
          return (
            <React.Fragment key={plant.id}>
              <CircleMarker center={[plant.lat, plant.lon]} radius={base * 2.5} pathOptions={{ color: "transparent", fillColor: col, fillOpacity: 0.06, weight: 0 }} interactive={false} />
              <CircleMarker center={[plant.lat, plant.lon]} radius={base * 1.6} pathOptions={{ color: "transparent", fillColor: col, fillOpacity: 0.12, weight: 0 }} interactive={false} />
              <CircleMarker center={[plant.lat, plant.lon]} radius={base}       pathOptions={{ color: "transparent", fillColor: col, fillOpacity: 0.28, weight: 0 }} interactive={false} />
              <CircleMarker center={[plant.lat, plant.lon]} radius={base * 0.5} pathOptions={{ color: "transparent", fillColor: col, fillOpacity: 0.55, weight: 0 }} interactive={false} />
              <CircleMarker center={[plant.lat, plant.lon]} radius={5}          pathOptions={{ color: "#fff", fillColor: col, fillOpacity: 1, weight: 2 }}>
                <Popup closeButton={false} maxWidth={195}><PlantPopup plant={plant} cfg={statusConfig[plant.status] ?? statusConfig["warning"]} extraMode="heatmap" /></Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* ── LD RISK MARKERS ── */}
        {viewMode === "risk" && plantMarkers.map((plant) => {
          const rcfg      = ldRiskConfig[plant.ldRisk];
          const radius    = 6 + (plant.capacity / 30) * 10;
          const isHigh    = plant.ldRisk === "high";
          return (
            <React.Fragment key={plant.id}>
              {isHigh && <>
                <CircleMarker center={[plant.lat, plant.lon]} radius={radius * 2.8} pathOptions={{ color: "transparent", fillColor: "#EF4444", fillOpacity: 0.07, weight: 0 }} interactive={false} />
                <CircleMarker center={[plant.lat, plant.lon]} radius={radius * 1.8} pathOptions={{ color: "transparent", fillColor: "#EF4444", fillOpacity: 0.16, weight: 0 }} interactive={false} />
              </>}
              <CircleMarker
                center={[plant.lat, plant.lon]} radius={radius}
                pathOptions={{ color: rcfg.color, fillColor: rcfg.color, fillOpacity: 0.85, weight: 2 }}
                eventHandlers={{ mouseover: () => setHoveredId(plant.id), mouseout: () => setHoveredId(null) }}
              >
                <Popup closeButton={false} maxWidth={195}><PlantPopup plant={plant} cfg={statusConfig[plant.status] ?? statusConfig["warning"]} extraMode="risk" /></Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* ━━ VIEW MODE TOGGLE — top-center, compact ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
        display: "flex", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(226,232,240,0.9)",
        borderRadius: "7px", overflow: "hidden", backdropFilter: "blur(10px)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        {VIEW_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            style={{
              padding: "4px 11px", fontSize: "10px", fontWeight: 700, fontFamily: "inherit",
              cursor: "pointer", border: "none", letterSpacing: "0.04em",
              transition: "background 0.18s, color 0.18s",
              background: viewMode === mode.id ? "#E8A800" : "transparent",
              color: viewMode === mode.id ? "#2955A0" : "#64748b",
              borderRight: "1px solid rgba(226,232,240,0.6)",
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* ━━ LEGEND — top-left, collapsible ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}>
        {legendOpen ? (
          /* Expanded legend panel */
          <div style={{
            background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(226,232,240,0.85)", borderRadius: "9px",
            padding: "8px 11px", minWidth: "120px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            {/* header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#64748b", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                {viewMode === "markers" ? "Status" : viewMode === "performance" ? "Achieve" : viewMode === "heatmap" ? "CUF" : "LD Risk"}
              </span>
              <button onClick={() => setLegendOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "11px", lineHeight: 1, padding: "0 0 0 6px" }}>✕</button>
            </div>

            {/* markers legend */}
            {viewMode === "markers" && (
              <>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <LegendRow key={key} color={cfg.fillColor} label={cfg.label} glow />
                ))}
                <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", marginTop: "6px", paddingTop: "5px", fontSize: "9px", color: "#94a3b8" }}>Size = capacity</div>
              </>
            )}
            {/* performance legend */}
            {viewMode === "performance" && (
              <>
                {[
                  { label: "≥ 100%", color: "#10B981" },
                  { label: "95–100%", color: "#34D399" },
                  { label: "90–95%", color: "#F59E0B" },
                  { label: "85–90%", color: "#F97316" },
                  { label: "< 85%",  color: "#EF4444" },
                ].map((i) => <LegendRow key={i.label} color={i.color} label={i.label} />)}
                <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", marginTop: "6px", paddingTop: "5px", fontSize: "9px", color: "#94a3b8" }}>Size = generation</div>
              </>
            )}
            {/* heatmap legend */}
            {viewMode === "heatmap" && (
              <>
                {[
                  { label: "≥ 23%",   color: "#10B981" },
                  { label: "21–23%",  color: "#F59E0B" },
                  { label: "19–21%",  color: "#F97316" },
                  { label: "< 19%",   color: "#EF4444" },
                ].map((i) => <LegendRow key={i.label} color={i.color} label={i.label} glow />)}
                <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", marginTop: "6px", paddingTop: "5px", fontSize: "9px", color: "#94a3b8" }}>Glow = capacity</div>
              </>
            )}
            {/* risk legend */}
            {viewMode === "risk" && (
              <>
                {Object.entries(ldRiskConfig).map(([key, r]) => <LegendRow key={key} color={r.color} label={r.label + " LD Risk"} />)}
                <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", marginTop: "6px", paddingTop: "5px", fontSize: "9px", color: "#94a3b8" }}>Glow = high risk</div>
              </>
            )}
          </div>
        ) : (
          /* Collapsed legend — dot strip pill */
          <button
            onClick={() => setLegendOpen(true)}
            title="Show legend"
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(226,232,240,0.85)", borderRadius: "20px",
              padding: "4px 9px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {viewMode === "markers"
              ? Object.values(statusConfig).map((cfg) => (
                  <Dot key={cfg.label} color={cfg.fillColor} />
                ))
              : viewMode === "performance"
              ? ["#10B981","#F59E0B","#F97316","#EF4444"].map((c) => <Dot key={c} color={c} />)
              : viewMode === "heatmap"
              ? ["#10B981","#F59E0B","#F97316","#EF4444"].map((c) => <Dot key={c} color={c} />)
              : Object.values(ldRiskConfig).map((r) => <Dot key={r.label} color={r.color} />)
            }
            <span style={{ fontSize: "9px", color: "#64748b", marginLeft: "2px" }}>▶</span>
          </button>
        )}
      </div>

      {/* ━━ PORTFOLIO — top-right, compact ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        position: "absolute", top: "10px", right: "10px", zIndex: 1000,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(226,232,240,0.85)", borderRadius: "9px",
        padding: "7px 10px", minWidth: "108px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <div style={{ fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "3px" }}>Portfolio</div>
        <div style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{totalMW} <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>MW</span></div>
        <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "6px" }}>{plantMarkers.length} Active Sites</div>
        <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", paddingTop: "5px", display: "flex", flexDirection: "column", gap: "3px" }}>
          <MiniStat label="CUF"    value={`${avgCuf}%`}               color={Number(avgCuf) >= 23 ? "#10B981" : Number(avgCuf) >= 21 ? "#F59E0B" : "#F97316"} />
          <MiniStat label="Achiev" value={`${portfolioAchievement}%`} color={achievementColor(portfolioAchievement)} />
          <MiniStat label="Avail"  value={`${avgAvail}%`}             color={avgAvail >= 96 ? "#10B981" : avgAvail >= 93 ? "#F59E0B" : "#EF4444"} />
        </div>
      </div>

      {/* ━━ ALERT TICKER — bottom strip, right gap preserves zoom buttons ━━━━ */}
      {alertPlants.length > 0 && (
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          right: "52px",          /* leaves room for Leaflet zoom control on the right */
          zIndex: 1000,
          background: "rgba(254,226,226,0.95)", backdropFilter: "blur(6px)",
          borderTop: "1px solid rgba(239,68,68,0.3)",
          padding: "3px 10px",
          display: "flex", alignItems: "center", gap: "8px", overflow: "hidden",
        }}>
          <span style={{ fontSize: "9px", fontWeight: 800, color: "#DC2626", letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0 }}>⚠ Alert</span>
          <span style={{ fontSize: "10px", color: "#991B1B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {alertPlants.map((p, i) => (
              <span key={p.id}>
                {i > 0 && <span style={{ color: "#FECACA", margin: "0 5px" }}>·</span>}
                <strong>{p.name}</strong>: {statusConfig[p.status]?.label ?? p.status} · CUF {p.cuf}%
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Dot({ color }: { color: string }) {
  return <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

function LegendRow({ color, label, glow }: { color: string; label: string; glow?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0, boxShadow: glow ? `0 0 5px ${color}80` : "none" }} />
      <span style={{ fontSize: "10px", color: "#334155", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "9px", color: "#94a3b8" }}>{label}</span>
      <span style={{ fontSize: "10px", fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

// ── Plant popup ───────────────────────────────────────────────────────────────

function PlantPopup({
  plant, cfg, extraMode,
}: {
  plant: PlantMarker;
  cfg: { color: string; fillColor: string; label: string };
  extraMode?: "performance" | "heatmap" | "risk";
}) {
  const pct     = plant.target > 0 ? (plant.generation / plant.target) * 100 : 0;
  const pctCol  = achievementColor(pct);
  const rcfg    = ldRiskConfig[plant.ldRisk];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "9px", padding: "10px 12px", minWidth: "180px", fontFamily: "inherit", color: "#334155", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
      {/* Title */}
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginBottom: "7px" }}>
        {plant.name}
      </div>

      {/* Identity */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "6px" }}>
        <PopupRow label="State"    value={plant.state} />
        <PopupRow label="Vendor"   value={plant.vendor} />
        <PopupRow label="Capacity" value={`${plant.capacity} MW`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", color: "#64748b" }}>Status</span>
          <span style={{ fontSize: "10px", fontWeight: 600, background: cfg.fillColor + "22", color: cfg.fillColor, padding: "1px 7px", borderRadius: "20px", border: `1px solid ${cfg.fillColor}55` }}>{cfg.label}</span>
        </div>
      </div>

      {/* Performance */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "6px", display: "flex", flexDirection: "column", gap: "3px", marginBottom: "7px" }}>
        <PopupRow label="CUF"          value={`${plant.cuf}%`}   color={cufColor(plant.cuf)} />
        <PopupRow label="Availability" value={`${plant.availability}%`} color={plant.availability >= 96 ? "#34d399" : plant.availability >= 93 ? "#fbbf24" : "#f87171"} />
        <PopupRow label="Generation"   value={`${plant.generation.toLocaleString()} MWh`} />
        <PopupRow label="Target"       value={`${plant.target.toLocaleString()} MWh`} />
      </div>

      {/* Achievement bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontSize: "10px", color: "#64748b" }}>Achievement</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: pctCol }}>{pct.toFixed(1)}%</span>
        </div>
        <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pctCol, borderRadius: "2px" }} />
        </div>
      </div>

      {/* LD Risk badge — only in risk mode */}
      {extraMode === "risk" && (
        <div style={{ marginTop: "7px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "#64748b" }}>LD Risk</span>
          <span style={{ fontSize: "10px", fontWeight: 700, background: rcfg.color + "25", color: rcfg.color, padding: "1px 7px", borderRadius: "20px", border: `1px solid ${rcfg.color}55` }}>{rcfg.label}</span>
        </div>
      )}
    </div>
  );
}

function PopupRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "10px", color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: "10px", fontWeight: 600, color: color ?? "#334155" }}>{value}</span>
    </div>
  );
}
