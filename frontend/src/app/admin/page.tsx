"use client"

import { useQuery } from "@tanstack/react-query"
import { DollarSign, Ticket, Users, Percent, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStats, getRevenueChart, getTicketSales, getOccupancyData } from "@/services/api/dashboard.service"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  prefix,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend: number
  prefix?: string
}) {
  const isPositive = trend >= 0
  return (
    <Card className="bg-cinema-card border-border/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {prefix}
              {value}
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-gold" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-sm">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={isPositive ? "text-success" : "text-destructive"}>
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.name === "revenue" ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: () => getRevenueChart("30d"),
  })

  const { data: ticketSales, isLoading: ticketsLoading } = useQuery({
    queryKey: ["ticket-sales"],
    queryFn: getTicketSales,
  })

  const { data: occupancyData, isLoading: occupancyLoading } = useQuery({
    queryKey: ["occupancy-data"],
    queryFn: getOccupancyData,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here is your cinema performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-cinema-card border-border/60">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.data?.totalRevenue ?? 0)}
              icon={DollarSign}
              trend={stats?.data?.revenueGrowth ?? 0}
            />
            <StatCard
              title="Tickets Sold"
              value={String(stats?.data?.totalTickets ?? 0)}
              icon={Ticket}
              trend={stats?.data?.ticketsGrowth ?? 0}
            />
            <StatCard
              title="Active Customers"
              value={String(stats?.data?.totalCustomers ?? 0)}
              icon={Users}
              trend={stats?.data?.customersGrowth ?? 0}
            />
            <StatCard
              title="Occupancy Rate"
              value={`${stats?.data?.occupancyRate ?? 0}%`}
              icon={Percent}
              trend={stats?.data?.occupancyGrowth ?? 0}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData?.data ?? []}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis
                      dataKey="date"
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => formatDate(v, "short")}
                    />
                    <YAxis stroke="#9e9eb8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f5a623"
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Occupancy Rate by Showtime</CardTitle>
          </CardHeader>
          <CardContent>
            {occupancyLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData?.data ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
                    <XAxis dataKey="showtime" stroke="#9e9eb8" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" fill="#f5a623" radius={[4, 4, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Top Movies by Ticket Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {ticketsLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Occupancy Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(ticketSales?.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No ticket sales data available
                    </TableCell>
                  </TableRow>
                ) : (
                  (ticketSales?.data ?? []).map((sale) => (
                    <TableRow key={sale.movieId}>
                      <TableCell className="font-medium text-foreground">{sale.movieTitle}</TableCell>
                      <TableCell>{sale.ticketsSold.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(sale.revenue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gold transition-all"
                              style={{ width: `${Math.min(sale.occupancyRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{sale.occupancyRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
