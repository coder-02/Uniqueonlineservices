import { useState, useMemo } from 'react'
import { findServices, formatFee } from '../data/services.js'
import { waLink } from '../config.js'
import { useLang } from '../context/LanguageContext.jsx'
import Icon, { iconKeyForService } from './Icon.jsx'
import { Sparkles, X } from 'lucide-react'

// Smart, AI-style finder: type in your own words, get the best-matching services.
export default function ServiceFinder({ navigate }) {
  const [query, setQuery] = useState('')
  const { t } = useLang()

  const matches = useMemo(() => findServices(query).slice(0, 4), [query])

  return (
    <div className="finder-card">
      <div className="finder-row">
        <span className="finder-emoji"><Sparkles size={20} /></span>
        <input
          type="text"
          placeholder={t('finder_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Find a service"
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')} aria-label="Clear"><X size={18} /></button>
        )}
      </div>

      {query.trim() && (
        <div className="finder-results">
          {matches.length > 0 ? (
            matches.map((s) => (
              <div className="finder-result" key={s.name}>
                <span className="fr-icon"><Icon name={iconKeyForService(s.name)} size={20} /></span>
                <div className="fr-info">
                  <b>{s.name}</b>
                  <span className="fr-cat">{s.category} &middot; {formatFee(s.fee)}</span>
                </div>
                <a
                  href={waLink(`Hello, I want help with ${s.name}.`)}
                  className="btn btn-whatsapp btn-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" size={16} />
                </a>
              </div>
            ))
          ) : (
            <div className="finder-empty">
              <p>Hmm, no exact match. Try words like "pan", "insurance", "certificate" — or ask us directly.</p>
              <a href={waLink(`Hello, I need help with: ${query}`)} className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={16} /> Ask on WhatsApp
              </a>
            </div>
          )}
          {matches.length > 0 && (
            <button className="finder-all link-btn" onClick={() => navigate('services')}>
              See all services {'\u2192'}
            </button>
          )}
        </div>
      )}

      {!query.trim() && <p className="finder-hint">{t('finder_hint')}</p>}
    </div>
  )
}
