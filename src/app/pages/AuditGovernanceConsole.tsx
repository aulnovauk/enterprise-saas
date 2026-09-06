import { useState, useRef } from "react";
import { PageExportMenu } from "../components/PageExportMenu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Shield,
  Activity,
  FileText,
  Mail,
  Database,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  GitCompare,
} from "lucide-react";

// User Activity Log Data
const userActivityLog = [
  {
    id: "ACT-2026-5843",
    timestamp: "2026-04-07 14:32:15",
    user: "Rajesh Kumar",
    email: "rajesh.kumar@eesl.in",
    role: "Data Analyst",
    action: "JMR Data Modified",
    module: "JMR Management",
    resource: "Sakri Solar Park - Apr 2026 (Generation)",
    ipAddress: "192.168.1.45",
    status: "Success",
    details: "Updated generation value: 4100 → 4105 MWh",
  },
  {
    id: "ACT-2026-5842",
    timestamp: "2026-04-07 13:18:42",
    user: "Priya Sharma",
    email: "priya.sharma@eesl.in",
    role: "Admin",
    action: "User Role Updated",
    module: "User Management",
    resource: "john.doe@eesl.in",
    ipAddress: "192.168.1.52",
    status: "Success",
    details: "Role changed: Viewer → Data Analyst",
  },
  {
    id: "ACT-2026-5841",
    timestamp: "2026-04-07 11:45:20",
    user: "Amit Patel",
    email: "amit.patel@eesl.in",
    role: "Plant Manager",
    action: "JMR Submitted",
    module: "JMR Management",
    resource: "Osmanabad Solar Plant - Apr 2026 (Final)",
    ipAddress: "192.168.1.38",
    status: "Success",
    details: "Final submission with approval workflow",
  },
  {
    id: "ACT-2026-5840",
    timestamp: "2026-04-07 10:22:08",
    user: "Unknown User",
    email: "external@suspicious.com",
    role: "N/A",
    action: "Login Attempt",
    module: "Authentication",
    resource: "System Access",
    ipAddress: "203.45.78.92",
    status: "Failed",
    details: "Invalid credentials - Account locked after 3 attempts",
  },
  {
    id: "ACT-2026-5839",
    timestamp: "2026-04-07 09:15:33",
    user: "Neha Singh",
    email: "neha.singh@eesl.in",
    role: "Auditor",
    action: "Report Downloaded",
    module: "Report Studio",
    resource: "Monthly Performance Report - Jan 2026",
    ipAddress: "192.168.1.67",
    status: "Success",
    details: "PDF format, 18 pages, exported to local machine",
  },
];

// JMR Version History Data
const jmrVersionHistory = [
  {
    id: "VER-2026-324",
    jmrId: "JMR-2026-02-003",
    plant: "Latur Solar Station",
    version: "v2.2",
    timestamp: "2026-04-07 14:32:15",
    modifiedBy: "Rajesh Kumar",
    role: "Data Analyst",
    changeType: "Data Modification",
    changeSummary: "Generation: 4100 → 4105 MWh | Reason: Final meter reading reconciliation",
    fieldsChanged: 2,
    status: "Active",
  },
  {
    id: "VER-2026-323",
    jmrId: "JMR-2026-02-003",
    plant: "Latur Solar Station",
    version: "v2.1",
    timestamp: "2026-04-07 12:18:40",
    modifiedBy: "Anjali Verma",
    role: "Plant Manager",
    changeType: "Data Modification",
    changeSummary: "Plant Availability: 94.2% → 94.5% | Grid Outage Hours: 8.0 → 10.5 hrs",
    fieldsChanged: 2,
    status: "Superseded",
  },
  {
    id: "VER-2026-322",
    jmrId: "JMR-2026-02-003",
    plant: "Latur Solar Station",
    version: "v2.0",
    timestamp: "2026-04-06 16:45:22",
    modifiedBy: "Anjali Verma",
    role: "Plant Manager",
    changeType: "Initial Submission",
    changeSummary: "First submission of February 2026 JMR with all mandatory fields",
    fieldsChanged: 0,
    status: "Superseded",
  },
  {
    id: "VER-2026-321",
    jmrId: "JMR-2026-02-001",
    plant: "Sakri Solar Park",
    version: "v1.1",
    timestamp: "2026-04-06 14:20:10",
    modifiedBy: "Amit Patel",
    role: "Plant Manager",
    changeType: "Data Modification",
    changeSummary: "Irradiation: 5.2 → 5.3 kWh/m² | Reason: Weather station data correction",
    fieldsChanged: 1,
    status: "Active",
  },
];

