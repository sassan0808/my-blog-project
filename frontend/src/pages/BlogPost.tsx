import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client } from '../lib/sanity'
import type { Post } from '../types/post'
import SEOHead from '../components/SEOHead'
import MarkdownText from '../components/MarkdownText'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      try {
        const query = `*[_type == "post" && slug.current == $slug][0] {
          _id,
          _createdAt,
          title,
          slug,
          body,
          publishedAt
        }`
        const data = await client.fetch(query, { slug })
        setPost(data)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">記事を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            記事が見つかりませんでした
          </h1>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {post && (
        <SEOHead
          title={`${post.title} | My Blog`}
          description={post.title}
          url={`${window.location.origin}/blog/${post.slug?.current}`}
        />
      )}
      <div className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center mb-4"
          >
            ← ブログ一覧に戻る
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <time className="text-gray-600 dark:text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category._id}
                    className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.body && (
            <PortableText
              value={post.body}
            components={{
              block: {
                normal: ({ children }) => (
                  <MarkdownText>{children}</MarkdownText>
                ),
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {children}
                  </h3>
                ),
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900 dark:text-white">
                    {children}
                  </strong>
                ),
                link: ({ children, value }) => (
                  <a
                    href={value.href}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              },
            }}
            />
          )}
        </div>
        </article>
      </div>
    </>
  )
}