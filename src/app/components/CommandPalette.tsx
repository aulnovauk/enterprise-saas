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
  { id: "plant-sakri", label: "Sakri Solar Park (25 MW)" },
  { id: "plant-sangli", label: "Sangli Solar Farm (15 MW)" },
  { id: "plant-osmanabad", label: "Osmanabad Solar Plant (30 MW)" },
  { id: "plant-latur", label: "Latur Solar Station (20 MW)" },
  { id: "plant-beed", label: "Beed Solar Park (30 MW)" },
  { id: "plant-ahmednagar", label: "Ahmednagar Solar Plant (12 MW)" },
  { id: "plant-devdaithan", label: "Devdaithan Solar Plant (18 MW)" },
  { id: "plant-amravati", label: "Amravati Solar Unit (14 MW)" },
  { id: "plant-wardha", label: "Wardha Solar Park (16 MW)" },
  { id: "plant-buldhana", label: "Buldhana Solar Farm (10 MW)" },
  { id: "plant-chandrapur", label: "Chandrapur Solar Project (22 MW)" },
  { id: "plant-bhandara", label: "Bhandara Solar Station (8 MW)" },
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
                <Icon className="w-4 h-4" style={{ color: "#2955A0" }} />
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
                <Icon className="w-4 h-4" style={{ color: "#2955A0" }} />
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
              <MapPin className="w-4 h-4" style={{ color: "#2955A0" }} />
              <span>{plant.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
