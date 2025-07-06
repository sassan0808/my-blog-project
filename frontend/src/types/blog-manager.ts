// BlogManager用の型定義

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  author: string
  categories?: string[]
  tags?: string[]
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string
  metaTitle?: string
  metaDescription?: string
  noIndex?: boolean
}

export interface UpdatePostInput {
  title?: string
  content?: string
  excerpt?: string
  categories?: string[]
  tags?: string[]
  status?: 'draft' | 'published' | 'archived'
  publishedAt?: string
  metaTitle?: string
  metaDescription?: string
  noIndex?: boolean
}

export interface BlogPost {
  _id: string
  _type: 'post'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  body: any[] // Portable Text blocks
  author: {
    _ref: string
    _type: 'reference'
  }
  categories: Array<{
    _ref: string
    _type: 'reference'
  }>
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  publishedAt: string
  metaTitle?: string
  metaDescription?: string
  noIndex: boolean
}

export interface BlogCategory {
  _id: string
  _type: 'category'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
  }
  description: string
  color: string
  order: number
  isActive: boolean
}

export interface BlogAuthor {
  _id: string
  _type: 'author'
  _createdAt: string
  _updatedAt: string
  name: string
  slug: {
    current: string
  }
}

export interface BlogManagerOptions {
  draftByDefault?: boolean
  autoPublish?: boolean
  validateContent?: boolean
}

export interface OperationResult<T> {
  success: boolean
  data: T | null
  error?: string
  message?: string
}

// バイブコーディング用の便利な型
export interface ChatBlogInput {
  /** 記事のタイトル */
  title: string
  /** 記事の内容（マークダウン形式可） */
  content: string
  /** 著者名（デフォルト: Claude AI Assistant） */
  author?: string
  /** カテゴリー名の配列（例: ['AI活用', '組織変革']） */
  categories?: string[]
  /** すぐに公開するか（デフォルト: false = 下書き） */
  publish?: boolean
}

// エラー型
export interface ValidationError {
  field: string
  message: string
}

export interface BlogError extends Error {
  code: string
  field?: string
  details?: any
}