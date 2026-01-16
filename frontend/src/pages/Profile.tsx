import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export default function ProfilePage() {

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
    <div className="min-h-screen bg-brand-slate-50 dark:bg-brand-navy-900 text-brand-navy-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 bg-gradient-to-br from-white to-brand-slate-50 dark:from-brand-navy-900 dark:to-brand-navy-800">
        {/* 控えめな装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-navy-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
            プロフィール
          </h1>

          <p className="text-xl sm:text-2xl text-brand-slate-600 dark:text-brand-slate-300 max-w-3xl mx-auto font-inter">
            変革期の今、人と組織の新たな関係性を模索しています
          </p>
        </div>
      </section>

      {/* Main Introduction */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              2018年の「副業元年」から7年。個人の働き方は「サラリーマン一本」から「複業・兼業」へと多様化し、AIの進歩もまたこの変化を加速させ、企業の人材戦略も根本から見直しが求められてきつつある時代の転換点にいるなあと感じています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              同じような感覚を持っている方がいらっしゃればぜひ情報交換させていただけたらと思っています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              山梨の甲府に2022年6月から住んでいます。出身が広島県の限界集落ということもあり、地方創生にも興味があります。
            </p>
          </Card>
        </div>
      </section>

      {/* Current Role */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
            現在の活動
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <Card className="bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              本業は、<span className="text-brand-navy-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>「lotsful」のアカウントコンサルタントとして、この変革期だからこそ必要な「民主化されたAIからの情報だけではなく、実践知の共有」を可能にする副業/兼業マッチングという選択肢をご提案しています。
            </p>
          </Card>
        </div>
      </section>

      {/* AI and Knowledge Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-navy-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
            AIと実践知 — これからの組織づくりの鍵
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <Card className="bg-brand-slate-50 dark:bg-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              AIによって一般的な情報は誰でもアクセスできるようになりました。極端な話小学生でも上位のコンサルタント能力をもつ知識にアクセスが容易になっていますが、AIで補填できないものとしての「実践知」を共有できる構造にしていくことで、量から質への転換。イノベーションを起こすための土壌が形成しやすくなるのではないかと考えています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              <span className="text-brand-navy-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>が提供する専門的な知見をもつ方々より登録していただいたデータベースを必要なタイミングでご活用いただけるサービス設計になっており、初期費用不要で人材にアクセスが可能です。
            </p>
          </Card>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
            キャリアハイライト
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerHighlights.map((career, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">{career.icon}</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-brand-navy-900 dark:text-white mb-3">{career.company}</h3>
                <p className="text-brand-slate-600 dark:text-brand-slate-300 text-sm leading-relaxed font-inter">{career.roles}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-navy-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
            AIと副業がもたらす組織変革の未来図
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <Card className="bg-brand-slate-50 dark:bg-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              生成AIの台頭は、単なる業務効率化にとどまらず、「組織の在り方」そのものを問い直す契機となっています。このパラダイムシフトの時代だからこそ、副業人材との共創によって、組織の枠を超えた新たな価値が生まれています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              専門性の高い人材を、従来の採用プロセスよりも迅速に、柔軟に獲得する方法を、貴社のビジネス状況に合わせてカスタマイズしてご提案いたします。
            </p>
            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 leading-relaxed mt-4 font-inter">
              また、副業/兼業希望の方との情報交換も積極的に行っています。
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-r from-brand-slate-100 to-brand-gold-50 dark:from-brand-navy-800 dark:to-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
              ご相談・情報交換のお誘い
            </h2>

            <div className="space-y-4 mb-10">
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                副業/兼業について法人/個人利用どちらもご相談受け付けています
              </p>
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                生成AIを活用した組織設計についての意見交換
              </p>
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                生成AI活用の情報交換
              </p>
            </div>

            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 leading-relaxed mb-10 text-center font-inter">
              <span className="text-brand-navy-900 dark:text-white font-semibold">パーソルイノベーション株式会社</span>での活動や、対話形式でぜひお気軽に情報交換の機会をいただけたらと思います！
            </p>

            <div className="flex justify-center">
              <Link to="/contact">
                <Button
                  variant="gradient"
                  size="lg"
                  className="bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 px-8 py-4 text-base font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
