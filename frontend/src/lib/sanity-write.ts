import { client } from './sanity-node'
import { v4 as uuidv4 } from 'uuid'

interface CreatePostData {
  title: string
  content: string
  categoryIds?: string[]
  authorId?: string
}

export async function createBlogPost({
  title,
  content,
  categoryIds = [],
  authorId
}: CreatePostData) {
  // 日本語タイトルをローマ字に変換する簡易的な方法
  const slug = `post-${Date.now()}-${title
    .slice(0, 20)
    .toLowerCase()
    .replace(/[^a-z0-9ぁ-んァ-ヶー一-龠]+/g, '-')
    .replace(/^-+|-+$/g, '')}`
    .substring(0, 96)

  // Portable Textフォーマットに変換
  const blocks = content.split('\n\n').map(paragraph => ({
    _type: 'block',
    _key: uuidv4(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: uuidv4(),
        text: paragraph,
        marks: []
      }
    ]
  }))

  const doc = {
    _type: 'post',
    title,
    slug: {
      _type: 'slug',
      current: slug
    },
    publishedAt: new Date().toISOString(),
    body: blocks,
    ...(categoryIds.length > 0 && {
      categories: categoryIds.map(id => ({
        _type: 'reference',
        _ref: id
      }))
    }),
    ...(authorId && {
      author: {
        _type: 'reference',
        _ref: authorId
      }
    })
  }

  try {
    const result = await client.create(doc)
    console.log('✅ Blog post created:', result)
    return result
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
    throw error
  }
}

// カテゴリーを作成する関数
export async function createCategory(title: string, description?: string) {
  const doc = {
    _type: 'category',
    title,
    ...(description && { description })
  }

  try {
    const result = await client.create(doc)
    console.log('✅ Category created:', result)
    return result
  } catch (error) {
    console.error('❌ Error creating category:', error)
    throw error
  }
}

// 著者を取得する関数
export async function getOrCreateAuthor(name: string) {
  try {
    // 既存の著者を検索
    const existingAuthor = await client.fetch(
      `*[_type == "author" && name == $name][0]`,
      { name }
    )
    
    if (existingAuthor) {
      return existingAuthor._id
    }

    // 存在しない場合は作成
    const newAuthor = await client.create({
      _type: 'author',
      name,
      slug: {
        _type: 'slug',
        current: name.toLowerCase().replace(/\s+/g, '-')
      }
    })
    
    return newAuthor._id
  } catch (error) {
    console.error('❌ Error with author:', error)
    throw error
  }
}