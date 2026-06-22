"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchMovies } from "@/services/api/movie.service"
import type { Movie } from "@/types"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search movies..." }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchMovies(query)
        if (res.success) {
          setResults(res.data)
          setIsOpen(true)
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query)
      setIsOpen(false)
    }
  }

  const handleSelect = () => {
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 bg-[#16162a] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#f5a623]"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setIsOpen(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-[#16162a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-400">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">No movies found</div>
          ) : (
            results.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                onClick={handleSelect}
                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
              >
                <div className="relative h-14 w-10 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                  <p className="text-xs text-gray-400">{movie.genre.join(", ")}</p>
                </div>
                <span className="text-xs text-gray-500">{movie.duration} min</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
