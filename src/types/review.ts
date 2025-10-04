// src/interfaces/User.interface.ts
export interface Review {
  _id?: string
  id?: string
  review: string
  date: Date
  user_id?: string
  library_id?: string
}

export interface ReviewResponse {
  reviews: Review[]
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
