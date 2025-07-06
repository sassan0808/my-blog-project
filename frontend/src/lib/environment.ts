/**
 * 環境設定の一元管理
 * 開発・本番環境の設定を統一的に管理
 */

// 環境の種類
export type Environment = 'development' | 'production' | 'test'

// 現在の環境を判定
export const getCurrentEnvironment = (): Environment => {
  if (typeof window === 'undefined') {
    // Node.js環境
    return (process.env.NODE_ENV as Environment) || 'development'
  } else {
    // ブラウザ環境
    return (import.meta.env?.MODE as Environment) || 'development'
  }
}

// 開発環境判定
export const isDevelopment = (): boolean => getCurrentEnvironment() === 'development'
export const isProduction = (): boolean => getCurrentEnvironment() === 'production'

// 環境変数の検証
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // 必須環境変数のチェック
  const requiredVars = [
    'VITE_SANITY_PROJECT_ID',
    'VITE_SANITY_DATASET',
    'VITE_SANITY_API_VERSION'
  ]
  
  const isNodeJS = typeof window === 'undefined'
  
  for (const varName of requiredVars) {
    const value = isNodeJS 
      ? process.env[varName] 
      : import.meta.env?.[varName]
    
    if (!value) {
      errors.push(`環境変数 ${varName} が設定されていません`)
    }
  }
  
  // トークンの警告（オプション）
  const token = isNodeJS 
    ? process.env.VITE_SANITY_TOKEN 
    : import.meta.env?.VITE_SANITY_TOKEN
  
  if (!token && isProduction()) {
    errors.push('本番環境でVITE_SANITY_TOKENが設定されていません（書き込み権限が必要な場合）')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 環境情報の出力
export const logEnvironmentStatus = (): void => {
  const env = getCurrentEnvironment()
  const validation = validateEnvironment()
  
  console.log('🌍 Environment Status:')
  console.log(`  Environment: ${env}`)
  console.log(`  Valid: ${validation.isValid}`)
  
  if (!validation.isValid) {
    console.warn('⚠️ Environment Issues:')
    validation.errors.forEach(error => console.warn(`  - ${error}`))
  }
}

// 安全な環境変数取得
export const getEnvVar = (key: string, fallback: string = ''): string => {
  const isNodeJS = typeof window === 'undefined'
  
  const value = isNodeJS 
    ? process.env[key] 
    : import.meta.env?.[key] as string
  
  return value || fallback
}