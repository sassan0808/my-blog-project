import type { Project } from '../types/portfolio'

export const projects: Project[] = [
  {
    id: '1',
    title: '副業人材業務切り出しサポート',
    description: 'AI技術を活用して、企業の業務を副業人材向けに最適化するサポートツール。業務の切り出しから、マッチング、進捗管理までをワンストップで支援。',
    longDescription: 'パーソルイノベーション株式会社のlotsfulサービスと連携し、企業が副業人材を効果的に活用できるようサポートするプラットフォームです。AI分析により、業務の切り出しを最適化し、適切な人材とのマッチングを実現します。',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Gemini API', 'Web Speech API'],
    liveUrl: 'https://lotsful-ai-engine-git-main-sassan0808-gmailcoms-projects.vercel.app',
    featured: true,
    createdAt: '2024-12-01',
    category: 'web'
  },
  {
    id: '2',
    title: 'ジャーナル×AI分析アプリ',
    description: '日々の思考や感情を記録し、AIが分析してパターンや洞察を提供するジャーナリングアプリケーション。',
    longDescription: '個人の成長と自己理解を深めるためのAI搭載ジャーナリングアプリです。自然言語処理により、記録された内容から感情の変化、思考パターン、成長の軌跡を可視化し、より深い自己認識をサポートします。',
    technologies: ['Next.js 15.3.2 (App Router)', 'TypeScript', 'Supabase (PostgreSQL)', 'Supabase Storage', 'Supabase Auth', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Google Gemini 2.5 Flash Preview API', 'Web Speech API'],
    liveUrl: 'https://kokone-journal-git-main-sassan0808-gmailcoms-projects.vercel.app',
    featured: true,
    createdAt: '2024-10-15',
    category: 'web'
  },
  {
    id: '3',
    title: 'AI小説リーダー',
    description: 'AIが作成した小説を読むことができるリーダーアプリ。',
    longDescription: 'AIによって生成された小説作品を読むためのリーダーアプリケーションです。SF、ファンタジー、ミステリーなど様々なジャンルのAI小説を収録し、快適な読書体験を提供します。AIならではの独創的な物語や、人間では思いつかないような展開を楽しむことができます。',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    liveUrl: 'https://ai-shosetsu-miroku-9xqi-git-main-sassan0808-gmailcoms-projects.vercel.app',
    featured: true,
    createdAt: '2024-11-20',
    category: 'web'
  },
  {
    id: '4',
    title: 'エコーチェンバー現象を乗りこなし、AI時代の「共創」を導くために',
    description: 'AI時代における情報の偏りとエコーチェンバー現象について考察し、共創の可能性を探るプレゼンテーション。',
    longDescription: 'AIが普及する現代において、エコーチェンバー現象がもたらす課題と可能性について深く掘り下げたプレゼンテーションです。情報の偏りを認識し、それを乗り越えることで、AI時代における真の「共創」を実現するための方法論を提示します。',
    technologies: ['Genspark', 'AI分析', 'プレゼンテーション'],
    liveUrl: 'https://hcudndin.gensparkspace.com/',
    featured: true,
    createdAt: '2025-06-30',
    category: 'slide'
  },
  {
    id: '5',
    title: 'AI活用の二軸アプローチと日本のイノベーション展望',
    description: 'AIを活用した日本のイノベーション戦略について、二軸アプローチから考察するプレゼンテーション。',
    longDescription: '日本におけるAI活用の現状と課題を踏まえ、独自の二軸アプローチによるイノベーション戦略を提案。技術導入と人材育成の両面から、日本企業がAI時代に競争力を維持・向上させるための具体的な方法論を展開します。',
    technologies: ['Genspark', 'AI戦略', 'プレゼンテーション'],
    liveUrl: 'https://wwndapsg.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-01',
    category: 'slide'
  },
  {
    id: '6',
    title: 'AI時代の冒険書：目的を捨て今日を紡ぐ旅',
    description: 'AI時代における新しい生き方と働き方を探求する、インタラクティブなエージェント体験。',
    longDescription: '従来の目的志向型の人生設計から脱却し、AI時代における新しい価値観と生き方を提案。日々の体験を重視し、予測不可能な変化を楽しむための思考法と実践方法を、対話形式で探求します。',
    technologies: ['Genspark Agent', 'AI対話', 'ライフデザイン'],
    liveUrl: 'https://nenwbzyf.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-02',
    category: 'slide'
  },
  {
    id: '7',
    title: 'これからの時代に「旅する学び」と働き方',
    description: 'リモートワークとAI時代における、場所に縛られない学びと働き方の新しいモデルを提示。',
    longDescription: 'デジタルノマドやリモートワークが一般化する中で、「旅する学び」という新しい教育・成長モデルを提案。場所や時間に縛られない働き方と、継続的な学習を両立させるための実践的なフレームワークを紹介します。',
    technologies: ['Genspark', 'リモートワーク', 'プレゼンテーション'],
    liveUrl: 'https://aiqively.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-03',
    category: 'slide'
  },
  {
    id: '8',
    title: 'AI時代の新しい「学び方」研修',
    description: 'AI技術の進歩に合わせて、効果的な学習方法とスキル開発のアプローチを提案する研修プログラム。',
    longDescription: 'AI時代において必要とされる新しい学習スタイルと能力開発について体系的に解説。従来の知識習得型学習から、AI協働型の問題解決能力や創造性を重視した学びのフレームワークを実践的に紹介します。',
    technologies: ['Genspark', '教育設計', '研修プログラム'],
    liveUrl: 'https://nkgcvwbw.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-04',
    category: 'slide'
  },
  {
    id: '9',
    title: '瞑想から始まる創造的思考プロセス',
    description: '瞑想を起点とした創造性開発と、アイデア創出のための思考プロセスを体系化したプレゼンテーション。',
    longDescription: '瞑想の実践を通じて創造的思考力を高める方法論を紹介。静寂の中から生まれるアイデアの質と、日常的な瞑想実践が創造性に与える影響について、実践的なアプローチとともに解説します。',
    technologies: ['Genspark', '瞑想', '創造性開発'],
    liveUrl: 'https://ydzhpmkb.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-05',
    category: 'slide'
  },
  {
    id: '10',
    title: 'AI活用共有会〜文字起こしデータ保管の重要性〜',
    description: 'AI時代における音声データの文字起こしと、そのデータ保管・活用の戦略的重要性について解説。',
    longDescription: 'AI技術を活用した文字起こしサービスの効果的な利用方法と、蓄積されたデータの価値について詳しく解説。会議録、インタビュー、セミナーなどの音声データを資産として活用するためのベストプラクティスを共有します。',
    technologies: ['AI文字起こし', 'データ管理', 'ナレッジマネジメント'],
    liveUrl: 'https://tjaifilt.gensparkspace.com/',
    featured: true,
    createdAt: '2025-07-06',
    category: 'slide'
  }
]