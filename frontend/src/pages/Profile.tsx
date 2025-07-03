import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const philosophy = [
    "瞑想 → 妄想 → 仮説 → 実行 → 検証",
    "想像を創造する",
    "一人ひとりの中に答えがある", 
    "個性の時代、活かし合いの社会へ",
    "知性と感性の統合"
  ]

  const skills = [
    { name: "組織体制構築支援", level: 95, icon: "🏗️" },
    { name: "採用戦略設計", level: 90, icon: "👥" },
    { name: "AI活用コンサル", level: 85, icon: "🤖" },
    { name: "外部人材活用", level: 88, icon: "🤝" },
    { name: "組織変革", level: 92, icon: "🔄" },
    { name: "未来予測・仮説立案", level: 89, icon: "🔮" }
  ]

  const achievements = [
    {
      title: "年間60名採用達成",
      description: "採用が停滞していた組織で採用マネージャーとして参画し、年間60名の採用を実現",
      icon: "📈",
      impact: "組織成長を大幅加速"
    },
    {
      title: "営業組織V字回復",
      description: "テコの原理的視点を活用した営業組織の再構築により、業績を劇的に改善",
      icon: "📊", 
      impact: "売上大幅回復"
    },
    {
      title: "AI×組織の統合設計",
      description: "ドメイン知識とAI活用を統合し、新しい組織のブースト機能を構築",
      icon: "⚡",
      impact: "次世代組織モデル確立"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-700/20 to-pink-600/20 animate-gradient-xy"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Mouse Follow Effect */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 25%)`,
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Avatar & Title */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center text-6xl font-black animate-pulse-scale">
                🧘‍♂️
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                仙人度 60%
              </div>
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              さっさん
            </span>
          </h1>

          <div className="space-y-6 mb-12">
            <p className="text-2xl sm:text-3xl text-gray-300">
              <span className="text-neon-blue font-bold">組織変革</span> × 
              <span className="text-neon-purple font-bold"> AI活用</span> × 
              <span className="text-neon-pink font-bold"> 瞑想</span>
            </p>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              山梨県甲府から、<span className="text-white font-bold">個性の時代</span>への移行をサポート。
              <br />
              想像を創造に変える、<span className="text-neon-blue">現代の組織変革仙人</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/contact">
              <Button 
                variant="gradient" 
                size="lg" 
                className="group relative overflow-hidden px-8 py-4 text-lg font-bold animate-glow"
              >
                <span className="relative z-10 flex items-center">
                  組織変革について相談する
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Philosophy
              </span>
            </h2>
            <p className="text-xl text-gray-400">価値観と思考フレームワーク</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <div
                key={index}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur"></div>
                
                <Card className="relative bg-gray-900/80 backdrop-blur-xl border-gray-800 p-8 h-full text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-lg font-medium text-white group-hover:text-neon-blue transition-colors">
                    {item}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Core Skills
              </span>
            </h2>
            <p className="text-xl text-gray-400">組織×AI×人材のトリプル専門領域</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{skill.icon}</span>
                      <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                    </div>
                    <span className="text-neon-blue font-bold text-lg">{skill.level}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Impact & Results
              </span>
            </h2>
            <p className="text-xl text-gray-400">テコの原理で実現した組織変革実績</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-75 transition duration-500 blur-xl"></div>
                
                <Card className="relative bg-gray-900/90 backdrop-blur-xl border-gray-800 p-8 h-full">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{achievement.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{achievement.title}</h3>
                    <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-1">
                      <span className="text-neon-blue text-sm font-medium">{achievement.impact}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed">{achievement.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  About さっさん
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-neon-blue">🏔️ 現在地</h3>
                  <p className="text-gray-300 leading-relaxed">
                    山梨県甲府市を拠点に、副業/兼業の人材紹介業に従事。
                    都市部から離れた環境で、本質的な組織変革を思索・実践。
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-neon-purple">🧘 瞑想と創造</h3>
                  <p className="text-gray-300 leading-relaxed">
                    瞑想により「アイデアが勝手に湧く感覚」を体得。
                    瞑想→妄想→仮説→実行→検証の独自思考ループで、
                    世界をリデザインする取り組みを継続。
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-neon-pink">🤖 AI×人間観</h3>
                  <p className="text-gray-300 leading-relaxed">
                    バイブコーディング歴2ヶ月ながら、AIとの活かし合いを実践。
                    「想像を創造する」という20代からの哲学が、
                    AI時代に現実のものとなることを体感中。
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-8xl mb-4">🔮</div>
                  <h3 className="text-3xl font-bold text-white mb-4">未来予測</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    個人の時代から<span className="text-neon-blue font-bold">個性の時代</span>へ。
                    <br />
                    活かし合いが当たり前の社会への移行を予見し、
                    <br />
                    組織変革を通じてその実現をサポート。
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/20">
                  <h4 className="text-xl font-bold text-white mb-3">🎯 ミッション</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    一人ひとりの中にある答えを見つけるヒントを提供し、
                    知性と感性を統合した組織・社会の実現に貢献する。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-8">
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-gradient-x">
              組織の未来を一緒に創りませんか？
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            「個性の時代」への移行をサポートします。
            <br />
            採用・AI活用・組織変革について、お気軽にご相談ください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact">
              <Button 
                variant="gradient" 
                size="lg" 
                className="animate-pulse-scale px-8 py-4"
              >
                相談してみる
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            
            <Link to="/portfolio">
              <Button 
                variant="ghost" 
                size="lg" 
                className="border-2 border-white/20 hover:border-white/40 backdrop-blur-sm px-8 py-4"
              >
                実績を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}