import { useState, useRef } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  FileSearch,
  Filter,
  Shield,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Bell,
  History,
  Database,
  Calendar,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";

// User Activity Logs
const userActivityLogs = [
  {
    id: "LOG-2026-1543",
    timestamp: "2026-04-07 14:32:15",
    user: "Rajesh Kumar",
    email: "rajesh.kumar@eesl.in",
    role: "Data Analyst",
    action: "JMR Data Modified",
    resource: "Sakri Solar Park - Apr 2026 (Generation Data)",
    ipAddress: "192.168.1.45",
    status: "Success",
    changes: "Updated generation value from 4100 to 4105 MWh",
  },
  {
    id: "LOG-2026-1542",
    timestamp: "2026-04-07 13:18:42",
    user: "Priya Sharma",
    email: "priya.sharma@eesl.in",
    role: "Admin",
    action: "User Role Updated",
    resource: "User: john.doe@eesl.in",
    ipAddress: "192.168.1.52",
    status: "Success",
    changes: "Role changed from Viewer to Data Analyst",
  },
  {
    id: "LOG-2026-1541",
    timestamp: "2026-04-07 11:45:20",
    user: "Amit Patel",
    email: "amit.patel@eesl.in",
    role: "Plant Manager",
    action: "JMR Submitted",
    resource: "Osmanabad Solar Plant - Apr 2026 (Final)",
    ipAddress: "192.168.1.38",
    status: "Success",
    changes: "Final JMR submission with all mandatory fields",
  },
  {
    id: "LOG-2026-1540",
    timestamp: "2026-04-07 10:22:08",
    user: "Unknown User",
    email: "external@suspicious.com",
    role: "N/A",
    action: "Login Attempt",
    resource: "System Access",
    ipAddress: "203.45.78.92",
    status: "Failed",
    changes: "Invalid credentials - Account locked after 3 attempts",
  },
  {
    id: "LOG-2026-1539",
    timestamp: "2026-04-07 09:15:33",
    user: "Neha Singh",
    email: "neha.singh@eesl.in",
    role: "Auditor",
    action: "Report Downloaded",
    resource: "Monthly Performance Report - Jan 2026",
    ipAddress: "192.168.1.67",
    status: "Success",
    changes: "PDF format, 18 pages",
  },
];

// JMR Submission Tracker
const jmrSubmissions = [
  {
    id: "JMR-2026-02-001",
    plant: "Sakri Solar Park (25 MW)",
    month: "February 2026",
    submittedBy: "Amit Patel",
    submittedDate: "2026-04-07 11:45",
    status: "Approved",
    approvedBy: "Priya Sharma",
    approvalDate: "2026-04-07 13:20",
    version: "v1.0",
  },
  {
    id: "JMR-2026-02-002",
    plant: "Osmanabad Solar Plant (30 MW)",
    month: "February 2026",
    submittedBy: "Vikram Desai",
    submittedDate: "2026-04-07 10:30",
    status: "Pending Review",
    approvedBy: "-",
    approvalDate: "-",
    version: "v1.0",
  },
  {
    id: "JMR-2026-02-003",
    plant: "Latur Solar Station (20 MW)",
    month: "February 2026",
    submittedBy: "Anjali Verma",
    submittedDate: "2026-04-06 16:20",
    status: "Rejected",
    approvedBy: "Priya Sharma",
    approvalDate: "2026-04-07 09:15",
    version: "v2.1",
  },
  {
    id: "JMR-2026-02-004",
    plant: "Beed Solar Park (30 MW)",
    month: "February 2026",
    submittedBy: "-",
    submittedDate: "-",
    status: "Not Submitted",
    approvedBy: "-",
    approvalDate: "-",
    version: "-",
  },
  {
    id: "JMR-2026-02-005",
    plant: "Ahmednagar Solar Plant (12 MW)",
    month: "February 2026",
    submittedBy: "Rahul Gupta",
    submittedDate: "2026-04-07 14:10",
    status: "Approved",
    approvedBy: "Priya Sharma",
    approvalDate: "2026-04-07 15:05",
    version: "v1.0",
  },
];

