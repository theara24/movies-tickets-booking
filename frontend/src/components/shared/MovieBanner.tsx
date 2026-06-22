"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Play, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Movie } from "@/types"

interface MovieBannerProps {
  movie: Movie
}

export function MovieBanner({ movie }: MovieBannerProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl min-h-[300px] md:min-h-[450px] lg:min-h-[550px]">
      <Image
        src={movie.backdropUrl}
        alt={movie.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d1a]/95 via-[#0d0d1a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
      <div className="relative z-10 flex h-full items-center p-6 md:p-10 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="gold" className="flex items-center gap-1 text-sm px-3 py-1">
              <Star className="h-4 w-4 fill-current" />
              {movie.rating}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <Clock className="h-4 w-4" />
              {movie.duration} min
            </div>
            <span className="text-sm text-gray-400">{movie.language}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {movie.title}
          </h1>
          <p className="text-sm md:text-base text-gray-300 line-clamp-3 mb-4">
            {movie.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {formatDate(movie.releaseDate)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/movies/${movie.slug}`}>
              <Button size="lg" className="bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] font-semibold">
                Book Now
              </Button>
            </Link>
            {movie.trailerUrl && (
              <Link href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Watch Trailer
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
