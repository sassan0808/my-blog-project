export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  image?: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  category: 'web' | 'mobile' | 'slide' | 'other'
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other'
  level: 1 | 2 | 3 | 4 | 5
  icon?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  technologies: string[]
  current: boolean
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar?: string
  location?: string
  email?: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  skills: Skill[]
  experiences: Experience[]
}