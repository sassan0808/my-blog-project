import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataService } from '../lib/data'
import type { Post, Category } from '../types/post'
import SEOHead from '../components/SEOHead'

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          DataService.getBlogPosts(),
          DataService.getCategories()
        ])
        setPosts(postsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredPosts = selectedCategory
    ? posts.filter(post => 
        post.categories?.some(cat => cat._id === selectedCategory)
      )
    : posts

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
      <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          ブログ記事一覧
        </h1>
        
        {/* カテゴリーフィルター */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              全て
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category._id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        
        {filteredPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            記事がまだありません。
          </p>
        ) : (
          <div className="space-y-6">
            {filteredPosts
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
                  <div className="flex items-center gap-4 mb-2">
                    <time className="text-sm text-gray-600 dark:text-gray-400">
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
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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