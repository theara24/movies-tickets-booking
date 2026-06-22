"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowLeft, CheckCircle, XCircle, Undo2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { getTransactions } from "@/services/api/payment.service"
import { formatDate, formatCurrency } from "@/lib/utils"

interface RefundRequest {
  id: string
  bookingId: string
  customer: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  date: string
}

const mockRefunds: RefundRequest[] = [
  { id: "ref-001", bookingId: "booking-003", customer: "Vireak Sorn", amount: 15000, reason: "Movie cancelled by cinema", status: "pending", date: new Date(Date.now() - 86400000).toISOString() },
  { id: "ref-002", bookingId: "booking-007", customer: "Dara Heng", amount: 8000, reason: "Duplicate payment", status: "pending", date: new Date(Date.now() - 172800000).toISOString() },
  { id: "ref-003", bookingId: "booking-011", customer: "Kolab Srey", amount: 25000, reason: "Technical issues during show", status: "approved", date: new Date(Date.now() - 259200000).toISOString() },
]

export default function RefundRequestsPage() {
  const [refunds, setRefunds] = useState(mockRefunds)

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRefunds((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)))
    toast({
      title: action === "approved" ? "Refund approved" : "Refund rejected",
      variant: action === "approved" ? "success" : "destructive",
    })
  }

  const pendingCount = refunds.filter((r) => r.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/payments">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Refund Requests</h2>
            {pendingCount > 0 && (
              <Badge variant="gold" className="text-[11px]">{pendingCount} pending</Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage customer refund requests</p>
        </div>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <Undo2 className="h-10 w-10 mx-auto mb-3" />
                    No refund requests
                  </TableCell>
                </TableRow>
              ) : (
                refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{refund.id}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{refund.bookingId}</TableCell>
                    <TableCell className="text-foreground">{refund.customer}</TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(refund.amount)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{refund.reason}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(refund.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          refund.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : refund.status === "approved"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {refund.status === "pending" && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-success hover:text-success"
                            onClick={() => handleAction(refund.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleAction(refund.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {refund.status !== "pending" && (
                        <span className="text-xs text-muted-foreground">
                          {refund.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
