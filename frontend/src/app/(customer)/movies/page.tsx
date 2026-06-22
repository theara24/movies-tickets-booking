"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, X, Star, Clock, Film, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getMovies } from "@/services/api/movie.service"
import { MOVIE_GENRES } from "@/lib/constants"
import { formatCurrency, formatTime } from "@/lib/utils"
import type { Movie } from "@/types"

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
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/movies/${movie.slug}`} className="group block space-y-3">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/80 via-transparent to-transparent z-10" />
          <div className="absolute top-3 left-3 z-20">
            <Badge variant={movie.status === "now_showing" ? "gold" : "secondary"} className="text-[10px]">
              {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
            <Badge variant="outline" className="bg-cinema-dark/70 text-xs border-none">
              <Star className="h-3 w-3 text-gold mr-1 fill-gold" />
              {movie.rating}
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

function MoviesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get("search") || ""
  const urlGenre = searchParams.get("genre") || ""

  const [search, setSearch] = useState(urlSearch)
  const [selectedGenre, setSelectedGenre] = useState(urlGenre)

  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  const { data, isLoading } = useQuery({
    queryKey: ["movies", urlSearch, urlGenre],
    queryFn: () => getMovies({ search: urlSearch || undefined, genre: urlGenre || undefined }),
  })

  const movies = data?.data ?? []

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/movies?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter("search", search)
  }

  const handleGenreClick = (genre: string) => {
    const next = selectedGenre === genre ? "" : genre
    setSelectedGenre(next)
    updateFilter("genre", next)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedGenre("")
    router.push("/movies")
  }

  return (
    <div className="container space-y-6 py-6 md:py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Movies</h1>
        <form onSubmit={handleSearch} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-cinema-dark/50 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                updateFilter("search", "")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
        <button
          onClick={clearFilters}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            !selectedGenre && !urlSearch
              ? "bg-gold text-cinema-dark"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {MOVIE_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              selectedGenre === genre
                ? "bg-gold text-cinema-dark"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Film className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No movies found</p>
          <p className="text-sm text-muted-foreground">
            {urlSearch || selectedGenre
              ? "Try adjusting your search or filters"
              : "Movies coming soon!"}
          </p>
          {(urlSearch || selectedGenre) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>}>
      <MoviesContent />
    </Suspense>
  )
}
