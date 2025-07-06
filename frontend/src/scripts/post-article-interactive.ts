#!/usr/bin/env tsx
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as readline from 'readline'
import { promises as fs } from 'fs'
import path from 'path'

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

// 入力を受け取るヘルパー関数
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

// 記事データの型
interface ArticleData {
  title: string
  slug: string
  excerpt: string
  tags: string[]
  category: string
  content: string
  metaTitle: string
  metaDescription: string
}

// 記事プレビューを表示
function displayArticlePreview(article: ArticleData) {
  console.log('\n' + '='.repeat(60))
  console.log('📄 記事プレビュー')
  console.log('='.repeat(60))
  console.log(`\n📌 タイトル: ${article.title}`)
  console.log(`🔗 スラッグ: ${article.slug}`)
  console.log(`📝 抜粋: ${article.excerpt}`)
  console.log(`📂 カテゴリー: ${article.category}`)
  console.log(`🏷️  タグ: ${article.tags.join(', ')}`)
  console.log(`🔍 SEOタイトル: ${article.metaTitle}`)
  console.log(`📋 SEO説明文: ${article.metaDescription}`)
  console.log('\n--- 本文プレビュー (最初の500文字) ---')
  console.log(article.content.substring(0, 500) + '...')
  console.log('='.repeat(60) + '\n')
}

// PortableTextに変換
function convertToPortableText(content: string) {
  const lines = content.split('\n')
  const blocks: any[] = []
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    if (line.startsWith('# ')) {
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{_type: 'span', text: line.substring(2)}]
      })
    } else if (line.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{_type: 'span', text: line.substring(3)}]
      })
    } else if (line.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{_type: 'span', text: line.substring(4)}]
      })
    } else {
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{_type: 'span', text: line}]
      })
    }
  }
  
  return blocks
}

async function main() {
  console.log('🚀 対話型記事投稿システム\n')
  
  try {
    // 記事ファイルのパスを取得
    const articlePath = await question('📁 記事ファイルのパス (例: ../new-article.md): ')
    
    // ファイルの存在確認
    const fullPath = path.resolve(__dirname, articlePath)
    try {
      await fs.access(fullPath)
    } catch {
      console.error('❌ ファイルが見つかりません:', fullPath)
      rl.close()
      return
    }
    
    // ファイル内容を読み込む
    const content = await fs.readFile(fullPath, 'utf-8')
    const lines = content.split('\n')
    
    // タイトルを抽出（最初の#から）
    const titleLine = lines.find(line => line.startsWith('# '))
    const title = titleLine ? titleLine.substring(2).trim() : ''
    
    if (!title) {
      console.error('❌ 記事にタイトルが見つかりません')
      rl.close()
      return
    }
    
    // メタ情報を探す
    const metaStart = lines.findIndex(line => line.includes('**メタ情報**'))
    let category = 'AI活用'
    let tags: string[] = []
    let metaTitle = title
    let metaDescription = ''
    let excerpt = ''
    
    if (metaStart !== -1) {
      for (let i = metaStart + 1; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes('カテゴリー:')) {
          category = line.split(':')[1].trim()
        } else if (line.includes('タグ:')) {
          tags = line.split(':')[1].split(',').map(t => t.trim())
        } else if (line.includes('metaTitle:')) {
          metaTitle = line.split(':')[1].trim()
        } else if (line.includes('metaDescription:')) {
          metaDescription = line.split(':')[1].trim()
        } else if (line.includes('excerpt:')) {
          excerpt = line.split(':')[1].trim()
        }
      }
    }
    
    // スラッグの生成
    const defaultSlug = title
      .toLowerCase()
      .replace(/[！-～]/g, '')
      .replace(/[^a-z0-9ぁ-んァ-ヶー一-龠]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    // 記事データを構築
    const articleData: ArticleData = {
      title,
      slug: defaultSlug,
      excerpt: excerpt || content.substring(0, 150).replace(/[#\n]/g, '') + '...',
      tags,
      category,
      content: content.split('**メタ情報**')[0].trim(),
      metaTitle,
      metaDescription
    }
    
    // プレビュー表示
    displayArticlePreview(articleData)
    
    // 編集オプション
    console.log('\n📝 編集オプション:')
    console.log('1. タイトルを変更')
    console.log('2. スラッグを変更')
    console.log('3. カテゴリーを変更')
    console.log('4. タグを編集')
    console.log('5. 抜粋を編集')
    console.log('6. SEO設定を編集')
    console.log('0. 編集を終了して次へ')
    
    // 編集ループ
    let editing = true
    while (editing) {
      const choice = await question('\n選択してください (0-6): ')
      
      switch (choice) {
        case '1':
          articleData.title = await question('新しいタイトル: ')
          break
        case '2':
          articleData.slug = await question('新しいスラッグ: ')
          break
        case '3':
          console.log('利用可能なカテゴリー: AI活用, 組織開発, Well-being')
          articleData.category = await question('カテゴリー: ')
          break
        case '4':
          const tagInput = await question('タグ (カンマ区切り): ')
          articleData.tags = tagInput.split(',').map(t => t.trim())
          break
        case '5':
          articleData.excerpt = await question('抜粋: ')
          break
        case '6':
          articleData.metaTitle = await question('SEOタイトル: ')
          articleData.metaDescription = await question('SEO説明文: ')
          break
        case '0':
          editing = false
          break
      }
      
      if (editing && choice !== '0') {
        displayArticlePreview(articleData)
      }
    }
    
    // 最終確認
    console.log('\n' + '='.repeat(60))
    console.log('✅ 最終確認')
    console.log('='.repeat(60))
    displayArticlePreview(articleData)
    
    const confirm = await question('\nこの内容で投稿しますか？ (yes/no): ')
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ 投稿をキャンセルしました')
      rl.close()
      return
    }
    
    // Sanityに投稿
    console.log('\n📤 Sanityに投稿中...')
    
    // カテゴリーと著者を取得
    const categories = await sanityClient.fetch(
      `*[_type == "category" && title == $category][0]`,
      { category: articleData.category }
    )
    const author = await sanityClient.fetch('*[_type == "author"][0]')
    
    if (!categories) {
      console.error(`❌ カテゴリー「${articleData.category}」が見つかりません`)
      rl.close()
      return
    }
    
    const article = {
      _type: 'post',
      title: articleData.title,
      slug: { current: articleData.slug },
      excerpt: articleData.excerpt,
      status: 'published',
      publishedAt: new Date().toISOString(),
      metaTitle: articleData.metaTitle,
      metaDescription: articleData.metaDescription,
      tags: articleData.tags,
      body: convertToPortableText(articleData.content),
      categories: [{
        _type: 'reference',
        _ref: categories._id
      }],
      author: author ? {
        _type: 'reference',
        _ref: author._id
      } : undefined
    }
    
    const result = await sanityClient.create(article)
    
    console.log('\n✅ 記事が正常に投稿されました！')
    console.log('📄 記事ID:', result._id)
    console.log('🔗 URL: https://my-blog-project-pi.vercel.app/blog/' + result.slug.current)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  } finally {
    rl.close()
  }
}

main()