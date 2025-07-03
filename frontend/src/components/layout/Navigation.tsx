import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DarkModeToggle from '../DarkModeToggle'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Profile', href: '/profile' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black px-4 py-2 rounded-lg">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SS
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/blog' && location.pathname.startsWith('/blog'))
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative group px-4 py-2"
                  >
                    <span className={`relative z-10 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 scale-100'
                        : 'bg-gradient-to-r from-blue-600/0 to-purple-600/0 scale-95 group-hover:scale-100 group-hover:from-blue-600/10 group-hover:to-purple-600/10'
                    }`}></div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden relative w-10 h-10 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="w-6 flex flex-col justify-center items-center">
                  <span className={`bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}></span>
                  <span className={`bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-80' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-64 bg-gray-900 transform transition-transform duration-500 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-24">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/blog' && location.pathname.startsWith('/blog'))
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}