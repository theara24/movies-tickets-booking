"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getMovies } from "@/services/api/movie.service"
import { cinemas } from "@/services/api/mock-data"
import Link from "next/link"

export default function CreateShowtimePage() {
  const router = useRouter()
  const [movieId, setMovieId] = useState("")
  const [cinemaId, setCinemaId] = useState("")
  const [hallId, setHallId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("14:00")
  const [price, setPrice] = useState("5")
  const [vipPrice, setVipPrice] = useState("8")
  const [couplePrice, setCouplePrice] = useState("12")

  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(),
  })

  const movies = moviesData?.data ?? []

  const selectedCinema = cinemas.find((c) => c.id === cinemaId)
  const halls = selectedCinema?.halls ?? []

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast({ title: "Showtime created", description: "Showtime has been created successfully", variant: "success" })
      router.push("/admin/showtimes")
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create showtime", variant: "destructive" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!movieId || !cinemaId || !hallId || !date || !startTime) {
      toast({ title: "Validation error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }
    mutation.mutate()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/showtimes">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create Showtime</h2>
          <p className="text-muted-foreground">Schedule a new movie showtime</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Showtime Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Movie *</Label>
              <Select value={movieId} onValueChange={setMovieId}>
                <SelectTrigger className="bg-cinema-dark border-border/60">
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cinema *</Label>
                <Select value={cinemaId} onValueChange={(v) => { setCinemaId(v); setHallId("") }}>
                  <SelectTrigger className="bg-cinema-dark border-border/60">
                    <SelectValue placeholder="Select cinema" />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hall *</Label>
                <Select value={hallId} onValueChange={setHallId} disabled={!cinemaId}>
                  <SelectTrigger className="bg-cinema-dark border-border/60">
                    <SelectValue placeholder={cinemaId ? "Select hall" : "Select cinema first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map((h) => (
                      <SelectItem key={h.id} value={h.id}>{h.name} ({h.totalSeats} seats)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" className="bg-cinema-dark border-border/60" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input type="time" className="bg-cinema-dark border-border/60" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">Pricing</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Standard ($)</Label>
                  <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>VIP ($)</Label>
                  <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Couple ($)</Label>
                  <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={couplePrice} onChange={(e) => setCouplePrice(e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Link href="/admin/showtimes">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-gold text-cinema-dark hover:bg-gold-dark" disabled={mutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? "Creating..." : "Create Showtime"}
          </Button>
        </div>
      </form>
    </div>
  )
}
