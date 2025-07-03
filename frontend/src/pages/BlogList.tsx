import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataService } from '../lib/data'
import type { Post } from '../types/post'
import SEOHead from '../components/SEOHead'

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await DataService.getBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="My Blog | ブログ記事一覧"
        description="Sanity連携ブログサイトの記事一覧ページです。"
        url={window.location.origin}
      />
      <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          ブログ記事一覧
        </h1>
        
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            記事がまだありません。
          </p>
        ) : (
          <div className="space-y-6">
            {posts
              .filter((post) => post.slug?.current)
              .map((post) => (
              <article
                key={post._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <Link
                  to={`/blog/${post.slug?.current}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 -mx-4 rounded-lg transition-colors"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                  <time className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}