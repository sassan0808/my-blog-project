import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataService } from '../lib/data'
import type { Post, Category } from '../types/post'
import SEOHead from '../components/SEOHead'
import { TagList } from '../components/TagList'

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log('📋 BlogList: Starting data fetch...')
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          DataService.getBlogPosts(),
          DataService.getCategories()
        ])
        console.log('📋 BlogList: Data fetched successfully', {
          posts: postsResponse.posts.length,
          categories: categoriesResponse.categories.length
        })
        setPosts(postsResponse.posts)
        setCategories(categoriesResponse.categories)
        
        // API エラーがあれば記録
        const errors = []
        if (postsResponse.error) errors.push(postsResponse.error)
        if (categoriesResponse.error) errors.push(categoriesResponse.error)
        
        if (errors.length > 0) {
          setApiError(errors.join(' | '))
        }
      } catch (error) {
        console.error('📋 BlogList: Error fetching data:', error)
        setError('データの読み込みに失敗しました。しばらくしてから再度お試しください。')
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">記事を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラー</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="ブログ | Sasaki"
        description="ビジネスに役立つAI活用、組織開発、Well-beingに関する記事をお届けします。"
        url={window.location.origin}
      />
      <div className="min-h-screen pt-20 bg-brand-slate-50 dark:bg-brand-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ヘッダーセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
            ブログ記事
          </h1>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-6"></div>
          <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 max-w-2xl mx-auto font-inter">
            ビジネスの成長を加速させる実践的なインサイトとアドバイス
          </p>
        </div>
        
        {/* API エラー表示 */}
        {apiError && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                API接続エラー（フォールバックデータを表示中）
              </p>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              {apiError}
            </p>
          </div>
        )}
        
        {/* カテゴリーフィルター */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-lg font-montserrat font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 shadow-lg'
                  : 'bg-white dark:bg-brand-navy-800 text-brand-slate-700 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-navy-700 border border-brand-slate-200 dark:border-brand-navy-700'
              }`}
            >
              全て
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-6 py-2.5 rounded-lg font-montserrat font-medium transition-all duration-200 ${
                  selectedCategory === category._id
                    ? 'bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 shadow-lg'
                    : 'bg-white dark:bg-brand-navy-800 text-brand-slate-700 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-navy-700 border border-brand-slate-200 dark:border-brand-navy-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-400 font-inter">
              該当する記事がありません。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts
              .filter((post) => post.slug?.current)
              .map((post) => (
              <article
                key={post._id}
                className="bg-white dark:bg-brand-navy-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-slate-200 dark:border-brand-navy-700"
              >
                <Link
                  to={`/blog/${post.slug?.current}`}
                  className="block group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-sm text-brand-slate-500 dark:text-brand-slate-400 font-montserrat">
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
                              className="text-xs px-3 py-1 bg-brand-gold-500/10 text-brand-gold-700 dark:text-brand-gold-400 rounded-full font-montserrat font-medium"
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-playfair font-semibold text-brand-navy-900 dark:text-white mb-3 group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.tags && post.tags.length > 0 && (
                      <TagList tags={post.tags} size="small" className="mb-3" />
                    )}

                    <div className="flex items-center text-brand-navy-700 dark:text-brand-slate-300 font-montserrat font-medium text-sm mt-4">
                      続きを読む
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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