// Email Dispatch Log Data
const emailDispatchLog = [
  {
    id: "EMAIL-2026-1245",
    reportName: "Monthly Performance Dashboard - February 2026",
    reportType: "MIS Report",
    sentBy: "System Scheduler",
    sentTo: "management@eesl.in, ops@eesl.in",
    recipientCount: 12,
    timestamp: "2026-03-01 08:00:00",
    deliveryStatus: "Delivered",
    openRate: "83%",
    attachments: "PDF (2.4 MB)",
  },
  {
    id: "EMAIL-2026-1244",
    reportName: "Weekly Compliance Alert - Week 9",
    reportType: "Alert Notification",
    sentBy: "Compliance Engine",
    sentTo: "compliance-team@eesl.in",
    recipientCount: 5,
    timestamp: "2026-04-07 18:00:00",
    deliveryStatus: "Delivered",
    openRate: "100%",
    attachments: "None",
  },
  {
    id: "EMAIL-2026-1243",
    reportName: "JMR Submission Reminder - Beed Solar Park",
    reportType: "System Reminder",
    sentBy: "Workflow Automation",
    sentTo: "suresh.reddy@eesl.in",
    recipientCount: 1,
    timestamp: "2026-04-07 16:00:00",
    deliveryStatus: "Bounced",
    openRate: "N/A",
    attachments: "None",
  },
  {
    id: "EMAIL-2026-1242",
    reportName: "Quarterly Financial Report - Q3 FY2025-26",
    reportType: "MIS Report",
    sentBy: "Report Scheduler",
    sentTo: "finance@eesl.in, board@eesl.in",
    recipientCount: 8,
    timestamp: "2026-04-07 09:00:00",
    deliveryStatus: "Delivered",
    openRate: "75%",
    attachments: "PDF (5.8 MB), Excel (1.2 MB)",
  },
  {
    id: "EMAIL-2026-1241",
    reportName: "Daily Generation Summary - Feb 27",
    reportType: "Daily Report",
    sentBy: "System Scheduler",
    sentTo: "operations@eesl.in",
    recipientCount: 15,
    timestamp: "2026-04-07 07:00:00",
    deliveryStatus: "Delivered",
    openRate: "92%",
    attachments: "PDF (850 KB)",
  },
];

