import { type PortableTextBlock } from '@portabletext/types'

export interface Category {
  _id: string
  title: string
  description?: string
}

export interface Post {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  } | null
  body?: PortableTextBlock[]
  publishedAt: string
  categories?: Category[]
}