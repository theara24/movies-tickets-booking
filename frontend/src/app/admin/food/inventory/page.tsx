"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Search, Package, AlertTriangle, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFoodItems } from "@/services/api/food.service"
import { formatCurrency } from "@/lib/utils"
import type { FoodCategory } from "@/types"

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  unit: string
  lastRestocked: string
}

const mockInventory: InventoryItem[] = [
  { id: "inv-001", name: "Large Popcorn", category: "popcorn", stock: 200, minStock: 50, unit: "bags", lastRestocked: "2026-06-20" },
  { id: "inv-002", name: "Medium Popcorn", category: "popcorn", stock: 150, minStock: 50, unit: "bags", lastRestocked: "2026-06-20" },
  { id: "inv-003", name: "Coca-Cola Large", category: "drinks", stock: 300, minStock: 80, unit: "bottles", lastRestocked: "2026-06-21" },
  { id: "inv-004", name: "Coca-Cola Medium", category: "drinks", stock: 45, minStock: 80, unit: "bottles", lastRestocked: "2026-06-18" },
  { id: "inv-005", name: "French Fries", category: "snacks", stock: 80, minStock: 30, unit: "portions", lastRestocked: "2026-06-21" },
  { id: "inv-006", name: "Nachos with Cheese", category: "snacks", stock: 12, minStock: 30, unit: "portions", lastRestocked: "2026-06-15" },
]

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const items = mockInventory.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/food">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Track stock levels and manage inventory</p>
        </div>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-9 bg-cinema-dark border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-cinema-dark border-border/60 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="popcorn">Popcorn</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="candy">Candy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inventory items found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const isLow = item.stock <= item.minStock
                  const isCritical = item.stock <= item.minStock * 0.5
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize">{item.category}</Badge>
                      </TableCell>
                      <TableCell className={isCritical ? "text-destructive font-medium" : isLow ? "text-warning font-medium" : ""}>
                        {item.stock} {item.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.minStock} {item.unit}</TableCell>
                      <TableCell>
                        {isCritical ? (
                          <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Critical
                          </Badge>
                        ) : isLow ? (
                          <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.lastRestocked}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="h-8">
                            <RefreshCw className="h-3 w-3 mr-1" /> Restock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
