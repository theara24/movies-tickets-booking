import { ApiResponse, Movie } from "@/types"
import { movies } from "./mock-data"

interface GetMoviesParams {
  genre?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}

function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + 200))
}

export async function getMovies(params?: GetMoviesParams): Promise<ApiResponse<Movie[]>> {
  await delay()
  let filtered = [...movies]

  if (params?.genre) {
    filtered = filtered.filter((m) => m.genre.some((g) => g.toLowerCase() === params.genre!.toLowerCase()))
  }
  if (params?.status) {
    filtered = filtered.filter((m) => m.status === params.status)
  }
  if (params?.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((m) => m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q))
  }

  return { success: true, data: filtered }
}

export async function getMovie(id: string): Promise<ApiResponse<Movie | null>> {
  await delay()
  const movie = movies.find((m) => m.id === id) || null
  return { success: !!movie, data: movie }
}

export async function getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
  await delay()
  const featured = movies.filter((m) => m.isFeatured)
  return { success: true, data: featured }
}

export async function getNowShowing(): Promise<ApiResponse<Movie[]>> {
  await delay()
  const nowShowing = movies.filter((m) => m.isNowShowing)
  return { success: true, data: nowShowing }
}

export async function getComingSoon(): Promise<ApiResponse<Movie[]>> {
  await delay()
  const comingSoon = movies.filter((m) => m.isComingSoon)
  return { success: true, data: comingSoon }
}

export async function searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
  await delay()
  const q = query.toLowerCase()
  const results = movies.filter(
    (m) => m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q) || m.genre.some((g) => g.toLowerCase().includes(q))
  )
  return { success: true, data: results }
}
