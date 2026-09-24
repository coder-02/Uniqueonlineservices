import { useState } from 'react'
import ScrollReveal from './ScrollReveal.jsx'
import SectionHead from './SectionHead.jsx'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  { q: 'PAN card banane me kitna time lagta hai?', a: 'e-PAN 1-2 din me mil jata hai aur physical card 10-15 din me ghar aa jata hai.' },
  { q: 'Kya main documents WhatsApp par bhej sakta hu?', a: 'Haan! Aap documents ki photo WhatsApp par bhej sakte ho, ya dukan par lekar aa sakte ho.' },
  { q: 'Charges kaise pata karu?', a: 'Har service card par approx charge diya hai. Aap "Fee Estimator" tool se bhi check kar sakte ho.' },
  { q: 'Kaunsi sarkari yojana mujhe milegi?', a: 'Homepage par "Am I Eligible?" tool bharo ya chatbot se poocho - hum bata denge.' },
  { q: 'Dukan kab khulti hai?', a: 'Hum Monday se Sunday, subah 9 baje se raat 9 baje tak khule rehte hai.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="faq-section">
      <div className="container narrow">
        <ScrollReveal>
          <SectionHead tag="Help" title="Frequently Asked Questions" subtitle="Aapke common sawaalon ke jawab." />
        </ScrollReveal>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <div className={`faq-item ${open === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-toggle">{open === i ? <Minus size={18} /> : <Plus size={18} />}</span>
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
