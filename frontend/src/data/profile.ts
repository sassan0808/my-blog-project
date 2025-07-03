import type { Profile } from '../types/portfolio'

export const profile: Profile = {
  id: '1',
  name: '佐々木',
  title: 'フルスタック エンジニア',
  bio: 'モダンなWeb技術を活用して、ユーザー体験を重視したアプリケーションを開発しています。React、TypeScript、Node.jsを中心とした技術スタックで、フロントエンドからバックエンドまで幅広く対応可能です。',
  location: '日本',
  social: {
    github: 'https://github.com/sasaki',
    linkedin: 'https://linkedin.com/in/sasaki',
    twitter: 'https://twitter.com/sasaki'
  },
  skills: [
    {
      id: '1',
      name: 'React',
      category: 'frontend',
      level: 5
    },
    {
      id: '2', 
      name: 'TypeScript',
      category: 'frontend',
      level: 5
    },
    {
      id: '3',
      name: 'Node.js',
      category: 'backend', 
      level: 4
    },
    {
      id: '4',
      name: 'TailwindCSS',
      category: 'frontend',
      level: 4
    },
    {
      id: '5',
      name: 'PostgreSQL',
      category: 'database',
      level: 3
    },
    {
      id: '6',
      name: 'Docker',
      category: 'tools',
      level: 3
    }
  ],
  experiences: [
    {
      id: '1',
      company: 'Tech Company',
      position: 'シニア フロントエンド エンジニア',
      startDate: '2023-01',
      description: 'Reactを使用したWebアプリケーションの設計・開発・保守を担当。チームリードとして5人のチームをマネジメント。',
      technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      current: true
    },
    {
      id: '2',
      company: 'Startup Inc',
      position: 'フルスタック エンジニア',
      startDate: '2021-06',
      endDate: '2022-12',
      description: 'スタートアップでのプロダクト開発全般を担当。フロントエンドからバックエンド、インフラまで幅広く経験。',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
      current: false
    }
  ]
}