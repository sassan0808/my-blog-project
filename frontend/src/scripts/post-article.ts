import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
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

const article = {
  _type: 'post',
  title: 'バイブコーディングでSanityと連携！Claude Codeでブログ記事を自動投稿できた話',
  slug: {
    current: 'vibe-coding-sanity-claude-code'
  },
  excerpt: 'Claude CodeとSanity CMSを連携させることで、AIとの対話だけでブログ記事を作成・投稿できる「バイブコーディング」を実現。その実装方法と得られた成果を詳しく解説します。',
  status: 'published',
  publishedAt: new Date().toISOString(),
  metaTitle: 'バイブコーディングでSanityと連携！Claude Codeでブログ自動投稿',
  metaDescription: 'Claude CodeとSanity CMSを連携させ、AIとの対話だけでブログ記事を作成・投稿する「バイブコーディング」の実践例を紹介。記事執筆時間を大幅短縮する方法を解説します。',
  tags: ['Claude Code', 'Sanity', 'バイブコーディング', 'CMS連携', '2025年'],
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: 'はじめに'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'エンジニアの皆さん、ブログ記事の執筆と投稿に時間がかかって困っていませんか？今回は、Claude CodeとSanity CMSを連携させることで、AIとの対話だけでブログ記事を作成・投稿できる「バイブコーディング」の実践例をご紹介します。この方法により、記事執筆から公開までの時間を大幅に短縮できました。'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: '目次'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '- バイブコーディングとは何か\n- Claude CodeとSanity CMSの連携方法\n- 実装で工夫したポイント\n- 得られた成果と今後の展望'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: 'バイブコーディングとは何か'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: '従来のコーディングとの違い'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'バイブコーディングは、AIとの自然な対話を通じてコードを生成する新しいプログラミング手法です。従来のコーディングでは、開発者が一行一行コードを書く必要がありましたが、バイブコーディングでは「こういう機能が欲しい」と伝えるだけで、AIが適切なコードを生成してくれます。'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: 'なぜ今バイブコーディングなのか'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '2025年現在、AIの進化により、単純なコード生成から複雑なシステム構築まで、幅広いタスクをAIに任せられるようになりました。特にClaude Codeのような高度なツールの登場により、プロダクション環境での実用化が現実的になっています。'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: 'Claude CodeとSanity CMSの連携方法'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: 'システム構成の概要'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '今回構築したシステムは以下の技術スタックで構成されています：'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '・フロントエンド: React + TypeScript + Vite\n・CMS: Sanity Studio\n・AI開発環境: Claude Code\n・ホスティング: Vercel'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: '連携の仕組み'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'Claude Codeは、ローカル環境のファイルシステムに直接アクセスできるため、以下のような流れで記事投稿が可能になりました：'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '1. Claude Codeに記事の内容を指示\n2. AIが記事をMarkdown形式で作成\n3. Sanity StudioのAPIを通じて記事データを投稿\n4. Vercelで自動デプロイ'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: '実装で工夫したポイント'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: '記事作成ガイドラインの整備'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'Claude Codeに一貫性のある記事を書いてもらうため、詳細なガイドラインを作成しました：'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '・カテゴリーを3つに固定（AI活用、組織開発、Well-being）\n・文体や構成のテンプレート化\n・SEO対策のためのタグ付けルール'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: 'エラーハンドリングの強化'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'Sanity APIとの接続エラーを適切に処理し、デバッグしやすい環境を構築しました。CORS設定やTypeScript型定義など、細かい部分まで最適化を行いました。'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: '得られた成果と今後の展望'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: '実現できたこと'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '1. 記事作成時間の大幅短縮: 従来1-2時間かかっていた記事執筆が15-30分に\n2. 品質の安定化: ガイドラインに基づいた一貫性のある記事\n3. 技術的な学び: CORS設定、TypeScript型定義、環境変数管理など'}]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{_type: 'span', text: '今後の改善点'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: '・画像の自動生成と最適化\n・より高度なSEO対策の自動化\n・複数言語対応'}]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{_type: 'span', text: 'まとめ'}]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'バイブコーディングとClaude Codeを活用することで、ブログ記事の作成から投稿までを大幅に効率化できました。特に、Sanity CMSとの連携により、コンテンツ管理も容易になりました。\n\nこの手法は、ブログ運営だけでなく、ドキュメント作成や技術記事の執筆など、様々な場面で応用可能です。ぜひ皆さんも、AIを活用した新しい開発スタイルを試してみてください。'}]
    }
  ]
}

async function postArticle() {
  try {
    // まずカテゴリーとAuthorを取得
    const categories = await sanityClient.fetch('*[_type == "category" && title == "AI活用"][0]')
    const author = await sanityClient.fetch('*[_type == "author"][0]') // 最初の著者を使用
    
    if (!categories) {
      throw new Error('AI活用カテゴリーが見つかりません')
    }
    
    if (!author) {
      throw new Error('著者が見つかりません')
    }
    
    // カテゴリーと著者を設定
    const articleWithRefs = {
      ...article,
      categories: [{
        _type: 'reference',
        _ref: categories._id
      }],
      author: {
        _type: 'reference',
        _ref: author._id
      }
    }
    
    console.log('投稿する記事データ:', articleWithRefs)
    
    // 記事を投稿
    const result = await sanityClient.create(articleWithRefs)
    console.log('✅ 記事が正常に投稿されました！')
    console.log('記事ID:', result._id)
    console.log('スラッグ:', result.slug.current)
    console.log('URL: https://my-blog-project-pi.vercel.app/blog/' + result.slug.current)
  } catch (error) {
    console.error('❌ 投稿エラー:', error)
  }
}

postArticle()