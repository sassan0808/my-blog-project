import { useEffect, useState } from 'react'
import { DataService } from '../lib/data'
import type { Project } from '../types/portfolio'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const categories = [
  { id: 'all', name: '全て' },
  { id: 'web', name: 'Web' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'slide', name: 'スライド' },
  { id: 'other', name: 'その他' }
]

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await DataService.getProjects()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  const filterProjects = (category: string) => {
    setActiveCategory(category)
    if (category === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.category === category))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-slate-50 dark:bg-brand-navy-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-brand-slate-50 dark:bg-brand-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
            Portfolio
          </h1>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-8"></div>
          <p className="text-xl text-brand-slate-600 dark:text-brand-slate-300 max-w-3xl mx-auto font-inter leading-relaxed">
            2025年5月からのバイブコーディングでの制作物を共有します。
            まだ試作品の段階ですが、バイブコーディングを活用することで、
            非エンジニアかつサラリーマンでも、空いた時間にゲーム感覚で制作物の作成が可能な時代となりました。
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => filterProjects(category.id)}
              className={`px-6 py-3 rounded-lg font-montserrat font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 shadow-lg'
                  : 'bg-white dark:bg-brand-navy-800 text-brand-slate-700 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-navy-700 border border-brand-slate-200 dark:border-brand-navy-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              hover
              className="overflow-hidden group bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-brand-slate-200 to-brand-slate-300 dark:from-brand-navy-700 dark:to-brand-navy-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-navy-900 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-montserrat font-semibold">
                    詳細を見る
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-brand-gold-500 text-brand-navy-900 px-3 py-1 rounded-full text-xs font-montserrat font-bold">
                    FEATURED
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-3 group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-brand-slate-600 dark:text-brand-slate-300 line-clamp-3 font-inter">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-brand-slate-100 dark:bg-brand-navy-700 text-brand-navy-700 dark:text-brand-slate-300 text-sm rounded-full font-montserrat font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  {project.liveUrl && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 font-montserrat"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 border-2 border-brand-navy-900 dark:border-white text-brand-navy-900 dark:text-white hover:bg-brand-navy-900 hover:text-white dark:hover:bg-white dark:hover:text-brand-navy-900 font-montserrat"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      GitHub
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-brand-slate-500 dark:text-brand-slate-400 text-lg font-inter">
              該当するプロジェクトが見つかりませんでした。
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="p-12 bg-gradient-to-r from-brand-slate-100 to-brand-gold-50 dark:from-brand-navy-800 dark:to-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600">
            <h2 className="text-3xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
              一緒にプロジェクトを始めませんか？
            </h2>
            <p className="text-xl text-brand-slate-600 dark:text-brand-slate-300 mb-8 max-w-2xl mx-auto font-inter">
              新しいアイデアや技術的な課題について、
              ぜひお気軽にご相談ください。
            </p>
            <Button
              variant="gradient"
              size="lg"
              className="text-lg px-8 py-4 bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              お問い合わせ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
