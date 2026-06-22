"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  User,
  Award,
  Ticket,
  Settings,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Calendar,
  Gift,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth-store"
import { useQuery } from "@tanstack/react-query"
import { getBookings } from "@/services/api/booking.service"
import { formatCurrency } from "@/lib/utils"
import { LOYALTY_THRESHOLDS } from "@/lib/constants"
import type { LoyaltyTier } from "@/types"

const tierColors: Record<LoyaltyTier, { bg: string; text: string; label: string }> = {
  bronze: { bg: "bg-amber-900/30", text: "text-amber-400", label: "Bronze" },
  silver: { bg: "bg-slate-400/20", text: "text-slate-300", label: "Silver" },
  gold: { bg: "bg-gold/20", text: "text-gold", label: "Gold" },
  platinum: { bg: "bg-cyan-400/20", text: "text-cyan-300", label: "Platinum" },
}

export default function ProfilePage() {
  const { user } = useAuthStore()

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => getBookings(user?.id),
    enabled: !!user?.id,
  })

  const bookings = bookingsData?.data ?? []
  const totalSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  const totalBookings = bookings.length

  const tier = user?.loyaltyTier ?? "bronze"
  const points = user?.loyaltyPoints ?? 0
  const tierInfo = tierColors[tier]

  const nextTier =
    tier === "bronze"
      ? { label: "Silver", threshold: LOYALTY_THRESHOLDS.SILVER }
      : tier === "silver"
        ? { label: "Gold", threshold: LOYALTY_THRESHOLDS.GOLD }
        : tier === "gold"
          ? { label: "Platinum", threshold: LOYALTY_THRESHOLDS.PLATINUM }
          : null

  const progress = nextTier
    ? Math.min((points / nextTier.threshold) * 100, 100)
    : 100

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <User className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">Sign in to view your profile</p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-gradient-to-br from-gold/10 via-cinema-card to-cinema-card border-gold/20">
          <CardContent className="p-5 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gold/40">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback className="bg-gold/20 text-gold text-lg">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/settings">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                <h2 className="font-semibold">Loyalty Points</h2>
              </div>
              <Badge className={`${tierInfo.bg} ${tierInfo.text} border-none`}>
                {tierInfo.label}
              </Badge>
            </div>
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-gold">{points.toLocaleString()}</span>
              <p className="text-xs text-muted-foreground mt-1">Total Points</p>
            </div>
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to {nextTier.label}</span>
                  <span>
                    {points.toLocaleString()} / {nextTier.threshold.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/profile/loyalty">
                View Details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-cinema-surface/50 border-border/40">
            <CardContent className="p-4 text-center space-y-1">
              <Ticket className="h-6 w-6 text-gold mx-auto" />
              <p className="text-2xl font-bold">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="bg-cinema-surface/50 border-border/40">
            <CardContent className="p-4 text-center space-y-1">
              <CreditCard className="h-6 w-6 text-gold mx-auto" />
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Quick Links
          </h2>
          <div className="space-y-1">
            <Link
              href="/profile/bookings"
              className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Booking History</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/loyalty"
              className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Loyalty Program</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/profile/settings"
              className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/tickets"
              className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">My Tickets</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
