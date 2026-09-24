import SectionHead from '../components/SectionHead.jsx'
import { business, callLink, waLink } from '../config.js'
import Icon from '../components/Icon.jsx'

export default function Contact({ navigate }) {
  return (
    <section className="page contact-page">
      <div className="container">
        <SectionHead tag="Get In Touch" title="Visit or Contact Us" subtitle="We are happy to help you with any service." />

        <div className="contact-grid">
          <a href={callLink} className="contact-card">
            <div className="icon"><Icon name="phone" size={24} /></div>
            <h3>Call Us</h3>
            <p>{business.phoneDisplay}</p>
          </a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="icon"><Icon name="whatsapp" size={24} /></div>
            <h3>WhatsApp</h3>
            <p>{business.phoneDisplay}</p>
          </a>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-card">
            <div className="icon"><Icon name="location" size={24} /></div>
            <h3>Our Shop</h3>
            <p>{business.address}</p>
          </a>
          <div className="contact-card">
            <div className="icon"><Icon name="clock" size={24} /></div>
            <h3>Timing</h3>
            <p>{business.timing}</p>
          </div>
        </div>

        <div className="contact-cta card">
          <h3>Need an online service done?</h3>
          <p className="muted">Send us your request online and skip the queue.</p>
          <div className="cta-btns">
            <button className="btn btn-primary" onClick={() => navigate('request')}>Request a Service</button>
            <a href={waLink()} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={17} /> Chat on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  )
}
