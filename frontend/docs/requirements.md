# パーソナルサイト要件定義書

## 📋 プロジェクト概要

**目的**: 個人のブランディングと情報発信を目的としたモダンなパーソナルサイト  
**対象ユーザー**: 採用担当者、クライアント、同業者、一般ユーザー  
**開発期間**: 2-3週間  

## 🎯 機能要件

### 1. トップページ（ランディング）
- **ヒーローセクション**
  - キャッチコピー + 職業/肩書き
  - CTA ボタン（ポートフォリオ・お問い合わせ）
  - 背景：グラデーション + パーティクル効果
- **概要セクション**
  - 簡潔な自己紹介（3-4行）
  - 注力分野・専門性の説明
  - 最新ブログ記事（3記事）
  - 注目プロジェクト（3つ）

### 2. ブログページ
- **記事一覧**
  - カード型レイアウト（IKEHAYA風ミニマルデザイン）
  - 検索・フィルタリング機能
  - ページネーション or 無限スクロール
  - カテゴリ別表示
- **個別記事ページ**
  - 読みやすいタイポグラフィ
  - 目次自動生成
  - SNSシェアボタン
  - 関連記事表示

### 3. ポートフォリオページ
- **プロジェクトギャラリー**
  - グリッドレイアウト（マソナリー風）
  - ホバーエフェクト付きカード
  - カテゴリフィルタ（Web/Mobile/Desktop等）
  - 詳細モーダル or 専用ページ
- **技術スタック表示**
  - スキルレベル可視化
  - 使用技術アイコン

### 4. プロフィールページ
- **詳細な自己紹介**
  - プロフィール写真
  - 経歴・学歴
  - 価値観・philosophy
- **スキル詳細**
  - プログレスバー表示
  - カテゴリ別整理
- **経歴・実績**
  - タイムライン形式
  - 各ポジションの詳細

### 5. お問い合わせページ
- **コンタクトフォーム**
  - 名前・メール・件名・本文
  - バリデーション機能
  - 送信完了フィードバック
- **SNS・連絡先**
  - GitHub, LinkedIn, Twitter等
  - 直接メールアドレス

## 🎨 デザイン要件

### 全体デザインシステム
- **カラーパレット**
  - Primary: Blue (#3B82F6) 
  - Secondary: Purple (#8B5CF6)
  - Accent: Gradient (Blue to Purple)
  - Neutral: Gray scale
- **タイポグラフィ**
  - 日本語: Noto Sans JP
  - 英語: Inter / SF Pro
  - コード: Fira Code
- **スペーシング**: 8px grid system
- **コンポーネント**: Card, Button, Badge, Modal等

### ページ別デザイン
- **トップページ**: インパクト重視、大胆なビジュアル
- **ブログ**: IKEHAYA風ミニマル、読みやすさ最優先
- **ポートフォリオ**: ビジュアル重視、作品を魅力的に表示
- **プロフィール**: 信頼感・親しみやすさ
- **お問い合わせ**: シンプル・使いやすさ

### レスポンシブ対応
- **デスクトップ**: 1200px以上（メインターゲット）
- **タブレット**: 768px-1199px
- **スマートフォン**: 320px-767px
- **ブレークポイント**: TailwindCSS標準

## 🛠 技術要件

### フロントエンド
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7
- **スタイリング**: TailwindCSS 3.4
- **ルーティング**: React Router DOM 7
- **アニメーション**: CSS Transitions + optional Framer Motion

### バックエンド・CMS
- **ブログCMS**: Sanity (Project ID: qcfwoevq)
  - ✅ Sanity Studioを`/studio`に統合完了
  - ✅ 統合スクリプト設定済み（`npm run dev:all`で同時起動）
- **ポートフォリオ**: ハードコーディング（将来Sanity移行可能）
- **お問い合わせ**: Netlify Forms or Vercel Forms

### データ構造
```typescript
// Blog (Sanity)
interface Post {
  title: string
  slug: { current: string }
  body: PortableTextBlock[]
  publishedAt: string
  category?: string
}

// Portfolio (Local → 将来Sanity)
interface Project {
  title: string
  description: string
  technologies: string[]
  image?: string
  liveUrl?: string
  githubUrl?: string
  category: 'web' | 'mobile' | 'desktop'
}

// Profile (Local → 将来Sanity)
interface Profile {
  name: string
  title: string
  bio: string
  skills: Skill[]
  experiences: Experience[]
  social: SocialLinks
}
```

## 🚀 パフォーマンス要件

- **Core Web Vitals**
  - LCP: < 2.5s
  - FID: < 100ms  
  - CLS: < 0.1
- **Lighthouse Score**: 90+
- **SEO最適化**: メタタグ、OGP、構造化データ

## 📱 ブラウザ対応

- **モダンブラウザ**: Chrome, Firefox, Safari, Edge（最新2バージョン）
- **レガシー対応**: 不要（ES2020+前提）

## 🔄 開発フェーズ

### Phase 1: 基盤構築（1週間）
- [x] プロジェクト初期設定
- [x] 型定義・データ層設計
- [x] 共通コンポーネント作成
- [x] Sanity Studio統合（`/studio`ディレクトリ）
- [ ] ルーティング設計
- [ ] 基本レイアウト

### Phase 2: ページ実装（1週間）
- [ ] トップページ
- [ ] ブログページ（一覧・詳細）
- [ ] ポートフォリオページ
- [ ] プロフィールページ
- [ ] お問い合わせページ

### Phase 3: 最適化・仕上げ（3-5日）
- [ ] パフォーマンス最適化
- [ ] SEO対応
- [ ] クロスブラウザテスト
- [ ] レスポンシブ調整

## ✅ 受け入れ条件

1. 全ページでレスポンシブ表示が正常動作すること
2. ダークモード切り替えが全ページで機能すること
3. Sanityとの連携でブログ記事が正常表示されること
4. お問い合わせフォームが正常送信できること
5. Core Web Vitals基準をクリアすること

---

*この要件定義書は開発中に必要に応じて更新されます*