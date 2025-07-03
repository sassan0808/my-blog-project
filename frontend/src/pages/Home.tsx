import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataService } from '../lib/data'
import type { Project } from '../types/portfolio'
import type { Post } from '../types/post'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projects, posts] = await Promise.all([
          DataService.getFeaturedProjects(),
          DataService.getBlogPosts()
        ])
        setFeaturedProjects(projects)
        setLatestPosts(posts.slice(0, 3))
      } catch (error) {
        console.error('Error loading home data:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - ULTRA VIBE MODE */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 opacity-30 animate-gradient-xy"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-800 via-pink-600 to-orange-500 opacity-20 animate-gradient-xy animation-delay-2000"></div>
        </div>

        {/* Animated Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Particle Effect Container */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 25%)`,
          }}
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Glitch Text Effect */}
          <div className="mb-6 inline-block">
            <span className="text-sm font-mono text-neon-blue uppercase tracking-[0.2em] animate-pulse">
              Welcome to the future
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 relative">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Creative
            </span>
            <span className="block text-white mt-2">
              Developer
            </span>
            <span className="absolute -inset-1 blur-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-30 animate-pulse"></span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Building 
            <span className="text-neon-blue font-bold"> next-generation </span>
            digital experiences with 
            <span className="text-neon-purple font-bold"> cutting-edge </span>
            technology
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/portfolio">
              <Button 
                variant="gradient" 
                size="lg" 
                className="group relative overflow-hidden px-8 py-4 text-lg font-bold animate-glow"
              >
                <span className="relative z-10 flex items-center">
                  Explore My Work
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x"></div>
              </Button>
            </Link>

            <Link to="/contact">
              <Button 
                variant="ghost" 
                size="lg" 
                className="border-2 border-white/20 hover:border-white/40 backdrop-blur-sm px-8 py-4 text-lg font-bold"
              >
                Get In Touch
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
              <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects - CYBERPUNK STYLE */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pushing boundaries with every line of code
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                
                <Card 
                  hover 
                  className="relative bg-gray-900/90 backdrop-blur-xl border-gray-800 p-8 h-full transform transition-all duration-500 group-hover:scale-[1.02]"
                >
                  {/* Project Image Container */}
                  <div className="relative mb-6 overflow-hidden rounded-lg aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl font-black text-gray-800">
                          {project.title.charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-neon-blue transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 text-xs font-mono bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs font-mono text-gray-500">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-neon-blue hover:text-neon-purple transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Source Code
                      </a>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/portfolio">
              <Button variant="ghost" size="lg" className="group">
                View All Projects
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts - MINIMAL IKEHAYA STYLE */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Latest Thoughts
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ideas, experiments, and lessons learned
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <Link 
                key={post._id} 
                to={`/blog/${post.slug?.current}`}
                className="group block"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <article className="relative h-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur"></div>
                  
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full transform transition-all duration-500 group-hover:-translate-y-1">
                    <time className="text-sm text-gray-500 font-mono">
                      {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    
                    <h3 className="text-2xl font-bold mt-4 mb-4 text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center text-neon-purple font-medium">
                      Read Article
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/blog">
              <Button variant="ghost" size="lg" className="group">
                Read All Articles
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-8">
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-gradient-x">
              Let's Build Something Amazing
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Let's create something extraordinary together.
          </p>
          
          <Link to="/contact">
            <Button 
              variant="gradient" 
              size="lg" 
              className="animate-pulse-scale"
            >
              Start a Conversation
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}