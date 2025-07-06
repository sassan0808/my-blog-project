import type { Project, Profile } from '../types/portfolio'
import type { Category, Post } from '../types/post'
import type { PostsResponse, CategoriesResponse } from '../types/api'

// Improved cache implementation with performance optimization
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (increased for better performance)

function getCached(key: string): unknown | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Cache hit for ${key}`)
    return cached.data
  }
  console.log(`📦 Cache miss for ${key}`)
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// データ層抽象化 - 将来のSanity移行を容易にするため
export class DataService {
  // ブログデータ（既存のSanity）
  static async getBlogPosts(): Promise<PostsResponse> {
    const cacheKey = 'blog-posts'
    
    // キャッシュチェック
    const cached = getCached(cacheKey)
    if (cached) {
      return { posts: cached as Post[] }
    }
    
    try {
      console.log('🚀 DataService.getBlogPosts() 開始...')
      
      // 環境変数確認
      console.log('📊 環境変数確認:')
      console.log('  VITE_SANITY_PROJECT_ID:', import.meta.env.VITE_SANITY_PROJECT_ID)
      console.log('  VITE_SANITY_DATASET:', import.meta.env.VITE_SANITY_DATASET)
      console.log('  VITE_SANITY_TOKEN:', import.meta.env.VITE_SANITY_TOKEN ? '[PRESENT]' : '[MISSING]')
      
      // 統一されたSanity clientを使用
      const { default: sanityClient, logSanityStatus, testSanityConnection } = await import('./sanity-unified')
      
      logSanityStatus()
      
      // 接続テストを実行
      const isConnected = await testSanityConnection()
      if (!isConnected) {
        throw new Error('Sanity connection test failed')
      }
      
      const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) {
        _id,
        _createdAt,
        title,
        slug,
        publishedAt,
        status,
        "categories": categories[]->{
          _id,
          title,
          description
        }
      }`
      console.log('🔍 Executing Sanity query:', query)
      
      console.log('⏳ Sanity API呼び出し中...')
      const result = await sanityClient.fetch(query)
      console.log('✅ Sanity API response received!')
      console.log('🔍 Raw Sanity response:', result)
      console.log(`📊 Found ${result?.length || 0} posts`)
      
      if (!result || !Array.isArray(result)) {
        console.error('❌ Unexpected response format:', typeof result)
        throw new Error('Invalid response format from Sanity')
      }
      
      // publishedステータスの記事のみフィルター
      const publishedPosts = result.filter((post: { status?: string; slug?: { current: string } }) => 
        post.status === 'published' && post.slug?.current && post.slug.current !== ''
      )
      console.log(`📊 Published posts with valid slugs: ${publishedPosts.length}`)
      
      // Cache the result
      setCache(cacheKey, publishedPosts)
      
      return { posts: publishedPosts }
    } catch (error) {
      console.error('❌ Sanity fetch error:', error)
      
      // エラー分析を実行
      const { analyzeSanityError } = await import('./sanity-unified')
      const analysis = analyzeSanityError(error)
      
      console.error('❌ Error Analysis:', analysis)
      console.error('💡 Suggestions:', analysis.suggestions)
      
      // エラー詳細を含む情報を返す
      const errorMessage = `Sanity接続エラー (${analysis.type}): ${analysis.message}`
      console.log('🔄 Returning fallback dummy data due to Sanity error')
      console.log('🔄 User will see sample posts with error info')
      
      return {
        posts: [
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
        ],
        error: errorMessage
      }
    }
  }

  static async getBlogPost(slug: string) {
    try {
      const { default: sanityClient } = await import('./sanity-unified')
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
      return await sanityClient.fetch(query, { slug })
    } catch (error) {
      console.error('❌ Individual post fetch error:', error)
      return null
    }
  }

  static async getCategories(): Promise<CategoriesResponse> {
    const cacheKey = 'categories'
    
    // Check cache first
    const cached = getCached(cacheKey)
    if (cached) {
      return { categories: cached as Category[] }
    }
    
    try {
      const { default: sanityClient } = await import('./sanity-unified')
      const query = `*[_type == "category"] | order(title asc) {
        _id,
        title,
        description
      }`
      const result = await sanityClient.fetch(query)
      
      // Cache the result
      setCache(cacheKey, result)
      
      return { categories: result }
    } catch (error) {
      console.error('❌ Categories fetch error:', error)
      
      // エラー分析
      const { analyzeSanityError } = await import('./sanity-unified')
      const analysis = analyzeSanityError(error)
      
      // フォールバック: デフォルトカテゴリー
      const errorMessage = `カテゴリー取得エラー (${analysis.type}): ${analysis.message}`
      return {
        categories: [
          { _id: 'ai', title: 'AI活用', description: 'AI技術の活用方法やトレンド' },
          { _id: 'org', title: '組織変革', description: '組織改革やマネジメント' },
          { _id: 'wellbeing', title: 'Well-being', description: '心身の健康と幸福' }
        ],
        error: errorMessage
      }
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