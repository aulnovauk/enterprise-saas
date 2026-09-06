import React, { useState } from "react";
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
import { captureElement, triggerDownload } from "../lib/exportUtils";

interface PageExportMenuProps {
  pageTitle: string;
  pageSubtitle?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  variant?: "outline" | "navy" | "blue";
  label?: string;
  size?: "sm" | "default";
}

export function PageExportMenu({
  pageTitle,
  pageSubtitle = "E-SAMMP · EESL Solar Platform",
  contentRef,
  variant = "outline",
  label = "Export",
  size = "sm",
}: PageExportMenuProps) {
  const [exporting, setExporting] = useState<"pdf" | "ppt" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getTarget(): HTMLElement {
    if (contentRef?.current) return contentRef.current;
    const el =
      (document.querySelector("[data-page-content]") as HTMLElement) ??
      (document.querySelector("main") as HTMLElement);
    return el ?? document.body;
  }

  async function handleExportPDF() {
    setExporting("pdf");
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      const target = getTarget();
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

      const safeTitle = pageTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const blob = pdf.output("blob");
      triggerDownload(blob, `E-SAMMP_${safeTitle}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      setError(`PDF failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportPPT() {
    setExporting("ppt");
    setError(null);
    try {
      const pptxgen = (await import("pptxgenjs")).default;
      const prs = new pptxgen();
      prs.layout = "LAYOUT_WIDE";

      const NAVY = "0A2E4A";
      const GOLD = "E8A800";
      const WHITE = "FFFFFF";
      const LIGHT = "F1F5F9";

      const dateStr = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // ── Slide 1: Title ──────────────────────────────────────────────────────
      const s1 = prs.addSlide();
      s1.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: NAVY } });
      s1.addShape(prs.ShapeType.rect, { x: 0, y: 3.3, w: "100%", h: 0.07, fill: { color: GOLD } });
      s1.addText("E-SAMMP", {
        x: 1, y: 0.8, w: 11.3, h: 1.0, color: GOLD, fontSize: 56,
        bold: true, fontFace: "Calibri", align: "center",
      });
      s1.addText(pageTitle, {
        x: 1, y: 1.9, w: 11.3, h: 0.75, color: WHITE, fontSize: 28,
        fontFace: "Calibri", align: "center", bold: true,
      });
      s1.addText(pageSubtitle, {
        x: 1, y: 2.7, w: 11.3, h: 0.4, color: "94A3B8", fontSize: 14,
        fontFace: "Calibri", align: "center",
      });
      s1.addText(`Generated: ${dateStr}`, {
        x: 1, y: 3.6, w: 11.3, h: 0.35, color: "64748B", fontSize: 12,
        fontFace: "Calibri", align: "center",
      });
      s1.addText("EESL Solar Asset Management & Monitoring Platform", {
        x: 1, y: 6.3, w: 11.3, h: 0.35, color: "475569", fontSize: 10,
        fontFace: "Calibri", align: "center",
      });

      // ── Slide 2: Page screenshot ─────────────────────────────────────────────
      const target = getTarget();
      let imgData: string | null = null;
      try {
        const canvas = await captureElement(target);
        imgData = canvas.toDataURL("image/png");
      } catch (captureErr) {
        console.warn("Screenshot capture failed:", captureErr);
        setError(`Screenshot failed: ${captureErr instanceof Error ? captureErr.message : String(captureErr)}`);
      }

      if (imgData) {
        const s2 = prs.addSlide();
        s2.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: NAVY } });
        s2.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.55, fill: { color: "0D3B5E" } });
        s2.addText(pageTitle, {
          x: 0.3, y: 0.08, w: 10, h: 0.4, color: WHITE, fontSize: 16,
          bold: true, fontFace: "Calibri",
        });
        s2.addText(
          new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
          { x: 9.5, y: 0.08, w: 3.1, h: 0.4, color: "94A3B8", fontSize: 11, fontFace: "Calibri", align: "right" }
        );
        s2.addImage({ data: imgData, x: 0, y: 0.65, w: 13.33, h: 6.6 });
        s2.addText("E-SAMMP · EESL Solar Platform", {
          x: 0.3, y: 7.2, w: 12.7, h: 0.25, color: "475569", fontSize: 8,
          fontFace: "Calibri", align: "center",
        });
      } else {
        const s2 = prs.addSlide();
        s2.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: NAVY } });
        s2.addText(pageTitle, {
          x: 1, y: 2.5, w: 11.3, h: 0.8, color: LIGHT, fontSize: 32,
          fontFace: "Calibri", align: "center", bold: true,
        });
        s2.addText("For full analytics, please refer to the E-SAMMP platform.", {
          x: 1, y: 3.5, w: 11.3, h: 0.5, color: "94A3B8", fontSize: 16,
          fontFace: "Calibri", align: "center",
        });
      }

      const safeTitle = pageTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const pptBlob: Blob = (await prs.write({ outputType: "blob" })) as Blob;
      triggerDownload(pptBlob, `E-SAMMP_${safeTitle}_${new Date().toISOString().slice(0, 10)}.pptx`);
    } catch (err) {
      console.error("PPT export failed", err);
      setError(`PPT failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(null);
    }
  }

  const buttonStyle =
    variant === "navy"
      ? { backgroundColor: "#2955A0", color: "#ffffff" }
      : variant === "blue"
      ? { backgroundColor: "#2563EB", color: "#ffffff" }
      : undefined;

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant={variant === "outline" ? "outline" : "default"}
            style={buttonStyle}
            className={`gap-1.5 ${size === "sm" ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm"}`}
            disabled={!!exporting}
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {exporting
              ? exporting === "pdf"
                ? "Exporting PDF…"
                : "Exporting PPT…"
              : label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs">Export {pageTitle}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleExportPDF}
            className="cursor-pointer gap-2"
            disabled={!!exporting}
          >
            <FileText className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-sm font-medium">Export as PDF</div>
              <div className="text-xs text-muted-foreground">Full page screenshot PDF</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleExportPPT}
            className="cursor-pointer gap-2"
            disabled={!!exporting}
          >
            <Presentation className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-sm font-medium">Export as PowerPoint</div>
              <div className="text-xs text-muted-foreground">Branded 2-slide deck</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <p className="text-xs text-red-500 max-w-xs text-right leading-tight">{error}</p>
      )}
    </div>
  );
}
