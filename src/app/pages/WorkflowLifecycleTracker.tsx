import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  FileText,
  Send,
  CheckCircle,
  Lock,
  FileCheck,
  BarChart,
  Clock,
  User,
  MessageSquare,
  CheckSquare,
  XCircle,
  RotateCcw,
  AlertCircle,
  Edit,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// Workflow stages
const workflowStages = [
  {
    id: "draft",
    label: "Draft",
    icon: FileText,
    status: "completed",
    timestamp: "2026-02-27 10:30:00",
    user: "Amit Patel",
    role: "Plant Manager",
    comments: "Initial JMR created with all mandatory fields",
    color: "bg-gray-500",
  },
  {
    id: "submitted",
    label: "Submitted",
    icon: Send,
    status: "completed",
    timestamp: "2026-02-27 16:45:00",
    user: "Amit Patel",
    role: "Plant Manager",
    comments: "JMR submitted for review. All validation checks passed.",
    color: "bg-blue-500",
  },
  {
    id: "checked",
    label: "Checked",
    icon: CheckSquare,
    status: "completed",
    timestamp: "2026-02-28 09:20:00",
    user: "Neha Singh",
    role: "Data Auditor",
    comments: "Data verification completed. Minor discrepancy in Grid Outage Hours noted and corrected.",
    color: "bg-purple-500",
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircle,
    status: "active",
    timestamp: "2026-02-28 14:30:00",
    user: "Priya Sharma",
    role: "Approval Authority",
    comments: "",
    color: "bg-green-500",
  },
  {
    id: "locked",
    label: "Locked",
    icon: Lock,
    status: "pending",
    timestamp: "",
    user: "",
    role: "",
    comments: "",
    color: "bg-orange-500",
  },
  {
    id: "reported",
    label: "Reported",
    icon: BarChart,
    status: "pending",
    timestamp: "",
    user: "",
    role: "",
    comments: "",
    color: "bg-indigo-500",
  },
];

// JMR Data Summary
const jmrData = {
  id: "JMR-2026-02-003",
  plant: "Latur Solar Station Solar Park",
  capacity: "50 MW",
  month: "February 2026",
  submittedBy: "Amit Patel",
  submittedDate: "2026-02-27 16:45:00",
  currentStage: "Approved",
  version: "v2.1",
  
  keyMetrics: [
    { parameter: "Actual Generation", value: "4,105 MWh", change: "+5 MWh", version: "v2.1" },
    { parameter: "Capacity Utilization Factor", value: "18.6%", change: "No change", version: "v2.1" },
    { parameter: "Plant Availability", value: "94.5%", change: "+0.3%", version: "v2.1" },
    { parameter: "Performance Ratio", value: "78.2%", change: "No change", version: "v2.1" },
    { parameter: "Grid Availability", value: "97.2%", change: "No change", version: "v2.1" },
    { parameter: "Grid Outage Hours", value: "10.5 hours", change: "+2.5 hours", version: "v2.1" },
  ],
};

// Approval notes history
const approvalNotes = [
  {
    id: 1,
    stage: "Checked",
    user: "Neha Singh",
    role: "Data Auditor",
    timestamp: "2026-02-28 09:20:00",
    action: "Data Verified",
    note: "Verified all generation data against SCADA logs. Found discrepancy in Grid Outage Hours (originally 8.0, corrected to 10.5 based on substation logs). Requested resubmission with correction.",
    status: "info",
  },
  {
    id: 2,
    stage: "Submitted",
    user: "Amit Patel",
    role: "Plant Manager",
    timestamp: "2026-02-28 11:15:00",
    action: "Resubmitted",
    note: "Grid Outage Hours corrected to 10.5 hours. Updated Generation value from 4,100 to 4,105 MWh after final meter reading reconciliation. Version updated to v2.1.",
    status: "success",
  },
];

