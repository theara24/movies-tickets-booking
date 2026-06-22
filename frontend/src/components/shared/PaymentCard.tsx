"use client"

import { QrCode, CreditCard, Landmark, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/types"

interface PaymentCardProps {
  method: PaymentMethod
  selected: boolean
  onSelect: () => void
}

const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
  khqr: <QrCode className="h-6 w-6" />,
  credit_card: <CreditCard className="h-6 w-6" />,
  debit_card: <CreditCard className="h-6 w-6" />,
  account: <Wallet className="h-6 w-6" />,
}

const paymentLabels: Record<PaymentMethod, string> = {
  khqr: "KHQR",
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  account: "Account",
}

export function PaymentCard({ method, selected, onSelect }: PaymentCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex items-center gap-3 w-full rounded-xl border p-4 transition-all text-left",
        selected
          ? "border-[#f5a623] bg-[#f5a623]/10 shadow-[0_0_12px_rgba(245,166,35,0.15)]"
          : "border-white/10 bg-[#16162a] hover:border-white/20 hover:bg-[#1a1a2e]",
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-10 w-10 rounded-lg",
        selected ? "bg-[#f5a623] text-[#0d0d1a]" : "bg-white/5 text-gray-400",
      )}>
        {paymentIcons[method]}
      </div>
      <span className={cn(
        "font-medium",
        selected ? "text-white" : "text-gray-300",
      )}>
        {paymentLabels[method]}
      </span>
      <div className="ml-auto">
        <div className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center",
          selected ? "border-[#f5a623]" : "border-white/20",
        )}>
          {selected && <div className="h-2.5 w-2.5 rounded-full bg-[#f5a623]" />}
        </div>
      </div>
    </button>
  )
}
