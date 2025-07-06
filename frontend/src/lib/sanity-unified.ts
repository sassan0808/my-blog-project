/**
 * 統一Sanityクライアント設定
 * 全体最適：環境に依存しない安定したAPI接続
 */
import { createClient, type SanityClient } from '@sanity/client'

// 環境設定の統一取得
const getConfig = () => {
  const isNodeJS = typeof window === 'undefined'
  
  return {
    projectId: isNodeJS ? process.env.VITE_SANITY_PROJECT_ID : import.meta.env?.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
    dataset: isNodeJS ? process.env.VITE_SANITY_DATASET : import.meta.env?.VITE_SANITY_DATASET || 'production', 
    apiVersion: isNodeJS ? process.env.VITE_SANITY_API_VERSION : import.meta.env?.VITE_SANITY_API_VERSION || '2024-01-01',
    token: isNodeJS ? process.env.VITE_SANITY_TOKEN : import.meta.env?.VITE_SANITY_TOKEN,
    isNodeJS
  }
}

// 最適化されたクライアント設定
const config = getConfig()

export const sanityClient: SanityClient = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  
  // 環境最適化設定
  useCdn: false, // 一貫性のためCDN無効
  perspective: 'published', // 公開コンテンツのみ
  stega: false, // エンコーディング問題回避
  
  // ブラウザ最適化
  ignoreBrowserTokenWarning: true,
  
  // 認証設定（安全性確保）
  token: config.token
})

// デバッグ情報の統一出力
export const logSanityStatus = () => {
  console.log('🔧 Sanity Client Status:')
  console.log('  Environment:', config.isNodeJS ? 'Node.js' : 'Browser')
  console.log('  Project ID:', config.projectId)
  console.log('  Dataset:', config.dataset)
  console.log('  API Version:', config.apiVersion)
  console.log('  Token:', config.token ? '✅ Available' : '❌ Missing')
  console.log('  CDN:', false)
  console.log('  Perspective:', 'published')
}

// 接続テスト機能
export const testSanityConnection = async (): Promise<boolean> => {
  try {
    await sanityClient.fetch('*[_type == "post"][0]{_id}')
    console.log('✅ Sanity connection successful')
    return true
  } catch (error) {
    console.error('❌ Sanity connection failed:', error)
    return false
  }
}

// エラー分析機能
export const analyzeSanityError = (error: unknown): {
  type: 'network' | 'auth' | 'config' | 'query' | 'unknown'
  message: string
  suggestions: string[]
} => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes('Request error')) {
    return {
      type: 'network',
      message: 'Network connection issue',
      suggestions: [
        'Check internet connection',
        'Verify Sanity project is accessible',
        'Check firewall/proxy settings'
      ]
    }
  }
  
  if (errorMessage.includes('auth') || errorMessage.includes('token')) {
    return {
      type: 'auth',
      message: 'Authentication error',
      suggestions: [
        'Verify VITE_SANITY_TOKEN is correct',
        'Check token permissions',
        'Regenerate token if needed'
      ]
    }
  }
  
  if (errorMessage.includes('project') || errorMessage.includes('dataset')) {
    return {
      type: 'config',
      message: 'Configuration error',
      suggestions: [
        'Verify VITE_SANITY_PROJECT_ID is correct',
        'Check VITE_SANITY_DATASET setting',
        'Confirm project exists'
      ]
    }
  }
  
  return {
    type: 'unknown',
    message: errorMessage,
    suggestions: [
      'Check console for detailed error logs',
      'Verify all environment variables',
      'Contact system administrator'
    ]
  }
}

export default sanityClient