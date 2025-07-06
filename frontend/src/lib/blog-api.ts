import { client } from './sanity'
import type { 
  Post, 
  Category, 
  Author, 
  ApiResponse,
  PostFilters,
  PostSort,
  PostPagination,
  PostsResponse 
} from '../types/post'

/**
 * 型安全で包括的なブログAPIクライアント
 */
export class BlogApi {
  private static instance: BlogApi
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分

  static getInstance(): BlogApi {
    if (!BlogApi.instance) {
      BlogApi.instance = new BlogApi()
    }
    return BlogApi.instance
  }

  /**
   * 記事一覧を取得（フィルター・ソート・ページネーション対応）
   */
  async getPosts(
    filters: PostFilters = {},
    sort: PostSort = { field: 'publishedAt', direction: 'desc' },
    pagination: PostPagination = { page: 1, limit: 10, offset: 0 }
  ): Promise<ApiResponse<PostsResponse>> {
    try {
      const cacheKey = `posts_${JSON.stringify({ filters, sort, pagination })}`
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return { success: true, data: cached as PostsResponse }
      }

      // Sanityクエリの構築
      const conditions: string[] = ['_type == "post"']
      
      // フィルター条件
      if (filters.status) {
        conditions.push(`status == "${filters.status}"`)
      } else {
        conditions.push('status == "published"') // デフォルトで公開済みのみ
      }
      
      if (filters.category) {
        conditions.push(`"${filters.category}" in categories[]->title`)
      }
      
      if (filters.author) {
        conditions.push(`author->name match "${filters.author}"`)
      }
      
      if (filters.tag) {
        conditions.push(`"${filters.tag}" in tags`)
      }
      
      if (filters.search) {
        conditions.push(`title match "*${filters.search}*" || excerpt match "*${filters.search}*"`)
      }

      // 基本クエリ
      const baseQuery = `*[${conditions.join(' && ')}]`
      
      // ソート
      const sortField = sort.field === 'publishedAt' ? 'publishedAt' : sort.field
      const sortDirection = sort.direction === 'desc' ? 'desc' : 'asc'
      const sortClause = `| order(${sortField} ${sortDirection})`
      
      // ページネーション
      const paginationClause = `[${pagination.offset}...${pagination.offset + pagination.limit}]`
      
      // フィールド選択
      const fields = `{
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        publishedAt,
        status,
        tags,
        metaTitle,
        metaDescription,
        "author": author->{
          _id,
          name,
          slug
        },
        "categories": categories[]->{
          _id,
          title,
          description,
          slug,
          color,
          order,
          isActive
        },
        "mainImage": mainImage{
          "asset": asset->{
            url
          },
          alt
        }
      }`

      // 最終クエリ
      const query = `${baseQuery} ${sortClause} ${paginationClause} ${fields}`
      
      // 総数を取得
      const countQuery = `count(${baseQuery})`
      
      const [posts, total] = await Promise.all([
        client.fetch<Post[]>(query),
        client.fetch<number>(countQuery)
      ])

      const result: PostsResponse = {
        posts,
        total,
        page: pagination.page,
        limit: pagination.limit,
        hasMore: pagination.offset + pagination.limit < total
      }

      this.setCache(cacheKey, result)
      
      return { success: true, data: result }

    } catch (error) {
      console.error('記事取得エラー:', error)
      return {
        success: false,
        data: null,
        error: this.formatError(error)
      }
    }
  }

  /**
   * 記事詳細を取得
   */
  async getPost(slug: string): Promise<ApiResponse<Post>> {
    try {
      const cacheKey = `post_${slug}`
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return { success: true, data: cached as Post }
      }

      const query = `*[_type == "post" && slug.current == $slug][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        status,
        tags,
        metaTitle,
        metaDescription,
        noIndex,
        "author": author->{
          _id,
          name,
          slug
        },
        "categories": categories[]->{
          _id,
          title,
          description,
          slug,
          color,
          order,
          isActive
        },
        "mainImage": mainImage{
          "asset": asset->{
            url
          },
          alt
        }
      }`

      const post = await client.fetch<Post>(query, { slug })
      
      if (!post) {
        return {
          success: false,
          data: null,
          error: '記事が見つかりませんでした'
        }
      }

      this.setCache(cacheKey, post)
      
      return { success: true, data: post }

    } catch (error) {
      console.error('記事詳細取得エラー:', error)
      return {
        success: false,
        data: null,
        error: this.formatError(error)
      }
    }
  }

  /**
   * カテゴリー一覧を取得
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const cacheKey = 'categories'
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return { success: true, data: cached as Category[] }
      }

      const query = `*[_type == "category" && isActive == true] | order(order asc, title asc) {
        _id,
        title,
        description,
        slug,
        color,
        order,
        isActive
      }`

      const categories = await client.fetch<Category[]>(query)
      
      this.setCache(cacheKey, categories)
      
      return { success: true, data: categories }

    } catch (error) {
      console.error('カテゴリー取得エラー:', error)
      return {
        success: false,
        data: null,
        error: this.formatError(error)
      }
    }
  }

  /**
   * 著者一覧を取得
   */
  async getAuthors(): Promise<ApiResponse<Author[]>> {
    try {
      const cacheKey = 'authors'
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return { success: true, data: cached as Author[] }
      }

      const query = `*[_type == "author"] | order(name asc) {
        _id,
        name,
        slug
      }`

      const authors = await client.fetch<Author[]>(query)
      
      this.setCache(cacheKey, authors)
      
      return { success: true, data: authors }

    } catch (error) {
      console.error('著者取得エラー:', error)
      return {
        success: false,
        data: null,
        error: this.formatError(error)
      }
    }
  }

  /**
   * 関連記事を取得
   */
  async getRelatedPosts(postId: string, limit: number = 3): Promise<ApiResponse<Post[]>> {
    try {
      const cacheKey = `related_${postId}_${limit}`
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return { success: true, data: cached as Post[] }
      }

      // 現在の記事のカテゴリーを取得
      const currentPost = await client.fetch<{ categories: string[] }>(
        `*[_type == "post" && _id == $postId][0] { "categories": categories[]->title }`,
        { postId }
      )

      if (!currentPost || !currentPost.categories?.length) {
        return { success: true, data: [] }
      }

      // 同じカテゴリーの他の記事を取得
      const query = `*[
        _type == "post" && 
        status == "published" && 
        _id != $postId && 
        count((categories[]->title)[@ in $categories]) > 0
      ] | order(publishedAt desc) [0...$limit] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "categories": categories[]->{
          _id,
          title,
          color
        }
      }`

      const relatedPosts = await client.fetch<Post[]>(query, {
        postId,
        categories: currentPost.categories,
        limit
      })

      this.setCache(cacheKey, relatedPosts)
      
      return { success: true, data: relatedPosts }

    } catch (error) {
      console.error('関連記事取得エラー:', error)
      return {
        success: false,
        data: null,
        error: this.formatError(error)
      }
    }
  }

  /**
   * キャッシュクリア
   */
  clearCache(): void {
    this.cache.clear()
  }

  // Private Methods

  private getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`📦 Cache hit: ${key}`)
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    return '不明なエラーが発生しました'
  }
}

// シングルトンインスタンス
export const blogApi = BlogApi.getInstance()

// 便利な関数をエクスポート
export const getBlogPosts = (filters?: PostFilters, sort?: PostSort, pagination?: PostPagination) =>
  blogApi.getPosts(filters, sort, pagination)

export const getBlogPost = (slug: string) =>
  blogApi.getPost(slug)

export const getBlogCategories = () =>
  blogApi.getCategories()

export const getBlogAuthors = () =>
  blogApi.getAuthors()

export const getRelatedPosts = (postId: string, limit?: number) =>
  blogApi.getRelatedPosts(postId, limit)