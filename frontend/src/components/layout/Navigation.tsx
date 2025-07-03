import { Link, useLocation } from 'react-router-dom'
import DarkModeToggle from '../DarkModeToggle'

const navigation = [
  { name: 'ホーム', href: '/' },
  { name: 'ブログ', href: '/blog' },
  { name: 'ポートフォリオ', href: '/portfolio' },
  { name: 'プロフィール', href: '/profile' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/blog' && location.pathname.startsWith('/blog'))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {/* モバイルメニューボタン */}
            <div className="md:hidden">
              <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}