import { Heart, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export function SeatLegend() {
  const items = [
    { label: "Available", color: "bg-gray-600" },
    { label: "Selected", color: "bg-[#f5a623]" },
    { label: "Reserved", color: "bg-red-500" },
    { label: "VIP", color: "bg-purple-500", icon: Crown },
    { label: "Couple", color: "bg-pink-400", icon: Heart },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn("h-4 w-4 rounded", item.color)} />
          <span className="text-xs text-gray-400 flex items-center gap-1">
            {item.icon && <item.icon className="h-3 w-3" />}
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
