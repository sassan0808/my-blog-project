import { createBlogPost, getOrCreateAuthor } from '../lib/sanity-write'
import { client } from '../lib/sanity-node'
import type { Category } from '../types/post'

async function main() {
  try {
    console.log('🚀 新しいブログ記事を作成します...')
    
    // カテゴリーを取得
    const query = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      description
    }`
    const categories: Category[] = await client.fetch(query)
    console.log('📁 利用可能なカテゴリー:', categories.map((c: Category) => c.title))
    
    // AI活用カテゴリーを選択
    const aiCategory = categories.find((c: Category) => c.title === 'AI活用')
    
    // 著者を取得
    const authorId = await getOrCreateAuthor('佐々木')
    
    // ブログ記事の内容
    const blogPost = {
      title: 'プログラミング学習に何度も挫折した人間がバイブコーディングでアプリが作成できるようになった話',
      content: `私はこれまで、プログラミング学習に5回以上挫折してきました。HTML、CSS、JavaScript、Python...どれも最初の数週間で諦めてしまいました。しかし、バイブコーディングとの出会いが、すべてを変えました。

## 挫折の連続だった過去

### 1回目の挫折：HTML/CSS（2018年）
「Webサイトを作りたい！」と意気込んで始めたものの、floatやpositionの概念が理解できず挫折。

### 2回目の挫折：JavaScript（2019年）
動的なサイトを作ろうとJavaScriptに挑戦。非同期処理やコールバック地獄で心が折れました。

### 3回目の挫折：Python（2020年）
「初心者に優しい」と聞いて始めたPython。環境構築の段階でつまずき、pip installのエラーと格闘して諦めました。

### 4回目の挫折：React（2021年）
モダンなフロントエンドを学ぼうとReactに挑戦。JSX、state、props...新しい概念の嵐に圧倒されました。

### 5回目の挫折：プログラミングスクール（2022年）
「独学が無理ならスクールだ！」と30万円投資。しかし、授業のペースについていけず、結局挫折。

## バイブコーディングとの出会い（2024年）

2024年、Claude AIを使った「バイブコーディング」という開発手法を知りました。最初は半信半疑でしたが、試してみると...

「ブログサイトを作りたい」と伝えるだけで、AIがコードを生成。
「ダークモードを追加して」と言えば、即座に実装。
「カテゴリー機能が欲しい」と伝えれば、データベース設計から実装まで完了。

## 初めて完成したアプリ

わずか3日で、以下の機能を持つブログシステムが完成しました：

- レスポンシブデザイン
- ダークモード対応
- Sanity CMSとの連携
- カテゴリー機能
- ポートフォリオページ
- お問い合わせフォーム

これまでの私なら、1つの機能を実装するだけで1ヶ月はかかっていたでしょう。

## バイブコーディングが変えたもの

### 1. 学習の概念が変わった
「コードを覚える」から「やりたいことを伝える」へ。文法を暗記する必要がなくなりました。

### 2. エラーが怖くなくなった
エラーメッセージをAIに見せれば、即座に解決策を提示。デバッグの苦痛から解放されました。

### 3. アイデアがすぐ形になる
「こんな機能があったらいいな」と思ったら、その場で実装。創造性が爆発的に向上しました。

## 挫折経験者へのメッセージ

プログラミング学習に挫折した経験がある人にこそ、バイブコーディングを試してほしい。

必要なのは：
- やりたいことを言語化する力
- AIとコミュニケーションする意欲
- 完璧主義を手放す勇気

コードを書けなくても、アプリは作れる時代が来ました。

## これからの目標

バイブコーディングで自信を得た今、次の目標があります：

1. 自分のSaaSサービスを立ち上げる
2. 地域の課題を解決するアプリを作る
3. バイブコーディングの普及活動

挫折を繰り返した過去の自分に言いたい。「諦めなくて良かった」と。

プログラミングの民主化が、今、始まっています。`,
      categoryIds: aiCategory ? [aiCategory._id] : [],
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