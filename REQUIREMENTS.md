# My Blog Project - 要件定義書

## プロジェクト概要
Sanity CMSを使用したブログシステムの構築

## 技術スタック
- **フロントエンド**: React + TypeScript + Vite
- **CMS**: Sanity Studio
- **デプロイ**: Vercel
- **環境**: WSL2 (Windows Subsystem for Linux)

## 主要機能
1. **ブログ記事管理**
   - Sanity Studioでの記事作成・編集
   - MarkdownサポートのPortableText
   - カテゴリー分類機能

2. **表示機能**
   - 記事一覧表示
   - 記事詳細表示（Markdownレンダリング対応）
   - カテゴリーフィルタリング

## 解決済み課題と対策

### 1. Markdown表示問題
**問題**: PortableTextで`**`や`###`がそのまま表示される
**解決策**: `MarkdownText`コンポーネントを作成し、PortableTextの描画をカスタマイズ

### 2. TypeScript型エラー
**問題**: strict modeでの`any`型使用によるビルドエラー
**解決策**: 適切な型定義（`Post[]`など）を使用

### 3. WSL環境での依存関係エラー
**問題**: esbuildとrollupのLinuxバイナリ不足
**解決策**: `npm install`時に`--no-optional`フラグを使用しない

### 4. Sanity API接続エラー
**問題**: "Request error while attempting to reach"エラー
**解決策**: 
- 統一されたSanityクライアント（`sanity-unified.ts`）の作成
- CDN無効化とstega無効化
- エラー時の詳細表示機能追加

### 5. CORS問題
**問題**: Vercel自動生成URLでのCORSエラー
**解決策**: カスタムドメイン（`https://my-blog-project-pi.vercel.app`）を使用

## 環境設定

### 必須環境変数
```env
VITE_SANITY_PROJECT_ID=qcfwoevq
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_TOKEN=（読み取り専用トークン）
```

### Sanity CORS設定
登録済みオリジン:
- `https://my-blog-project-pi.vercel.app` （本番環境用）

## デプロイメント

### Vercel設定
- **カスタムドメイン**: `my-blog-project-pi.vercel.app`
- **環境変数**: 上記の必須環境変数を設定
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist`

### アクセスURL
- **本番環境**: https://my-blog-project-pi.vercel.app
- **Sanity Studio**: http://localhost:3333 (ローカル) または `npx sanity deploy`でホスティング

## 今後の改善点
1. 表示速度の最適化（キャッシュ戦略の改善）
2. 画像最適化
3. SEO対策の実装

## 開発時の注意事項
1. **CORS**: 必ずカスタムドメインでアクセスすること
2. **型安全性**: TypeScript strict modeを維持
3. **エラー表示**: 本番環境でもデバッグ可能なエラー表示を維持