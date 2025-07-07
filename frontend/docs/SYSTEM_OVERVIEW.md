# システム全体構成図

## 🌐 システム全体像

**Excalidraw で作成:** https://excalidraw.com

### 🎨 手書き風システム構成図

この図では、**クリーンアーキテクチャ**の層構造とSanity CMSとの統合を表現しています。

```
┌─────────────────────────────────────────┐
│           Browser (Client)              │
│  ┌─────────────────────────────────────┐ │
│  │          React App                  │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │      Presentation Layer         │ │ │
│  │  │   Pages → Components → Hooks    │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │               ↓                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │      Application Layer          │ │ │
│  │  │       Use Cases ← Services      │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │               ↓                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │        Domain Layer             │ │ │
│  │  │  Entities ← Value Objects       │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │               ↓                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │    Infrastructure Layer         │ │ │
│  │  │   API Clients → Processors      │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │               ↓                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │         Core Layer              │ │ │
│  │  │  Config → Errors → Logging      │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         External Services               │
│  ┌─────────────────────────────────────┐ │
│  │           Sanity CMS                │ │
│  │  ┌─────────────┐ ┌─────────────────┐│ │
│  │  │ Sanity API  │ │ Assets Storage  ││ │
│  │  └─────────────┘ └─────────────────┘│ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │        Hosting & CI/CD              │ │
│  │  ┌─────────────┐ ┌─────────────────┐│ │
│  │  │   GitHub    │ │     Vercel      ││ │
│  │  └─────────────┘ └─────────────────┘│ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 🎯 アーキテクチャのポイント

1. **依存性の流れ**: 外側 → 内側（クリーンアーキテクチャ）
2. **関心事の分離**: 各レイヤーが明確な責務を持つ
3. **外部統合**: Sanity CMS との疎結合な連携
4. **型安全性**: TypeScript で全体を保護

## 🏛 アーキテクチャパターン

### **クリーンアーキテクチャ + DDD**

```mermaid
graph LR
    subgraph "外側から内側へ"
        EXT[外部インターフェース]
        INFRA2[インフラ層]
        APP[アプリケーション層]
        DOM2[ドメイン層]
        CORE2[コア層]
    end
    
    EXT --> INFRA2
    INFRA2 --> APP
    APP --> DOM2
    DOM2 --> CORE2
    
    style EXT fill:#60A5FA
    style INFRA2 fill:#F59E0B
    style APP fill:#8B5CF6
    style DOM2 fill:#10B981
    style CORE2 fill:#EF4444
```

**依存性の方向:**
- 外側のレイヤーは内側のレイヤーに依存
- 内側のレイヤーは外側を知らない
- インターフェースによる依存性逆転

## 📊 データフロー

### **記事作成フロー**

```mermaid
flowchart TD
    START[開始] --> INPUT[記事入力画面]
    INPUT --> VALIDATE{入力検証}
    
    VALIDATE -->|OK| PROCESS[画像処理]
    VALIDATE -->|NG| ERROR1[エラー表示]
    ERROR1 --> INPUT
    
    PROCESS --> OPTIMIZE[画像最適化]
    OPTIMIZE --> UPLOAD[Sanityアップロード]
    
    UPLOAD --> CREATE[記事作成]
    CREATE --> PUBLISH{公開設定}
    
    PUBLISH -->|下書き| DRAFT[下書き保存]
    PUBLISH -->|公開| LIVE[記事公開]
    
    DRAFT --> END[完了]
    LIVE --> END
    
    style START fill:#10B981
    style END fill:#10B981
    style ERROR1 fill:#EF4444
    style PROCESS fill:#F59E0B
    style UPLOAD fill:#8B5CF6
```

## 🔐 型安全性保証システム

### **TypeScript設定階層**

```mermaid
graph TD
    ROOT[tsconfig.json<br/>プロジェクトルート]
    APP[tsconfig.app.json<br/>アプリケーション設定]
    NODE[tsconfig.node.json<br/>Node.js設定]
    
    ROOT --> APP
    ROOT --> NODE
    
    APP --> STRICT[厳格モード設定<br/>- strict: true<br/>- noUnusedLocals: true<br/>- noUnusedParameters: true]
    APP --> MODULE[モジュール設定<br/>- verbatimModuleSyntax: true<br/>- erasableSyntaxOnly: true]
    
    style ROOT fill:#3B82F6
    style STRICT fill:#EF4444
    style MODULE fill:#F59E0B