// Compliance Reminder Alerts
const complianceAlerts = [
  {
    id: "ALERT-2026-08",
    priority: "critical",
    type: "Overdue Submission",
    message: "Beed Solar Park - JMR for February 2026 not submitted",
    dueDate: "2026-04-07",
    daysOverdue: 1,
    assignedTo: "Suresh Reddy",
    action: "Submit JMR immediately",
  },
  {
    id: "ALERT-2026-07",
    priority: "high",
    type: "Pending Approval",
    message: "Sangli Solar Farm - JMR awaiting review for 18 hours",
    dueDate: "2026-03-01",
    daysOverdue: 0,
    assignedTo: "Priya Sharma",
    action: "Review and approve/reject",
  },
  {
    id: "ALERT-2026-06",
    priority: "medium",
    type: "Upcoming Deadline",
    message: "March 2026 JMR submission due in 3 days",
    dueDate: "2026-03-31",
    daysOverdue: 0,
    assignedTo: "All Plant Managers",
    action: "Prepare March data",
  },
  {
    id: "ALERT-2026-05",
    priority: "high",
    type: "DR Drill Overdue",
    message: "Quarterly DR drill not conducted - 5 days overdue",
    dueDate: "2026-02-23",
    daysOverdue: 5,
    assignedTo: "IT Team",
    action: "Schedule and conduct DR drill",
  },
  {
    id: "ALERT-2026-04",
    priority: "medium",
    type: "Compliance Check",
    message: "Annual data integrity audit due in 15 days",
    dueDate: "2026-03-15",
    daysOverdue: 0,
    assignedTo: "Compliance Team",
    action: "Schedule audit session",
  },
];

// Version History
const versionHistory = [
  {
    id: "VER-2026-324",
    timestamp: "2026-04-07 14:32:15",
    resource: "Sakri Solar Park - Apr 2026 (Generation)",
    field: "Generation (MWh)",
    oldValue: "4100",
    newValue: "4105",
    modifiedBy: "Rajesh Kumar",
    reason: "Correction based on meter reading verification",
    version: "v2.2",
  },
  {
    id: "VER-2026-323",
    timestamp: "2026-04-07 12:18:40",
    resource: "Sakri Solar Park - Apr 2026 (Availability)",
    field: "Availability (%)",
    oldValue: "94.2",
    newValue: "94.5",
    modifiedBy: "Anjali Verma",
    reason: "Updated after maintenance log review",
    version: "v2.1",
  },
  {
    id: "VER-2026-322",
    timestamp: "2026-04-06 16:45:22",
    resource: "Osmanabad Solar Plant - Apr 2026 (Irradiation)",
    field: "Irradiation (kWh/m²)",
    oldValue: "5.2",
    newValue: "5.3",
    modifiedBy: "Amit Patel",
    reason: "Weather station data correction",
    version: "v1.1",
  },
  {
    id: "VER-2026-321",
    timestamp: "2026-04-06 14:20:10",
    resource: "Beed Solar Park - Apr 2026 (Grid Outage)",
    field: "Grid Outage Hours",
    oldValue: "8.0",
    newValue: "10.5",
    modifiedBy: "Vikram Desai",
    reason: "Added missing outage record from 27-Feb",
    version: "v1.2",
  },
];

// DR Drill Records
const drDrillRecords = [
  {
    id: "DR-2025-Q4",
    drillDate: "2025-12-15",
    type: "Full System Recovery",
    status: "Completed",
    rto: "4 hours",
    rpoActual: "3.8 hours",
    rpo: "15 minutes",
    rpoActual2: "12 minutes",
    conductedBy: "IT Team + Vendor",
    issues: "None",
    score: 95,
  },
  {
    id: "DR-2025-Q3",
    drillDate: "2025-09-20",
    type: "Database Failover",
    status: "Completed",
    rto: "4 hours",
    rpoActual: "4.2 hours",
    rpo: "15 minutes",
    rpoActual2: "18 minutes",
    conductedBy: "IT Team",
    issues: "Minor delay in DNS propagation",
    score: 88,
  },
  {
    id: "DR-2025-Q2",
    drillDate: "2025-06-18",
    type: "Application Recovery",
    status: "Completed",
    rto: "4 hours",
    rpoActual: "3.5 hours",
    rpo: "15 minutes",
    rpoActual2: "10 minutes",
    conductedBy: "IT Team",
    issues: "None",
    score: 98,
  },
  {
    id: "DR-2026-Q1",
    drillDate: "2026-03-TBD",
    type: "Full System Recovery",
    status: "Scheduled",
    rto: "4 hours",
    rpoActual: "-",
    rpo: "15 minutes",
    rpoActual2: "-",
    conductedBy: "IT Team + Vendor",
    issues: "-",
    score: 0,
  },
];

