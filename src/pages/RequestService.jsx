import { useState } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import { allServices } from '../data/services.js'
import { waLink, business } from '../config.js'
import Icon from '../components/Icon.jsx'
import { CheckCircle2 } from 'lucide-react'

export default function RequestService() {
  const [form, setForm] = useState({ name: '', mobile: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    // Build a WhatsApp message from the form and open the chat.
    // In a future phase this can POST to a backend / admin dashboard.
    const msg =
      `New Service Request\n` +
      `Name: ${form.name}\n` +
      `Mobile: ${form.mobile}\n` +
      `Service: ${form.service}\n` +
      `Message: ${form.message || '-'}`
    window.open(waLink(msg), '_blank', 'noopener')
    setSent(true)
  }

  const valid = form.name.trim() && form.mobile.trim() && form.service

  return (
    <section className="page request-page">
      <div className="container narrow">
        <SectionHead
          tag="Save Your Time"
          title="Request a Service"
          subtitle="Send us your request before visiting. We'll get it ready."
        />

        {sent ? (
          <div className="card success-box">
            <div className="success-icon"><CheckCircle2 size={54} /></div>
            <h3>Your request has been sent!</h3>
            <p className="muted">
              We opened WhatsApp with your details. Please press send there so we receive it.
              We will contact you on {form.mobile}.
            </p>
            <button className="btn btn-primary" onClick={() => { setSent(false); setForm({ name: '', mobile: '', service: '', message: '' }) }}>
              Send another request
            </button>
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

            <button type="submit" className="btn btn-whatsapp btn-block" disabled={!valid}>
              <Icon name="whatsapp" size={17} /> Submit via WhatsApp
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
