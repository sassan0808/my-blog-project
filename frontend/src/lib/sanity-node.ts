import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// .env.localファイルを読み込む
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../../.env.local') })

export const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false, // 書き込み時はCDNを使わない
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.VITE_SANITY_TOKEN,
})