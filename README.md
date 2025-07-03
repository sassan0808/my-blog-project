# My Blog Project

佐々木のパーソナルサイト - モダンなブログ・ポートフォリオ・プロフィール統合サイト

## 📋 ドキュメント

- **[📋 要件定義書](./frontend/docs/requirements.md)** - プロジェクトの詳細な要件・仕様
- **[🏗️ システム構成・アーキテクチャ](./frontend/docs/ARCHITECTURE.md)** - 技術構成・データフロー・コンポーネント図
- **[📱 モックアップ・画面遷移図](./frontend/docs/MOCKUP.md)** - 各画面のワイヤーフレームとデザイン仕様
- **[🛠️ 技術スタック](#技術スタック)** - 使用技術一覧

## 🏗️ プロジェクト構成

```
my-blog-project/
├── frontend/          # React + TypeScript + Vite フロントエンド
│   ├── src/          # ソースコード
│   ├── docs/         # ドキュメント（要件定義書等）
│   └── public/       # 静的アセット
├── studio/           # Sanity CMS バックエンド（統合済み）
│   ├── schemaTypes/  # CMSスキーマ定義
│   └── static/       # Studio静的ファイル
└── .env.example      # 環境変数設定例
```

## 🚀 技術スタック

### Frontend
- **React 19** + **TypeScript**
- **Vite** (ビルドツール)
- **TailwindCSS** (スタイリング)
- **React Router** (ルーティング)
- **Sanity Client** (CMS連携)

### Backend/CMS
- **Sanity** (ヘッドレスCMS)
- Project ID: `qcfwoevq`
- Dataset: `production`

## 📱 機能

### 🏠 ホームページ
- インパクトのあるヒーローセクション
- 注目プロジェクト表示
- 最新ブログ記事表示
- アニメーション効果

### 📝 ブログ
- Sanity連携記事管理
- IKEHAYA風ミニマルデザイン
- SEO最適化
- ダークモード対応

### 💼 ポートフォリオ
- プロジェクトギャラリー
- カテゴリフィルタリング
- 技術スタック表示
- 作品詳細モーダル

### 👤 プロフィール
- 詳細な自己紹介
- スキル可視化
- 経歴タイムライン
- SNSリンク

### 📧 お問い合わせ
- フォーム機能
- バリデーション
- 送信確認

## 🎨 デザインシステム

- **ガラスモーフィズム** ナビゲーション
- **グラデーション** エフェクト
- **アニメーション** 遷移
- **レスポンシブ** デザイン
- **ダークモード** 完全対応

## 🛠️ 開発・デプロイ

### Frontend開発
```bash
cd frontend
npm install
npm run dev     # 開発サーバー
npm run build   # 本番ビルド
```

### 統合開発（推奨）
```bash
# フロントエンドとSanity Studioを同時起動
cd frontend
npm run dev:all
```

### 個別起動
```bash
# フロントエンドのみ
cd frontend
npm run dev

# Sanity Studioのみ
cd frontend
npm run studio:dev
```

## 🌐 デプロイ

- **Frontend**: Vercel
- **CMS**: Sanity Cloud
- **ドメイン**: TBD

## 📊 パフォーマンス

- **Core Web Vitals** 最適化済み
- **Lighthouse Score** 90+
- **SEO** 完全対応

---

Created with ❤️ by 佐々木