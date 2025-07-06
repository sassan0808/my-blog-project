// 統一されたスラッグ生成ユーティリティ（フロントエンド版）

/**
 * 基本的なスラッグ生成
 */
export function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // 日本語文字をローマ字に変換（簡易版）
    .replace(/[ぁ-ん]/g, (match) => {
      const hiraganaMap: Record<string, string> = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
      }
      return hiraganaMap[match] || match
    })
    // カタカナをローマ字に変換
    .replace(/[ァ-ヶ]/g, (match) => {
      const katakanaMap: Record<string, string> = {
        'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
        'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
        'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
        'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
        'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
        'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
        'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
        'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
        'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
        'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
        'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
        'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
        'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
        'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
        'ワ': 'wa', 'ヰ': 'wi', 'ヱ': 'we', 'ヲ': 'wo', 'ン': 'n'
      }
      return katakanaMap[match] || match
    })
    // 漢字や特殊文字を削除
    .replace(/[^\w\s-]/g, '')
    // 複数のスペースやハイフンを単一に
    .replace(/[\s_-]+/g, '-')
    // 前後のハイフンを削除
    .replace(/^-+|-+$/g, '')
    // 最大長50文字に制限
    .slice(0, 50)
    // 最後がハイフンの場合は削除
    .replace(/-+$/, '')
}

/**
 * 一意性を保証するスラッグ生成
 */
export function createUniqueSlug(title: string, timestamp?: number): string {
  const baseSlug = createSlug(title)
  const time = timestamp || Date.now()
  
  // ベーススラッグが短すぎる場合はフォールバック
  if (baseSlug.length < 3) {
    return `post-${time}`
  }
  
  return `${baseSlug}-${time}`
}

/**
 * スラッグのバリデーション
 */
export function validateSlug(slug: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!slug) {
    errors.push('スラッグは必須です')
  }
  
  if (slug.length < 3) {
    errors.push('スラッグは3文字以上である必要があります')
  }
  
  if (slug.length > 96) {
    errors.push('スラッグは96文字以下である必要があります')
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('スラッグは小文字、数字、ハイフンのみ使用できます')
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('スラッグの最初と最後にハイフンは使用できません')
  }
  
  if (slug.includes('--')) {
    errors.push('連続するハイフンは使用できません')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * スラッグの修正提案
 */
export function suggestSlugFix(invalidSlug: string): string {
  return createSlug(invalidSlug)
}