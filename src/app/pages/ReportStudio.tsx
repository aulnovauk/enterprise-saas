import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import {
  LayoutDashboard,
  Database,
  GripVertical,
  Plus,
  Trash2,
  BarChart3,
  LineChart,
  PieChart,
  Table as TableIcon,
  Download,
  Save,
  Calendar,
  Mail,
  Settings,
  Filter,
  Calculator,
  Eye,
  EyeOff,
  Play,
  Copy,
  FileSpreadsheet,
  FileText,
  FileCode2,
} from "lucide-react";

// Available data fields
const dataFields = [
  {
    category: "Plant Information",
    fields: [
      { id: "plant_name", label: "Plant Name", type: "dimension", icon: "text" },
      { id: "plant_capacity", label: "Plant Capacity (MW)", type: "measure", icon: "number" },
      { id: "state", label: "State", type: "dimension", icon: "text" },
      { id: "cluster", label: "Cluster", type: "dimension", icon: "text" },
      { id: "vendor", label: "Vendor", type: "dimension", icon: "text" },
      { id: "client", label: "Client", type: "dimension", icon: "text" },
    ],
  },
  {
    category: "Generation Data",
    fields: [
      { id: "generation_actual", label: "Actual Generation (MWh)", type: "measure", icon: "number" },
      { id: "generation_expected", label: "Expected Generation (MWh)", type: "measure", icon: "number" },
      { id: "generation_variance", label: "Generation Variance (%)", type: "measure", icon: "number" },
    ],
  },
  {
    category: "Performance KPIs",
    fields: [
      { id: "cuf", label: "CUF (%)", type: "measure", icon: "number" },
      { id: "pr", label: "Performance Ratio (%)", type: "measure", icon: "number" },
      { id: "plant_availability", label: "Plant Availability (%)", type: "measure", icon: "number" },
      { id: "grid_availability", label: "Grid Availability (%)", type: "measure", icon: "number" },
    ],
  },
  {
    category: "Financial Data",
    fields: [
      { id: "revenue", label: "Revenue (₹)", type: "measure", icon: "number" },
      { id: "ld_exposure", label: "LD Exposure (₹)", type: "measure", icon: "number" },
      { id: "tariff", label: "Tariff (₹/kWh)", type: "measure", icon: "number" },
    ],
  },
  {
    category: "Time Dimensions",
    fields: [
      { id: "month", label: "Month", type: "dimension", icon: "date" },
      { id: "quarter", label: "Quarter", type: "dimension", icon: "date" },
      { id: "financial_year", label: "Financial Year", type: "dimension", icon: "date" },
    ],
  },
];

// Sample data for preview
const sampleTableData = [
  { plant: "Sakri Solar Park", state: "Maharashtra", generation: "4,105", cuf: "18.6%", pr: "78.8%", availability: "96.2%" },
  { plant: "Osmanabad Solar Plant", state: "Maharashtra", generation: "10,850", cuf: "22.1%", pr: "77.5%", availability: "93.8%" },
  { plant: "Latur Solar Station", state: "Maharashtra", generation: "22,450", cuf: "22.3%", pr: "78.2%", availability: "94.5%" },
  { plant: "Beed Solar Park", state: "Maharashtra", generation: "12,320", cuf: "24.5%", pr: "80.2%", availability: "98.1%" },
  { plant: "Ahmednagar Solar Plant", state: "Maharashtra", generation: "6,785", cuf: "23.5%", pr: "79.8%", availability: "97.3%" },
];

// Selected fields for report
const selectedFields = [
  { id: "plant_name", label: "Plant Name", aggregation: "None" },
  { id: "state", label: "State", aggregation: "None" },
  { id: "generation_actual", label: "Actual Generation", aggregation: "Sum" },
  { id: "cuf", label: "CUF", aggregation: "Weighted Avg" },
  { id: "pr", label: "Performance Ratio", aggregation: "Avg" },
  { id: "plant_availability", label: "Plant Availability", aggregation: "Avg" },
];

// Chart types
const chartTypes = [
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "line", label: "Line Chart", icon: LineChart },
  { id: "pie", label: "Pie Chart", icon: PieChart },
  { id: "table", label: "Table", icon: TableIcon },
];

