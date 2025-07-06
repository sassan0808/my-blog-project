/**
 * 統一されたAPIクライアント設定
 * フロントエンド・Node.js両対応の設定管理
 */
import { createClient } from '@sanity/client'
import { getEnvVar, validateEnvironment, logEnvironmentStatus } from './environment'

// Sanity設定の統一
export const sanityConfig = {
  projectId: getEnvVar('VITE_SANITY_PROJECT_ID', 'qcfwoevq'),
  dataset: getEnvVar('VITE_SANITY_DATASET', 'production'),
  apiVersion: getEnvVar('VITE_SANITY_API_VERSION', '2024-01-01'),
  token: getEnvVar('VITE_SANITY_TOKEN'),
}

// 読み取り専用クライアント（CDN使用）
export const readClient = createClient({
  ...sanityConfig,
  useCdn: false, // CDNを無効化してURL問題を回避
  perspective: 'published',
  stega: false, // ステガノグラフィー無効化
  ignoreBrowserTokenWarning: true, // ブラウザでのトークン警告を無視
})

// 書き込み用クライアント（CDN無効、認証あり）
export const writeClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: sanityConfig.token,
  stega: false, // ステガノグラフィー無効化
})

// デフォルトは読み取り専用
export const client = readClient

// 環境情報のログ出力（デバッグ用）
export const logEnvironmentInfo = () => {
  const isNodeJS = typeof window === 'undefined'
  const validation = validateEnvironment()
  
  console.log('🔧 API Client Environment Info:')
  console.log('  Environment:', isNodeJS ? 'Node.js' : 'Browser')
  console.log('  Project ID:', sanityConfig.projectId)
  console.log('  Dataset:', sanityConfig.dataset)
  console.log('  API Version:', sanityConfig.apiVersion)
  console.log('  Token Available:', !!sanityConfig.token)
  
  // 環境設定の検証結果も表示
  logEnvironmentStatus()
  
  if (!validation.isValid) {
    console.warn('⚠️ 環境設定に問題があります。.env.localファイルを確認してください。')
  }
}