```

## 🚀 デプロイメントフロー

```mermaid
flowchart LR
    subgraph "開発環境"
        DEV[ローカル開発]
        TEST[テスト実行]
    end
    
    subgraph "CI/CD"
        GHA[GitHub Actions]
        BUILD[ビルド]
        LINT[Linting]
        TYPE[型チェック]
    end
    
    subgraph "本番環境"
        VERCEL2[Vercel]
        CDN[CDN配信]
        PROD[本番サイト]
    end
    
    DEV --> |git push| GHA
    GHA --> BUILD
    GHA --> LINT
    GHA --> TYPE
    
    BUILD --> |成功| VERCEL2
    LINT --> |成功| VERCEL2
    TYPE --> |成功| VERCEL2
    
    VERCEL2 --> CDN
    CDN --> PROD
    
    style DEV fill:#10B981
    style GHA fill:#24292e
    style VERCEL2 fill:#000000,color:#fff
    style PROD fill:#3B82F6
```

## 📈 パフォーマンス最適化

### **画像処理パイプライン**

```mermaid
graph LR
    INPUT2[元画像] --> VALIDATE2[検証]
    VALIDATE2 --> RESIZE[リサイズ]
    RESIZE --> COMPRESS[圧縮]
    COMPRESS --> FORMAT[フォーマット変換]
    FORMAT --> CACHE[キャッシュ]
    CACHE --> OUTPUT[最適化済み画像]
    
    style INPUT2 fill:#60A5FA
    style VALIDATE2 fill:#10B981
    style COMPRESS fill:#F59E0B
    style OUTPUT fill:#8B5CF6
```

## 🔍 監視とロギング

### **ロギングシステム**

```mermaid
graph TD
    APP2[アプリケーション] --> LOGGER[Logger Interface]
    
    LOGGER --> CONSOLE[Console Logger]
    LOGGER --> FILE[File Logger<br/>※将来実装]
    LOGGER --> REMOTE[Remote Logger<br/>※将来実装]
    
    CONSOLE --> FORMAT[フォーマット処理]
    FORMAT --> OUTPUT2[構造化ログ出力]
    
    OUTPUT2 --> |開発環境| TERM[ターミナル]
    OUTPUT2 --> |本番環境| MONITOR[監視サービス]
    
    style LOGGER fill:#8B5CF6
    style CONSOLE fill:#10B981
    style OUTPUT2 fill:#F59E0B
```

## 🛡 エラーハンドリング

### **エラー階層構造**

```mermaid
classDiagram
    class BaseError {
        +name: string
        +message: string
        +code: string
        +timestamp: Date
        +toJSON()
    }
    
    class ImageError {
        +imagePath: string
        +operation: string
    }
    
    class SanityError {
        +sanityCode: string
        +documentId: string
    }
    
    class ValidationError {
        +fields: ValidationField[]
    }
    
    BaseError <|-- ImageError
    BaseError <|-- SanityError
    BaseError <|-- ValidationError
    
    ImageError <|-- ImageValidationError
    ImageError <|-- ImageProcessingError
    ImageError <|-- ImageUploadError
    
    SanityError <|-- SanityConnectionError
    SanityError <|-- SanityDocumentError
    SanityError <|-- SanityAssetUploadError
```

## 🎨 UI/UXフロー

### **記事作成画面フロー**

```mermaid
stateDiagram-v2
    [*] --> 入力画面
    
    入力画面 --> 画像選択
    画像選択 --> プレビュー
    プレビュー --> 画像編集
    画像編集 --> プレビュー
    
    プレビュー --> 記事作成
    記事作成 --> 確認画面
    
    確認画面 --> 下書き保存
    確認画面 --> 公開
    
    下書き保存 --> 完了
    公開 --> 完了
    完了 --> [*]
    
    入力画面 --> キャンセル
    画像選択 --> キャンセル
    確認画面 --> キャンセル
    キャンセル --> [*]
```

## 📱 レスポンシブ対応

### **ブレークポイント戦略**

```
┌─────────────────────────────────────────────────┐
│  Mobile First Approach                          │
├─────────────────────────────────────────────────┤
│  320px  │  768px  │  1024px  │  1280px  │      │
│    SM   │    MD   │    LG    │    XL    │ 2XL  │
├─────────┼─────────┼──────────┼──────────┼──────┤
│ Mobile  │ Tablet  │  Laptop  │ Desktop  │ Wide │
└─────────┴─────────┴──────────┴──────────┴──────┘
```

## 🔄 今後の拡張計画

1. **マイクロサービス化**
   - 画像処理サービスの分離
   - APIゲートウェイの導入
   - サービスメッシュの検討

2. **AI/ML統合**
   - 画像認識API連携
   - 自動タグ付け
   - コンテンツ推薦

3. **リアルタイム機能**
   - WebSocket通信
   - リアルタイムプレビュー
   - 協調編集機能