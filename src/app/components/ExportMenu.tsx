import React, { useState } from "react";
import { captureElement, triggerDownload } from "../lib/exportUtils";
import { Download, FileText, Presentation, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface KpiRow {
  title: string;
  value: string;
  unit: string;
  change: string;
}

interface PlantRow {
  name: string;
  state: string;
  capacity: number;
  status: string;
  cuf: number;
}

interface ExportMenuProps {
  kpis: KpiRow[];
  plants: PlantRow[];
  dashboardRef?: React.RefObject<HTMLDivElement | null>;
}

export function ExportMenu({ kpis, plants, dashboardRef }: ExportMenuProps) {
  const [exporting, setExporting] = useState<"pdf" | "ppt" | null>(null);

  async function handleExportPDF() {
    setExporting("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const target = dashboardRef?.current ?? document.querySelector("[data-dashboard-content]") as HTMLElement ?? document.body;

      const canvas = await captureElement(target);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      const pageH = pdf.internal.pageSize.getHeight();
      let yPos = 0;
      let remaining = pdfH;

      while (remaining > 0) {
        if (yPos > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -yPos, pdfW, pdfH);
        yPos += pageH;
        remaining -= pageH;
      }

      const blob = pdf.output("blob");
      triggerDownload(blob, `E-SAMMP_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportPPT() {
    setExporting("ppt");
    try {
      const pptxgen = (await import("pptxgenjs")).default;
      const prs = new pptxgen();

      prs.layout = "LAYOUT_WIDE";
      const NAVY = "0A2E4A";
      const GOLD = "E8A800";
      const WHITE = "FFFFFF";
      const LIGHT = "F1F5F9";
      const GREEN = "059669";
      const RED = "DC2626";
      const AMBER = "D97706";

      const titleOpts = { color: WHITE, fontSize: 28, bold: true, fontFace: "Calibri" };
      const subOpts = { color: "94A3B8", fontSize: 14, fontFace: "Calibri" };

      function addBg(slide: ReturnType<typeof prs.addSlide>, titleText: string, subtitleText?: string) {
        slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: NAVY } });
        slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1.4, fill: { color: "0D3B5E" } });
        slide.addShape(prs.ShapeType.rect, { x: 0, y: 1.25, w: 0.35, h: 0.15, fill: { color: GOLD } });
        slide.addText(titleText, { x: 0.4, y: 0.3, w: 11, h: 0.6, ...titleOpts });
        if (subtitleText) slide.addText(subtitleText, { x: 0.4, y: 0.9, w: 11, h: 0.35, ...subOpts });
        slide.addText("E-SAMMP · EESL Solar Platform", { x: 0.4, y: 6.7, w: 12, h: 0.3, color: "475569", fontSize: 9, fontFace: "Calibri" });
        slide.addText(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), {
          x: 9.5, y: 6.7, w: 3.1, h: 0.3, color: "475569", fontSize: 9, fontFace: "Calibri", align: "right",
        });
      }

      // ── Slide 1: Title ──────────────────────────────────────────────────────
      const s1 = prs.addSlide();
      s1.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: NAVY } });
      s1.addShape(prs.ShapeType.rect, { x: 0, y: 3.2, w: "100%", h: 0.08, fill: { color: GOLD } });
      s1.addText("E-SAMMP", { x: 1, y: 1.0, w: 11.3, h: 1.1, color: GOLD, fontSize: 64, bold: true, fontFace: "Calibri", align: "center" });
      s1.addText("EESL Solar Asset Management & Monitoring Platform", {
        x: 1, y: 2.15, w: 11.3, h: 0.55, color: WHITE, fontSize: 20, fontFace: "Calibri", align: "center",
      });
      s1.addText("Portfolio Dashboard Report", {
        x: 1, y: 3.55, w: 11.3, h: 0.45, color: LIGHT, fontSize: 16, fontFace: "Calibri", align: "center",
      });
      s1.addText(`Generated: ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`, {
        x: 1, y: 4.1, w: 11.3, h: 0.35, color: "64748B", fontSize: 12, fontFace: "Calibri", align: "center",
      });
      s1.addText("220 MW  ·  45 Plants  ·  3 States  ·  FY 2025-26", {
        x: 1, y: 5.5, w: 11.3, h: 0.4, color: "94A3B8", fontSize: 13, fontFace: "Calibri", align: "center",
      });

      // ── Slide 2: Key Performance Indicators ─────────────────────────────────
      const s2 = prs.addSlide();
      addBg(s2, "Portfolio KPI Summary", "FY 2025-26 · February MTD");

      const kpiDisplay = kpis.slice(0, 8);
      kpiDisplay.forEach((kpi, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 0.25 + col * 3.2;
        const y = 1.55 + row * 2.45;
        const w = 3.0;
        const h = 2.25;
        const isNeg = kpi.change.startsWith("-");
        const statusColor = isNeg ? RED : GREEN;

        s2.addShape(prs.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: "0D3B5E" }, line: { color: "1E4A6E", width: 1 } });
        s2.addText(kpi.title, { x: x + 0.15, y: y + 0.15, w: w - 0.3, h: 0.4, color: "94A3B8", fontSize: 9, fontFace: "Calibri", bold: true });
        s2.addText(`${kpi.value} ${kpi.unit}`, { x: x + 0.15, y: y + 0.55, w: w - 0.3, h: 0.65, color: WHITE, fontSize: 22, bold: true, fontFace: "Calibri" });
        s2.addShape(prs.ShapeType.roundRect, { x: x + 0.15, y: y + 1.3, w: 1.0, h: 0.32, rectRadius: 0.05, fill: { color: statusColor + "33" } });
        s2.addText(kpi.change, { x: x + 0.15, y: y + 1.3, w: 1.0, h: 0.32, color: statusColor, fontSize: 10, bold: true, fontFace: "Calibri", align: "center" });
        s2.addText("MoM trend", { x: x + 0.15, y: y + 1.75, w: w - 0.3, h: 0.3, color: "64748B", fontSize: 8, fontFace: "Calibri" });
      });

      // ── Slide 3: Plant Portfolio Status ─────────────────────────────────────
      const s3 = prs.addSlide();
      addBg(s3, "Plant Portfolio Status", "All Sites · Compliance & Performance Overview");

      const tHeaders = ["Plant Name", "State", "Capacity", "Status", "CUF"];
      const tWidths = [3.0, 1.8, 1.5, 1.8, 1.5];
      const tX = 0.35;
      const tY = 1.6;
      const rowH = 0.42;

      tHeaders.forEach((h, i) => {
        const x = tX + tWidths.slice(0, i).reduce((a, b) => a + b, 0);
        s3.addShape(prs.ShapeType.rect, { x, y: tY, w: tWidths[i], h: rowH, fill: { color: GOLD } });
        s3.addText(h, { x, y: tY, w: tWidths[i], h: rowH, color: NAVY, fontSize: 10, bold: true, fontFace: "Calibri", align: "center" });
      });

      plants.forEach((plant, idx) => {
        const rowY = tY + rowH + idx * rowH;
        if (rowY > 6.5) return;
        const rowBg = idx % 2 === 0 ? "0D3B5E" : "0A2E4A";
        const statusColor = plant.status === "compliant" ? GREEN : plant.status === "non-compliant" ? RED : AMBER;
        const cells = [plant.name, plant.state, `${plant.capacity} MW`, plant.status.toUpperCase(), `${plant.cuf}%`];

        cells.forEach((val, ci) => {
          const x = tX + tWidths.slice(0, ci).reduce((a, b) => a + b, 0);
          s3.addShape(prs.ShapeType.rect, { x, y: rowY, w: tWidths[ci], h: rowH, fill: { color: rowBg } });
          s3.addText(val, {
            x, y: rowY, w: tWidths[ci], h: rowH,
            color: ci === 3 ? statusColor : LIGHT,
            fontSize: 10, fontFace: "Calibri", align: ci === 0 ? "left" : "center",
            margin: [0, ci === 0 ? 6 : 0, 0, 0],
          });
        });
      });

      // ── Slide 4: Risk & Alerts ───────────────────────────────────────────────
      const s4 = prs.addSlide();
      addBg(s4, "Risk & Alert Summary", "Current Period Critical Indicators");

      const risks = [
        { label: "Non-Compliant Plants", value: "8", color: RED },
        { label: "High LD Risk", value: "5", color: AMBER },
        { label: "Escalations Triggered", value: "3", color: "7C3AED" },
        { label: "Pending JMR Reports", value: "12", color: "2563EB" },
      ];

      risks.forEach((r, i) => {
        const x = 0.4 + i * 3.15;
        s4.addShape(prs.ShapeType.roundRect, { x, y: 1.7, w: 3.0, h: 2.0, rectRadius: 0.1, fill: { color: r.color + "22" }, line: { color: r.color + "66", width: 2 } });
        s4.addText(r.value, { x, y: 2.0, w: 3.0, h: 0.9, color: r.color, fontSize: 52, bold: true, fontFace: "Calibri", align: "center" });
        s4.addText(r.label, { x, y: 2.95, w: 3.0, h: 0.55, color: WHITE, fontSize: 11, fontFace: "Calibri", align: "center", bold: true });
      });

      const underperforming = [
        { plant: "Amravati Solar Unit", state: "Maharashtra", cuf: 18.5, gap: -5.5 },
        { plant: "Devdaithan Solar Plant", state: "Maharashtra", cuf: 19.5, gap: -4.5 },
        { plant: "Wardha Solar Park", state: "Maharashtra", cuf: 20.8, gap: -3.2 },
      ];

      s4.addText("TOP UNDERPERFORMING PLANTS", { x: 0.4, y: 3.95, w: 12.5, h: 0.35, color: GOLD, fontSize: 10, bold: true, fontFace: "Calibri" });

      underperforming.forEach((p, i) => {
        const x = 0.4 + i * 4.2;
        s4.addShape(prs.ShapeType.roundRect, { x, y: 4.35, w: 3.9, h: 1.7, rectRadius: 0.08, fill: { color: "1E293B" }, line: { color: "334155", width: 1 } });
        s4.addText(p.plant, { x: x + 0.15, y: 4.5, w: 3.6, h: 0.38, color: WHITE, fontSize: 12, bold: true, fontFace: "Calibri" });
        s4.addText(p.state, { x: x + 0.15, y: 4.88, w: 3.6, h: 0.3, color: "94A3B8", fontSize: 10, fontFace: "Calibri" });
        s4.addText(`CUF: ${p.cuf}%`, { x: x + 0.15, y: 5.2, w: 1.8, h: 0.35, color: RED, fontSize: 12, bold: true, fontFace: "Calibri" });
        s4.addText(`Gap: ${p.gap}%`, { x: x + 2.1, y: 5.2, w: 1.65, h: 0.35, color: AMBER, fontSize: 12, bold: true, fontFace: "Calibri", align: "right" });
      });

      const pptBlob: Blob = await prs.write({ outputType: "blob" }) as Blob;
      const pptUrl = URL.createObjectURL(pptBlob);
      const a = document.createElement("a");
      a.href = pptUrl;
      a.download = `E-SAMMP_Report_${new Date().toISOString().slice(0, 10)}.pptx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(pptUrl); }, 1000);
    } catch (err) {
      console.error("PPT export failed", err);
    } finally {
      setExporting(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 h-7 px-3 text-xs" disabled={!!exporting}>
          {exporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {exporting ? (exporting === "pdf" ? "Exporting PDF…" : "Exporting PPT…") : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Export Dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer gap-2">
          <FileText className="w-4 h-4 text-red-500" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPPT} className="cursor-pointer gap-2">
          <Presentation className="w-4 h-4 text-orange-500" />
          <span>Export as PowerPoint</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
