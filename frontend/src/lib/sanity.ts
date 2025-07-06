import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: import.meta.env.VITE_SANITY_TOKEN, // 書き込み用トークン（オプション）
})