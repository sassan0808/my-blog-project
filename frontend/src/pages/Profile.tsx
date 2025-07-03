import { useEffect, useState } from 'react'
import { DataService } from '../lib/data'
import type { Profile } from '../types/portfolio'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await DataService.getProfile()
        setProfile(data)
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            プロフィールを読み込めませんでした
          </h1>
        </div>
      </div>
    )
  }

  const skillsByCategory = profile.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof profile.skills>)

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">
            {profile.title}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {profile.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Section */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                スキル & 技術
              </h2>
              
              <div className="space-y-8">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                      {category === 'frontend' && 'フロントエンド'}
                      {category === 'backend' && 'バックエンド'}
                      {category === 'database' && 'データベース'}
                      {category === 'tools' && 'ツール'}
                      {category === 'other' && 'その他'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {skill.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-3 h-3 rounded-full ${
                                    level <= skill.level
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                      : 'bg-gray-200 dark:bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Contact & Social */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                連絡先
              </h3>
              <div className="space-y-3">
                {profile.location && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-500">📍</div>
                    <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-500">📧</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                SNS & Links
              </h3>
              <div className="space-y-3">
                {profile.social.github && (
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="w-5 h-5">🔗</div>
                    <span>GitHub</span>
                  </a>
                )}
                {profile.social.linkedin && (
                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="w-5 h-5">💼</div>
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.social.twitter && (
                  <a
                    href={profile.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="w-5 h-5">🐦</div>
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Experience Section */}
        <Card className="p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            経歴
          </h2>
          
          <div className="space-y-8">
            {profile.experiences.map((experience, index) => (
              <div key={experience.id} className="relative">
                {index !== profile.experiences.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
                
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {experience.position}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {experience.startDate} - {experience.endDate || '現在'}
                        </span>
                        {experience.current && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                            現職
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                      {experience.company}
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {experience.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900 border-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              一緒に働きませんか？
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              新しい挑戦や面白いプロジェクトについて、
              いつでもお気軽にお声がけください。
            </p>
            <Button variant="gradient" size="lg" className="text-lg px-8 py-4">
              お問い合わせ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}