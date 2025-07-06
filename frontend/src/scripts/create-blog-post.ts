import { createBlogPost, getOrCreateAuthor, createCategory } from '../lib/sanity-write'
import { client } from '../lib/sanity-node'

async function main() {
  try {
    console.log('🚀 ブログ記事を作成します...')
    
    // 実際のカテゴリーを取得
    let categories = []
    try {
      const query = `*[_type == "category"] | order(title asc) {
        _id,
        title,
        description
      }`
      categories = await client.fetch(query)
      console.log('📁 利用可能なカテゴリー:', categories)
    } catch (error) {
      console.log('カテゴリー取得エラー:', error)
    }
    
    // カテゴリーがない場合は作成
    if (categories.length === 0) {
      console.log('📂 カテゴリーを作成します...')
      const aiCategory = await createCategory('AI活用', 'AI技術の活用方法やトレンド')
      categories = [aiCategory]
    }
    
    // 著者を取得または作成
    const authorId = await getOrCreateAuthor('Claude AI Assistant')
    
    // ブログ記事の内容
    const blogPost = {
      title: 'バイブコーディングで変わる開発体験：チャットだけでブログシステムを構築した話',
      content: `今日は、Claude AIを使った「バイブコーディング」で、このブログシステムを構築した体験をシェアしたいと思います。

なんと、管理画面へのログインも、コードエディタも一切使わずに、チャットだけでカテゴリー機能を実装できてしまいました！

## バイブコーディングとは？

バイブコーディングは、AIとの対話を通じてコードを生成・編集する新しい開発スタイルです。「こんな感じで作って」という要望を伝えるだけで、AIが適切なコードを生成してくれます。

## 実際にできたこと

今回のセッションで実装した機能：
- Sanityとの完全統合
- カテゴリーによる記事フィルター
- レスポンシブなUIデザイン
- ダークモード対応

すべて「会話」だけで完成しました。

## 開発効率の革命

従来なら数時間かかっていた作業が、わずか数分で完了。しかも、TypeScriptの型定義やエラーハンドリングまで、しっかりと実装されています。

## 今後の展望

バイブコーディングは、非エンジニアでも高品質なWebアプリケーションを作れる時代の到来を示しています。アイデアさえあれば、誰でも自分のサービスを立ち上げることができるのです。

このブログ自体が、バイブコーディングの可能性を証明する生きた例となっています。`,
      categoryIds: categories.length > 0 ? [categories[0]._id] : [],
      authorId
    }
    
    console.log('📝 記事を投稿中...')
    const result = await createBlogPost(blogPost)
    
    console.log('✅ 記事が正常に投稿されました！')
    console.log(`📌 記事ID: ${result._id}`)
    console.log(`🔗 スラッグ: ${result.slug.current}`)
    console.log(`🌐 URL: http://localhost:5173/blog/${result.slug.current}`)
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

// スクリプトを実行
main()