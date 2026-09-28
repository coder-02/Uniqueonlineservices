import { useState, useMemo } from 'react'
import { api } from '../lib/api.js'
import { business } from '../config.js'
import { allServices, serviceCategories } from '../data/services.js'
import { X, UserPlus, Save, Send, FileText, Loader2, CheckCircle2 } from 'lucide-react'

export default function NewEnquiryModal({ onClose, onSaved }) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [fees, setFees] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const [result, setResult] = useState(null)

  // Find selected service details (documents, category)
  const selected = useMemo(() => allServices.find((s) => s.name === serviceName), [serviceName])
  const category = selected?.category || ''
  const documents = selected?.documents || []

  const valid = name.trim() && /^\d{10}$/.test(mobile.trim()) && serviceName

  // Save the enquiry to the database. When `withSms` is true, the backend also
  // sends an SMS to the customer (if an SMS gateway is configured).
  const saveEnquiry = async (withSms) => {
    try {
      const res = await api.createEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        service: serviceName,
        message: `Fees: ${fees || '-'}${notes ? ' | ' + notes : ''}`,
        autoSend: withSms,
        details: {
          category,
          documents,
          fees: fees.trim(),
          notes: notes.trim(),
          operatorName: business.operatorName,
        },
      })
      return { ref: res.ref || '', sent: !!res.smsSent }
    } catch {
      return { ref: '', sent: false } // DB not available (e.g. local dev)
    }
  }

  const onSaveOnly = async () => {
    if (!valid) { setErr('Naam, 10-digit mobile aur service zaroori hai.'); return }
    setErr(''); setSaving(true)
    await saveEnquiry(false)
    setSaving(false)
    setResult({ savedOnly: true })
    setDone(true)
    onSaved && onSaved()
  }

  const onSendAndSave = async () => {
    if (!valid) { setErr('Naam, 10-digit mobile aur service zaroori hai.'); return }
    setErr(''); setSaving(true)
    const r = await saveEnquiry(true)
    setSaving(false)
    onSaved && onSaved()
    setResult({ sent: r.sent })
    setDone(true)
  }

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal enquiry-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon"><CheckCircle2 size={50} /></div>
          <h3 className="center">Enquiry Saved!</h3>
          {result?.savedOnly ? (
            <p className="muted center">Enquiry dashboard ki list me save ho gayi.</p>
          ) : result?.sent ? (
            <p className="muted center">Customer ko SMS bhej diya gaya aur enquiry list me save ho gayi.</p>
          ) : (
            <p className="muted center">Enquiry save ho gayi. SMS gateway abhi set nahi hai isliye SMS nahi gaya. (Cloudflare me SMS_PROVIDER + SMS_API_KEY set karo.)</p>
          )}
          <button className="btn btn-primary btn-sm" onClick={onClose} style={{ marginTop: 12 }}>Done</button>
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
            <p className="muted">Customer details bharo aur service chuno - documents & fees ke saath SMS bhejo.</p>
          </div>
        </div>

        <div className="enquiry-grid">
          <div className="ef">
            <label>Customer Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Raju" />
          </div>
          <div className="ef">
            <label>Mobile Number *</label>
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

        {/* Fees manual (optional) */}
        {selected && (
          <div className="ef">
            <label>Service Fees ({'\u20B9'}) - optional</label>
            <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder={`e.g. ${selected.fee || 100} (khaali chhod sakte ho)`} />
            <span className="ef-hint">Fees manually type karo. Khaali chhodoge to "Shop par confirm hoga" likha jayega.</span>
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
            {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />} Save Only
          </button>
          <button className="btn btn-primary btn-sm" onClick={onSendAndSave} disabled={saving}>
            {saving ? <Loader2 size={15} className="spin" /> : <Send size={15} />} Send SMS &amp; Save
          </button>
        </div>
      </div>
    </div>
  )
}
