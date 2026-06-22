"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Upload, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { MOVIE_GENRES } from "@/lib/constants"
import Link from "next/link"

const ratings = ["G", "PG", "PG-13", "R", "NC-17"]
const statuses = [
  { value: "now_showing", label: "Now Showing" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "ended", label: "Ended" },
]

export default function CreateMoviePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [rating, setRating] = useState("PG-13")
  const [director, setDirector] = useState("")
  const [cast, setCast] = useState("")
  const [language, setLanguage] = useState("Khmer")
  const [subtitle, setSubtitle] = useState("English")
  const [status, setStatus] = useState("now_showing")
  const [isFeatured, setIsFeatured] = useState(false)

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    )
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast({ title: "Movie created", description: "Movie has been created successfully", variant: "success" })
      router.push("/admin/movies")
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create movie", variant: "destructive" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !duration || !releaseDate) {
      toast({ title: "Validation error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }
    mutation.mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create Movie</h2>
          <p className="text-muted-foreground">Add a new movie to the catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-cinema-card border-border/60">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Movie title"
                    className="bg-cinema-dark border-border/60"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Movie description..."
                    className="bg-cinema-dark border-border/60 min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g. 120"
                      className="bg-cinema-dark border-border/60"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select value={rating} onValueChange={setRating}>
                      <SelectTrigger className="bg-cinema-dark border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ratings.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release Date *</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      className="bg-cinema-dark border-border/60"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      className="bg-cinema-dark border-border/60"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Cast & Crew</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="director">Director</Label>
                    <Input
                      id="director"
                      placeholder="Director name"
                      className="bg-cinema-dark border-border/60"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cast">Cast (comma separated)</Label>
                    <Input
                      id="cast"
                      placeholder="Actor 1, Actor 2"
                      className="bg-cinema-dark border-border/60"
                      value={cast}
                      onChange={(e) => setCast(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      placeholder="e.g. Khmer"
                      className="bg-cinema-dark border-border/60"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      placeholder="e.g. English"
                      className="bg-cinema-dark border-border/60"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-cinema-card border-border/60">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[2/3] rounded-lg border-2 border-dashed border-border bg-cinema-dark flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload poster</p>
                  <p className="text-[10px] text-muted-foreground">JPG or PNG, 500x750</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {MOVIE_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className={`cursor-pointer transition-colors ${
                        selectedGenres.includes(genre)
                          ? "bg-gold/20 text-gold border-gold/40"
                          : "hover:border-gold/30"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cinema-card border-border/60">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-cinema-dark border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(v) => setIsFeatured(v as boolean)}
                  />
                  <Label htmlFor="featured">Featured Movie</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-gold text-cinema-dark hover:bg-gold-dark" disabled={mutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {mutation.isPending ? "Creating..." : "Create Movie"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
