export interface Genre {
  _id?: string
  id?: string
  genre: string
  comments: string
}

export interface GenreResponse {
  genres: Genre[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
