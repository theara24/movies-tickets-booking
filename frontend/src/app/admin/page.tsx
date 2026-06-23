"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
  DollarSign,
  Ticket,
  Users,
  Percent,
  TrendingUp,
  TrendingDown,
  Calendar,
  Film,
  ArrowUpRight,
  ArrowRight,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
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
  LineChart,
  Line,
} from "recharts"

const recentBookings = [
  {
    id: "BK-001",
    customer: "Sophea Chan",
    movie: "Dune: Part Two",
    seats: 3,
    amount: 75000,
    status: "completed",
    date: "2026-06-22T14:30:00Z",
  },
  {
    id: "BK-002",
    customer: "Vannak Kim",
    movie: "John Wick 5",
    seats: 2,
    amount: 50000,
    status: "completed",
    date: "2026-06-22T13:15:00Z",
  },
  {
    id: "BK-003",
    customer: "Rathana Sok",
    movie: "The Batman",
    seats: 1,
    amount: 25000,
    status: "pending",
    date: "2026-06-22T11:00:00Z",
  },
  {
    id: "BK-004",
    customer: "Srey Leap",
    movie: "Dune: Part Two",
    seats: 4,
    amount: 100000,
    status: "completed",
    date: "2026-06-21T19:45:00Z",
  },
  {
    id: "BK-005",
    customer: "Mengly Chea",
    movie: "Inside Out 2",
    seats: 2,
    amount: 42000,
    status: "refunded",
    date: "2026-06-21T18:00:00Z",
  },
]

const popularMovies = [
  { title: "Dune: Part Two", genre: "Sci-Fi", tickets: 1245, revenue: 31125000, rating: "PG-13" },
  { title: "John Wick 5", genre: "Action", tickets: 980, revenue: 24500000, rating: "R" },
  { title: "The Batman Part II", genre: "Action", tickets: 876, revenue: 21900000, rating: "PG-13" },
  { title: "Inside Out 2", genre: "Animation", tickets: 654, revenue: 13080000, rating: "PG" },
  { title: "Mad Max: Wasteland", genre: "Action", tickets: 543, revenue: 13575000, rating: "R" },
]

const upcomingShowtimes = [
  { movie: "Dune: Part Two", hall: "IMAX 1", time: "14:00", seats: 42 },
  { movie: "John Wick 5", hall: "VIP 2", time: "14:30", seats: 18 },
  { movie: "The Batman Part II", hall: "Standard 3", time: "15:00", seats: 67 },
  { movie: "Inside Out 2", hall: "Standard 1", time: "15:30", seats: 89 },
]