// Data Modification Timeline
const modificationTimeline = [
  {
    date: "2026-04-07",
    events: [
      { time: "14:32", user: "Rajesh Kumar", action: "Modified Generation Data", resource: "Sakri Solar Park - Apr 2026" },
      { time: "13:18", user: "Priya Sharma", action: "User Role Updated", resource: "john.doe@eesl.in" },
      { time: "11:45", user: "Amit Patel", action: "JMR Submitted", resource: "Osmanabad Solar Plant - Apr 2026" },
    ],
  },
  {
    date: "2026-04-06",
    events: [
      { time: "16:45", user: "Amit Patel", action: "Modified Irradiation Data", resource: "Osmanabad Solar Plant - Apr 2026" },
      { time: "16:20", user: "Anjali Verma", action: "JMR Submitted", resource: "Sakri Solar Park - Apr 2026" },
      { time: "14:20", user: "Vikram Desai", action: "Modified Outage Data", resource: "Beed Solar Park - Apr 2026" },
    ],
  },
  {
    date: "2026-02-26",
    events: [
      { time: "15:10", user: "Neha Singh", action: "Audit Log Exported", resource: "January 2026 Logs" },
      { time: "10:30", user: "Priya Sharma", action: "User Account Created", resource: "new.user@eesl.in" },
    ],
  },
];

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const pageRef = useRef<HTMLDivElement>(null);

  const activeAlerts = complianceAlerts.filter(a => a.priority === "critical" || a.priority === "high").length;
  const pendingJMRs = jmrSubmissions.filter(j => j.status === "Pending Review" || j.status === "Not Submitted").length;

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <FileSearch className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Governance & Audit Dashboard</h1>
                <p className="text-xs text-slate-600 mt-0.5">Comprehensive audit trail, compliance tracking, and data governance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Last Updated: 28-Feb-2026 14:32
              </Badge>
              <PageExportMenu
                pageTitle="Governance & Audit Dashboard"
                contentRef={pageRef}
                label="Export All Logs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <Badge variant="destructive" className="font-semibold">Urgent</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">Active Compliance Alerts</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">{activeAlerts}</span>
              <span className="text-xs text-gray-600">require attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-800 font-semibold">Pending</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">JMR Status</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-600">{pendingJMRs}</span>
              <span className="text-xs text-gray-600">pending/not submitted</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 font-semibold">Today</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">User Activity Logs</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">247</span>
              <span className="text-xs text-gray-600">actions logged</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 font-semibold">Tracked</Badge>
            </div>
            <h3 className="text-xs font-medium text-gray-600 mb-2">Data Modifications</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">18</span>
              <span className="text-xs text-gray-600">changes this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="activity" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <Activity className="w-4 h-4 mr-2" />
            User Activity Logs
          </TabsTrigger>
          <TabsTrigger value="jmr" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <FileText className="w-4 h-4 mr-2" />
            JMR Tracker
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <Bell className="w-4 h-4 mr-2" />
            Compliance Alerts
          </TabsTrigger>
          <TabsTrigger value="version" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <History className="w-4 h-4 mr-2" />
            Version History
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="dr" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
            <RefreshCw className="w-4 h-4 mr-2" />
            DR Drills
          </TabsTrigger>
        </TabsList>

        {/* User Activity Logs Tab */}
        <TabsContent value="activity">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">User Activity Logs</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success Only</SelectItem>
                      <SelectItem value="failed">Failed Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">Log ID</TableHead>
                      <TableHead className="font-semibold text-xs">Timestamp</TableHead>
                      <TableHead className="font-semibold text-xs">User</TableHead>
                      <TableHead className="font-semibold text-xs">Role</TableHead>
                      <TableHead className="font-semibold text-xs">Action</TableHead>
                      <TableHead className="font-semibold text-xs">Resource</TableHead>
                      <TableHead className="font-semibold text-xs">IP Address</TableHead>
                      <TableHead className="font-semibold text-xs">Status</TableHead>
                      <TableHead className="font-semibold text-xs">Changes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userActivityLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs font-semibold text-blue-600">{log.id}</TableCell>
                        <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-semibold text-gray-900">{log.user}</div>
                            <div className="text-gray-500">{log.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{log.role}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-gray-900">{log.action}</TableCell>
                        <TableCell className="text-xs text-gray-700">{log.resource}</TableCell>
                        <TableCell className="font-mono text-xs text-gray-600">{log.ipAddress}</TableCell>
                        <TableCell>
                          {log.status === "Success" ? (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 max-w-xs">{log.changes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JMR Submission Tracker Tab */}
        <TabsContent value="jmr">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">JMR Submission Tracker - February 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">JMR ID</TableHead>
                      <TableHead className="font-semibold text-xs">Plant</TableHead>
                      <TableHead className="font-semibold text-xs">Month</TableHead>
                      <TableHead className="font-semibold text-xs">Submitted By</TableHead>
                      <TableHead className="font-semibold text-xs">Submitted Date</TableHead>
                      <TableHead className="font-semibold text-xs">Status</TableHead>
                      <TableHead className="font-semibold text-xs">Approved By</TableHead>
                      <TableHead className="font-semibold text-xs">Approval Date</TableHead>
                      <TableHead className="font-semibold text-xs">Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jmrSubmissions.map((jmr) => (
                      <TableRow key={jmr.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs font-semibold text-blue-600">{jmr.id}</TableCell>
                        <TableCell className="text-xs font-semibold text-gray-900">{jmr.plant}</TableCell>
                        <TableCell className="text-xs text-gray-700">{jmr.month}</TableCell>
                        <TableCell className="text-xs text-gray-700">{jmr.submittedBy}</TableCell>
                        <TableCell className="font-mono text-xs text-gray-600">{jmr.submittedDate}</TableCell>
                        <TableCell>
                          {jmr.status === "Approved" && (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {jmr.status === "Pending Review" && (
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending Review
                            </Badge>
                          )}
                          {jmr.status === "Rejected" && (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                          {jmr.status === "Not Submitted" && (
                            <Badge className="bg-red-100 text-red-800 border border-red-300">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Not Submitted
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700">{jmr.approvedBy}</TableCell>
                        <TableCell className="font-mono text-xs text-gray-600">{jmr.approvalDate}</TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-gray-900">{jmr.version}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Alerts Tab */}
        <TabsContent value="compliance">
          <Card className="border-2">
            <CardHeader className="border-b bg-red-50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-red-600" />
                <CardTitle className="text-base font-semibold">Compliance Reminder Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {complianceAlerts.map((alert) => {
                  const priorityColors = {
                    critical: { bg: "bg-red-50", border: "border-red-300", text: "text-red-800", badge: "bg-red-100" },
                    high: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-800", badge: "bg-orange-100" },
                    medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800", badge: "bg-yellow-100" },
                  };
                  const colors = priorityColors[alert.priority as keyof typeof priorityColors];

                  return (
                    <div key={alert.id} className={`p-5 rounded-lg border-2 ${colors.bg} ${colors.border}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${colors.badge} ${colors.text} text-xs font-semibold border ${colors.border}`}>
                              {alert.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{alert.type}</Badge>
                            <span className="font-mono text-xs text-gray-500">{alert.id}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{alert.message}</h3>
                          <div className="grid grid-cols-3 gap-4 text-xs mt-3">
                            <div>
                              <span className="text-gray-600">Due Date:</span>
                              <div className="font-semibold text-gray-900">{alert.dueDate}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Assigned To:</span>
                              <div className="font-semibold text-gray-900">{alert.assignedTo}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Recommended Action:</span>
                              <div className="font-semibold text-gray-900">{alert.action}</div>
                            </div>
                          </div>
                        </div>
                        {alert.daysOverdue > 0 && (
                          <div className="ml-4 text-right">
                            <div className="text-3xl font-bold text-red-600">{alert.daysOverdue}</div>
                            <div className="text-xs text-gray-600">days overdue</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Version History Tab */}
        <TabsContent value="version">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">Data Modification Version History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">Version ID</TableHead>
                      <TableHead className="font-semibold text-xs">Timestamp</TableHead>
                      <TableHead className="font-semibold text-xs">Resource</TableHead>
                      <TableHead className="font-semibold text-xs">Field Modified</TableHead>
                      <TableHead className="font-semibold text-xs">Old Value</TableHead>
                      <TableHead className="font-semibold text-xs">New Value</TableHead>
                      <TableHead className="font-semibold text-xs">Modified By</TableHead>
                      <TableHead className="font-semibold text-xs">Reason</TableHead>
                      <TableHead className="font-semibold text-xs">Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versionHistory.map((version) => (
                      <TableRow key={version.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs font-semibold text-blue-600">{version.id}</TableCell>
                        <TableCell className="font-mono text-xs">{version.timestamp}</TableCell>
                        <TableCell className="text-xs font-semibold text-gray-900">{version.resource}</TableCell>
                        <TableCell className="text-xs font-semibold text-gray-700">{version.field}</TableCell>
                        <TableCell className="font-mono text-xs text-red-600 font-semibold bg-red-50">{version.oldValue}</TableCell>
                        <TableCell className="font-mono text-xs text-green-600 font-semibold bg-green-50">{version.newValue}</TableCell>
                        <TableCell className="text-xs text-gray-700">{version.modifiedBy}</TableCell>
                        <TableCell className="text-xs text-gray-600 max-w-xs">{version.reason}</TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-gray-900">{version.version}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-base font-semibold">Data Modification Audit Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {modificationTimeline.map((day, dayIdx) => (
                  <div key={dayIdx}>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900">{day.date}</h3>
                      <Separator className="flex-1" />
                    </div>
                    <div className="ml-8 space-y-3">
                      {day.events.map((event, eventIdx) => (
                        <div key={eventIdx} className="flex gap-4 relative">
                          {eventIdx < day.events.length - 1 && (
                            <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-gray-300" />
                          )}
                          <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center flex-shrink-0 mt-1 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-semibold text-gray-900">{event.time}</span>
                                  <span className="text-xs font-semibold text-gray-900">{event.action}</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <span className="font-semibold">{event.user}</span> • {event.resource}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-7">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DR Drill Records Tab */}
        <TabsContent value="dr">
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Disaster Recovery Drill Records</CardTitle>
                  <p className="text-xs text-gray-600 mt-1">Quarterly DR drill compliance and performance tracking</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 border border-orange-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Q1 2026 Drill Overdue
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">Drill ID</TableHead>
                      <TableHead className="font-semibold text-xs">Drill Date</TableHead>
                      <TableHead className="font-semibold text-xs">Type</TableHead>
                      <TableHead className="font-semibold text-xs">Status</TableHead>
                      <TableHead className="font-semibold text-xs">RTO Target</TableHead>
                      <TableHead className="font-semibold text-xs">RTO Actual</TableHead>
                      <TableHead className="font-semibold text-xs">RPO Target</TableHead>
                      <TableHead className="font-semibold text-xs">RPO Actual</TableHead>
                      <TableHead className="font-semibold text-xs">Conducted By</TableHead>
                      <TableHead className="font-semibold text-xs">Issues</TableHead>
                      <TableHead className="font-semibold text-xs">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drDrillRecords.map((drill) => (
                      <TableRow key={drill.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs font-semibold text-blue-600">{drill.id}</TableCell>
                        <TableCell className="font-mono text-xs">{drill.drillDate}</TableCell>
                        <TableCell className="text-xs font-semibold text-gray-900">{drill.type}</TableCell>
                        <TableCell>
                          {drill.status === "Completed" && (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {drill.status === "Scheduled" && (
                            <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                              <Clock className="w-3 h-3 mr-1" />
                              Scheduled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-700">{drill.rto}</TableCell>
                        <TableCell className={`font-mono text-xs font-semibold ${drill.rpoActual !== "-" && parseFloat(drill.rpoActual) > 4 ? "text-red-600" : "text-green-600"}`}>
                          {drill.rpoActual}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-700">{drill.rpo}</TableCell>
                        <TableCell className={`font-mono text-xs font-semibold ${drill.rpoActual2 !== "-" && parseFloat(drill.rpoActual2) > 15 ? "text-red-600" : "text-green-600"}`}>
                          {drill.rpoActual2}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700">{drill.conductedBy}</TableCell>
                        <TableCell className="text-xs text-gray-600">{drill.issues}</TableCell>
                        <TableCell>
                          {drill.score > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-bold text-gray-900">{drill.score}%</div>
                              {drill.score >= 90 && <Badge className="bg-green-100 text-green-800 text-xs">Excellent</Badge>}
                              {drill.score >= 80 && drill.score < 90 && <Badge className="bg-blue-100 text-blue-800 text-xs">Good</Badge>}
                            </div>
                          )}
                          {drill.score === 0 && <span className="text-xs text-gray-400">-</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
