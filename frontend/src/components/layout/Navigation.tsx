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
          ? 'bg-white/95 dark:bg-brand-navy-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white/80 dark:bg-brand-navy-900/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center space-x-2"
            >
              <div className="relative">
                <span className="text-2xl font-playfair font-bold text-brand-navy-900 dark:text-white tracking-tight">
                  Sasaki
                  <span className="text-brand-gold-500">.</span>
                </span>
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
                    className="relative group px-5 py-2"
                  >
                    <span className={`relative z-10 text-sm font-montserrat font-medium transition-colors ${
                      isActive
                        ? 'text-brand-navy-900 dark:text-white'
                        : 'text-brand-slate-600 dark:text-brand-slate-300 group-hover:text-brand-navy-900 dark:group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-brand-gold-500"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DarkModeToggle />
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden relative w-10 h-10 flex items-center justify-center ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="w-6 flex flex-col justify-center items-center">
                  <span className={`bg-brand-navy-900 dark:bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}></span>
                  <span className={`bg-brand-navy-900 dark:bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`bg-brand-navy-900 dark:bg-white block h-0.5 w-full rounded-sm transition-all duration-300 ${
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
          className={`absolute inset-0 bg-brand-navy-900/80 dark:bg-black/80 transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-64 bg-white dark:bg-brand-navy-800 shadow-2xl transform transition-transform duration-500 ${
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
                    className={`block px-4 py-3 rounded-lg text-base font-montserrat font-medium transition-all ${
                      isActive
                        ? 'bg-brand-gold-500/10 text-brand-navy-900 dark:text-white border-l-3 border-brand-gold-500'
                        : 'text-brand-slate-600 dark:text-brand-slate-300 hover:bg-brand-slate-100 dark:hover:bg-brand-navy-700 hover:text-brand-navy-900 dark:hover:text-white'
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