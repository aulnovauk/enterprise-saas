import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
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
  IndianRupee,
  Settings as SettingsIcon,
  ChevronDown,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CommandPalette } from "./CommandPalette";
import { NotificationPanel, useNotificationCount } from "./NotificationPanel";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/jmr-data", label: "JMR Data Management", icon: FileSpreadsheet },
  { path: "/kpi-engine", label: "KPI Engine", icon: Activity },
  { path: "/outage-loss", label: "Outage & Loss Analytics", icon: TrendingDown },
  { path: "/contract-ld", label: "Contract & LD Analytics", icon: FileText },
  { path: "/financial-reports", label: "Financial Reports", icon: IndianRupee },
  { path: "/reports", label: "Reports & MIS", icon: BarChart3 },
  { path: "/ai-analytics", label: "AI & Trend Analytics", icon: BrainCircuit },
  { path: "/site-portfolio", label: "Site & Portfolio Management", icon: Building2 },
  { path: "/users", label: "User Management", icon: Users },
  { path: "/audit-logs", label: "Audit Logs", icon: FileSearch },
  { path: "/erp-integration", label: "ERP Integration", icon: Database },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Layout() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = useNotificationCount();
  const { isDark, toggle: toggleDark } = useDarkMode();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside 
        className={`flex flex-col transition-all duration-300 ease-in-out shadow-lg ${
          isSidebarCollapsed ? "w-16" : "w-[260px]"
        }`} 
        style={{ background: "#2955A0" }}
      >
        {/* Logo */}
        <div className={`border-b border-white/10 flex items-center justify-center ${
          isSidebarCollapsed ? "px-2 py-2.5" : "px-4 py-3.5"
        }`}>
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${
            isSidebarCollapsed ? "hidden" : "opacity-100"
          }`}>
            <img src="/eesl-logo.svg" alt="EESL" className="w-10 h-7 rounded shadow-sm" />
            <div>
              <h1 className="font-bold text-white text-[15px] leading-tight tracking-wide">E-SAMMP</h1>
              <p className="text-[10.5px] text-white/60 leading-tight mt-0.5">EESL Solar Platform</p>
            </div>
          </div>
          {isSidebarCollapsed && (
            <img src="/eesl-logo.svg" alt="EESL" className="w-9 h-6 rounded shadow-sm" />
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto pt-2 pb-1 ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`group relative flex items-center rounded-lg transition-all duration-200 ${
                      isSidebarCollapsed 
                        ? "justify-center px-0 py-2" 
                        : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-white/20 text-white font-semibold shadow-sm backdrop-blur-sm"
                        : "text-white/80 hover:bg-white/12 hover:text-white"
                    }`}
                    title={isSidebarCollapsed ? item.label : ""}
                  >
                    {isActive && !isSidebarCollapsed && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #FFC72C 0%, #E8A800 100%)" }}
                      />
                    )}
                    {isActive && isSidebarCollapsed && (
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-6 rounded-t-full"
                        style={{ background: "linear-gradient(90deg, #FFC72C 0%, #E8A800 100%)" }}
                      />
                    )}
                    
                    <Icon className={`flex-shrink-0 transition-all duration-200 ${
                      isActive ? "w-[19px] h-[19px]" : "w-[18px] h-[18px] group-hover:scale-105"
                    }`} />
                    <span className={`transition-all duration-300 whitespace-nowrap text-[13.5px] ${
                      isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions - Fixed Bottom */}
        <div className={`border-t border-white/10 ${isSidebarCollapsed ? "px-2 pt-2 pb-1" : "px-3 pt-2 pb-1"}`}>
          <div className={`flex ${isSidebarCollapsed ? "flex-col items-center gap-1" : "items-center gap-1 px-1"}`}>
            <button
              onClick={() => setNotificationsOpen(true)}
              className={`relative flex items-center justify-center rounded-lg text-white/70 hover:bg-white/12 hover:text-white transition-all duration-200 ${
                isSidebarCollapsed ? "w-10 h-10" : "w-9 h-9"
              }`}
              title="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#2955A0]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCommandOpen(true)}
              className={`flex items-center justify-center rounded-lg text-white/70 hover:bg-white/12 hover:text-white transition-all duration-200 ${
                isSidebarCollapsed ? "w-10 h-10" : "w-9 h-9"
              }`}
              title={isSidebarCollapsed ? "Search (⌘K)" : "Search (⌘K)"}
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={toggleDark}
              className={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                isDark
                  ? "text-amber-400 hover:bg-white/10 hover:text-amber-300"
                  : "text-white/70 hover:bg-white/12 hover:text-white"
              } ${isSidebarCollapsed ? "w-10 h-10" : "w-9 h-9"}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`flex items-center justify-center rounded-lg text-white/70 hover:bg-white/12 hover:text-white transition-all duration-200 ${
                isSidebarCollapsed ? "w-10 h-10" : "w-9 h-9"
              }`}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-[18px] h-[18px]" />
              ) : (
                <ChevronLeft className="w-[18px] h-[18px]" />
              )}
            </button>

            {!isSidebarCollapsed && (
              <kbd className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-white/50 bg-white/10 rounded border border-white/15">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className={`border-t border-white/10 ${isSidebarCollapsed ? "px-2 py-2" : "px-3 py-2"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`w-full flex items-center rounded-lg transition-all duration-200 hover:bg-white/8 ${
                  isSidebarCollapsed ? "justify-center py-1.5 px-0" : "gap-2.5 px-2.5 py-2"
                }`}
                title={isSidebarCollapsed ? "Admin User" : ""}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0 ring-2 ring-white/15" style={{ background: "linear-gradient(135deg, #E8A800 0%, #D97706 100%)" }}>
                  AM
                </div>
                <div className={`flex-1 min-w-0 text-left transition-all duration-300 ${
                  isSidebarCollapsed ? "hidden" : "block"
                }`}>
                  <p className="text-[13px] font-medium text-white truncate leading-tight">Admin User</p>
                  <p className="text-[11px] text-white/55 truncate leading-tight">admin@eesl.co.in</p>
                </div>
                <LogOut className={`w-4 h-4 text-white/50 flex-shrink-0 transition-all duration-200 ${
                  isSidebarCollapsed ? "hidden" : "block"
                }`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isSidebarCollapsed ? "center" : "end"}
              side="top"
              className="w-48 mb-1"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@eesl.co.in</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-slate-50/80">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <NotificationPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  );
}