// DR Drill Records Data
const drDrillRecords = [
  {
    id: "DR-2026-Q1",
    drillType: "Full System Recovery Test",
    scheduledDate: "2026-03-15",
    actualDate: "Not Conducted",
    status: "Overdue",
    rtoTarget: "4 hours",
    rtoActual: "-",
    rpoTarget: "15 minutes",
    rpoActual: "-",
    restorationDuration: "-",
    conductedBy: "-",
    issues: "Drill pending - 13 days overdue",
    complianceScore: 0,
  },
  {
    id: "DR-2025-Q4",
    drillType: "Full System Recovery Test",
    scheduledDate: "2025-12-15",
    actualDate: "2025-12-15",
    status: "Completed",
    rtoTarget: "4 hours",
    rtoActual: "3.8 hours",
    rpoTarget: "15 minutes",
    rpoActual: "12 minutes",
    restorationDuration: "3 hours 48 minutes",
    conductedBy: "IT Team + External Vendor",
    issues: "None - All systems restored successfully",
    complianceScore: 95,
  },
  {
    id: "DR-2025-Q3",
    drillType: "Database Failover Test",
    scheduledDate: "2025-09-20",
    actualDate: "2025-09-20",
    status: "Completed",
    rtoTarget: "4 hours",
    rtoActual: "4.2 hours",
    rpoTarget: "15 minutes",
    rpoActual: "18 minutes",
    restorationDuration: "4 hours 12 minutes",
    conductedBy: "IT Team",
    issues: "Minor delay in DNS propagation - Documented for future improvement",
    complianceScore: 88,
  },
  {
    id: "DR-2025-Q2",
    drillType: "Application Recovery Test",
    scheduledDate: "2025-06-18",
    actualDate: "2025-06-18",
    status: "Completed",
    rtoTarget: "4 hours",
    rtoActual: "3.5 hours",
    rpoTarget: "15 minutes",
    rpoActual: "10 minutes",
    restorationDuration: "3 hours 30 minutes",
    conductedBy: "IT Team",
    issues: "None - Excellent performance",
    complianceScore: 98,
  },
];

