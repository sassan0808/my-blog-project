# Claude Code プロジェクト情報

## プロジェクト概要
Sanity CMSを使用したブログシステム

## 記事作成時の注意事項
記事を作成する際は、必ず`ARTICLE_GUIDELINES.md`のガイドラインに従ってください。

### 基本ルール
1. 文体は「です・ます調」で統一
2. 目次（##見出し）は必須
3. 文字数は記事タイプに応じて調整
4. SEO設定（metaTitle, metaDescription）も作成

### カテゴリー制限（重要）
記事のカテゴリーは以下の3つのみ使用可能：
- **AI活用**: AI技術、生成AI、業務効率化
- **組織開発**: マネジメント、チームビルディング、人材育成
- **Well-being**: 健康、ワークライフバランス、生産性

**新しいカテゴリーは作成しないでください。**

### タグ付けルール
- 各記事に3-5個のタグを付ける
- 日本語で統一（例: `ChatGPT`, `リモートワーク`, `マインドフルネス`）
- SEO用タグも追加（例: `2025年`, `初心者向け`, `おすすめ`）

### 記事作成手順
1. ガイドラインを確認
2. 指定されたテンプレートに従って執筆
3. Sanity Studioで記事を作成
4. プレビューで確認後、公開

## 技術仕様
- Frontend: React + TypeScript + Vite
- CMS: Sanity
- Hosting: Vercel
- Domain: https://my-blog-project-pi.vercel.app

## 画像付き記事作成システム

### 🎨 新機能：自動画像アップロード対応
画像を含む記事を簡単に作成できる新しいシステムを実装しました。

#### 主な機能
- **自動画像最適化**: アップロード時に画像を自動で最適化
- **画像解析**: AIによる画像内容の分析とalt text自動生成
- **一括アップロード**: 複数画像の並列処理
- **統合ワークフロー**: 画像アップロードから記事作成まで一元化

#### 使用方法
```bash
# 画像付き記事作成（インタラクティブ）
cd frontend && npm run create-article-with-images
```

#### システム構成
```
Core Layer
├── エラーハンドリング: 統一されたエラー管理
├── ロギング: 詳細な処理ログ
└── 設定管理: 環境変数ベースの設定

Domain Layer
├── 記事エンティティ: 記事の構造とビジネスロジック
└── 画像エンティティ: 画像処理とメタデータ管理

Infrastructure Layer
├── Sharp画像処理: 高性能な画像変換・最適化
└── Sanity統合: CMS連携とアセット管理

Application Layer
└── 画像付き記事作成: 全体オーケストレーション
```

#### 画像処理の特徴
- **対応フォーマット**: JPEG, PNG, WebP, GIF
- **自動リサイズ**: 最大1920x1080に自動調整
- **圧縮最適化**: 品質85%での高効率圧縮
- **メタデータ抽出**: 画像情報の自動解析

## よく使うコマンド
```bash
# フロントエンド開発
cd frontend && npm run dev

# Sanity Studio起動
cd studio && npm run dev

# 従来の記事作成
cd frontend && npm run create-post

# 🆕 画像付き記事作成
cd frontend && npm run create-article-with-images

# ビルド&デプロイ
git add . && git commit -m "メッセージ" && git push
```