const weeklyData = [
  { day: "Mon", revenue: 4200000, tickets: 320 },
  { day: "Tue", revenue: 3800000, tickets: 290 },
  { day: "Wed", revenue: 5100000, tickets: 410 },
  { day: "Thu", revenue: 4600000, tickets: 380 },
  { day: "Fri", revenue: 8200000, tickets: 680 },
  { day: "Sat", revenue: 11500000, tickets: 920 },
  { day: "Sun", revenue: 9800000, tickets: 780 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold text-foreground" style={{ color: p.color }}>
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

  const s = stats?.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s your cinema performance overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button size="sm" className="bg-gold text-cinema-dark hover:bg-gold-light">
            <Activity className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </div>
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
            <Card className="bg-cinema-card border-border/60 hover:border-gold/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(s?.totalRevenue ?? 0)}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {(s?.revenueGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={(s?.revenueGrowth ?? 0) >= 0 ? "text-success" : "text-destructive"}>
                    {s?.revenueGrowth ?? 0}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60 hover:border-gold/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tickets Sold
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {s?.totalTickets?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Ticket className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {(s?.ticketsGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={(s?.ticketsGrowth ?? 0) >= 0 ? "text-success" : "text-destructive"}>
                    {s?.ticketsGrowth ?? 0}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60 hover:border-gold/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Active Customers
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {s?.totalCustomers?.toLocaleString() ?? 0}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {(s?.customersGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={(s?.customersGrowth ?? 0) >= 0 ? "text-success" : "text-destructive"}>
                    {s?.customersGrowth ?? 0}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60 hover:border-gold/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Occupancy Rate
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {s?.occupancyRate ?? 0}%
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Percent className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {(s?.occupancyGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={(s?.occupancyGrowth ?? 0) >= 0 ? "text-success" : "text-destructive"}>
                    {s?.occupancyGrowth ?? 0}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-cinema-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Revenue Overview</CardTitle>
              <CardDescription>Daily revenue and ticket sales for the last 30 days</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                Revenue
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Tickets
              </span>
            </div>
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
                      <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis
                      dataKey="date"
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => formatDate(v, "short")}
                    />
                    <YAxis
                      yAxisId="revenue"
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      yAxisId="tickets"
                      orientation="right"
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      hide
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f5a623"
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="tickets"
                      type="monotone"
                      dataKey="tickets"
                      stroke="#60a5fa"
                      fillOpacity={1}
                      fill="url(#ticketGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Occupancy by Showtime</CardTitle>
            <CardDescription>Average seat occupancy across all halls</CardDescription>
          </CardHeader>
          <CardContent>
            {occupancyLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData?.data ?? []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      dataKey="showtime"
                      type="category"
                      stroke="#9e9eb8"
                      tick={{ fontSize: 11 }}
                      width={50}
                    />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                            <p className="text-sm text-foreground font-semibold">
                              {payload[0].payload.showtime} - {payload[0].value}%
                            </p>
                          </div>
                        ) : null
                      }
                    />
                    <Bar
                      dataKey="rate"
                      fill="#f5a623"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                      background={{ fill: "#2a2a3e" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-cinema-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Recent Bookings</CardTitle>
              <CardDescription>Latest 5 booking transactions</CardDescription>
            </div>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-wider">Booking</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider hidden md:table-cell">Movie</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-right">Amount</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-gold">{booking.id}</TableCell>
                    <TableCell className="text-sm text-foreground">{booking.customer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{booking.movie}</TableCell>
                    <TableCell className="text-sm text-foreground text-right font-medium">
                      {formatCurrency(booking.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          booking.status === "completed"
                            ? "gold"
                            : booking.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Upcoming Showtimes</CardTitle>
              <CardDescription>Next 4 scheduled screenings</CardDescription>
            </div>
            <Link href="/admin/showtimes">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShowtimes.map((showtime, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold shrink-0">
                      <Film className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{showtime.movie}</p>
                      <p className="text-xs text-muted-foreground">
                        {showtime.hall} &middot; {showtime.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{showtime.seats} seats</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-gold">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-cinema-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Top Movies by Ticket Sales</CardTitle>
              <CardDescription>Most popular movies this period</CardDescription>
            </div>
            <Link href="/admin/movies">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ticketsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase tracking-wider">Movie</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Tickets Sold</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Revenue</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(ticketSales?.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    (ticketSales?.data ?? []).map((sale) => (
                      <TableRow key={sale.movieId}>
                        <TableCell className="font-medium text-foreground">{sale.movieTitle}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {sale.ticketsSold.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(sale.revenue)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gold transition-all"
                                style={{ width: `${Math.min(sale.occupancyRate, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{sale.occupancyRate}%</span>
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

        <Card className="lg:col-span-3 bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">This Week</CardTitle>
            <CardDescription>Revenue and ticket trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
                  <XAxis dataKey="day" stroke="#9e9eb8" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#9e9eb8"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    hide
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f5a623"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f5a623" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/40 p-3 text-center">
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(weeklyData.reduce((a, b) => a + b.revenue, 0))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total This Week</p>
              </div>
              <div className="rounded-lg border border-border/40 p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {weeklyData.reduce((a, b) => a + b.tickets, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Tickets This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
