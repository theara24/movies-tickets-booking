"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { CreditCard, QrCode, Landmark, ChevronLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useBookingStore } from "@/store/booking-store"
import { useAuthStore } from "@/store/auth-store"
import { formatCurrency } from "@/lib/utils"
import { createBooking } from "@/services/api/booking.service"
import type { PaymentMethod } from "@/types"

const paymentMethods: { value: PaymentMethod; label: string; description: string; icon: typeof QrCode }[] = [
  { value: "khqr", label: "KHQR", description: "Scan QR with any banking app", icon: QrCode },
  { value: "credit_card", label: "Credit Card", description: "Visa, Mastercard, UnionPay", icon: CreditCard },
  { value: "debit_card", label: "Debit Card", description: "Pay with your debit card", icon: CreditCard },
  { value: "account", label: "Account Balance", description: "Pay using your CinePremium balance", icon: Landmark },
]

export default function PaymentPage() {
  const router = useRouter()
  const { selectedShowtime, selectedSeats } = useBookingStore()
  const { user } = useAuthStore()
  const [method, setMethod] = useState<PaymentMethod>("khqr")

  const bookingMutation = useMutation({
    mutationFn: () =>
      createBooking({
        showtimeId: selectedShowtime!.id,
        userId: user?.id ?? "user-003",
        seats: selectedSeats.map((s) => ({ id: s.id, row: s.row, col: s.col })),
        totalAmount: selectedSeats.reduce((sum, s) => sum + s.price, 0),
      }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        useBookingStore.getState().setCurrentBooking(res.data)
        if (method === "khqr") {
          router.push("/payment/khqr")
        } else {
          router.push("/payment/success")
        }
      }
    },
  })

  if (!selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg font-medium">No booking in progress</p>
        <Button asChild>
          <a href="/showtimes">Browse Showtimes</a>
        </Button>
      </div>
    )
  }

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
        <p className="text-sm text-muted-foreground">Choose your payment method</p>
      </div>

      <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-3">
        {paymentMethods.map((pm) => {
          const Icon = pm.icon
          return (
            <Card
              key={pm.value}
              className={`cursor-pointer transition-all ${
                method === pm.value
                  ? "border-gold bg-gold/5 ring-1 ring-gold"
                  : "border-border/40 bg-cinema-surface/50 hover:border-border"
              }`}
              onClick={() => setMethod(pm.value)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <RadioGroupItem value={pm.value} id={pm.value} className="shrink-0" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label htmlFor={pm.value} className="font-semibold text-sm cursor-pointer">
                    {pm.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{pm.description}</p>
                </div>
                {method === pm.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-gold"
                  >
                    <Check className="h-3 w-3 text-cinema-dark" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </RadioGroup>

      <Card className="bg-cinema-surface/50 border-border/40">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold">Amount Due</h3>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tickets ({selectedSeats.length})</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span>Free</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-gold">{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>

      {bookingMutation.isError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Payment failed. Please try again.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={() => router.push("/booking/summary")} className="flex-1">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex-1 bg-gold text-cinema-dark hover:bg-gold-light font-semibold"
          size="lg"
          disabled={bookingMutation.isPending}
          onClick={() => bookingMutation.mutate()}
        >
          {bookingMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cinema-dark border-t-transparent" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pay {formatCurrency(total)}
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
