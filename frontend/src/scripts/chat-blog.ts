import { writeBlog } from '../lib/vibe-blog'

/**
 * チャットで指示された内容をそのままブログに投稿する関数
 */
export async function postFromChat(title: string, content: string, options?: {
  author?: string
  categories?: string[]
  publish?: boolean
}) {
  console.log('🗣️ チャットからブログ投稿を開始...')
  
  const result = await writeBlog({
    title,
    content,
    author: options?.author || '佐々木',
    categories: options?.categories || ['体験談'],
    publish: options?.publish || false
  })

  if (result.success) {
    console.log('🎉 チャットからの投稿が完了しました！')
    console.log(`📝 タイトル: ${title}`)
    console.log(`🔗 URL: http://localhost:5173/blog/${result.data?.slug.current}`)
    
    return {
      success: true,
      url: `http://localhost:5173/blog/${result.data?.slug.current}`,
      id: result.data?._id
    }
  } else {
    console.error('❌ 投稿に失敗しました:', result.error)
    return {
      success: false,
      error: result.error
    }
  }
}


export default postFromChat