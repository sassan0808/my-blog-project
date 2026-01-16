import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataService } from '../lib/data'
import type { Project } from '../types/portfolio'
import type { Post } from '../types/post'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projects, postsResponse] = await Promise.all([
          DataService.getFeaturedProjects(),
          DataService.getBlogPosts()
        ])
        setFeaturedProjects(projects)
        setLatestPosts(postsResponse.posts.slice(0, 3))
      } catch (error) {
        console.error('Error loading home data:', error)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy-900 text-brand-navy-900 dark:text-white">
      {/* Hero Section - エレガントでプロフェッショナル */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-slate-50 to-white dark:from-brand-navy-900 dark:to-brand-navy-800">
        {/* 控えめな装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-navy-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-32">
          {/* タグライン */}
          <div className="mb-8 inline-block">
            <span className="text-sm font-montserrat text-brand-gold-600 dark:text-brand-gold-400 uppercase tracking-widest font-semibold">
              Professional Business Solutions
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold mb-8 leading-tight">
            <span className="block text-brand-navy-900 dark:text-white">
              AIを活用した
            </span>
            <span className="block text-brand-navy-700 dark:text-brand-slate-200 mt-2">
              組織開発コンサルティング
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-slate-600 dark:text-brand-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-inter">
            企業の成長を加速させる戦略的なAI導入と組織変革を支援します。
            データドリブンなアプローチで、持続可能なビジネスの成長を実現します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact">
              <Button
                variant="gradient"
                size="lg"
                className="bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 px-8 py-4 text-base font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                お問い合わせ
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>

            <Link to="/portfolio">
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-brand-navy-900 dark:border-white text-brand-navy-900 dark:text-white hover:bg-brand-navy-900 hover:text-white dark:hover:bg-white dark:hover:text-brand-navy-900 px-8 py-4 text-base font-montserrat font-semibold transition-all duration-300"
              >
                事例を見る
              </Button>
            </Link>
          </div>

          {/* 信頼性の指標 */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-brand-gold-600 dark:text-brand-gold-400 mb-2">50+</div>
              <div className="text-sm text-brand-slate-600 dark:text-brand-slate-400 font-montserrat">プロジェクト</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-brand-gold-600 dark:text-brand-gold-400 mb-2">98%</div>
              <div className="text-sm text-brand-slate-600 dark:text-brand-slate-400 font-montserrat">顧客満足度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-brand-gold-600 dark:text-brand-gold-400 mb-2">5年+</div>
              <div className="text-sm text-brand-slate-600 dark:text-brand-slate-400 font-montserrat">実績</div>
            </div>
          </div>
        </div>
      </section>

      {/* サービス概要セクション */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
              提供サービス
            </h2>
            <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-6"></div>
            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 max-w-2xl mx-auto font-inter">
              AI技術、組織開発、Well-beingの融合により、企業の持続的な成長をサポートします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI活用コンサルティング',
                description: '最先端のAI技術を活用し、業務効率化とイノベーションを実現します。',
                icon: '🤖'
              },
              {
                title: '組織開発支援',
                description: 'チームのパフォーマンスを最大化し、持続可能な組織文化を構築します。',
                icon: '👥'
              },
              {
                title: 'Well-being推進',
                description: '従業員のウェルビーイングを向上させ、生産性と創造性を引き出します。',
                icon: '🌟'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-brand-slate-50 dark:bg-brand-navy-700 rounded-lg p-8 hover:shadow-xl transition-all duration-300 border border-brand-slate-200 dark:border-brand-navy-600"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-playfair font-semibold mb-3 text-brand-navy-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-brand-slate-600 dark:text-brand-slate-300 font-inter leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - ビジネススタイル */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-brand-slate-50 dark:bg-brand-navy-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
              プロジェクト実績
            </h2>
            <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-6"></div>
            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 max-w-2xl mx-auto font-inter">
              これまでに手がけた主要なプロジェクトをご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-brand-navy-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-brand-slate-200 dark:border-brand-navy-700"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden aspect-video bg-brand-slate-100 dark:bg-brand-navy-700">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl font-playfair font-bold text-brand-slate-300 dark:text-brand-navy-600">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-playfair font-semibold mb-3 text-brand-navy-900 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-brand-slate-600 dark:text-brand-slate-300 mb-4 line-clamp-2 font-inter">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-montserrat font-medium bg-brand-slate-100 dark:bg-brand-navy-700 text-brand-navy-700 dark:text-brand-slate-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs font-montserrat text-brand-slate-500">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-brand-navy-900 dark:border-white text-brand-navy-900 dark:text-white hover:bg-brand-navy-900 hover:text-white dark:hover:bg-white dark:hover:text-brand-navy-900 font-montserrat font-semibold"
              >
                すべての実績を見る
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts - エレガントスタイル */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
              最新の記事
            </h2>
            <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-6"></div>
            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 max-w-2xl mx-auto font-inter">
              ビジネスに役立つ最新のインサイトと実践的なアドバイスをお届けします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug?.current}`}
                className="group block"
              >
                <article className="bg-brand-slate-50 dark:bg-brand-navy-700 rounded-lg p-8 h-full hover:shadow-xl transition-all duration-300 border border-brand-slate-200 dark:border-brand-navy-600">
                  <time className="text-sm text-brand-slate-500 dark:text-brand-slate-400 font-montserrat">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>

                  <h3 className="text-xl font-playfair font-semibold mt-4 mb-4 text-brand-navy-900 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center text-brand-navy-700 dark:text-brand-slate-300 font-montserrat font-medium text-sm">
                    続きを読む
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/blog">
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-brand-navy-900 dark:border-white text-brand-navy-900 dark:text-white hover:bg-brand-navy-900 hover:text-white dark:hover:bg-white dark:hover:text-brand-navy-900 font-montserrat font-semibold"
              >
                すべての記事を読む
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - プロフェッショナル */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-brand-navy-900 dark:bg-brand-navy-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-gold-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-6">
            ビジネスの成長を、共に実現しましょう
          </h2>

          <p className="text-lg text-brand-slate-300 mb-10 max-w-2xl mx-auto font-inter leading-relaxed">
            戦略的なAI活用と組織開発で、あなたのビジネスを次のステージへ。
            まずはお気軽にご相談ください。
          </p>

          <Link to="/contact">
            <Button
              variant="gradient"
              size="lg"
              className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-900 px-10 py-4 text-base font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              無料相談を予約する
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
