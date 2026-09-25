import logo from '../assets/logo.jpg'
import { business, callLink, waLink } from '../config.js'
import Icon from './Icon.jsx'

export default function Footer({ navigate }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <img src={logo} alt="Unique Online Services" className="footer-logo" />
          <p className="footer-tag">{business.tagline}</p>
          <p className="footer-sub">{business.subtitle}</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <button onClick={() => navigate('home')}>Home</button>
          <button onClick={() => navigate('services')}>All Services</button>
          <button onClick={() => navigate('schemes')}>Government Schemes</button>
          <button onClick={() => navigate('portals')}>Official Portals</button>
          <button onClick={() => navigate('track')}>Track Application</button>
          <button onClick={() => navigate('request')}>Request Service</button>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <a href={callLink}><Icon name="phone" size={15} /> {business.phoneDisplay}</a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={15} /> WhatsApp</a>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer"><Icon name="location" size={15} /> {business.address}</a>
          <span><Icon name="clock" size={15} /> {business.timing}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} {business.name}. All rights reserved.</p>
        <a href="#admin" className="footer-admin-link">Owner Login</a>
      </div>
    </footer>
  )
}
