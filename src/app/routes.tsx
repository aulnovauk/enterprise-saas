import { createBrowserRouter } from "react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";

// Lazy load all other page components
const JMRDataManagement = lazy(() => import("./pages/JMRDataManagement").then(mod => ({ default: mod.JMRDataManagement })));
const KPIEngine = lazy(() => import("./pages/KPIEngine").then(mod => ({ default: mod.KPIEngine })));
const OutageLossAnalytics = lazy(() => import("./pages/OutageLossAnalytics").then(mod => ({ default: mod.OutageLossAnalytics })));
const ContractLDAnalytics = lazy(() => import("./pages/ContractLDAnalytics").then(mod => ({ default: mod.ContractLDAnalytics })));
const ReportsMIS = lazy(() => import("./pages/ReportsMIS").then(mod => ({ default: mod.ReportsMIS })));
const AITrendAnalytics = lazy(() => import("./pages/AITrendAnalytics").then(mod => ({ default: mod.AITrendAnalytics })));
const SitePortfolioManagement = lazy(() => import("./pages/SitePortfolioManagement").then(mod => ({ default: mod.SitePortfolioManagement })));
const UserManagement = lazy(() => import("./pages/UserManagement").then(mod => ({ default: mod.UserManagement })));
const AuditLogs = lazy(() => import("./pages/AuditLogs").then(mod => ({ default: mod.AuditLogs })));
const ERPIntegration = lazy(() => import("./pages/ERPIntegration").then(mod => ({ default: mod.ERPIntegration })));
const Settings = lazy(() => import("./pages/Settings").then(mod => ({ default: mod.Settings })));
const AIInsightSummary = lazy(() => import("./pages/AIInsightSummary").then(mod => ({ default: mod.AIInsightSummary })));
const AuditGovernanceConsole = lazy(() => import("./pages/AuditGovernanceConsole").then(mod => ({ default: mod.AuditGovernanceConsole })));
const ReportStudio = lazy(() => import("./pages/ReportStudio").then(mod => ({ default: mod.ReportStudio })));
const KPITransparencyConsole = lazy(() => import("./pages/KPITransparencyConsole").then(mod => ({ default: mod.KPITransparencyConsole })));
const PortfolioComplianceHealth = lazy(() => import("./pages/PortfolioComplianceHealth").then(mod => ({ default: mod.PortfolioComplianceHealth })));
const WaterfallLossAnalytics = lazy(() => import("./pages/WaterfallLossAnalytics").then(mod => ({ default: mod.WaterfallLossAnalytics })));
const FinancialReports = lazy(() => import("./pages/FinancialReports").then(mod => ({ default: mod.FinancialReports })));

// Loading fallback component
const LoadingFallback = () => <div className="flex items-center justify-center h-screen">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "jmr-data", Component: () => <Suspense fallback={<LoadingFallback />}><JMRDataManagement /></Suspense> },
      { path: "kpi-engine", Component: () => <Suspense fallback={<LoadingFallback />}><KPIEngine /></Suspense> },
      { path: "outage-loss", Component: () => <Suspense fallback={<LoadingFallback />}><OutageLossAnalytics /></Suspense> },
      { path: "contract-ld", Component: () => <Suspense fallback={<LoadingFallback />}><ContractLDAnalytics /></Suspense> },
      { path: "reports", Component: () => <Suspense fallback={<LoadingFallback />}><ReportsMIS /></Suspense> },
      { path: "ai-analytics", Component: () => <Suspense fallback={<LoadingFallback />}><AITrendAnalytics /></Suspense> },
      { path: "ai-insight-summary", Component: () => <Suspense fallback={<LoadingFallback />}><AIInsightSummary /></Suspense> },
      { path: "site-portfolio", Component: () => <Suspense fallback={<LoadingFallback />}><SitePortfolioManagement /></Suspense> },
      { path: "users", Component: () => <Suspense fallback={<LoadingFallback />}><UserManagement /></Suspense> },
      { path: "audit-logs", Component: () => <Suspense fallback={<LoadingFallback />}><AuditLogs /></Suspense> },
      { path: "audit-governance", Component: () => <Suspense fallback={<LoadingFallback />}><AuditGovernanceConsole /></Suspense> },
      { path: "erp-integration", Component: () => <Suspense fallback={<LoadingFallback />}><ERPIntegration /></Suspense> },
      { path: "settings", Component: () => <Suspense fallback={<LoadingFallback />}><Settings /></Suspense> },
      { path: "report-studio", Component: () => <Suspense fallback={<LoadingFallback />}><ReportStudio /></Suspense> },
      { path: "kpi-transparency", Component: () => <Suspense fallback={<LoadingFallback />}><KPITransparencyConsole /></Suspense> },
      { path: "portfolio-compliance", Component: () => <Suspense fallback={<LoadingFallback />}><PortfolioComplianceHealth /></Suspense> },
      { path: "waterfall-loss", Component: () => <Suspense fallback={<LoadingFallback />}><WaterfallLossAnalytics /></Suspense> },
      { path: "financial-reports", Component: () => <Suspense fallback={<LoadingFallback />}><FinancialReports /></Suspense> },
    ],
  },
]);