// Version comparison data
const versionComparison = [
  { field: "Actual Generation", v20: "4,100 MWh", v21: "4,105 MWh", changed: true },
  { field: "CUF", v20: "18.6%", v21: "18.6%", changed: false },
  { field: "Plant Availability", v20: "94.2%", v21: "94.5%", changed: true },
  { field: "Performance Ratio", v20: "78.2%", v21: "78.2%", changed: false },
  { field: "Grid Availability", v20: "97.2%", v21: "97.2%", changed: false },
  { field: "Grid Outage Hours", v20: "8.0 hours", v21: "10.5 hours", changed: true },
  { field: "Irradiation", v20: "5.3 kWh/m²", v21: "5.3 kWh/m²", changed: false },
  { field: "Module Temperature", v20: "32.5°C", v21: "32.5°C", changed: false },
];

// Audit timeline
const auditTimeline = [
  {
    id: 8,
    timestamp: "2026-02-28 14:30:00",
    event: "Pending Approval",
    user: "Priya Sharma",
    description: "Awaiting final approval from Approval Authority",
    type: "pending",
  },
  {
    id: 7,
    timestamp: "2026-02-28 11:15:00",
    event: "JMR Resubmitted",
    user: "Amit Patel",
    description: "Version v2.1 submitted with corrections",
    type: "action",
  },
  {
    id: 6,
    timestamp: "2026-02-28 09:35:00",
    event: "Data Modified",
    user: "Amit Patel",
    description: "Updated Grid Outage Hours: 8.0 → 10.5 hours",
    type: "modification",
  },
  {
    id: 5,
    timestamp: "2026-02-28 09:32:00",
    event: "Data Modified",
    user: "Amit Patel",
    description: "Updated Generation: 4,100 → 4,105 MWh",
    type: "modification",
  },
  {
    id: 4,
    timestamp: "2026-02-28 09:20:00",
    event: "Verification Issues Found",
    user: "Neha Singh",
    description: "Discrepancy in Grid Outage Hours detected during audit",
    type: "warning",
  },
  {
    id: 3,
    timestamp: "2026-02-28 08:45:00",
    event: "Checking Started",
    user: "Neha Singh",
    description: "Data verification process initiated",
    type: "action",
  },
  {
    id: 2,
    timestamp: "2026-02-27 16:45:00",
    event: "JMR Submitted",
    user: "Amit Patel",
    description: "Version v2.0 submitted for review",
    type: "action",
  },
  {
    id: 1,
    timestamp: "2026-02-27 10:30:00",
    event: "JMR Draft Created",
    user: "Amit Patel",
    description: "Initial draft created with baseline data",
    type: "info",
  },
];

// Data change history
const dataChangeHistory = [
  { field: "Grid Outage Hours", oldValue: "8.0 hours", newValue: "10.5 hours", timestamp: "2026-02-28 09:35:00", user: "Amit Patel" },
  { field: "Actual Generation", oldValue: "4,100 MWh", newValue: "4,105 MWh", timestamp: "2026-02-28 09:32:00", user: "Amit Patel" },
  { field: "Plant Availability", oldValue: "94.2%", newValue: "94.5%", timestamp: "2026-02-28 09:30:00", user: "Amit Patel" },
];

