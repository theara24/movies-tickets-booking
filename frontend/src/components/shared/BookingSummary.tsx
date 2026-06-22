import Image from "next/image"
import { Calendar, Clock, MapPin, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils"
import type { Showtime, Seat, FoodOrderItem, Promotion } from "@/types"

interface BookingSummaryProps {
  showtime: Showtime
  seats: Seat[]
  foodItems?: FoodOrderItem[]
  promotions?: Promotion
}

export function BookingSummary({ showtime, seats, foodItems, promotions }: BookingSummaryProps) {
  const ticketTotal = seats.reduce((sum, s) => sum + s.price, 0)
  const foodTotal = (foodItems || []).reduce((sum, fi) => sum + fi.item.price * fi.quantity, 0)
  const subtotal = ticketTotal + foodTotal

  let discount = 0
  if (promotions) {
    if (promotions.discountType === "percentage") {
      discount = Math.min(subtotal * (promotions.discountValue / 100), promotions.maxDiscount)
    } else {
      discount = promotions.discountValue
    }
  }

  const total = subtotal - discount

  return (
    <Card className="bg-[#16162a] border-white/5">
      <CardHeader>
        <CardTitle className="text-white text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="relative h-20 w-14 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={showtime.movie?.posterUrl || "/placeholder.svg"}
              alt={showtime.movie?.title || "Movie"}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {showtime.movie?.title}
            </h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {formatDate(showtime.date, "long")}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {showtime.cinema?.name} - {showtime.hall?.name}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div>
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-1.5">
            <Ticket className="h-4 w-4 text-[#f5a623]" />
            Seats ({seats.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {seats.map((seat) => (
              <Badge key={seat.id} variant="outline" className="text-[10px] border-white/10 text-gray-300">
                {seat.row}{seat.col}
                {seat.type !== "standard" && (
                  <span className="ml-0.5 text-[8px] uppercase">({seat.type})</span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {foodItems && foodItems.length > 0 && (
          <>
            <Separator className="bg-white/10" />
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Food & Drinks</h4>
              <div className="space-y-1.5">
                {foodItems.map((fi) => (
                  <div key={fi.item.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">
                      {fi.item.name} x{fi.quantity}
                    </span>
                    <span className="text-gray-400">
                      {formatCurrency(fi.item.price * fi.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="bg-white/10" />

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span>Tickets</span>
            <span>{formatCurrency(ticketTotal)}</span>
          </div>
          {foodTotal > 0 && (
            <div className="flex items-center justify-between text-gray-400">
              <span>Food & Drinks</span>
              <span>{formatCurrency(foodTotal)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-400">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-green-400">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <Separator className="bg-white/10" />
          <div className={cn(
            "flex items-center justify-between font-bold text-lg",
            discount > 0 ? "text-green-400" : "text-[#f5a623]",
          )}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
