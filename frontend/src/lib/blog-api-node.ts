import { client } from './sanity-node'
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
 * Node.js環境用のブログAPIクライアント
 */
export class BlogApiNode {
  /**
   * 記事一覧を取得
   */
  async getPosts(
    filters: PostFilters = {},
    sort: PostSort = { field: 'publishedAt', direction: 'desc' },
    pagination: PostPagination = { page: 1, limit: 10, offset: 0 }
  ): Promise<ApiResponse<PostsResponse>> {
    try {
      // Sanityクエリの構築
      let conditions: string[] = ['_type == "post"']
      
      if (filters.status) {
        conditions.push(`status == "${filters.status}"`)
      } else {
        conditions.push('status == "published"')
      }
      
      if (filters.category) {
        conditions.push(`"${filters.category}" in categories[]->title`)
      }

      const baseQuery = `*[${conditions.join(' && ')}]`
      const sortField = sort.field === 'publishedAt' ? 'publishedAt' : sort.field
      const sortDirection = sort.direction === 'desc' ? 'desc' : 'asc'
      const sortClause = `| order(${sortField} ${sortDirection})`
      const paginationClause = `[${pagination.offset}...${pagination.offset + pagination.limit}]`
      
      const fields = `{
        _id,
        _createdAt,
        title,
        slug,
        excerpt,
        publishedAt,
        status,
        "author": author->{
          _id,
          name
        },
        "categories": categories[]->{
          _id,
          title,
          color
        }
      }`

      const query = `${baseQuery} ${sortClause} ${paginationClause} ${fields}`
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
   * カテゴリー一覧を取得
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const query = `*[_type == "category"] | order(title asc) {
        _id,
        title,
        description,
        color
      }`

      const categories = await client.fetch<Category[]>(query)
      
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

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    return '不明なエラーが発生しました'
  }
}

// インスタンス作成
export const blogApiNode = new BlogApiNode()

// 便利な関数をエクスポート
export const getBlogPosts = (filters?: PostFilters, sort?: PostSort, pagination?: PostPagination) =>
  blogApiNode.getPosts(filters, sort, pagination)

export const getBlogCategories = () =>
  blogApiNode.getCategories()