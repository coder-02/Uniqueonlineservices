import { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'
import { api } from '../lib/api.js'
import AdminLogin from './AdminLogin.jsx'
import NewEnquiryModal from './NewEnquiryModal.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewBill from './pages/NewBill.jsx'
import Enquiries from './pages/Enquiries.jsx'
import Customers from './pages/Customers.jsx'
import WorkManager from './pages/WorkManager.jsx'
import Expenses from './pages/Expenses.jsx'
import Reports from './pages/Reports.jsx'
import {
  LayoutDashboard, ReceiptText, ListChecks, Users, Briefcase,
  Wallet, BarChart3, LogOut, Menu, X, Globe, Loader2, UserPlus,
} from 'lucide-react'

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'newbill', label: 'New Bill (POS)', icon: ReceiptText },
  { id: 'enquiries', label: 'Enquiry List', icon: ListChecks },
  { id: 'work', label: 'Work Manager', icon: Briefcase },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'expenses', label: 'Expenses & Finance', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
]

export default function AdminApp({ exitAdmin }) {
  const [authed, setAuthed] = useState(null) // null = checking
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    api
      .checkAuth()
      .then((r) => setAuthed(!!r.authed))
      .catch(() => setAuthed(false))
  }, [])

  const logout = async () => {
    try {
      await api.logout()
    } catch {
      /* ignore */
    }
    setAuthed(false)
  }

  if (authed === null) {
    return (
      <div className="admin-loading">
        <Loader2 size={32} className="spin" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} onExit={exitAdmin} />
  }

  const go = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  const openEnquiry = () => setShowEnquiry(true)

  const renderPage = () => {
    switch (page) {
      case 'newbill': return <NewBill />
      case 'enquiries': return <Enquiries key={refreshKey} />
      case 'work': return <WorkManager />
      case 'customers': return <Customers />
      case 'expenses': return <Expenses />
      case 'reports': return <Reports />
      default: return <Dashboard key={refreshKey} go={go} openEnquiry={openEnquiry} />
    }
  }

  const activeLabel = MENU.find((m) => m.id === page)?.label || 'Dashboard'

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <img src={logo} alt="UOS" />
          <div>
            <b>Unique Online</b>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="admin-menu">
          {MENU.map((m) => {
            const I = m.icon
            return (
              <button key={m.id} className={`admin-menu-item ${page === m.id ? 'active' : ''}`} onClick={() => go(m.id)}>
                <I size={18} /> <span>{m.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="admin-menu-bottom">
          <button className="admin-menu-item" onClick={exitAdmin}>
            <Globe size={18} /> <span>View Website</span>
          </button>
          <button className="admin-menu-item danger" onClick={logout}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
          <h1>{activeLabel}</h1>
          <div className="admin-topbar-right">
            <button className="btn btn-primary btn-sm new-enquiry-btn" onClick={openEnquiry}>
              <UserPlus size={16} /> <span>New Enquiry</span>
            </button>
            <span className="admin-badge-live">Live</span>
          </div>
        </header>
        <div className="admin-content">{renderPage()}</div>
      </div>

      {showEnquiry && (
        <NewEnquiryModal
          onClose={() => setShowEnquiry(false)}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  )
}
