"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Percent, Tag, Clock, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPromotions } from "@/services/api/promotion.service"
import { formatDate } from "@/lib/utils"
import type { Promotion } from "@/types"

function PromotionCardSkeleton() {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const isActive = new Date(promotion.endDate) > new Date()
  const discountLabel =
    promotion.discountType === "percentage"
      ? `${promotion.discountValue}% OFF`
      : `${promotion.discountValue.toLocaleString()} KHR OFF`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-gold/20 bg-gradient-to-br from-card to-gold/5 overflow-hidden group hover:border-gold/40 transition-colors">
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gold text-cinema-dark font-semibold">
                  {discountLabel}
                </Badge>
                {isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg text-white">{promotion.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                Code: <span className="font-mono text-gold">{promotion.code}</span>
              </CardDescription>
            </div>
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <Percent className="h-6 w-6 text-gold" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{promotion.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Min. purchase: {promotion.minPurchase.toLocaleString()} KHR
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Valid until {formatDate(promotion.endDate)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {promotion.usageCount}/{promotion.usageLimit} used
            </span>
            <Button size="sm" className="bg-gold text-cinema-dark hover:bg-gold-light font-medium">
              <Ticket className="h-3.5 w-3.5 mr-1" />
              Use Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function PromotionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  })

  const promotions = data?.data ?? []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Promotions & Offers</h1>
        <p className="text-muted-foreground">Exclusive deals and discounts just for you</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <PromotionCardSkeleton key={i} />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Percent className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No promotions available</h3>
          <p className="text-sm text-muted-foreground">Check back later for new offers and discounts</p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/">Browse Movies</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion: Promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      )}
    </div>
  )
}
