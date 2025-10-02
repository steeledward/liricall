// src/interfaces/User.interface.ts
export interface Referer {
  _id?: string
  content: string
  createdAt: Date
}

export interface RefererResponse {
  referers: Referer[]
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
