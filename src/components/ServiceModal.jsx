import { useEffect } from 'react'
import { waLink } from '../config.js'
import { formatFee } from '../data/services.js'
import Icon, { iconKeyForService } from './Icon.jsx'

// Full-detail popup for a service: documents checklist + step-by-step process + fee + time.
export default function ServiceModal({ service, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!service) return null
  const msg = `Hello Unique Online Services, I want to apply for ${service.name}.`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>

        <div className="modal-head">
          <div className="modal-icon"><Icon name={iconKeyForService(service.name)} size={28} /></div>
          <div>
            <h3>{service.name}</h3>
            <p className="muted">{service.desc}</p>
          </div>
        </div>

        <div className="modal-meta">
          <div className="mm-item">
            <span className="mm-label">Approx Charge</span>
            <b>{formatFee(service.fee)}</b>
          </div>
          {service.time && (
            <div className="mm-item">
              <span className="mm-label">Time</span>
              <b>{service.time}</b>
            </div>
          )}
          <div className="mm-item">
            <span className="mm-label">Category</span>
            <b>{service.category || 'Service'}</b>
          </div>
        </div>

        {service.documents?.length > 0 && (
          <div className="modal-block">
            <h4><Icon name="clipboard" size={18} /> Required Documents</h4>
            <ul className="checklist">
              {service.documents.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {service.process?.length > 0 && (
          <div className="modal-block">
            <h4><Icon name="fileCheck" size={18} /> How It Works</h4>
            <ol className="process-list">
              {service.process.map((step, i) => (
                <li key={i}><span className="ps-num">{i + 1}</span> {step}</li>
              ))}
            </ol>
          </div>
        )}

        {service.items?.length > 0 && (
          <div className="modal-block">
            <h4><Icon name="grid" size={18} /> We Handle</h4>
            <ul className="chip-list">
              {service.items.map((it) => (
                <li key={it} className="chip">{it}</li>
              ))}
            </ul>
          </div>
        )}

        <a href={waLink(msg)} className="btn btn-whatsapp btn-block" target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={18} /> Apply / Get Help on WhatsApp
        </a>
      </div>
    </div>
  )
}
