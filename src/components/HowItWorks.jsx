import ScrollReveal from './ScrollReveal.jsx'
import SectionHead from './SectionHead.jsx'
import Icon from './Icon.jsx'

const steps = [
  { icon: 'phoneMobile', title: 'Choose or Ask', desc: 'Website par service chuno ya WhatsApp/chatbot par poocho.', color: 'a' },
  { icon: 'clipboard', title: 'Give Documents', desc: 'Zaroori documents lekar aao ya online bhejo.', color: 'b' },
  { icon: 'zap', title: 'We Process', desc: 'Hum aapka kaam jaldi aur sahi tarike se karte hai.', color: 'c' },
  { icon: 'check', title: 'Done!', desc: 'Aapka kaam ready - collect karo ya download le lo.', color: 'd' },
]

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="container">
        <ScrollReveal>
          <SectionHead tag="Simple Process" title="How It Works" subtitle="Sirf 4 aasaan steps me aapka kaam pura." />
        </ScrollReveal>
        <div className="how-grid">
          {steps.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 90}>
              <div className={`how-card how-${s.color}`}>
                <div className="how-num">{i + 1}</div>
                <div className="how-icon"><Icon name={s.icon} size={30} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <span className="how-arrow"><Icon name="chevron" size={22} /></span>}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
