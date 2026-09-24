import AnimatedCounter from './AnimatedCounter.jsx'
import Icon from './Icon.jsx'

const trust = [
  { icon: 'users', end: 5000, suffix: '+', label: 'Happy Customers' },
  { icon: 'clipboard', end: 25, suffix: '+', label: 'Services Offered' },
  { icon: 'scheme', end: 15, suffix: '+', label: 'Govt Schemes' },
  { icon: 'award', end: 100, suffix: '%', label: 'Trusted Service' },
]

export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="container trust-grid">
        {trust.map((t) => (
          <div className="trust-item" key={t.label}>
            <span className="trust-icon"><Icon name={t.icon} size={30} /></span>
            <div className="trust-num"><AnimatedCounter end={t.end} suffix={t.suffix} /></div>
            <span className="trust-label">{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
