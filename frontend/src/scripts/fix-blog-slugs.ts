import { client } from '../lib/sanity-node'

async function main() {
  try {
    console.log('🔍 すべての記事をチェックします...')
    
    // すべての記事を取得（スラッグの条件なし）
    const query = `*[_type == "post"] {
      _id,
      title,
      slug,
      publishedAt,
      _createdAt
    }`
    
    const posts = await client.fetch(query)
    console.log(`📄 合計 ${posts.length} 件の記事が見つかりました`)
    
    for (const post of posts) {
      console.log('\n---')
      console.log(`タイトル: ${post.title}`)
      console.log(`ID: ${post._id}`)
      console.log(`スラッグ: ${post.slug?.current || '❌ 未設定'}`)
      console.log(`公開日: ${post.publishedAt || '❌ 未設定'}`)
      
      // スラッグが空または未設定の場合は修正
      if (!post.slug?.current) {
        const newSlug = `${post.title
          .toLowerCase()
          .slice(0, 30)
          .replace(/[^a-z0-9ぁ-んァ-ヶー一-龠]+/g, '-')
          .replace(/^-+|-+$/g, '')}-${Date.now()}`
        
        console.log(`🔧 スラッグを修正します: ${newSlug}`)
        
        try {
          await client
            .patch(post._id)
            .set({ 
              slug: { 
                _type: 'slug', 
                current: newSlug 
              }
            })
            .commit()
          
          console.log('✅ スラッグ修正完了')
        } catch (error) {
          console.error('❌ スラッグ修正エラー:', error)
        }
      }
      
      // 公開日が未設定の場合は設定
      if (!post.publishedAt) {
        const publishDate = post._createdAt || new Date().toISOString()
        console.log(`📅 公開日を設定します: ${publishDate}`)
        
        try {
          await client
            .patch(post._id)
            .set({ publishedAt: publishDate })
            .commit()
          
          console.log('✅ 公開日設定完了')
        } catch (error) {
          console.error('❌ 公開日設定エラー:', error)
        }
      }
    }
    
    console.log('\n🎉 記事の修正が完了しました！')
    console.log('ブログページを再読み込みして確認してください。')
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
  }
}

main()