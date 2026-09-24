import Icon from './Icon.jsx'

const items = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'schemes', label: 'Schemes', icon: 'scheme' },
  { id: 'track', label: 'Track', icon: 'clipboard' },
  { id: 'contact', label: 'Contact', icon: 'phoneCall' },
]

export default function BottomNav({ page, navigate }) {
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`bottom-nav-item ${page === it.id ? 'active' : ''}`}
          onClick={() => navigate(it.id)}
        >
          <span className="bn-icon"><Icon name={it.icon} size={20} /></span>
          <span className="bn-label">{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
