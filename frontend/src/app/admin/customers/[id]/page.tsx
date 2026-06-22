"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Mail, Phone, Calendar, Award, Star, TrendingUp, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomer, getCustomerBookings, getCustomerLoyalty } from "@/services/api/customer.service"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"
import type { User, Booking } from "@/types"

const tierColors: Record<User["loyaltyTier"], string> = {
  bronze: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  silver: "bg-slate-300/10 text-slate-300 border-slate-300/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  platinum: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-success/10 text-success border-success/20",
}

function TierProgress({ current, tier }: { current: number; tier: string }) {
  const thresholds: Record<string, number> = { bronze: 1000, silver: 5000, gold: 15000, platinum: 0 }
  const next =
    tier === "bronze" ? "silver" : tier === "silver" ? "gold" : tier === "gold" ? "platinum" : null
  const nextThreshold = next ? thresholds[tier] : 0
  const prevThreshold =
    tier === "silver" ? 1000 : tier === "gold" ? 5000 : tier === "platinum" ? 15000 : 0
  const progress = next ? ((current - prevThreshold) / (nextThreshold - prevThreshold)) * 100 : 100

  if (!next) {
    return <p className="text-sm text-gold font-medium">Maximum tier reached!</p>
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground capitalize">{tier}</span>
        <span className="text-muted-foreground capitalize">{next}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">
        {nextThreshold - current} points to {next}
      </p>
    </div>
  )
}

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  })

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["customer-bookings", id],
    queryFn: () => getCustomerBookings(id),
    enabled: !!id,
  })

  const { data: loyaltyData, isLoading: loyaltyLoading } = useQuery({
    queryKey: ["customer-loyalty", id],
    queryFn: () => getCustomerLoyalty(id),
    enabled: !!id,
  })

  const customer = customerData?.data
  const bookings = bookingsData?.data ?? []
  const loyalty = loyaltyData?.data

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Link href="/admin/customers"><Button variant="outline" className="mt-4">Back to Customers</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Details</h2>
          <p className="text-muted-foreground">View customer information and activity</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="bg-cinema-card border-border/60">
            <CardContent className="p-6 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gold">{customer.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="outline" className={`text-[11px] ${tierColors[customer.loyaltyTier]}`}>
                  {customer.loyaltyTier}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {customer.role}
                </Badge>
              </div>
              <div className="space-y-2 mt-4 text-left">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /> {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" /> {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Joined {formatDate(customer.createdAt, "long")}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Loyalty & Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loyaltyLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : loyalty ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-gold" />
                      <span className="text-sm text-muted-foreground">Points</span>
                    </div>
                    <span className="text-lg font-bold text-gold">{loyalty.points.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(loyalty.totalSpent)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tier</span>
                    </div>
                    <Badge variant="outline" className={`text-[11px] ${tierColors[customer.loyaltyTier]}`}>
                      {loyalty.tier}
                    </Badge>
                  </div>
                  <TierProgress current={loyalty.points} tier={loyalty.tier} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No loyalty data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Booking History</CardTitle>
                <Badge variant="outline">{bookings.length} bookings</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 10).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{booking.id}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(booking.createdAt)}</TableCell>
                        <TableCell>{booking.seats.length}</TableCell>
                        <TableCell className="font-medium text-foreground">{formatCurrency(booking.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusColors[booking.status]}`}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
