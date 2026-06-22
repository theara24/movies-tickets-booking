"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Pizza, Loader2, Search, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFoodItems } from "@/services/api/food.service"
import { formatCurrency } from "@/lib/utils"
import type { FoodCategory } from "@/types"

const categories: { value: FoodCategory | "all"; label: string }[] = [
  { value: "all", label: "All Items" },
  { value: "popcorn", label: "Popcorn" },
  { value: "drinks", label: "Drinks" },
  { value: "snacks", label: "Snacks" },
  { value: "candy", label: "Candy" },
  { value: "hot_food", label: "Hot Food" },
  { value: "combo", label: "Combos" },
]

export default function AdminFoodPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["food-items", activeCategory],
    queryFn: () => getFoodItems(activeCategory !== "all" ? (activeCategory as FoodCategory) : undefined),
  })

  const items = (data?.data ?? []).filter(
    (item) => !search || item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Food & Beverage</h2>
          <p className="text-muted-foreground">Manage your menu items</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/food/inventory">
            <Button variant="outline">Inventory</Button>
          </Link>
          <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                className="pl-9 bg-cinema-dark border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
              <TabsList className="bg-cinema-dark">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Pizza className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No menu items found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-cinema-dark border border-border hover:border-gold/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                        <Pizza className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{item.description}</p>
                      </div>
                    </div>
                    <Switch checked={item.isAvailable} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gold">{formatCurrency(item.price)}</span>
                      <Badge variant="outline" className="ml-2 text-[10px]">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
