import type { Project, Profile } from '../types/portfolio'

// データ層抽象化 - 将来のSanity移行を容易にするため
export class DataService {
  // ブログデータ（既存のSanity）
  static async getBlogPosts() {
    try {
      // 既存のSanity client使用
      const { client } = await import('./sanity')
      console.log('🔍 Sanity client loaded:', client)
      
      const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        _createdAt,
        title,
        slug,
        publishedAt
      }`
      console.log('🔍 Executing Sanity query:', query)
      
      const result = await client.fetch(query)
      console.log('🔍 Sanity API response:', result)
      
      return result
    } catch (error) {
      console.error('❌ Sanity fetch error:', error)
      
      // フォールバック: 開発用ダミーデータを返す
      console.log('🔄 Returning fallback dummy data')
      return [
        {
          _id: 'dummy-1',
          _createdAt: '2025-01-01',
          title: 'サンプル記事 1',
          slug: { current: 'sample-post-1' },
          publishedAt: '2025-01-01'
        },
        {
          _id: 'dummy-2', 
          _createdAt: '2025-01-02',
          title: 'サンプル記事 2',
          slug: { current: 'sample-post-2' },
          publishedAt: '2025-01-02'
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
      publishedAt
    }`
    return client.fetch(query, { slug })
  }

  // ポートフォリオデータ（モック - 将来Sanity化可能）
  static async getProjects(): Promise<Project[]> {
    // 実装：ローカルデータを返す（将来はSanity APIに切り替え）
    return import('../data/projects').then(m => m.projects)
  }

  static async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjects()
    return projects.filter(p => p.featured)
  }

  static async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects()
    return projects.find(p => p.id === id) || null
  }

  // プロフィールデータ（モック - 将来Sanity化可能）
  static async getProfile(): Promise<Profile> {
    return import('../data/profile').then(m => m.profile)
  }
}

// 将来のSanity移行時は、上記メソッドの実装のみ変更すればOK