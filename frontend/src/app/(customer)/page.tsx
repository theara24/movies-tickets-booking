"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, ChevronRight, Calendar, Star, Clock, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedMovies, getNowShowing, getComingSoon } from "@/services/api/movie.service"
import { getPromotions } from "@/services/api/promotion.service"
import { formatCurrency, formatDate, formatTime, truncate } from "@/lib/utils"
import type { Movie, Promotion } from "@/types"

function MovieCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/movies/${movie.slug}`} className="group block space-y-3">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/80 via-transparent to-transparent z-10" />
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
            <Badge variant="outline" className="bg-cinema-dark/70 text-xs border-none">
              <Star className="h-3 w-3 text-gold mr-1 fill-gold" />
              {movie.rating}
            </Badge>
            <Badge variant="gold" className="text-[10px]">
              {movie.language}
            </Badge>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm leading-tight group-hover:text-gold transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{movie.duration} min</span>
            <span>·</span>
            <span>{movie.genre.slice(0, 2).join(", ")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function MovieCarousel({ title, movies, isLoading }: { title: string; movies: Movie[]; isLoading: boolean }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        <Link
          href="/movies"
          className="flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  )
}

function MovieBanner({ movie }: { movie: Movie | null }) {
  if (!movie) return null
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cinema-surface via-cinema-card to-cinema-dark border border-border/40">
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark/90 via-cinema-dark/60 to-transparent z-10" />
      <div className="relative z-20 flex flex-col md:flex-row items-start gap-6 p-6 md:p-10">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/60 to-transparent" />
          </div>
        </div>
        <div className="flex-1 space-y-4 py-2">
          <Badge variant="gold" className="w-fit">Featured Movie</Badge>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
            {movie.title}
          </h1>
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
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {movie.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="bg-gold text-cinema-dark hover:bg-gold-light font-semibold" asChild>
              <Link href={`/movies/${movie.slug}`}>
                <Ticket className="h-4 w-4" />
                Book Now
              </Link>
            </Button>
            {movie.trailerUrl && (
              <Button variant="outline" size="lg" asChild>
                <Link href={movie.trailerUrl} target="_blank">
                  <Play className="h-4 w-4" />
                  Watch Trailer
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  return (
    <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20 hover:border-gold/40 transition-colors">
      <CardContent className="p-5 space-y-2">
        <Badge variant="gold" className="w-fit text-[10px] uppercase tracking-wider">
          {promotion.discountType === "percentage" ? `${promotion.discountValue}% OFF` : `${formatCurrency(promotion.discountValue)} OFF`}
        </Badge>
        <h3 className="font-semibold">{promotion.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{promotion.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-muted-foreground">
            Code: <span className="text-gold font-mono font-bold">{promotion.code}</span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            Min: {formatCurrency(promotion.minPurchase)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ["movies", "featured"],
    queryFn: () => getFeaturedMovies(),
  })

  const { data: nowShowing, isLoading: loadingNow } = useQuery({
    queryKey: ["movies", "nowShowing"],
    queryFn: () => getNowShowing(),
  })

  const { data: comingSoon, isLoading: loadingComing } = useQuery({
    queryKey: ["movies", "comingSoon"],
    queryFn: () => getComingSoon(),
  })

  const { data: promotionsData } = useQuery({
    queryKey: ["promotions", "active"],
    queryFn: () => getPromotions({ isActive: true }),
  })

  const featuredMovie = featured?.data?.[0] ?? null
  const nowShowingMovies = nowShowing?.data ?? []
  const comingSoonMovies = comingSoon?.data ?? []
  const promotions = promotionsData?.data?.data ?? []

  return (
    <div className="container space-y-12 py-6 md:py-8">
      <MovieBanner movie={featuredMovie} />

      <MovieCarousel
        title="Now Showing"
        movies={nowShowingMovies}
        isLoading={loadingNow}
      />

      {promotions.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Promotions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.slice(0, 6).map((promo) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <PromotionCard promotion={promo} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <MovieCarousel
        title="Coming Soon"
        movies={comingSoonMovies}
        isLoading={loadingComing}
      />

      <section className="space-y-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Trending</h2>
        <MovieCarousel
          title=""
          movies={nowShowingMovies.slice().sort((a, b) => a.title.localeCompare(b.title))}
          isLoading={loadingNow}
        />
      </section>
    </div>
  )
}
