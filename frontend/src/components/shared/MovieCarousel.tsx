"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "./MovieCard"
import type { Movie } from "@/types"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  link?: string
}

export function MovieCarousel({ title, movies, link }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    return () => el.removeEventListener("scroll", checkScroll)
  }, [movies])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75
    el.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (!movies.length) return null

  return (
    <section className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {link && (
          <Link
            href={link}
            className="text-sm text-[#f5a623] hover:text-[#d4921e] transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      <div className="relative group">
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#16162a]/80 border border-white/10 text-white hover:bg-[#16162a] hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#16162a]/80 border border-white/10 text-white hover:bg-[#16162a] hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="min-w-[160px] md:min-w-[180px] lg:min-w-[200px] flex-shrink-0"
            >
              <MovieCard movie={movie} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