export function AuditGovernanceConsole() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("activity");
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#2955A0] rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Audit & Governance Console</h1>
              <p className="text-xs text-slate-600 mt-0.5">Comprehensive audit trail, version control, and compliance monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1.5 font-mono font-semibold text-xs">
              Session: ADM-2026-04-07-14:32
            </Badge>
            <PageExportMenu
              pageTitle="Audit & Governance Console"
              contentRef={pageRef}
              label="Export Audit Logs"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100 border-2 border-gray-300">
          <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:border-2" style={{ borderColor: activeTab === 'activity' ? '#2955A0' : 'transparent' }}>
            <Activity className="w-4 h-4 mr-2" />
            User Activity Log
          </TabsTrigger>
          <TabsTrigger value="versions" className="data-[state=active]:bg-white data-[state=active]:border-2" style={{ borderColor: activeTab === 'versions' ? '#2955A0' : 'transparent' }}>
            <FileText className="w-4 h-4 mr-2" />
            JMR Version History
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:border-2" style={{ borderColor: activeTab === 'email' ? '#2955A0' : 'transparent' }}>
            <Mail className="w-4 h-4 mr-2" />
            Email Dispatch Log
          </TabsTrigger>
          <TabsTrigger value="dr" className="data-[state=active]:bg-white data-[state=active]:border-2" style={{ borderColor: activeTab === 'dr' ? '#2955A0' : 'transparent' }}>
            <Database className="w-4 h-4 mr-2" />
            DR Drill Records
          </TabsTrigger>
        </TabsList>

        {/* User Activity Log Tab */}
        <TabsContent value="activity">
          <Card className="border-2 border-gray-300">
            <CardHeader className="border-b-2 border-gray-300 bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">User Activity Audit Log</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-9 w-64 border-2"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="success">Success Only</SelectItem>
                      <SelectItem value="failed">Failed Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="border-2">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="font-bold text-xs text-gray-900">Activity ID</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Timestamp</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">User</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Role</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Action</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Module</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Resource</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">IP Address</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Status</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivityLog.map((log) => (
                    <TableRow key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{log.id}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-bold text-gray-900">{log.user}</div>
                          <div className="text-gray-600">{log.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-semibold">{log.role}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">{log.action}</TableCell>
                      <TableCell className="text-xs text-gray-700">{log.module}</TableCell>
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
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="h-7">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JMR Version History Tab */}
        <TabsContent value="versions">
          <Card className="border-2 border-gray-300">
            <CardHeader className="border-b-2 border-gray-300 bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">JMR Version History & Change Tracking</CardTitle>
                <Button variant="outline" size="sm" className="border-2">
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare Versions
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="font-bold text-xs text-gray-900">Version ID</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">JMR ID</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Plant</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Version</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Timestamp</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Modified By</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Change Type</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Change Summary</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Fields</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jmrVersionHistory.map((version) => (
                    <TableRow key={version.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{version.id}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-gray-700">{version.jmrId}</TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">{version.plant}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs font-bold">{version.version}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{version.timestamp}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-bold text-gray-900">{version.modifiedBy}</div>
                          <div className="text-gray-600">{version.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            version.changeType === "Initial Submission"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                          }
                        >
                          {version.changeType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs">{version.changeSummary}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs font-bold">{version.fieldsChanged}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {version.status === "Active" ? (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Superseded</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Dispatch Log Tab */}
        <TabsContent value="email">
          <Card className="border-2 border-gray-300">
            <CardHeader className="border-b-2 border-gray-300 bg-gray-50">
              <CardTitle className="text-base font-bold">Email Dispatch & Delivery Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="font-bold text-xs text-gray-900">Email ID</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Report Name</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Report Type</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Sent By</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Sent To</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Recipients</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Timestamp</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Status</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Open Rate</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Attachments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailDispatchLog.map((email) => (
                    <TableRow key={email.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{email.id}</TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">{email.reportName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{email.reportType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">{email.sentBy}</TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs truncate">{email.sentTo}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs font-bold">{email.recipientCount}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{email.timestamp}</TableCell>
                      <TableCell className="text-center">
                        {email.deliveryStatus === "Delivered" ? (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Delivered
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Bounced
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs font-bold text-gray-900">{email.openRate}</span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">{email.attachments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DR Drill Records Tab */}
        <TabsContent value="dr">
          <Card className="border-2 border-gray-300">
            <CardHeader className="border-b-2 border-gray-300 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Disaster Recovery Drill Records</CardTitle>
                  <p className="text-xs text-gray-600 mt-1">Quarterly DR testing compliance and performance tracking</p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-2 border-red-300 px-3 py-1 font-bold">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Q1 2026 Drill Overdue (13 days)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="font-bold text-xs text-gray-900">Drill ID</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Drill Type</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Scheduled</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Actual Date</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Status</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">RTO Target</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">RTO Actual</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">RPO Target</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">RPO Actual</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Duration</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900">Conducted By</TableHead>
                    <TableHead className="font-bold text-xs text-gray-900 text-center">Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drDrillRecords.map((drill) => (
                    <TableRow
                      key={drill.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        drill.status === "Overdue" ? "bg-red-50" : ""
                      }`}
                    >
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{drill.id}</TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">{drill.drillType}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{drill.scheduledDate}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{drill.actualDate}</TableCell>
                      <TableCell className="text-center">
                        {drill.status === "Completed" ? (
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <Clock className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{drill.rtoTarget}</TableCell>
                      <TableCell
                        className={`font-mono text-xs font-bold ${
                          drill.rtoActual !== "-" && parseFloat(drill.rtoActual) > 4
                            ? "text-red-600"
                            : drill.rtoActual !== "-"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {drill.rtoActual}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{drill.rpoTarget}</TableCell>
                      <TableCell
                        className={`font-mono text-xs font-bold ${
                          drill.rpoActual !== "-" && parseFloat(drill.rpoActual) > 15
                            ? "text-red-600"
                            : drill.rpoActual !== "-"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {drill.rpoActual}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-700">{drill.restorationDuration}</TableCell>
                      <TableCell className="text-xs text-gray-700">{drill.conductedBy}</TableCell>
                      <TableCell className="text-center">
                        {drill.complianceScore > 0 ? (
                          <div>
                            <div className="text-sm font-bold text-gray-900">{drill.complianceScore}%</div>
                            {drill.complianceScore >= 90 && (
                              <Badge className="bg-green-100 text-green-800 text-xs mt-1">Excellent</Badge>
                            )}
                            {drill.complianceScore >= 80 && drill.complianceScore < 90 && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">Good</Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}