"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ArrowLeft, Save, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { getMovies } from "@/services/api/movie.service"
import { MOVIE_GENRES } from "@/lib/constants"
import Link from "next/link"

export default function CreatePromotionPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [minPurchase, setMinPurchase] = useState("")
  const [maxDiscount, setMaxDiscount] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [usageLimit, setUsageLimit] = useState("")
  const [selectedMovies, setSelectedMovies] = useState<string[]>([])

  const { data: moviesData } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(),
  })

  const movies = moviesData?.data ?? []

  const toggleMovie = (id: string) => {
    setSelectedMovies((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    )
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast({ title: "Promotion created", description: "Promotion has been created successfully", variant: "success" })
      router.push("/admin/promotions")
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create promotion", variant: "destructive" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !title || !discountValue || !startDate || !endDate) {
      toast({ title: "Validation error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }
    mutation.mutate()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/promotions">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create Promotion</h2>
          <p className="text-muted-foreground">Create a new promotional campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Promotion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input id="code" placeholder="e.g. SAVE20" className="bg-cinema-dark border-border/60 uppercase" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g. Save 20%" className="bg-cinema-dark border-border/60" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Promotion description..." className="bg-cinema-dark border-border/60" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Discount Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Discount Type</Label>
              <RadioGroup value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Percentage (%)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">Fixed Amount (KHR)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount Value *</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "20" : "5000"} />
              </div>
              <div className="space-y-2">
                <Label>Min Purchase (KHR)</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value)} placeholder="10000" />
              </div>
              <div className="space-y-2">
                <Label>Max Discount (KHR)</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="20000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Validity & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input type="date" className="bg-cinema-dark border-border/60" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input type="date" className="bg-cinema-dark border-border/60" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Usage Limit (0 = unlimited)</Label>
              <Input type="number" className="bg-cinema-dark border-border/60" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Applicable Movies</CardTitle>
            <p className="text-sm text-muted-foreground">Leave empty to apply to all movies</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {movies.map((movie) => (
                <Badge
                  key={movie.id}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedMovies.includes(movie.id)
                      ? "bg-gold/20 text-gold border-gold/40"
                      : "hover:border-gold/30"
                  }`}
                  onClick={() => toggleMovie(movie.id)}
                >
                  {movie.title}
                </Badge>
              ))}
              {movies.length === 0 && (
                <p className="text-sm text-muted-foreground">No movies available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/admin/promotions">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-gold text-cinema-dark hover:bg-gold-dark" disabled={mutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? "Creating..." : "Create Promotion"}
          </Button>
        </div>
      </form>
    </div>
  )
}
