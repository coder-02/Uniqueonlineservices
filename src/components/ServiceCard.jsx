import { useState } from 'react'
import { waLink } from '../config.js'
import { formatFee } from '../data/services.js'
import { useLang } from '../context/LanguageContext.jsx'
import ServiceModal from './ServiceModal.jsx'
import Icon, { iconKeyForService } from './Icon.jsx'

export default function ServiceCard({ service }) {
  const [showModal, setShowModal] = useState(false)
  const { t } = useLang()
  const msg = `Hello Unique Online Services, I want help with ${service.name} service.`
  const iconKey = iconKeyForService(service.name)

  return (
    <>
      <article className="card service-card">
        <div className="service-card-top">
          <span className="icon"><Icon name={iconKey} size={26} /></span>
          {typeof service.fee === 'number' && (
            <span className="fee-badge">{formatFee(service.fee)}</span>
          )}
        </div>
        <h3>{service.name}</h3>
        <p className="muted">{service.desc}</p>

        {service.items?.length > 0 && (
          <ul className="chip-list">
            {service.items.slice(0, 4).map((it) => (
              <li key={it} className="chip">{it}</li>
            ))}
          </ul>
        )}

        <button className="link-btn view-details" onClick={() => setShowModal(true)}>
          <Icon name="fileCheck" size={15} /> View documents &amp; process
        </button>

        <a href={waLink(msg)} className="btn btn-whatsapp btn-block" target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={17} /> {t('get_help_wa')}
        </a>
      </article>

      {showModal && (
        <ServiceModal service={service} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
