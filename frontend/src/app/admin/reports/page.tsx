"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Download, BarChart3, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRevenueReport, getTicketReport, getOccupancyReport } from "@/services/api/report.service"
import { formatCurrency } from "@/lib/utils"
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.name === "revenue" ? formatCurrency(p.value) : p.name === "tickets" ? p.value : `${p.value}%`}
        </p>
      ))}
    </div>
  )
}

function PeriodSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-cinema-dark border-border/60 w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">7 Days</SelectItem>
        <SelectItem value="30d">30 Days</SelectItem>
        <SelectItem value="90d">90 Days</SelectItem>
        <SelectItem value="1y">1 Year</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("30d")

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenue-report", period],
    queryFn: () => getRevenueReport(),
  })

  const { data: ticketData, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket-report"],
    queryFn: () => getTicketReport(),
  })

  const { data: occupancyData, isLoading: occupancyLoading } = useQuery({
    queryKey: ["occupancy-report"],
    queryFn: () => getOccupancyReport(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports</h2>
          <p className="text-muted-foreground">Analytics and performance data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> CSV</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-cinema-dark">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Revenue Trend</CardTitle>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData?.data ?? []}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                      <XAxis dataKey="date" stroke="#9e9eb8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#9e9eb8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#f5a623" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Tickets Sold by Movie</CardTitle>
            </CardHeader>
            <CardContent>
              {ticketLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketData?.data ?? []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
                      <XAxis type="number" stroke="#9e9eb8" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="movieTitle" stroke="#9e9eb8" tick={{ fontSize: 10 }} width={140} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="ticketsSold" fill="#f5a623" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy">
          <Card className="bg-cinema-card border-border/60">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Occupancy Rate by Showtime</CardTitle>
            </CardHeader>
            <CardContent>
              {occupancyLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupancyData?.data ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
                      <XAxis dataKey="showtime" stroke="#9e9eb8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#9e9eb8" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rate" fill="#f5a623" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
