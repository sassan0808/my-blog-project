import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getBlogPosts, getBlogCategories } from '../lib/blog-api'
import type { Post, Category, PostFilters, PostSort } from '../types/post'
import SEOHead from '../components/SEOHead'

export default function BlogListOptimized() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<PostSort>({ field: 'publishedAt', direction: 'desc' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // フィルター条件をメモ化
  const filters = useMemo<PostFilters>(() => ({
    category: selectedCategory || undefined,
    search: searchTerm.trim() || undefined
  }), [selectedCategory, searchTerm])

  // データ取得関数をメモ化
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [postsResult, categoriesResult] = await Promise.all([
        getBlogPosts(filters, sortBy, { page: 1, limit: 50, offset: 0 }),
        getBlogCategories()
      ])

      if (postsResult.success && postsResult.data) {
        setPosts(postsResult.data.posts)
      } else {
        setError(postsResult.error || '記事の取得に失敗しました')
      }

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data)
      }

    } catch (err) {
      console.error('データ取得エラー:', err)
      setError('データの取得中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // カテゴリーボタンのメモ化
  const categoryButtons = useMemo(() => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        全て ({posts.length})
      </button>
      {categories.map((category) => {
        const categoryPostCount = posts.filter(post => 
          post.categories?.some(cat => cat._id === category._id)
        ).length
        
        return (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category._id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.color && (
              <span className="mr-1">
                {category.color === 'blue' && '🔵'}
                {category.color === 'green' && '🟢'}
                {category.color === 'purple' && '🟣'}
                {category.color === 'orange' && '🟠'}
                {category.color === 'red' && '🔴'}
                {category.color === 'yellow' && '🟡'}
              </span>
            )}
            {category.title} ({categoryPostCount})
          </button>
        )
      })}
    </div>
  ), [categories, posts, selectedCategory])

  // フィルターされた記事のメモ化
  const filteredPosts = useMemo(() => {
    let result = posts

    if (selectedCategory) {
      result = result.filter(post => 
        post.categories?.some(cat => cat._id === selectedCategory)
      )
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(search) ||
        post.excerpt?.toLowerCase().includes(search)
      )
    }

    return result
  }, [posts, selectedCategory, searchTerm])

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">記事を読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="ブログ | バイブコーディングの実践記録"
        description="AI活用、システム設計、開発体験について記録したブログです。バイブコーディングの可能性を探求します。"
        url={`${window.location.origin}/blog`}
      />
      
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ブログ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              バイブコーディングの実践記録と洞察
            </p>
          </div>

          {/* 検索・フィルター */}
          <div className="mb-8 space-y-4">
            {/* 検索ボックス */}
            <div className="relative">
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="absolute left-3 top-3 text-gray-400">
                🔍
              </div>
            </div>

            {/* カテゴリーフィルター */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                カテゴリー
              </h3>
              {categoryButtons}
            </div>

            {/* ソート */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPosts.length} 件の記事
              </p>
              <select
                value={`${sortBy.field}_${sortBy.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('_') as ['publishedAt' | 'title', 'asc' | 'desc']
                  setSortBy({ field, direction })
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="publishedAt_desc">新しい順</option>
                <option value="publishedAt_asc">古い順</option>
                <option value="title_asc">タイトル順</option>
              </select>
            </div>
          </div>

          {/* 記事一覧 */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm || selectedCategory ? '条件に一致する記事が見つかりませんでした。' : '記事がまだありません。'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post._id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/blog/${post.slug?.current}`}
                    className="block group hover:bg-gray-50 dark:hover:bg-gray-800 p-6 -mx-6 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.status === 'draft' && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                          下書き
                        </span>
                      )}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <time className="text-gray-500 dark:text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        
                        {post.author && (
                          <span className="text-gray-500 dark:text-gray-400">
                            by {post.author.name}
                          </span>
                        )}
                      </div>

                      {post.categories && post.categories.length > 0 && (
                        <div className="flex gap-2">
                          {post.categories.slice(0, 2).map((category) => (
                            <span
                              key={category._id}
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                            >
                              {category.title}
                            </span>
                          ))}
                          {post.categories.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{post.categories.length - 2}
                            </span>
                          )}
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