import { useState, useMemo } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import { portals } from '../data/portals.js'
import { waLink } from '../config.js'
import { ExternalLink, ShieldCheck, Search, X, Info } from 'lucide-react'

export default function Portals() {
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState(null) // portal awaiting redirect confirmation

  const q = query.trim().toLowerCase()
  const list = useMemo(() => {
    if (!q) return portals
    return portals.filter((p) =>
      [p.name, p.org, p.desc, ...(p.tags || [])].join(' ').toLowerCase().includes(q)
    )
  }, [q])

  const confirmOpen = () => {
    if (pending) {
      window.open(pending.url, '_blank', 'noopener,noreferrer')
      setPending(null)
    }
  }

  return (
    <section className="page portals-page">
      <div className="container">
        <SectionHead
          tag="Official Portals Hub"
          title="Government Portals - One Place"
          subtitle="Saari official sarkari websites ek hi jagah. Direct official site par jao, aur zaroorat pade to hum help karte hai."
        />

        {/* Trust strip */}
        <div className="portal-trust">
          <ShieldCheck size={18} />
          <span>Ye <b>official government websites</b> ke direct links hai. Site official server par hi khulti hai - hum sirf easy access aur help dete hai.</span>
        </div>

        {/* Search */}
        <div className="search-row">
          <div className="page-search">
            <span className="ps-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Search portal... e.g. Aadhaar, PAN, Ayushman, e-Shram"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search portals"
            />
            {query && <button className="clear-btn" onClick={() => setQuery('')} aria-label="Clear"><X size={18} /></button>}
          </div>
        </div>

        {/* Portal cards */}
        {list.length === 0 ? (
          <div className="empty"><p>No portal found for "{query}".</p></div>
        ) : (
          <div className="grid grid-3 portal-grid">
            {list.map((p) => (
              <article className={`card portal-card accent-${p.color}`} key={p.name}>
                <div className="portal-top">
                  <span className="portal-icon"><Icon name={p.icon} size={26} /></span>
                  <span className="portal-verified"><ShieldCheck size={13} /> Official</span>
                </div>
                <h3>{p.name}</h3>
                <span className="portal-org">{p.org}</span>
                <p className="muted">{p.desc}</p>

                <div className="portal-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setPending(p)}>
                    <ExternalLink size={15} /> Open Official Site
                  </button>
                  <a
                    href={waLink(`Hello, I need help with ${p.name}.`)}
                    className="btn btn-whatsapp btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" size={15} /> Get Help
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="notice">
          <Info size={16} /> Trademarks aur portals unke respective government departments ke hai. Hum ek authorised assistance/service center hai, koi government body nahi.
        </div>
      </div>

      {/* Redirect confirmation modal */}
      {pending && (
        <div className="modal-overlay" onClick={() => setPending(null)}>
          <div className="modal redirect-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPending(null)} aria-label="Close"><X size={18} /></button>
            <div className="redirect-icon"><ExternalLink size={30} /></div>
            <h3>Opening Official Website</h3>
            <p className="muted">
              Aap <b>{pending.org}</b> ki official website par ja rahe ho:
            </p>
            <div className="redirect-url">{pending.url}</div>
            <p className="redirect-note">
              <ShieldCheck size={14} /> Ye ek official government site hai. Apni details wahin safely bharo. Koi bhi payment/OTP official site par hi karo.
            </p>
            <div className="redirect-btns">
              <button className="btn btn-outline btn-sm" onClick={() => setPending(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={confirmOpen}>
                <ExternalLink size={15} /> Continue to Official Site
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
