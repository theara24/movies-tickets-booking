"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Copy, Check, Timer, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface QRCodeCardProps {
  amount: number
  qrImage?: string
  bookingId: string
}

export function QRCodeCard({ amount, qrImage, bookingId }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)

  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  const copyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(bookingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const isExpiring = timeLeft < 120

  return (
    <Card className="bg-[#16162a] border-white/5">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-lg">Pay with KHQR</CardTitle>
        <CardDescription className="text-gray-400">
          Scan with your banking app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {timeLeft > 0 ? (
          <div className={cn(
            "flex items-center gap-2 text-sm rounded-full px-3 py-1",
            isExpiring ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400",
          )}>
            <Timer className="h-4 w-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/20 rounded-full px-3 py-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Expired</span>
          </div>
        )}
        <div className="relative h-48 w-48 rounded-xl overflow-hidden bg-white p-2">
          {qrImage ? (
            <Image
              src={qrImage}
              alt="Payment QR Code"
              fill
              className="object-contain"
              sizes="192px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="grid grid-cols-8 gap-0.5 mx-auto mb-2" style={{ width: 120 }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={Math.random() > 0.5 ? "bg-black" : "bg-white"}
                      style={{ aspectRatio: 1 }}
                    />
                  ))}
                </div>
                <p className="text-[8px] text-gray-400">QR Placeholder</p>
              </div>
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-[#f5a623]">
          {formatCurrency(amount)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Booking ID: {bookingId}</span>
          <button
            onClick={copyBookingId}
            className="text-[#f5a623] hover:text-[#d4921e] transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Open your banking app and scan the QR code to complete payment.
          This QR code expires in {formatTimer(timeLeft)}.
        </p>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
