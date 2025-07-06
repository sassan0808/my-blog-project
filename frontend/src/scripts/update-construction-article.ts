import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// .env.localを読み込む
dotenv.config({ path: join(__dirname, '../../.env.local') })

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.VITE_SANITY_TOKEN,
  useCdn: false
})

async function updateArticle() {
  try {
    console.log('📄 完全版記事を読み込み中...')
    
    // 実際の記事ファイルを読み込む
    const articlePath = join(__dirname, '../../../2025-07-06-建設業界のdx革命-人材不足を解決するai活用の最新トレンド2025.md')
    const content = await fs.readFile(articlePath, 'utf-8')
    console.log(`記事の文字数: ${content.length}文字`)
    
    // 既存の記事を削除
    console.log('🗑️ 既存の簡略版記事を削除中...')
    try {
      await sanityClient.delete('lrNyvURZaSpXLCHkteL966')
      console.log('✅ 既存記事を削除しました')
    } catch {
      console.log('ℹ️ 既存記事は既に削除済みまたは存在しません')
    }
    
    // メタ情報部分を除いた本文を取得
    const mainContent = content.split('**メタ情報**')[0]
    const lines = mainContent.split('\n')
    
    // PortableTextに変換
    const body: Array<{
      _type: string
      style: string
      children: Array<{ _type: string; text: string }>
    }> = []
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      if (line.startsWith('# ')) {
        // タイトルはスキップ
        continue
      } else if (line.startsWith('## ')) {
        body.push({
          _type: 'block',
          style: 'h2',
          children: [{ _type: 'span', text: line.substring(3).trim() }]
        })
      } else if (line.startsWith('### ')) {
        body.push({
          _type: 'block',
          style: 'h3',
          children: [{ _type: 'span', text: line.substring(4).trim() }]
        })
      } else if (line.trim() !== '') {
        // 通常の段落（リスト項目も含む）
        body.push({
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: line.trim() }]
        })
      }
    }
    
    console.log(`PortableTextブロック数: ${body.length}`)
    
    // 新しい記事を投稿
    console.log('📤 完全版記事を投稿中...')
    
    const categories = await sanityClient.fetch('*[_type == "category" && title == "AI活用"][0]')
    const author = await sanityClient.fetch('*[_type == "author"][0]')
    
    const article = {
      _type: 'post',
      title: '建設業界のDX革命：人材不足を解決するAI活用の最新トレンド2025',
      slug: { current: 'kensetsugyo-dx-ai-donyu-2025-full' },
      excerpt: '建設業界の深刻な人材不足を、AI技術の戦略的活用で解決する方法を詳しく解説。管理部門から始める実践的なアプローチで、若手社員のモチベーション向上と業務効率化を同時に実現できます。',
      status: 'published',
      publishedAt: new Date().toISOString(),
      metaTitle: '建設業界のDX革命：人材不足を解決するAI活用の最新トレンド2025',
      metaDescription: '建設業界の人材不足をAI活用で解決する方法を解説。管理部門から始める低リスクなDX導入事例や、専門家がいない会社でも実践できる具体的な手順を紹介します。',
      tags: ['建設業DX', 'AI導入', '建設会社', '人材不足', '業務効率化', '管理部門', 'バックオフィス', '中小企業'],
      body: body,
      categories: [{
        _type: 'reference',
        _ref: categories._id
      }],
      author: {
        _type: 'reference',
        _ref: author._id
      }
    }
    
    const result = await sanityClient.create(article)
    console.log('✅ 完全版記事が正常に投稿されました！')
    console.log('記事ID:', result._id)
    console.log('URL: https://my-blog-project-pi.vercel.app/blog/' + result.slug.current)
    console.log(`最終文字数: ${mainContent.length}文字`)
  } catch (error) {
    console.error('❌ 更新エラー:', error)
  }
}

updateArticle()