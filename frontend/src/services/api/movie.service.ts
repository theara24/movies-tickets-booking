import client from "./client"
import type { ApiResponse, Movie } from "@/types"

interface GetMoviesParams {
  genre?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}

function mapMovie(m: Record<string, unknown>): Movie {
  const genresRaw = m.genres as any[] | undefined
  const genreNames = Array.isArray(genresRaw)
    ? genresRaw.map((g) => g.genre?.name || g.name || "").filter(Boolean)
    : (m.genre as string[]) || []

  return {
    id: m.id as string,
    title: m.title as string,
    slug: (m.slug as string) || (m.id as string),
    description: (m.description as string) || "",
    posterUrl: (m.posterUrl as string) || (m.poster as string) || "",
    backdropUrl: (m.backdropUrl as string) || (m.backdrop as string) || (m.posterUrl as string) || "",
    trailerUrl: (m.trailerUrl as string) || null,
    genre: genreNames,
    duration: (m.duration as number) || 0,
    releaseDate: (m.releaseDate as string) || "",
    endDate: (m.endDate as string) || "",
    rating: (m.rating as string) || "",
    director: (m.director as string) || "",
    cast: (m.cast as string[]) || [],
    language: (m.language as string) || "",
    subtitle: (m.subtitle as string) || "",
    isFeatured: (m.isFeatured as boolean) || false,
    isNowShowing: (m.status as string) === "now_showing" || (m.isNowShowing as boolean) || false,
    isComingSoon: (m.status as string) === "coming_soon" || false,
    status: ((m.status as string) as Movie["status"]) || "now_showing",
  }
}

function extractData(responseData: any) {
  return responseData?.data || responseData
}

export async function getMovies(params?: GetMoviesParams): Promise<ApiResponse<Movie[]>> {
  try {
    const query: Record<string, string> = {}
    if (params?.genre) query.genre = params.genre
    if (params?.status) query.status = params.status
    if (params?.search) query.search = params.search
    if (params?.page) query.page = String(params.page)
    if (params?.limit) query.limit = String(params.limit)
    const { data: responseData } = await client.get("/movies", { params: query })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : (d?.items || d?.data || [])
    return { success: true, data: list.map(mapMovie) }
  } catch (error: any) {
    return { success: false, data: [], message: error.response?.data?.message || error.message }
  }
}

export async function getMovie(id: string): Promise<ApiResponse<Movie | null>> {
  try {
    const { data: responseData } = await client.get(`/movies/${id}`)
    const d = extractData(responseData)
    return { success: true, data: mapMovie(d) }
  } catch (error: any) {
    return { success: false, data: null, message: error.response?.data?.message || error.message }
  }
}

export async function getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
  try {
    const { data: responseData } = await client.get("/movies", {
      params: { isFeatured: "true", limit: "10" },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || []
    return { success: true, data: list.map(mapMovie) }
  } catch (error: any) {
    return { success: false, data: [], message: error.response?.data?.message || error.message }
  }
}

export async function getNowShowing(): Promise<ApiResponse<Movie[]>> {
  try {
    const { data: responseData } = await client.get("/movies/now-showing")
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapMovie) }
  } catch (error: any) {
    return { success: false, data: [], message: error.response?.data?.message || error.message }
  }
}

export async function getComingSoon(): Promise<ApiResponse<Movie[]>> {
  try {
    const { data: responseData } = await client.get("/movies/coming-soon")
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapMovie) }
  } catch (error: any) {
    return { success: false, data: [], message: error.response?.data?.message || error.message }
  }
}

export async function searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
  try {
    const { data: responseData } = await client.get("/movies", {
      params: { search: query, limit: "20" },
    })
    const d = extractData(responseData)
    const list = Array.isArray(d) ? d : d?.items || d?.data || []
    return { success: true, data: list.map(mapMovie) }
  } catch (error: any) {
    return { success: false, data: [], message: error.response?.data?.message || error.message }
  }
}

export async function createMovie(data: Partial<Movie>): Promise<ApiResponse<Movie>> {
  try {
    const { data: responseData } = await client.post("/movies", data)
    const d = extractData(responseData)
    return { success: true, data: mapMovie(d) }
  } catch (error: any) {
    return { success: false, data: null as any, message: error.response?.data?.message || error.message }
  }
}

export async function updateMovie(id: string, data: Partial<Movie>): Promise<ApiResponse<Movie>> {
  try {
    const { data: responseData } = await client.patch(`/movies/${id}`, data)
    const d = extractData(responseData)
    return { success: true, data: mapMovie(d) }
  } catch (error: any) {
    return { success: false, data: null as any, message: error.response?.data?.message || error.message }
  }
}

export async function deleteMovie(id: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const { data: responseData } = await client.delete(`/movies/${id}`)
    return { success: true, data: responseData?.data || responseData || { message: "Deleted" } }
  } catch (error: any) {
    return { success: false, data: null as any, message: error.response?.data?.message || error.message }
  }
}