export function ReportStudio() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [selectedChart, setSelectedChart] = useState("bar");
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#2955A0] rounded-lg">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Report Studio</h1>
              <p className="text-xs text-slate-600 mt-0.5">Enterprise-grade analytics for solar governance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Database className="w-3 h-3 mr-1" />
              Live Data Connected
            </Badge>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Data Fields & Configuration */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Data Fields</h2>
            <p className="text-xs text-gray-600">Drag fields to workspace</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {dataFields.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.fields.map((field) => (
                      <div
                        key={field.id}
                        className="group p-2 rounded bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 cursor-move transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">{field.label}</div>
                            <Badge
                              variant={field.type === "measure" ? "default" : "secondary"}
                              className={`text-xs mt-1 ${
                                field.type === "measure"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {field.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* KPI Selector */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">Quick KPI Templates</Label>
            <Select defaultValue="custom">
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Report</SelectItem>
                <SelectItem value="generation">Generation Analysis</SelectItem>
                <SelectItem value="performance">Performance Dashboard</SelectItem>
                <SelectItem value="financial">Financial Summary</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CENTER WORKSPACE - Preview Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Workspace Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "chart")}>
                  <TabsList>
                    <TabsTrigger value="table" className="text-xs">
                      <TableIcon className="w-4 h-4 mr-1" />
                      Table View
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="text-xs">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Chart View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-600">Group By:</Label>
                  <Select defaultValue="state">
                    <SelectTrigger className="w-32 text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="plant">Plant</SelectItem>
                      <SelectItem value="cluster">Cluster</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  Run Query
                </Button>
              </div>
            </div>
          </div>

          {/* Selected Fields Bar */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold text-gray-700">Selected Fields ({selectedFields.length})</Label>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add Field
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2 bg-white border border-blue-300 rounded px-3 py-1">
                  <GripVertical className="w-3 h-3 text-gray-400 cursor-move" />
                  <span className="text-xs font-medium text-gray-900">{field.label}</span>
                  {field.aggregation !== "None" && (
                    <Badge variant="secondary" className="text-xs">
                      {field.aggregation}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
                    <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview Canvas */}
          <div className="flex-1 overflow-auto p-6">
            <Card className="border-2 border-gray-300 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-base font-semibold">
                  {viewMode === "table" ? "Data Table Preview" : "Chart Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {viewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="font-semibold text-xs">Plant Name</TableHead>
                          <TableHead className="font-semibold text-xs">State</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Generation (MWh)</TableHead>
                          <TableHead className="font-semibold text-xs text-right">CUF (%)</TableHead>
                          <TableHead className="font-semibold text-xs text-right">PR (%)</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Availability (%)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleTableData.map((row, idx) => (
                          <TableRow key={idx} className="hover:bg-gray-50">
                            <TableCell className="text-xs font-semibold text-gray-900">{row.plant}</TableCell>
                            <TableCell className="text-xs text-gray-700">{row.state}</TableCell>
                            <TableCell className="text-xs font-mono font-bold text-blue-600 text-right">
                              {row.generation}
                            </TableCell>
                            <TableCell className="text-xs font-mono text-gray-900 text-right">{row.cuf}</TableCell>
                            <TableCell className="text-xs font-mono text-gray-900 text-right">{row.pr}</TableCell>
                            <TableCell className="text-xs font-mono text-gray-900 text-right">
                              {row.availability}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-blue-50 font-semibold border-t-2 border-blue-300">
                          <TableCell className="text-xs font-bold text-gray-900" colSpan={2}>
                            Total / Average
                          </TableCell>
                          <TableCell className="text-xs font-mono font-bold text-blue-600 text-right">56,510</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-gray-900 text-right">21.5%</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-gray-900 text-right">78.1%</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-gray-900 text-right">94.8%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-semibold text-gray-700 mb-2">Chart Preview</p>
                      <p className="text-xs text-gray-600">
                        Select chart type from right panel to visualize data
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT PANEL - Filters & Configuration */}
        {showFilters && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filters & Configuration
              </h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Filter Controls */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Data Filters
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Plant</Label>
                      <Select>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="All Plants" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Plants</SelectItem>
                          <SelectItem value="plantA">Sakri Solar Park</SelectItem>
                          <SelectItem value="plantB">Osmanabad Solar Plant</SelectItem>
                          <SelectItem value="plantC">Latur Solar Station</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">State</Label>
                      <Select>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          <SelectItem value="western">Western Maharashtra</SelectItem>
                          <SelectItem value="vidarbha">Vidarbha Region</SelectItem>
                          <SelectItem value="marathwada">Marathwada Region</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Vendor</Label>
                      <Select>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="All Vendors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Vendors</SelectItem>
                          <SelectItem value="vendor1">Vendor A</SelectItem>
                          <SelectItem value="vendor2">Vendor B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Client</Label>
                      <Select>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="All Clients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Clients</SelectItem>
                          <SelectItem value="eesl">EESL</SelectItem>
                          <SelectItem value="seci">SECI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Cluster</Label>
                      <Select>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="All Clusters" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Clusters</SelectItem>
                          <SelectItem value="north">North Cluster</SelectItem>
                          <SelectItem value="south">South Cluster</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Financial Year</Label>
                      <Select defaultValue="fy2026">
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fy2026">FY 2025-26</SelectItem>
                          <SelectItem value="fy2025">FY 2024-25</SelectItem>
                          <SelectItem value="fy2024">FY 2023-24</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">Date Range</Label>
                      <div className="space-y-2">
                        <Input type="date" className="text-xs" defaultValue="2026-02-01" />
                        <Input type="date" className="text-xs" defaultValue="2026-02-28" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Chart Type Selector */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Visualization Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((chart) => {
                      const Icon = chart.icon;
                      return (
                        <button
                          key={chart.id}
                          onClick={() => setSelectedChart(chart.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedChart === chart.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 bg-white"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 mx-auto mb-1 ${
                              selectedChart === chart.id ? "text-blue-600" : "text-gray-600"
                            }`}
                          />
                          <div className="text-xs font-medium text-gray-900">{chart.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Aggregation Logic Builder */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Aggregation Logic
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium text-gray-900">Generation Total</Label>
                        <Badge variant="secondary" className="text-xs">Sum</Badge>
                      </div>
                      <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200">
                        SUM(generation_actual)
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium text-gray-900">CUF Average</Label>
                        <Badge variant="secondary" className="text-xs">Weighted Avg</Badge>
                      </div>
                      <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200">
                        SUM(generation) / SUM(capacity × hours)
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Custom Formula
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Display Options */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Display Options
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Show Totals Row</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Show Data Labels</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Color by Status</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION - Export & Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Export Options */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">Export Options</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-1 text-green-600" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1 text-red-600" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileCode2 className="w-4 h-4 mr-1 text-blue-600" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-1 text-blue-600" />
                  DOCX
                </Button>
              </div>
            </div>

            <Separator orientation="vertical" className="h-12" />

            {/* Template & Scheduling */}
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">Report Management</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save Template
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule MIS
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Email Config
                </Button>
              </div>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Email Distribution Modal placeholder */}
    </div>
  );
}
