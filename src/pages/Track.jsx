import { useState } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import { waLink } from '../config.js'
import Icon from '../components/Icon.jsx'
import { Check, Info } from 'lucide-react'

const steps = ['Submitted', 'Document Verification', 'Processing', 'Completed']

export default function Track() {
  const [id, setId] = useState('')
  const [result, setResult] = useState(null)

  const onTrack = (e) => {
    e.preventDefault()
    const clean = id.trim()
    if (!clean) return
    // Demo tracking: derive a step from the ID so it feels real.
    // Real status will come from the admin/backend in a future phase.
    const n = clean.replace(/\D/g, '')
    const stage = n ? (parseInt(n.slice(-1), 10) % 4) : 0
    setResult({ id: clean, stage })
  }

  return (
    <section className="page track-page">
      <div className="container narrow">
        <SectionHead
          tag="Application Status"
          title="Track Your Request"
          subtitle="Enter the Request ID we gave you (e.g. UOS-2026-00125)."
        />

        <form className="track-form card" onSubmit={onTrack}>
          <label htmlFor="reqid">Request ID</label>
          <input
            id="reqid"
            type="text"
            placeholder="UOS-2026-00125"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-block">Track</button>
        </form>

        {result && (
          <div className="card track-result">
            <p className="track-id">Request ID: <b>{result.id}</b></p>
            <div className="stepper">
              {steps.map((s, i) => (
                <div key={s} className={`step ${i <= result.stage ? 'done' : ''} ${i === result.stage ? 'current' : ''}`}>
                  <span className="dot">{i <= result.stage ? <Check size={16} /> : i + 1}</span>
                  <span className="step-label">{s}</span>
                </div>
              ))}
            </div>
            <p className="muted center">
              {result.stage === 3
                ? 'Your request is completed. Please visit the shop to collect.'
                : 'Your request is in progress. We will update you soon.'}
            </p>
            <a
              href={waLink(`Hello, I want an update on my request ${result.id}.`)}
              className="btn btn-whatsapp btn-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={17} /> Ask for update on WhatsApp
            </a>
          </div>
        )}

        <p className="notice">
          <Info size={16} /> Live tracking is being set up. For now, the status is indicative - message us on WhatsApp with your Request ID for the exact status.
        </p>
      </div>
    </section>
  )
}
