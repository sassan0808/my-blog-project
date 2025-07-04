import type { Project } from '../types/portfolio'

export const projects: Project[] = [
  {
    id: '1',
    title: '副業人材業務切り出しサポート',
    description: 'AI技術を活用して、企業の業務を副業人材向けに最適化するサポートツール。業務の切り出しから、マッチング、進捗管理までをワンストップで支援。',
    longDescription: 'パーソルイノベーション株式会社のlotsfulサービスと連携し、企業が副業人材を効果的に活用できるようサポートするプラットフォームです。AI分析により、業務の切り出しを最適化し、適切な人材とのマッチングを実現します。',
    technologies: ['Next.js', 'TypeScript', 'AI/ML', 'Vercel'],
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
    technologies: ['React', 'Python', 'NLP', 'TensorFlow'],
    liveUrl: 'https://kokone-journal-git-main-sassan0808-gmailcoms-projects.vercel.app',
    featured: true,
    createdAt: '2024-10-15',
    category: 'web'
  },
  {
    id: '3',
    title: 'AI小説リーダー',
    description: 'AIが作成した小説を読むことができるリーダーアプリ。様々なジャンルのAI生成小説を快適に閲覧。',
    longDescription: 'AIによって生成された小説作品を読むためのリーダーアプリケーションです。SF、ファンタジー、ミステリーなど様々なジャンルのAI小説を収録し、快適な読書体験を提供します。AIならではの独創的な物語や、人間では思いつかないような展開を楽しむことができます。',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://ai-shosetsu-miroku-9xqi-git-main-sassan0808-gmailcoms-projects.vercel.app',
    featured: true,
    createdAt: '2024-11-20',
    category: 'web'
  }
]