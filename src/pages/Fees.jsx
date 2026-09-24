import { useState, useMemo } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import { allServices, formatFee } from '../data/services.js'
import { waLink } from '../config.js'
import { useLang } from '../context/LanguageContext.jsx'
import Icon from '../components/Icon.jsx'
import { Info } from 'lucide-react'

export default function Fees() {
  const { t } = useLang()
  const [selected, setSelected] = useState('')
  const [copies, setCopies] = useState(1)

  const service = useMemo(() => allServices.find((s) => s.name === selected), [selected])
  const total = service ? service.fee * Math.max(1, copies) : 0

  return (
    <section className="page fees-page">
      <div className="container narrow">
        <SectionHead tag="Transparent Pricing" title={t('fee_title')} subtitle={t('fee_sub')} />

        <div className="card fee-card">
          <label>{t('select_service')}</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">-- {t('select_service')} --</option>
            {allServices.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>

          {service && (
            <>
              <label>Quantity / Applications</label>
              <div className="qty-row">
                <button type="button" className="qty-btn" onClick={() => setCopies((c) => Math.max(1, c - 1))}>-</button>
                <span className="qty-val">{copies}</span>
                <button type="button" className="qty-btn" onClick={() => setCopies((c) => c + 1)}>+</button>
              </div>

              <div className="fee-result">
                <div className="fee-line">
                  <span>{service.name}</span>
                  <span>{formatFee(service.fee)}</span>
                </div>
                <div className="fee-total">
                  <span>{t('estimated_fee')}</span>
                  <b>{service.fee === 0 ? 'As per bank' : `\u20B9${total}+`}</b>
                </div>
              </div>

              <a
                href={waLink(`Hello, I want ${service.name} (x${copies}). Approx fee ${service.fee === 0 ? 'as per bank' : '\u20B9' + total}. Please confirm.`)}
                className="btn btn-whatsapp btn-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size={17} /> Confirm on WhatsApp
              </a>
            </>
          )}
        </div>

        <p className="notice">
          <Info size={16} /> These are approximate service charges only and may include our service fee. Government/official fees may apply separately. Final amount is confirmed at the shop.
        </p>
      </div>
    </section>
  )
}
