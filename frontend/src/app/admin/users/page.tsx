"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, Shield, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { users } from "@/services/api/mock-data"
import { formatDate } from "@/lib/utils"
import type { User, UserRole } from "@/types"
import { toast } from "@/hooks/use-toast"

const roleColors: Record<UserRole, string> = {
  customer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  staff: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  admin: "bg-gold/10 text-gold border-gold/20",
  super_admin: "bg-destructive/10 text-destructive border-destructive/20",
}

const allPermissions = [
  "View Dashboard",
  "Manage Movies",
  "Manage Cinemas",
  "Manage Showtimes",
  "Manage Bookings",
  "Manage Customers",
  "Manage Payments",
  "Manage Promotions",
  "Manage Food & Beverage",
  "Manage Staff",
  "View Reports",
  "Manage Users",
  "Manage Settings",
]

const rolePermissions: Record<UserRole, string[]> = {
  super_admin: allPermissions,
  admin: [...allPermissions].filter((p) => p !== "Manage Users"),
  staff: ["View Dashboard", "Manage Movies", "Manage Cinemas", "Manage Showtimes", "Manage Bookings"],
  customer: [],
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== "all" && u.role !== roleFilter) return false
    return true
  })

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    toast({ title: "Role updated", description: `User role changed to ${newRole}`, variant: "success" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-cinema-dark">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 bg-cinema-dark border-border/60"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-cinema-dark border-border/60 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground">{user.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${roleColors[user.role]}`}>
                          {user.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Select defaultValue={user.role} onValueChange={(v) => handleRoleChange(user.id, v as UserRole)}>
                          <SelectTrigger className="bg-cinema-dark border-border/60 h-8 w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">Role-based access control overview</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Permission</TableHead>
                      <TableHead className="text-center">Super Admin</TableHead>
                      <TableHead className="text-center">Admin</TableHead>
                      <TableHead className="text-center">Staff</TableHead>
                      <TableHead className="text-center">Customer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPermissions.map((perm) => (
                      <TableRow key={perm}>
                        <TableCell className="text-foreground">{perm}</TableCell>
                        {(["super_admin", "admin", "staff", "customer"] as UserRole[]).map((role) => (
                          <TableCell key={role} className="text-center">
                            {rolePermissions[role].includes(perm) ? (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">
                                ✓
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">
                                —
                              </Badge>
                            )}
                          </TableCell>
                        ))}
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
  )
}
