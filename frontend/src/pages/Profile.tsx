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
              働き方の変容を観察し、その可能性を探求しています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              2018年の「副業元年」以降、日本の労働市場は静かに、しかし確実に変化してきました。終身雇用という単一の物語から、複数のプロジェクトを横断する「プロジェクトエコノミー」へ。そして生成AIの登場が、この移行を加速させています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              興味深いのは、この変化が個人と組織の関係性を根本から問い直している点です。従来の「所属」から「参加」へ。固定的な役割から流動的なプロジェクトへ。この転換点において、人と組織はどのような新しい関係を築けるのか——それが私の関心事です。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              2022年6月から山梨県甲府市在住。広島県の限界集落出身という背景もあり、地方におけるプロジェクトエコノミーの可能性にも関心を持っています。
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
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              パーソルイノベーション株式会社で、副業・兼業人材と企業をつなぐプラットフォーム「lotsful」の仕事をしています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              日々の業務を通じて実感するのは、生成AIが「情報の民主化」をもたらした一方で、「実践知」の価値がより際立ってきているということです。具体的なプロジェクトの中で磨かれた知見——それは、まだAIでは代替できない領域です。プロジェクトベースで専門家と協働する仕組みは、この実践知を組織に取り込む新しい方法論だと考えています。
            </p>
          </Card>
        </div>
      </section>

      {/* AI and Knowledge Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-navy-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
            プロジェクトエコノミーと実践知
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <Card className="bg-brand-slate-50 dark:bg-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              AIの進化は、知識労働の前提を変えました。かつて希少だった情報へのアクセスは民主化され、今や誰もが高度な知識にリーチできます。しかし、それゆえに「実践知」の価値が浮き彫りになってきています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              実践知とは、現場での試行錯誤を通じて獲得される、文脈に依存した知恵です。それは体系化が難しく、簡単には言語化できません。だからこそAIには代替できず、人と人との直接的な協働を通じてしか伝達されない。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              プロジェクトエコノミーは、この実践知を組織の境界を越えて流通させる新しいインフラです。専門家が複数のプロジェクトを渡り歩くことで、異なる文脈間で知見が受粉され、イノベーションの土壌が豊かになる——私はそんな未来を構想しています。
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
            組織の再定義——所属から参加へ
          </h2>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-12"></div>

          <Card className="bg-brand-slate-50 dark:bg-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-lg">
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              20世紀型の雇用モデルは、個人と組織を「所属」という強固な関係で結びつけていました。しかし、プロジェクトエコノミーは、この関係性を「参加」へと転換させつつあります。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed mb-6 font-inter">
              参加型の働き方は、個人に自律性を与えると同時に、組織に柔軟性をもたらします。専門性を持つ人材が、必要なときに必要なプロジェクトに参加する——そのような流動的な協働が、イノベーションの速度を加速させています。
            </p>
            <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 leading-relaxed font-inter">
              私自身、この変革の只中で働きながら、新しい働き方の可能性を探求しています。企業の方、副業・兼業に関心のある方、プロジェクトエコノミーについて考えている方——ぜひ対話の機会をいただければと思います。
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-r from-brand-slate-100 to-brand-gold-50 dark:from-brand-navy-800 dark:to-brand-navy-700 border-brand-slate-200 dark:border-brand-navy-600 p-8 lg:p-12 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-8 text-center text-brand-navy-900 dark:text-white">
              対話の場
            </h2>

            <div className="space-y-4 mb-10">
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                プロジェクトエコノミーの可能性について
              </p>
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                AIと人間の協働のあり方について
              </p>
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                副業・兼業を通じた新しい働き方について
              </p>
              <p className="text-lg text-brand-slate-700 dark:text-brand-slate-200 flex items-start font-inter">
                <span className="text-brand-gold-600 mr-3 mt-1">▶</span>
                地方におけるプロジェクトエコノミーの展開について
              </p>
            </div>

            <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 leading-relaxed mb-10 text-center font-inter">
              これらのテーマに関心がある方、あるいは全く違う視点をお持ちの方、<br />
              ぜひ対話の機会をいただければ嬉しいです。
            </p>

            <div className="flex justify-center">
              <Link to="/contact">
                <Button
                  variant="gradient"
                  size="lg"
                  className="bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 px-8 py-4 text-base font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  連絡する
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
