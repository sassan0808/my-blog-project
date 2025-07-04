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

  const careerHighlights = [
    {
      company: "株式会社flaggs/fingger",
      roles: "採用マネージャー、新規事業営業責任者、事業推進、AP、経営企画を兼任",
      icon: "🎮"
    },
    {
      company: "株式会社div",
      roles: "セールス、インサイドセールス、採用人事担当として300→600名規模の組織拡大に貢献",
      icon: "📈"
    },
    {
      company: "株式会社U-NEXTマーケティング",
      roles: "複数部門のマネージャーとしてコールセンター運営を最適化",
      icon: "📞"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-purple-800/10 to-transparent"></div>
        </div>

        {/* Mouse Follow Effect */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05) 0%, transparent 30%)`,
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              プロフィール
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            変革期の今、人と組織の新たな関係性を模索しています
          </p>
        </div>
      </section>

      {/* Main Introduction */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-8 lg:p-12">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              2018年の「副業元年」から7年。個人の働き方は「サラリーマン一本」から「複業・兼業」へと多様化し、AIの進歩もまたこの変化を加速させ、企業の人材戦略も根本から見直しが求められてきつつある時代の転換点にいるなあと感じています。
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              同じような感覚を持っている方がいらっしゃればぜひ情報交換させていただけたらと思っています。
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              山梨の甲府に2022年6月から住んでいます。出身が広島県の限界集落ということもあり、地方創生にも興味があります。
            </p>
          </Card>
        </div>
      </section>

      {/* Current Role */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              現在の活動
            </span>
          </h2>
          
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-8 lg:p-12">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              本業は、<span className="text-gray-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>「lotsful」のアカウントコンサルタントとして、この変革期だからこそ必要な「民主化されたAIからの情報だけではなく、実践知の共有」を可能にする副業/兼業マッチングという選択肢をご提案しています。
            </p>
          </Card>
        </div>
      </section>

      {/* AI and Knowledge Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AIと実践知 — これからの組織づくりの鍵
            </span>
          </h2>
          
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-8 lg:p-12">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              AIによって一般的な情報は誰でもアクセスできるようになりました。極端な話小学生でも上位のコンサルタント能力をもつ知識にアクセスが容易になっていますが、AIで補填できないものとしての「実践知」を共有できる構造にしていくことで、量から質への転換。イノベーションを起こすための土壌が形成しやすくなるのではないかと考えています。
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <span className="text-gray-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>が提供する専門的な知見をもつ方々より登録していただいたデータベースを必要なタイミングでご活用いただけるサービス設計になっており、初期費用不要で人材にアクセスが可能です。
            </p>
          </Card>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              キャリアハイライト
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerHighlights.map((career, index) => (
              <Card 
                key={index}
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">{career.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{career.company}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{career.roles}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AIと副業がもたらす組織変革の未来図
            </span>
          </h2>
          
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-8 lg:p-12">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              生成AIの台頭は、単なる業務効率化にとどまらず、「組織の在り方」そのものを問い直す契機となっています。このパラダイムシフトの時代だからこそ、副業人材との共創によって、組織の枠を超えた新たな価値が生まれています。
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              専門性の高い人材を、従来の採用プロセスよりも迅速に、柔軟に獲得する方法を、貴社のビジネス状況に合わせてカスタマイズしてご提案いたします。
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-4">
              また、副業/兼業希望の方との情報交換も積極的に行っています。
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-blue-800/40 dark:to-purple-800/40 backdrop-blur-sm border-gray-200 dark:border-gray-700 p-8 lg:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                ご相談・情報交換のお誘い
              </span>
            </h2>
            
            <div className="space-y-4 mb-10">
              <p className="text-lg text-gray-700 dark:text-gray-200 flex items-start">
                <span className="text-blue-400 mr-3 mt-1">▶</span>
                副業/兼業について法人/個人利用どちらもご相談受け付けています
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200 flex items-start">
                <span className="text-purple-400 mr-3 mt-1">▶</span>
                生成AIを活用した組織設計についての意見交換
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200 flex items-start">
                <span className="text-pink-400 mr-3 mt-1">▶</span>
                生成AI活用の情報交換
              </p>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-10 text-center">
              <span className="text-gray-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>での活動や、対話形式でぜひお気軽に情報交換の機会をいただけたらと思います！
            </p>
            
            <div className="flex justify-center">
              <Link to="/contact">
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold"
                >
                  お問い合わせ・情報交換はこちら
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}