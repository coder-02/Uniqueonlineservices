import { useState, useMemo } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { serviceCategories, allServices } from '../data/services.js'
import { Search, X } from 'lucide-react'
import Icon, { categoryIconKey } from '../components/Icon.jsx'

export default function AllServices({ initialSearch = '' }) {
  const [query, setQuery] = useState(initialSearch)
  const [activeCat, setActiveCat] = useState('all')

  const q = query.trim().toLowerCase()

  // When searching, match across name, desc, items and category
  const searchResults = useMemo(() => {
    if (!q) return null
    return allServices.filter((s) => {
      const hay = [s.name, s.desc, s.category, ...(s.items || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [q])

  const visibleCategories =
    activeCat === 'all' ? serviceCategories : serviceCategories.filter((c) => c.id === activeCat)

  return (
    <section className="page services">
      <div className="container">
        <SectionHead tag="All Services" title="Our Complete Services" subtitle="Everything you need, in one place." />

        {/* Search */}
        <div className="search-row">
          <div className="page-search">
            <span className="ps-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Search services... e.g. PAN, insurance, certificate"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery('')} aria-label="Clear"><X size={18} /></button>
            )}
          </div>
        </div>

        {/* Category filter (hidden while searching) */}
        {!q && (
          <div className="cat-filter">
            <button className={`chip-btn ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>
              All
            </button>
            {serviceCategories.map((c) => (
              <button
                key={c.id}
                className={`chip-btn ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                <Icon name={categoryIconKey[c.id] || 'certificate'} size={15} /> {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {q ? (
          searchResults.length > 0 ? (
            <>
              <p className="result-count">{searchResults.length} result(s) for "{query}"</p>
              <div className="grid">
                {searchResults.map((s) => (
                  <ServiceCard key={s.name} service={s} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <p>No service found for "{query}".</p>
              <p className="muted">Try a different word, or contact us on WhatsApp - we may still help.</p>
            </div>
          )
        ) : (
          visibleCategories.map((cat) => (
            <div className="cat-block" key={cat.id}>
              <h2 className="cat-title"><Icon name={categoryIconKey[cat.id] || 'certificate'} size={20} /> {cat.title}</h2>
              <div className="grid">
                {cat.services.map((s) => (
                  <ServiceCard key={s.name} service={{ ...s, category: cat.title }} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
