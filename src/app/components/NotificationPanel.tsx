import { useState, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  Bell,
} from "lucide-react";

type NotificationCategory = "critical" | "warning" | "info" | "success";
type FilterTab = "all" | "critical" | "warning" | "info";

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", category: "critical", title: "Buldhana Solar Farm CUF dropped below 20% threshold", description: "CUF has been consistently below the minimum acceptable level for the past 48 hours. Immediate attention required.", timestamp: "2 min ago", read: false },
  { id: "2", category: "critical", title: "LD exposure crossed ₹1.5 Cr limit", description: "Liquidated damages for Osmanabad Solar Plant have exceeded the contractual threshold for Q4 FY25.", timestamp: "15 min ago", read: false },
  { id: "3", category: "critical", title: "SCADA integration failed", description: "Real-time data feed from Beed Solar Park SCADA system has been interrupted since 10:42 AM.", timestamp: "32 min ago", read: false },
  { id: "4", category: "critical", title: "Inverter fault detected at Sakri Solar Park", description: "Inverter INV-04 reported overcurrent fault. Energy loss estimated at 120 kWh/hr.", timestamp: "1 hr ago", read: true },
  { id: "5", category: "warning", title: "JMR submission overdue for Wardha Solar Park", description: "April 2026 JMR has not been submitted. Deadline was 3 days ago.", timestamp: "45 min ago", read: false },
  { id: "6", category: "warning", title: "Grid availability dropped to 94.2%", description: "Buldhana Solar Farm grid availability is below the 95% SLA threshold for the current billing cycle.", timestamp: "1 hr ago", read: false },
  { id: "7", category: "warning", title: "SunPower Tech compliance at 78%", description: "O&M vendor compliance score has dropped below the 80% acceptable benchmark.", timestamp: "2 hr ago", read: false },
  { id: "8", category: "warning", title: "Module degradation above normal rate", description: "Amravati Solar Unit module degradation rate measured at 1.2%/year vs expected 0.7%/year.", timestamp: "3 hr ago", read: true },
  { id: "9", category: "warning", title: "Backup battery SOC below 30%", description: "Beed Solar Park energy storage system state-of-charge is critically low.", timestamp: "4 hr ago", read: true },
  { id: "10", category: "info", title: "Monthly report auto-generated", description: "April 2026 performance report has been generated and is ready for review.", timestamp: "1 hr ago", read: false },
  { id: "11", category: "info", title: "AI model updated to v2.4.2", description: "Anomaly detection and generation forecasting models have been refreshed with latest data.", timestamp: "3 hr ago", read: false },
  { id: "12", category: "info", title: "New user role assigned", description: "User 'Priya Sharma' has been assigned the Plant Manager role for Latur Solar Station.", timestamp: "5 hr ago", read: true },
  { id: "13", category: "info", title: "Scheduled maintenance window", description: "Sangli Solar Farm will undergo scheduled inverter maintenance on 15 Mar, 6:00-10:00 AM.", timestamp: "6 hr ago", read: true },
  { id: "14", category: "info", title: "Data export completed", description: "Portfolio performance data export (Jan-Mar 2025) is ready for download.", timestamp: "8 hr ago", read: true },
  { id: "15", category: "success", title: "Sakri Solar Park JMR approved", description: "April 2026 JMR for Sakri Solar Park has been approved by Priya Sharma.", timestamp: "30 min ago", read: false },
  { id: "16", category: "success", title: "April billing reconciled", description: "All 12 plants' April billing has been successfully reconciled with JMR data.", timestamp: "2 hr ago", read: false },
  { id: "17", category: "success", title: "ERP sync completed", description: "SAP ERP synchronization completed successfully. 342 records updated.", timestamp: "4 hr ago", read: true },
  { id: "18", category: "success", title: "Chandrapur Solar Project commissioning verified", description: "All pre-commissioning checks passed. Chandrapur Solar Project is operating at rated capacity.", timestamp: "1 day ago", read: true },
];

const categoryConfig: Record<NotificationCategory, { color: string; bgColor: string; icon: typeof AlertCircle }> = {
  critical: { color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.08)", icon: AlertCircle },
  warning: { color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.08)", icon: AlertTriangle },
  info: { color: "#3B82F6", bgColor: "rgba(59, 130, 246, 0.08)", icon: Info },
  success: { color: "#22C55E", bgColor: "rgba(34, 197, 94, 0.08)", icon: CheckCircle2 },
};

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warnings" },
  { key: "info", label: "Info" },
];

let notificationStore = [...initialNotifications];
let storeListeners = new Set<() => void>();

function getSnapshot() {
  return notificationStore;
}

function subscribe(listener: () => void) {
  storeListeners.add(listener);
  return () => storeListeners.delete(listener);
}

function emitChange() {
  storeListeners.forEach((l) => l());
}

function storeMarkAsRead(id: string) {
  notificationStore = notificationStore.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  emitChange();
}

function storeMarkAllRead() {
  notificationStore = notificationStore.map((n) => ({ ...n, read: true }));
  emitChange();
}

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const notifications = useSyncExternalStore(subscribe, getSnapshot);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.category === activeFilter);

  const markAllRead = useCallback(() => {
    storeMarkAllRead();
  }, []);

  const markAsRead = useCallback((id: string) => {
    storeMarkAsRead(id);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[400px] max-w-[calc(100vw-48px)] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200" style={{ background: "linear-gradient(135deg, #2955A0 0%, #0089C9 100%)" }}>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-white" />
                <h2 className="text-[16px] font-semibold text-white">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[12px] text-slate-300 hover:text-white transition-colors font-medium px-2 py-1 rounded hover:bg-white/10"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200 ${
                    activeFilter === tab.key
                      ? "text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/60"
                  }`}
                  style={activeFilter === tab.key ? { background: "#2955A0" } : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                  <Bell className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-[13px]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notification) => {
                    const config = categoryConfig[notification.category];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                          !notification.read ? "bg-slate-50/60" : ""
                        }`}
                      >
                        <div
                          className="w-[3px] rounded-full flex-shrink-0 self-stretch"
                          style={{ backgroundColor: config.color }}
                        />

                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                          style={{ backgroundColor: config.bgColor }}
                        >
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] leading-snug ${
                            !notification.read ? "font-semibold text-slate-900" : "font-normal text-slate-700"
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-[12px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1.5">
                            {notification.timestamp}
                          </p>
                        </div>

                        {!notification.read && (
                          <div className="flex-shrink-0 mt-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useNotificationCount() {
  const notifications = useSyncExternalStore(subscribe, getSnapshot);
  return notifications.filter((n) => !n.read).length;
}
