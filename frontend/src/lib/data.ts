import type { Project, Profile } from '../types/portfolio'
import type { Category } from '../types/post'

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCached(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Cache hit for ${key}`)
    return cached.data
  }
  console.log(`📦 Cache miss for ${key}`)
  return null
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// データ層抽象化 - 将来のSanity移行を容易にするため
export class DataService {
  // ブログデータ（既存のSanity）
  static async getBlogPosts() {
    const cacheKey = 'blog-posts'
    
    // Check cache first
    const cached = getCached(cacheKey)
    if (cached) {
      return cached
    }
    
    try {
      // 既存のSanity client使用
      const { client } = await import('./sanity')
      console.log('🔍 Sanity client loaded:', client)
      
      const query = `*[_type == "post" && defined(slug.current) && slug.current != ""] | order(publishedAt desc) {
        _id,
        _createdAt,
        title,
        slug,
        publishedAt,
        "categories": categories[]->{
          _id,
          title,
          description
        }
      }`
      console.log('🔍 Executing Sanity query:', query)
      
      const result = await client.fetch(query)
      console.log('🔍 Sanity API response:', result)
      console.log(`📊 Found ${result.length} posts`)
      
      // Filter out posts with empty slugs just in case
      const validPosts = result.filter((post: any) => post.slug?.current && post.slug.current !== '')
      console.log(`📊 Valid posts after filtering: ${validPosts.length}`)
      
      // Cache the result
      setCache(cacheKey, validPosts)
      
      return validPosts
    } catch (error) {
      console.error('❌ Sanity fetch error:', error)
      console.error('❌ Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      })
      
      // フォールバック: 開発用ダミーデータを返す
      console.log('🔄 Returning fallback dummy data')
      return [
        {
          _id: 'dummy-1',
          _createdAt: '2025-01-01',
          title: 'サンプル記事 1',
          slug: { current: 'sample-post-1' },
          publishedAt: '2025-01-01',
          categories: []
        },
        {
          _id: 'dummy-2', 
          _createdAt: '2025-01-02',
          title: 'サンプル記事 2',
          slug: { current: 'sample-post-2' },
          publishedAt: '2025-01-02',
          categories: []
        }
      ]
    }
  }

  static async getBlogPost(slug: string) {
    const { client } = await import('./sanity')
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      slug,
      body,
      publishedAt,
      "categories": categories[]->{
        _id,
        title,
        description
      }
    }`
    return client.fetch(query, { slug })
  }

  static async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories'
    
    // Check cache first
    const cached = getCached(cacheKey)
    if (cached) {
      return cached
    }
    
    try {
      const { client } = await import('./sanity')
      const query = `*[_type == "category"] | order(title asc) {
        _id,
        title,
        description
      }`
      const result = await client.fetch(query)
      
      // Cache the result
      setCache(cacheKey, result)
      
      return result
    } catch (error) {
      console.error('❌ Categories fetch error:', error)
      // フォールバック: デフォルトカテゴリー
      return [
        { _id: 'ai', title: 'AI活用', description: 'AI技術の活用方法やトレンド' },
        { _id: 'org', title: '組織変革', description: '組織改革やマネジメント' },
        { _id: 'wellbeing', title: 'Well-being', description: '心身の健康と幸福' }
      ]
    }
  }

  // ポートフォリオデータ（モック - 将来Sanity化可能）
  static async getProjects(): Promise<Project[]> {
    // 実装：ローカルデータを返す（将来はSanity APIに切り替え）
    return import('../data/projects').then(m => m.projects)
  }

  static async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjects()
    return projects.filter((p: Project) => p.featured)
  }

  static async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects()
    return projects.find((p: Project) => p.id === id) || null
  }

  // プロフィールデータ（モック - 将来Sanity化可能）
  static async getProfile(): Promise<Profile> {
    return import('../data/profile').then(m => m.profile)
  }
}

// 将来のSanity移行時は、上記メソッドの実装のみ変更すればOK