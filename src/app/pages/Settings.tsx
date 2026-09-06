import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from "lucide-react";

export function Settings() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <SettingsIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">Settings</h1>
                <p className="text-xs text-slate-600 mt-0.5">Configure system preferences and application settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data & Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2">Organization Name</Label>
                  <Input defaultValue="Energy Efficiency Services Limited (EESL)" />
                </div>
                <div>
                  <Label className="mb-2">Time Zone</Label>
                  <Input defaultValue="Asia/Kolkata (IST)" />
                </div>
                <div>
                  <Label className="mb-2">Default Currency</Label>
                  <Input defaultValue="INR (₹)" />
                </div>
                <div>
                  <Label className="mb-2">Date Format</Label>
                  <Input defaultValue="YYYY-MM-DD" />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Display Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Compact View</p>
                      <p className="text-xs text-gray-600">Show more data in tables</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Show Dashboard Tooltips</p>
                      <p className="text-xs text-gray-600">Display helpful hints on charts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2955A0" }} className="text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Daily Summary Report</p>
                      <p className="text-xs text-gray-600">Receive daily performance summary at 6:00 AM</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Outage Alerts</p>
                      <p className="text-xs text-gray-600">Immediate notification on plant outages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Monthly Reports</p>
                      <p className="text-xs text-gray-600">Monthly performance and compliance reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">LD Notifications</p>
                      <p className="text-xs text-gray-600">Alerts when LD thresholds are crossed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data Upload Confirmations</p>
                      <p className="text-xs text-gray-600">Notify on successful JMR uploads</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Integration Sync Failures</p>
                      <p className="text-xs text-gray-600">Alert on ERP integration errors</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2955A0" }} className="text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Password Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enforce Strong Passwords</p>
                      <p className="text-xs text-gray-600">Minimum 8 characters with special characters</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Require 2FA for all users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                      <p className="text-xs text-gray-600">Auto logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Access Control</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">IP Whitelisting</p>
                      <p className="text-xs text-gray-600">Restrict access to approved IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Audit All Actions</p>
                      <p className="text-xs text-gray-600">Log all user activities for compliance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2955A0" }} className="text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Data & Storage Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Retention</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2">JMR Data Retention (Years)</Label>
                    <Input type="number" defaultValue="7" />
                  </div>
                  <div>
                    <Label className="mb-2">Audit Log Retention (Years)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label className="mb-2">Report Archive (Years)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label className="mb-2">Max File Upload Size (MB)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Backup & Export</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Automatic Daily Backup</p>
                      <p className="text-xs text-gray-600">Backup all data at 2:00 AM daily</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enable Data Export</p>
                      <p className="text-xs text-gray-600">Allow users to export data in CSV/Excel</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2955A0" }} className="text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
