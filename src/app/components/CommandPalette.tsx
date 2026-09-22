import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "./ui/command";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Activity,
  TrendingDown,
  FileText,
  BarChart3,
  BrainCircuit,
  Building2,
  Users,
  FileSearch,
  Database,
  Settings,
  FileDown,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  MapPin,
} from "lucide-react";

const pages = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/jmr-data", label: "JMR Data Management", icon: FileSpreadsheet },
  { path: "/kpi-engine", label: "KPI Engine", icon: Activity },
  { path: "/outage-loss", label: "Outage & Loss Analytics", icon: TrendingDown },
  { path: "/contract-ld", label: "Contract & LD Analytics", icon: FileText },
  { path: "/reports", label: "Reports & MIS", icon: BarChart3 },
  { path: "/ai-analytics", label: "AI & Trend Analytics", icon: BrainCircuit },
  { path: "/site-portfolio", label: "Site & Portfolio Management", icon: Building2 },
  { path: "/users", label: "User Management", icon: Users },
  { path: "/audit-logs", label: "Audit Logs", icon: FileSearch },
  { path: "/erp-integration", label: "ERP Integration", icon: Database },
  { path: "/settings", label: "Settings", icon: Settings },
];

const quickActions = [
  { id: "export-pdf", label: "Export Dashboard PDF", icon: FileDown },
  { id: "generate-report", label: "Generate Monthly Report", icon: ClipboardList },
  { id: "view-alerts", label: "View Active Alerts", icon: AlertTriangle },
  { id: "run-ai", label: "Run AI Analysis", icon: Sparkles },
];

const plants = [
  { id: "plant-01", label: "Solar Park 01 (25 MW)" },
  { id: "plant-02", label: "Solar Park 02 (15 MW)" },
  { id: "plant-03", label: "Solar Park 03 (30 MW)" },
  { id: "plant-04", label: "Solar Park 04 (20 MW)" },
  { id: "plant-05", label: "Solar Park 05 (30 MW)" },
  { id: "plant-06", label: "Solar Park 06 (12 MW)" },
  { id: "plant-07", label: "Solar Park 07 (18 MW)" },
  { id: "plant-08", label: "Solar Park 08 (14 MW)" },
  { id: "plant-09", label: "Solar Park 09 (16 MW)" },
  { id: "plant-10", label: "Solar Park 10 (10 MW)" },
  { id: "plant-11", label: "Solar Park 11 (22 MW)" },
  { id: "plant-12", label: "Solar Park 12 (8 MW)" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  const handlePageSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleActionSelect = (_id: string) => {
    onOpenChange(false);
  };

  const handlePlantSelect = (_id: string) => {
    onOpenChange(false);
    navigate("/site-portfolio");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions, plants..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.path}
                value={page.label}
                onSelect={() => handlePageSelect(page.path)}
                className="cursor-pointer"
              >
                <Icon className="w-4 h-4" style={{ color: "var(--brand-fg)" }} />
                <span>{page.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <CommandItem
                key={action.id}
                value={action.label}
                onSelect={() => handleActionSelect(action.id)}
                className="cursor-pointer"
              >
                <Icon className="w-4 h-4" style={{ color: "var(--brand-fg)" }} />
                <span>{action.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Plants">
          {plants.map((plant) => (
            <CommandItem
              key={plant.id}
              value={plant.label}
              onSelect={() => handlePlantSelect(plant.id)}
              className="cursor-pointer"
            >
              <MapPin className="w-4 h-4" style={{ color: "var(--brand-fg)" }} />
              <span>{plant.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
