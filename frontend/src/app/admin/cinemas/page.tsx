"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Building2, Plus, ChevronDown, ChevronUp, Phone, MapPin, Monitor, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getMovies } from "@/services/api/movie.service"
import { cinemas } from "@/services/api/mock-data"
import type { Cinema } from "@/types"

const hallTypeColors: Record<string, string> = {
  standard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  vip: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  imax: "bg-gold/10 text-gold border-gold/20",
  "4dx": "bg-green-500/10 text-green-400 border-green-500/20",
}

function CinemaCard({ cinema }: { cinema: Cinema }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className="bg-cinema-card border-border/60">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{cinema.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{cinema.address}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <Phone className="h-3.5 w-3.5" />
                <span>{cinema.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[11px]">
                  {cinema.halls.length} Hall{cinema.halls.length > 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {cinema.halls.reduce((s, h) => s + h.totalSeats, 0)} seats
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/cinemas/${cinema.id}/halls`}>
              <Button variant="outline" size="sm">Manage Halls</Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-6 space-y-3 border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">Halls</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {cinema.halls.map((hall) => (
                <div key={hall.id} className="flex items-center justify-between p-3 rounded-lg bg-cinema-dark border border-border">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{hall.name}</p>
                      <p className="text-xs text-muted-foreground">{hall.totalSeats} seats ({hall.rows}x{hall.cols})</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${hallTypeColors[hall.type]}`}>
                    {hall.type.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminCinemasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cinema Management</h2>
          <p className="text-muted-foreground">Manage cinema branches and halls</p>
        </div>
        <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <div className="grid gap-6">
        {cinemas.map((cinema) => (
          <CinemaCard key={cinema.id} cinema={cinema} />
        ))}
      </div>
    </div>
  )
}
