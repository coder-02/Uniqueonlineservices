import logo from '../assets/logo.jpg'
import SectionHead from '../components/SectionHead.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import ServiceFinder from '../components/ServiceFinder.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import EligibilityChecker from '../components/EligibilityChecker.jsx'
import NewSchemeBanner from '../components/NewSchemeBanner.jsx'
import TrustBand from '../components/TrustBand.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import FAQ from '../components/FAQ.jsx'
import Icon from '../components/Icon.jsx'
import { business, waLink, callLink } from '../config.js'
import { popularServices } from '../data/services.js'
import { schemes, latestUpdates } from '../data/schemes.js'
import { reviews } from '../data/reviews.js'
import { useLang } from '../context/LanguageContext.jsx'

export default function Home({ navigate }) {
  const { t } = useLang()
  const openSchemes = schemes.filter((s) => s.status === 'open').slice(0, 3)

  return (
    <>
      {/* Auto banner for new schemes */}
      <NewSchemeBanner navigate={navigate} />

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="hero-orb o1" />
        <div className="hero-orb o2" />
        <div className="hero-orb o3" />
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="tag">{t('hero_badge')}</span>
            <h1>{t('hero_tagline')}</h1>
            <p>{t('hero_desc')}</p>
            <div className="hero-btns">
              <button className="btn btn-accent" onClick={() => navigate('services')}>{t('explore_services')} <Icon name="chevron" size={17} /></button>
              <a href={waLink()} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={17} /> {t('whatsapp_us')}</a>
              <a href={callLink} className="btn btn-outline-light"><Icon name="phone" size={16} /> {t('call_now')}</a>
            </div>
            <div className="hero-stats">
              <div><AnimatedCounter end={25} suffix="+" /><span>{t('stat_services')}</span></div>
              <div><AnimatedCounter end={5000} suffix="+" /><span>{t('stat_customers')}</span></div>
              <div><b>{t('stat_fast')}</b><span>{t('stat_processing')}</span></div>
            </div>
          </div>
          <div className="hero-card glass">
            <img src={logo} alt="Unique Online Services" className="hero-logo" />
            <h3>{business.name}</h3>
            <p className="muted">{business.subtitle}</p>
            <button className="btn btn-primary btn-block" onClick={() => navigate('request')}>{t('request_a_service')}</button>
            <button className="btn btn-ghost btn-block" onClick={() => navigate('fees')}><Icon name="wallet" size={16} /> {t('fee_title')}</button>
          </div>
        </div>
      </section>

      {/* Smart Service Finder */}
      <section className="finder-wrap">
        <div className="container">
          <ServiceFinder navigate={navigate} />
        </div>
      </section>

      {/* Latest Updates ticker */}
      <section className="updates-bar">
        <div className="container updates-inner">
          <span className="updates-label"><Icon name="bell" size={16} /> {t('latest_updates')}</span>
          <div className="ticker">
            <div className="ticker-track">
              {[...latestUpdates, ...latestUpdates].map((u, i) => (
                <span className="ticker-item" key={i}>
                  {u.isNew && <b className="new-badge">NEW</b>} {u.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust band (NEW) */}
      <TrustBand />

      {/* Popular Services */}
      <section className="services">
        <div className="container">
          <ScrollReveal><SectionHead tag={t('what_we_offer')} title={t('popular_services')} subtitle={t('popular_sub')} /></ScrollReveal>
          <div className="grid">
            {popularServices.map((s, i) => (
              <ScrollReveal key={s.name} delay={i * 60}>
                <ServiceCard service={s} />
              </ScrollReveal>
            ))}
          </div>
          <div className="center-cta">
            <button className="btn btn-primary" onClick={() => navigate('services')}>{t('view_all_services')}</button>
          </div>
        </div>
      </section>

      {/* Service Categories (NEW) */}
      <CategoryGrid navigate={navigate} />

      {/* Official Portals promo (NEW) */}
      <section className="portals-promo-section">
        <div className="container">
          <ScrollReveal>
            <div className="portals-promo">
              <div className="pp-left">
                <span className="tag">Official Portals Hub</span>
                <h2>All Government Portals, One Click Away</h2>
                <p>Aadhaar, PAN, Ayushman, e-Shram, PM Kisan aur Maharashtra Govt - saari official websites ek hi jagah. Direct official site kholo, aur help chahiye to hum hai.</p>
                <button className="btn btn-accent" onClick={() => navigate('portals')}>Open Portals Hub <Icon name="chevron" size={17} /></button>
              </div>
              <div className="pp-logos">
                <span><Icon name="aadhaar" size={22} /> Aadhaar</span>
                <span><Icon name="pan" size={22} /> PAN</span>
                <span><Icon name="insurance" size={22} /> Ayushman</span>
                <span><Icon name="job" size={22} /> e-Shram</span>
                <span><Icon name="government" size={22} /> Maharashtra</span>
                <span><Icon name="certificate" size={22} /> PM Kisan</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works (NEW) */}
      <HowItWorks />

      {/* Government Schemes preview */}
      <section className="schemes-preview">
        <div className="container">
          <ScrollReveal><SectionHead tag={t('govt_assistance')} title={t('latest_schemes')} subtitle={t('schemes_sub')} /></ScrollReveal>
          <div className="grid grid-3">
            {openSchemes.map((sc, i) => (
              <ScrollReveal key={sc.id} delay={i * 80}>
                <div className="card scheme-card">
                  <div className="scheme-top">
                    <span className={`status-pill status-${sc.status}`}>
                      {sc.status === 'open' ? 'Open' : sc.status === 'coming' ? 'Coming Soon' : 'Closed'}
                    </span>
                    {sc.isNew && <span className="new-badge">NEW</span>}
                  </div>
                  <h3>{sc.name}</h3>
                  <p className="muted">{sc.department}</p>
                  <p className="benefit"><Icon name="award" size={15} /> {sc.benefit}</p>
                  <button className="btn btn-outline btn-block" onClick={() => navigate('schemes')}>{t('view_details')}</button>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="center-cta">
            <button className="btn btn-accent" onClick={() => navigate('schemes')}>{t('see_all_schemes')}</button>
          </div>
        </div>
      </section>

      {/* Eligibility Checker - unique feature */}
      <section className="elig-section">
        <div className="container narrow">
          <ScrollReveal>
            <SectionHead tag="Smart Tool" title="Am I Eligible?" subtitle="Ek minute me pata karo aapke liye kaunsi sarkari yojana hai." />
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <EligibilityChecker />
          </ScrollReveal>
        </div>
      </section>

      {/* Track preview */}
      <section className="track-preview">
        <div className="container">
          <ScrollReveal>
            <div className="track-box">
              <div>
                <h2><Icon name="clipboard" size={22} /> {t('track_title')}</h2>
                <p>{t('track_sub')}</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('track')}>{t('track_now')}</button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why choose us */}
      <section className="about">
        <div className="container about-inner">
          <ScrollReveal className="about-text">
            <span className="tag">About Us</span>
            <h2>Your Neighbourhood Digital Service Point</h2>
            <p>Unique Online Services is a one-stop shop for all your online and government service needs. We make digital services simple, quick and affordable for everyone in our community.</p>
            <ul className="checklist">
              <li>Fast and accurate service</li>
              <li>Honest, transparent pricing</li>
              <li>Support in Hindi / Marathi / English</li>
              <li>Your data kept safe &amp; private</li>
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="about-box glass-dark">
              <h3>{t('why_choose')}</h3>
              <div className="why">
                <div><span className="why-ic"><Icon name="zap" size={18} /></span> Quick turnaround on every request</div>
                <div><span className="why-ic"><Icon name="handshake" size={18} /></span> Trusted by thousands of customers</div>
                <div><span className="why-ic"><Icon name="rupee" size={18} /></span> Best price in the area</div>
                <div><span className="why-ic"><Icon name="phoneMobile" size={18} /></span> Support on call &amp; WhatsApp</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews">
        <div className="container">
          <ScrollReveal><SectionHead tag={t('testimonials')} title={t('what_customers')} /></ScrollReveal>
          <div className="grid grid-4">
            {reviews.map((r, i) => (
              <ScrollReveal key={r.name} delay={i * 60}>
                <div className="card review-card">
                  <div className="stars">{'\u2B50'.repeat(r.stars)}</div>
                  <p>"{r.text}"</p>
                  <b>- {r.name}</b>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (NEW) */}
      <FAQ />

      {/* Location */}
      <section className="location">
        <div className="container">
          <ScrollReveal>
            <div className="location-box glass">
              <div>
                <span className="tag">{t('visit_us')}</span>
                <h2>{business.name}</h2>
                <p className="loc-line"><Icon name="location" size={16} /> {business.address}</p>
                <p className="loc-line"><Icon name="clock" size={16} /> {business.timing}</p>
                <p className="loc-line"><Icon name="phone" size={16} /> {business.phoneDisplay}</p>
              </div>
              <a href={business.mapsUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">{t('get_directions')}</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
