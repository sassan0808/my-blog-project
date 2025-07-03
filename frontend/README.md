# Sanity Blog Frontend

React + TypeScript + Vite + TailwindCSS を使用したSanity連携ブログサイト

## 機能

- ✅ Sanity APIからブログ記事を取得
- ✅ 記事一覧ページと個別記事ページ
- ✅ レスポンシブデザイン
- ✅ SEO最適化
- ✅ ダークモード対応
- ✅ PortableText対応リッチテキスト表示

## 技術スタック

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Sanity Client
- PortableText React

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ビルド:
```bash
npm run build
```

## Sanity設定

- Project ID: `qcfwoevq`
- Dataset: `production`

## スキーマ

記事のスキーマは以下の通り:

```typescript
interface Post {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  }
  body: any[] // PortableText
  publishedAt: string
}
```

## ページ構成

- `/` - ブログ記事一覧
- `/blog/:slug` - 個別記事詳細

## 特徴

### ダークモード
右上のトグルボタンでダークモードとライトモードを切り替え可能

### SEO最適化
- 動的メタタグ
- OGP対応
- Twitter Cards対応

### レスポンシブデザイン
モバイル、タブレット、デスクトップに対応
