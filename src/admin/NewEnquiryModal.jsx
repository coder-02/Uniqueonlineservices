import { useState, useMemo } from 'react'
import { api } from '../lib/api.js'
import { business } from '../config.js'
import { allServices, serviceCategories } from '../data/services.js'
import { X, UserPlus, Save, MessageCircle, FileText, Loader2, CheckCircle2 } from 'lucide-react'

// Build a professional, government-style WhatsApp message.
function buildMessage({ name, service, category, documents, fees, notes, ref }) {
  const line = '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501'
  const docLines = (documents || []).map((d, i) => `${i + 1}. ${d}`).join('\n')
  return (
`*${business.name.toUpperCase()}*
_${business.tagline}_
${line}

Namaste *${name}* ji,

Aapki service enquiry ke liye dhanyawaad. Neeche aapki service ki poori jaankari hai:

*SERVICE:* ${service}${category ? ` (${category})` : ''}
${ref ? `*ENQUIRY ID:* ${ref}\n` : ''}
*ZAROORI DOCUMENTS:*
${docLines || 'Koi special document nahi.'}

*SERVICE CHARGE:* ${fees ? '\u20B9' + fees + ' /-' : 'Shop par confirm hoga'}
${notes ? `\n*NOTE:* ${notes}\n` : ''}
${line}
Kripya upar diye documents lekar hamari shop par aayein:

\u{1F4CD} ${business.address}
\u{1F551} ${business.timing}
\u{1F4DE} ${business.phoneDisplay}

Dhanyawaad,
*${business.name}*`
  )
}

export default function NewEnquiryModal({ onClose, onSaved }) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [fees, setFees] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  // Find selected service details (documents, category)
  const selected = useMemo(() => allServices.find((s) => s.name === serviceName), [serviceName])
  const category = selected?.category || ''
  const documents = selected?.documents || []

  const valid = name.trim() && /^\d{10}$/.test(mobile.trim()) && serviceName

  const waNumber = `91${mobile.trim()}`

  const buildWa = (ref) =>
    `https://wa.me/${waNumber}?text=` +
    encodeURIComponent(buildMessage({ name: name.trim(), service: serviceName, category, documents, fees: fees.trim(), notes: notes.trim(), ref }))

  // Save to DB (best-effort) and return ref
  const saveEnquiry = async () => {
    try {
      const res = await api.createEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        service: serviceName,
        message: `Fees: ${fees || '-'}${notes ? ' | ' + notes : ''}`,
      })
      return res.ref || ''
    } catch {
      return '' // if DB not available, still allow WhatsApp
    }
  }

  const onSaveOnly = async () => {
    if (!valid) { setErr('Naam, 10-digit mobile aur service zaroori hai.'); return }
    setErr(''); setSaving(true)
    await saveEnquiry()
    setSaving(false)
    setDone(true)
    onSaved && onSaved()
  }

  const onSendAndSave = async () => {
    if (!valid) { setErr('Naam, 10-digit mobile aur service zaroori hai.'); return }
    setErr(''); setSaving(true)
    const ref = await saveEnquiry()
    setSaving(false)
    onSaved && onSaved()
    // Open WhatsApp with the professional message
    window.open(buildWa(ref), '_blank', 'noopener')
    setDone(true)
  }

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal enquiry-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon"><CheckCircle2 size={50} /></div>
          <h3 className="center">Enquiry Saved!</h3>
          <p className="muted center">Customer ki enquiry save ho gayi. Agar WhatsApp khula ho to bas "Send" dabana hai.</p>
          <button className="btn btn-primary btn-block" onClick={onClose}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal enquiry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>

        <div className="enquiry-head">
          <UserPlus size={22} />
          <div>
            <h3>New Customer Enquiry</h3>
            <p className="muted">Customer details bharo aur service chuno - documents & fees ke saath WhatsApp par bhejo.</p>
          </div>
        </div>

        <div className="enquiry-grid">
          <div className="ef">
            <label>Customer Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Raju" />
          </div>
          <div className="ef">
            <label>WhatsApp Number *</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit number" maxLength={10} />
          </div>
        </div>

        <div className="ef">
          <label>Select Service *</label>
          <select value={serviceName} onChange={(e) => setServiceName(e.target.value)}>
            <option value="">-- Select Service --</option>
            {serviceCategories.map((cat) => (
              <optgroup key={cat.id} label={cat.title}>
                {cat.services.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Auto documents */}
        {selected && documents.length > 0 && (
          <div className="ef">
            <label>Required Documents</label>
            <ul className="enq-docs">
              {documents.map((d) => (
                <li key={d}><FileText size={15} /> {d} <span className="req-tag">Required</span></li>
              ))}
            </ul>
          </div>
        )}

        {/* Fees manual */}
        {selected && (
          <div className="ef">
            <label>Service Fees (\u20B9)</label>
            <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder={`e.g. ${selected.fee || 100}`} />
            <span className="ef-hint">Fees manually type karo - jitna aap charge karoge.</span>
          </div>
        )}

        <div className="ef">
          <label>Enquiry Notes (optional)</label>
          <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Koi extra baat customer ko batani ho" />
        </div>

        {err && <p className="admin-error">{err}</p>}

        <div className="enquiry-actions">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-ghost btn-sm" onClick={onSaveOnly} disabled={saving}>
            {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />} Save Enquiry
          </button>
          <button className="btn btn-whatsapp btn-sm" onClick={onSendAndSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="spin" /> : <MessageCircle size={15} />} Send &amp; Save
          </button>
        </div>
      </div>
    </div>
  )
}
