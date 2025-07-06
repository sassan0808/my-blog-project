#!/usr/bin/env tsx
import * as readline from 'readline'
import { promises as fs } from 'fs'
import path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

// 記事の要件を格納する型
interface ArticleRequirements {
  mode: 'full' | 'template' | 'quick'
  purpose: string
  target: string
  category: string
  articleType?: string
  expertiseLevel?: string
  writingStyle?: string
  uniqueValue?: string
  specificExamples?: string[]
  dataPoints?: string[]
  references?: string[]
  wordCount?: number
  keywords?: string[]
  hookType?: string
  structureMethod?: string
}

// ヒアリング結果を表示
function displayRequirements(req: ArticleRequirements) {
  console.log('\n' + '='.repeat(60))
  console.log('📋 記事要件サマリー')
  console.log('='.repeat(60))
  console.log(`\n【基本情報】`)
  console.log(`📌 目的: ${req.purpose}`)
  console.log(`👥 ターゲット: ${req.target}`)
  console.log(`📂 カテゴリー: ${req.category}`)
  
  if (req.articleType) {
    console.log(`\n【詳細設定】`)
    console.log(`📝 記事タイプ: ${req.articleType}`)
    console.log(`🎓 専門性レベル: ${req.expertiseLevel}`)
    console.log(`✍️  文体: ${req.writingStyle}`)
    console.log(`📏 文字数: ${req.wordCount}文字`)
  }
  
  if (req.uniqueValue) {
    console.log(`\n【独自価値】`)
    console.log(`💎 ${req.uniqueValue}`)
  }
  
  if (req.specificExamples && req.specificExamples.length > 0) {
    console.log(`\n【具体例】`)
    req.specificExamples.forEach((ex, i) => {
      console.log(`${i + 1}. ${ex}`)
    })
  }
  
  console.log('\n' + '='.repeat(60))
}

// プロンプトを生成
function generatePrompt(req: ArticleRequirements): string {
  let prompt = `以下の要件に従って、プロフェッショナルな記事を作成してください：\n\n`
  
  prompt += `【基本情報】\n`
  prompt += `- 目的: ${req.purpose}\n`
  prompt += `- ターゲット読者: ${req.target}\n`
  prompt += `- カテゴリー: ${req.category}\n\n`
  
  if (req.mode === 'full' || req.mode === 'template') {
    prompt += `【記事仕様】\n`
    prompt += `- 記事タイプ: ${req.articleType}\n`
    prompt += `- 専門性レベル: ${req.expertiseLevel}\n`
    prompt += `- 文体: ${req.writingStyle}\n`
    prompt += `- 文字数: ${req.wordCount}文字程度\n`
    prompt += `- 構成方法: ${req.structureMethod}\n`
    prompt += `- フックのタイプ: ${req.hookType}\n\n`
  }
  
  if (req.uniqueValue) {
    prompt += `【提供する独自価値】\n${req.uniqueValue}\n\n`
  }
  
  if (req.specificExamples && req.specificExamples.length > 0) {
    prompt += `【含めるべき具体例】\n`
    req.specificExamples.forEach((ex, i) => {
      prompt += `${i + 1}. ${ex}\n`
    })
    prompt += '\n'
  }
  
  if (req.dataPoints && req.dataPoints.length > 0) {
    prompt += `【使用するデータ/統計】\n`
    req.dataPoints.forEach((data, i) => {
      prompt += `${i + 1}. ${data}\n`
    })
    prompt += '\n'
  }
  
  if (req.keywords && req.keywords.length > 0) {
    prompt += `【SEOキーワード】\n`
    prompt += `メインキーワード: ${req.keywords[0]}\n`
    prompt += `サブキーワード: ${req.keywords.slice(1).join(', ')}\n\n`
  }
  
  prompt += `【記事フォーマット】\n`
  prompt += `- ARTICLE_GUIDELINES.mdの形式に従う\n`
  prompt += `- 目次を含める\n`
  prompt += `- メタ情報（カテゴリー、タグ、SEO設定）を最後に記載\n`
  prompt += `- Markdown形式で出力\n\n`
  
  prompt += `【品質要件】\n`
  prompt += `- 読者の課題を明確に定義\n`
  prompt += `- 実行可能な解決策を提供\n`
  prompt += `- 根拠となるデータや事例を含める\n`
  prompt += `- 最後に明確な行動喚起（CTA）を含める`
  
  return prompt
}

