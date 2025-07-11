# プロフェッショナル記事作成システム

## 概要
質疑応答形式で高品質な記事を作成するインタラクティブシステム

## 記事作成フロー

### 1. 初期設定
```
Q: どのような記事を作成しますか？
1. 新規記事作成（詳細ヒアリング）
2. テンプレートから作成（簡易ヒアリング）
3. アイデアだけある（フルヒアリング）
```

### 2. ヒアリング項目

#### 必須項目（スキップ不可）
- **記事の目的**: 何を達成したいか
- **ターゲット読者**: 誰に向けて書くか
- **希望カテゴリー**: AI活用/組織開発/Well-being

#### 詳細項目（スキップ可能）
- **記事の種類**
  - ハウツー記事
  - 解説記事
  - 事例紹介
  - トレンド分析
  - 問題提起型

- **専門性レベル**
  - 初心者向け（専門用語を避ける）
  - 中級者向け（基礎知識前提）
  - 上級者向け（深い洞察）

- **文章スタイル**
  - カジュアル（親しみやすい）
  - ビジネス（プロフェッショナル）
  - アカデミック（論文調）

- **構成要素**
  - 事例の数（0-5個）
  - データ/統計の使用
  - 図解の必要性
  - 引用の有無

### 3. 高品質化のためのヒアリング

#### コンテンツの深さ
```
Q: この記事で読者に提供したい「独自の価値」は何ですか？
- 他では得られない実体験
- 独自の分析視点
- 新しい解決方法
- 業界の内部情報
```

#### 具体性の確保
```
Q: 具体的なエピソードや数値はありますか？
- 実際の成功/失敗事例
- 具体的な改善数値（%、時間、コスト）
- 使用したツール名やバージョン
- 実施期間や規模
```

#### 信頼性の向上
```
Q: 記事の信頼性を高める要素：
- 参考文献やソース
- 専門家の意見
- 公的データ
- 実証済みの方法論
```

## プロレベルの記事要素

### 1. フック（導入部）の作り方
- **問題提起型**: 「〜で困っていませんか？」
- **統計型**: 「実は〜の企業の80%が...」
- **ストーリー型**: 「先日、ある経営者から相談を...」
- **逆説型**: 「一般的には〜と言われていますが...」

### 2. 本文の構成パターン

#### PREP法
- **P**oint: 結論
- **R**eason: 理由
- **E**xample: 具体例
- **P**oint: 結論の再確認

#### SDS法
- **S**ummary: 概要
- **D**etails: 詳細
- **S**ummary: まとめ

#### AIDMA法
- **A**ttention: 注意
- **I**nterest: 興味
- **D**esire: 欲求
- **M**emory: 記憶
- **A**ction: 行動

### 3. 説得力を高めるテクニック

#### 数値の活用
- Before/Afterの明確化
- ROIの提示
- 時間短縮の具体例
- コスト削減の実績

#### ストーリーテリング
- 課題の共感
- 解決への道のり
- 結果と学び
- 次のステップ

#### 権威性の付与
- 専門資格の明示
- 実績の提示
- 有名企業の事例
- 専門家の引用

## Claude Codeへの指示テンプレート

### 詳細版（フルヒアリング後）
```
以下の要件で記事を作成してください：

【基本情報】
- タイトル案: [ヒアリング結果]
- カテゴリー: [選択されたカテゴリー]
- ターゲット: [詳細なペルソナ]
- 目的: [具体的な目標]

【記事仕様】
- 文字数: [指定文字数]
- 専門性: [レベル]
- 文体: [スタイル]
- 構成: [選択された構成法]

【必須要素】
- フック: [タイプと内容]
- 具体例: [提供された事例]
- データ: [使用する統計]
- CTA: [最終的な行動喚起]

【SEO対策】
- メインキーワード: [キーワード]
- 関連キーワード: [リスト]
- 内部リンク候補: [関連記事]
```

### 簡易版（スキップ時）
```
[トピック]について、[ターゲット]向けの[カテゴリー]記事を作成してください。
ARTICLE_GUIDELINES.mdの形式に従い、プロフェッショナルな内容にしてください。
```

## 品質チェックリスト

### 内容面
- [ ] 読者の課題が明確に定義されている
- [ ] 解決策が具体的で実行可能
- [ ] 独自の視点や価値がある
- [ ] 根拠となるデータや事例がある

### 構成面
- [ ] 導入部で興味を引いている
- [ ] 論理的な流れになっている
- [ ] 各セクションが適切な長さ
- [ ] まとめが行動を促している

### 表現面
- [ ] ターゲットに適した言葉遣い
- [ ] 専門用語の説明がある
- [ ] 読みやすい文章長
- [ ] 適切な改行と見出し

## 実装方法

1. **ヒアリングスクリプトの作成**
   - 対話形式で必要な情報を収集
   - スキップオプションの実装
   - 回答の保存と活用

2. **記事生成の高度化**
   - ヒアリング結果を反映
   - プロ向けテンプレートの適用
   - 品質チェックの自動化

3. **継続的な改善**
   - 生成された記事の分析
   - 読者フィードバックの収集
   - テンプレートの更新