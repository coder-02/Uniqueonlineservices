import ScrollReveal from './ScrollReveal.jsx'
import SectionHead from './SectionHead.jsx'
import { serviceCategories } from '../data/services.js'
import Icon, { categoryIconKey } from './Icon.jsx'

export default function CategoryGrid({ navigate }) {
  return (
    <section className="cat-section">
      <div className="container">
        <ScrollReveal>
          <SectionHead tag="Explore" title="Service Categories" subtitle="Apni zaroorat ke hisaab se category chuno." />
        </ScrollReveal>
        <div className="cat-grid">
          {serviceCategories.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 60}>
              <button className="cat-tile" onClick={() => navigate('services')}>
                <span className="cat-tile-icon"><Icon name={categoryIconKey[c.id] || 'certificate'} size={26} /></span>
                <b>{c.title}</b>
                <span className="cat-tile-count">{c.services.length} services</span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
