import { useState, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import BottomNav from './components/BottomNav.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import PWAInstall from './components/PWAInstall.jsx'

import Home from './pages/Home.jsx'
import AllServices from './pages/AllServices.jsx'
import Schemes from './pages/Schemes.jsx'
import Track from './pages/Track.jsx'
import RequestService from './pages/RequestService.jsx'
import Contact from './pages/Contact.jsx'
import Fees from './pages/Fees.jsx'
import Portals from './pages/Portals.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const [search, setSearch] = useState('')

  const navigate = useCallback((to) => {
    setPage(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goSearch = useCallback((term) => {
    setSearch(term)
    setPage('services')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'services':
        return <AllServices navigate={navigate} initialSearch={search} />
      case 'schemes':
        return <Schemes navigate={navigate} />
      case 'track':
        return <Track navigate={navigate} />
      case 'request':
        return <RequestService navigate={navigate} />
      case 'fees':
        return <Fees navigate={navigate} />
      case 'portals':
        return <Portals navigate={navigate} />
      case 'contact':
        return <Contact navigate={navigate} />
      default:
        return <Home navigate={navigate} goSearch={goSearch} />
    }
  }

  return (
    <>
      <ScrollProgress />
      <Navbar page={page} navigate={navigate} goSearch={goSearch} />
      <main>{renderPage()}</main>
      <Footer navigate={navigate} />
      <BottomNav page={page} navigate={navigate} />
      <ChatWidget />
      <BackToTop />
      <PWAInstall />
    </>
  )
}
