"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Search, Eye, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers } from "@/services/api/customer.service"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { User } from "@/types"

const tierColors: Record<User["loyaltyTier"], string> = {
  bronze: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  silver: "bg-slate-300/10 text-slate-300 border-slate-300/20",
  gold: "bg-gold/10 text-gold border-gold/20",
  platinum: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: () => getCustomers({ search: search || undefined }),
  })

  const customers = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>
        <p className="text-muted-foreground">View and manage your customers</p>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-9 bg-cinema-dark border-border/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Loyalty Tier</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-foreground">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(customer.loyaltyPoints * 100)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${tierColors[customer.loyaltyTier]}`}>
                        {customer.loyaltyTier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
