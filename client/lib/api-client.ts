import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "")

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Token management
let accessToken: string | null = null
let tokenPromise: Promise<string> | null = null

// Function to fetch new access token
async function fetchAccessToken(): Promise<string> {
  try {
    console.log("[v0] Fetching access token from:", `${API_BASE_URL}/api/token`)
    const response = await axios.get(`${API_BASE_URL}/api/token`)
    accessToken = response.data.access_token
    console.log("[v0] Access token received successfully")
    return accessToken!
  } catch (error) {
    console.error("[v0] Failed to fetch access token:", error)
    throw error
  }
}

// Function to get access token (with deduplication)
async function getAccessToken(): Promise<string> {
  if (accessToken) {
    return accessToken
  }

  if (!tokenPromise) {
    tokenPromise = fetchAccessToken().finally(() => {
      tokenPromise = null
    })
  }

  return tokenPromise
}

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token for /token endpoint
    if (config.url?.includes("/token")) {
      return config
    }

    const token = await getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log("[v0] Request URL:", config.baseURL + config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 or 403 and we haven't retried yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true
      console.log("[v0] Received 401/403, refreshing token...")

      try {
        // Clear old token and fetch new one
        accessToken = null
        const newToken = await fetchAccessToken()

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error("[v0] Token refresh failed:", refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API functions
export interface Recitation {
  id: number
  reciter_name: string
  style: string
  translated_name: {
    language_name: string
    name: string
  }
}

export interface Chapter {
  id: number
  revelation_place: string
  revelation_order: number
  bismillah_pre: boolean
  name_simple: string
  name_complex: string
  name_arabic: string
  verses_count: number
  pages: [number, number]
  translated_name: {
    language_name: string
    name: string
  }
}

export interface ChaptersResponse {
  chapters: Chapter[]
}

export interface AudioFile {
  verse_key: string
  url: string
}

export interface AudioFilesResponse {
  audio_files: AudioFile[]
  pagination: {
    per_page: number
    current_page: number
    next_page: number | null
    total_pages: number
    total_records: number
  }
}

export interface UthmaniVerse {
  id: number
  verse_key: string
  text_uthmani: string
}

export interface VersesResponse {
  verses: UthmaniVerse[]
}

export const api = {
  getChapters: async () => {
    console.log("[v0] Fetching chapters")
    const response = await apiClient.get<ChaptersResponse>(`/api/chapters`)
    console.log("[v0] Chapters received:", response.data.chapters.length)
    return response.data.chapters
  },

  getReciters: async (language = "en") => {
    console.log("[v0] Fetching reciters with language:", language)
    const response = await apiClient.get<{ recitations: Recitation[] }>(`/api/reciters?language=${language}`)
    console.log("[v0] Reciters received:", response.data.recitations.length)
    return response.data.recitations
  },

  getAudioFilesByRub: async (recitationId: number, rubNumber: number) => {
    console.log("[v0] Fetching audio files for rub:", rubNumber, "recitation:", recitationId)
    const response = await apiClient.get<AudioFilesResponse>(
      `/api/reciters/recitations/${recitationId}/by_rub/${rubNumber}`,
    )
    console.log("[v0] Audio files received:", response.data.audio_files.length)
    return response.data
  },

  getAudioFilesByJuz: async (recitationId: number, juzNumber: number) => {
    console.log("[v0] Fetching audio files for juz:", juzNumber, "recitation:", recitationId)
    const response = await apiClient.get<AudioFilesResponse>(
      `/api/reciters/recitations/${recitationId}/by_juz/${juzNumber}`,
    )
    console.log("[v0] Audio files received:", response.data.audio_files.length)
    return response.data
  },

  getAudioFilesByHizb: async (recitationId: number, hizbNumber: number) => {
    console.log("[v0] Fetching audio files for hizb:", hizbNumber, "recitation:", recitationId)
    const response = await apiClient.get<AudioFilesResponse>(
      `/api/reciters/recitations/${recitationId}/by_hizb/${hizbNumber}`,
    )
    console.log("[v0] Audio files received:", response.data.audio_files.length)
    return response.data
  },

  getUthmaniVerses: async (params?: {
    chapter_number?: number
    juz_number?: number
    hizb_number?: number
    rub_el_hizb_number?: number
    verse_key?: string
  }) => {
    console.log("[v0] Fetching Uthmani verses with params:", params)
    const queryParams = new URLSearchParams()
    if (params?.chapter_number) queryParams.append("chapter_number", params.chapter_number.toString())
    if (params?.juz_number) queryParams.append("juz_number", params.juz_number.toString())
    if (params?.hizb_number) queryParams.append("hizb_number", params.hizb_number.toString())
    if (params?.rub_el_hizb_number) queryParams.append("rub_el_hizb_number", params.rub_el_hizb_number.toString())
    if (params?.verse_key) queryParams.append("verse_key", params.verse_key)

    const url = `/api/verses/uthmani${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await apiClient.get<VersesResponse>(url)
    console.log("[v0] Uthmani verses received:", response.data.verses.length)
    return response.data.verses
  },
}
