"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  UtensilsCrossed,
  ShoppingBag,
  Percent,
  CreditCard,
  Clock,
  MapPin,
  Film,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookingStore } from "@/store/booking-store"
import { useCartStore } from "@/store/cart-store"
import { formatTime, formatCurrency, formatDate } from "@/lib/utils"
import { validatePromotion } from "@/services/api/promotion.service"

export default function BookingSummaryPage() {
  const router = useRouter()
  const { selectedShowtime, selectedSeats } = useBookingStore()
  const { items: foodItems, getTotal: getFoodTotal } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  if (!selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <Ticket className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">No seats selected</p>
        <Button asChild>
          <a href="/showtimes">Browse Showtimes</a>
        </Button>
      </div>
    )
  }

  const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0)
  const foodTotal = getFoodTotal()
  const subtotal = seatTotal + foodTotal
  const total = Math.max(0, subtotal - promoDiscount)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setIsApplying(true)
    setPromoError(null)
    try {
      const res = await validatePromotion(promoCode.trim(), subtotal)
      if (res.data.valid && res.data.discount) {
        setPromoDiscount(res.data.discount)
      } else {
        setPromoError("Invalid or expired promotion code")
        setPromoDiscount(0)
      }
    } catch {
      setPromoError("Failed to validate code")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Booking Summary</h1>
        <p className="text-sm text-muted-foreground">Review your booking details</p>
      </div>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-16 w-12 rounded-lg bg-muted shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold">{selectedShowtime.movie.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedShowtime.cinema.name}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(selectedShowtime.startTime)}
                </span>
                <span>·</span>
                <span>{formatDate(selectedShowtime.date, "long")}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {selectedShowtime.hall.name}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Selected Seats</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <Badge key={seat.id} variant="outline" className="text-xs">
                  {seat.number}
                  <span className="ml-1 text-muted-foreground">
                    ({formatCurrency(seat.price)})
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Promotion Code</h3>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="pl-10 bg-cinema-dark/50"
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={isApplying || !promoCode.trim()}
            >
              {isApplying ? "..." : "Apply"}
            </Button>
          </div>
          {promoError && <p className="text-xs text-destructive">{promoError}</p>}
          {promoDiscount > 0 && (
            <p className="text-xs text-success">
              Discount applied: -{formatCurrency(promoDiscount)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Food & Beverage</h3>
            <Button variant="ghost" size="sm" className="text-gold" asChild>
              <a href="/food" className="flex items-center gap-1">
                <UtensilsCrossed className="h-4 w-4" />
                {foodItems.length === 0 ? "Add Items" : "Edit"}
              </a>
            </Button>
          </div>
          {foodItems.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No food & beverage added yet</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/food">
                  <UtensilsCrossed className="h-4 w-4" />
                  Browse Menu
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {foodItems.map((oi) => (
                <div key={oi.item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {oi.item.name} x{oi.quantity}
                  </span>
                  <span>{formatCurrency(oi.item.price * oi.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seats ({selectedSeats.length})</span>
              <span>{formatCurrency(seatTotal)}</span>
            </div>
            {foodTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Food & Beverage</span>
                <span>{formatCurrency(foodTotal)}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatCurrency(promoDiscount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gold">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={() => router.push("/booking")} className="flex-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Seats
        </Button>
        <Button
          className="flex-1 bg-gold text-cinema-dark hover:bg-gold-light font-semibold"
          size="lg"
          onClick={() => router.push("/payment")}
        >
          Proceed to Payment
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
