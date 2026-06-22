"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Users,
  Play,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getNowShowing, getComingSoon } from "@/services/api/movie.service"
import { getShowtimes } from "@/services/api/showtime.service"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"
import type { Showtime, Movie } from "@/types"

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export default function MovieDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 0))

  const { data: nowShowingData, isLoading: loadingNow } = useQuery({
    queryKey: ["movies", "nowShowing"],
    queryFn: () => getNowShowing(),
  })

  const { data: comingSoonData } = useQuery({
    queryKey: ["movies", "comingSoon"],
    queryFn: () => getComingSoon(),
  })

  const allMovies = [...(nowShowingData?.data ?? []), ...(comingSoonData?.data ?? [])]
  const movie = allMovies.find((m) => m.slug === slug)

  const { data: showtimesData, isLoading: loadingShowtimes } = useQuery({
    queryKey: ["showtimes", movie?.id, selectedDate],
    queryFn: () =>
      getShowtimes({ movieId: movie!.id, date: selectedDate }),
    enabled: !!movie,
  })

  const showtimes = showtimesData?.data ?? []
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  const cinemasWithShowtimes = showtimes.reduce<{ cinema: Showtime["cinema"]; showtimes: Showtime[] }[]>(
    (acc, st) => {
      const existing = acc.find((c) => c.cinema.id === st.cinema.id)
      if (existing) {
        existing.showtimes.push(st)
      } else {
        acc.push({ cinema: st.cinema, showtimes: [st] })
      }
      return acc
    },
    [],
  )

  const similarMovies = allMovies.filter(
    (m) =>
      m.slug !== slug &&
      m.genre.some((g) => movie?.genre.includes(g)),
  ).slice(0, 5)

  if (loadingNow) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-[300px] md:h-[400px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 gap-4">
        <h1 className="text-2xl font-bold">Movie Not Found</h1>
        <p className="text-muted-foreground">The movie you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/movies">Browse Movies</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-10">
      <section className="relative h-[250px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 z-20 container pb-6 md:pb-10">
          <Link
            href="/movies"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Movies
          </Link>
        </div>
      </section>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 md:-mt-48 relative z-30">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-2xl"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="gold">
                  {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
                </Badge>
                <Badge variant="secondary">{movie.language}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="text-foreground font-medium">{movie.rating}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration} min</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(movie.releaseDate)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">{movie.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Director</span>
                  <p className="font-medium">{movie.director}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cast</span>
                  <p className="font-medium">{movie.cast.join(", ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subtitle</span>
                  <p className="font-medium">{movie.subtitle}</p>
                </div>
              </div>
            </motion.div>

            {movie.status === "now_showing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button size="lg" className="bg-gold text-cinema-dark hover:bg-gold-light font-semibold" asChild>
                  <Link href={`/showtimes?movieId=${movie.id}`}>
                    <Ticket className="h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {movie.status === "now_showing" && (
        <section className="container space-y-5">
          <h2 className="text-xl font-bold tracking-tight">Showtimes</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dates.map((date) => {
              const isToday = date === addDays(new Date(), 0)
              const d = new Date(date)
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" })
              const dayNum = d.getDate()
              const isSelected = date === selectedDate
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 flex flex-col items-center gap-1 rounded-xl px-4 py-3 min-w-[70px] transition-colors ${
                    isSelected
                      ? "bg-gold text-cinema-dark"
                      : "bg-cinema-surface text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase">{isToday ? "Today" : dayName}</span>
                  <span className="text-lg font-bold leading-none">{dayNum}</span>
                </button>
              )
            })}
          </div>

          {loadingShowtimes ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : cinemasWithShowtimes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Clock className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No showtimes available for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cinemasWithShowtimes.map(({ cinema, showtimes: cinemaShowtimes }) => (
                <Card key={cinema.id} className="bg-cinema-surface/50 border-border/40">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      <h3 className="font-semibold">{cinema.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {cinemaShowtimes.map((st) => (
                        <Link
                          key={st.id}
                          href={`/booking?showtimeId=${st.id}`}
                          className="flex flex-col items-center gap-1 rounded-lg bg-muted px-4 py-2.5 hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all group"
                        >
                          <span className="text-sm font-bold">{formatTime(st.startTime)}</span>
                          <span className="text-[10px] text-muted-foreground">{st.hall.name}</span>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{st.availableSeats}</span>
                          </div>
                          <span className="text-xs font-semibold text-gold">{formatCurrency(st.price)}</span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="container space-y-5">
        <h2 className="text-xl font-bold tracking-tight">Cast & Crew</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {movie.cast.map((actor, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium leading-tight">{actor}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="container" />

      <section className="container space-y-5">
        <h2 className="text-xl font-bold tracking-tight">Reviews</h2>
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Quote className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
        </div>
      </section>

      {similarMovies.length > 0 && (
        <section className="container space-y-5">
          <h2 className="text-xl font-bold tracking-tight">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarMovies.map((m) => (
              <Link key={m.id} href={`/movies/${m.slug}`} className="group space-y-2">
                <div className="aspect-[2/3] rounded-xl bg-muted overflow-hidden" />
                <h3 className="text-sm font-medium group-hover:text-gold transition-colors line-clamp-1">{m.title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{m.duration} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
