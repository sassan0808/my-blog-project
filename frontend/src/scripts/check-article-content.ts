import { client } from '../lib/sanity-node'

async function checkArticleContent() {
  try {
    console.log('🔍 記事コンテンツの詳細確認...')
    
    // 1. パラダイムシフト記事の詳細確認
    const query = `*[_type == "post" && title match "*パラダイムシフト*"][0] {
      _id,
      title,
      body,
      slug,
      publishedAt
    }`
    
    const result = await client.fetch(query)
    console.log('📄 記事データ:', JSON.stringify(result, null, 2))
    
    // 2. body部分の詳細分析
    if (result?.body) {
      console.log('\n📝 Body部分の構造:')
      console.log('Body type:', typeof result.body)
      console.log('Body is array:', Array.isArray(result.body))
      
      if (Array.isArray(result.body)) {
        console.log('Body length:', result.body.length)
        console.log('First block:', JSON.stringify(result.body[0], null, 2))
        
        if (result.body.length > 1) {
          console.log('Second block:', JSON.stringify(result.body[1], null, 2))
        }
      }
    } else {
      console.log('⚠️ Body部分が見つかりません')
    }
    
    // 3. 他の記事も確認
    const otherQuery = `*[_type == "post"][0..2] {
      _id,
      title,
      "bodyType": select(body != null => "PortableText", "no-body"),
      "bodyLength": length(body),
      "firstBlock": body[0]
    }`
    
    const others = await client.fetch(otherQuery)
    console.log('\n📋 他の記事のBody確認:', JSON.stringify(others, null, 2))
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkArticleContent()