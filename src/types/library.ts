// src/interfaces/User.interface.ts
export interface Library {
  _id?: string
  ID: string
  Title: string
  Story: string
  Lyric: string
  Date?: Date
}

export interface LibraryResponse {
  libraries: Library[]
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
