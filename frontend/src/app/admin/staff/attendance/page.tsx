"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { staffMembers } from "@/services/api/mock-data"

const statusColors: Record<string, string> = {
  present: "bg-success/10 text-success border-success/20",
  absent: "bg-destructive/10 text-destructive border-destructive/20",
  late: "bg-warning/10 text-warning border-warning/20",
  leave: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

const statusIcons: Record<string, React.ElementType> = {
  present: CheckCircle,
  absent: XCircle,
  late: AlertCircle,
  leave: CalendarDays,
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/staff">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Staff Attendance</h2>
          <p className="text-muted-foreground">View and manage staff attendance</p>
        </div>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                className="bg-cinema-dark border-border/60 w-44"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 ml-auto text-sm">
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-success" /> Present</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-warning" /> Late</span>
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-destructive" /> Absent</span>
              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-blue-400" /> Leave</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((member) => {
                const todayAttendance = member.attendance.find((a) => a.date === selectedDate)
                const status = todayAttendance?.status ?? "absent"
                const StatusIcon = statusIcons[status]
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-foreground">{member.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.user.name}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.position}</TableCell>
                    <TableCell className="text-foreground">{todayAttendance?.checkIn ?? "—"}</TableCell>
                    <TableCell className="text-foreground">{todayAttendance?.checkOut ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[status]}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
