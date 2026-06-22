"use client"

import { Suspense, useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, MapPin, Clock, Users, Film, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getShowtimes } from "@/services/api/showtime.service"
import { getNowShowing } from "@/services/api/movie.service"
import { formatTime, formatCurrency, formatDate } from "@/lib/utils"
import type { Showtime } from "@/types"

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function ShowtimesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlMovieId = searchParams.get("movieId") || ""

  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 0))
  const [selectedCinema, setSelectedCinema] = useState("")
  const [selectedMovie, setSelectedMovie] = useState(urlMovieId)

  const dates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)),
    [],
  )

  const { data: moviesData } = useQuery({
    queryKey: ["movies", "nowShowing"],
    queryFn: () => getNowShowing(),
  })

  const movies = moviesData?.data ?? []

  const { data: showtimesData, isLoading } = useQuery({
    queryKey: ["showtimes", selectedDate, selectedCinema, selectedMovie],
    queryFn: () =>
      getShowtimes({
        date: selectedDate,
        cinemaId: selectedCinema || undefined,
        movieId: selectedMovie || undefined,
      }),
  })

  const showtimes = showtimesData?.data ?? []

  const grouped = useMemo(() => {
    const map = new Map<string, Showtime[]>()
    for (const st of showtimes) {
      const key = `${st.movieId}-${st.cinemaId}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(st)
    }
    return Array.from(map.entries()).map(([_, sts]) => ({
      movie: sts[0].movie,
      cinema: sts[0].cinema,
      showtimes: sts,
    }))
  }, [showtimes])

  const cinemas = useMemo(() => {
    const set = new Set<string>()
    for (const st of showtimes) set.add(st.cinema.id)
    return Array.from(set)
  }, [showtimes])

  return (
    <div className="container space-y-6 py-6 md:py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Showtimes</h1>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedMovie} onValueChange={(v) => setSelectedMovie(v)}>
            <SelectTrigger className="w-[200px] bg-cinema-dark/50">
              <SelectValue placeholder="All Movies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Movies</SelectItem>
              {movies.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCinema} onValueChange={(v) => setSelectedCinema(v)}>
            <SelectTrigger className="w-[220px] bg-cinema-dark/50">
              <SelectValue placeholder="All Cinemas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cinemas</SelectItem>
              {cinemas.map((id) => {
                const cinema = showtimes.find((s) => s.cinema.id === id)?.cinema
                return cinema ? (
                  <SelectItem key={id} value={id}>
                    {cinema.name}
                  </SelectItem>
                ) : null
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {dates.map((date) => {
          const d = new Date(date)
          const isToday = date === addDays(new Date(), 0)
          const dayName = d.toLocaleDateString("en-US", { weekday: "short" })
          const dayNum = d.getDate()
          const month = d.toLocaleDateString("en-US", { month: "short" })
          const isSelected = date === selectedDate
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`shrink-0 flex flex-col items-center gap-1 rounded-xl px-4 py-3 min-w-[75px] transition-colors ${
                isSelected
                  ? "bg-gold text-cinema-dark"
                  : "bg-cinema-surface text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{isToday ? "Today" : dayName}</span>
              <span className="text-lg font-bold leading-none">{dayNum}</span>
              <span className="text-[10px]">{month}</span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No showtimes available</p>
          <p className="text-sm text-muted-foreground">
            Try a different date or filter
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ movie, cinema, showtimes: sts }) => (
            <motion.div
              key={`${movie.id}-${cinema.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-cinema-surface/50 border-border/40 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-0">
                    <div className="p-5 border-b md:border-b-0 md:border-r border-border/40 space-y-2">
                      <Link
                        href={`/movies/${movie.slug}`}
                        className="font-semibold hover:text-gold transition-colors line-clamp-1"
                      >
                        {movie.title}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Film className="h-3 w-3" />
                        <span>{movie.genre.slice(0, 2).join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{movie.duration} min</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium">{cinema.name}</span>
                        <span className="text-xs text-muted-foreground">{cinema.address}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {sts.map((st) => (
                          <Link
                            key={st.id}
                            href={`/booking?showtimeId=${st.id}`}
                            className="flex flex-col items-center gap-1 rounded-lg bg-muted px-4 py-2.5 hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all min-w-[90px]"
                          >
                            <span className="text-sm font-bold">{formatTime(st.startTime)}</span>
                            <span className="text-[10px] text-muted-foreground">{st.hall.name}</span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{st.availableSeats} left</span>
                            </div>
                            <span className="text-xs font-semibold text-gold">{formatCurrency(st.price)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>}>
      <ShowtimesContent />
    </Suspense>
  )
}
