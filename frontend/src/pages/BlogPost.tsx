import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client } from '../lib/sanity'
import type { Post } from '../types/post'
import SEOHead from '../components/SEOHead'
import MarkdownText from '../components/MarkdownText'
import { TagList } from '../components/TagList'

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
          publishedAt,
          tags,
          "categories": categories[]->{
            _id,
            title,
            description
          }
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
      <div className="min-h-screen flex items-center justify-center bg-brand-slate-50 dark:bg-brand-navy-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-brand-slate-600 dark:text-brand-slate-400 font-inter">記事を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-brand-slate-50 dark:bg-brand-navy-900">
        <div className="text-center">
          <h1 className="text-2xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
            記事が見つかりませんでした
          </h1>
          <Link
            to="/blog"
            className="text-brand-gold-600 dark:text-brand-gold-400 hover:underline font-montserrat font-medium"
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
          title={`${post.title} | Sasaki`}
          description={post.title}
          url={`${window.location.origin}/blog/${post.slug?.current}`}
        />
      )}
      <div className="min-h-screen pt-20 bg-brand-slate-50 dark:bg-brand-navy-900">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* ナビゲーション */}
          <Link
            to="/blog"
            className="inline-flex items-center text-brand-slate-600 dark:text-brand-slate-400 hover:text-brand-navy-900 dark:hover:text-white font-montserrat font-medium mb-8 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ブログ一覧に戻る
          </Link>

          {/* ヘッダーセクション */}
          <header className="mb-12 pb-8 border-b-2 border-brand-gold-500">
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <time className="text-brand-slate-600 dark:text-brand-slate-400 font-montserrat">
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
                      className="px-4 py-1.5 bg-brand-gold-500/10 text-brand-gold-700 dark:text-brand-gold-400 rounded-full font-montserrat font-medium text-sm"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <TagList tags={post.tags} size="medium" className="mt-4" />
            )}
          </header>

          {/* 記事本文 */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <style>{`
              .prose {
                color: inherit;
                max-width: none;
              }
              .prose p {
                margin-bottom: 1.5em;
                line-height: 1.8;
                color: rgb(71 85 105);
              }
              .dark .prose p {
                color: rgb(203 213 225);
              }
              .prose h1,
              .prose h2,
              .prose h3,
              .prose h4 {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                color: rgb(15 23 42);
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .dark .prose h1,
              .dark .prose h2,
              .dark .prose h3,
              .dark .prose h4 {
                color: rgb(255 255 255);
              }
              .prose h2 {
                font-size: 2rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #D4AF37;
              }
              .prose h3 {
                font-size: 1.5rem;
              }
              .prose strong {
                font-weight: 700;
                color: rgb(15 23 42);
              }
              .dark .prose strong {
                color: rgb(255 255 255);
              }
              .prose a {
                color: #D4AF37;
                text-decoration: none;
                border-bottom: 1px solid #D4AF37;
                transition: all 0.2s;
              }
              .prose a:hover {
                color: #B8941D;
                border-bottom-color: #B8941D;
              }
              .prose ul,
              .prose ol {
                margin-top: 1.5em;
                margin-bottom: 1.5em;
                padding-left: 1.5em;
              }
              .prose li {
                margin-bottom: 0.5em;
                line-height: 1.8;
              }
              .prose blockquote {
                border-left: 4px solid #D4AF37;
                padding-left: 1.5em;
                font-style: italic;
                color: rgb(71 85 105);
                margin: 2em 0;
              }
              .dark .prose blockquote {
                color: rgb(203 213 225);
              }
              .prose code {
                background-color: rgb(241 245 249);
                padding: 0.2em 0.4em;
                border-radius: 0.25rem;
                font-size: 0.875em;
                color: rgb(15 23 42);
              }
              .dark .prose code {
                background-color: rgb(30 41 59);
                color: rgb(226 232 240);
              }
              .prose pre {
                background-color: rgb(15 23 42);
                padding: 1.5em;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 2em 0;
              }
              .dark .prose pre {
                background-color: rgb(15 23 42);
              }
            `}</style>
            {post.body && (
              <PortableText
                value={post.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <MarkdownText>{children}</MarkdownText>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-playfair font-bold mb-6 mt-12 text-brand-navy-900 dark:text-white">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-playfair font-bold mb-4 mt-10 pb-2 border-b-2 border-brand-gold-500 text-brand-navy-900 dark:text-white">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-playfair font-bold mb-3 mt-8 text-brand-navy-900 dark:text-white">
                        {children}
                      </h3>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-bold text-brand-navy-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    link: ({ children, value }) => (
                      <a
                        href={value.href}
                        className="text-brand-gold-600 dark:text-brand-gold-400 hover:text-brand-gold-700 dark:hover:text-brand-gold-500 border-b border-brand-gold-600 dark:border-brand-gold-400 hover:border-brand-gold-700 dark:hover:border-brand-gold-500 transition-colors"
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

          {/* フッター */}
          <footer className="mt-16 pt-8 border-t border-brand-slate-200 dark:border-brand-navy-700">
            <Link
              to="/blog"
              className="inline-flex items-center text-brand-gold-600 dark:text-brand-gold-400 hover:text-brand-gold-700 dark:hover:text-brand-gold-500 font-montserrat font-semibold transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              他の記事を読む
            </Link>
          </footer>
        </article>
      </div>
    </>
  )
}
