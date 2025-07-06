import { client } from './sanity-node'
import { createUniqueSlug } from './slug-utils'
import type { 
  CreatePostInput, 
  UpdatePostInput, 
  BlogPost, 
  BlogCategory, 
  BlogAuthor,
  BlogManagerOptions,
  OperationResult 
} from '../types/blog-manager'

/**
 * 統一されたブログ管理インターフェース
 * バイブコーディングから記事の作成・編集・管理を行う
 */
export class BlogManager {
  private options: BlogManagerOptions

  constructor(options: BlogManagerOptions = {}) {
    this.options = {
      draftByDefault: true,
      autoPublish: false,
      validateContent: true,
      ...options
    }
  }

  /**
   * 新しいブログ記事を作成
   */
  async createPost(input: CreatePostInput): Promise<OperationResult<BlogPost>> {
    try {
      // バリデーション
      const validation = this.validatePostInput(input)
      if (!validation.isValid) {
        return {
          success: false,
          error: `バリデーションエラー: ${validation.errors.join(', ')}`,
          data: null
        }
      }

      // 著者の取得または作成
      const authorId = await this.ensureAuthor(input.author)
      
      // カテゴリーの取得または作成
      const categoryIds = await this.ensureCategories(input.categories || [])

      // Portable Text形式の本文作成
      const body = this.convertToPortableText(input.content)

      // スラッグ生成
      const slug = createUniqueSlug(input.title)

      // ドキュメント作成
      const doc = {
        _type: 'post',
        title: input.title,
        slug: {
          _type: 'slug',
          current: slug
        },
        excerpt: input.excerpt || this.generateExcerpt(input.content),
        body,
        author: {
          _type: 'reference',
          _ref: authorId
        },
        categories: categoryIds.map(id => ({
          _type: 'reference',
          _ref: id
        })),
        tags: input.tags || [],
        status: input.status || (this.options.draftByDefault ? 'draft' : 'published'),
        publishedAt: input.publishedAt || new Date().toISOString(),
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        noIndex: input.noIndex || false,
      }

      const result = await client.create(doc)
      
      return {
        success: true,
        data: result as unknown as BlogPost,
        message: `記事「${input.title}」を${doc.status === 'published' ? '公開' : '下書き保存'}しました`
      }

    } catch (error) {
      console.error('記事作成エラー:', error)
      return {
        success: false,
        error: `記事作成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        data: null
      }
    }
  }

  /**
   * 記事を更新
   */
  async updatePost(id: string, input: UpdatePostInput): Promise<OperationResult<BlogPost>> {
    try {
      const patches: Record<string, unknown> = {}

      if (input.title) patches.title = input.title
      if (input.content) patches.body = this.convertToPortableText(input.content)
      if (input.excerpt) patches.excerpt = input.excerpt
      if (input.status) patches.status = input.status
      if (input.categories) {
        const categoryIds = await this.ensureCategories(input.categories)
        patches.categories = categoryIds.map(id => ({
          _type: 'reference',
          _ref: id
        }))
      }
      if (input.tags) patches.tags = input.tags
      if (input.metaTitle) patches.metaTitle = input.metaTitle
      if (input.metaDescription) patches.metaDescription = input.metaDescription

      const result = await client
        .patch(id)
        .set(patches)
        .commit()

      return {
        success: true,
        data: result as unknown as BlogPost,
        message: `記事を更新しました`
      }

    } catch (error) {
      console.error('記事更新エラー:', error)
      return {
        success: false,
        error: `記事更新に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        data: null
      }
    }
  }

  /**
   * 記事を公開
   */
  async publishPost(id: string): Promise<OperationResult<BlogPost>> {
    return this.updatePost(id, { 
      status: 'published',
      publishedAt: new Date().toISOString()
    })
  }

  /**
   * 記事を下書きに戻す
   */
  async unpublishPost(id: string): Promise<OperationResult<BlogPost>> {
    return this.updatePost(id, { status: 'draft' })
  }

