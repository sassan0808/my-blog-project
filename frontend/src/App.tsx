import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import Portfolio from './pages/Portfolio'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import Navigation from './components/layout/Navigation'
import SEOHead from './components/SEOHead'

function App() {
  return (
    <Router>
      <SEOHead title="Portfolio | 佐々木" description="フルスタックエンジニアのポートフォリオサイト" />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
