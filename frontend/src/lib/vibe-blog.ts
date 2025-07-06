import { BlogManager } from './blog-manager'
import type { ChatBlogInput, OperationResult, BlogPost } from '../types/blog-manager'

/**
 * バイブコーディング専用のブログインターフェース
 * 自然言語での指示から記事を作成・管理する
 */
export class VibeBlog {
  private manager: BlogManager

  constructor() {
    this.manager = new BlogManager({
      draftByDefault: true,
      validateContent: true
    })
  }

  /**
   * チャットでブログを作成
   * 使用例: 
   * - writeBlog({ title: "AIの未来", content: "AIは...", author: "佐々木" })
   * - writeBlog({ title: "React入門", content: "Reactは...", categories: ["技術"], publish: true })
   */
  async writeBlog(input: ChatBlogInput): Promise<OperationResult<BlogPost>> {
    console.log('🚀 バイブコーディングでブログを作成中...')
    console.log(`📝 タイトル: ${input.title}`)
    console.log(`👤 著者: ${input.author || 'Claude AI Assistant'}`)
    console.log(`📁 カテゴリー: ${input.categories?.join(', ') || 'なし'}`)
    console.log(`🔄 ステータス: ${input.publish ? '公開' : '下書き'}`)

    const result = await this.manager.createPost({
      title: input.title,
      content: input.content,
      author: input.author || 'Claude AI Assistant',
      categories: input.categories,
      status: input.publish ? 'published' : 'draft'
    })

    if (result.success) {
      console.log('✅ ブログ作成完了!')
      console.log(`🔗 記事ID: ${result.data?._id}`)
      console.log(`🌐 URL: http://localhost:5173/blog/${result.data?.slug.current}`)
    } else {
      console.error('❌ ブログ作成失敗:', result.error)
    }

    return result
  }

  /**
   * 記事を編集
   * 使用例: editBlog("記事ID", { title: "新しいタイトル" })
   */
  async editBlog(id: string, updates: Partial<ChatBlogInput>): Promise<OperationResult<BlogPost>> {
    console.log('📝 記事を編集中...')
    
    const result = await this.manager.updatePost(id, {
      title: updates.title,
      content: updates.content,
      categories: updates.categories,
      status: updates.publish ? 'published' : undefined
    })

    if (result.success) {
      console.log('✅ 記事編集完了!')
    } else {
      console.error('❌ 記事編集失敗:', result.error)
    }

    return result
  }

  /**
   * 記事を公開
   */
  async publishBlog(id: string): Promise<OperationResult<BlogPost>> {
    console.log('🚀 記事を公開中...')
    
    const result = await this.manager.publishPost(id)

    if (result.success) {
      console.log('✅ 記事を公開しました!')
    }

    return result
  }

  /**
   * 記事を下書きに戻す
   */
  async unpublishBlog(id: string): Promise<OperationResult<BlogPost>> {
    console.log('📝 記事を下書きに戻し中...')
    
    const result = await this.manager.unpublishPost(id)

    if (result.success) {
      console.log('✅ 記事を下書きに戻しました!')
    }

    return result
  }

  /**
   * カテゴリーを追加
   */
  async addCategory(name: string, description?: string): Promise<OperationResult<{ _id: string; title: string; description?: string }>> {
    console.log(`📁 カテゴリー「${name}」を作成中...`)
    
    const result = await this.manager.createCategory(name, description)

    if (result.success) {
      console.log('✅ カテゴリー作成完了!')
    }

    return result
  }
}

// シングルトンインスタンス
export const vibeBlog = new VibeBlog()

// 便利な関数をエクスポート
export async function writeBlog(input: ChatBlogInput) {
  return vibeBlog.writeBlog(input)
}

export async function publishBlog(id: string) {
  return vibeBlog.publishBlog(id)
}

export async function editBlog(id: string, updates: Partial<ChatBlogInput>) {
  return vibeBlog.editBlog(id, updates)
}

export async function addCategory(name: string, description?: string) {
  return vibeBlog.addCategory(name, description)
}

// テンプレート関数
export const blogTemplates = {
  /**
   * AI関連記事のテンプレート
   */
  aiPost: (topic: string, content: string) => writeBlog({
    title: `AI活用実践：${topic}`,
    content,
    categories: ['AI活用'],
    author: '佐々木'
  }),

  /**
   * 技術記事のテンプレート
   */
  techPost: (title: string, content: string) => writeBlog({
    title,
    content,
    categories: ['技術'],
    author: '佐々木'
  }),

  /**
   * 体験談記事のテンプレート
   */
  experiencePost: (title: string, content: string) => writeBlog({
    title,
    content,
    categories: ['体験談'],
    author: '佐々木'
  })
}