  /**
   * 記事を削除（アーカイブ）
   */
  async archivePost(id: string): Promise<OperationResult<void>> {
    try {
      await client
        .patch(id)
        .set({ status: 'archived' })
        .commit()

      return {
        success: true,
        data: undefined,
        message: '記事をアーカイブしました'
      }
    } catch (error) {
      console.error('記事アーカイブエラー:', error)
      return {
        success: false,
        error: `記事アーカイブに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        data: null
      }
    }
  }

  /**
   * カテゴリーを作成
   */
  async createCategory(name: string, description?: string, color?: string): Promise<OperationResult<BlogCategory>> {
    try {
      const slug = createUniqueSlug(name)
      
      const doc = {
        _type: 'category',
        title: name,
        slug: {
          _type: 'slug',
          current: slug
        },
        description: description || '',
        color: color || 'blue',
        order: 0,
        isActive: true
      }

      const result = await client.create(doc)
      
      return {
        success: true,
        data: result as unknown as BlogCategory,
        message: `カテゴリー「${name}」を作成しました`
      }

    } catch (error) {
      console.error('カテゴリー作成エラー:', error)
      return {
        success: false,
        error: `カテゴリー作成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        data: null
      }
    }
  }

  /**
   * 著者を作成
   */
  async createAuthor(name: string): Promise<OperationResult<BlogAuthor>> {
    try {
      const slug = createUniqueSlug(name)
      
      const doc = {
        _type: 'author',
        name,
        slug: {
          _type: 'slug',
          current: slug
        }
      }

      const result = await client.create(doc)
      
      return {
        success: true,
        data: result as unknown as BlogAuthor,
        message: `著者「${name}」を作成しました`
      }

    } catch (error) {
      console.error('著者作成エラー:', error)
      return {
        success: false,
        error: `著者作成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        data: null
      }
    }
  }

  // Private Methods

  private validatePostInput(input: CreatePostInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!input.title || input.title.trim().length < 5) {
      errors.push('タイトルは5文字以上で入力してください')
    }

    if (!input.content || input.content.trim().length < 10) {
      errors.push('本文は10文字以上で入力してください')
    }

    if (!input.author || input.author.trim().length < 1) {
      errors.push('著者名は必須です')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private async ensureAuthor(name: string): Promise<string> {
    // 既存の著者を検索
    const existingAuthor = await client.fetch(
      `*[_type == "author" && name == $name][0]`,
      { name }
    )

    if (existingAuthor) {
      return existingAuthor._id
    }

    // 新しい著者を作成
    const result = await this.createAuthor(name)
    if (!result.success || !result.data) {
      throw new Error(`著者「${name}」の作成に失敗しました`)
    }

    return result.data._id
  }

  private async ensureCategories(categories: string[]): Promise<string[]> {
    const categoryIds: string[] = []

    for (const categoryName of categories) {
      // 既存のカテゴリーを検索
      const existingCategory = await client.fetch(
        `*[_type == "category" && title == $title][0]`,
        { title: categoryName }
      )

      if (existingCategory) {
        categoryIds.push(existingCategory._id)
      } else {
        // 新しいカテゴリーを作成
        const result = await this.createCategory(categoryName)
        if (result.success && result.data) {
          categoryIds.push(result.data._id)
        }
      }
    }

    return categoryIds
  }

  private convertToPortableText(content: string) {
    // 段落ごとに分割してPortable Text形式に変換
    return content.split('\n\n').map(paragraph => ({
      _type: 'block',
      _key: this.generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: this.generateKey(),
          text: paragraph.trim(),
          marks: []
        }
      ]
    }))
  }

  private generateExcerpt(content: string): string {
    return content
      .split('\n\n')[0] // 最初の段落を取得
      .slice(0, 150) // 150文字に制限
      .trim() + (content.length > 150 ? '...' : '')
  }

  private generateKey(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}