import { useState } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import { allServices } from '../data/services.js'
import { waLink, business } from '../config.js'
import { api } from '../lib/api.js'
import Icon from '../components/Icon.jsx'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function RequestService() {
  const [form, setForm] = useState({ name: '', mobile: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const waMessage = () =>
    `New Service Request${ref ? ' ' + ref : ''}\n` +
    `Name: ${form.name}\n` +
    `Mobile: ${form.mobile}\n` +
    `Service: ${form.service}\n` +
    `Message: ${form.message || '-'}`

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Save the request to the database (goes straight to the owner's dashboard).
      const res = await api.createEnquiry({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        service: form.service,
        message: form.message.trim(),
      })
      setRef(res.ref || '')
      setSent(true)
    } catch (err) {
      // If the backend isn't available (e.g. local dev without D1), fall back to WhatsApp.
      setError(err.message || 'Could not save online. Please send via WhatsApp.')
      window.open(waLink(waMessage()), '_blank', 'noopener')
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setSent(false)
    setRef('')
    setError('')
    setForm({ name: '', mobile: '', service: '', message: '' })
  }

  const valid = form.name.trim() && /^\d{10}$/.test(form.mobile.trim()) && form.service

  return (
    <section className="page request-page">
      <div className="container narrow">
        <SectionHead
          tag="Save Your Time"
          title="Request a Service"
          subtitle="Send us your request before visiting. We'll get it ready and contact you."
        />

        {sent ? (
          <div className="card success-box">
            <div className="success-icon"><CheckCircle2 size={54} /></div>
            <h3>Your request has been received!</h3>
            {ref && (
              <p className="req-ref">Your Request ID: <b>{ref}</b><br /><span className="muted">Isse aap apna kaam track kar sakte ho.</span></p>
            )}
            <p className="muted">
              {error
                ? 'We opened WhatsApp so you can send the details directly.'
                : `Hamein aapki request mil gayi hai. Hum aapko ${form.mobile} par sampark karenge.`}
            </p>
            <div className="cta-btns">
              <a href={waLink(waMessage())} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={17} /> Also send on WhatsApp
              </a>
              <button className="btn btn-primary" onClick={reset}>Send another request</button>
            </div>
          </div>
        ) : (
          <form className="card request-form" onSubmit={onSubmit}>
            <label>Full Name *</label>
            <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" required />

            <label>Mobile Number *</label>
            <input type="tel" value={form.mobile} onChange={update('mobile')} placeholder="10-digit mobile number" pattern="[0-9]{10}" required />

            <label>Select Service *</label>
            <select value={form.service} onChange={update('service')} required>
              <option value="">-- Choose a service --</option>
              {allServices.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>

            <label>Message (optional)</label>
            <textarea rows="3" value={form.message} onChange={update('message')} placeholder="Any details you want to add" />

            <button type="submit" className="btn btn-primary btn-block" disabled={!valid || loading}>
              {loading ? (<><Loader2 size={17} className="spin" /> Sending...</>) : (<><Icon name="send" size={16} /> Submit Request</>)}
            </button>
            <p className="muted center small-note">
              Prefer calling? Dial {business.phoneDisplay}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
