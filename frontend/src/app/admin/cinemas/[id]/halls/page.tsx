"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Monitor, Loader2, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cinemas } from "@/services/api/mock-data"
import type { Hall } from "@/types"

const hallTypeColors: Record<string, string> = {
  standard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  vip: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  imax: "bg-gold/10 text-gold border-gold/20",
  "4dx": "bg-green-500/10 text-green-400 border-green-500/20",
}

function SeatMapPreview({ hall }: { hall: Hall }) {
  const maxCols = hall.cols > 20 ? 20 : hall.cols
  const maxRows = hall.rows > 8 ? 8 : hall.rows
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[10px] text-muted-foreground mb-1">Screen</div>
      <div className="w-full h-1.5 rounded bg-gold/30 mb-2" />
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
        {Array.from({ length: maxRows }).map((_, r) =>
          Array.from({ length: maxCols }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-3 h-3 rounded-[2px] ${
                r < 2 ? "bg-purple-500/40" : r >= maxRows - 1 && c % 2 === 0 && c < maxCols - 1
                  ? "bg-pink-500/40"
                  : "bg-blue-500/40"
              }`}
            />
          )),
        )}
      </div>
      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/40" /> Std</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500/40" /> VIP</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-pink-500/40" /> CPL</span>
      </div>
    </div>
  )
}

export default function HallManagementPage() {
  const params = useParams()
  const id = params.id as string
  const cinema = cinemas.find((c) => c.id === id)

  if (!cinema) {
    return (
      <div className="text-center py-12">
        <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Cinema not found</p>
        <Link href="/admin/cinemas">
          <Button variant="outline" className="mt-4">Back to Cinemas</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cinemas">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{cinema.name}</h2>
            <p className="text-muted-foreground">{cinema.address} &middot; {cinema.phone}</p>
          </div>
        </div>
        <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Hall
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cinema.halls.map((hall) => (
          <Card key={hall.id} className="bg-cinema-card border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-gold" />
                  <CardTitle className="text-lg text-foreground">{hall.name}</CardTitle>
                </div>
                <Badge variant="outline" className={`text-[11px] ${hallTypeColors[hall.type]}`}>
                  {hall.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{hall.totalSeats} total seats</span>
                  <span>{hall.rows} rows</span>
                  <span>{hall.cols} cols</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <SeatMapPreview hall={hall} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
