import { useState } from 'react'
import logo from '../assets/logo.jpg'
import { useTheme } from '../context/ThemeContext.jsx'
import { useLang } from '../context/LanguageContext.jsx'
import { languages } from '../data/translations.js'
import Icon from './Icon.jsx'

export default function Navbar({ page, navigate, goSearch }) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const { theme, toggle } = useTheme()
  const { lang, changeLang, t } = useLang()

  const links = [
    { id: 'home', label: t('nav_home') },
    { id: 'services', label: t('nav_services') },
    { id: 'schemes', label: t('nav_schemes') },
    { id: 'portals', label: 'Portals' },
    { id: 'track', label: t('nav_track') },
    { id: 'contact', label: t('nav_contact') },
  ]

  const go = (id) => {
    navigate(id)
    setOpen(false)
  }

  const submitSearch = (e) => {
    e.preventDefault()
    if (term.trim()) {
      goSearch(term.trim())
      setTerm('')
      setOpen(false)
    }
  }

  return (
    <header className="header" id="top">
      <div className="container nav">
        <button className="brand" onClick={() => go('home')} aria-label="Home">
          <img src={logo} alt="Unique Online Services logo" className="brand-logo" />
        </button>

        <form className="nav-search" onSubmit={submitSearch}>
          <span className="nav-search-icon"><Icon name="search" size={18} /></span>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search services"
          />
        </form>

        <div className="nav-tools">
          {/* Language switcher */}
          <div className="lang-switch">
            {languages.map((l) => (
              <button
                key={l.code}
                className={`lang-btn ${lang === l.code ? 'active' : ''}`}
                onClick={() => changeLang(l.code)}
                title={l.name}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === 'dark' ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
          </button>
        </div>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <button
              key={l.id}
              className={`nav-link ${page === l.id ? 'active' : ''}`}
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button className="btn btn-accent nav-cta" onClick={() => go('request')}>
            {t('nav_request')}
          </button>
        </nav>

        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <Icon name="close" size={24} /> : <Icon name="menu" size={24} />}
        </button>
      </div>
    </header>
  )
}
