import type { Project } from '../types/portfolio'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Sanity連携ブログサイト',
    description: 'React + TypeScript + Sanity で構築したモダンなブログプラットフォーム',
    longDescription: 'ヘッドレスCMSのSanityと連携し、管理画面から記事を投稿できるブログサイト。ダークモード対応、SEO最適化、レスポンシブデザインを実装。',
    technologies: ['React', 'TypeScript', 'Sanity', 'TailwindCSS', 'Vite'],
    featured: true,
    createdAt: '2025-01-01',
    category: 'web'
  },
  {
    id: '2', 
    title: 'ポートフォリオサイト',
    description: 'モダンなデザインシステムを採用したパーソナルポートフォリオ',
    longDescription: '再利用可能なコンポーネント設計により、保守性と拡張性を重視したポートフォリオサイト。',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    featured: true,
    createdAt: '2025-01-02',
    category: 'web'
  },
  {
    id: '3',
    title: 'タスク管理アプリ',
    description: 'チーム向けのカンバン形式タスク管理ツール',
    longDescription: 'ドラッグ&ドロップでタスクを移動でき、リアルタイム同期機能を持つタスク管理アプリケーション。',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    featured: false,
    createdAt: '2024-12-15',
    category: 'web'
  }
]