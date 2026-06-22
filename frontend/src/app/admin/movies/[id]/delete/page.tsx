"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowLeft, AlertTriangle, Loader2, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getMovie } from "@/services/api/movie.service"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DeleteMoviePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id),
    enabled: !!id,
  })

  const movie = data?.data

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast({ title: "Movie deleted", description: "Movie has been deleted successfully", variant: "success" })
      router.push("/admin/movies")
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete movie", variant: "destructive" })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Movie not found</p>
        <Link href="/admin/movies">
          <Button variant="outline" className="mt-4">Back to Movies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Delete Movie</h2>
          <p className="text-muted-foreground">This action cannot be undone</p>
        </div>
      </div>

      <Card className="bg-cinema-card border-border/60 border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Confirm Deletion</CardTitle>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this movie? This will also remove all associated showtimes and bookings.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-cinema-dark border border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-16 w-12 rounded bg-muted overflow-hidden flex items-center justify-center">
                <Film className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{movie.title}</p>
                <p className="text-sm text-muted-foreground">{movie.genre.join(", ")}</p>
              </div>
              <Badge variant="outline" className="ml-auto">{movie.status.replace("_", " ")}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span> {movie.duration} min
              </div>
              <div>
                <span className="text-muted-foreground">Rating:</span> {movie.rating}
              </div>
              <div>
                <span className="text-muted-foreground">Release:</span> {formatDate(movie.releaseDate)}
              </div>
              <div>
                <span className="text-muted-foreground">Director:</span> {movie.director}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium">
              Warning: Deleting this movie will permanently remove all related showtimes, and may affect existing bookings. This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Link href="/admin/movies">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
