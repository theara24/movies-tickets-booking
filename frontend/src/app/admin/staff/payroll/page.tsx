"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, CheckCircle, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { staffMembers } from "@/services/api/mock-data"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { Payroll } from "@/types"

const months = [
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
]

const mockPayroll: Payroll[] = staffMembers.map((s, i) => ({
  staffId: s.id,
  staff: s,
  month: "2026-06",
  baseSalary: s.salary * 4000,
  bonus: i % 2 === 0 ? 200 * 4000 : 0,
  deductions: s.salary * 4000 * 0.05,
  netSalary: s.salary * 4000 + (i % 2 === 0 ? 200 * 4000 : 0) - s.salary * 4000 * 0.05,
  status: i % 3 === 0 ? "paid" : "pending",
}))

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-06")

  const payrollData = mockPayroll.filter((p) => p.month === selectedMonth)
  const totalPayroll = payrollData.reduce((sum, p) => sum + p.netSalary, 0)
  const paidCount = payrollData.filter((p) => p.status === "paid").length
  const pendingCount = payrollData.filter((p) => p.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/staff">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Payroll</h2>
            <p className="text-muted-foreground">Manage staff salaries and payments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
            Process Payroll
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-cinema-card border-border/60">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Payroll</p>
            <p className="text-2xl font-bold text-gold mt-1">{formatCurrency(totalPayroll)}</p>
          </CardContent>
        </Card>
        <Card className="bg-cinema-card border-border/60">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Paid</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold text-success">{paidCount}</p>
              <span className="text-sm text-muted-foreground">staff</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-cinema-card border-border/60">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              <span className="text-sm text-muted-foreground">staff</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="bg-cinema-dark border-border/60 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((p) => (
                <TableRow key={p.staffId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-foreground">{p.staff.user.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{p.staff.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.staff.position}</TableCell>
                  <TableCell className="font-medium text-foreground">{formatCurrency(p.baseSalary)}</TableCell>
                  <TableCell className="text-success">{p.bonus > 0 ? formatCurrency(p.bonus) : "—"}</TableCell>
                  <TableCell className="text-destructive">{formatCurrency(p.deductions)}</TableCell>
                  <TableCell className="font-bold text-foreground">{formatCurrency(p.netSalary)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        p.status === "paid"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }`}
                    >
                      {p.status === "paid" ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Paid</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
