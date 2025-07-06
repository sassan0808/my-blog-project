// フロントエンド用のSanity接続テスト
import { client } from './lib/sanity.js'

console.log('🔍 フロントエンドSanity接続テスト開始...')

// 環境変数確認
console.log('📊 環境変数:')
console.log('  PROJECT_ID:', import.meta.env.VITE_SANITY_PROJECT_ID)
console.log('  DATASET:', import.meta.env.VITE_SANITY_DATASET)
console.log('  API_VERSION:', import.meta.env.VITE_SANITY_API_VERSION)
console.log('  TOKEN:', import.meta.env.VITE_SANITY_TOKEN ? '[PRESENT]' : '[MISSING]')

// 基本接続テスト
try {
  console.log('🔗 基本接続テスト...')
  const healthCheck = await client.fetch('*[_type == "post"][0]')
  console.log('✅ 接続成功! サンプルデータ:', healthCheck?._id || 'データなし')
} catch (error) {
  console.error('❌ 接続エラー:', error)
}

// 全記事取得テスト
try {
  console.log('📝 全記事取得テスト...')
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    status,
    publishedAt
  }`
  const posts = await client.fetch(query)
  console.log(`📊 取得した記事数: ${posts.length}`)
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`)
    console.log(`   Status: ${post.status}`)
    console.log(`   Slug: ${post.slug?.current || '未設定'}`)
  })
} catch (error) {
  console.error('❌ 記事取得エラー:', error)
}

// DataService.getBlogPosts()テスト
try {
  console.log('📋 DataService.getBlogPosts()テスト...')
  const { DataService } = await import('./lib/data.js')
  const posts = await DataService.getBlogPosts()
  console.log(`📊 DataServiceで取得した記事数: ${posts.length}`)
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`)
  })
} catch (error) {
  console.error('❌ DataServiceエラー:', error)
}