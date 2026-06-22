"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { QrCode, CheckCircle, ArrowLeft, Info, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookingStore } from "@/store/booking-store"
import { formatCurrency } from "@/lib/utils"
import { generateKHQR } from "@/services/api/payment.service"
import { processPayment } from "@/services/api/payment.service"

export default function KHQRPaymentPage() {
  const router = useRouter()
  const { currentBooking, selectedShowtime, selectedSeats } = useBookingStore()
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [pollCount, setPollCount] = useState(0)

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const generateQrMutation = useMutation({
    mutationFn: () => generateKHQR(total),
    onSuccess: (res) => {
      if (res.success) {
        setQrImage(res.data.qrImageUrl)
      }
    },
  })

  const confirmMutation = useMutation({
    mutationFn: () => processPayment(currentBooking!.id, "khqr"),
    onSuccess: (res) => {
      if (res.success) {
        router.push("/payment/success")
      }
    },
  })

  useEffect(() => {
    generateQrMutation.mutate()
  }, [])

  useEffect(() => {
    if (!isPolling) return
    const interval = setInterval(() => {
      setPollCount((c) => {
        if (c >= 30) {
          setIsPolling(false)
          return c
        }
        return c + 1
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [isPolling])

  const handleIvePaid = () => {
    confirmMutation.mutate()
  }

  const handleCancel = () => {
    router.push("/payment")
  }

  return (
    <div className="container py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KHQR Payment</h1>
          <p className="text-sm text-muted-foreground">Scan the QR code to pay</p>
        </div>

        <Card className="bg-cinema-surface/50 border-border/40">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center">
              {generateQrMutation.isPending ? (
                <div className="h-64 w-64 rounded-xl bg-muted animate-pulse flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-muted-foreground/50" />
                </div>
              ) : (
                <div className="h-64 w-64 rounded-xl bg-white p-4 flex items-center justify-center">
                  {qrImage ? (
                    <div className="text-center">
                      <QrCode className="h-48 w-48 text-cinema-dark" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-cinema-dark">
                      <XCircle className="h-8 w-8 text-destructive" />
                      <p className="text-xs">Failed to generate QR</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-bold text-gold">{formatCurrency(total)}</p>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-gold" />
                How to Pay
              </h4>
              <ol className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-gold">1.</span>
                  Open your banking app
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-gold">2.</span>
                  Select &quot;Scan QR&quot; or &quot;KHQR&quot; payment
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-gold">3.</span>
                  Scan the QR code above
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-gold">4.</span>
                  Confirm the amount and complete payment
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-gold">5.</span>
                  Click &quot;I&apos;ve Paid&quot; below
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {isPolling && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            Waiting for payment confirmation...
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={confirmMutation.isPending}>
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gold text-cinema-dark hover:bg-gold-light font-semibold"
            size="lg"
            onClick={handleIvePaid}
            disabled={confirmMutation.isPending || generateQrMutation.isPending}
          >
            {confirmMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cinema-dark border-t-transparent" />
                Verifying...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                I&apos;ve Paid
              </div>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
