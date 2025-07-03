export interface Post {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  } | null
  body?: any[]
  publishedAt: string
}