async function main() {
  console.log('🚀 プロフェッショナル記事作成システム\n')
  
  try {
    // モード選択
    console.log('どのモードで記事を作成しますか？')
    console.log('1. フルカスタマイズ（詳細ヒアリング）')
    console.log('2. テンプレート使用（基本ヒアリング）')
    console.log('3. クイック作成（最小限のヒアリング）')
    
    const modeChoice = await question('\n選択してください (1-3): ')
    const mode = modeChoice === '1' ? 'full' : modeChoice === '2' ? 'template' : 'quick'
    
    const requirements: ArticleRequirements = {
      mode,
      purpose: '',
      target: '',
      category: ''
    }
    
    // 必須項目のヒアリング
    console.log('\n【必須項目】')
    requirements.purpose = await question('📌 記事の目的は何ですか？: ')
    requirements.target = await question('👥 誰に向けて書きますか？（例：IT企業の経営者）: ')
    
    console.log('\n📂 カテゴリーを選択してください:')
    console.log('1. AI活用')
    console.log('2. 組織開発')
    console.log('3. Well-being')
    const catChoice = await question('選択 (1-3): ')
    requirements.category = catChoice === '1' ? 'AI活用' : catChoice === '2' ? '組織開発' : 'Well-being'
    
    // モードに応じた追加ヒアリング
    if (mode === 'full' || mode === 'template') {
      console.log('\n【詳細設定】')
      
      // 記事タイプ
      console.log('\n📝 記事タイプを選択:')
      console.log('1. ハウツー記事（方法を教える）')
      console.log('2. 解説記事（概念を説明）')
      console.log('3. 事例紹介（成功/失敗事例）')
      console.log('4. トレンド分析（最新動向）')
      console.log('5. 問題提起型（課題と解決策）')
      const typeChoice = await question('選択 (1-5): ')
      const types = ['ハウツー記事', '解説記事', '事例紹介', 'トレンド分析', '問題提起型']
      requirements.articleType = types[parseInt(typeChoice) - 1]
      
      // 専門性レベル
      console.log('\n🎓 専門性レベル:')
      console.log('1. 初心者向け（専門用語を避ける）')
      console.log('2. 中級者向け（基礎知識前提）')
      console.log('3. 上級者向け（深い洞察）')
      const levelChoice = await question('選択 (1-3): ')
      const levels = ['初心者向け', '中級者向け', '上級者向け']
      requirements.expertiseLevel = levels[parseInt(levelChoice) - 1]
      
      // 文体
      console.log('\n✍️  文体:')
      console.log('1. カジュアル（親しみやすい）')
      console.log('2. ビジネス（プロフェッショナル）')
      console.log('3. アカデミック（論文調）')
      const styleChoice = await question('選択 (1-3): ')
      const styles = ['カジュアル', 'ビジネス', 'アカデミック']
      requirements.writingStyle = styles[parseInt(styleChoice) - 1]
      
      // 文字数
      const wordCountStr = await question('\n📏 目標文字数（デフォルト: 2500）: ')
      requirements.wordCount = wordCountStr ? parseInt(wordCountStr) : 2500
      
      // 構成方法
      console.log('\n📐 構成方法:')
      console.log('1. PREP法（結論→理由→例→結論）')
      console.log('2. SDS法（概要→詳細→まとめ）')
      console.log('3. AIDMA法（注意→興味→欲求→記憶→行動）')
      const structChoice = await question('選択 (1-3): ')
      const structures = ['PREP法', 'SDS法', 'AIDMA法']
      requirements.structureMethod = structures[parseInt(structChoice) - 1]
      
      // フックタイプ
      console.log('\n🪝 導入部のフック:')
      console.log('1. 問題提起型（〜で困っていませんか？）')
      console.log('2. 統計型（〜の企業の80%が...）')
      console.log('3. ストーリー型（先日、ある経営者から...）')
      console.log('4. 逆説型（一般的には〜ですが...）')
      const hookChoice = await question('選択 (1-4): ')
      const hooks = ['問題提起型', '統計型', 'ストーリー型', '逆説型']
      requirements.hookType = hooks[parseInt(hookChoice) - 1]
    }
    
    if (mode === 'full') {
      console.log('\n【高品質化のための追加情報】')
      
      // 独自価値
      requirements.uniqueValue = await question('\n💎 この記事の独自価値は？（他にない視点や情報）: ')
      
      // 具体例
      console.log('\n📊 具体的な事例やエピソード（Enterで次へ、空白で終了）:')
      requirements.specificExamples = []
      let exampleCount = 1
      while (true) {
        const example = await question(`例${exampleCount}: `)
        if (!example) break
        requirements.specificExamples.push(example)
        exampleCount++
      }
      
      // データポイント
      console.log('\n📈 使用したいデータや統計（Enterで次へ、空白で終了）:')
      requirements.dataPoints = []
      let dataCount = 1
      while (true) {
        const data = await question(`データ${dataCount}: `)
        if (!data) break
        requirements.dataPoints.push(data)
        dataCount++
      }
      
      // SEOキーワード
      const keywordsStr = await question('\n🔍 SEOキーワード（カンマ区切り）: ')
      requirements.keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()) : []
    }
    
    // 要件確認
    displayRequirements(requirements)
    
    const confirm = await question('\nこの要件で記事作成プロンプトを生成しますか？ (yes/no): ')
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ キャンセルしました')
      rl.close()
      return
    }
    
    // プロンプト生成
    const prompt = generatePrompt(requirements)
    
    // タイトルからファイル名を生成
    const titleForFilename = await question('\n📄 記事のタイトルを入力してください: ')
    const filename = titleForFilename
      .toLowerCase()
      .replace(/[！-～]/g, '')
      .replace(/[^a-z0-9ぁ-んァ-ヶー一-龠]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) // 長すぎる場合は50文字で切る
    
    const timestamp = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const articleFilename = `${timestamp}-${filename}.md`
    
    // プロンプトをファイルに保存
    const promptPath = path.join(process.cwd(), `${timestamp}-${filename}-prompt.txt`)
    await fs.writeFile(promptPath, prompt, 'utf-8')
    
    console.log('\n✅ プロンプトを生成しました！')
    console.log(`📄 プロンプト保存先: ${promptPath}`)
    console.log(`📄 記事保存予定: ../${articleFilename}`)
    console.log('\n--- プロンプト内容 ---')
    console.log(prompt)
    console.log('\n--- プロンプト終了 ---')
    
    console.log('\n💡 次のステップ:')
    console.log('1. 上記のプロンプトをClaude Codeに貼り付ける')
    console.log(`2. 生成された記事を ../${articleFilename} として保存`)
    console.log('3. npx tsx src/scripts/post-article-interactive.ts で投稿')
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  } finally {
    rl.close()
  }
}

main()