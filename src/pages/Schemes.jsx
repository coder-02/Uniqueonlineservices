import { useState, useMemo } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import { schemes, schemeCategories } from '../data/schemes.js'
import { waLink } from '../config.js'
import Icon from '../components/Icon.jsx'
import { Info } from 'lucide-react'

function StatusPill({ status }) {
  const map = { open: 'Open', coming: 'Coming Soon', closed: 'Closed' }
  return <span className={`status-pill status-${status}`}>{map[status]}</span>
}

export default function Schemes() {
  const [cat, setCat] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(
    () => (cat === 'all' ? schemes : schemes.filter((s) => s.category === cat)),
    [cat]
  )

  return (
    <section className="page schemes-page">
      <div className="container">
        <SectionHead
          tag="Government Assistance"
          title="Government Schemes"
          subtitle="Find schemes you may be eligible for. We help you apply."
        />

        {/* Category filter */}
        <div className="cat-filter">
          <button className={`chip-btn ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>
            All Schemes
          </button>
          {schemeCategories.map((c) => (
            <button key={c} className={`chip-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <p>No schemes in this category right now.</p>
            <p className="muted">Check back soon or ask us on WhatsApp.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((sc) => {
              const open = expanded === sc.id
              const msg = `Hello Unique Online Services, I want help applying for: ${sc.name}`
              return (
                <div className="card scheme-card" key={sc.id}>
                  <div className="scheme-top">
                    <StatusPill status={sc.status} />
                    {sc.isNew && <span className="new-badge">NEW</span>}
                  </div>
                  <h3>{sc.name}</h3>
                  <p className="muted">{sc.department}</p>
                  <p className="benefit"><Icon name="award" size={15} /> {sc.benefit}</p>
                  <p className="scheme-meta"><b>For:</b> {sc.category} &middot; {sc.district}</p>

                  <button className="link-btn" onClick={() => setExpanded(open ? null : sc.id)}>
                    {open ? 'Hide details' : 'View details'}
                  </button>

                  {open && (
                    <div className="scheme-details">
                      <p><b>Eligibility:</b> {sc.eligibility}</p>
                      {sc.lastDate && <p><b>Last Date:</b> {sc.lastDate}</p>}
                      <p><b>Documents needed:</b></p>
                      <ul className="checklist small">
                        {sc.documents.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                      {sc.officialUrl && (
                        <a href={sc.officialUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
                          Official Source {'\u2197'}
                        </a>
                      )}
                    </div>
                  )}

                  <a href={waLink(msg)} className="btn btn-whatsapp btn-block" target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" size={16} /> Apply / Get Assistance
                  </a>
                </div>
              )
            })}
          </div>
        )}

        <div className="notice">
          <Info size={16} /> Scheme details are for guidance only. Always verify eligibility and dates from the official government source before applying.
        </div>
      </div>
    </section>
  )
}
