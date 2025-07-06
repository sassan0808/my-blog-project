/**
 * API関連の型定義統合
 */
import type { Post, Category } from './post'

// API レスポンスの統一型
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  message?: string
}

// データサービスのレスポンス型
export interface PostsResponse {
  posts: Post[]
  error?: string
}

export interface CategoriesResponse {
  categories: Category[]
  error?: string
}

export interface PostResponse {
  post: Post | null
  error?: string
}

// エラー型の統一
export interface ApiError extends Error {
  code: string
  statusCode?: number
  details?: Record<string, unknown>
  source?: 'sanity' | 'network' | 'validation' | 'unknown'
}

// 環境設定エラー
export interface EnvironmentError {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// サービス状態
export interface ServiceStatus {
  sanity: {
    connected: boolean
    projectId: string
    dataset: string
    lastChecked: Date
    error?: string
  }
  environment: {
    valid: boolean
    errors: string[]
    warnings: string[]
  }
}