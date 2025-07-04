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
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Gemini API', 'Web Speech API'],
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
    liveUrl: 'https://www.genspark.ai/slides?project_id=00ef6e4e-dd0e-4ecf-97f6-c7ee0df363e2',
    featured: true,
    createdAt: '2025-06-30',
    category: 'slide'
  }
]