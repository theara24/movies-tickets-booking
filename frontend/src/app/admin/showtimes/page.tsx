"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Plus, Edit, Trash2, CalendarClock, Loader2, Film, Building2, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getShowtimes } from "@/services/api/showtime.service"
import { getMovies } from "@/services/api/movie.service"
import { cinemas } from "@/services/api/mock-data"
import { formatDate, formatTime } from "@/lib/utils"

export default function AdminShowtimesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMovie, setSelectedMovie] = useState("all")
  const [selectedCinema, setSelectedCinema] = useState("all")

  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ["showtimes", selectedDate, selectedMovie, selectedCinema],
    queryFn: () =>
      getShowtimes({
        date: selectedDate,
        movieId: selectedMovie !== "all" ? selectedMovie : undefined,
        cinemaId: selectedCinema !== "all" ? selectedCinema : undefined,
      }),
  })

  const showtimes = data?.data ?? []
  const movies = moviesData?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Showtime Management</h2>
          <p className="text-muted-foreground">Manage movie schedules across cinemas</p>
        </div>
        <Link href="/admin/showtimes/create">
          <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add Showtime
          </Button>
        </Link>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Date</p>
              <Input
                type="date"
                className="bg-cinema-dark border-border/60 w-44"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Movie</p>
              <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                <SelectTrigger className="bg-cinema-dark border-border/60 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Movies</SelectItem>
                  {movies.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cinema</p>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="bg-cinema-dark border-border/60 w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cinemas</SelectItem>
                  {cinemas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : showtimes.length === 0 ? (
            <div className="text-center py-12">
              <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No showtimes found for the selected filters</p>
              <Link href="/admin/showtimes/create">
                <Button variant="outline" className="mt-4">Add Showtime</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {showtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-cinema-dark border border-border hover:border-gold/20 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-8 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                      <Film className="h-4 w-4 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{showtime.movie.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{showtime.cinema.name}</span>
                        <span>&middot;</span>
                        <Monitor className="h-3 w-3" />
                        <span>{showtime.hall.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-semibold text-gold">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(`2000-01-01T${showtime.startTime}`)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{formatDate(showtime.date, "short")}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={showtime.availableSeats < 10 ? "text-destructive" : "text-foreground"}>
                        {showtime.availableSeats}/{showtime.totalSeats}
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${showtime.availableSeats < 10 ? "border-destructive text-destructive" : ""}`}>
                      {showtime.availableSeats < 10 ? "Almost Full" : "Available"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Monitor(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
