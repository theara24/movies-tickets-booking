"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search, Edit, Trash2, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMovies } from "@/services/api/movie.service"
import { formatDate } from "@/lib/utils"
import type { Movie } from "@/types"

const statusColors: Record<Movie["status"], string> = {
  now_showing: "bg-success/10 text-success border-success/20",
  coming_soon: "bg-gold/10 text-gold border-gold/20",
  ended: "bg-muted text-muted-foreground border-border",
}

export default function AdminMoviesPage() {
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["movies", search],
    queryFn: () => getMovies({ search: search || undefined }),
  })

  const movies = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Movie Management</h2>
          <p className="text-muted-foreground">Manage your cinema movie catalog</p>
        </div>
        <Link href="/admin/movies/create">
          <Button className="bg-gold text-cinema-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4 mr-2" />
            Add New Movie
          </Button>
        </Link>
      </div>

      <Card className="bg-cinema-card border-border/60">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                className="pl-9 bg-cinema-dark border-border/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No movies found</p>
              <Link href="/admin/movies/create">
                <Button variant="outline" className="mt-4">
                  Add your first movie
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Poster</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell>
                      <div className="h-10 w-8 rounded bg-muted overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                          <Film className="h-4 w-4 text-gold" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {movie.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {movie.genre.slice(0, 2).map((g) => (
                          <Badge key={g} variant="outline" className="text-[10px]">
                            {g}
                          </Badge>
                        ))}
                        {movie.genre.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{movie.genre.length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{movie.duration} min</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {movie.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] ${statusColors[movie.status]}`}>
                        {movie.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(movie.releaseDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/movies/${movie.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/movies/${movie.id}/delete`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
