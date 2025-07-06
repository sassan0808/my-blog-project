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

## よく使うコマンド
```bash
# フロントエンド開発
cd frontend && npm run dev

# Sanity Studio起動
cd studio && npm run dev

# ビルド&デプロイ
git add . && git commit -m "メッセージ" && git push
```