"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Award, Gift, Star, TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/auth-store"
import { getBookingHistory } from "@/services/api/booking.service"
import { formatCurrency, formatDate } from "@/lib/utils"
import { LOYALTY_THRESHOLDS } from "@/lib/constants"
import type { LoyaltyTier } from "@/types"

const tierInfo: Record<LoyaltyTier, { label: string; color: string; bg: string; border: string; icon: typeof Award; benefits: string[] }> = {
  bronze: {
    label: "Bronze",
    color: "text-amber-400",
    bg: "bg-amber-900/30",
    border: "border-amber-500/30",
    icon: Award,
    benefits: ["Standard seat selection", "Email support", "Birthday reward"],
  },
  silver: {
    label: "Silver",
    color: "text-slate-300",
    bg: "bg-slate-400/20",
    border: "border-slate-400/30",
    icon: Award,
    benefits: ["All Bronze benefits", "5% discount on tickets", "Priority email support", "Free small popcorn on birthday"],
  },
  gold: {
    label: "Gold",
    color: "text-gold",
    bg: "bg-gold/20",
    border: "border-gold/30",
    icon: Award,
    benefits: ["All Silver benefits", "10% discount on tickets", "Free upgrade to VIP seats", "Dedicated phone support", "Exclusive preview screenings"],
  },
  platinum: {
    label: "Platinum",
    color: "text-cyan-300",
    bg: "bg-cyan-400/20",
    border: "border-cyan-400/30",
    icon: Award,
    benefits: ["All Gold benefits", "15% discount on tickets", "Free VIP seat upgrades", "24/7 priority support", "Free food combo per visit", "Invitation to exclusive events"],
  },
}

const tierOrder: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"]

export default function LoyaltyPage() {
  const { user } = useAuthStore()

  const { data: bookingsData } = useQuery({
    queryKey: ["bookingHistory", user?.id],
    queryFn: () => getBookingHistory(user!.id),
    enabled: !!user?.id,
  })

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <Award className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">Sign in to view your loyalty points</p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const currentTier = user.loyaltyTier
  const points = user.loyaltyPoints
  const bookings = bookingsData?.data ?? []
  const pointsEarned = bookings.reduce((sum, b) => sum + Math.floor(b.totalAmount * 0.01), 0)

  const currentTierIdx = tierOrder.indexOf(currentTier)
  const currentInfo = tierInfo[currentTier]
  const Icon = currentInfo.icon

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Loyalty Program</h1>
          <p className="text-sm text-muted-foreground">Your rewards and benefits</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className={`bg-gradient-to-br ${currentInfo.bg} ${currentInfo.border} border`}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${currentInfo.bg}`}>
                  <Icon className={`h-7 w-7 ${currentInfo.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <h2 className={`text-2xl font-bold ${currentInfo.color}`}>{currentInfo.label}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gold">{points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Tier Progress</h3>
            <div className="space-y-4">
              {tierOrder.map((tier, idx) => {
                const info = tierInfo[tier]
                const isCurrent = tier === currentTier
                const isUnlocked = idx <= currentTierIdx
                const threshold = LOYALTY_THRESHOLDS[tier.toUpperCase() as keyof typeof LOYALTY_THRESHOLDS]
                const TierIcon = info.icon

                let progressPercent = 0
                if (isCurrent) {
                  if (idx === 0) {
                    const nextThreshold = LOYALTY_THRESHOLDS.SILVER
                    progressPercent = Math.min((points / nextThreshold) * 100, 100)
                  } else if (idx === 1) {
                    progressPercent = Math.min(
                      ((points - LOYALTY_THRESHOLDS.SILVER) / (LOYALTY_THRESHOLDS.GOLD - LOYALTY_THRESHOLDS.SILVER)) * 100,
                      100,
                    )
                  } else if (idx === 2) {
                    progressPercent = Math.min(
                      ((points - LOYALTY_THRESHOLDS.GOLD) / (LOYALTY_THRESHOLDS.PLATINUM - LOYALTY_THRESHOLDS.GOLD)) * 100,
                      100,
                    )
                  }
                } else if (isUnlocked) {
                  progressPercent = 100
                }

                return (
                  <div key={tier} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            isUnlocked ? info.bg : "bg-muted"
                          }`}
                        >
                          {isUnlocked ? (
                            <TierIcon className={`h-3 w-3 ${info.color}`} />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isCurrent ? info.color : isUnlocked ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {info.label}
                        </span>
                        {isCurrent && (
                          <Badge variant="gold" className="text-[9px]">
                            Current
                          </Badge>
                        )}
                      </div>
                      {threshold && (
                        <span className="text-xs text-muted-foreground">
                          {threshold.toLocaleString()} pts
                        </span>
                      )}
                    </div>
                    {idx < 3 && (
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCurrent ? "bg-gold" : isUnlocked ? "bg-success" : "bg-muted"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5 text-gold" />
              {currentInfo.label} Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentInfo.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-gold" />
              Points History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No points earned yet. Book a movie to start earning!
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 10).map((booking) => {
                  const earned = Math.floor(booking.totalAmount * 0.01)
                  return (
                    <div key={booking.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">{booking.showtime?.movie?.title ?? "Movie"}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(booking.createdAt, "short")}</p>
                      </div>
                      <span className="text-success font-medium">+{earned} pts</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
