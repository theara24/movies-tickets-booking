"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Percent, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPromotions, updatePromotion } from "@/services/api/promotion.service"
import { formatDate, formatCurrency } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { Promotion } from "@/types"

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  })

  const toggleMutation = useMutation({
    mutationFn: (promo: Promotion) => updatePromotion(promo.id, { isActive: !promo.isActive }),
    onSuccess: () => {
      toast({ title: "Promotion updated", variant: "success" })
    },
  })

  const promotions = (data?.data?.data ?? []).filter((p) =>
    !search || p.code.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Promotion Management</h2>
          <p className="text-muted-foreground">Manage discounts and promotional campaigns</p>
        </div>
        <Link href="/admin/promotions/create">
          <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </Link>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search promotions..."
              className="pl-9 bg-cinema-dark border-border/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No promotions found</p>
              <Link href="/admin/promotions/create">
                <Button variant="outline" className="mt-4">Create your first promotion</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <Badge variant="gold" className="font-mono text-[11px]">{promo.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{promo.title}</TableCell>
                    <TableCell>
                      {promo.discountType === "percentage" ? `${promo.discountValue}%` : formatCurrency(promo.discountValue)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {promo.usageCount}{promo.usageLimit > 0 ? ` / ${promo.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          promo.isActive
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={() => toggleMutation.mutate(promo)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/promotions/${promo.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
