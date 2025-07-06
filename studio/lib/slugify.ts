// 統一されたスラッグ生成ロジック
export function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // 日本語文字をローマ字に変換（簡易版）
    .replace(/[ぁ-ん]/g, (match) => {
      const map: Record<string, string> = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
      }
      return map[match] || match
    })
    // カタカナをローマ字に変換
    .replace(/[ァ-ヶ]/g, (match) => {
      const map: Record<string, string> = {
        'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
        'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
        'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
        'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
        'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
        'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
        'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
        'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
        'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
        'ワ': 'wa', 'ヰ': 'wi', 'ヱ': 'we', 'ヲ': 'wo', 'ン': 'n'
      }
      return map[match] || match
    })
    // 漢字や特殊文字を処理
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

// 一意性を保証するスラッグ生成
export function createUniqueSlug(title: string, timestamp?: number): string {
  const baseSlug = createSlug(title)
  const time = timestamp || Date.now()
  
  // ベーススラッグが短すぎる場合はフォールバック
  if (baseSlug.length < 3) {
    return `post-${time}`
  }
  
  return `${baseSlug}-${time}`
}

// バリデーション関数
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