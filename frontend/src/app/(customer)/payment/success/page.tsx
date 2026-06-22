"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Ticket, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useBookingStore } from "@/store/booking-store"
import { formatCurrency, formatTime, formatDate } from "@/lib/utils"

export default function PaymentSuccessPage() {
  const { currentBooking, selectedShowtime, selectedSeats } = useBookingStore()

  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your booking has been confirmed. Check your tickets for details.
          </p>
        </div>

        {currentBooking && (
          <Card className="bg-cinema-surface/50 border-border/40 text-left">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Booking ID</span>
                <span className="text-xs font-mono text-gold">{currentBooking.id}</span>
              </div>
              {selectedShowtime && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Movie</span>
                    <span className="font-medium">{selectedShowtime.movie.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cinema</span>
                    <span className="font-medium">{selectedShowtime.cinema.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{formatDate(selectedShowtime.date, "long")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{formatTime(selectedShowtime.startTime)}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium">
                  {selectedSeats.map((s) => s.number).join(", ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-border/40 pt-3">
                <span className="font-semibold">Total Paid</span>
                <span className="text-lg font-bold text-gold">
                  {formatCurrency(currentBooking.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button size="lg" className="flex-1 bg-gold text-cinema-dark hover:bg-gold-light font-semibold" asChild>
            <Link href="/tickets">
              <Ticket className="h-4 w-4" />
              View My Tickets
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