export function WorkflowLifecycleTracker() {
  const [approvalComment, setApprovalComment] = useState("");
  const [showVersionComparison, setShowVersionComparison] = useState(true);

  const currentStageIndex = workflowStages.findIndex(s => s.status === "active");
  const completedStages = workflowStages.filter(s => s.status === "completed").length;
  const totalStages = workflowStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-base font-bold text-gray-900">JMR Workflow Lifecycle Tracker</h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Monthly Joint Report governance and approval workflow management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
              {jmrData.id}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-sm">
              {jmrData.version}
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-8">

      {/* Top Horizontal Lifecycle Bar */}
      <Card className="mb-6 border-2 border-blue-300 shadow-lg">
        <CardContent className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Workflow Progress</span>
              <span className="text-xs font-semibold text-blue-600">{completedStages} of {totalStages} stages completed</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stage Cards */}
          <div className="grid grid-cols-6 gap-4">
            {workflowStages.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = stage.status === "completed";
              const isActive = stage.status === "active";
              const isPending = stage.status === "pending";

              return (
                <div key={stage.id} className="relative">
                  {/* Connector Line */}
                  {index < workflowStages.length - 1 && (
                    <div
                      className={`absolute top-8 left-[calc(50%+20px)] w-[calc(100%-40px)] h-1 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}

                  <div
                    className={`relative p-4 rounded-lg border-2 ${
                      isCompleted
                        ? "border-green-500 bg-green-50"
                        : isActive
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {/* Icon with status indicator */}
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500"
                            : isActive
                            ? "bg-blue-500 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-center mb-2">
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {isActive && (
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="secondary" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>

                    {/* Stage Label */}
                    <h3 className="text-sm font-bold text-center text-gray-900 mb-3">{stage.label}</h3>

                    {/* Details */}
                    {(isCompleted || isActive) && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-700">Timestamp</div>
                            <div className="font-mono text-gray-600">{stage.timestamp}</div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <User className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-700">User</div>
                            <div className="text-gray-900">{stage.user}</div>
                            <div className="text-gray-500">{stage.role}</div>
                          </div>
                        </div>
                        {stage.comments && (
                          <>
                            <Separator />
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-gray-700 mb-1">Comments</div>
                                <div className="text-gray-600 leading-relaxed">{stage.comments}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left/Center Panel - JMR Data & Approval */}
        <div className="col-span-8 space-y-6">
          {/* JMR Data Summary */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">JMR Data Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">{jmrData.plant}</Badge>
                  <Badge variant="secondary">{jmrData.month}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
                <div>
                  <div className="text-xs text-gray-600 mb-1">JMR ID</div>
                  <div className="text-sm font-mono font-bold text-gray-900">{jmrData.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Plant Capacity</div>
                  <div className="text-sm font-bold text-gray-900">{jmrData.capacity}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Current Stage</div>
                  <Badge className="bg-blue-100 text-blue-800">{jmrData.currentStage}</Badge>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Submitted By</div>
                  <div className="text-sm font-semibold text-gray-900">{jmrData.submittedBy}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Submitted Date</div>
                  <div className="text-sm font-mono text-gray-900">{jmrData.submittedDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Version</div>
                  <div className="text-sm font-mono font-bold text-purple-600">{jmrData.version}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Performance Metrics</h4>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">Parameter</TableHead>
                      <TableHead className="font-semibold text-xs">Value</TableHead>
                      <TableHead className="font-semibold text-xs">Change (from v2.0)</TableHead>
                      <TableHead className="font-semibold text-xs">Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jmrData.keyMetrics.map((metric, idx) => (
                      <TableRow key={idx} className="hover:bg-gray-50">
                        <TableCell className="text-xs font-semibold text-gray-900">{metric.parameter}</TableCell>
                        <TableCell className="text-sm font-mono font-bold text-blue-600">{metric.value}</TableCell>
                        <TableCell>
                          {metric.change === "No change" ? (
                            <Badge variant="secondary" className="text-xs">No change</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs">
                              <Edit className="w-3 h-3 mr-1" />
                              {metric.change}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-gray-600">{metric.version}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Approval Notes Panel */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="border-b bg-blue-50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Approval Notes & Review History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                {approvalNotes.map((note) => {
                  const statusColors = {
                    info: "border-blue-300 bg-blue-50",
                    success: "border-green-300 bg-green-50",
                    warning: "border-yellow-300 bg-yellow-50",
                  };

                  return (
                    <div key={note.id} className={`p-4 rounded-lg border-2 ${statusColors[note.status as keyof typeof statusColors]}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="bg-white text-gray-800 border border-gray-300 mb-2">{note.stage}</Badge>
                          <div className="text-xs font-semibold text-gray-900">{note.user}</div>
                          <div className="text-xs text-gray-600">{note.role}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2">{note.action}</Badge>
                          <div className="text-xs font-mono text-gray-600">{note.timestamp}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{note.note}</p>
                    </div>
                  );
                })}
              </div>

              {/* Current Approval Action */}
              <div className="p-5 border-2 border-green-300 rounded-lg bg-green-50">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Final Approval Action
                </h4>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">
                    Approval Comments (Required)
                  </label>
                  <Textarea
                    placeholder="Enter approval comments or reasons for rejection..."
                    rows={4}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 flex-1" size="lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve & Lock JMR
                  </Button>
                  <Button variant="outline" className="border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 flex-1" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Send Back for Revision
                  </Button>
                  <Button variant="destructive" className="flex-1" size="lg">
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject JMR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side-by-Side Version Comparison */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Version Comparison (v2.0 vs v2.1)</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowVersionComparison(!showVersionComparison)}>
                  {showVersionComparison ? "Hide" : "Show"} Comparison
                </Button>
              </div>
            </CardHeader>
            {showVersionComparison && (
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold text-xs">Field</TableHead>
                      <TableHead className="font-semibold text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">v2.0</Badge>
                          <span>Previous Value</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-12 text-center"></TableHead>
                      <TableHead className="font-semibold text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800 text-xs">v2.1</Badge>
                          <span>Current Value</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versionComparison.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className={item.changed ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"}
                      >
                        <TableCell className="text-xs font-semibold text-gray-900">{item.field}</TableCell>
                        <TableCell className={`text-sm font-mono ${item.changed ? "text-red-600 font-bold line-through" : "text-gray-700"}`}>
                          {item.v20}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.changed ? (
                            <ArrowRight className="w-4 h-4 text-yellow-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className={`text-sm font-mono ${item.changed ? "text-green-600 font-bold" : "text-gray-700"}`}>
                          {item.v21}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.changed ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs">
                              Modified
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Unchanged
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Sidebar - Audit Timeline */}
        <div className="col-span-4">
          <div className="space-y-6">
            {/* Audit Timeline View */}
            <Card className="border-2 border-purple-300 sticky top-6">
              <CardHeader className="border-b bg-purple-50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Audit Timeline
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">Chronological event log</p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-6 space-y-4">
                    {auditTimeline.map((event, idx) => {
                      const typeColors = {
                        pending: { bg: "bg-blue-50", border: "border-blue-300", icon: "text-blue-600" },
                        action: { bg: "bg-green-50", border: "border-green-300", icon: "text-green-600" },
                        modification: { bg: "bg-yellow-50", border: "border-yellow-300", icon: "text-yellow-600" },
                        warning: { bg: "bg-red-50", border: "border-red-300", icon: "text-red-600" },
                        info: { bg: "bg-gray-50", border: "border-gray-300", icon: "text-gray-600" },
                      };
                      const colors = typeColors[event.type as keyof typeof typeColors];

                      return (
                        <div key={event.id} className="relative">
                          {idx < auditTimeline.length - 1 && (
                            <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-300" />
                          )}
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center flex-shrink-0 relative z-10`}>
                              {event.type === "pending" && <Clock className={`w-4 h-4 ${colors.icon}`} />}
                              {event.type === "action" && <CheckCircle className={`w-4 h-4 ${colors.icon}`} />}
                              {event.type === "modification" && <Edit className={`w-4 h-4 ${colors.icon}`} />}
                              {event.type === "warning" && <AlertCircle className={`w-4 h-4 ${colors.icon}`} />}
                              {event.type === "info" && <FileText className={`w-4 h-4 ${colors.icon}`} />}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="text-xs font-mono text-gray-500 mb-1">{event.timestamp}</div>
                              <div className="text-sm font-bold text-gray-900 mb-1">{event.event}</div>
                              <div className="text-xs text-gray-700 mb-2">{event.description}</div>
                              <div className="text-xs text-gray-600">
                                <User className="w-3 h-3 inline mr-1" />
                                {event.user}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardHeader>
            </Card>

            {/* Data Change History Indicator */}
            <Card className="border-2 border-orange-300">
              <CardHeader className="border-b bg-orange-50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Edit className="w-4 h-4 text-orange-600" />
                  Data Change History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {dataChangeHistory.map((change, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded border border-orange-200">
                      <div className="text-xs font-semibold text-gray-900 mb-2">{change.field}</div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Old Value</div>
                          <div className="text-xs font-mono text-red-600 font-semibold line-through">
                            {change.oldValue}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">New Value</div>
                          <div className="text-xs font-mono text-green-600 font-semibold">
                            {change.newValue}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {change.user}
                        </div>
                        <div className="font-mono">{change.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
