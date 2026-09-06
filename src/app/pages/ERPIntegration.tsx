import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Database, RefreshCw, CheckCircle, XCircle, Settings, PlayCircle } from "lucide-react";

const integrations = [
  {
    name: "SAP ERP",
    type: "Financial Data",
    status: "connected",
    lastSync: "2026-02-28 09:00",
    frequency: "Daily",
    recordsSynced: 1245,
  },
  {
    name: "Oracle ERP",
    type: "Procurement Data",
    status: "connected",
    lastSync: "2026-02-28 08:30",
    frequency: "Daily",
    recordsSynced: 856,
  },
  {
    name: "SCADA System",
    type: "Real-time Data",
    status: "error",
    lastSync: "2026-02-27 22:15",
    frequency: "Hourly",
    recordsSynced: 0,
  },
];

const syncHistory = [
  {
    id: 1,
    timestamp: "2026-02-28 09:00:15",
    system: "SAP ERP",
    dataType: "Financial Records",
    records: 142,
    status: "Success",
    duration: "45s",
  },
  {
    id: 2,
    timestamp: "2026-02-28 08:30:22",
    system: "Oracle ERP",
    dataType: "Procurement Data",
    records: 89,
    status: "Success",
    duration: "32s",
  },
  {
    id: 3,
    timestamp: "2026-02-27 22:15:08",
    system: "SCADA System",
    dataType: "Plant Metrics",
    records: 0,
    status: "Failed",
    duration: "0s",
  },
  {
    id: 4,
    timestamp: "2026-02-27 21:00:05",
    system: "SCADA System",
    dataType: "Plant Metrics",
    records: 2450,
    status: "Success",
    duration: "1m 23s",
  },
];

export function ERPIntegration() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">ERP Integration</h1>
                <p className="text-xs text-slate-600 mt-0.5">Manage external system integrations and data synchronization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="h-7 px-3 text-xs" style={{ backgroundColor: "#2955A0" }}>
                <Database className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Integrations</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed Syncs</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Records Synced</p>
                <p className="text-2xl font-semibold text-gray-900">2,101</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.status === "connected"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Database
                      className={`w-5 h-5 ${
                        integration.status === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{integration.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">{integration.type}</Badge>
                      <span className="text-xs text-gray-500">Last sync: {integration.lastSync}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{integration.frequency}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{integration.recordsSynced.toLocaleString()} records</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={integration.status === "connected" ? "default" : "destructive"}
                    className={
                      integration.status === "connected"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {integration.status === "connected" ? "Connected" : "Error"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Sync History</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncHistory.map((sync) => (
                <TableRow key={sync.id}>
                  <TableCell className="font-medium">{sync.timestamp}</TableCell>
                  <TableCell>{sync.system}</TableCell>
                  <TableCell>{sync.dataType}</TableCell>
                  <TableCell>{sync.records.toLocaleString()}</TableCell>
                  <TableCell>{sync.duration}</TableCell>
                  <TableCell>
                    <Badge
                      variant={sync.status === "Success" ? "default" : "destructive"}
                      className={
                        sync.status === "Success"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : ""
                      }
                    >
                      {sync.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
