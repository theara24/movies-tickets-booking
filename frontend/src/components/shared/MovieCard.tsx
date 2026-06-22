"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import type { Movie } from "@/types"

interface MovieCardProps {
  movie: Movie
  variant?: "default" | "compact" | "featured"
}

export function MovieCard({ movie, variant = "default" }: MovieCardProps) {
  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <motion.div
      whileHover={{ scale: isCompact ? 1.03 : 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-[#16162a] border border-white/5",
        isFeatured && "lg:flex lg:flex-row lg:items-stretch lg:gap-0",
      )}
    >
      <Link
        href={`/movies/${movie.slug}`}
        className={cn(
          "block",
          isFeatured && "lg:flex lg:w-full",
        )}
      >
        <div className={cn(
          "relative overflow-hidden",
          isCompact && "aspect-[2/3]",
          !isCompact && !isFeatured && "aspect-[2/3]",
          isFeatured && "aspect-[16/9] lg:aspect-auto lg:w-1/2 lg:min-h-[400px]",
        )}>
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : isCompact ? "200px" : "300px"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/80 to-transparent" />
          {!isCompact && (
            <div className="absolute top-2 right-2">
              <Badge variant="gold" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {movie.rating}
              </Badge>
            </div>
          )}
          {isFeatured && (
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {movie.genre.slice(0, 3).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className={cn(
          "p-4",
          isFeatured && "lg:w-1/2 lg:p-8 lg:flex lg:flex-col lg:justify-center",
        )}>
          <h3 className={cn(
            "font-semibold text-white line-clamp-1",
            isFeatured && "text-2xl lg:text-3xl",
            !isFeatured && "text-sm",
          )}>
            {movie.title}
          </h3>
          {!isCompact && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2">
              {movie.description}
            </p>
          )}
          <div className={cn(
            "flex flex-wrap items-center gap-2",
            isFeatured ? "mt-4" : "mt-2",
          )}>
            {!isFeatured && !isCompact && movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="outline" className="text-[10px] border-white/10 text-gray-300">
                {g}
              </Badge>
            ))}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {movie.duration} min
            </div>
          </div>
          {!isCompact && (
            <div className={cn(isFeatured ? "mt-6" : "mt-3")}>
              <Button size={isFeatured ? "lg" : "sm"} className="w-full bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] font-semibold">
                Book Now
              </Button>
            </div>
          )}
          {isCompact && (
            <div className="mt-2">
              <Button size="sm" className="w-full bg-[#f5a623] hover:bg-[#d4921e] text-[#0d0d1a] text-xs">
                Book Now
              </Button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
