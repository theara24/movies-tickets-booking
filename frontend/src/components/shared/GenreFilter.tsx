"use client"

import { useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GenreFilterProps {
  genres: string[]
  selected: string[]
  onChange: (genres: string[]) => void
}

export function GenreFilter({ genres, selected, onChange }: GenreFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre))
    } else {
      onChange([...selected, genre])
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <button
          onClick={() => onChange([])}
          className={cn(
            "flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors border",
            selected.length === 0
              ? "bg-[#f5a623] text-[#0d0d1a] border-[#f5a623]"
              : "bg-[#16162a] text-gray-400 border-white/10 hover:border-white/20 hover:text-white",
          )}
        >
          All
        </button>
        {genres.map((genre) => {
          const isSelected = selected.includes(genre)
          return (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={cn(
                "flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                isSelected
                  ? "bg-[#f5a623] text-[#0d0d1a] border-[#f5a623]"
                  : "bg-[#16162a] text-gray-400 border-white/10 hover:border-white/20 hover:text-white",
              )}
            >
              {genre}
              {isSelected && <X className="h-3 w-3" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
