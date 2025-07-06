import { type PortableTextBlock } from '@portabletext/types'

export interface Category {
  _id: string
  title: string
  description?: string
  slug?: {
    current: string
  }
  color?: string
  order?: number
  isActive?: boolean
}

export interface Author {
  _id: string
  name: string
  slug?: {
    current: string
  }
}

export interface Post {
  _id: string
  _createdAt: string
  _updatedAt?: string
  title: string
  slug: {
    current: string
  } | null
  excerpt?: string
  body?: PortableTextBlock[]
  publishedAt: string
  status?: 'draft' | 'published' | 'archived'
  categories?: Category[]
  tags?: string[]
  author?: Author
  metaTitle?: string
  metaDescription?: string
  noIndex?: boolean
  mainImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  message?: string
}

// エラー型
export interface BlogApiError extends Error {
  code: string
  statusCode?: number
  details?: Record<string, unknown>
}

// フィルター・ソート・ページネーション
export interface PostFilters {
  category?: string
  status?: 'draft' | 'published' | 'archived'
  author?: string
  tag?: string
  search?: string
}

export interface PostSort {
  field: 'publishedAt' | 'title' | '_createdAt' | '_updatedAt'
  direction: 'asc' | 'desc'
}

export interface PostPagination {
  page: number
  limit: number
  offset: number
}

export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}