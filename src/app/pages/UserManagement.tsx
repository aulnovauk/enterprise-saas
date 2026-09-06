import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Users, Shield, UserPlus, Edit, Trash2 } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@eesl.gov.in",
    role: "Admin",
    department: "IT & Operations",
    lastLogin: "2026-02-28 09:15",
    status: "active",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@eesl.gov.in",
    role: "Plant Manager",
    department: "Operations",
    lastLogin: "2026-02-28 08:30",
    status: "active",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@eesl.gov.in",
    role: "Data Analyst",
    department: "Analytics",
    lastLogin: "2026-02-27 17:45",
    status: "active",
  },
  {
    id: 4,
    name: "Robert Wilson",
    email: "robert.wilson@eesl.gov.in",
    role: "Viewer",
    department: "Finance",
    lastLogin: "2026-02-26 14:20",
    status: "active",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "sarah.johnson@eesl.gov.in",
    role: "Plant Manager",
    department: "Operations",
    lastLogin: "2026-02-20 11:30",
    status: "inactive",
  },
];

const roles = [
  { name: "Admin", description: "Full system access and configuration", users: 2 },
  { name: "Plant Manager", description: "Manage plant data and operations", users: 8 },
  { name: "Data Analyst", description: "View and analyze all data", users: 5 },
  { name: "Viewer", description: "Read-only access to reports", users: 12 },
];

export function UserManagement() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b-2 border-slate-200 shadow-sm shrink-0 z-20 sticky top-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2955A0] rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">User Management</h1>
                <p className="text-xs text-slate-600 mt-0.5">Manage users, roles, and access permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="h-7 px-3 text-xs text-white" style={{ backgroundColor: "#2955A0" }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">27</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Roles</p>
                <p className="text-2xl font-semibold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base font-semibold">User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Roles & Permissions</CardTitle>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Configure Roles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{role.name}</h4>
                  <Badge variant="secondary">{role.users} users</Badge>
                </div>
                <p className="text-xs text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
